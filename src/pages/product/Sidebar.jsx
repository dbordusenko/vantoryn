import {
  LayoutDashboard, TrendingUp, FileText, Brain, Bell, PlugZap,
  Settings, ArrowLeft, BookOpen,
} from 'lucide-react'
import VantorynMark from '../../components/VantorynMark'
import { C, f } from '../../tokens'

const NAV = [
  { id: 'overview',     icon: <LayoutDashboard size={16} />, label: 'Overview' },
  { id: 'forecasting',  icon: <TrendingUp size={16} />,      label: 'Forecasting' },
  { id: 'reports',      icon: <FileText size={16} />,        label: 'Reports' },
  { id: 'ai-brief',     icon: <Brain size={16} />,           label: 'AI Brief' },
  { id: 'alerts',       icon: <Bell size={16} />,            label: 'Alerts', badge: 3 },
  { id: 'integrations', icon: <PlugZap size={16} />,         label: 'Integrations' },
  { id: 'settings',     icon: <Settings size={16} />,        label: 'Settings' },
  { id: 'guide',        icon: <BookOpen size={16} />,        label: 'Getting Started', divider: true },
]

export default function Sidebar({ view, setView, navigate, session }) {
  return (
    <div style={{
      width: 224, flexShrink: 0, background: C.bg1,
      borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <VantorynMark size={30} />
          <div>
            <div style={f({ fontSize: 14, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em' })}>Vantoryn</div>
            <div style={f({ fontSize: 10, color: C.t3 })}>Acme Corp · Finance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={f({
          fontSize: 10, color: C.t4, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '4px 10px 8px',
        })}>Platform</div>
        {NAV.map(item => {
          const active = view === item.id
          return (
            <div key={item.id}>
              {item.divider && (
                <div style={{ height: 1, background: C.border, margin: '8px 10px 8px', opacity: 0.6 }} />
              )}
              <button onClick={() => setView(item.id)} style={f({
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? `${C.blue}16` : 'transparent',
                marginBottom: 2, transition: 'all 0.15s',
              })}
                onMouseEnter={e => !active && (e.currentTarget.style.background = C.bg3)}
                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: active ? C.blue : C.t3 }}>{item.icon}</span>
                  <span style={f({ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? C.t1 : C.t2 })}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <div style={{ background: C.red, borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                    <span style={f({ fontSize: 9, color: '#fff', fontWeight: 700 })}>{item.badge}</span>
                  </div>
                )}
                {active && <div style={{ width: 3, height: 3, borderRadius: '50%', background: C.blue }} />}
              </button>
            </div>
          )
        })}
      </div>

      {/* User + Back */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => navigate('home')} style={f({
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 7, background: 'transparent', border: 'none', cursor: 'pointer',
          color: C.t3, fontSize: 12, width: '100%', marginBottom: 8,
          transition: 'color 0.15s',
        })}
          onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
          onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
        >
          <ArrowLeft size={13} /> Back to Marketing Site
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
          borderRadius: 8, background: C.bg3, border: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg,${C.blue},${C.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={f({ fontSize: 11, fontWeight: 700, color: '#fff' })}>
              {session?.name ? session.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <div style={f({ fontSize: 12, fontWeight: 600, color: C.t1 })}>{session?.name ?? 'User'}</div>
            <div style={f({ fontSize: 10, color: C.t3 })}>{session?.org ?? 'Finance'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
