import { useState } from 'react'
import {
  ChevronDown, Database, Shield, Users, Bell,
  CheckCircle2, Globe, Lock,
} from 'lucide-react'
import { C, f } from '../../../tokens'
import { ERP_SYSTEMS } from '../data'

function FAQItem({ q, a, last }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(o => !o)} style={f({
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0', background: 'transparent', border: 'none', cursor: 'pointer',
        textAlign: 'left', gap: 16,
      })}>
        <span style={f({ fontSize: 13, fontWeight: 600, color: C.t1 })}>{q}</span>
        <ChevronDown size={15} color={C.t3} style={{
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }} />
      </button>
      {open && <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.75, paddingBottom: 16 })}>{a}</div>}
    </div>
  )
}

export default function Guide() {
  const [expanded, setExpanded]   = useState(null)
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
    { id: 'erp',    label: 'Connect ERP',    desc: 'Link your primary financial system',   icon: <Database size={16} /> },
    { id: 'perms',  label: 'Set permissions', desc: 'Configure team access levels',         icon: <Shield size={16} /> },
    { id: 'team',   label: 'Invite your team', desc: 'Add FP&A leads and controllers',      icon: <Users size={16} /> },
    { id: 'alerts', label: 'Configure alerts', desc: 'Set thresholds for AI signals',       icon: <Bell size={16} /> },
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
              <div key={i} style={{
                height: 4, width: 44, borderRadius: 2,
                background: i < doneCount ? C.teal : C.bg3,
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {QUICK_STEPS.map(s => {
            const done = doneSteps[s.id]
            return (
              <div key={s.id}
                onClick={() => setDoneSteps(p => ({ ...p, [s.id]: !p[s.id] }))}
                style={{
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '4px 12px', borderRadius: 6, background: `${C.green}0c`, border: `1px solid ${C.green}25`,
          }}>
            <Lock size={10} color={C.green} />
            <span style={f({ fontSize: 10, color: C.green, fontWeight: 700 })}>SOC 2 TYPE II</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ERP_SYSTEMS.map(erp => {
            const isOpen       = expanded === erp.id
            const isConnected  = connected[erp.id]
            const isConnecting = connecting === erp.id
            return (
              <div key={erp.id} style={{
                background: C.bg2, borderRadius: 14, overflow: 'hidden',
                border: `1px solid ${isConnected ? C.green + '55' : isOpen ? C.borderHi : C.border}`,
                transition: 'border-color 0.2s',
              }}>
                {/* Header */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : erp.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: isConnected ? `${C.green}14` : `${C.blue}12`,
                      border: `1px solid ${isConnected ? C.green + '35' : C.blue + '30'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Database size={17} color={isConnected ? C.green : C.blue} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                        <span style={f({ fontSize: 14, fontWeight: 700, color: C.t1 })}>{erp.name}</span>
                        {isConnected && (
                          <span style={f({
                            fontSize: 9, color: C.green, fontWeight: 700, padding: '1px 7px',
                            borderRadius: 3, background: `${C.green}16`, border: `1px solid ${C.green}30`,
                          })}>✓ CONNECTED</span>
                        )}
                        {isConnecting && (
                          <span style={f({
                            fontSize: 9, color: C.amber, fontWeight: 700, padding: '1px 7px',
                            borderRadius: 3, background: `${C.amber}16`,
                          })}>CONNECTING…</span>
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
                      <div style={f({
                        fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.09em',
                        textTransform: 'uppercase', marginBottom: 16,
                      })}>Setup Steps</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {erp.steps.map((step, si) => (
                          <div key={si} style={{ display: 'flex', gap: 14 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: '50%', background: `${C.blue}16`,
                              border: `1px solid ${C.blue}35`, display: 'flex', alignItems: 'center',
                              justifyContent: 'center', flexShrink: 0, marginTop: 1,
                            }}>
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
                      <div style={f({
                        fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.09em',
                        textTransform: 'uppercase', marginBottom: 14,
                      })}>
                        {erp.oauth ? 'One-Click Connect' : 'Enter Credentials'}
                      </div>
                      {erp.oauth ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{
                            padding: '20px 16px', borderRadius: 10, background: C.bg3,
                            border: `1px solid ${C.border}`, textAlign: 'center',
                          }}>
                            <Globe size={26} color={C.blue} style={{ margin: '0 auto 12px' }} />
                            <p style={f({ fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 16, marginTop: 0 })}>
                              You will be redirected to {erp.name} to authorize read-only access.<br />No credentials are stored by Vantoryn.
                            </p>
                            <button
                              onClick={e => handleConnect(erp.id, e)}
                              style={f({
                                width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                                background: isConnected ? C.green : isConnecting ? C.bg4 : C.blue,
                                color: '#fff', fontSize: 13, fontWeight: 700,
                                cursor: isConnected ? 'default' : 'pointer',
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
                                onFocus={e => (e.target.style.borderColor = C.blue)}
                                onBlur={e => (e.target.style.borderColor = C.borderMid)}
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
            { scope: 'General Ledger',                   why: 'P&L and cash flow computation',      required: true },
            { scope: 'Financial Reports (P&L, BS, CF)',  why: 'Dashboard KPIs and variance',        required: true },
            { scope: 'Chart of Accounts',                why: 'Account mapping and categorization', required: true },
            { scope: 'AP / AR Aging',                    why: 'Cash exposure alerts',               required: true },
            { scope: 'Bank Reconciliation',              why: 'Cash position accuracy',             required: true },
            { scope: 'Payroll Summary',                  why: 'Headcount-driven Opex tracking',     required: false },
            { scope: 'Budget & Forecast Data',           why: 'Variance analysis vs plan',          required: false },
            { scope: 'Intercompany Transactions',        why: 'Multi-entity consolidation',         required: false },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 8, background: C.bg3, border: `1px solid ${C.border}`, gap: 10,
            }}>
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
