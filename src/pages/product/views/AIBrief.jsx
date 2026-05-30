import { Brain, Sparkles } from 'lucide-react'
import { C, f } from '../../../tokens'
import { SIGNALS } from '../data'

export default function AIBrief() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
      {/* Today's brief */}
      <div style={{
        background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 16, overflow: 'hidden',
        boxShadow: `0 0 40px ${C.teal}10`,
      }}>
        {/* Email chrome */}
        <div style={{
          background: C.bg3, padding: '12px 22px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color={C.teal} />
            <span style={f({ fontSize: 12, color: C.t2, fontWeight: 600 })}>Vantoryn Intelligence</span>
          </div>
          <span style={f({ fontSize: 11, color: C.t3 })}>Friday, May 23, 2026 · 08:00 AM</span>
        </div>
        <div style={{ padding: '28px 28px' }}>
          <div style={f({ fontSize: 20, fontWeight: 800, color: C.t1, marginBottom: 4, letterSpacing: '-0.02em' })}>
            CFO Intelligence Brief — Week 21
          </div>
          <div style={f({ fontSize: 12, color: C.t3, marginBottom: 24 })}>To: sarah.chen@company.com (CFO) · Acme Corp</div>

          {/* AI Summary */}
          <div style={{
            padding: '16px 18px', borderRadius: 12, background: `${C.teal}0a`,
            border: `1px solid ${C.teal}25`, marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              <Sparkles size={13} color={C.teal} />
              <span style={f({ fontSize: 11, color: C.teal, fontWeight: 700 })}>AI Executive Summary</span>
            </div>
            <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.75, margin: 0 })}>
              Cash position improved $1.2M this week — AP cycle optimization is yielding expected results.
              Q2 revenue is tracking 4% above plan ($14.2M vs $13.7M target). Three items require your
              attention before Monday's board call: payables exposure, Q3 Opex trajectory, and the AR
              aging issue in the enterprise segment.
            </p>
          </div>

          <div style={f({
            fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 12,
          })}>Signals requiring action</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {SIGNALS.slice(0, 4).map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
                borderRadius: 9, background: `${s.color}0a`, border: `1px solid ${s.color}25`,
              }}>
                <span style={f({
                  fontSize: 9, color: s.color, fontWeight: 800, padding: '1px 5px',
                  borderRadius: 3, background: `${s.color}20`, flexShrink: 0, marginTop: 1,
                })}>{s.sev}</span>
                <div>
                  <div style={f({ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 3 })}>{s.text}</div>
                  <div style={f({ fontSize: 11, color: C.t3 })}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={f({
            fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 12,
          })}>Key metrics this week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'Revenue vs Plan', value: '+4.0%', color: C.green },
              { label: 'Cash Position',   value: '+$1.2M', color: C.green },
              { label: 'Close Progress',  value: '72%',   color: C.blue },
            ].map(m => (
              <div key={m.label} style={{
                background: C.bg3, border: `1px solid ${C.border}`,
                borderRadius: 9, padding: '12px', textAlign: 'center',
              }}>
                <div style={f({ fontSize: 18, fontWeight: 800, color: m.color, marginBottom: 4 })}>{m.value}</div>
                <div style={f({ fontSize: 10, color: C.t3 })}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brief history */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Previous Briefs</div>
        {[
          { date: 'Thu, May 22', headline: 'Burn rate increase detected', signals: 4 },
          { date: 'Wed, May 21', headline: 'Q3 forecast updated +6%', signals: 2 },
          { date: 'Tue, May 20', headline: 'AR aging risk flagged', signals: 3 },
          { date: 'Mon, May 19', headline: 'SAP sync complete — 1.2K txns', signals: 1 },
          { date: 'Fri, May 16', headline: 'Board pack auto-generated', signals: 0 },
        ].map((b, i) => (
          <div key={i} style={{
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={f({ fontSize: 11, color: C.t3, marginBottom: 5 })}>{b.date}</div>
                <div style={f({ fontSize: 13, color: C.t1, fontWeight: 500 })}>{b.headline}</div>
              </div>
              {b.signals > 0 && (
                <div style={{
                  padding: '2px 7px', borderRadius: 10,
                  background: `${C.amber}16`, border: `1px solid ${C.amber}30`,
                }}>
                  <span style={f({ fontSize: 10, color: C.amber, fontWeight: 700 })}>{b.signals}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
