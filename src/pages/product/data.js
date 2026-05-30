import { C } from '../../tokens'

/* ─── CHART DATA ─────────────────────────────────────────── */
export const MONTHS = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
export const CF_ACTUAL   = [3.8,4.1,3.7,4.5,4.8,4.4,5.2,5.6,5.3,6.1]
export const CF_FORECAST = [6.1,6.8,7.6,8.4,9.2]
export const CF_HI       = [6.1,7.2,8.1,9.1,10.2]
export const CF_LO       = [6.1,6.4,7.1,7.7,8.2]

export const SPARKS = {
  revenue: [12.0,11.8,12.5,13.1,12.8,13.5,14.2],
  ebitda:  [3.2,3.0,3.4,3.5,3.3,3.6,3.8],
  runway:  [13.5,13.2,12.8,12.5,12.1,11.8,11.4],
  burn:    [820,830,845,860,875,880,890],
}

export const DEPARTMENTS = [
  { name:'Engineering', budget:450, spent:398, color:C.blue },
  { name:'Sales & BD',  budget:280, spent:241, color:C.teal },
  { name:'Marketing',   budget:180, spent:162, color:C.purple },
  { name:'Product',     budget:160, spent:134, color:C.amber },
  { name:'G&A',         budget:120, spent:95,  color:C.green },
]

export const SIGNALS = [
  { sev:'HIGH',   color:C.red,    icon:'⚠', text:'AP payables spike +23% above plan',         sub:'$340K cash impact detected · Jul 2026',        action:'Review' },
  { sev:'MED',    color:C.amber,  icon:'▲', text:'Opex Q3 at 88% budget at Month 2',           sub:'Engineering team overage — $52K YTD',           action:'Drill down' },
  { sev:'LOW',    color:C.blue,   icon:'●', text:'AR aging: 3 invoices >60 days',              sub:'$420K exposure flagged · Action recommended',   action:'View AR' },
  { sev:'INFO',   color:C.green,  icon:'↑', text:'Revenue variance +$182K vs plan',            sub:'Tracking 4% ahead of Q2 target',                action:'Dismiss' },
  { sev:'MED',    color:C.purple, icon:'▼', text:'Payroll increased +12% vs prior month',      sub:'Headcount change: +3 FTE Engineering',          action:'Review' },
]

export const SCENARIOS = {
  base:       { data:[6.1,6.8,7.6,8.4,9.2],   runway:'11.4mo', burn:'$890K', color:C.teal   },
  optimistic: { data:[6.1,7.5,8.8,10.2,11.8],  runway:'18.2mo', burn:'$780K', color:C.green  },
  stress:     { data:[6.1,6.0,5.8,5.5,5.2],    runway:'7.1mo',  burn:'$1.1M', color:C.red    },
}

export const REPORTS = [
  { title:'Q2 2026 Board Pack',         pages:47, status:'Ready',       color:C.green,  date:'May 23, 2026',  type:'Board' },
  { title:'June Management Accounts',   pages:18, status:'Ready',       color:C.green,  date:'May 20, 2026',  type:'Monthly' },
  { title:'FP&A Variance Report — May', pages:12, status:'Ready',       color:C.green,  date:'May 19, 2026',  type:'Variance' },
  { title:'Cash Flow Forecast — Q3',    pages:8,  status:'Generating',  color:C.amber,  date:'In progress',   type:'Forecast' },
  { title:'FY2026 Budget vs Actual',    pages:22, status:'Scheduled',   color:C.blue,   date:'Jun 1, 2026',   type:'Annual' },
  { title:'Investor Update — Q2',       pages:15, status:'Draft',       color:C.purple, date:'May 25, 2026',  type:'Investor' },
]

export const INTEGRATIONS = [
  { name:'SAP ERP',          status:'connected',    lastSync:'2 min ago',  color:C.green, tier:'ERP' },
  { name:'Oracle NetSuite',  status:'connected',    lastSync:'2 min ago',  color:C.green, tier:'ERP' },
  { name:'QuickBooks',       status:'connected',    lastSync:'5 min ago',  color:C.green, tier:'Accounting' },
  { name:'Xero',             status:'connected',    lastSync:'12 min ago', color:C.green, tier:'Accounting' },
  { name:'Gusto Payroll',    status:'connected',    lastSync:'1 hr ago',   color:C.green, tier:'Payroll' },
  { name:'Stripe',           status:'warning',      lastSync:'3 hrs ago',  color:C.amber, tier:'Revenue' },
  { name:'Salesforce CRM',   status:'disconnected', lastSync:'Never',      color:C.t3,    tier:'CRM' },
  { name:'HubSpot',          status:'disconnected', lastSync:'Never',      color:C.t3,    tier:'CRM' },
]

export const ERP_SYSTEMS = [
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

/* ─── DEMO CSV ───────────────────────────────────────────── */
export const DEMO_CSV = `Month,Type,Revenue,COGS,Gross_Profit,Eng_Opex,Sales_Opex,Mktg_Opex,Product_Opex,GA_Opex,Total_Opex,EBITDA,Cash_Position,Burn_Rate,AR_Balance,AP_Balance,Headcount
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

export function downloadDemo() {
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

export function parseFinancialCSV(text) {
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

  const toM = v => Math.round(parseFloat(v) / 1e5) / 10
  const toK = v => Math.round(parseFloat(v) / 1000)

  const last = actual[actual.length - 1]
  const prev = actual[actual.length - 2] || last

  const cashActual   = actual.map(r => toM(r.Revenue))
  const cashForecast = [toM(last.Revenue), ...forecast.map(r => toM(r.Revenue))]
  const cashHi       = cashForecast.map((v, i) => i === 0 ? v : parseFloat((v * 1.12).toFixed(1)))
  const cashLo       = cashForecast.map((v, i) => i === 0 ? v : parseFloat((v * 0.88).toFixed(1)))

  const allMonths = rows.map(r => r.Month.slice(0, 3))

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

  const tail = actual.slice(-7)
  const sparklines = {
    revenue: tail.map(r => toM(r.Revenue)),
    ebitda:  tail.map(r => toM(r.EBITDA)),
    runway:  tail.map(r => parseFloat(r.Cash_Position) / parseFloat(r.Burn_Rate)),
    burn:    tail.map(r => toK(r.Burn_Rate)),
  }

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
