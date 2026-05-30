import { useCallback, useState } from 'react'
import { CheckCircle2, RefreshCw, AlertTriangle, Download, Database, Lock, Globe } from 'lucide-react'
import { C, f } from '../../../tokens'
import { INTEGRATIONS, ERP_SYSTEMS, DEMO_CSV, downloadDemo, parseFinancialCSV } from '../data'

export default function Integrations({ onImport, importedData }) {
  const [importStatus, setImportStatus] = useState('idle')
  const [importMeta, setImportMeta]     = useState(null)
  const [fileName, setFileName]         = useState('')
  const [dragOver, setDragOver]         = useState(false)
  const fileRef = useCallback(node => { if (node) node.value = '' }, [])

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) { setImportStatus('error'); return }
    setFileName(file.name)
    setImportStatus('importing')
    const reader = new FileReader()
    reader.onload = e => {
      setTimeout(() => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Connected',    count: 5, color: C.green },
          { label: 'Warning',      count: 1, color: C.amber },
          { label: 'Disconnected', count: 2, color: C.t3    },
        ].map(s => (
          <div key={s.label} style={{
            background: C.bg2, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'inherit' }}>{s.count}</div>
            <div style={f({ fontSize: 13, color: C.t2 })}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Integration list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {INTEGRATIONS.map((ig, i) => (
          <div key={i} style={{
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, transition: 'border-color 0.2s', cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = ig.color + '50')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: ig.status === 'connected' ? C.green : ig.status === 'warning' ? C.amber : C.t4,
                boxShadow: ig.status === 'connected' ? `0 0 7px ${C.green}` : undefined,
              }} />
              <div>
                <div style={f({ fontSize: 14, fontWeight: 600, color: ig.status === 'disconnected' ? C.t2 : C.t1 })}>
                  {ig.name}
                </div>
                <div style={f({ fontSize: 11, color: C.t3 })}>{ig.tier}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={f({ fontSize: 11, color: C.t3 })}>
                {ig.status === 'connected' ? `Last sync: ${ig.lastSync}`
                  : ig.status === 'warning' ? `⚠ Stale — ${ig.lastSync}`
                    : 'Not connected'}
              </span>
              <button style={f({
                padding: '5px 14px', borderRadius: 6,
                border: `1px solid ${ig.status === 'disconnected' ? C.blue + '50' : C.borderMid}`,
                background: ig.status === 'disconnected' ? `${C.blue}14` : 'transparent',
                color: ig.status === 'disconnected' ? C.blue : ig.status === 'warning' ? C.amber : C.t3,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              })}>
                {ig.status === 'connected' ? 'Configure' : ig.status === 'warning' ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Integration */}
      <div style={{ background: `${C.blue}0a`, border: `1px solid ${C.blue}25`, borderRadius: 12, padding: '16px 20px' }}>
        <div style={f({ fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 6 })}>+ Add Integration</div>
        <div style={f({ fontSize: 12, color: C.t2 })}>Connect Salesforce, HubSpot, Stripe, Gusto, Rippling, or any system with our API.</div>
      </div>

      {/* Demo import section */}
      <div style={{ borderTop: `2px dashed ${C.borderMid}`, paddingTop: 20, marginTop: 4 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 16, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={f({ fontSize: 14, fontWeight: 800, color: C.t1, marginBottom: 4 })}>Import Financial Data</div>
            <div style={f({ fontSize: 12, color: C.t3 })}>
              Upload a CSV export from your ERP to instantly populate the dashboard with your own numbers.
            </div>
          </div>
          <button onClick={downloadDemo} style={f({
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 9,
            border: `1px solid ${C.borderMid}`, background: 'transparent',
            color: C.t2, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t2 }}
          >
            <Download size={14} /> Download Demo CSV
          </button>
        </div>

        {/* Success state */}
        {importStatus === 'success' && importedData && (
          <div style={{
            padding: '16px 20px', borderRadius: 12, background: `${C.green}0a`,
            border: `1px solid ${C.green}40`, marginBottom: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={18} color={C.green} />
              <div>
                <div style={f({ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 2 })}>
                  Dataset imported — dashboard updated
                </div>
                <div style={f({ fontSize: 11, color: C.t3 })}>
                  {fileName} · {importMeta?.rows} rows · {importMeta?.actual} actual months · {importMeta?.forecast} forecast months
                </div>
              </div>
            </div>
            <button onClick={() => { onImport(null); setImportStatus('idle'); setFileName('') }} style={f({
              fontSize: 11, color: C.t3, background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: 6, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
            })}>Clear import</button>
          </div>
        )}

        {/* Drop zone */}
        {importStatus !== 'success' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csv-upload-input').click()}
            style={{
              border: `2px dashed ${dragOver ? C.blue : importStatus === 'error' ? C.red : C.borderMid}`,
              borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? `${C.blue}08` : importStatus === 'error' ? `${C.red}08` : C.bg2,
              transition: 'all 0.2s',
            }}
          >
            <input
              id="csv-upload-input"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={e => handleFile(e.target.files[0])}
            />
            {importStatus === 'importing' ? (
              <div>
                <RefreshCw size={28} color={C.blue} style={{ margin: '0 auto 12px', display: 'block', animation: 'spin 1s linear infinite' }} />
                <div style={f({ fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 6 })}>Parsing dataset…</div>
                <div style={f({ fontSize: 12, color: C.t3 })}>Reading {fileName}</div>
              </div>
            ) : importStatus === 'error' ? (
              <div>
                <AlertTriangle size={28} color={C.red} style={{ margin: '0 auto 12px', display: 'block' }} />
                <div style={f({ fontSize: 14, fontWeight: 700, color: C.red, marginBottom: 6 })}>Invalid file format</div>
                <div style={f({ fontSize: 12, color: C.t3 })}>Please upload a valid CSV file with the required columns. Download the demo to see the format.</div>
              </div>
            ) : (
              <div>
                <Database size={28} color={dragOver ? C.blue : C.t3} style={{ margin: '0 auto 12px', display: 'block', transition: 'color 0.2s' }} />
                <div style={f({ fontSize: 14, fontWeight: 600, color: dragOver ? C.t1 : C.t2, marginBottom: 6, transition: 'color 0.2s' })}>
                  Drop your CSV here, or click to browse
                </div>
                <div style={f({ fontSize: 12, color: C.t3, marginBottom: 16 })}>
                  Supports ERP exports from SAP, NetSuite, QuickBooks, Xero, or the demo template
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  {['Month', 'Revenue', 'EBITDA', 'Burn_Rate', 'Cash_Position'].map(col => (
                    <span key={col} style={f({
                      fontSize: 10, color: C.t3, background: C.bg3,
                      padding: '2px 8px', borderRadius: 4, border: `1px solid ${C.border}`, fontFamily: 'monospace',
                    })}>
                      {col}
                    </span>
                  ))}
                  <span style={f({ fontSize: 10, color: C.t3 })}>+ more…</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        {importStatus !== 'success' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
            {[
              { n: 1, title: 'Download template',   desc: 'Get the demo CSV to see the exact format your ERP should export' },
              { n: 2, title: 'Fill with your data', desc: 'Replace Acme Corp numbers with your actual monthly financials' },
              { n: 3, title: 'Import & explore',    desc: 'Drop the file above — KPIs, charts and departments update instantly' },
            ].map(s => (
              <div key={s.n} style={{
                display: 'flex', gap: 12, padding: '14px', borderRadius: 10,
                background: C.bg3, border: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: `${C.blue}18`,
                  border: `1px solid ${C.blue}35`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={f({ fontSize: 10, fontWeight: 800, color: C.blue })}>{s.n}</span>
                </div>
                <div>
                  <div style={f({ fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 3 })}>{s.title}</div>
                  <div style={f({ fontSize: 11, color: C.t3, lineHeight: 1.5 })}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
