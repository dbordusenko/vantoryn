import { useState, useEffect } from 'react'
import { BarChart3, ChevronDown, ArrowRight, Menu, X,
  Layers, Shield, Users, DollarSign, BookOpen, LayoutDashboard } from 'lucide-react'
import { C, f, FONT } from '../tokens'

const NAV_ITEMS = [
  { id: 'platform',  label: 'Platform',  icon: <Layers size={14} /> },
  { id: 'solutions', label: 'Solutions', icon: <Users size={14} /> },
  { id: 'security',  label: 'Security',  icon: <Shield size={14} /> },
  { id: 'insights',  label: 'Insights',  icon: <BookOpen size={14} /> },
  { id: 'pricing',   label: 'Pricing',   icon: <DollarSign size={14} /> },
]

export default function Nav({ currentPage, onNavigate }) {
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
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={f({ fontSize: 17, fontWeight: 700, color: C.t1, letterSpacing: '-0.025em' })}>
            FinAutomate
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
          <button onClick={() => go('product')} style={f({
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 14, color: C.teal, background: `${C.teal}12`,
            border: `1px solid ${C.teal}30`, borderRadius: 9,
            cursor: 'pointer', padding: '8px 16px', fontWeight: 600,
            transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.background = `${C.teal}20`; e.currentTarget.style.borderColor = `${C.teal}60` }}
          onMouseLeave={e => { e.currentTarget.style.background = `${C.teal}12`; e.currentTarget.style.borderColor = `${C.teal}30` }}
          >
            <LayoutDashboard size={14} />
            Launch App
          </button>
          <button onClick={() => go('pricing')} style={f({
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
          <button onClick={() => go('product')} style={f({
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            borderRadius: 9, border: `1px solid ${C.teal}30`, cursor: 'pointer',
            background: `${C.teal}12`, color: C.teal,
            fontSize: 15, fontWeight: 600, textAlign: 'left', marginTop: 8,
          })}>
            <LayoutDashboard size={16} /> Launch App
          </button>
        </div>
      )}
    </nav>
  )
}
