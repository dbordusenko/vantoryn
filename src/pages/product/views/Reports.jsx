import { useState } from 'react'
import {
  FileText, RefreshCw, Clock, Eye, CheckCircle2,
  Filter, Plus, Download,
} from 'lucide-react'
import { C, f, FONT } from '../../../tokens'
import { REPORTS, DEMO_CSV } from '../data'

export default function Reports() {
  const [reports, setReports]         = useState(REPORTS)
  const [generating, setGenerating]   = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [exportingIdx, setExportingIdx] = useState(null)
  const [showFilter, setShowFilter]   = useState(false)

  const FILTER_OPTIONS = ['All', 'Ready', 'Generating', 'Scheduled', 'Draft']

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

  const handleExport = (r, idx, e) => {
    e.stopPropagation()
    if (exportingIdx === idx) return
    setExportingIdx(idx)
    setTimeout(() => {
      const blob = new Blob([DEMO_CSV], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = r.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportingIdx(null)
    }, 800)
  }

  const visibleReports = filterStatus === 'All'
    ? reports
    : reports.filter(r => r.status === filterStatus)

  const readyCount = reports.filter(r => r.status === 'Ready').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={f({ fontSize: 13, color: C.t2 })}>{reports.length} reports · {readyCount} ready to export</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Filter dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilter(v => !v)}
              style={f({
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                borderRadius: 8, border: `1px solid ${filterStatus !== 'All' ? C.blue : C.borderMid}`,
                background: filterStatus !== 'All' ? `${C.blue}12` : 'transparent',
                color: filterStatus !== 'All' ? C.blue : C.t2, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s',
              })}>
              <Filter size={13} />
              {filterStatus === 'All' ? 'Filter' : filterStatus}
            </button>
            {showFilter && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: C.bg2, border: `1px solid ${C.borderMid}`,
                borderRadius: 10, padding: 6, zIndex: 50,
                boxShadow: '0 8px 24px #00000050', minWidth: 140,
              }}>
                {FILTER_OPTIONS.map(opt => (
                  <button key={opt}
                    onClick={() => { setFilterStatus(opt); setShowFilter(false) }}
                    style={f({
                      display: 'block', width: '100%', padding: '8px 12px',
                      borderRadius: 7, border: 'none', textAlign: 'left',
                      background: filterStatus === opt ? `${C.blue}18` : 'transparent',
                      color: filterStatus === opt ? C.blue : C.t2,
                      fontSize: 13, fontWeight: filterStatus === opt ? 700 : 500, cursor: 'pointer',
                    })}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleGenerate} style={f({
            display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
            borderRadius: 8, border: 'none',
            background: generating ? C.bg3 : C.blue,
            color: generating ? C.t3 : '#fff',
            fontSize: 13, fontWeight: 600,
            cursor: generating ? 'default' : 'pointer',
            boxShadow: generating ? 'none' : `0 2px 12px ${C.blue}40`,
            transition: 'all 0.3s',
          })}>
            <Plus size={13} /> {generating ? 'Generating…' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visibleReports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: C.t3, fontFamily: FONT, fontSize: 13 }}>
            No reports match this filter.
          </div>
        )}
        {visibleReports.map((r) => {
          const origIdx = reports.indexOf(r)
          const isExporting = exportingIdx === origIdx
          return (
            <div key={origIdx} style={{
              background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'border-color 0.2s', cursor: 'default', gap: 20,
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = r.color + '50')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: `${r.color}16`,
                  border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={18} color={r.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={f({ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 })}>{r.title}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={f({ fontSize: 11, color: C.t3 })}>{r.pages} pages</span>
                    <span style={f({ fontSize: 11, color: C.t3 })}>{r.type}</span>
                    <span style={f({ fontSize: 11, color: C.t3 })}>{r.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  borderRadius: 5, background: `${r.color}14`, border: `1px solid ${r.color}30`,
                }}>
                  {r.status === 'Ready'      && <CheckCircle2 size={11} color={r.color} />}
                  {r.status === 'Generating' && <RefreshCw size={11} color={r.color} style={{ animation: 'spin 1.2s linear infinite' }} />}
                  {r.status === 'Scheduled'  && <Clock size={11} color={r.color} />}
                  {r.status === 'Draft'      && <Eye size={11} color={r.color} />}
                  <span style={f({ fontSize: 11, color: r.color, fontWeight: 600 })}>{r.status}</span>
                </div>
                {r.status === 'Ready' && (
                  <button
                    onClick={e => handleExport(r, origIdx, e)}
                    style={f({
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                      borderRadius: 7, border: `1px solid ${isExporting ? C.green + '60' : C.borderMid}`,
                      background: isExporting ? `${C.green}10` : 'transparent',
                      color: isExporting ? C.green : C.t2,
                      fontSize: 12, cursor: isExporting ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                    })}>
                    {isExporting
                      ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Exporting…</>
                      : <><Download size={12} /> Export</>
                    }
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
