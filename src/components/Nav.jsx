import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X,
  Layers, Shield, Users, DollarSign, BookOpen, LayoutDashboard } from 'lucide-react'
import { C, f, FONT } from '../tokens'
import VantorynMark from './VantorynMark'

const NAV_ITEMS = [
  { id: 'platform',  label: 'Platform',  icon: <Layers size={14} /> },
  { id: 'solutions', label: 'Solutions', icon: <Users size={14} /> },
  { id: 'security',  label: 'Security',  icon: <Shield size={14} /> },
  { id: 'insights',  label: 'Insights',  icon: <BookOpen size={14} /> },
  { id: 'pricing',   label: 'Pricing',   icon: <DollarSign size={14} /> },
]

export default function Nav({ currentPage, onNavigate, session, onBookDemo, onWaitlist }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (page) => { onNavigate(page); setMobile(false) }

  return (
    <nav style={f({
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled || mobile ? 'rgba(4,5,10,0.96)' : 'transparent',
      backdropFilter: scrolled || mobile ? 'blur(18px)' : 'none',
      borderBottom: scrolled || mobile ? `1px solid ${C.border}` : '1px solid transparent',
      transition: 'all 0.3s ease',
    })}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>

        {/* Logo */}
        <div onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <VantorynMark size={48} />
          <span style={f({ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: '-0.03em' })}>
            Vantoryn
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {NAV_ITEMS.map(item => {
            const isActive = currentPage === item.id
            return (
              <button key={item.id} onClick={() => go(item.id)} style={f({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? `${C.blue}14` : 'transparent',
                color: isActive ? C.blue : C.t2,
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s',
              })}
              onMouseEnter={e => !isActive && (e.currentTarget.style.color = C.t1)}
              onMouseLeave={e => !isActive && (e.currentTarget.style.color = C.t2)}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {session ? (
            /* Logged-in pill: avatar + name → goes to CABINET */
            <button onClick={() => go('cabinet')} style={f({
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: C.t1, background: C.bg2,
              border: `1px solid ${C.borderMid}`, borderRadius: 50,
              cursor: 'pointer', padding: '5px 14px 5px 5px', fontWeight: 500,
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {session.name?.[0] ?? '?'}
              </div>
              <span>{session.name}</span>
            </button>
          ) : (
            /* Not logged in — Sign In → cabinet */
            <button onClick={() => go('cabinet')} style={f({
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 14, color: C.t1, background: C.bg2,
              border: `1px solid ${C.borderMid}`, borderRadius: 9,
              cursor: 'pointer', padding: '8px 18px', fontWeight: 500,
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t1 }}
            >
              Sign In
            </button>
          )}
          <button onClick={() => onNavigate('health-score')} style={f({
            fontSize: 14, fontWeight: 500, color: C.teal,
            background: `${C.teal}10`, border: `1px solid ${C.teal}35`,
            borderRadius: 9, padding: '9px 18px', cursor: 'pointer',
            transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.teal}20`; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.teal}10`; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Get Health Score
          </button>
          <button onClick={onBookDemo} style={f({
            fontSize: 14, fontWeight: 600, color: '#fff',
            background: C.blue, border: 'none', borderRadius: 9,
            padding: '10px 22px', cursor: 'pointer',
            boxShadow: `0 0 24px ${C.blueGlow}`,
            transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.background = C.blueD; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Book CFO Demo
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMobile(m => !m)} style={f({
            display: 'none', background: 'transparent', border: 'none',
            color: C.t2, cursor: 'pointer', padding: 6,
          })}>
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 28px 20px',
          display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => go(item.id)} style={f({
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              borderRadius: 9, border: 'none', cursor: 'pointer',
              background: currentPage === item.id ? `${C.blue}14` : 'transparent',
              color: currentPage === item.id ? C.blue : C.t2,
              fontSize: 15, fontWeight: 500, textAlign: 'left',
            })}>
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => go('cabinet')} style={f({
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            borderRadius: 9, border: `1px solid ${C.borderMid}`, cursor: 'pointer',
            background: C.bg2, color: C.t1,
            fontSize: 15, fontWeight: 500, textAlign: 'left', marginTop: 8,
          })}>
            {session ? session.name : 'Sign In'}
          </button>
          <button onClick={() => { onNavigate('health-score'); setMobile(false) }} style={f({
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            borderRadius: 9, border: `1px solid ${C.teal}35`, cursor: 'pointer',
            background: `${C.teal}10`, color: C.teal,
            fontSize: 15, fontWeight: 500, textAlign: 'left',
          })}>
            Get Health Score
          </button>
        </div>
      )}
    </nav>
  )
}

