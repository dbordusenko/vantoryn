import { useState } from 'react'
import { Bell, ChevronDown, Database, LogOut } from 'lucide-react'
import { C, f } from '../../tokens'

const TITLES = {
  overview:     'Executive Overview',
  forecasting:  'Forecasting & Scenarios',
  production:   'Production & Supply Optimizer',
  reports:      'Reports & Board Packs',
  'ai-brief':   'AI Intelligence Brief',
  alerts:       'Risk Alerts & Signals',
  integrations: 'Data Integrations',
  settings:     'Settings',
  guide:        'Getting Started & ERP Setup',
}

export default function TopBar({ view, lastSync, importedData, session, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div style={{
      position: 'fixed', top: 0, left: 224, right: 0, height: 56, zIndex: 40,
      background: 'rgba(4,5,10,0.96)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
    }}>
      <div>
        <div style={f({ fontSize: 15, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em' })}>
          {TITLES[view]}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* ERP status */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {['SAP', 'NetSuite', 'QB'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 5px ${C.green}` }} />
              <span style={f({ fontSize: 10, color: C.t3 })}>{s}</span>
            </div>
          ))}
        </div>
        {importedData && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px',
            borderRadius: 4, background: `${C.teal}12`, border: `1px solid ${C.teal}30`,
          }}>
            <Database size={10} color={C.teal} />
            <span style={f({ fontSize: 9, color: C.teal, fontWeight: 700 })}>CUSTOM DATASET</span>
          </div>
        )}
        <div style={f({ fontSize: 10, color: C.t3 })}>Synced {lastSync}</div>
        {/* Notification */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={17} color={C.t2} />
          <div style={{
            position: 'absolute', top: -3, right: -3, width: 8, height: 8,
            borderRadius: '50%', background: C.red, border: `1px solid ${C.bg0}`,
          }} />
        </div>

        {/* User avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={f({
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.bg2, border: `1px solid ${C.borderMid}`,
              borderRadius: 50, padding: '4px 12px 4px 4px', cursor: 'pointer',
              transition: 'border-color 0.2s',
            })}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.borderMid)}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg,${C.blue},${C.teal})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>
              {session?.name?.[0] ?? 'U'}
            </div>
            <span style={f({ fontSize: 12, color: C.t1, fontWeight: 500 })}>
              {session?.name ?? 'User'}
            </span>
            <ChevronDown size={12} color={C.t3} />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200,
              background: C.bg2, border: `1px solid ${C.borderMid}`,
              borderRadius: 12, padding: 8, zIndex: 100,
              boxShadow: '0 16px 40px #00000060',
              animation: 'fadeIn 0.15s ease both',
            }}>
              <div style={{ padding: '8px 12px 10px', borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>
                <div style={f({ fontSize: 13, fontWeight: 600, color: C.t1 })}>{session?.name}</div>
                <div style={f({ fontSize: 11, color: C.t3 })}>{session?.email}</div>
                <div style={f({ fontSize: 10, color: C.t4, marginTop: 2 })}>{session?.org}</div>
              </div>
              <button
                onClick={() => { setShowUserMenu(false); onLogout?.() }}
                style={f({
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: C.red, fontSize: 13, fontWeight: 500,
                  textAlign: 'left', transition: 'background 0.15s',
                })}
                onMouseEnter={e => (e.currentTarget.style.background = `${C.red}12`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
