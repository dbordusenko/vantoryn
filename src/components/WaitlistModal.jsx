import { useState, useEffect } from 'react'
import { X, Check, Users, Loader2, ArrowRight, Building2, Mail, User, TrendingUp } from 'lucide-react'
import { C, f, FONT } from '../tokens'
import VantorynMark from './VantorynMark'

/* ─── storage ────────────────────────────────────────────── */
const WAITLIST_KEY = 'vantoryn_waitlist'

function getWaitlist() {
  try { return JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]') } catch { return [] }
}

export function getWaitlistData() { return getWaitlist() }
export function getWaitlistCount() { return getWaitlist().length }

function addToWaitlist(entry) {
  const list = getWaitlist()
  const dup = list.findIndex(e => e.email.toLowerCase() === entry.email.toLowerCase())
  if (dup !== -1) return { position: dup + 1, duplicate: true }
  list.push({ ...entry, at: new Date().toISOString() })
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(list))
  return { position: list.length, duplicate: false }
}

/* ─── config ─────────────────────────────────────────────── */
const REVENUE_RANGES = ['<$5M', '$5M–$25M', '$25M–$100M', '$100M–$500M', '$500M+']
const ROLES = ['CFO', 'VP Finance', 'Controller', 'FP&A Director', 'CEO / Founder', 'Other']

/* ─── component ──────────────────────────────────────────── */
export default function WaitlistModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', revenue: '', role: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  const count = getWaitlistCount()

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  function set(field) {
    return val => {
      setForm(p => ({ ...p, [field]: val }))
      setErrors(p => ({ ...p, [field]: '' }))
    }
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name    = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.company.trim()) e.company = 'Required'
    if (!form.role)           e.role    = 'Please select your role'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const result = addToWaitlist(form)
    setConfirmed(result)
    setLoading(false)
  }

  /* ── backdrop + modal shell ── */
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,5,10,0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        background: C.bg1, border: `1px solid ${C.borderMid}`,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px ${C.border}`,
        animation: 'fadeUp 0.25s ease both',
      }}>

        {/* header */}
        <div style={{
          padding: '22px 24px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VantorynMark size={36} />
            <div>
              <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>Join the Waitlist</div>
              <div style={f({ fontSize: 12, color: C.t3 })}>Early access · Priority onboarding</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.t3, padding: 4, borderRadius: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.t1}
          onMouseLeave={e => e.currentTarget.style.color = C.t3}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 28px' }}>

          {/* ── CONFIRMATION ── */}
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `${C.green}15`, border: `1.5px solid ${C.green}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Check size={28} color={C.green} strokeWidth={2.5} />
              </div>

              <div style={f({ fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 10 })}>
                {confirmed.duplicate ? "You're already on the list!" : "You're on the list!"}
              </div>

              {!confirmed.duplicate && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: `${C.blue}12`, border: `1px solid ${C.blue}25`,
                  borderRadius: 50, padding: '6px 18px', marginBottom: 16,
                }}>
                  <Users size={14} color={C.blue} />
                  <span style={f({ fontSize: 13, color: C.blue, fontWeight: 600 })}>
                    #{confirmed.position} on the waitlist
                  </span>
                </div>
              )}

              <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 24px' })}>
                We'll reach out to <strong style={{ color: C.t1 }}>{form.email}</strong> when
                your access is ready. Finance teams with larger portfolios get priority.
              </p>

              <button onClick={onClose} style={f({
                width: '100%', padding: '13px', borderRadius: 11, border: 'none',
                background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              })}>
                Done
              </button>
            </div>

          ) : (
            /* ── FORM ── */
            <>
              {/* social proof counter */}
              {count > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: `${C.teal}0d`, border: `1px solid ${C.teal}20`,
                  borderRadius: 9, padding: '9px 14px', marginBottom: 20,
                }}>
                  <Users size={13} color={C.teal} />
                  <span style={f({ fontSize: 12, color: C.teal, fontWeight: 500 })}>
                    <strong>{count}</strong> finance teams already joined
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Name */}
                <Field label="Full name" icon={<User size={13} />} error={errors.name}>
                  <input
                    value={form.name} onChange={e => set('name')(e.target.value)}
                    placeholder="Jane Smith"
                    style={inputStyle(errors.name)}
                    onFocus={e => e.target.style.borderColor = errors.name ? C.red : C.blue}
                    onBlur={e => e.target.style.borderColor = errors.name ? C.red : C.borderMid}
                  />
                </Field>

                {/* Email */}
                <Field label="Work email" icon={<Mail size={13} />} error={errors.email}>
                  <input
                    type="email" value={form.email} onChange={e => set('email')(e.target.value)}
                    placeholder="you@company.com"
                    style={inputStyle(errors.email)}
                    onFocus={e => e.target.style.borderColor = errors.email ? C.red : C.blue}
                    onBlur={e => e.target.style.borderColor = errors.email ? C.red : C.borderMid}
                  />
                </Field>

                {/* Company */}
                <Field label="Company name" icon={<Building2 size={13} />} error={errors.company}>
                  <input
                    value={form.company} onChange={e => set('company')(e.target.value)}
                    placeholder="Acme Corp"
                    style={inputStyle(errors.company)}
                    onFocus={e => e.target.style.borderColor = errors.company ? C.red : C.blue}
                    onBlur={e => e.target.style.borderColor = errors.company ? C.red : C.borderMid}
                  />
                </Field>

                {/* Role */}
                <Field label="Your role" icon={<User size={13} />} error={errors.role}>
                  <select
                    value={form.role}
                    onChange={e => set('role')(e.target.value)}
                    style={{
                      ...inputStyle(errors.role),
                      appearance: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">Select role…</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                {/* Revenue range chips */}
                <div>
                  <div style={f({ fontSize: 12, color: C.t3, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 })}>
                    <TrendingUp size={13} />
                    Annual revenue <span style={{ color: C.t4 }}>(optional)</span>
                  </div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {REVENUE_RANGES.map(r => (
                      <button key={r} type="button" onClick={() => set('revenue')(form.revenue === r ? '' : r)}
                        style={f({
                          fontSize: 12, fontWeight: 500, borderRadius: 7, padding: '6px 12px',
                          border: `1px solid ${form.revenue === r ? C.blue : C.borderMid}`,
                          background: form.revenue === r ? `${C.blue}15` : C.bg2,
                          color: form.revenue === r ? C.blue : C.t2,
                          cursor: 'pointer', transition: 'all 0.15s',
                        })}
                      >{r}</button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} style={f({
                  width: '100%', padding: '13px', borderRadius: 11, border: 'none',
                  background: loading ? C.bg3 : `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : `0 4px 24px ${C.blue}40`,
                  transition: 'all 0.2s', marginTop: 4,
                })}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {loading
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Joining…</>
                    : <> Request Early Access <ArrowRight size={15} /></>}
                </button>

                <p style={f({ fontSize: 11, color: C.t4, textAlign: 'center', margin: 0, lineHeight: 1.6 })}>
                  No commitment. We'll reach out when your spot is ready.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── helpers ─────────────────────────────────────────────── */
function Field({ label, icon, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={f({ fontSize: 12, fontWeight: 500, color: C.t3, display: 'flex', alignItems: 'center', gap: 5 })}>
        {icon} {label}
      </label>
      {children}
      {error && <span style={f({ fontSize: 11, color: C.red, marginTop: -2 })}>{error}</span>}
    </div>
  )
}

function inputStyle(err) {
  return f({
    width: '100%', boxSizing: 'border-box',
    background: C.bg2, border: `1px solid ${err ? C.red : C.borderMid}`,
    borderRadius: 9, padding: '10px 13px',
    fontSize: 13, color: C.t1, outline: 'none',
    transition: 'border-color 0.2s',
  })
}
