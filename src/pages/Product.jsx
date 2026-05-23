import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, TrendingUp, FileText, Brain, Bell, PlugZap,
  Settings, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2,
  Activity, RefreshCw, Download, Plus, Sparkles, ChevronRight,
  SlidersHorizontal, Building2, Clock, BarChart3, Zap,
  ArrowLeft, Eye, Filter, MoreHorizontal, X,
  BookOpen, ChevronDown, Key, Copy, Check, Globe, Lock,
  Database, Link2, HelpCircle, PlayCircle, Shield, Users, LogOut,
} from 'lucide-react'
import { C, f, FONT } from '../tokens'

/* ─── STATIC DATA ────────────────────────────────────────── */
const MONTHS = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
const CF_ACTUAL   = [3.8,4.1,3.7,4.5,4.8,4.4,5.2,5.6,5.3,6.1]
const CF_FORECAST = [6.1,6.8,7.6,8.4,9.2]
const CF_HI       = [6.1,7.2,8.1,9.1,10.2]
const CF_LO       = [6.1,6.4,7.1,7.7,8.2]

const SPARKS = {
  revenue: [12.0,11.8,12.5,13.1,12.8,13.5,14.2],
  ebitda:  [3.2,3.0,3.4,3.5,3.3,3.6,3.8],
  runway:  [13.5,13.2,12.8,12.5,12.1,11.8,11.4],
  burn:    [820,830,845,860,875,880,890],
}

const DEPARTMENTS = [
  { name:'Engineering', budget:450, spent:398, color:C.blue },
  { name:'Sales & BD',  budget:280, spent:241, color:C.teal },
  { name:'Marketing',   budget:180, spent:162, color:C.purple },
  { name:'Product',     budget:160, spent:134, color:C.amber },
  { name:'G&A',         budget:120, spent:95,  color:C.green },
]

const SIGNALS = [
  { sev:'HIGH',   color:C.red,    icon:'⚠', text:'AP payables spike +23% above plan',         sub:'$340K cash impact detected · Jul 2026',        action:'Review' },
  { sev:'MED',    color:C.amber,  icon:'▲', text:'Opex Q3 at 88% budget at Month 2',           sub:'Engineering team overage — $52K YTD',           action:'Drill down' },
  { sev:'LOW',    color:C.blue,   icon:'●', text:'AR aging: 3 invoices >60 days',              sub:'$420K exposure flagged · Action recommended',   action:'View AR' },
  { sev:'INFO',   color:C.green,  icon:'↑', text:'Revenue variance +$182K vs plan',            sub:'Tracking 4% ahead of Q2 target',                action:'Dismiss' },
  { sev:'MED',    color:C.purple, icon:'▼', text:'Payroll increased +12% vs prior month',      sub:'Headcount change: +3 FTE Engineering',          action:'Review' },
]

const SCENARIOS = {
  base:       { data:[6.1,6.8,7.6,8.4,9.2],   runway:'11.4mo', burn:'$890K', color:C.teal   },
  optimistic: { data:[6.1,7.5,8.8,10.2,11.8],  runway:'18.2mo', burn:'$780K', color:C.green  },
  stress:     { data:[6.1,6.0,5.8,5.5,5.2],    runway:'7.1mo',  burn:'$1.1M', color:C.red    },
}

const REPORTS = [
  { title:'Q2 2026 Board Pack',         pages:47, status:'Ready',       color:C.green,  date:'May 23, 2026',  type:'Board' },
  { title:'June Management Accounts',   pages:18, status:'Ready',       color:C.green,  date:'May 20, 2026',  type:'Monthly' },
  { title:'FP&A Variance Report — May', pages:12, status:'Ready',       color:C.green,  date:'May 19, 2026',  type:'Variance' },
  { title:'Cash Flow Forecast — Q3',    pages:8,  status:'Generating',  color:C.amber,  date:'In progress',   type:'Forecast' },
  { title:'FY2026 Budget vs Actual',    pages:22, status:'Scheduled',   color:C.blue,   date:'Jun 1, 2026',   type:'Annual' },
  { title:'Investor Update — Q2',       pages:15, status:'Draft',       color:C.purple, date:'May 25, 2026',  type:'Investor' },
]

const INTEGRATIONS = [
  { name:'SAP ERP',          status:'connected', lastSync:'2 min ago',  color:C.green, tier:'ERP' },
  { name:'Oracle NetSuite',  status:'connected', lastSync:'2 min ago',  color:C.green, tier:'ERP' },
  { name:'QuickBooks',       status:'connected', lastSync:'5 min ago',  color:C.green, tier:'Accounting' },
  { name:'Xero',             status:'connected', lastSync:'12 min ago', color:C.green, tier:'Accounting' },
  { name:'Gusto Payroll',    status:'connected', lastSync:'1 hr ago',   color:C.green, tier:'Payroll' },
  { name:'Stripe',           status:'warning',   lastSync:'3 hrs ago',  color:C.amber, tier:'Revenue' },
  { name:'Salesforce CRM',   status:'disconnected', lastSync:'Never',   color:C.t3,    tier:'CRM' },
  { name:'HubSpot',          status:'disconnected', lastSync:'Never',   color:C.t3,    tier:'CRM' },
]

/* ─── DEMO DATASET ──────────────────────────────────────── */
const DEMO_CSV = `Month,Type,Revenue,COGS,Gross_Profit,Eng_Opex,Sales_Opex,Mktg_Opex,Product_Opex,GA_Opex,Total_Opex,EBITDA,Cash_Position,Burn_Rate,AR_Balance,AP_Balance,Headcount
Aug-25,Actual,3800000,1140000,2660000,398000,241000,162000,134000,95000,1030000,760000,12100000,820000,1280000,640000,42
Sep-25,Actual,4100000,1230000,2870000,412000,255000,168000,140000,98000,1073000,910000,12520000,830000,1340000,660000,43
Oct-25,Actual,3700000,1110000,2590000,405000,248000,165000,138000,96000,1052000,740000,12100000,835000,1190000,710000,43
Nov-25,Actual,4500000,1350000,3150000,420000,260000,170000,142000,100000,1092000,1050000,12640000,845000,1420000,690000,44
Dec-25,Actual,4800000,1440000,3360000,440000,268000,178000,148000,104000,1138000,1220000,13140000,848000,1560000,720000,44
Jan-26,Actual,4400000,1320000,3080000,430000,255000,172000,144000,101000,1102000,980000,13540000,860000,1380000,700000,45
Feb-26,Actual,5200000,1560000,3640000,445000,270000,180000,150000,105000,1150000,1490000,14200000,862000,1640000,730000,46
Mar-26,Actual,5600000,1680000,3920000,460000,278000,185000,155000,108000,1186000,1730000,15040000,870000,1760000,750000,47
Apr-26,Actual,5300000,1590000,3710000,455000,275000,182000,152000,106000,1170000,1540000,15680000,875000,1680000,740000,47
May-26,Actual,6100000,1830000,4270000,470000,285000,190000,158000,110000,1213000,1740000,16280000,880000,1920000,760000,48
Jun-26,Forecast,6800000,2040000,4760000,482000,292000,195000,162000,112000,1243000,1990000,17180000,885000,2100000,780000,49
Jul-26,Forecast,7600000,2280000,5320000,495000,300000,200000,168000,115000,1278000,2210000,18260000,888000,2340000,800000,50
Aug-26,Forecast,8400000,2520000,5880000,508000,308000,205000,173000,118000,1312000,2430000,19510000,889000,2580000,820000,51
Sep-26,Forecast,9200000,2760000,6440000,520000,316000,210000,178000,120000,1344000,2650000,20970000,890000,2830000,840000,52`

function downloadDemo() {
  const blob = new Blob([DEMO_CSV], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vantoryn_acme_corp_demo.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function parseFinancialCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',')
    const row = {}
    headers.forEach((h, i) => { row[h] = vals[i]?.trim() || '0' })
    return row
  })

  const actual   = rows.filter(r => r.Type === 'Actual')
  const forecast = rows.filter(r => r.Type === 'Forecast')
  if (!actual.length) return null

  const toM = v => Math.round(parseFloat(v) / 1e5) / 10   // → 1 decimal $M
  const toK = v => Math.round(parseFloat(v) / 1000)

  const last = actual[actual.length - 1]
  const prev = actual[actual.length - 2] || last

  // Chart data — revenue as cash-flow proxy (matches existing chart scale)
  const cashActual   = actual.map(r => toM(r.Revenue))
  const cashForecast = [toM(last.Revenue), ...forecast.map(r => toM(r.Revenue))]
  const cashHi       = cashForecast.map((v, i) => i === 0 ? v : parseFloat((v * 1.12).toFixed(1)))
  const cashLo       = cashForecast.map((v, i) => i === 0 ? v : parseFloat((v * 0.88).toFixed(1)))

  // Month labels (first 3 chars)
  const allMonths = rows.map(r => r.Month.slice(0, 3))

  // KPI deltas
  const pct = (a, b) => b ? `${a >= b ? '+' : ''}${Math.round((a - b) / b * 100)}%` : '—'
  const ytdRev  = actual.reduce((s, r) => s + parseFloat(r.Revenue), 0)
  const ytdPrev = actual.slice(0, -1).reduce((s, r) => s + parseFloat(r.Revenue), 0)
  const burnRate    = parseFloat(last.Burn_Rate)
  const prevBurn    = parseFloat(prev.Burn_Rate)
  const cashPos     = parseFloat(last.Cash_Position)
  const runway      = (cashPos / burnRate).toFixed(1)
  const lastEBITDA  = parseFloat(last.EBITDA)
  const prevEBITDA  = parseFloat(prev.EBITDA)
  const burnDelta   = prevBurn ? Math.round((burnRate - prevBurn) / prevBurn * 100) : 0

  // Sparklines — last 7 actuals
  const tail = actual.slice(-7)
  const sparklines = {
    revenue: tail.map(r => toM(r.Revenue)),
    ebitda:  tail.map(r => toM(r.EBITDA)),
    runway:  tail.map(r => parseFloat(r.Cash_Position) / parseFloat(r.Burn_Rate)),
    burn:    tail.map(r => toK(r.Burn_Rate)),
  }

  // Departments from last actual
  const departments = [
    { name: 'Engineering', spent: toK(last.Eng_Opex),     budget: Math.round(toK(last.Eng_Opex)     * 1.13), color: C.blue   },
    { name: 'Sales & BD',  spent: toK(last.Sales_Opex),   budget: Math.round(toK(last.Sales_Opex)   * 1.16), color: C.teal   },
    { name: 'Marketing',   spent: toK(last.Mktg_Opex),    budget: Math.round(toK(last.Mktg_Opex)    * 1.11), color: C.purple },
    { name: 'Product',     spent: toK(last.Product_Opex), budget: Math.round(toK(last.Product_Opex) * 1.19), color: C.amber  },
    { name: 'G&A',         spent: toK(last.GA_Opex),      budget: Math.round(toK(last.GA_Opex)      * 1.26), color: C.green  },
  ]

  return {
    cashActual, cashForecast, cashHi, cashLo, allMonths, sparklines, departments,
    kpis: {
      revenue: { value: `$${(ytdRev / 1e6).toFixed(1)}M`,     delta: pct(ytdRev, ytdPrev),       up: ytdRev >= ytdPrev },
      ebitda:  { value: `$${(lastEBITDA / 1e6).toFixed(1)}M`, delta: pct(lastEBITDA, prevEBITDA), up: lastEBITDA >= prevEBITDA },
      runway:  { value: `${runway}mo`,                          delta: '-2mo',                     up: false },
      burn:    { value: `$${toK(last.Burn_Rate)}K`,            delta: `${burnDelta >= 0 ? '+' : ''}${burnDelta}%`, up: burnDelta < 0 },
    },
    meta: { rows: rows.length, actual: actual.length, forecast: forecast.length },
  }
}

/* ─── UTILS ─────────────────────────────────────────────── */
function Sparkline({ data, color, up }) {
  const W=80, H=28, min=Math.min(...data), max=Math.max(...data)
  const pad = max === min ? 1 : 0
  const tx = i => (i/(data.length-1))*W
  const ty = v => H - ((v-min)/(max-min+pad))*(H-4) - 2
  const path = data.map((v,i)=>`${i===0?'M':'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ')
  const area = path+` L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:W, height:H, display:'block' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg${color.replace('#','')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx={tx(data.length-1)} cy={ty(data[data.length-1])} r="2.5" fill={color}/>
    </svg>
  )
}

function CashFlowChart({ showForecast=true, scenario='base', compact=false, importedData=null }) {
  const H = compact ? 140 : 200
  const W = 600

  const allActual = importedData ? importedData.cashActual   : CF_ACTUAL
  const allF      = importedData ? importedData.cashForecast : (SCENARIOS[scenario]?.data || CF_FORECAST)
  const hiArr     = importedData ? importedData.cashHi       : CF_HI
  const loArr     = importedData ? importedData.cashLo       : CF_LO
  const monthLbls = importedData ? importedData.allMonths    : MONTHS

  const allVals = [...allActual, ...allF, ...hiArr, ...loArr]
  const min=Math.floor(Math.min(...allVals)-0.5), max=Math.ceil(Math.max(...allVals)+0.5)
  const total = monthLbls.length
  const tx = i => (i/(total-1))*W
  const ty = v => H - ((v-min)/(max-min))*H
  const nowIdx = allActual.length-1

  const aCoords = allActual.map((v,i)=>[tx(i),ty(v)])
  const fCoords = allF.map((v,i)=>[tx(nowIdx+i),ty(v)])
  const hiCoords = hiArr.map((v,i)=>[tx(nowIdx+i),ty(v)])
  const loCoords = loArr.map((v,i)=>[tx(nowIdx+i),ty(v)])

  const ap = aCoords.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const fp = fCoords.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const cb = hiCoords.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    +' '+[...loCoords].reverse().map(p=>`L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+' Z'
  const area = ap+` L${aCoords[aCoords.length-1][0].toFixed(1)},${H} L0,${H} Z`

  const fColor = SCENARIOS[scenario]?.color || C.teal
  const nowX = tx(nowIdx)

  return (
    <svg viewBox={`0 0 ${W} ${H+28}`} style={{ width:'100%', display:'block' }}>
      <defs>
        <linearGradient id="cfArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={C.blue} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0.2,0.4,0.6,0.8].map(f=>(
        <g key={f}>
          <line x1="0" y1={H*f} x2={W} y2={H*f} stroke={C.border} strokeWidth="1" strokeDasharray="3,5"/>
          <text x="2" y={H*f-3} fill={C.t3} fontSize="9" fontFamily={FONT}>
            ${(max-(max-min)*f).toFixed(1)}M
          </text>
        </g>
      ))}
      {/* Month labels */}
      {monthLbls.map((m,i)=> i%2===0 && (
        <text key={i} x={tx(i)} y={H+18} fill={i===nowIdx?C.t2:C.t3} fontSize="9" fontFamily={FONT} textAnchor="middle"
          fontWeight={i===nowIdx?700:400}>{m}</text>
      ))}
      {/* Confidence band */}
      {showForecast && <path d={cb} fill={`${fColor}16`}/>}
      {/* Area */}
      <path d={area} fill="url(#cfArea)"/>
      {/* Actual */}
      <path d={ap} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Forecast */}
      {showForecast && <path d={fp} fill="none" stroke={fColor} strokeWidth="1.8" strokeDasharray="5,3" strokeLinejoin="round"/>}
      {/* Now divider */}
      <line x1={nowX} y1="0" x2={nowX} y2={H} stroke={C.borderMid} strokeWidth="1.5" strokeDasharray="4,3"/>
      <text x={nowX+4} y="12" fill={C.t3} fontSize="9" fontFamily={FONT}>Now</text>
      {/* Dots */}
      <circle cx={aCoords[aCoords.length-1][0]} cy={aCoords[aCoords.length-1][1]} r="3.5" fill={C.blue} stroke={C.bg2} strokeWidth="2"/>
      {showForecast && <circle cx={fCoords[fCoords.length-1][0]} cy={fCoords[fCoords.length-1][1]} r="3" fill={fColor} stroke={C.bg2} strokeWidth="2"/>}
    </svg>
  )
}

/* ─── GUIDE ──────────────────────────────────────────────── */
function FAQItem({ q, a, last }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(o => !o)} style={f({
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
      })}>
        <span style={f({ fontSize: 13, fontWeight: 600, color: C.t1 })}>{q}</span>
        <ChevronDown size={15} color={C.t3} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.75, paddingBottom: 16 })}>{a}</div>}
    </div>
  )
}

const ERP_SYSTEMS = [
  {
    id: 'sap', name: 'SAP S/4HANA', sub: 'SAP Business One also supported', authType: 'Service Account',
    steps: [
      { title: 'Create a service account', body: 'In SAP Admin Console → Users → Service Accounts → New. Name it vantorynread. Assign roles: FICO_Reader and CO_Module_Reader. Do not assign write permissions.' },
      { title: 'Enable OData API', body: 'Run transaction SICF. Navigate to /sap/opu/odata/ and activate the service node. This enables read-only access to financial data via REST API.' },
      { title: 'Collect your credentials', body: 'Note your SAP System URL (e.g. https://yoursap.company.com:8000), Client (Mandant) number, System ID (SID like PRD), and the service account username + password.' },
      { title: 'Paste & test in Vantoryn', body: 'Enter credentials in the form on the right and click Test Connection. First full sync takes 10–30 minutes depending on history depth.' },
    ],
    fields: [
      { label: 'SAP System URL', placeholder: 'https://yoursap.company.com:8000' },
      { label: 'Client (Mandant)', placeholder: '100' },
      { label: 'System ID (SID)', placeholder: 'PRD' },
      { label: 'Service Account Username', placeholder: 'vantorynread' },
      { label: 'Password', placeholder: '••••••••', type: 'password' },
    ],
  },
  {
    id: 'netsuite', name: 'Oracle NetSuite', sub: 'Token-Based Authentication', authType: 'TBA / OAuth',
    steps: [
      { title: 'Create a new integration record', body: 'Log in as Administrator. Go to Setup → Integration → Manage Integrations → New. Name: "Vantoryn". Enable Token-Based Authentication. Save.' },
      { title: 'Copy Consumer Keys immediately', body: 'After saving, NetSuite shows your Consumer Key and Consumer Secret exactly once. Copy them now — they cannot be retrieved again without regenerating.' },
      { title: 'Generate an access token', body: 'Go to Setup → Users/Roles → Manage Tokens → New. Select the Vantoryn integration and your admin user. Save and copy Token ID + Token Secret.' },
      { title: 'Locate your Account ID', body: 'Go to Setup → Company → Company Information. Your Account ID is shown at the top (format: 1234567 or TSTDRIVE-123456). Enter all credentials below.' },
    ],
    fields: [
      { label: 'Account ID', placeholder: '1234567' },
      { label: 'Consumer Key', placeholder: 'a1b2c3d4e5f6...' },
      { label: 'Consumer Secret', placeholder: '••••••••', type: 'password' },
      { label: 'Token ID', placeholder: 'e5f6g7h8i9j0...' },
      { label: 'Token Secret', placeholder: '••••••••', type: 'password' },
    ],
  },
  {
    id: 'quickbooks', name: 'QuickBooks Online', sub: 'OAuth 2.0 — one-click connect', authType: 'OAuth 2.0', oauth: true,
    steps: [
      { title: 'Click "Connect QuickBooks"', body: 'You will be redirected to Intuit\'s OAuth authorization page. No manual credential entry required — the connection is entirely browser-based.' },
      { title: 'Sign in as Administrator', body: 'You must be the QuickBooks Administrator or have Manage Users + Reports access. A regular accountant login will be rejected by Intuit.' },
      { title: 'Select your company', body: 'If you have multiple QBO companies, select the one to sync. You can connect additional companies later via Integrations → Add Connection.' },
      { title: 'Review permissions and allow', body: 'Vantoryn requests read-only access to: P&L, Balance Sheet, Cash Flow Statement, Chart of Accounts, and Transaction History. Click Allow to complete.' },
    ],
    fields: [],
  },
  {
    id: 'xero', name: 'Xero', sub: 'OAuth 2.0 — one-click connect', authType: 'OAuth 2.0', oauth: true,
    steps: [
      { title: 'Click "Connect Xero"', body: 'You will be redirected to Xero\'s authorization page. Sign in with your Xero credentials — Vantoryn never sees your password.' },
      { title: 'Select your organization', body: 'Choose the Xero organization to connect. Multi-entity setups: connect each entity separately. Consolidation is handled inside Vantoryn.' },
      { title: 'Grant read-only access', body: 'Vantoryn requests: Accounting (read), Bank Statements (read), Invoices (read). Write access is never requested or used.' },
      { title: 'Automatic sync begins', body: 'Connection completes immediately. Historical data (up to 24 months) syncs in the background. Ongoing sync runs every 15 minutes.' },
    ],
    fields: [],
  },
  {
    id: 'workday', name: 'Workday', sub: 'Integration System User required', authType: 'ISU + API Client',
    steps: [
      { title: 'Create an Integration System User', body: 'In Workday: Security → Users → New → System User. Name it "Vantoryn_ISU". Check "Do Not Allow UI Sessions" — this is a machine-only account.' },
      { title: 'Assign the correct security group', body: 'Add the ISU to the "Workday_Report_Writer_Foundation_User" security group. This grants read-only access to financial reports without broader admin access.' },
      { title: 'Create an API Client', body: 'Workday → Integration → API Clients → New. Name: "Vantoryn". Client Type: Public. Scopes to select: Staffing, Payroll, Financial Management (Read only).' },
      { title: 'Enter credentials in Vantoryn', body: 'Copy your Tenant URL (format: https://wd2.myworkday.com/yourcompany), Client ID, and generate a Refresh Token. Paste below and click Test Connection.' },
    ],
    fields: [
      { label: 'Tenant URL', placeholder: 'https://wd2.myworkday.com/yourcompany' },
      { label: 'Client ID', placeholder: 'abc123def456...' },
      { label: 'Client Secret', placeholder: '••••••••', type: 'password' },
      { label: 'Refresh Token', placeholder: '••••••••', type: 'password' },
    ],
  },
]

function Guide() {
  const [expanded, setExpanded] = useState(null)
  const [connected, setConnected] = useState({})
  const [connecting, setConnecting] = useState(null)
  const [doneSteps, setDoneSteps] = useState({ erp: false, perms: false, team: false, alerts: false })

  const handleConnect = (id, e) => {
    e.stopPropagation()
    if (connected[id]) return
    setConnecting(id)
    setTimeout(() => {
      setConnecting(null)
      setConnected(prev => ({ ...prev, [id]: true }))
      setDoneSteps(prev => ({ ...prev, erp: true }))
    }, 2200)
  }

  const doneCount = Object.values(doneSteps).filter(Boolean).length

  const QUICK_STEPS = [
    { id: 'erp',    label: 'Connect ERP',       desc: 'Link your primary financial system',   icon: <Database size={16} /> },
    { id: 'perms',  label: 'Set permissions',    desc: 'Configure team access levels',         icon: <Shield size={16} /> },
    { id: 'team',   label: 'Invite your team',   desc: 'Add FP&A leads and controllers',       icon: <Users size={16} /> },
    { id: 'alerts', label: 'Configure alerts',   desc: 'Set thresholds for AI signals',        icon: <Bell size={16} /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 920 }}>

      {/* Quick start tracker */}
      <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 16, padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={f({ fontSize: 16, fontWeight: 800, color: C.t1, marginBottom: 4 })}>Getting Started</div>
            <div style={f({ fontSize: 12, color: C.t3 })}>{doneCount} of 4 steps complete — click any step to mark done</div>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ height: 4, width: 44, borderRadius: 2, background: i < doneCount ? C.teal : C.bg3, transition: 'background 0.4s' }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {QUICK_STEPS.map(s => {
            const done = doneSteps[s.id]
            return (
              <div key={s.id} onClick={() => setDoneSteps(p => ({ ...p, [s.id]: !p[s.id] }))} style={{
                padding: '14px', borderRadius: 12, cursor: 'pointer',
                background: done ? `${C.teal}0c` : C.bg3,
                border: `1px solid ${done ? C.teal + '45' : C.border}`,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => !done && (e.currentTarget.style.borderColor = C.borderHi)}
                onMouseLeave={e => !done && (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ color: done ? C.teal : C.t3 }}>{s.icon}</div>
                  {done
                    ? <CheckCircle2 size={14} color={C.teal} />
                    : <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${C.t3}` }} />}
                </div>
                <div style={f({ fontSize: 12, fontWeight: 700, color: done ? C.t1 : C.t2, marginBottom: 3 })}>{s.label}</div>
                <div style={f({ fontSize: 11, color: C.t3, lineHeight: 1.5 })}>{s.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ERP Connection section */}
      <div>
        <div style={f({ fontSize: 15, fontWeight: 800, color: C.t1, marginBottom: 4 })}>Connect Your ERP</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <p style={f({ fontSize: 12, color: C.t3, margin: 0 })}>
            All connections are read-only. Vantoryn never writes to your ERP. Data is encrypted in transit (TLS 1.3) and at rest (AES-256).
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '4px 12px', borderRadius: 6, background: `${C.green}0c`, border: `1px solid ${C.green}25` }}>
            <Lock size={10} color={C.green} />
            <span style={f({ fontSize: 10, color: C.green, fontWeight: 700 })}>SOC 2 TYPE II</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ERP_SYSTEMS.map(erp => {
            const isOpen = expanded === erp.id
            const isConnected = connected[erp.id]
            const isConnecting = connecting === erp.id
            return (
              <div key={erp.id} style={{
                background: C.bg2, borderRadius: 14, overflow: 'hidden',
                border: `1px solid ${isConnected ? C.green + '55' : isOpen ? C.borderHi : C.border}`,
                transition: 'border-color 0.2s',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : erp.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10,
                      background: isConnected ? `${C.green}14` : `${C.blue}12`,
                      border: `1px solid ${isConnected ? C.green + '35' : C.blue + '30'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={17} color={isConnected ? C.green : C.blue} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                        <span style={f({ fontSize: 14, fontWeight: 700, color: C.t1 })}>{erp.name}</span>
                        {isConnected && (
                          <span style={f({ fontSize: 9, color: C.green, fontWeight: 700, padding: '1px 7px', borderRadius: 3, background: `${C.green}16`, border: `1px solid ${C.green}30` })}>
                            ✓ CONNECTED
                          </span>
                        )}
                        {isConnecting && (
                          <span style={f({ fontSize: 9, color: C.amber, fontWeight: 700, padding: '1px 7px', borderRadius: 3, background: `${C.amber}16` })}>
                            CONNECTING…
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <span style={f({ fontSize: 11, color: C.t3 })}>{erp.sub}</span>
                        <span style={f({ fontSize: 11, color: C.t3 })}>Auth: {erp.authType}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isConnected && <span style={f({ fontSize: 11, color: C.green })}>Syncing every 15 min</span>}
                    <ChevronDown size={16} color={C.t3} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: '22px 24px', display: 'flex', gap: 32 }}>
                    {/* Steps */}
                    <div style={{ flex: 1 }}>
                      <div style={f({ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 16 })}>
                        Setup Steps
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {erp.steps.map((step, si) => (
                          <div key={si} style={{ display: 'flex', gap: 14 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${C.blue}16`, border: `1px solid ${C.blue}35`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <span style={f({ fontSize: 10, fontWeight: 800, color: C.blue })}>{si + 1}</span>
                            </div>
                            <div>
                              <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 4 })}>{step.title}</div>
                              <div style={f({ fontSize: 12, color: C.t2, lineHeight: 1.7 })}>{step.body}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Credentials / OAuth */}
                    <div style={{ width: 272, flexShrink: 0 }}>
                      <div style={f({ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 14 })}>
                        {erp.oauth ? 'One-Click Connect' : 'Enter Credentials'}
                      </div>
                      {erp.oauth ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ padding: '20px 16px', borderRadius: 10, background: C.bg3, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                            <Globe size={26} color={C.blue} style={{ margin: '0 auto 12px' }} />
                            <p style={f({ fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 16, marginTop: 0 })}>
                              You will be redirected to {erp.name} to authorize read-only access.<br />No credentials are stored by Vantoryn.
                            </p>
                            <button
                              onClick={e => handleConnect(erp.id, e)}
                              style={f({
                                width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                                background: isConnected ? C.green : isConnecting ? C.bg4 : C.blue,
                                color: '#fff', fontSize: 13, fontWeight: 700, cursor: isConnected ? 'default' : 'pointer',
                                boxShadow: isConnected || isConnecting ? 'none' : `0 2px 14px ${C.blue}50`,
                                transition: 'all 0.3s',
                              })}>
                              {isConnecting ? 'Authorizing…' : isConnected ? '✓ Connected & Syncing' : `Connect ${erp.name}`}
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Lock size={11} color={C.t3} />
                            <span style={f({ fontSize: 10, color: C.t3 })}>Read-only OAuth 2.0 · TLS 1.3 · No password stored</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {erp.fields.map(field => (
                            <div key={field.label}>
                              <div style={f({ fontSize: 10, color: C.t3, fontWeight: 600, marginBottom: 4 })}>{field.label}</div>
                              <input
                                type={field.type || 'text'}
                                placeholder={field.placeholder}
                                style={f({
                                  width: '100%', padding: '8px 12px', borderRadius: 7,
                                  background: C.bg3, border: `1px solid ${C.borderMid}`,
                                  color: C.t1, fontSize: 12, outline: 'none',
                                })}
                                onFocus={e => e.target.style.borderColor = C.blue}
                                onBlur={e => e.target.style.borderColor = C.borderMid}
                              />
                            </div>
                          ))}
                          <button
                            onClick={e => handleConnect(erp.id, e)}
                            style={f({
                              padding: '10px', borderRadius: 8, border: 'none', marginTop: 4,
                              background: isConnected ? C.green : isConnecting ? C.bg4 : C.blue,
                              color: '#fff', fontSize: 13, fontWeight: 700,
                              cursor: isConnected ? 'default' : 'pointer',
                              boxShadow: isConnected || isConnecting ? 'none' : `0 2px 14px ${C.blue}50`,
                              transition: 'all 0.3s',
                            })}>
                            {isConnecting ? 'Testing connection…' : isConnected ? '✓ Connected — Data syncing' : 'Test Connection & Connect'}
                          </button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Lock size={11} color={C.t3} />
                            <span style={f({ fontSize: 10, color: C.t3 })}>Credentials encrypted at rest · AES-256 · SOC 2</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Permissions */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 26px' }}>
        <div style={f({ fontSize: 14, fontWeight: 800, color: C.t1, marginBottom: 4 })}>Data Access — What We Read</div>
        <p style={f({ fontSize: 12, color: C.t3, marginTop: 0, marginBottom: 18 })}>
          Vantoryn never requests write access. The table below shows exactly what data is pulled from your ERP and why.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { scope: 'General Ledger',                  why: 'P&L and cash flow computation',     required: true },
            { scope: 'Financial Reports (P&L, BS, CF)', why: 'Dashboard KPIs and variance',       required: true },
            { scope: 'Chart of Accounts',               why: 'Account mapping and categorization', required: true },
            { scope: 'AP / AR Aging',                   why: 'Cash exposure alerts',              required: true },
            { scope: 'Bank Reconciliation',             why: 'Cash position accuracy',            required: true },
            { scope: 'Payroll Summary',                 why: 'Headcount-driven Opex tracking',    required: false },
            { scope: 'Budget & Forecast Data',          why: 'Variance analysis vs plan',         required: false },
            { scope: 'Intercompany Transactions',       why: 'Multi-entity consolidation',        required: false },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 8, background: C.bg3, border: `1px solid ${C.border}`, gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <CheckCircle2 size={12} color={p.required ? C.green : C.teal} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={f({ fontSize: 12, color: C.t1, fontWeight: 600, marginBottom: 2 })}>{p.scope}</div>
                  <div style={f({ fontSize: 11, color: C.t3 })}>{p.why}</div>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {p.required
                  ? <span style={f({ fontSize: 9, color: C.blue, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${C.blue}14` })}>REQUIRED</span>
                  : <span style={f({ fontSize: 9, color: C.t3, padding: '2px 7px', borderRadius: 4, background: C.bg2 })}>Optional</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 26px' }}>
        <div style={f({ fontSize: 14, fontWeight: 800, color: C.t1, marginBottom: 18 })}>Common Questions</div>
        {[
          { q: 'How long does the initial sync take?', a: 'The first sync typically takes 10–30 minutes depending on your data volume. QuickBooks and Xero are fastest via OAuth. SAP and NetSuite may take up to 45 minutes for multi-year history. You will see data appearing progressively in the dashboard.' },
          { q: 'Does Vantoryn store my ERP credentials?', a: 'OAuth connections (QuickBooks, Xero) store only encrypted refresh tokens — your password is never seen by Vantoryn. API key connections (SAP, NetSuite, Workday) encrypt credentials at rest using AES-256 in an isolated secrets vault with zero standing access.' },
          { q: 'How often does data sync after setup?', a: 'By default, data syncs every 15 minutes for real-time systems and nightly at 2 AM for batch-based ERPs. You can change the frequency in Settings → Integrations → Sync Frequency. Real-time webhooks are available on Enterprise plans.' },
          { q: 'Can I connect multiple entities or companies?', a: 'Yes. Enterprise plans support unlimited entities. Each entity appears as a separate connection in Integrations. Cross-entity consolidation and eliminations are handled in the Reports view under "Consolidated View".' },
          { q: 'My ERP version is not listed — what do I do?', a: 'Contact support@vantoryn.ai with your ERP name and version. We typically add new connectors within 2–4 weeks for common systems. Custom connectors via REST API are available on Enterprise plans with a dedicated integration engineer.' },
          { q: 'What happens if the connection breaks mid-sync?', a: 'Vantoryn detects sync failures within 3 minutes and sends an alert (visible in the Alerts view). The system will automatically retry 3 times. If the issue persists, you will receive an email and the status will show as "Warning" in Integrations.' },
        ].map((item, i, arr) => <FAQItem key={i} q={item.q} a={item.a} last={i === arr.length - 1} />)}
      </div>
    </div>
  )
}

/* ─── SIDEBAR ────────────────────────────────────────────── */
const NAV = [
  { id:'overview',      icon:<LayoutDashboard size={16}/>, label:'Overview' },
  { id:'forecasting',   icon:<TrendingUp size={16}/>,      label:'Forecasting' },
  { id:'reports',       icon:<FileText size={16}/>,        label:'Reports' },
  { id:'ai-brief',      icon:<Brain size={16}/>,           label:'AI Brief' },
  { id:'alerts',        icon:<Bell size={16}/>,            label:'Alerts', badge:3 },
  { id:'integrations',  icon:<PlugZap size={16}/>,         label:'Integrations' },
  { id:'settings',      icon:<Settings size={16}/>,        label:'Settings' },
  { id:'guide',         icon:<BookOpen size={16}/>,        label:'Getting Started', divider:true },
]

function Sidebar({ view, setView, navigate }) {
  return (
    <div style={{
      width:224, flexShrink:0, background:C.bg1,
      borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column',
      height:'100vh', position:'fixed', left:0, top:0, zIndex:50,
    }}>
      {/* Logo */}
      <div style={{ padding:'18px 20px 14px', borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30,height:30,borderRadius:8,
            background:`linear-gradient(135deg,${C.blue},${C.teal})`,
            display:'flex',alignItems:'center',justifyContent:'center' }}>
            <BarChart3 size={15} color="#fff" strokeWidth={2.5}/>
          </div>
          <div>
            <div style={f({ fontSize:14,fontWeight:700,color:C.t1,letterSpacing:'-0.02em' })}>Vantoryn</div>
            <div style={f({ fontSize:10,color:C.t3 })}>Acme Corp · Finance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        <div style={f({ fontSize:10,color:C.t4,fontWeight:700,letterSpacing:'0.1em',
          textTransform:'uppercase', padding:'4px 10px 8px' })}>Platform</div>
        {NAV.map(item=>{
          const active = view===item.id
          return (
            <div key={item.id}>
              {item.divider && (
                <div style={{ height:1,background:C.border,margin:'8px 10px 8px',opacity:0.6 }}/>
              )}
              <button onClick={()=>setView(item.id)} style={f({
                display:'flex',alignItems:'center',justifyContent:'space-between',
                width:'100%',padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',
                background: active?`${C.blue}16`:'transparent',
                marginBottom:2, transition:'all 0.15s',
              })}
              onMouseEnter={e=>!active&&(e.currentTarget.style.background=C.bg3)}
              onMouseLeave={e=>!active&&(e.currentTarget.style.background='transparent')}
              >
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ color: active?C.blue:C.t3 }}>{item.icon}</span>
                  <span style={f({ fontSize:13,fontWeight:active?600:500, color:active?C.t1:C.t2 })}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <div style={{ background:C.red,borderRadius:10,padding:'1px 6px',minWidth:18,textAlign:'center' }}>
                    <span style={f({ fontSize:9,color:'#fff',fontWeight:700 })}>{item.badge}</span>
                  </div>
                )}
                {active && <div style={{ width:3,height:3,borderRadius:'50%',background:C.blue }}/>}
              </button>
            </div>
          )
        })}
      </div>

      {/* User + Back */}
      <div style={{ padding:'12px 10px', borderTop:`1px solid ${C.border}` }}>
        <button onClick={()=>navigate('home')} style={f({
          display:'flex',alignItems:'center',gap:8,padding:'8px 12px',
          borderRadius:7,background:'transparent',border:'none',cursor:'pointer',
          color:C.t3,fontSize:12,width:'100%',marginBottom:8,
          transition:'color 0.15s',
        })}
        onMouseEnter={e=>e.currentTarget.style.color=C.t2}
        onMouseLeave={e=>e.currentTarget.style.color=C.t3}
        >
          <ArrowLeft size={13}/> Back to Marketing Site
        </button>
        <div style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
          borderRadius:8, background:C.bg3, border:`1px solid ${C.border}` }}>
          <div style={{ width:28,height:28,borderRadius:'50%',
            background:`linear-gradient(135deg,${C.blue},${C.purple})`,
            display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={f({ fontSize:11,fontWeight:700,color:'#fff' })}>SC</span>
          </div>
          <div>
            <div style={f({ fontSize:12,fontWeight:600,color:C.t1 })}>Sarah Chen</div>
            <div style={f({ fontSize:10,color:C.t3 })}>CFO</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── TOP BAR ────────────────────────────────────────────── */
function TopBar({ view, lastSync, importedData, session, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const titles = {
    overview:'Executive Overview', forecasting:'Forecasting & Scenarios',
    reports:'Reports & Board Packs', 'ai-brief':'AI Intelligence Brief',
    alerts:'Risk Alerts & Signals', integrations:'Data Integrations',
    settings:'Settings', guide:'Getting Started & ERP Setup',
  }
  return (
    <div style={{
      position:'fixed',top:0,left:224,right:0,height:56,zIndex:40,
      background:'rgba(4,5,10,0.96)',backdropFilter:'blur(12px)',
      borderBottom:`1px solid ${C.border}`,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'0 28px',
    }}>
      <div>
        <div style={f({ fontSize:15,fontWeight:700,color:C.t1,letterSpacing:'-0.02em' })}>
          {titles[view]}
        </div>
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:16 }}>
        {/* ERP status */}
        <div style={{ display:'flex',gap:10,alignItems:'center' }}>
          {['SAP','NetSuite','QB'].map(s=>(
            <div key={s} style={{ display:'flex',alignItems:'center',gap:5 }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:C.green,
                boxShadow:`0 0 5px ${C.green}` }}/>
              <span style={f({ fontSize:10,color:C.t3 })}>{s}</span>
            </div>
          ))}
        </div>
        {importedData && (
          <div style={{ display:'flex',alignItems:'center',gap:5,padding:'3px 9px',
            borderRadius:4,background:`${C.teal}12`,border:`1px solid ${C.teal}30` }}>
            <Database size={10} color={C.teal}/>
            <span style={f({ fontSize:9,color:C.teal,fontWeight:700 })}>CUSTOM DATASET</span>
          </div>
        )}
        <div style={f({ fontSize:10,color:C.t3 })}>Synced {lastSync}</div>
        {/* Notification */}
        <div style={{ position:'relative',cursor:'pointer' }}>
          <Bell size={17} color={C.t2}/>
          <div style={{ position:'absolute',top:-3,right:-3,width:8,height:8,
            borderRadius:'50%',background:C.red,border:`1px solid ${C.bg0}` }}/>
        </div>

        {/* User avatar + dropdown */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={f({
              display:'flex',alignItems:'center',gap:8,
              background:C.bg2,border:`1px solid ${C.borderMid}`,
              borderRadius:50,padding:'4px 12px 4px 4px',cursor:'pointer',
              transition:'border-color 0.2s',
            })}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.teal}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderMid}
          >
            <div style={{
              width:26,height:26,borderRadius:'50%',flexShrink:0,
              background:`linear-gradient(135deg,${C.blue},${C.teal})`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:11,fontWeight:700,color:'#fff',
            }}>
              {session?.name?.[0] ?? 'U'}
            </div>
            <span style={f({ fontSize:12,color:C.t1,fontWeight:500 })}>
              {session?.name ?? 'User'}
            </span>
            <ChevronDown size={12} color={C.t3}/>
          </button>

          {showUserMenu && (
            <div style={{
              position:'absolute',top:'calc(100% + 8px)',right:0,width:200,
              background:C.bg2,border:`1px solid ${C.borderMid}`,
              borderRadius:12,padding:8,zIndex:100,
              boxShadow:'0 16px 40px #00000060',
              animation:'fadeIn 0.15s ease both',
            }}>
              {/* User info */}
              <div style={{ padding:'8px 12px 10px', borderBottom:`1px solid ${C.border}`, marginBottom:6 }}>
                <div style={f({ fontSize:13,fontWeight:600,color:C.t1 })}>{session?.name}</div>
                <div style={f({ fontSize:11,color:C.t3 })}>{session?.email}</div>
                <div style={f({ fontSize:10,color:C.t4,marginTop:2 })}>{session?.org}</div>
              </div>
              {/* Logout */}
              <button
                onClick={() => { setShowUserMenu(false); onLogout?.() }}
                style={f({
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',
                  background:'transparent',color:C.red,fontSize:13,fontWeight:500,
                  textAlign:'left',transition:'background 0.15s',
                })}
                onMouseEnter={e => e.currentTarget.style.background = `${C.red}12`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={13}/> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── VIEWS ──────────────────────────────────────────────── */

// OVERVIEW
function Overview({ setView, importedData }) {
  const [sigIdx, setSigIdx] = useState(0)
  useEffect(()=>{
    const id = setInterval(()=>setSigIdx(i=>(i+1)%SIGNALS.length), 3200)
    return ()=>clearInterval(id)
  },[])

  const sig = SIGNALS[sigIdx]

  const kpiDefs = importedData ? [
    { label:'Total Revenue', ...importedData.kpis.revenue, spark: importedData.sparklines.revenue, color: C.blue  },
    { label:'EBITDA',        ...importedData.kpis.ebitda,  spark: importedData.sparklines.ebitda,  color: C.green },
    { label:'Cash Runway',   ...importedData.kpis.runway,  spark: importedData.sparklines.runway,  color: C.amber },
    { label:'Burn Rate',     ...importedData.kpis.burn,    spark: importedData.sparklines.burn,    color: C.red   },
  ] : [
    { label:'Total Revenue',  value:'$14.2M', delta:'+18%', up:true,  spark:SPARKS.revenue, color:C.blue  },
    { label:'EBITDA',         value:'$3.8M',  delta:'+11%', up:true,  spark:SPARKS.ebitda,  color:C.green },
    { label:'Cash Runway',    value:'11.4mo', delta:'-2mo', up:false, spark:SPARKS.runway,  color:C.amber },
    { label:'Burn Rate',      value:'$890K',  delta:'+4%',  up:false, spark:SPARKS.burn,    color:C.red   },
  ]
  const kpis = kpiDefs
  const departments = importedData ? importedData.departments : DEPARTMENTS

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
      {/* AI Morning Brief banner */}
      <div style={{ background:`${C.teal}0c`,border:`1px solid ${C.teal}28`,borderRadius:12,
        padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',
        flexWrap:'wrap',gap:12 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <Sparkles size={14} color={C.teal}/>
          <span style={f({ fontSize:12,fontWeight:700,color:C.teal })}>AI Brief — 8:00 AM</span>
          <span style={f({ fontSize:12,color:C.t2 })}>Cash position +$1.2M this week. 3 signals require attention before Monday board call.</span>
        </div>
        <button onClick={()=>setView('ai-brief')} style={f({ fontSize:12,color:C.teal,background:'transparent',border:`1px solid ${C.teal}40`,
          borderRadius:6,padding:'5px 12px',cursor:'pointer',fontWeight:600 })}>
          Read Full Brief →
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14 }}>
        {kpis.map(k=>(
          <div key={k.label} style={{ background:C.bg2,border:`1px solid ${C.border}`,
            borderRadius:14,padding:'18px 20px',
            transition:'border-color 0.2s',cursor:'default' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=k.color+'55'}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
              <span style={f({ fontSize:11,color:C.t3,fontWeight:600,letterSpacing:'0.04em' })}>{k.label}</span>
              <Sparkline data={k.spark} color={k.color} up={k.up}/>
            </div>
            <div style={f({ fontSize:26,fontWeight:800,color:C.t1,letterSpacing:'-0.03em',marginBottom:8 })}>{k.value}</div>
            <div style={{ display:'flex',alignItems:'center',gap:5 }}>
              {k.up?<ArrowUpRight size={13} color={C.green}/>:<ArrowDownRight size={13} color={C.amber}/>}
              <span style={f({ fontSize:12,color:k.up?C.green:C.amber,fontWeight:600 })}>{k.delta}</span>
              <span style={f({ fontSize:11,color:C.t3 })}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main row: Chart + Signals */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:16 }}>
        {/* Cash Flow Chart */}
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={f({ fontSize:13,fontWeight:700,color:C.t1 })}>Revenue — Actual vs AI Forecast</span>
                {importedData && (
                  <span style={f({ fontSize:9,color:C.teal,fontWeight:700,padding:'1px 7px',
                    borderRadius:3,background:`${C.teal}16`,border:`1px solid ${C.teal}30` })}>
                    IMPORTED DATA
                  </span>
                )}
              </div>
              <div style={f({ fontSize:11,color:C.t3 })}>
                {importedData
                  ? `${importedData.allMonths[0]} – ${importedData.allMonths[importedData.allMonths.length-1]} · ${importedData.meta.actual} actual · ${importedData.meta.forecast} forecast months`
                  : 'Aug 2025 – Sep 2026 · Monthly ($M)'}
              </div>
            </div>
            <div style={{ display:'flex',gap:14,alignItems:'center' }}>
              {[{c:C.blue,l:'Actual'},{c:C.teal,l:'Forecast'},{c:`${C.teal}44`,l:'±Confidence'}].map(i=>(
                <div key={i.l} style={{ display:'flex',alignItems:'center',gap:5 }}>
                  <div style={{ width:14,height:i.l==='±Confidence'?8:2,
                    background:i.c,borderRadius:2,border:i.l==='±Confidence'?`1px solid ${C.teal}40`:'none' }}/>
                  <span style={f({ fontSize:10,color:C.t3 })}>{i.l}</span>
                </div>
              ))}
            </div>
          </div>
          <CashFlowChart importedData={importedData}/>
        </div>

        {/* AI Signals */}
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'18px',
          display:'flex',flexDirection:'column',gap:12 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <span style={f({ fontSize:12,fontWeight:700,color:C.t1 })}>AI Intelligence Feed</span>
            <div style={{ display:'flex',alignItems:'center',gap:5,padding:'3px 8px',
              borderRadius:4,background:`${C.green}14`,border:`1px solid ${C.green}30` }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:C.green,
                animation:'pulse 1.8s ease infinite' }}/>
              <span style={f({ fontSize:9,color:C.green,fontWeight:700 })}>LIVE</span>
            </div>
          </div>
          {/* Active signal */}
          <div key={sigIdx} style={{ padding:'12px',borderRadius:10,
            background:`${sig.color}0c`,border:`1px solid ${sig.color}30`,
            animation:'fadeIn 0.3s ease' }}>
            <div style={{ display:'flex',gap:8,alignItems:'flex-start' }}>
              <span style={f({ fontSize:9,color:sig.color,fontWeight:800,padding:'1px 5px',
                borderRadius:3,background:`${sig.color}20`,flexShrink:0 })}>{sig.sev}</span>
              <div>
                <div style={f({ fontSize:12,fontWeight:600,color:C.t1,marginBottom:4,lineHeight:1.4 })}>{sig.text}</div>
                <div style={f({ fontSize:11,color:C.t3,marginBottom:8 })}>{sig.sub}</div>
                <button style={f({ fontSize:10,color:sig.color,background:'transparent',
                  border:`1px solid ${sig.color}40`,borderRadius:5,padding:'3px 8px',cursor:'pointer',fontWeight:600 })}>
                  {sig.action}
                </button>
              </div>
            </div>
          </div>
          {/* Feed dots */}
          <div style={{ display:'flex',gap:5,justifyContent:'center' }}>
            {SIGNALS.map((_,i)=>(
              <div key={i} onClick={()=>setSigIdx(i)} style={{ cursor:'pointer',
                width:i===sigIdx?16:5,height:5,borderRadius:3,
                background:i===sigIdx?C.blue:C.borderMid,
                transition:'all 0.3s ease' }}/>
            ))}
          </div>
          {/* All signals mini */}
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:10,display:'flex',flexDirection:'column',gap:6 }}>
            {SIGNALS.slice(0,4).map((s,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',
                padding:'5px',borderRadius:6,transition:'background 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ width:6,height:6,borderRadius:'50%',background:s.color,flexShrink:0 }}/>
                <span style={f({ fontSize:11,color:C.t2,lineHeight:1.4 })}>{s.text.slice(0,38)}…</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Dept breakdown + Recent activity */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        {/* Department Opex */}
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18 }}>
            <span style={f({ fontSize:13,fontWeight:700,color:C.t1 })}>Department Opex — May 2026</span>
            <span style={f({ fontSize:11,color:C.t3 })}>Budget vs Spent</span>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {departments.map(d=>{
              const pct = Math.round((d.spent/d.budget)*100)
              return (
                <div key={d.name}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                    <span style={f({ fontSize:12,color:C.t2 })}>{d.name}</span>
                    <div style={{ display:'flex',gap:12 }}>
                      <span style={f({ fontSize:11,color:C.t3 })}>${d.spent}K / ${d.budget}K</span>
                      <span style={f({ fontSize:11,color:pct>85?C.amber:C.green,fontWeight:700 })}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height:5,background:C.bg3,borderRadius:3,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${pct}%`,borderRadius:3,
                      background:`linear-gradient(90deg,${d.color},${d.color}cc)`,
                      transition:'width 0.5s ease' }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Close status */}
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18 }}>
            <span style={f({ fontSize:13,fontWeight:700,color:C.t1 })}>Month-End Close — May 2026</span>
            <div style={{ padding:'3px 10px',borderRadius:4,background:`${C.amber}16`,border:`1px solid ${C.amber}30` }}>
              <span style={f({ fontSize:10,color:C.amber,fontWeight:700 })}>T-4 DAYS</span>
            </div>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {[
              { label:'Bank reconciliation',  done:true,  day:'May 20' },
              { label:'AR/AP reconciliation', done:true,  day:'May 21' },
              { label:'Payroll verification', done:true,  day:'May 22' },
              { label:'Intercompany elim.',   done:false, day:'May 24' },
              { label:'P&L finalization',     done:false, day:'May 25' },
              { label:'Board pack generation',done:false, day:'May 26' },
            ].map(t=>(
              <div key={t.label} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'8px 12px',borderRadius:8,
                background:t.done?`${C.green}08`:C.bg3,
                border:`1px solid ${t.done?C.green+'28':C.border}` }}>
                <div style={{ display:'flex',alignItems:'center',gap:9 }}>
                  {t.done
                    ? <CheckCircle2 size={13} color={C.green}/>
                    : <div style={{ width:13,height:13,borderRadius:'50%',border:`1.5px solid ${C.t3}` }}/>}
                  <span style={f({ fontSize:12,color:t.done?C.t2:C.t1 })}>{t.label}</span>
                </div>
                <span style={f({ fontSize:10,color:C.t3 })}>{t.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// FORECASTING
function Forecasting() {
  const [scenario, setScenario] = useState('base')
  const [revenueGrowth, setRevenueGrowth] = useState(18)
  const [costGrowth, setCostGrowth] = useState(12)
  const [churn, setChurn] = useState(3)

  const sc = SCENARIOS[scenario]

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
      {/* Scenario selector */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
        {[
          { id:'base', label:'Base Case', color:C.teal, desc:'Current trajectory based on run-rate' },
          { id:'optimistic', label:'Optimistic', color:C.green, desc:'+15% revenue, cost discipline' },
          { id:'stress', label:'Stress Test', color:C.red, desc:'-20% revenue, cost unchanged' },
        ].map(s=>(
          <button key={s.id} onClick={()=>setScenario(s.id)} style={f({
            padding:'18px 20px',borderRadius:14,border:`1px solid ${scenario===s.id?s.color+'60':C.border}`,
            background:scenario===s.id?`${s.color}12`:C.bg2,cursor:'pointer',textAlign:'left',
            transition:'all 0.2s',
          })}>
            <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
              <div style={{ width:10,height:10,borderRadius:'50%',background:s.color }}/>
              <span style={f({ fontSize:13,fontWeight:700,color:scenario===s.id?C.t1:C.t2 })}>{s.label}</span>
            </div>
            <div style={f({ fontSize:11,color:C.t3 })}>{s.desc}</div>
            <div style={f({ fontSize:16,fontWeight:800,color:s.color,marginTop:10 })}>{sc.runway}</div>
            <div style={f({ fontSize:10,color:C.t3 })}>projected runway</div>
          </button>
        ))}
      </div>

      {/* Chart + Assumptions */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 280px',gap:16 }}>
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px 24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:14 }}>
            <div>
              <div style={f({ fontSize:13,fontWeight:700,color:C.t1 })}>Cash Flow Forecast — {scenario.charAt(0).toUpperCase()+scenario.slice(1)} Scenario</div>
              <div style={f({ fontSize:11,color:C.t3 })}>Actual (10mo) + 5-month AI projection · ${sc.burn}/mo burn</div>
            </div>
            <div style={{ display:'flex',gap:8,alignItems:'center' }}>
              <span style={f({ fontSize:11,color:sc.color,fontWeight:700,padding:'3px 10px',
                borderRadius:4,background:`${sc.color}16`,border:`1px solid ${sc.color}35` })}>
                Runway: {sc.runway}
              </span>
            </div>
          </div>
          <CashFlowChart scenario={scenario}/>
        </div>

        {/* Assumptions */}
        <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px' }}>
          <div style={f({ fontSize:12,fontWeight:700,color:C.t1,marginBottom:18 })}>Assumptions</div>
          {[
            { label:'Revenue Growth',val:revenueGrowth,set:setRevenueGrowth,min:0,max:50,unit:'%',color:C.green },
            { label:'Cost Growth',   val:costGrowth,   set:setCostGrowth,   min:0,max:40,unit:'%',color:C.amber },
            { label:'Churn Rate',    val:churn,        set:setChurn,        min:0,max:20,unit:'%',color:C.red },
          ].map(inp=>(
            <div key={inp.label} style={{ marginBottom:18 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <span style={f({ fontSize:12,color:C.t2 })}>{inp.label}</span>
                <span style={f({ fontSize:14,fontWeight:800,color:inp.color })}>{inp.val}{inp.unit}</span>
              </div>
              <input type="range" min={inp.min} max={inp.max} value={inp.val}
                onChange={e=>inp.set(Number(e.target.value))}
                style={{ width:'100%',accentColor:inp.color,cursor:'pointer' }}/>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',flexDirection:'column',gap:10 }}>
            {[
              { label:'Projected Runway', value:sc.runway, color:C.teal },
              { label:'Burn Rate',        value:sc.burn,   color:C.amber },
              { label:'12-mo Revenue',    value:sc.data[sc.data.length-1]>8?'$'+sc.data[sc.data.length-1].toFixed(1)+'M':'$'+sc.data[sc.data.length-1].toFixed(1)+'M', color:C.blue },
            ].map(r=>(
              <div key={r.label} style={{ display:'flex',justifyContent:'space-between',
                padding:'8px 10px',borderRadius:7,background:C.bg3 }}>
                <span style={f({ fontSize:11,color:C.t2 })}>{r.label}</span>
                <span style={f({ fontSize:12,fontWeight:700,color:r.color })}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sensitivity table */}
      <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px' }}>
        <div style={f({ fontSize:13,fontWeight:700,color:C.t1,marginBottom:16 })}>Scenario Comparison</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Scenario','Q3 Revenue','Q4 Revenue','Runway','Burn Rate','Risk Level'].map(h=>(
                  <th key={h} style={f({ fontSize:10,color:C.t3,fontWeight:700,letterSpacing:'0.06em',
                    textTransform:'uppercase',padding:'8px 14px',textAlign:'left',
                    borderBottom:`1px solid ${C.border}` })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label:'Optimistic', q3:'$8.8M',  q4:'$11.8M', runway:'18.2mo', burn:'$780K', risk:'LOW',   color:C.green },
                { label:'Base Case',  q3:'$7.6M',  q4:'$9.2M',  runway:'11.4mo', burn:'$890K', risk:'MED',   color:C.teal },
                { label:'Stress',     q3:'$5.8M',  q4:'$5.2M',  runway:'7.1mo',  burn:'$1.1M', risk:'HIGH',  color:C.red },
              ].map((row,i)=>(
                <tr key={row.label} style={{ borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <div style={{ width:8,height:8,borderRadius:'50%',background:row.color }}/>
                      <span style={f({ fontSize:13,fontWeight:600,color:C.t1 })}>{row.label}</span>
                    </div>
                  </td>
                  {[row.q3,row.q4,row.runway,row.burn].map((v,vi)=>(
                    <td key={vi} style={f({ fontSize:13,color:C.t2,padding:'12px 14px' })}>{v}</td>
                  ))}
                  <td style={{ padding:'12px 14px' }}>
                    <span style={f({ fontSize:10,color:row.color,fontWeight:700,padding:'2px 8px',
                      borderRadius:4,background:`${row.color}16`,border:`1px solid ${row.color}30` })}>{row.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// REPORTS
function Reports() {
  const [reports, setReports] = useState(REPORTS)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    if (generating) return
    setGenerating(true)
    const newReport = {
      title: 'Custom Analysis — ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pages: 0, status: 'Generating', color: C.amber, date: 'In progress', type: 'Custom',
    }
    setReports(r => [newReport, ...r])
    setTimeout(() => {
      setReports(r => r.map((rep, i) => i === 0 ? { ...rep, status: 'Ready', color: C.green, pages: 9, date: 'Just now' } : rep))
      setGenerating(false)
    }, 3000)
  }

  const readyCount = reports.filter(r => r.status === 'Ready').length

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      {/* Header actions */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div style={f({ fontSize:13,color:C.t2 })}>{reports.length} reports · {readyCount} ready to export</div>
        <div style={{ display:'flex',gap:10 }}>
          <button style={f({ display:'flex',alignItems:'center',gap:7,padding:'8px 16px',
            borderRadius:8,border:`1px solid ${C.borderMid}`,background:'transparent',
            color:C.t2,fontSize:13,cursor:'pointer' })}>
            <Filter size={13}/> Filter
          </button>
          <button onClick={handleGenerate} style={f({ display:'flex',alignItems:'center',gap:7,padding:'8px 16px',
            borderRadius:8,border:'none',background:generating?C.bg3:C.blue,color:generating?C.t3:'#fff',fontSize:13,
            fontWeight:600,cursor:generating?'default':'pointer',boxShadow:generating?'none':`0 2px 12px ${C.blue}40`,
            transition:'all 0.3s' })}>
            <Plus size={13}/> {generating ? 'Generating…' : 'Generate Report'}
          </button>
        </div>
      </div>
      {/* Report cards */}
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {reports.map((r,i)=>(
          <div key={i} style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,
            padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',
            transition:'border-color 0.2s',cursor:'pointer',gap:20 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=r.color+'50'}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:'flex',alignItems:'center',gap:16,flex:1,minWidth:0 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:`${r.color}16`,
                border:`1px solid ${r.color}30`,display:'flex',alignItems:'center',justifyContent:'center',
                flexShrink:0 }}>
                <FileText size={18} color={r.color}/>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={f({ fontSize:14,fontWeight:600,color:C.t1,marginBottom:4 })}>{r.title}</div>
                <div style={{ display:'flex',gap:12 }}>
                  <span style={f({ fontSize:11,color:C.t3 })}>{r.pages} pages</span>
                  <span style={f({ fontSize:11,color:C.t3 })}>{r.type}</span>
                  <span style={f({ fontSize:11,color:C.t3 })}>{r.date}</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:12,flexShrink:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
                borderRadius:5,background:`${r.color}14`,border:`1px solid ${r.color}30` }}>
                {r.status==='Ready'&&<CheckCircle2 size={11} color={r.color}/>}
                {r.status==='Generating'&&<RefreshCw size={11} color={r.color}/>}
                {r.status==='Scheduled'&&<Clock size={11} color={r.color}/>}
                {r.status==='Draft'&&<Eye size={11} color={r.color}/>}
                <span style={f({ fontSize:11,color:r.color,fontWeight:600 })}>{r.status}</span>
              </div>
              {r.status==='Ready'&&(
                <button style={f({ display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
                  borderRadius:7,border:`1px solid ${C.borderMid}`,background:'transparent',
                  color:C.t2,fontSize:12,cursor:'pointer' })}>
                  <Download size={12}/> Export
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// AI BRIEF
function AIBrief() {
  return (
    <div style={{ display:'grid',gridTemplateColumns:'1fr 320px',gap:20 }}>
      {/* Today's brief */}
      <div style={{ background:C.bg2,border:`1px solid ${C.borderMid}`,borderRadius:16,overflow:'hidden',
        boxShadow:`0 0 40px ${C.teal}10` }}>
        {/* Email chrome */}
        <div style={{ background:C.bg3,padding:'12px 22px',borderBottom:`1px solid ${C.border}`,
          display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <Brain size={14} color={C.teal}/>
            <span style={f({ fontSize:12,color:C.t2,fontWeight:600 })}>Vantoryn Intelligence</span>
          </div>
          <span style={f({ fontSize:11,color:C.t3 })}>Friday, May 23, 2026 · 08:00 AM</span>
        </div>
        <div style={{ padding:'28px 28px' }}>
          <div style={f({ fontSize:20,fontWeight:800,color:C.t1,marginBottom:4,letterSpacing:'-0.02em' })}>
            CFO Intelligence Brief — Week 21
          </div>
          <div style={f({ fontSize:12,color:C.t3,marginBottom:24 })}>To: sarah.chen@company.com (CFO) · Acme Corp</div>

          {/* AI Summary */}
          <div style={{ padding:'16px 18px',borderRadius:12,background:`${C.teal}0a`,
            border:`1px solid ${C.teal}25`,marginBottom:20 }}>
            <div style={{ display:'flex',gap:8,alignItems:'center',marginBottom:10 }}>
              <Sparkles size={13} color={C.teal}/>
              <span style={f({ fontSize:11,color:C.teal,fontWeight:700 })}>AI Executive Summary</span>
            </div>
            <p style={f({ fontSize:13,color:C.t2,lineHeight:1.75,margin:0 })}>
              Cash position improved $1.2M this week — AP cycle optimization is yielding expected results.
              Q2 revenue is tracking 4% above plan ($14.2M vs $13.7M target). Three items require your
              attention before Monday's board call: payables exposure, Q3 Opex trajectory, and the AR
              aging issue in the enterprise segment.
            </p>
          </div>

          <div style={f({ fontSize:11,color:C.t3,fontWeight:700,letterSpacing:'0.08em',
            textTransform:'uppercase',marginBottom:12 })}>Signals requiring action</div>
          <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:24 }}>
            {SIGNALS.slice(0,4).map((s,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',
                borderRadius:9,background:`${s.color}0a`,border:`1px solid ${s.color}25` }}>
                <span style={f({ fontSize:9,color:s.color,fontWeight:800,padding:'1px 5px',
                  borderRadius:3,background:`${s.color}20`,flexShrink:0,marginTop:1 })}>{s.sev}</span>
                <div>
                  <div style={f({ fontSize:12,fontWeight:600,color:C.t1,marginBottom:3 })}>{s.text}</div>
                  <div style={f({ fontSize:11,color:C.t3 })}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={f({ fontSize:11,color:C.t3,fontWeight:700,letterSpacing:'0.08em',
            textTransform:'uppercase',marginBottom:12 })}>Key metrics this week</div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
            {[
              { label:'Revenue vs Plan', value:'+4.0%', color:C.green },
              { label:'Cash Position',   value:'+$1.2M', color:C.green },
              { label:'Close Progress',  value:'72%',   color:C.blue },
            ].map(m=>(
              <div key={m.label} style={{ background:C.bg3,border:`1px solid ${C.border}`,
                borderRadius:9,padding:'12px',textAlign:'center' }}>
                <div style={f({ fontSize:18,fontWeight:800,color:m.color,marginBottom:4 })}>{m.value}</div>
                <div style={f({ fontSize:10,color:C.t3 })}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brief history */}
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        <div style={f({ fontSize:13,fontWeight:700,color:C.t1 })}>Previous Briefs</div>
        {[
          { date:'Thu, May 22', headline:'Burn rate increase detected', signals:4 },
          { date:'Wed, May 21', headline:'Q3 forecast updated +6%', signals:2 },
          { date:'Tue, May 20', headline:'AR aging risk flagged', signals:3 },
          { date:'Mon, May 19', headline:'SAP sync complete — 1.2K txns', signals:1 },
          { date:'Fri, May 16', headline:'Board pack auto-generated', signals:0 },
        ].map((b,i)=>(
          <div key={i} style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,
            padding:'14px 16px',cursor:'pointer',transition:'border-color 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
              <div>
                <div style={f({ fontSize:11,color:C.t3,marginBottom:5 })}>{b.date}</div>
                <div style={f({ fontSize:13,color:C.t1,fontWeight:500 })}>{b.headline}</div>
              </div>
              {b.signals>0&&(
                <div style={{ padding:'2px 7px',borderRadius:10,background:`${C.amber}16`,
                  border:`1px solid ${C.amber}30` }}>
                  <span style={f({ fontSize:10,color:C.amber,fontWeight:700 })}>{b.signals}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ALERTS
function Alerts() {
  const [filter, setFilter] = useState('ALL')
  const [dismissed, setDismissed] = useState([])
  const all = SIGNALS.filter((_,i) => !dismissed.includes(i))
  const filtered = filter==='ALL' ? all : all.filter(s=>s.sev===filter)
  const FILTERS = ['ALL','HIGH','MED','LOW','INFO']
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ display:'flex',gap:8,alignItems:'center' }}>
        {FILTERS.map(lbl=>(
          <button key={lbl} onClick={()=>setFilter(lbl)} style={{
            padding:'6px 14px',borderRadius:7,cursor:'pointer',fontFamily:FONT,
            background: filter===lbl?C.blue:C.bg2,
            color: filter===lbl?'#fff':C.t2,
            fontSize:12,fontWeight:filter===lbl?700:500,
            border:`1px solid ${filter===lbl?C.blue:C.border}`,
            transition:'all 0.15s',
          }}>{lbl}</button>
        ))}
        <div style={{ marginLeft:'auto',fontSize:12,color:C.t3,fontFamily:FONT,alignSelf:'center' }}>
          {filtered.length} active · {dismissed.length} dismissed
        </div>
        {dismissed.length > 0 && (
          <button onClick={()=>setDismissed([])} style={f({
            fontSize:11,color:C.t3,background:'transparent',border:`1px solid ${C.border}`,
            borderRadius:6,padding:'4px 10px',cursor:'pointer',
          })}>Restore all</button>
        )}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center',padding:'48px',color:C.t3,fontFamily:FONT,fontSize:13 }}>
            No alerts match this filter.
          </div>
        )}
        {filtered.map((s,i)=>{
          const origIdx = SIGNALS.indexOf(s)
          return (
            <div key={origIdx} style={{ background:C.bg2,border:`1px solid ${s.color}30`,borderRadius:14,
              padding:'18px 22px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',
              gap:16, animation:'fadeIn 0.2s ease' }}>
              <div style={{ display:'flex',gap:14,flex:1,minWidth:0 }}>
                <div style={{ width:36,height:36,borderRadius:9,background:`${s.color}14`,
                  border:`1px solid ${s.color}30`,display:'flex',alignItems:'center',
                  justifyContent:'center',flexShrink:0 }}>
                  <AlertTriangle size={16} color={s.color}/>
                </div>
                <div>
                  <div style={{ display:'flex',gap:8,alignItems:'center',marginBottom:5 }}>
                    <span style={f({ fontSize:10,color:s.color,fontWeight:800,padding:'1px 7px',
                      borderRadius:4,background:`${s.color}16`,border:`1px solid ${s.color}30` })}>{s.sev}</span>
                    <span style={f({ fontSize:14,fontWeight:600,color:C.t1 })}>{s.text}</span>
                  </div>
                  <span style={f({ fontSize:12,color:C.t3 })}>{s.sub}</span>
                </div>
              </div>
              <div style={{ display:'flex',gap:8,flexShrink:0 }}>
                <button onClick={()=>setDismissed(d=>[...d,origIdx])} style={f({
                  padding:'7px 12px',borderRadius:7,border:`1px solid ${C.border}`,
                  background:'transparent',color:C.t3,fontSize:11,cursor:'pointer',
                })}>Dismiss</button>
                <button style={f({ padding:'7px 16px',borderRadius:7,border:`1px solid ${s.color}40`,
                  background:`${s.color}10`,color:s.color,fontSize:12,fontWeight:600,
                  cursor:'pointer',whiteSpace:'nowrap' })}>
                  {s.action}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// INTEGRATIONS
function Integrations({ onImport, importedData }) {
  const [importStatus, setImportStatus] = useState('idle') // idle | importing | success | error
  const [importMeta, setImportMeta]   = useState(null)
  const [fileName, setFileName]       = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const fileRef = useCallback(node => { if (node) node.value = '' }, [])

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) { setImportStatus('error'); return }
    setFileName(file.name)
    setImportStatus('importing')
    const reader = new FileReader()
    reader.onload = e => {
      setTimeout(() => {   // brief "importing" moment for UX
        const parsed = parseFinancialCSV(e.target.result)
        if (parsed) {
          onImport(parsed)
          setImportMeta(parsed.meta)
          setImportStatus('success')
        } else {
          setImportStatus('error')
        }
      }, 1200)
    }
    reader.readAsText(file)
  }

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
        {[
          { label:'Connected',     count:5, color:C.green },
          { label:'Warning',       count:1, color:C.amber },
          { label:'Disconnected',  count:2, color:C.t3    },
        ].map(s=>(
          <div key={s.label} style={{ background:C.bg2,border:`1px solid ${C.border}`,
            borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14 }}>
            <div style={{ fontSize:24,fontWeight:800,color:s.color,fontFamily:FONT }}>{s.count}</div>
            <div style={f({ fontSize:13,color:C.t2 })}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
        {INTEGRATIONS.map((ig,i)=>(
          <div key={i} style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,
            padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,
            transition:'border-color 0.2s',cursor:'pointer' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=ig.color+'50'}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:'flex',alignItems:'center',gap:14 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',flexShrink:0,
                background:ig.status==='connected'?C.green:ig.status==='warning'?C.amber:C.t4,
                boxShadow:ig.status==='connected'?`0 0 7px ${C.green}`:undefined }} />
              <div>
                <div style={f({ fontSize:14,fontWeight:600,color:ig.status==='disconnected'?C.t2:C.t1 })}>
                  {ig.name}
                </div>
                <div style={f({ fontSize:11,color:C.t3 })}>{ig.tier}</div>
              </div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:16 }}>
              <span style={f({ fontSize:11,color:C.t3 })}>
                {ig.status==='connected'?`Last sync: ${ig.lastSync}`
                  :ig.status==='warning'?`⚠ Stale — ${ig.lastSync}`
                  :'Not connected'}
              </span>
              <button style={f({ padding:'5px 14px',borderRadius:6,
                border:`1px solid ${ig.status==='disconnected'?C.blue+'50':C.borderMid}`,
                background: ig.status==='disconnected'?`${C.blue}14`:'transparent',
                color:ig.status==='disconnected'?C.blue:ig.status==='warning'?C.amber:C.t3,
                fontSize:12,fontWeight:600,cursor:'pointer' })}>
                {ig.status==='connected'?'Configure':ig.status==='warning'?'Reconnect':'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Add Integration */}
      <div style={{ background:`${C.blue}0a`,border:`1px solid ${C.blue}25`,borderRadius:12,padding:'16px 20px' }}>
        <div style={f({ fontSize:13,fontWeight:700,color:C.blue,marginBottom:6 })}>+ Add Integration</div>
        <div style={f({ fontSize:12,color:C.t2 })}>Connect Salesforce, HubSpot, Stripe, Gusto, Rippling, or any system with our API.</div>
      </div>

      {/* ── DEMO IMPORT SECTION ── */}
      <div style={{ borderTop:`2px dashed ${C.borderMid}`,paddingTop:20,marginTop:4 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16,flexWrap:'wrap',gap:12 }}>
          <div>
            <div style={f({ fontSize:14,fontWeight:800,color:C.t1,marginBottom:4 })}>Import Financial Data</div>
            <div style={f({ fontSize:12,color:C.t3 })}>
              Upload a CSV export from your ERP to instantly populate the dashboard with your own numbers.
            </div>
          </div>
          <button onClick={downloadDemo} style={f({
            display:'flex',alignItems:'center',gap:8,padding:'9px 18px',borderRadius:9,
            border:`1px solid ${C.borderMid}`,background:'transparent',
            color:C.t2,fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.2s',
            whiteSpace:'nowrap',
          })}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderMid;e.currentTarget.style.color=C.t2}}
          >
            <Download size={14}/> Download Demo CSV
          </button>
        </div>

        {/* Import status: success */}
        {importStatus === 'success' && importedData && (
          <div style={{ padding:'16px 20px',borderRadius:12,background:`${C.green}0a`,
            border:`1px solid ${C.green}40`,marginBottom:12,
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:16 }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <CheckCircle2 size={18} color={C.green}/>
              <div>
                <div style={f({ fontSize:13,fontWeight:700,color:C.green,marginBottom:2 })}>
                  Dataset imported — dashboard updated
                </div>
                <div style={f({ fontSize:11,color:C.t3 })}>
                  {fileName} · {importMeta?.rows} rows · {importMeta?.actual} actual months · {importMeta?.forecast} forecast months
                </div>
              </div>
            </div>
            <button onClick={()=>{onImport(null);setImportStatus('idle');setFileName('')}} style={f({
              fontSize:11,color:C.t3,background:'transparent',border:`1px solid ${C.border}`,
              borderRadius:6,padding:'5px 12px',cursor:'pointer',whiteSpace:'nowrap',
            })}>Clear import</button>
          </div>
        )}

        {/* Drop zone */}
        {importStatus !== 'success' && (
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true)}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            onClick={()=>document.getElementById('csv-upload-input').click()}
            style={{
              border:`2px dashed ${dragOver?C.blue:importStatus==='error'?C.red:C.borderMid}`,
              borderRadius:14,padding:'36px 24px',textAlign:'center',cursor:'pointer',
              background: dragOver?`${C.blue}08`:importStatus==='error'?`${C.red}08`:C.bg2,
              transition:'all 0.2s',
            }}
          >
            <input
              id="csv-upload-input"
              type="file"
              accept=".csv"
              style={{ display:'none' }}
              ref={fileRef}
              onChange={e=>handleFile(e.target.files[0])}
            />
            {importStatus === 'importing' ? (
              <div>
                <RefreshCw size={28} color={C.blue} style={{ margin:'0 auto 12px',display:'block',animation:'spin 1s linear infinite' }}/>
                <div style={f({ fontSize:14,fontWeight:700,color:C.t1,marginBottom:6 })}>Parsing dataset…</div>
                <div style={f({ fontSize:12,color:C.t3 })}>Reading {fileName}</div>
              </div>
            ) : importStatus === 'error' ? (
              <div>
                <AlertTriangle size={28} color={C.red} style={{ margin:'0 auto 12px',display:'block' }}/>
                <div style={f({ fontSize:14,fontWeight:700,color:C.red,marginBottom:6 })}>Invalid file format</div>
                <div style={f({ fontSize:12,color:C.t3 })}>Please upload a valid CSV file with the required columns. Download the demo to see the format.</div>
              </div>
            ) : (
              <div>
                <Database size={28} color={dragOver?C.blue:C.t3} style={{ margin:'0 auto 12px',display:'block',transition:'color 0.2s' }}/>
                <div style={f({ fontSize:14,fontWeight:600,color:dragOver?C.t1:C.t2,marginBottom:6,transition:'color 0.2s' })}>
                  Drop your CSV here, or click to browse
                </div>
                <div style={f({ fontSize:12,color:C.t3,marginBottom:16 })}>
                  Supports ERP exports from SAP, NetSuite, QuickBooks, Xero, or the demo template
                </div>
                <div style={{ display:'flex',justifyContent:'center',gap:16 }}>
                  {['Month','Revenue','EBITDA','Burn_Rate','Cash_Position'].map(col=>(
                    <span key={col} style={f({ fontSize:10,color:C.t3,background:C.bg3,
                      padding:'2px 8px',borderRadius:4,border:`1px solid ${C.border}`,fontFamily:'monospace' })}>
                      {col}
                    </span>
                  ))}
                  <span style={f({ fontSize:10,color:C.t3 })}>+ more…</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How it works steps */}
        {importStatus !== 'success' && (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16 }}>
            {[
              { n:1, title:'Download template',  desc:'Get the demo CSV to see the exact format your ERP should export' },
              { n:2, title:'Fill with your data', desc:'Replace Acme Corp numbers with your actual monthly financials' },
              { n:3, title:'Import & explore',    desc:'Drop the file above — KPIs, charts and departments update instantly' },
            ].map(s=>(
              <div key={s.n} style={{ display:'flex',gap:12,padding:'14px',borderRadius:10,
                background:C.bg3,border:`1px solid ${C.border}` }}>
                <div style={{ width:22,height:22,borderRadius:'50%',background:`${C.blue}18`,
                  border:`1px solid ${C.blue}35`,display:'flex',alignItems:'center',
                  justifyContent:'center',flexShrink:0 }}>
                  <span style={f({ fontSize:10,fontWeight:800,color:C.blue })}>{s.n}</span>
                </div>
                <div>
                  <div style={f({ fontSize:12,fontWeight:700,color:C.t1,marginBottom:3 })}>{s.title}</div>
                  <div style={f({ fontSize:11,color:C.t3,lineHeight:1.5 })}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// SETTINGS (stub)
function AppSettings() {
  return (
    <div style={{ background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:'32px',
      display:'flex',flexDirection:'column',gap:20,maxWidth:640 }}>
      <div style={f({ fontSize:15,fontWeight:700,color:C.t1 })}>Organization Settings</div>
      {[
        { label:'Company Name', value:'Acme Corporation' },
        { label:'Fiscal Year Start', value:'January 1' },
        { label:'Base Currency', value:'USD ($)' },
        { label:'Reporting Timezone', value:'America/New_York' },
      ].map(s=>(
        <div key={s.label}>
          <div style={f({ fontSize:11,color:C.t3,marginBottom:6,fontWeight:600 })}>{s.label}</div>
          <input defaultValue={s.value} style={f({
            width:'100%',padding:'10px 14px',borderRadius:8,
            background:C.bg3,border:`1px solid ${C.borderMid}`,
            color:C.t1,fontSize:14,outline:'none',
          })}
          onFocus={e=>e.target.style.borderColor=C.blue}
          onBlur={e=>e.target.style.borderColor=C.borderMid}
          />
        </div>
      ))}
      <button style={f({ alignSelf:'flex-start',padding:'10px 22px',borderRadius:9,
        background:C.blue,border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer' })}>
        Save Changes
      </button>
    </div>
  )
}

/* ─── PRODUCT ROOT ───────────────────────────────────────── */
export default function Product({ navigate, onLogout, session }) {
  const [view, setView]             = useState('overview')
  const [lastSync, setLastSync]     = useState('2 min ago')
  const [importedData, setImportedData] = useState(null)

  useEffect(()=>{
    const id = setInterval(()=>{
      const mins = Math.floor(Math.random()*3)+1
      setLastSync(`${mins} min ago`)
    }, 30000)
    return ()=>clearInterval(id)
  },[])

  const VIEWS = {
    overview:     <Overview setView={setView} importedData={importedData}/>,
    forecasting:  <Forecasting/>,
    reports:      <Reports/>,
    'ai-brief':   <AIBrief/>,
    alerts:       <Alerts/>,
    integrations: <Integrations onImport={setImportedData} importedData={importedData}/>,
    settings:     <AppSettings/>,
    guide:        <Guide/>,
  }

  return (
    <div style={{ background:C.bg0,minHeight:'100vh',fontFamily:FONT,display:'flex' }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input[type=range]{height:4px;border-radius:2px}
      `}</style>

      <Sidebar view={view} setView={v=>{setView(v)}} navigate={navigate}/>

      <div style={{ marginLeft:224,flex:1,display:'flex',flexDirection:'column' }}>
        <TopBar view={view} lastSync={lastSync} importedData={importedData} session={session} onLogout={onLogout}/>
        <main style={{ marginTop:56,padding:'28px',minHeight:'calc(100vh - 56px)',overflowY:'auto' }}>
          <div key={view} style={{ animation:'fadeIn 0.25s ease' }}>
            {VIEWS[view]}
          </div>
        </main>
      </div>
    </div>
  )
}

