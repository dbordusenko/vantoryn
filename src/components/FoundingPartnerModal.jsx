import { useState, useEffect } from 'react'
import { X, Check, Loader2, ArrowRight, Building2, Mail, User, Users, Database, Target, Clock, Award } from 'lucide-react'
import { C, f } from '../tokens'
import VantorynMark from './VantorynMark'

/* Application form for the Founding Partner Program.
   Qualifying questions are deliberate: the cohort is 8 seats, so the form's job
   is to filter, not to maximise submissions. Delivered via /api/lead. */

const ROLES      = ['CFO', 'VP Finance', 'Controller', 'FP&A Director', 'COO / Ops', 'CEO / Founder', 'Other']
const TEAM_SIZES = ['1–3', '4–10', '11–25', '25+']
const ERPS       = ['SAP', 'Oracle NetSuite', 'QuickBooks', 'Xero', 'Microsoft Dynamics', 'Spreadsheets only', 'Other']
const TIMELINES  = ['Ready now', 'Within 1 month', 'This quarter', 'Just exploring']

export default function FoundingPartnerModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', company: '', role: '',
    teamSize: '', erp: '', challenge: '', timeline: '',
  })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [sendError, setSendError] = useState('')
  const [hp, setHp]             = useState('')   // honeypot

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = field => val => {
    setForm(p => ({ ...p, [field]: val }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Valid work email required'
    if (!form.company.trim()) e.company = 'Required'
    if (!form.role)           e.role    = 'Please select your role'
    if (!form.timeline)       e.timeline = 'Please select a timeline'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    setSendError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'founding', ...form, website: hp }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setDone(true)
    } catch {
      setSendError("We couldn't submit your application. Please email contact@vantoryn.com and we'll pick it up from there.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,5,10,0.82)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 520, margin: 'auto',
        background: C.bg1, border: `1px solid ${C.borderMid}`,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px ${C.border}`,
        animation: 'fadeUp 0.25s ease both',
      }}>
        {/* header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VantorynMark size={36} />
            <div>
              <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>Founding Partner Application</div>
              <div style={f({ fontSize: 12, color: C.t3 })}>8 seats · 50% locked founding rate</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.t3, padding: 4, borderRadius: 6, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.t1}
          onMouseLeave={e => e.currentTarget.style.color = C.t3}
          ><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px 28px' }}>
          {done ? (
            /* ── CONFIRMATION ── */
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
                Application received
              </div>
              <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 20px' })}>
                We review every application personally and reply to{' '}
                <strong style={{ color: C.t1 }}>{form.email}</strong> within two business days —
                either with a partner call invite, or an honest no.
              </p>
              <div style={{
                background: `${C.teal}0e`, border: `1px solid ${C.teal}30`,
                borderRadius: 12, padding: '14px 16px', marginBottom: 22, textAlign: 'left',
              }}>
                <div style={f({ fontSize: 12, color: C.t2, lineHeight: 1.65 })}>
                  <strong style={{ color: C.t1 }}>What happens next:</strong> a 30-minute call to see
                  if your workflows and our roadmap actually fit. No pitch deck.
                </div>
              </div>
              <button onClick={onClose} style={f({
                width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderMid}`,
                background: 'transparent', color: C.t2, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              })}>Close</button>
            </div>
          ) : (
            <>
              <div style={{
                background: `${C.blue}0e`, border: `1px solid ${C.blue}28`,
                borderRadius: 12, padding: '12px 14px', marginBottom: 20,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <Award size={15} color={C.blue} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={f({ fontSize: 12, color: C.t2, lineHeight: 1.6 })}>
                  We're taking 8 partners into the first cohort. A few questions so we only take
                  your time if it's a real fit.
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Full name" icon={<User size={12} />} error={errors.name}>
                  <input value={form.name} onChange={e => set('name')(e.target.value)}
                    placeholder="Jane Smith" style={inputStyle(errors.name)} />
                </Field>

                <Field label="Work email" icon={<Mail size={12} />} error={errors.email}>
                  <input type="email" value={form.email} onChange={e => set('email')(e.target.value)}
                    placeholder="you@company.com" style={inputStyle(errors.email)} />
                </Field>

                <Field label="Company" icon={<Building2 size={12} />} error={errors.company}>
                  <input value={form.company} onChange={e => set('company')(e.target.value)}
                    placeholder="Acme Manufacturing" style={inputStyle(errors.company)} />
                </Field>

                <Field label="Your role" icon={<User size={12} />} error={errors.role}>
                  <Chips options={ROLES} value={form.role} onChange={set('role')} />
                </Field>

                <Field label="Finance team size" icon={<Users size={12} />}>
                  <Chips options={TEAM_SIZES} value={form.teamSize} onChange={set('teamSize')} />
                </Field>

                <Field label="Main system today" icon={<Database size={12} />}>
                  <Chips options={ERPS} value={form.erp} onChange={set('erp')} />
                </Field>

                <Field label="When could you start?" icon={<Clock size={12} />} error={errors.timeline}>
                  <Chips options={TIMELINES} value={form.timeline} onChange={set('timeline')} />
                </Field>

                <Field label="What would you want us to fix first?" icon={<Target size={12} />}>
                  <textarea value={form.challenge} onChange={e => set('challenge')(e.target.value)}
                    rows={3} placeholder="e.g. our close takes 14 days and cash forecasting lives in three spreadsheets"
                    style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'inherit' }} />
                </Field>

                {/* honeypot */}
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={hp} onChange={e => setHp(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

                {sendError && (
                  <div style={f({
                    fontSize: 12.5, color: C.red, background: `${C.red}12`,
                    border: `1px solid ${C.red}35`, borderRadius: 8, padding: '10px 12px', lineHeight: 1.5,
                  })}>{sendError}</div>
                )}

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
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.9s linear infinite' }} /> Submitting…</>
                    : <>Apply for a founding seat <ArrowRight size={16} /></>}
                </button>

                <p style={f({ fontSize: 11, color: C.t4, textAlign: 'center', margin: 0, lineHeight: 1.6 })}>
                  Applying costs nothing and commits you to nothing.
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
function Chips({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(o => {
        const active = value === o
        return (
          <button key={o} type="button" onClick={() => onChange(active ? '' : o)} style={f({
            fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 8, cursor: 'pointer',
            background: active ? `${C.blue}1e` : 'transparent',
            border: `1px solid ${active ? C.blue : C.borderMid}`,
            color: active ? C.blue : C.t2, transition: 'all 0.15s',
          })}>{o}</button>
        )
      })}
    </div>
  )
}

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
