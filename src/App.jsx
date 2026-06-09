import { useState, useCallback, useEffect } from 'react'
import { usePageMeta } from './hooks/usePageMeta'
import { BrowserRouter, useNavigate as useRRNav, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Solutions from './pages/Solutions'
import Security from './pages/Security'
import Pricing from './pages/Pricing'
import Insights from './pages/Insights'
import Product from './pages/product'
import Cabinet from './pages/Cabinet'
import LogoShowcase from './pages/LogoShowcase'
import HealthScore from './pages/HealthScore'
import ApsDemo from './pages/ApsDemo'
import Login, { loadSession, clearSession } from './pages/Login'
import VantorynMark from './components/VantorynMark'
import BookDemoModal from './components/BookDemoModal'
import WaitlistModal from './components/WaitlistModal'
import ErrorBoundary from './components/ErrorBoundary'
import { C, FONT, GLOBAL_STYLES } from './tokens'

const PAGES = {
  home:      Home,
  platform:  Platform,
  solutions: Solutions,
  security:  Security,
  pricing:   Pricing,
  insights:  Insights,
  product:   Product,
  cabinet:   Cabinet,
  logos:     LogoShowcase,
  'health-score': HealthScore,
  'aps-demo': ApsDemo,
}

// Pages that require authentication
const AUTH_PAGES = new Set(['product', 'cabinet'])

// Footer shared across all pages except Home (Home has its own)
function SharedFooter({ navigate }) {
  const f = s => ({ fontFamily: FONT, ...s })
  const navLinks = [
    { label: 'Platform', page: 'platform' }, { label: 'Solutions', page: 'solutions' },
    { label: 'Security', page: 'security' }, { label: 'Pricing', page: 'pricing' },
    { label: 'Insights', page: 'insights' },
  ]
  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'contact@vantoryn.com', href: 'mailto:contact@vantoryn.com' },
  ]
  return (
    <footer style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: '36px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <VantorynMark size={28} />
            <span style={f({ fontSize: 15, fontWeight: 700, color: C.t1 })}>Vantoryn</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {navLinks.map(l => (
              <button key={l.page} onClick={() => navigate(l.page)} style={f({
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: C.t3, fontWeight: 500, transition: 'color 0.2s',
              })}
              onMouseEnter={e => e.currentTarget.style.color = C.t2}
              onMouseLeave={e => e.currentTarget.style.color = C.t3}
              >{l.label}</button>
            ))}
          </div>
        </div>
        {/* Bottom row */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12 }}>
          <span style={f({ fontSize: 12, color: C.t4 })}>© 2026 Vantoryn. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {legalLinks.map(l => (
              <a key={l.label} href={l.href} style={f({
                fontSize: 12, color: C.t4, textDecoration: 'none', transition: 'color 0.2s',
              })}
              onMouseEnter={e => e.currentTarget.style.color = C.t2}
              onMouseLeave={e => e.currentTarget.style.color = C.t4}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function AppContent() {
  const rrNav    = useRRNav()
  const location = useLocation()

  const urlPage    = location.pathname.slice(1) || 'home'
  const hasSession = !!loadSession()
  // Auth guard on direct URL load: if page requires auth and no session → show login
  const initialPage = PAGES[urlPage]
    ? (AUTH_PAGES.has(urlPage) && !hasSession ? 'home' : urlPage)
    : 'home'

  const [page, setPage]           = useState(initialPage)
  usePageMeta(page)
  const [fadeOut, setFadeOut]     = useState(false)
  const [session, setSession]     = useState(() => loadSession())
  const [showLogin, setShowLogin] = useState(() => AUTH_PAGES.has(urlPage) && !hasSession)
  const [showBookDemo, setShowBookDemo] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)

  // Sync browser back/forward button → state (with auth guard)
  useEffect(() => {
    const p = location.pathname.slice(1) || 'home'
    if (!PAGES[p] || p === page) return
    if (AUTH_PAGES.has(p) && !loadSession()) {
      setShowLogin(true)
      return
    }
    setPage(p)
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useCallback((to) => {
    if (AUTH_PAGES.has(to) && !loadSession()) {
      setShowLogin(true)
      return
    }
    if (to === page) return
    rrNav('/' + to)
    setFadeOut(true)
    setTimeout(() => {
      setPage(to)
      setFadeOut(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 180)
  }, [page, rrNav])

  function handleLoginSuccess(user) {
    setSession(user)
    setShowLogin(false)
    rrNav('/cabinet')
    setFadeOut(true)
    setTimeout(() => {
      setPage('cabinet')
      setFadeOut(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 180)
  }

  function handleLogout() {
    clearSession()
    setSession(null)
    rrNav('/home')
    setFadeOut(true)
    setTimeout(() => {
      setPage('home')
      setFadeOut(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 180)
  }

  const Page      = PAGES[page] || Home
  const isHome    = page === 'home'
  const isProduct = page === 'product'
  const isCabinet = page === 'cabinet'

  if (showLogin) {
    return (
      <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: FONT }}>
        <style>{GLOBAL_STYLES}</style>
        <Login
          onSuccess={handleLoginSuccess}
          onBack={() => setShowLogin(false)}
        />
      </div>
    )
  }

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: FONT }}>
      <style>{GLOBAL_STYLES}</style>

      {!isProduct && (
        <Nav
          currentPage={page}
          onNavigate={navigate}
          session={session}
          onBookDemo={() => setShowBookDemo(true)}
          onWaitlist={() => setShowWaitlist(true)}
        />
      )}

      {showBookDemo && <BookDemoModal onClose={() => setShowBookDemo(false)} />}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      <div style={{
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        <ErrorBoundary>
          <Page
            navigate={navigate}
            onLogout={handleLogout}
            session={session}
            onBookDemo={() => setShowBookDemo(true)}
            onWaitlist={() => setShowWaitlist(true)}
          />
        </ErrorBoundary>
      </div>

      {!isHome && !isProduct && !isCabinet && <SharedFooter navigate={navigate} />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
