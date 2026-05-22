// Home page — full FinAutomate landing (re-exported for router)
// This file re-uses the existing FinAutomateLanding component.
// Nav is handled by App.jsx router — FinAutomateLanding includes its own Nav
// so we just render it but its internal Nav sits behind the outer router Nav.
// For cleanliness we export a thin wrapper that accepts `navigate`.
import FinAutomateLanding from '../components/FinAutomateLanding'

export default function Home({ navigate }) {
  return <FinAutomateLanding navigate={navigate} />
}
