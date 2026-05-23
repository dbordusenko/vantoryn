// Home page — full Vantoryn landing (re-exported for router)
// This file re-uses the existing VantorynLanding component.
// Nav is handled by App.jsx router — VantorynLanding includes its own Nav
// so we just render it but its internal Nav sits behind the outer router Nav.
// For cleanliness we export a thin wrapper that accepts `navigate`.
import VantorynLanding from '../components/VantorynLanding'

export default function Home({ navigate, onBookDemo, onWaitlist }) {
  return <VantorynLanding navigate={navigate} onBookDemo={onBookDemo} onWaitlist={onWaitlist} />
}

