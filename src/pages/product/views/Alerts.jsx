import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { C, f, FONT } from '../../../tokens'
import { SIGNALS } from '../data'

export default function Alerts({ setView }) {
  const [filter, setFilter]       = useState('ALL')
  const [dismissed, setDismissed] = useState([])

  const all      = SIGNALS.filter((_, i) => !dismissed.includes(i))
  const filtered = filter === 'ALL' ? all : all.filter(s => s.sev === filter)
  const FILTERS  = ['ALL', 'HIGH', 'MED', 'LOW', 'INFO']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {FILTERS.map(lbl => (
          <button key={lbl} onClick={() => setFilter(lbl)} style={{
            padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: FONT,
            background: filter === lbl ? C.blue : C.bg2,
            color: filter === lbl ? '#fff' : C.t2,
            fontSize: 12, fontWeight: filter === lbl ? 700 : 500,
            border: `1px solid ${filter === lbl ? C.blue : C.border}`,
            transition: 'all 0.15s',
          }}>{lbl}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: C.t3, fontFamily: FONT, alignSelf: 'center' }}>
          {filtered.length} active · {dismissed.length} dismissed
        </div>
        {dismissed.length > 0 && (
          <button onClick={() => setDismissed([])} style={f({
            fontSize: 11, color: C.t3, background: 'transparent', border: `1px solid ${C.border}`,
            borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
          })}>Restore all</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: C.t3, fontFamily: FONT, fontSize: 13 }}>
            No alerts match this filter.
          </div>
        )}
        {filtered.map((s) => {
          const origIdx = SIGNALS.indexOf(s)
          return (
            <div key={origIdx} style={{
              background: C.bg2, border: `1px solid ${s.color}30`, borderRadius: 14,
              padding: '18px 22px', display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: 16, animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: `${s.color}14`,
                  border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <AlertTriangle size={16} color={s.color} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                    <span style={f({
                      fontSize: 10, color: s.color, fontWeight: 800, padding: '1px 7px',
                      borderRadius: 4, background: `${s.color}16`, border: `1px solid ${s.color}30`,
                    })}>{s.sev}</span>
                    <span style={f({ fontSize: 14, fontWeight: 600, color: C.t1 })}>{s.text}</span>
                  </div>
                  <span style={f({ fontSize: 12, color: C.t3 })}>{s.sub}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setDismissed(d => [...d, origIdx])} style={f({
                  padding: '7px 12px', borderRadius: 7, border: `1px solid ${C.border}`,
                  background: 'transparent', color: C.t3, fontSize: 11, cursor: 'pointer',
                })}>Dismiss</button>
                <button
                  onClick={() => {
                    if (s.action === 'Dismiss') setDismissed(d => [...d, origIdx])
                    else if (s.action === 'View AR') setView?.('reports')
                    else if (s.action === 'Drill down') setView?.('reports')
                    else if (s.action === 'Review') setView?.('forecasting')
                    else setDismissed(d => [...d, origIdx])
                  }}
                  style={f({
                    padding: '7px 16px', borderRadius: 7, border: `1px solid ${s.color}40`,
                    background: `${s.color}10`, color: s.color, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  })}>
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
