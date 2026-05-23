import { useState } from 'react'
import { C, f, FONT } from '../tokens'
import VantorynMark from '../components/VantorynMark'
import { getWaitlistData } from '../components/WaitlistModal'
import {
  LayoutDashboard, LogOut, Settings, Shield, Database,
  Clock, CheckCircle2, AlertTriangle, ChevronRight,
  Building2, Globe, Bell, Activity, User, Key, Users,
} from 'lucide-react'

const INTEGRATIONS = [
  { name: 'SAP S/4HANA',      status: 'connected', last: '2 min ago',  color: '#0070f3' },
  { name: 'Oracle NetSuite',  status: 'connected', last: '5 min ago',  color: '#e84040' },
  { name: 'QuickBooks',       status: 'connected', last: '12 min ago', color: '#2ca01c' },
  { name: 'Xero',             status: 'warning',   last: '3 hrs ago',  color: '#00b4f7' },
  { name: 'Workday',          status: 'disconnected', last: '—',       color: '#ff6b35' },
]

const ACTIVITY = [
  { action: 'AI Brief generated',      time: 'Today, 8:00 AM',   icon: Activity },
  { action: 'SAP sync completed',      time: 'Today, 7:54 AM',   icon: Database },
  { action: 'Board pack exported',     time: 'Yesterday, 5:22 PM', icon: CheckCircle2 },
  { action: 'Forecast model updated',  time: 'Yesterday, 2:10 PM', icon: Activity },
  { action: 'Alert: AR aging +11%',    time: 'Yesterday, 9:40 AM', icon: AlertTriangle },
]

function StatusDot({ status }) {
  const col = status === 'connected' ? C.green : status === 'warning' ? C.amber : C.t4
  return (
    <div style={{
      width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0,
      boxShadow: status === 'connected' ? `0 0 6px ${C.green}` : 'none',
    }}/>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.bg1, border: `1px solid ${C.borderMid}`,
      borderRadius: 14, padding: '24px', ...style,
    }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={f({ fontSize: 10, fontWeight: 700, color: C.t4,
      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 })}>
      {children}
    </div>
  )
}

export default function Cabinet({ navigate, onLogout, session }) {
  const [tab, setTab] = useState('overview')

  const name = session?.name  ?? 'User'
  const email = session?.email ?? ''
  const org   = session?.org  ?? 'Your Organization'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const isAdmin = email === 'admin@vantoryn.ai'
  const TABS = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'profile',   label: 'Profile'   },
    { id: 'security',  label: 'Security'  },
    ...(isAdmin ? [{ id: 'waitlist', label: 'Waitlist ✦' }] : []),
  ]

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 80, fontFamily: FONT }}>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.borderMid}` }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 32px 0' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Avatar */}
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
                boxShadow: `0 0 0 3px ${C.bg1}, 0 0 0 4px ${C.borderMid}`,
              }}>
                {initials}
              </div>
              <div>
                <div style={f({ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: '-0.03em' })}>
                  {name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <span style={f({ fontSize: 13, color: C.t3 })}>{email}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.t4 }}/>
                  <span style={f({ fontSize: 13, color: C.t3 })}>{org}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onLogout}
                style={f({
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'none', border: `1px solid ${C.borderMid}`,
                  borderRadius: 9, color: C.t3, fontSize: 13, fontWeight: 500,
                  padding: '8px 16px', cursor: 'pointer', transition: 'all 0.15s',
                })}
                onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = `${C.red}50` }}
                onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.borderMid }}
              >
                <LogOut size={14}/> Sign out
              </button>

              {/* LAUNCH APP — primary CTA */}
              <button
                onClick={() => navigate('product')}
                style={f({
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                  border: 'none', borderRadius: 10, color: '#fff',
                  fontSize: 14, fontWeight: 700, padding: '10px 22px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${C.blue}40`,
                })}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${C.blue}50` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.blue}40` }}
              >
                <LayoutDashboard size={15}/>
                Launch Vantoryn
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={f({
                padding: '10px 20px', background: 'none', border: 'none',
                borderBottom: tab === t.id ? `2px solid ${C.blue}` : '2px solid transparent',
                color: tab === t.id ? C.t1 : C.t3,
                fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s', marginBottom: -1,
              })}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* ═══ OVERVIEW TAB ═══════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Launch card */}
              <Card style={{
                background: `linear-gradient(135deg, ${C.bg2}, ${C.bg3})`,
                border: `1px solid ${C.borderHi}`,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Glow */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 180, height: 180, borderRadius: '50%',
                  background: `${C.blue}12`, filter: 'blur(40px)', pointerEvents: 'none',
                }}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={f({ fontSize: 12, color: C.teal, fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', marginBottom: 8 })}>
                      Vantoryn Intelligence Platform
                    </div>
                    <div style={f({ fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 6, letterSpacing: '-0.02em' })}>
                      Your financial command center
                    </div>
                    <div style={f({ fontSize: 13, color: C.t3, marginBottom: 20 })}>
                      3 ERP systems connected · Last sync 2 min ago · AI Brief ready
                    </div>
                    <button
                      onClick={() => navigate('product')}
                      style={f({
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: C.blue, border: 'none', borderRadius: 10,
                        color: '#fff', fontSize: 14, fontWeight: 700,
                        padding: '11px 24px', cursor: 'pointer',
                        boxShadow: `0 4px 20px ${C.blue}40`, transition: 'all 0.2s',
                      })}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <LayoutDashboard size={15}/> Open Dashboard
                    </button>
                  </div>
                  <VantorynMark size={90}/>
                </div>
              </Card>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {[
                  { label: 'Connected Systems', value: '3', sub: '2 pending', color: C.green },
                  { label: 'Reports Generated', value: '47', sub: 'this month', color: C.blue },
                  { label: 'AI Briefs Delivered', value: '128', sub: 'total', color: C.teal },
                ].map((s, i) => (
                  <Card key={i} style={{ padding: '18px 20px' }}>
                    <div style={f({ fontSize: 28, fontWeight: 800, color: s.color,
                      letterSpacing: '-0.04em', marginBottom: 2 })}>{s.value}</div>
                    <div style={f({ fontSize: 12, color: C.t1, fontWeight: 600, marginBottom: 2 })}>{s.label}</div>
                    <div style={f({ fontSize: 11, color: C.t3 })}>{s.sub}</div>
                  </Card>
                ))}
              </div>

              {/* Recent activity */}
              <Card>
                <SectionLabel>Recent Activity</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {ACTIVITY.map((a, i) => {
                    const Icon = a.icon
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 0',
                        borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={14} color={C.t3}/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={f({ fontSize: 13, color: C.t2 })}>{a.action}</div>
                        </div>
                        <div style={f({ fontSize: 11, color: C.t4 })}>{a.time}</div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Plan */}
              <Card>
                <SectionLabel>Current Plan</SectionLabel>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 3 })}>
                      FP&A Intelligence
                    </div>
                    <div style={f({ fontSize: 12, color: C.t3 })}>Annual · Renews Jan 2027</div>
                  </div>
                  <div style={{
                    background: `${C.teal}15`, border: `1px solid ${C.teal}30`,
                    borderRadius: 6, padding: '4px 10px',
                  }}>
                    <span style={f({ fontSize: 11, color: C.teal, fontWeight: 700 })}>ACTIVE</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Predictive forecasting', 'AI Morning Brief', 'Unlimited integrations', 'Priority support'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={13} color={C.teal}/>
                      <span style={f({ fontSize: 12, color: C.t3 })}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('pricing')}
                  style={f({
                    marginTop: 18, width: '100%', padding: '9px', borderRadius: 9,
                    background: C.bg3, border: `1px solid ${C.borderMid}`,
                    color: C.t2, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s',
                  })}
                  onMouseEnter={e => e.currentTarget.style.color = C.t1}
                  onMouseLeave={e => e.currentTarget.style.color = C.t2}
                >
                  Upgrade Plan
                </button>
              </Card>

              {/* Integrations */}
              <Card>
                <SectionLabel>Connected Systems</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {INTEGRATIONS.map((intg, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 0',
                      borderBottom: i < INTEGRATIONS.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <StatusDot status={intg.status}/>
                      <div style={{ flex: 1 }}>
                        <div style={f({ fontSize: 13, color: intg.status === 'disconnected' ? C.t4 : C.t2,
                          fontWeight: 500 })}>{intg.name}</div>
                        {intg.last !== '—' && (
                          <div style={f({ fontSize: 10, color: C.t4 })}>Synced {intg.last}</div>
                        )}
                      </div>
                      {intg.status === 'disconnected' && (
                        <span style={f({ fontSize: 10, color: C.t4 })}>Connect</span>
                      )}
                      {intg.status === 'warning' && (
                        <AlertTriangle size={12} color={C.amber}/>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('product')}
                  style={f({
                    marginTop: 14, width: '100%', padding: '9px', borderRadius: 9,
                    background: C.bg3, border: `1px solid ${C.borderMid}`,
                    color: C.t2, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  })}
                  onMouseEnter={e => e.currentTarget.style.color = C.t1}
                  onMouseLeave={e => e.currentTarget.style.color = C.t2}
                >
                  Manage in App <ChevronRight size={13}/>
                </button>
              </Card>

            </div>
          </div>
        )}

        {/* ═══ PROFILE TAB ════════════════════════════════════════════════ */}
        {tab === 'profile' && (
          <div style={{ maxWidth: 600 }}>
            <Card>
              <SectionLabel>Personal Information</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { label: 'Full name',     value: name,  icon: User },
                  { label: 'Work email',    value: email, icon: Globe },
                  { label: 'Organization',  value: org,   icon: Building2 },
                ].map((row, i) => {
                  const Icon = row.icon
                  return (
                    <div key={i}>
                      <label style={f({ fontSize: 12, color: C.t3, fontWeight: 500, display: 'block', marginBottom: 6 })}>
                        {row.label}
                      </label>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: C.bg2, border: `1px solid ${C.borderMid}`,
                        borderRadius: 10, padding: '11px 14px',
                      }}>
                        <Icon size={14} color={C.t4}/>
                        <span style={f({ fontSize: 14, color: C.t1 })}>{row.value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={f({ fontSize: 12, color: C.t4, marginTop: 20 })}>
                To update your profile details, contact your account administrator.
              </div>
            </Card>
          </div>
        )}

        {/* ═══ SECURITY TAB ═══════════════════════════════════════════════ */}
        {tab === 'security' && (
          <div style={{ maxWidth: 600 }}>
            <Card>
              <SectionLabel>Session & Access</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Current session', value: 'Active · This device', icon: Shield, color: C.green },
                  { label: 'Last login',       value: 'Today, 8:07 AM',        icon: Clock,  color: C.t3 },
                  { label: 'Session expires',  value: 'In 7 days',             icon: Key,    color: C.t3 },
                ].map((row, i) => {
                  const Icon = row.icon
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 0',
                      borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={15} color={row.color}/>
                      </div>
                      <div>
                        <div style={f({ fontSize: 12, color: C.t3, marginBottom: 2 })}>{row.label}</div>
                        <div style={f({ fontSize: 14, color: C.t1, fontWeight: 500 })}>{row.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={onLogout}
                style={f({
                  marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                  background: `${C.red}12`, border: `1px solid ${C.red}30`,
                  borderRadius: 10, color: C.red, fontSize: 13, fontWeight: 600,
                  padding: '10px 20px', cursor: 'pointer', transition: 'all 0.15s',
                })}
                onMouseEnter={e => e.currentTarget.style.background = `${C.red}20`}
                onMouseLeave={e => e.currentTarget.style.background = `${C.red}12`}
              >
                <LogOut size={14}/> Sign out of all sessions
              </button>
            </Card>
          </div>
        )}

        {/* ═══ WAITLIST TAB (admin only) ══════════════════════════════════ */}
        {tab === 'waitlist' && isAdmin && (() => {
          const entries = getWaitlistData()
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={18} color={C.teal} />
                  <span style={f({ fontSize: 18, fontWeight: 700, color: C.t1 })}>Waitlist</span>
                  <div style={{
                    background: `${C.teal}15`, border: `1px solid ${C.teal}30`,
                    borderRadius: 20, padding: '2px 10px',
                  }}>
                    <span style={f({ fontSize: 12, color: C.teal, fontWeight: 700 })}>{entries.length} entries</span>
                  </div>
                </div>
              </div>

              {entries.length === 0 ? (
                <Card>
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Users size={36} color={C.t4} style={{ margin: '0 auto 16px' }} />
                    <div style={f({ fontSize: 15, color: C.t3 })}>No waitlist entries yet.</div>
                    <div style={f({ fontSize: 13, color: C.t4, marginTop: 6 })}>Entries will appear here once people sign up.</div>
                  </div>
                </Card>
              ) : (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
                      <thead>
                        <tr style={{ background: C.bg2, borderBottom: `1px solid ${C.borderMid}` }}>
                          {['#', 'Name', 'Email', 'Company', 'Revenue', 'Role', 'Joined'].map((h, i) => (
                            <th key={h} style={f({
                              padding: '12px 16px', textAlign: 'left',
                              fontSize: 11, fontWeight: 700, color: C.t3,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              borderRight: i < 6 ? `1px solid ${C.border}` : 'none',
                            })}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((e, i) => (
                          <tr key={i} style={{
                            borderBottom: i < entries.length - 1 ? `1px solid ${C.border}` : 'none',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={ev => ev.currentTarget.style.background = C.bg2}
                          onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                          >
                            <td style={f({ padding: '12px 16px', fontSize: 13, color: C.t4, borderRight: `1px solid ${C.border}` })}>{i + 1}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 13, color: C.t1, fontWeight: 500, borderRight: `1px solid ${C.border}` })}>{e.name}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 13, color: C.t2, borderRight: `1px solid ${C.border}` })}>{e.email}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 13, color: C.t2, borderRight: `1px solid ${C.border}` })}>{e.company}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 12, color: e.revenue ? C.teal : C.t4, borderRight: `1px solid ${C.border}` })}>{e.revenue || '—'}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 13, color: C.t2, borderRight: `1px solid ${C.border}` })}>{e.role}</td>
                            <td style={f({ padding: '12px 16px', fontSize: 11, color: C.t3 })}>
                              {new Date(e.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )
        })()}

      </div>
    </div>
  )
}
