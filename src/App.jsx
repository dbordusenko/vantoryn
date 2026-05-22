import { useState, useCallback, useEffect } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Solutions from './pages/Solutions'
import Security from './pages/Security'
import Pricing from './pages/Pricing'
import Insights from './pages/Insights'
import Product from './pages/Product'
import { C, FONT, GLOBAL_STYLES } from './tokens'

const PAGES = {
  home:      Home,
  platform:  Platform,
  solutions: Solutions,
  security:  Security,
  pricing:   Pricing,
  insights:  Insights,
  product:   Product,
}

// Footer shared across all pages except Home (Home has its own)
function SharedFooter({ navigate }) {
  const f = s => ({ fontFamily: FONT, ...s })
  return (
    <footer style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: '40px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20 }}>
        <div onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
          <span style={f({ fontSize: 15, fontWeight: 700, color: C.t1 })}>FinAutomate</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Platform', page: 'platform' }, { label: 'Solutions', page: 'solutions' },
            { label: 'Security', page: 'security' }, { label: 'Pricing', page: 'pricing' },
            { label: 'Insights', page: 'insights' },
          ].map(l => (
            <button key={l.page} onClick={() => navigate(l.page)} style={f({
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: C.t3, fontWeight: 500, transition: 'color 0.2s',
            })}
            onMouseEnter={e => e.currentTarget.style.color = C.t2}
            onMouseLeave={e => e.currentTarget.style.color = C.t3}
            >{l.label}</button>
          ))}
        </div>
        <span style={f({ fontSize: 12, color: C.t4 })}>© 2026 FinAutomate. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [fadeOut, setFadeOut] = useState(false)

  const navigate = useCallback((to) => {
    if (to === page) return
    setFadeOut(true)
    setTimeout(() => {
      setPage(to)
      setFadeOut(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 180)
  }, [page])

  const Page = PAGES[page] || Home
  const isHome = page === 'home'
  const isProduct = page === 'product'

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: FONT }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Shared Nav — hidden inside the product app (it has its own sidebar) */}
      {!isProduct && <Nav currentPage={page} onNavigate={navigate} />}

      {/* Page transition wrapper */}
      <div style={{
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        <Page navigate={navigate} />
      </div>

      {/* Shared footer for sub-pages (not home, not product app) */}
      {!isHome && !isProduct && <SharedFooter navigate={navigate} />}
    </div>
  )
}
