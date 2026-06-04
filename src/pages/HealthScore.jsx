import { useState } from 'react'
import { ArrowRight, Shield, CheckCircle2, AlertTriangle, TrendingUp, Building2 } from 'lucide-react'
import { C, f } from '../tokens'

const REVENUE_OPTIONS = ['$5M–$25M', '$25M–$100M', '$100M–$500M', '$500M+']
const ERP_OPTIONS = ['1', '2–3', '4+']
const PAIN_OPTIONS = [
  'Month-end close speed',
  'Cash flow visibility',
  'Multi-entity reconciliation',
  'Board reporting',
  'Compliance & audit readiness',
]

function calcScore(revenue, erps, pain) {
  let score = 72
  if (revenue === '$100M–$500M') score -= 12
  else if (revenue === '$500M+') score -= 18
  else if (revenue === '$25M–$100M') score -= 6
  if (erps === '2–3') score -= 10
  else if (erps === '4+') score -= 20
  if (pain === 'Multi-entity reconciliation') score -= 8
  else if (pain === 'Month-end close speed') score -= 6
  else if (pain === 'Cash flow visibility') score -= 5
  else if (pain === 'Compliance & audit readiness') score -= 7
  return Math.max(15, Math.min(85, score))
}

function getInsights(revenue, erps, pain) {
  const insights = []
  if (erps === '4+') {
    insights.push({ color: C.red, icon: <AlertTriangle size={14} />, text: 'Organizations with 4+ ERPs spend 3.2x more time on intercompany reconciliation. Vantoryn automates cross-system matching in real time.' })
  } else if (erps === '2–3') {
    insights.push({ color: C.amber, icon: <AlertTriangle size={14} />, text: 'Multi-ERP environments typically add 5–8 days to the monthly close. Vantoryn reduces this to under 48 hours with automated reconciliation.' })
  } else {
    insights.push({ color: C.green, icon: <CheckCircle2 size={14} />, text: 'Single-ERP environments benefit most from automated reporting and anomaly detection — the fastest path to value.' })
  }
  if (pain === 'Month-end close speed') {
    insights.push({ color: C.blue, icon: <TrendingUp size={14} />, text: 'Companies at your profile close in an average of 14 days. Vantoryn customers close in 3–4 days with automated workflows.' })
  } else if (pain === 'Cash flow visibility') {
    insights.push({ color: C.blue, icon: <TrendingUp size={14} />, text: 'Finance teams at your scale typically detect cash flow issues 6–8 weeks late. Vantoryn flags risks 30–90 days early.' })
  } else if (pain === 'Multi-entity reconciliation') {
    insights.push({ color: C.blue, icon: <TrendingUp size={14} />, text: 'Intercompany reconciliation consumes 200+ hours per quarter for multi-entity orgs. Vantoryn automates entity matching and elimination.' })
  } else if (pain === 'Board reporting') {
    insights.push({ color: C.blue, icon: <TrendingUp size={14} />, text: 'Board pack preparation averages 40+ hours per cycle. Vantoryn generates export-ready packs automatically from live data.' })
  } else {
    insights.push({ color: C.blue, icon: <TrendingUp size={14} />, text: 'Audit preparation takes 3–6 weeks at your scale. Vantoryn maintains a continuous audit trail with one-click export.' })
  }
  if (revenue === '$500M+' || revenue === '$100M–$500M') {
    insights.push({ color: C.purple, icon: <Building2 size={14} />, text: 'At your revenue scale, a 1-day reduction in close cycle recovers $50K–$200K in decision latency costs annually.' })
  } else {
    insights.push({ color: C.purple, icon: <Building2 size={14} />, text: 'Mid-market finance teams recover an average of $185K annually in time savings and risk avoidance with Vantoryn.' })
  }
  return insights
}

function getBenchmark(revenue, erps) {
  const base = erps === '4+' ? 18 : erps === '2–3' ? 14 : 11
  const vantoryn = erps === '4+' ? 5 : erps === '2–3' ? 4 : 3
  return { current: base, vantoryn }
}

export default function HealthScore({ navigate, onBookDemo }) {
  const [company, setCompany] = useState('')
  const [revenue, setRevenue] = useState('')
  const [erps, setErps] = useState('')
  const [pain, setPain] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = company && revenue && erps && pain && email

  function handleSubmit(e) {
    e.preventDefault()
    if (canSubmit) setSubmitted(true)
  }

  const score = calcScore(revenue, erps, pain)
  const insights = getInsights(revenue, erps, pain)
  const benchmark = getBenchmark(revenue, erps)
  const scoreColor = score < 40 ? C.red : score < 60 ? C.amber : C.green

  if (submitted) {
    return (
      <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
        <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <section style={{ padding: '72px 28px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h1 style={f({ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.03em' })}>
                Financial Health Score
              </h1>
              <p style={f({ fontSize: 15, color: C.t2 })}>{company}</p>
            </div>

            {/* Score card */}
            <div style={{
              background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20,
              padding: '48px 40px', textAlign: 'center', marginBottom: 32,
              boxShadow: `0 0 60px ${scoreColor}14`,
            }}>
              <div style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 })}>
                Your Score
              </div>
              <div style={f({
                fontSize: 80, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 8,
                background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}88)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              })}>
                {score}
              </div>
              <div style={f({ fontSize: 14, color: C.t3 })}>out of 100</div>
              <div style={{
                width: '100%', height: 6, borderRadius: 3, background: C.bg4, marginTop: 24,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${score}%`, height: '100%', borderRadius: 3,
                  background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                  transition: 'width 1s ease',
                }} />
              </div>
              <p style={f({ fontSize: 13, color: C.t2, marginTop: 16, lineHeight: 1.6 })}>
                {score < 40
                  ? 'Your finance operations have significant optimization potential. Vantoryn can deliver immediate, measurable impact.'
                  : score < 60
                  ? 'Your finance stack has room for improvement. Targeted automation and predictive intelligence can accelerate your close cycle and reduce risk.'
                  : 'Your operations are in good shape, but there are opportunities to gain predictive visibility and further reduce manual overhead.'}
              </p>
            </div>

            {/* Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              <div style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 })}>
                Key Insights
              </div>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 20px',
                  background: `${ins.color}0a`, border: `1px solid ${ins.color}28`, borderRadius: 12,
                }}>
                  <span style={{ color: ins.color, marginTop: 2, flexShrink: 0 }}>{ins.icon}</span>
                  <span style={f({ fontSize: 13, color: C.t2, lineHeight: 1.65 })}>{ins.text}</span>
                </div>
              ))}
            </div>

            {/* Benchmark */}
            <div style={{
              background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 16,
              padding: '28px 32px', marginBottom: 40,
            }}>
              <div style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 })}>
                Benchmark Comparison
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ textAlign: 'center', padding: '20px', background: C.bg3, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={f({ fontSize: 11, color: C.t3, marginBottom: 8 })}>Companies with your profile</div>
                  <div style={f({ fontSize: 36, fontWeight: 800, color: C.amber, letterSpacing: '-0.03em' })}>{benchmark.current} days</div>
                  <div style={f({ fontSize: 12, color: C.t3 })}>average close cycle</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: `${C.teal}08`, borderRadius: 12, border: `1px solid ${C.teal}28` }}>
                  <div style={f({ fontSize: 11, color: C.t3, marginBottom: 8 })}>Vantoryn customers</div>
                  <div style={f({ fontSize: 36, fontWeight: 800, color: C.teal, letterSpacing: '-0.03em' })}>{benchmark.vantoryn} days</div>
                  <div style={f({ fontSize: 12, color: C.teal })}>average close cycle</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center' }}>
              <button onClick={onBookDemo} style={f({
                fontSize: 16, fontWeight: 700, color: '#fff',
                background: C.blue, border: 'none', borderRadius: 12,
                padding: '17px 40px', cursor: 'pointer',
                boxShadow: `0 8px 36px ${C.blue}44`,
                display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
              })}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                See how Vantoryn closes this gap <ArrowRight size={18} />
              </button>
              <p style={f({ fontSize: 12, color: C.t3, marginTop: 16 })}>15-minute walkthrough · No commitment required</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const selectStyle = (value) => f({
    width: '100%', fontSize: 14, color: value ? C.t1 : C.t3,
    background: C.bg3, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '13px 14px', cursor: 'pointer',
    outline: 'none', transition: 'border-color 0.2s',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237e8fa8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  })

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        select option { background: ${C.bg3}; color: ${C.t1}; }
      `}</style>
      <section style={{ padding: '72px 28px 96px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={f({ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.t1, margin: '0 0 14px', letterSpacing: '-0.03em' })}>
              Get Your Financial Health Score
            </h1>
            <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' })}>
              See how your finance operations compare to industry benchmarks. Takes 30 seconds.
            </p>
            {/* Trust bar */}
            <div style={f({ fontSize: 12, color: C.t3, marginTop: 16, opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 })}>
              <Shield size={12} color={C.green} />
              100% client-side computation — your inputs never leave your browser. No login required.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={f({ fontSize: 12, color: C.t2, fontWeight: 600, marginBottom: 6, display: 'block' })}>Company name</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                placeholder="Your company"
                style={f({
                  width: '100%', fontSize: 14, color: C.t1,
                  background: C.bg3, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '13px 14px', outline: 'none',
                  transition: 'border-color 0.2s', boxSizing: 'border-box',
                })}
                onFocus={e => e.currentTarget.style.borderColor = C.blue}
                onBlur={e => e.currentTarget.style.borderColor = C.border}
              />
            </div>

            <div>
              <label style={f({ fontSize: 12, color: C.t2, fontWeight: 600, marginBottom: 6, display: 'block' })}>Revenue range</label>
              <select value={revenue} onChange={e => setRevenue(e.target.value)} style={selectStyle(revenue)}>
                <option value="">Select revenue range</option>
                {REVENUE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label style={f({ fontSize: 12, color: C.t2, fontWeight: 600, marginBottom: 6, display: 'block' })}>Number of ERPs / accounting systems</label>
              <select value={erps} onChange={e => setErps(e.target.value)} style={selectStyle(erps)}>
                <option value="">Select count</option>
                {ERP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label style={f({ fontSize: 12, color: C.t2, fontWeight: 600, marginBottom: 6, display: 'block' })}>Biggest finance pain point</label>
              <select value={pain} onChange={e => setPain(e.target.value)} style={selectStyle(pain)}>
                <option value="">Select pain point</option>
                {PAIN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label style={f({ fontSize: 12, color: C.t2, fontWeight: 600, marginBottom: 6, display: 'block' })}>Work email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={f({
                  width: '100%', fontSize: 14, color: C.t1,
                  background: C.bg3, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '13px 14px', outline: 'none',
                  transition: 'border-color 0.2s', boxSizing: 'border-box',
                })}
                onFocus={e => e.currentTarget.style.borderColor = C.blue}
                onBlur={e => e.currentTarget.style.borderColor = C.border}
              />
              <div style={f({ fontSize: 11, color: C.t3, marginTop: 6, opacity: 0.65 })}>
                We'll send your full report here. No spam, no sales sequences unless you opt in.
              </div>
            </div>

            <button type="submit" disabled={!canSubmit} style={f({
              width: '100%', fontSize: 15, fontWeight: 700,
              color: canSubmit ? '#fff' : C.t3,
              background: canSubmit ? C.blue : C.bg4,
              border: 'none', borderRadius: 11, padding: '16px',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s', marginTop: 8,
              boxShadow: canSubmit ? `0 4px 24px ${C.blue}44` : 'none',
            })}>
              Generate My Score <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
