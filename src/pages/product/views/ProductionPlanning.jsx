import { useState, useEffect, useCallback } from 'react'
import {
  Factory, Play, AlertTriangle, TrendingUp, DollarSign, Gauge,
  Boxes, Truck, Activity, Lightbulb, Loader2,
} from 'lucide-react'
import { C, FONT, f } from '../../../tokens'

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Mock fallback (matches backend PlanResult) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Used when the APS backend (FastAPI :8000) is not reachable, so the UI always renders. */
const MOCK_RESULT = {
  status: 'OPTIMAL',
  objective_value: 206895,
  kpis: {
    total_cost: 206895, cash_tie_up: 115105, peak_capacity_load_pct: 122.8,
    on_time_delivery_pct: 100.0, total_setup_min: 105, min_cash_balance: 210547,
  },
  mps: buildMockMps(),
  capacity_loads: buildMockCapacity(),
  cash_flow: buildMockCash(),
  risks: [
    { severity:'HIGH', category:'BOTTLENECK', period_index:9, resource_id:'SMT', product_id:null,
      message:'SMT Line at 122% capacity in period 9 (overtime 6h).' },
    { severity:'MED', category:'BOTTLENECK', period_index:10, resource_id:'ASSY', product_id:null,
      message:'Assembly Cell at 103% capacity in period 10 (overtime 4h).' },
  ],
  recommendations: [
    'Resource SMT is a recurring bottleneck (4 periods >95%). Consider a second shift, alternate routing, or load leveling.',
    'Plan is feasible. Consider reducing safety stock on A-class items to free working capital.',
  ],
}
function buildMockMps() {
  const ss = [200,220,240,260,280,300,300,320,340,340,360,380]
  const rows = []
  let oh = 120
  ss.forEach((d,t)=>{
    const plan = Math.max(0, d - oh + 50)
    oh = oh + plan - d
    rows.push({ product_id:'SS-100', period_index:t, gross_demand:d,
      net_requirement:Math.max(0,d+50-oh), planned_order:plan,
      projected_on_hand:Math.max(0,oh), source:'MAKE' })
  })
  return rows
}
function buildMockCapacity() {
  const smt = [55,62,70,78,85,95,98,108,118,123,115,110]
  const assy = [48,52,58,63,68,75,82,90,95,100,103,98]
  const loads = []
  smt.forEach((v,t)=>loads.push({ resource_id:'SMT', period_index:t, load_pct:v,
    required_hours:+(v*0.14).toFixed(1), available_hours:14, overtime_hours:v>100?+( (v-100)*0.14).toFixed(1):0 }))
  assy.forEach((v,t)=>loads.push({ resource_id:'ASSY', period_index:t, load_pct:v,
    required_hours:+(v*0.30).toFixed(1), available_hours:30, overtime_hours:v>100?+((v-100)*0.30).toFixed(1):0 }))
  return loads
}
function buildMockCash() {
  const pts = []
  let cum = 250000
  for (let t=0;t<12;t++){
    const cin = t>=4 ? 28000 + t*1500 : 0
    const cout = 9000 + t*300
    const net = cin - cout
    cum += net
    pts.push({ period_index:t, cash_in:cin, cash_out:cout, net_cash:net, cumulative_cash:cum,
      material_purchases:cout*0.45, direct_labor:cout*0.35, overhead:8000, sales_collections:cin })
  }
  return pts
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ small UI helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Card({ title, icon, children, style }) {
  return (
    <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12,
      padding:'18px 20px', ...style }}>
      {title && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          {icon && <span style={{ color:C.t3 }}>{icon}</span>}
          <span style={f({ fontSize:13, fontWeight:600, color:C.t1 })}>{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

function KpiCard({ label, value, sub, color = C.blue, icon }) {
  return (
    <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12,
      padding:'16px 18px', flex:1, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
        <span style={{ color }}>{icon}</span>
        <span style={f({ fontSize:11, color:C.t3, fontWeight:500 })}>{label}</span>
      </div>
      <div style={f({ fontSize:24, fontWeight:700, color:C.t1, letterSpacing:'-0.02em' })}>{value}</div>
      {sub && <div style={f({ fontSize:11, color:C.t3, marginTop:4 })}>{sub}</div>}
    </div>
  )
}

const fmt = n => n>=1000 ? `${(n/1000).toFixed(n>=10000?0:1)}k` : `${Math.round(n)}`
const usd = n => `$${Math.round(n).toLocaleString()}`

function loadColor(pct) {
  if (pct > 110) return C.red
  if (pct > 95)  return C.amber
  if (pct > 70)  return C.teal
  return C.green
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Capacity Heatmap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CapacityHeatmap({ loads }) {
  const resources = [...new Set(loads.map(l=>l.resource_id))]
  const periods = [...new Set(loads.map(l=>l.period_index))].sort((a,b)=>a-b)
  const get = (r,t)=>loads.find(l=>l.resource_id===r && l.period_index===t)
  return (
    <Card title="Capacity Load & Bottlenecks" icon={<Gauge size={15}/>}>
      <div style={{ overflowX:'auto' }}>
        <div style={{ display:'grid',
          gridTemplateColumns:`90px repeat(${periods.length}, 1fr)`, gap:4, minWidth:640 }}>
          <div/>
          {periods.map(t=>(
            <div key={t} style={f({ fontSize:9, color:C.t3, textAlign:'center', paddingBottom:4 })}>
              W{t+1}
            </div>
          ))}
          {resources.map(r=>(
            <Row key={r} r={r} periods={periods} get={get}/>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:14, marginTop:14, flexWrap:'wrap' }}>
        {[['â‰¤70%',C.green],['70â€“95%',C.teal],['95â€“110%',C.amber],['>110%',C.red]].map(([lbl,col])=>(
          <div key={lbl} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:col }}/>
            <span style={f({ fontSize:10, color:C.t3 })}>{lbl}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
function Row({ r, periods, get }) {
  return (
    <>
      <div style={f({ fontSize:11, color:C.t2, fontWeight:500, display:'flex', alignItems:'center' })}>{r}</div>
      {periods.map(t=>{
        const cell = get(r,t)
        const pct = cell ? cell.load_pct : 0
        const col = loadColor(pct)
        return (
          <div key={t} title={`${r} W${t+1}: ${pct}% (${cell?.required_hours||0}h / ${cell?.available_hours||0}h)`}
            style={{ background:`${col}26`, border:`1px solid ${col}55`, borderRadius:5,
              height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'default' }}>
            <span style={f({ fontSize:10, fontWeight:600, color:col })}>{Math.round(pct)}</span>
          </div>
        )
      })}
    </>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Cash Flow Waterfall â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CashWaterfall({ cash, target }) {
  const W=640, H=220, padL=46, padB=26, padT=10
  const cums = cash.map(c=>c.cumulative_cash)
  const min = Math.min(...cums, target)*0.95
  const max = Math.max(...cums)*1.02
  const x = i => padL + i*((W-padL-10)/cash.length)
  const bw = (W-padL-10)/cash.length - 6
  const y = v => padT + (1-(v-min)/(max-min))*(H-padT-padB)
  return (
    <Card title="Integrated Cash Flow Forecast" icon={<DollarSign size={15}/>}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto' }}>
        {/* target line */}
        <line x1={padL} x2={W-10} y1={y(target)} y2={y(target)}
          stroke={C.amber} strokeWidth="1" strokeDasharray="4 3" opacity="0.7"/>
        <text x={W-12} y={y(target)-4} textAnchor="end" fontSize="9" fill={C.amber} fontFamily={FONT}>
          target {usd(target)}
        </text>
        {/* bars: net change per period colored by sign */}
        {cash.map((c,i)=>{
          const prev = i===0 ? c.cumulative_cash - c.net_cash : cums[i-1]
          const top = y(Math.max(prev, c.cumulative_cash))
          const h = Math.abs(y(prev)-y(c.cumulative_cash))
          const up = c.net_cash >= 0
          return (
            <g key={i}>
              <rect x={x(i)} y={top} width={bw} height={Math.max(1,h)}
                fill={up?C.green:C.red} opacity="0.55" rx="2"/>
              <text x={x(i)+bw/2} y={H-padB+12} textAnchor="middle" fontSize="8" fill={C.t3} fontFamily={FONT}>
                W{i+1}
              </text>
            </g>
          )
        })}
        {/* cumulative line */}
        <polyline fill="none" stroke={C.blue} strokeWidth="2"
          points={cums.map((v,i)=>`${x(i)+bw/2},${y(v)}`).join(' ')}/>
        {cums.map((v,i)=>(
          <circle key={i} cx={x(i)+bw/2} cy={y(v)} r="2.5" fill={C.blue}/>
        ))}
      </svg>
      <div style={{ display:'flex', gap:16, marginTop:6, flexWrap:'wrap' }}>
        <Legend color={C.blue} label="Cumulative cash"/>
        <Legend color={C.green} label="Net inflow week"/>
        <Legend color={C.red} label="Net outflow week"/>
      </div>
    </Card>
  )
}
function Legend({ color, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:10, height:10, borderRadius:3, background:color, opacity:0.7 }}/>
      <span style={f({ fontSize:10, color:C.t3 })}>{label}</span>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ MPS table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function MpsTable({ mps }) {
  const products = [...new Set(mps.map(m=>m.product_id))]
  const [sel, setSel] = useState(products[0])
  const rows = mps.filter(m=>m.product_id===sel)
  const th = { fontSize:10, color:C.t3, fontWeight:600, textAlign:'right',
    padding:'6px 10px', borderBottom:`1px solid ${C.border}` }
  const td = { fontSize:11, color:C.t2, textAlign:'right', padding:'6px 10px',
    borderBottom:`1px solid ${C.border}` }
  return (
    <Card title="Master Production Schedule (MPS)" icon={<Boxes size={15}/>}>
      <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
        {products.map(p=>(
          <button key={p} onClick={()=>setSel(p)} style={f({
            fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:7, cursor:'pointer',
            background: sel===p?`${C.blue}1e`:'transparent',
            border:`1px solid ${sel===p?C.blue:C.border}`,
            color: sel===p?C.blue:C.t2 })}>{p}</button>
        ))}
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:560 }}>
          <thead><tr>
            <th style={{...th, textAlign:'left'}}>Week</th>
            <th style={th}>Gross demand</th>
            <th style={th}>Net req</th>
            <th style={th}>Planned order</th>
            <th style={th}>Proj. on-hand</th>
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.period_index}>
                <td style={{...td, textAlign:'left', color:C.t1, fontWeight:600}}>W{r.period_index+1}</td>
                <td style={td}>{fmt(r.gross_demand)}</td>
                <td style={td}>{fmt(r.net_requirement)}</td>
                <td style={{...td, color:r.planned_order>0?C.teal:C.t3, fontWeight:600}}>{fmt(r.planned_order)}</td>
                <td style={{...td, color:r.projected_on_hand<0?C.red:C.t2}}>{fmt(r.projected_on_hand)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Risks + Recommendations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SEV = { HIGH:C.red, MED:C.amber, LOW:C.teal, INFO:C.blue }
function RiskList({ risks, recs }) {
  return (
    <Card title="Risk Alerts & Recommendations" icon={<AlertTriangle size={15}/>}>
      {risks.length===0 && (
        <div style={f({ fontSize:12, color:C.green })}>âœ“ No critical risks detected.</div>
      )}
      {risks.map((r,i)=>(
        <div key={i} style={{ display:'flex', gap:10, padding:'8px 0',
          borderBottom:i<risks.length-1?`1px solid ${C.border}`:'none' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', marginTop:5,
            background:SEV[r.severity]||C.t3, flexShrink:0 }}/>
          <div>
            <span style={f({ fontSize:9, fontWeight:700, color:SEV[r.severity], letterSpacing:'0.05em' })}>
              {r.severity} Â· {r.category}
            </span>
            <div style={f({ fontSize:12, color:C.t2, marginTop:2 })}>{r.message}</div>
          </div>
        </div>
      ))}
      {recs.length>0 && (
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
          {recs.map((rec,i)=>(
            <div key={i} style={{ display:'flex', gap:9, marginBottom:8 }}>
              <Lightbulb size={14} color={C.amber} style={{ flexShrink:0, marginTop:1 }}/>
              <span style={f({ fontSize:12, color:C.t2, lineHeight:1.5 })}>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Weight controls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const WEIGHT_DEFS = [
  { key:'cash_tie_up', label:'Min cash tie-up' },
  { key:'holding',     label:'Min inventory' },
  { key:'overtime',    label:'Min overtime' },
  { key:'stockout',    label:'Max service level' },
]
function WeightPanel({ weights, setWeights, onRun, running }) {
  return (
    <Card title="Optimization Objective" icon={<Activity size={15}/>}>
      {WEIGHT_DEFS.map(w=>(
        <div key={w.key} style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={f({ fontSize:11, color:C.t2 })}>{w.label}</span>
            <span style={f({ fontSize:11, color:C.blue, fontWeight:600 })}>{weights[w.key]}</span>
          </div>
          <input type="range" min="1" max="20" value={weights[w.key]}
            onChange={e=>setWeights({...weights, [w.key]:+e.target.value})}
            style={{ width:'100%', accentColor:C.blue, cursor:'pointer' }}/>
        </div>
      ))}
      <button onClick={onRun} disabled={running} style={f({
        marginTop:8, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        fontSize:13, fontWeight:600, color:'#fff', background:C.blue, border:'none',
        borderRadius:9, padding:'11px', cursor:running?'wait':'pointer',
        boxShadow:`0 4px 20px ${C.blue}40`, opacity:running?0.7:1 })}>
        {running ? <Loader2 size={15} className="spin"/> : <Play size={15}/>}
        {running ? 'Optimizingâ€¦' : 'Run Optimization'}
      </button>
    </Card>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Main view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function ProductionPlanning() {
  const [weights, setWeights] = useState({ cash_tie_up:5, holding:5, overtime:1, stockout:8 })
  const [result, setResult]   = useState(MOCK_RESULT)
  const [running, setRunning] = useState(false)
  const [source, setSource]   = useState('mock')   // 'live' | 'mock'

  const API = import.meta.env.VITE_APS_API || 'https://192.18.131.82.sslip.io/aps'
  const run = useCallback(async ()=>{
    setRunning(true)
    try {
      const res = await fetch(`${API}/plan/run`, {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ weights, time_limit_s:15 }),
      })
      if (!res.ok) throw new Error('backend error')
      const data = await res.json()
      setResult(data); setSource('live')
    } catch {
      // graceful fallback â€” keep mock but reflect weight changes lightly
      setResult({ ...MOCK_RESULT }); setSource('mock')
    } finally {
      setRunning(false)
    }
  }, [weights])

  useEffect(()=>{ run() }, [])   // initial load

  const k = result.kpis
  return (
    <div>
      <style>{`.spin{animation:spin 0.9s linear infinite}`}</style>

      {/* header strip */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom:18, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Factory size={20} color={C.blue}/>
          <div>
            <div style={f({ fontSize:16, fontWeight:700, color:C.t1 })}>Production & Supply Optimizer</div>
            <div style={f({ fontSize:11, color:C.t3 })}>
              APS engine Â· status&nbsp;
              <span style={{ color: result.status==='OPTIMAL'?C.green:C.amber, fontWeight:600 }}>
                {result.status}
              </span>
              &nbsp;Â·&nbsp;
              <span style={{ color: source==='live'?C.green:C.t3 }}>
                {source==='live' ? 'live backend' : 'demo data (backend offline)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:'flex', gap:14, marginBottom:16, flexWrap:'wrap' }}>
        <KpiCard label="Total plan cost" value={usd(k.total_cost)} color={C.blue} icon={<DollarSign size={15}/>}/>
        <KpiCard label="Cash tied up (inventory)" value={usd(k.cash_tie_up)} color={C.teal} icon={<Boxes size={15}/>}/>
        <KpiCard label="Peak capacity load" value={`${k.peak_capacity_load_pct}%`}
          color={loadColor(k.peak_capacity_load_pct)} icon={<Gauge size={15}/>}/>
        <KpiCard label="On-time delivery" value={`${k.on_time_delivery_pct}%`} color={C.green} icon={<Truck size={15}/>}/>
        <KpiCard label="Min cash balance" value={usd(k.min_cash_balance)} color={C.purple} icon={<TrendingUp size={15}/>}/>
      </div>

      {/* two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 280px', gap:16, alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>
          <CapacityHeatmap loads={result.capacity_loads}/>
          <CashWaterfall cash={result.cash_flow} target={210000}/>
          <MpsTable mps={result.mps}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <WeightPanel weights={weights} setWeights={setWeights} onRun={run} running={running}/>
          <RiskList risks={result.risks} recs={result.recommendations}/>
        </div>
      </div>
    </div>
  )
}


