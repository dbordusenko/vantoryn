import { useState } from 'react'
import { C, f, FONT } from '../tokens'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import VantorynMark from '../components/VantorynMark'

/* ─── credentials ─────────────────────────────────────────────────── */
const USERS = [
  { email: 'demo@vantoryn.ai',  password: 'Vantoryn2026', name: 'Demo User',    org: 'Acme Corp' },
  { email: 'admin@vantoryn.ai', password: 'Admin2026!',   name: 'Dmytro B.',    org: 'Vantoryn'  },
]

const AUTH_KEY = 'vantoryn_auth'

export function saveSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    ...user,
    token: btoa(`${user.email}:${Date.now()}`),
    at: Date.now(),
  }))
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    // expire after 7 days
    if (Date.now() - s.at > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }
    return s
  } catch { return null }
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY)
}

/* ─── tiny Input component ─────────────────────────────────────────── */
function Input({ label, type = 'text', value, onChange, placeholder, error, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={f({ fontSize: 13, fontWeight: 500, color: C.t2 })}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={f({
            width: '100%', boxSizing: 'border-box',
            background: C.bg2, border: `1px solid ${error ? C.red : C.borderMid}`,
            borderRadius: 10, padding: right ? '11px 44px 11px 14px' : '11px 14px',
            fontSize: 14, color: C.t1, outline: 'none',
            transition: 'border 0.2s',
          })}
          onFocus={e => { e.target.style.borderColor = error ? C.red : C.blue }}
          onBlur={e => { e.target.style.borderColor = error ? C.red : C.borderMid }}
        />
        {right && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {right}
          </div>
        )}
      </div>
      {error && <span style={f({ fontSize: 12, color: C.red })}>{error}</span>}
    </div>
  )
}

/* ─── Login page ───────────────────────────────────────────────────── */
export default function Login({ onSuccess, onBack }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState({ email: '', password: '', general: '' })
  const [hint, setHint]         = useState(false)

  function validate() {
    const e = { email: '', password: '', general: '' }
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    setErr(e)
    return !e.email && !e.password
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErr({ email: '', password: '', general: '' })

    // simulate network latency
    await new Promise(r => setTimeout(r, 900))

    const user = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (user) {
      saveSession(user)
      onSuccess(user)
    } else {
      setErr(e => ({ ...e, general: 'Incorrect email or password' }))
      setLoading(false)
    }
  }

  const logoBox = { flexShrink: 0 }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      backgroundImage: `radial-gradient(ellipse 800px 500px at 50% 0%, ${C.blue}0d 0%, transparent 70%)`,
    }}>

      {/* Back link */}
      <div style={{ position: 'absolute', top: 24, left: 28 }}>
        <button onClick={onBack} style={f({
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: C.t3, fontWeight: 500,
          transition: 'color 0.2s',
        })}
        onMouseEnter={e => e.currentTarget.style.color = C.t2}
        onMouseLeave={e => e.currentTarget.style.color = C.t3}
        >
          <ArrowLeft size={14} /> Back to site
        </button>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: C.bg1, border: `1px solid ${C.borderMid}`,
        borderRadius: 18, padding: '40px 36px',
        boxShadow: `0 32px 80px #00000060, 0 0 0 1px ${C.border}`,
        animation: 'fadeUp 0.35s ease both',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={logoBox}><VantorynMark size={44} /></div>
          <div>
            <div style={f({ fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: '-0.03em' })}>
              Vantoryn
            </div>
            <div style={f({ fontSize: 12, color: C.t3 })}>AI Financial Operating System</div>
          </div>
        </div>

        <div style={f({ fontSize: 22, fontWeight: 700, color: C.t1, marginBottom: 4, letterSpacing: '-0.03em' })}>
          Sign in to your account
        </div>
        <div style={f({ fontSize: 13, color: C.t3, marginBottom: 28 })}>
          Enter your credentials to access the dashboard
        </div>

        {/* Global error */}
        {err.general && (
          <div style={{
            background: `${C.red}15`, border: `1px solid ${C.red}40`,
            borderRadius: 10, padding: '11px 14px', marginBottom: 20,
            animation: 'fadeIn 0.2s ease both',
          }}>
            <span style={f({ fontSize: 13, color: C.red })}>{err.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input
            label="Work email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(x => ({ ...x, email: '', general: '' })) }}
            placeholder="you@company.com"
            error={err.email}
          />

          <Input
            label="Password"
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setErr(x => ({ ...x, password: '', general: '' })) }}
            placeholder="••••••••••"
            error={err.password}
            right={
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 0 }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={loading}
            style={f({
              width: '100%', padding: '13px', borderRadius: 11, border: 'none',
              background: loading ? C.bg3 : `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
              color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : `0 4px 24px ${C.blue}40`,
              transition: 'all 0.2s', marginTop: 4,
            })}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in…</>
              : 'Sign in'}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ marginTop: 28, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <button
            onClick={() => setHint(v => !v)}
            style={f({
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: C.t3, fontWeight: 500,
              width: '100%', textAlign: 'center',
            })}
            onMouseEnter={e => e.currentTarget.style.color = C.t2}
            onMouseLeave={e => e.currentTarget.style.color = C.t3}
          >
            {hint ? 'Hide demo credentials ↑' : 'Show demo credentials ↓'}
          </button>

          {hint && (
            <div style={{
              marginTop: 14, background: C.bg2, border: `1px solid ${C.borderMid}`,
              borderRadius: 10, padding: '14px 16px',
              animation: 'fadeIn 0.2s ease both',
            }}>
              <div style={f({ fontSize: 12, color: C.t3, marginBottom: 10, fontWeight: 500 })}>
                Demo account
              </div>
              {[
                { label: 'Email', value: 'demo@vantoryn.ai' },
                { label: 'Password', value: 'Vantoryn2026' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={f({ fontSize: 12, color: C.t3 })}>{row.label}</span>
                  <button
                    onClick={() => {
                      if (row.label === 'Email') setEmail(row.value)
                      else setPassword(row.value)
                    }}
                    style={f({
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 12, color: C.teal, fontWeight: 600,
                      fontFamily: 'monospace',
                    })}
                  >
                    {row.value}
                  </button>
                </div>
              ))}
              <div style={f({ fontSize: 11, color: C.t4, marginTop: 8 })}>
                Click a value to auto-fill the field
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <div style={f({ fontSize: 12, color: C.t4, marginTop: 24, textAlign: 'center' })}>
        © 2026 Vantoryn · Enterprise financial intelligence
      </div>
    </div>
  )
}
