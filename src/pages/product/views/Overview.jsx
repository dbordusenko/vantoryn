import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { C, f } from '../../../tokens'
import { SIGNALS, DEPARTMENTS, SPARKS } from '../data'
import { Sparkline } from '../CashFlowChart'
import CashFlowChart from '../CashFlowChart'

export default function Overview({ setView, importedData }) {
  const [sigIdx, setSigIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSigIdx(i => (i + 1) % SIGNALS.length), 3200)
    return () => clearInterval(id)
  }, [])

  const sig = SIGNALS[sigIdx]

  const kpiDefs = importedData ? [
    { label: 'Total Revenue', ...importedData.kpis.revenue, spark: importedData.sparklines.revenue, color: C.blue  },
    { label: 'EBITDA',        ...importedData.kpis.ebitda,  spark: importedData.sparklines.ebitda,  color: C.green },
    { label: 'Cash Runway',   ...importedData.kpis.runway,  spark: importedData.sparklines.runway,  color: C.amber },
    { label: 'Burn Rate',     ...importedData.kpis.burn,    spark: importedData.sparklines.burn,    color: C.red   },
  ] : [
    { label: 'Total Revenue', value: '$14.2M', delta: '+18%', up: true,  spark: SPARKS.revenue, color: C.blue  },
    { label: 'EBITDA',        value: '$3.8M',  delta: '+11%', up: true,  spark: SPARKS.ebitda,  color: C.green },
    { label: 'Cash Runway',   value: '11.4mo', delta: '-2mo', up: false, spark: SPARKS.runway,  color: C.amber },
    { label: 'Burn Rate',     value: '$890K',  delta: '+4%',  up: false, spark: SPARKS.burn,    color: C.red   },
  ]
  const departments = importedData ? importedData.departments : DEPARTMENTS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* AI Morning Brief banner */}
      <div style={{
        background: `${C.teal}0c`, border: `1px solid ${C.teal}28`, borderRadius: 12,
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={14} color={C.teal} />
          <span style={f({ fontSize: 12, fontWeight: 700, color: C.teal })}>AI Brief — 8:00 AM</span>
          <span style={f({ fontSize: 12, color: C.t2 })}>Cash position +$1.2M this week. 3 signals require attention before Monday board call.</span>
        </div>
        <button onClick={() => setView('ai-brief')} style={f({
          fontSize: 12, color: C.teal, background: 'transparent', border: `1px solid ${C.teal}40`,
          borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 600,
        })}>
          Read Full Brief →
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {kpiDefs.map(k => (
          <div key={k.label} style={{
            background: C.bg2, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '18px 20px', transition: 'border-color 0.2s', cursor: 'default',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = k.color + '55')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.04em' })}>{k.label}</span>
              <Sparkline data={k.spark} color={k.color} up={k.up} />
            </div>
            <div style={f({ fontSize: 26, fontWeight: 800, color: C.t1, letterSpacing: '-0.03em', marginBottom: 8 })}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {k.up ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.amber} />}
              <span style={f({ fontSize: 12, color: k.up ? C.green : C.amber, fontWeight: 600 })}>{k.delta}</span>
              <span style={f({ fontSize: 11, color: C.t3 })}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main row: Chart + Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Cash Flow Chart */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Revenue — Actual vs AI Forecast</span>
                {importedData && (
                  <span style={f({
                    fontSize: 9, color: C.teal, fontWeight: 700, padding: '1px 7px',
                    borderRadius: 3, background: `${C.teal}16`, border: `1px solid ${C.teal}30`,
                  })}>
                    IMPORTED DATA
                  </span>
                )}
              </div>
              <div style={f({ fontSize: 11, color: C.t3 })}>
                {importedData
                  ? `${importedData.allMonths[0]} – ${importedData.allMonths[importedData.allMonths.length - 1]} · ${importedData.meta.actual} actual · ${importedData.meta.forecast} forecast months`
                  : 'Aug 2025 – Sep 2026 · Monthly ($M)'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {[{ c: C.blue, l: 'Actual' }, { c: C.teal, l: 'Forecast' }, { c: `${C.teal}44`, l: '±Confidence' }].map(i => (
                <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 14, height: i.l === '±Confidence' ? 8 : 2,
                    background: i.c, borderRadius: 2, border: i.l === '±Confidence' ? `1px solid ${C.teal}40` : 'none',
                  }} />
                  <span style={f({ fontSize: 10, color: C.t3 })}>{i.l}</span>
                </div>
              ))}
            </div>
          </div>
          <CashFlowChart importedData={importedData} />
        </div>

        {/* AI Signals */}
        <div style={{
          background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={f({ fontSize: 12, fontWeight: 700, color: C.t1 })}>AI Intelligence Feed</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px',
              borderRadius: 4, background: `${C.green}14`, border: `1px solid ${C.green}30`,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, animation: 'pulse 1.8s ease infinite' }} />
              <span style={f({ fontSize: 9, color: C.green, fontWeight: 700 })}>LIVE</span>
            </div>
          </div>
          {/* Active signal */}
          <div key={sigIdx} style={{
            padding: '12px', borderRadius: 10,
            background: `${sig.color}0c`, border: `1px solid ${sig.color}30`,
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={f({
                fontSize: 9, color: sig.color, fontWeight: 800, padding: '1px 5px',
                borderRadius: 3, background: `${sig.color}20`, flexShrink: 0,
              })}>{sig.sev}</span>
              <div>
                <div style={f({ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 4, lineHeight: 1.4 })}>{sig.text}</div>
                <div style={f({ fontSize: 11, color: C.t3, marginBottom: 8 })}>{sig.sub}</div>
                <button
                  onClick={() => {
                    if (sig.action === 'Dismiss') setSigIdx(i => (i + 1) % SIGNALS.length)
                    else if (sig.action === 'View AR') setView('reports')
                    else setView('alerts')
                  }}
                  style={f({
                    fontSize: 10, color: sig.color, background: 'transparent',
                    border: `1px solid ${sig.color}40`, borderRadius: 5, padding: '3px 8px',
                    cursor: 'pointer', fontWeight: 600,
                  })}>
                  {sig.action}
                </button>
              </div>
            </div>
          </div>
          {/* Feed dots */}
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {SIGNALS.map((_, i) => (
              <div key={i} onClick={() => setSigIdx(i)} style={{
                cursor: 'pointer', width: i === sigIdx ? 16 : 5, height: 5, borderRadius: 3,
                background: i === sigIdx ? C.blue : C.borderMid, transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          {/* All signals mini */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SIGNALS.slice(0, 4).map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                padding: '5px', borderRadius: 6, transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg3)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={f({ fontSize: 11, color: C.t2, lineHeight: 1.4 })}>{s.text.slice(0, 38)}…</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Dept breakdown + Close status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Department Opex */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Department Opex — May 2026</span>
            <span style={f({ fontSize: 11, color: C.t3 })}>Budget vs Spent</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {departments.map(d => {
              const pct = Math.round((d.spent / d.budget) * 100)
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={f({ fontSize: 12, color: C.t2 })}>{d.name}</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={f({ fontSize: 11, color: C.t3 })}>${d.spent}K / ${d.budget}K</span>
                      <span style={f({ fontSize: 11, color: pct > 85 ? C.amber : C.green, fontWeight: 700 })}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: C.bg3, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, borderRadius: 3,
                      background: `linear-gradient(90deg,${d.color},${d.color}cc)`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Close status */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Month-End Close — May 2026</span>
            <div style={{ padding: '3px 10px', borderRadius: 4, background: `${C.amber}16`, border: `1px solid ${C.amber}30` }}>
              <span style={f({ fontSize: 10, color: C.amber, fontWeight: 700 })}>T-4 DAYS</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Bank reconciliation',   done: true,  day: 'May 20' },
              { label: 'AR/AP reconciliation',  done: true,  day: 'May 21' },
              { label: 'Payroll verification',  done: true,  day: 'May 22' },
              { label: 'Intercompany elim.',    done: false, day: 'May 24' },
              { label: 'P&L finalization',      done: false, day: 'May 25' },
              { label: 'Board pack generation', done: false, day: 'May 26' },
            ].map(t => (
              <div key={t.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 8,
                background: t.done ? `${C.green}08` : C.bg3,
                border: `1px solid ${t.done ? C.green + '28' : C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {t.done
                    ? <CheckCircle2 size={13} color={C.green} />
                    : <div style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${C.t3}` }} />}
                  <span style={f({ fontSize: 12, color: t.done ? C.t2 : C.t1 })}>{t.label}</span>
                </div>
                <span style={f({ fontSize: 10, color: C.t3 })}>{t.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
