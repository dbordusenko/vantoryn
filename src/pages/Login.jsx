import { useState } from 'react'
import { C, f, FONT } from '../tokens'
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from 'lucide-react'
import VantorynMark from '../components/VantorynMark'

/* ─── built-in demo accounts ──────────────────────────────────────── */
const DEMO_USERS = [
  { email: 'demo@vantoryn.ai',  password: 'Vantoryn2026', name: 'Demo User',  org: 'Acme Corp' },
  { email: 'admin@vantoryn.ai', password: 'Admin2026!',   name: 'Dmytro B.',  org: 'Vantoryn'  },
]

const AUTH_KEY   = 'vantoryn_auth'
const USERS_KEY  = 'vantoryn_users'

function getRegisteredUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
function saveRegisteredUser(user) {
  const users = getRegisteredUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

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

/* ─── shared Input ─────────────────────────────────────────────────── */
function Input({ label, type = 'text', value, onChange, placeholder, error, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={f({ fontSize: 13, fontWeight: 500, color: C.t2 })}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={f({
            width: '100%', boxSizing: 'border-box',
            background: C.bg2, border: `1px solid ${error ? C.red : C.borderMid}`,
            borderRadius: 10, padding: right ? '11px 44px 11px 14px' : '11px 14px',
            fontSize: 14, color: C.t1, outline: 'none', transition: 'border 0.2s',
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

/* ─── password strength ────────────────────────────────────────────── */
function PasswordStrength({ pwd }) {
  const checks = [
    { label: '8+ characters', ok: pwd.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(pwd) },
    { label: 'Number', ok: /\d/.test(pwd) },
  ]
  if (!pwd) return null
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: -4 }}>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            background: c.ok ? C.green : C.bg4,
            border: `1px solid ${c.ok ? C.green : C.borderMid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {c.ok && <Check size={9} color="#fff" strokeWidth={3} />}
          </div>
          <span style={f({ fontSize: 11, color: c.ok ? C.green : C.t4 })}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Sign In form ─────────────────────────────────────────────────── */
function SignInForm({ onSuccess }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState({ email: '', password: '', general: '' })
  const [hint, setHint]         = useState(false)

  function validate() {
    const e = { email: '', password: '', general: '' }
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email'
    if (!password) e.password = 'Password is required'
    setErr(e)
    return !e.email && !e.password
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErr({ email: '', password: '', general: '' })
    await new Promise(r => setTimeout(r, 800))

    const allUsers = [...DEMO_USERS, ...getRegisteredUsers()]
    const user = allUsers.find(
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

  return (
    <>
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
        <Input label="Work email" type="email" value={email}
          onChange={e => { setEmail(e.target.value); setErr(x => ({ ...x, email: '', general: '' })) }}
          placeholder="you@company.com" error={err.email} />

        <Input label="Password" type={showPwd ? 'text' : 'password'} value={password}
          onChange={e => { setPassword(e.target.value); setErr(x => ({ ...x, password: '', general: '' })) }}
          placeholder="••••••••••" error={err.password}
          right={
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 0 }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } />

        <button type="submit" disabled={loading} style={f({
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
          {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in…</> : 'Sign in'}
        </button>
      </form>

      {/* Demo hint */}
      <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
        <button onClick={() => setHint(v => !v)} style={f({
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
            marginTop: 12, background: C.bg2, border: `1px solid ${C.borderMid}`,
            borderRadius: 10, padding: '14px 16px', animation: 'fadeIn 0.2s ease both',
          }}>
            <div style={f({ fontSize: 12, color: C.t3, marginBottom: 10, fontWeight: 500 })}>Demo account</div>
            {[
              { label: 'Email', value: 'demo@vantoryn.ai' },
              { label: 'Password', value: 'Vantoryn2026' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={f({ fontSize: 12, color: C.t3 })}>{row.label}</span>
                <button onClick={() => {
                  if (row.label === 'Email') setEmail(row.value)
                  else setPassword(row.value)
                }} style={f({
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: C.teal, fontWeight: 600, fontFamily: 'monospace',
                })}>
                  {row.value}
                </button>
              </div>
            ))}
            <div style={f({ fontSize: 11, color: C.t4, marginTop: 8 })}>Click a value to auto-fill</div>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Sign Up form ─────────────────────────────────────────────────── */
function SignUpForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', org: '', password: '', confirm: '' })
  const [showPwd, setShowPwd]     = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [agreed, setAgreed]       = useState(false)
  const [err, setErr]             = useState({})

  const set = field => e => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    setErr(p => ({ ...p, [field]: '', general: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name = 'Full name is required'
    if (!form.email.includes('@')) e.email = 'Valid work email required'
    if (!form.org.trim())      e.org = 'Company name is required'
    if (form.password.length < 8) e.password = 'At least 8 characters'
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must include uppercase letter'
    else if (!/\d/.test(form.password))    e.password = 'Must include a number'
    if (form.confirm !== form.password)    e.confirm  = 'Passwords do not match'
    if (!agreed) e.agreed = 'You must accept the disclaimer to continue'
    setErr(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    // Check email not already taken
    const allUsers = [...DEMO_USERS, ...getRegisteredUsers()]
    if (allUsers.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      setErr(e => ({ ...e, general: 'An account with this email already exists' }))
      setLoading(false)
      return
    }

    const newUser = { name: form.name, email: form.email, org: form.org, password: form.password }
    saveRegisteredUser(newUser)
    saveSession(newUser)
    onSuccess(newUser)
  }

  return (
    <>
      {err.general && (
        <div style={{
          background: `${C.red}15`, border: `1px solid ${C.red}40`,
          borderRadius: 10, padding: '11px 14px', marginBottom: 16,
          animation: 'fadeIn 0.2s ease both',
        }}>
          <span style={f({ fontSize: 13, color: C.red })}>{err.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Full name" value={form.name} onChange={set('name')}
          placeholder="Jane Smith" error={err.name} />

        <Input label="Work email" type="email" value={form.email} onChange={set('email')}
          placeholder="you@company.com" error={err.email} />

        <Input label="Company name" value={form.org} onChange={set('org')}
          placeholder="Acme Corp" error={err.org} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Input label="Password" type={showPwd ? 'text' : 'password'} value={form.password}
            onChange={set('password')} placeholder="Create a strong password" error={err.password}
            right={
              <button type="button" onClick={() => setShowPwd(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 0 }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            } />
          <PasswordStrength pwd={form.password} />
        </div>

        <Input label="Confirm password" type={showConf ? 'text' : 'password'} value={form.confirm}
          onChange={set('confirm')} placeholder="Repeat your password" error={err.confirm}
          right={
            <button type="button" onClick={() => setShowConf(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 0 }}>
              {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } />

        {/* Disclaimer checkbox */}
        <div style={{
          background: `${C.amber}0d`, border: `1px solid ${err.agreed ? C.red : `${C.amber}30`}`,
          borderRadius: 10, padding: '14px 16px',
          transition: 'border-color 0.2s',
        }}>
          <label style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => { setAgreed(e.target.checked); setErr(p => ({ ...p, agreed: '' })) }}
                style={{ position: 'absolute', opacity: 0, width: 18, height: 18, cursor: 'pointer', margin: 0 }}
              />
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                background: agreed ? C.blue : C.bg3,
                border: `1.5px solid ${agreed ? C.blue : (err.agreed ? C.red : C.borderMid)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
            </div>
            <span style={f({ fontSize: 12, color: C.t2, lineHeight: 1.6 })}>
              I understand that Vantoryn is a{' '}
              <span style={{ color: C.amber, fontWeight: 600 }}>decision-support tool</span>,
              not a financial advisor. All financial decisions remain my sole responsibility.
              Vantoryn{' '}
              <span style={{ color: C.t1, fontWeight: 600 }}>accepts no liability</span>{' '}
              for outcomes resulting from decisions made using this platform.
            </span>
          </label>
          {err.agreed && (
            <p style={f({ fontSize: 11, color: C.red, margin: '8px 0 0 30px' })}>{err.agreed}</p>
          )}
        </div>

        <button type="submit" disabled={loading} style={f({
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
            ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
            : 'Create account'}
        </button>

        <p style={f({ fontSize: 11, color: C.t4, textAlign: 'center', margin: 0, lineHeight: 1.6 })}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </>
  )
}

/* ─── Main Login page ──────────────────────────────────────────────── */
export default function Login({ onSuccess, onBack }) {
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'

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
          fontSize: 13, color: C.t3, fontWeight: 500, transition: 'color 0.2s',
        })}
        onMouseEnter={e => e.currentTarget.style.color = C.t2}
        onMouseLeave={e => e.currentTarget.style.color = C.t3}
        >
          <ArrowLeft size={14} /> Back to site
        </button>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: C.bg1, border: `1px solid ${C.borderMid}`,
        borderRadius: 18, padding: '36px 36px 32px',
        boxShadow: `0 32px 80px #00000060, 0 0 0 1px ${C.border}`,
        animation: 'fadeUp 0.35s ease both',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <VantorynMark size={44} />
          <div>
            <div style={f({ fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: '-0.03em' })}>Vantoryn</div>
            <div style={f({ fontSize: 12, color: C.t3 })}>AI Financial Operating System</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', background: C.bg2, borderRadius: 10,
          padding: 4, marginBottom: 28, border: `1px solid ${C.border}`,
        }}>
          {[
            { id: 'signin', label: 'Sign In' },
            { id: 'signup', label: 'Create Account' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={f({
              flex: 1, padding: '9px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: tab === t.id ? C.bg1 : 'transparent',
              color: tab === t.id ? C.t1 : C.t3,
              fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
              boxShadow: tab === t.id ? `0 1px 4px #0006` : 'none',
              transition: 'all 0.2s',
            })}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div style={f({ fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 4, letterSpacing: '-0.03em' })}>
          {tab === 'signin' ? 'Welcome back' : 'Create your account'}
        </div>
        <div style={f({ fontSize: 13, color: C.t3, marginBottom: 24 })}>
          {tab === 'signin'
            ? 'Sign in to access your financial dashboard'
            : 'Join finance teams using AI to close faster and forecast better'}
        </div>

        {/* Form */}
        {tab === 'signin'
          ? <SignInForm onSuccess={onSuccess} />
          : <SignUpForm onSuccess={onSuccess} />
        }
      </div>

      <div style={f({ fontSize: 12, color: C.t4, marginTop: 24, textAlign: 'center' })}>
        © 2026 Vantoryn · Enterprise financial intelligence
      </div>
    </div>
  )
}
