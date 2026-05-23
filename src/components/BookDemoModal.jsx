import { useState, useEffect } from 'react'
import { X, ArrowRight, Check, Calendar, Building2, User, Mail, Briefcase, Users } from 'lucide-react'
import { C, f, FONT } from '../tokens'
import VantorynMark from './VantorynMark'

const ROLES = ['CFO', 'VP Finance', 'Controller', 'FP&A Director', 'Finance Manager', 'CEO/Founder', 'Other']
const SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']
const SLOTS = [
  'Tomorrow 9:00 AM EST',
  'Tomorrow 2:00 PM EST',
  'Thu, May 28 · 10:00 AM EST',
  'Thu, May 28 · 3:00 PM EST',
  'Fri, May 29 · 11:00 AM EST',
  'Mon, Jun 2 · 9:00 AM EST',
]

export default function BookDemoModal({ onClose }) {
  const [step, setStep] = useState(1) // 1 = form, 2 = slot, 3 = confirmed
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', size: '' })
  const [slot, setSlot]   = useState(null)
  const [errors, setErrors] = useState({})

  // Close on Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.company.trim()) e.company = 'Required'
    if (!form.role)           e.role    = 'Select your role'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) setStep(2)
  }

  function handleConfirm() {
    if (!slot) return
    setStep(3)
  }

  const inp = (field, placeholder, icon) => (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.t4, pointerEvents: 'none' }}>
        {icon}
      </div>
      <input
        value={form[field]}
        onChange={e => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: '' })) }}
        placeholder={placeholder}
        style={f({
          width: '100%', boxSizing: 'border-box',
          padding: '11px 12px 11px 38px',
          background: C.bg3, border: `1px solid ${errors[field] ? C.red : C.border}`,
          borderRadius: 9, color: C.t1, fontSize: 14, outline: 'none',
          transition: 'border-color 0.15s',
        })}
        onFocus={e => e.target.style.borderColor = C.blue}
        onBlur={e => e.target.style.borderColor = errors[field] ? C.red : C.border}
      />
      {errors[field] && <span style={f({ fontSize: 11, color: C.red, position: 'absolute', right: 0, top: -18 })}>{errors[field]}</span>}
    </div>
  )

  return (
    /* Backdrop */
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Card */}
      <div style={{
        background: C.bg1, border: `1px solid ${C.border}`,
        borderRadius: 18, width: '100%', maxWidth: 480,
        overflow: 'hidden', position: 'relative',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        animation: 'fadeIn 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.bg2} 0%, ${C.bg1} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VantorynMark size={36} />
            <div>
              <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>Book a CFO Demo</div>
              <div style={f({ fontSize: 12, color: C.t3 })}>30-minute personalised walkthrough</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.t3, padding: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = C.t1}
            onMouseLeave={e => e.currentTarget.style.color = C.t3}
          ><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', padding: '14px 28px', gap: 8, alignItems: 'center' }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: step > s ? C.green : step === s ? C.blue : C.bg3,
                border: `2px solid ${step > s ? C.green : step === s ? C.blue : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: step >= s ? '#fff' : C.t4,
                transition: 'all 0.3s',
              }}>
                {step > s ? <Check size={12} /> : s}
              </div>
              <span style={f({ fontSize: 11, color: step === s ? C.t1 : C.t4, fontWeight: step === s ? 600 : 400 })}>
                {s === 1 ? 'Your details' : s === 2 ? 'Pick a time' : 'Confirmed'}
              </span>
              {i < 2 && <div style={{ flex: 1, height: 1, width: 24, background: step > s ? C.green : C.border, transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '8px 28px 28px' }}>

          {/* ── Step 1: Form ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {inp('name',    'Full name',       <User size={14} />)}
              {inp('email',   'Work email',      <Mail size={14} />)}
              {inp('company', 'Company name',    <Building2 size={14} />)}

              {/* Role select */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.t4, pointerEvents: 'none' }}>
                  <Briefcase size={14} />
                </div>
                <select
                  value={form.role}
                  onChange={e => { setForm(p => ({ ...p, role: e.target.value })); setErrors(p => ({ ...p, role: '' })) }}
                  style={f({
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 12px 11px 38px',
                    background: C.bg3, border: `1px solid ${errors.role ? C.red : C.border}`,
                    borderRadius: 9, color: form.role ? C.t1 : C.t4, fontSize: 14, outline: 'none',
                    appearance: 'none', cursor: 'pointer',
                  })}
                >
                  <option value="" disabled>Your role</option>
                  {ROLES.map(r => <option key={r} value={r} style={{ color: C.t1, background: C.bg2 }}>{r}</option>)}
                </select>
                {errors.role && <span style={f({ fontSize: 11, color: C.red, position: 'absolute', right: 0, top: -18 })}>{errors.role}</span>}
              </div>

              {/* Team size */}
              <div>
                <div style={f({ fontSize: 11, color: C.t4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 })}>
                  <Users size={12} /> Finance team size
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, size: s }))} style={f({
                      flex: 1, padding: '7px 0', borderRadius: 7, border: `1px solid ${form.size === s ? C.blue : C.border}`,
                      background: form.size === s ? `${C.blue}18` : 'transparent',
                      color: form.size === s ? C.blue : C.t3, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    })}>{s}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleNext} style={f({
                width: '100%', padding: '13px', borderRadius: 10,
                background: C.blue, border: 'none', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: `0 0 28px ${C.blueGlow}`, marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              })}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Choose a time <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 2: Time slot ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={f({ fontSize: 13, color: C.t3, marginBottom: 4 })}>
                Available slots for a 30-min call with our CFO specialist
              </div>
              {SLOTS.map(s => (
                <button key={s} onClick={() => setSlot(s)} style={f({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${slot === s ? C.blue : C.border}`,
                  background: slot === s ? `${C.blue}12` : C.bg3,
                  color: slot === s ? C.blue : C.t2, fontSize: 13, fontWeight: 500,
                  transition: 'all 0.15s', textAlign: 'left',
                })}
                onMouseEnter={e => { if (slot !== s) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t1 } }}
                onMouseLeave={e => { if (slot !== s) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.t2 } }}
                >
                  <Calendar size={15} style={{ flexShrink: 0, opacity: 0.7 }} />
                  {s}
                  {slot === s && <Check size={14} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setStep(1)} style={f({
                  flex: 1, padding: '12px', borderRadius: 10,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.t2, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                })}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t1 }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.t2 }}
                >Back</button>
                <button onClick={handleConfirm} disabled={!slot} style={f({
                  flex: 2, padding: '12px', borderRadius: 10,
                  background: slot ? C.blue : C.bg3,
                  border: 'none', color: slot ? '#fff' : C.t4,
                  fontSize: 14, fontWeight: 700, cursor: slot ? 'pointer' : 'not-allowed',
                  boxShadow: slot ? `0 0 24px ${C.blueGlow}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                })}
                onMouseEnter={e => { if (slot) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Confirm booking <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmed ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '12px 0 8px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: `${C.green}18`, border: `2px solid ${C.green}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'fadeIn 0.4s ease',
              }}>
                <Check size={28} color={C.green} strokeWidth={2.5} />
              </div>
              <div>
                <div style={f({ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 6 })}>Demo booked!</div>
                <div style={f({ fontSize: 13, color: C.t3, lineHeight: 1.6 })}>
                  Confirmed for <strong style={{ color: C.t2 }}>{slot}</strong>.<br />
                  A calendar invite has been sent to <strong style={{ color: C.t2 }}>{form.email}</strong>.
                </div>
              </div>
              <div style={{
                width: '100%', background: C.bg3, borderRadius: 10,
                border: `1px solid ${C.border}`, padding: '14px 16px',
                textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                {[
                  ['Name', form.name],
                  ['Company', form.company],
                  ['Role', form.role],
                  ['Session', slot],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={f({ fontSize: 12, color: C.t4 })}>{k}</span>
                    <span style={f({ fontSize: 12, color: C.t1, fontWeight: 500 })}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={f({ fontSize: 12, color: C.t4, lineHeight: 1.6 })}>
                Our CFO specialist will prepare a personalised analysis<br />
                of your finance stack before the call.
              </div>
              <button onClick={onClose} style={f({
                width: '100%', padding: '12px', borderRadius: 10,
                background: C.blue, border: 'none', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: `0 0 24px ${C.blueGlow}`,
              })}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
