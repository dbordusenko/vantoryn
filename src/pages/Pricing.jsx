import { useState } from 'react'
import { CheckCircle2, ArrowRight, Zap, BarChart3, Activity,
  Building2, Shield, ChevronDown, Calculator } from 'lucide-react'
import { C, f } from '../tokens'
import { useBreakpoint } from '../hooks/useBreakpoint'

const PLANS = [
  {
    id: 'ops', name: 'Finance Operations', color: C.blue,
    period: 'Up to 3 integrations · 1 entity',
    tagline: 'For companies automating core finance processes',
    description: 'Close faster, automate reporting, and eliminate manual reconciliation — without replacing your existing ERP.',
    icon: <BarChart3 size={20} />,
    features: [
      'Executive reporting automation',
      'Month-end close orchestration',
      'Automated bank reconciliation',
      'ERP bi-directional sync',
      'KPI dashboards',
      'Board pack generation',
      'Up to 3 integrations',
      'Standard audit trail',
      'Self-serve onboarding with guided setup',
      'Email + chat support',
    ],
    cta: 'Apply as Founding Partner',
    scaleNote: 'Founding Partner rate applies to this tier for as long as you stay with us.',
  },
  {
    id: 'fpa', name: 'FP&A Intelligence', color: C.teal,
    period: 'Unlimited integrations · up to 5 entities',
    tagline: 'For finance teams requiring predictive analytics',
    description: 'Everything in Finance Operations, plus AI-driven forecasting, scenario modeling, and predictive risk detection.',
    icon: <Activity size={20} />,
    highlighted: true,
    features: [
      'Everything in Finance Operations',
      'Predictive cash flow forecasting',
      'Budget variance analysis (AI)',
      'Scenario modeling engine',
      'Anomaly detection & alerts',
      'FP&A intelligence dashboards',
      'Rolling 12-month projections',
      'Unlimited integrations',
      'CFO morning intelligence brief',
      'Dedicated onboarding specialist — 2-week deployment',
      'Priority support + CSM',
    ],
    cta: 'Apply as Founding Partner',
    scaleNote: 'Founding Partner rate applies to this tier for as long as you stay with us.',
  },
  {
    id: 'enterprise', name: 'Enterprise Control', color: C.purple,
    period: 'Multi-entity · single-tenant option',
    tagline: 'For multi-entity enterprises with governance needs',
    description: 'Full platform capabilities with dedicated infrastructure, custom integrations, enterprise SLAs, and compliance support.',
    icon: <Building2 size={20} />,
    features: [
      'Everything in FP&A Intelligence',
      'Multi-entity support',
      'Single-tenant infrastructure option',
      'Custom data residency',
      'SOX compliance workflow support',
      'Custom integration development',
      'Dedicated implementation team — white-glove deployment',
      'Enterprise SLA (99.9% uptime)',
      'Executive business reviews',
      'SAML SSO + advanced RBAC',
    ],
    cta: 'Apply as Founding Partner',
    scaleNote: 'Scoped to your entity count, volume and infrastructure needs on the partner call.',
  },
]

const COMPARE_ROWS = [
  { label: 'Executive reporting automation', ops: true,   fpa: true,    ent: true },
  { label: 'Month-end close orchestration',  ops: true,   fpa: true,    ent: true },
  { label: 'ERP integration',                ops: '3',    fpa: '∞',     ent: 'Custom' },
  { label: 'AI forecasting engine',          ops: false,  fpa: true,    ent: true },
  { label: 'Scenario modeling',              ops: false,  fpa: true,    ent: true },
  { label: 'Anomaly detection',              ops: false,  fpa: true,    ent: true },
  { label: 'CFO morning brief',              ops: false,  fpa: true,    ent: true },
  { label: 'Multi-entity support',           ops: false,  fpa: false,   ent: true },
  { label: 'Single-tenant infrastructure',   ops: false,  fpa: false,   ent: true },
  { label: 'SOX compliance workflows',       ops: false,  fpa: false,   ent: true },
  { label: 'Custom integrations',            ops: false,  fpa: false,   ent: true },
  { label: 'Dedicated CSM',                  ops: false,  fpa: true,    ent: true },
  { label: 'SLA guarantee',                  ops: '99%',  fpa: '99.5%', ent: '99.9%' },
]

/* ROI Calculator */
function ROICalc({ isMobile }) {
  const [entities, setEntities]   = useState(3)
  const [txVolume, setTxVolume]   = useState(50)
  const [closeDays, setCloseDays] = useState(14)

  const projectedClose  = Math.max(2, Math.round(closeDays * 0.28))
  const riskExposure    = Math.round((entities * txVolume * 0.68) + (closeDays * 8))
  const annualSavings   = Math.round((closeDays - projectedClose) * entities * 4.2 + txVolume * 0.38)

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <Calculator size={20} color={C.blue} />
        <span style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>ROI Calculator</span>
        <span style={f({ fontSize: 12, color: C.t3 })}>Estimate your organization's return</span>
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 24 : 20, marginBottom: 28 }}>
        {[
          { label: 'Number of legal entities',       val: entities,  set: setEntities,  min: 1, max: 50,  step: 1, fmt: v => v },
          { label: 'Monthly transaction volume (K)', val: txVolume,  set: setTxVolume,  min: 1, max: 500, step: 5, fmt: v => `${v}K` },
          { label: 'Current close cycle (days)',     val: closeDays, set: setCloseDays, min: 3, max: 30,  step: 1, fmt: v => v },
        ].map(input => (
          <div key={input.label}>
            <div style={f({ fontSize: 11, color: C.t3, marginBottom: 8, fontWeight: 600 })}>{input.label}</div>
            <div style={f({ fontSize: 22, fontWeight: 800, color: C.t1, marginBottom: 8 })}>{input.fmt(input.val)}</div>
            <input type="range" min={input.min} max={input.max} step={input.step}
              value={input.val} onChange={e => input.set(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.blue }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={f({ fontSize: 10, color: C.t4 })}>{input.min}</span>
              <span style={f({ fontSize: 10, color: C.t4 })}>{input.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Projected close cycle',           value: `${projectedClose} days`, color: C.blue },
          { label: 'Annual risk exposure identified',  value: `$${riskExposure}K`,     color: C.amber },
          { label: 'Estimated annual savings',         value: `$${annualSavings}K`,    color: C.green },
        ].map(r => (
          <div key={r.label} style={{ background: C.bg3, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '18px', textAlign: 'center' }}>
            <div style={f({ fontSize: 30, fontWeight: 800, color: r.color, letterSpacing: '-0.03em', marginBottom: 6 })}>{r.value}</div>
            <div style={f({ fontSize: 12, color: C.t2 })}>{r.label}</div>
          </div>
        ))}
      </div>
      <div style={f({ fontSize: 11, color: C.t3, marginTop: 16, lineHeight: 1.5 })}>
        * Estimate based on industry benchmarks. Actual results vary by organization.
      </div>
    </div>
  )
}

export default function Pricing({ navigate, onBookDemo, onFounding }) {
  const apply = onFounding ?? onBookDemo
  const [showTable, setShowTable] = useState(false)
  const { isMobile, isTablet } = useBreakpoint()

  // Plans: 1 col on mobile, 1 col on tablet (stack vertically), 3 col on desktop
  const plansColumns = isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(3, 1fr)'

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: isMobile ? '52px 20px 40px' : '72px 28px 56px',
        textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
            marginBottom: 24, background: `${C.blue}14`, border: `1px solid ${C.blue}35` }}>
            <Zap size={12} color={C.blue} />
            <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.04em' })}>
              Founding Partner Program · 8 seats
            </span>
          </div>
          <h1 style={f({ fontSize: isMobile ? 32 : 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
            We're taking on 8 partners<br />
            <span style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              to build this with us.
            </span>
          </h1>
          <p style={f({ fontSize: isMobile ? 15 : 17, color: C.t2, lineHeight: 1.7, margin: '0 auto' })}>
            Vantoryn is financial infrastructure, not a monthly subscription tool. Before we open
            general availability, we're partnering with eight finance teams who help shape the
            platform — and lock a founding rate for as long as they stay with us.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ background: C.bg0, padding: isMobile ? '0 16px 52px' : '0 28px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: plansColumns, gap: isMobile ? 16 : 20 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.highlighted ? C.bg3 : C.bg2,
                border: `1px solid ${plan.highlighted ? plan.color + '55' : C.border}`,
                borderRadius: 20, padding: isMobile ? '24px 20px' : '32px 28px',
                position: 'relative', overflow: 'hidden',
                boxShadow: plan.highlighted ? `0 0 60px ${plan.color}14` : 'none',
              }}>
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: plan.color }} />

                {plan.highlighted && (
                  <div style={{ position: 'absolute', top: 14, right: 14,
                    padding: '3px 10px', borderRadius: 20,
                    background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}>
                    <span style={f({ fontSize: 10, color: plan.color, fontWeight: 700 })}>MOST POPULAR</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11,
                    background: `${plan.color}16`, border: `1px solid ${plan.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.color, flexShrink: 0 }}>
                    {plan.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={f({ fontSize: 14, fontWeight: 800, color: C.t1 })}>{plan.name}</div>
                    <div style={f({ fontSize: 11, color: plan.color, fontWeight: 600 })}>{plan.tagline}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={f({ fontSize: isMobile ? 26 : 30, fontWeight: 800, color: plan.color,
                      letterSpacing: '-0.03em' })}>−50%</span>
                    <span style={f({ fontSize: 13, color: C.t2, fontWeight: 600 })}>founding rate</span>
                  </div>
                  <div style={f({ fontSize: 12, color: C.t3, lineHeight: 1.5 })}>
                    Locked for as long as you stay · {plan.period}
                  </div>
                </div>

                <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.65, margin: '0 0 12px' })}>{plan.description}</p>
                {plan.scaleNote && (
                  <p style={f({ fontSize: 11, color: C.t3, lineHeight: 1.5, margin: '0 0 20px', fontStyle: 'italic' })}>{plan.scaleNote}</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
                  {plan.features.map(feat => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <CheckCircle2 size={13} color={plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={f({ fontSize: 13, color: C.t2, lineHeight: 1.5 })}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button onClick={apply} style={f({
                  width: '100%', fontSize: 14, fontWeight: 700,
                  color: plan.highlighted ? '#fff' : C.t1,
                  background: plan.highlighted ? plan.color : 'transparent',
                  border: `1px solid ${plan.highlighted ? 'transparent' : C.borderMid}`,
                  borderRadius: 10, padding: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: plan.highlighted ? `0 4px 20px ${plan.color}40` : 'none',
                })}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {plan.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Founding Partner Program — the deal, both directions */}
          <div style={{
            marginTop: isMobile ? 32 : 48,
            background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20,
            padding: isMobile ? '24px 20px' : '36px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <Shield size={18} color={C.teal} />
              <span style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>
                The Founding Partner deal
              </span>
            </div>
            <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.65, margin: '0 0 24px', maxWidth: 640 })}>
              A partnership, not a discount. You get economics that never expire; we get the
              real-world feedback that makes the platform right for finance teams like yours.
            </p>

            <div style={{ display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 20 : 28 }}>
              {[
                {
                  title: 'What you get', color: C.teal,
                  items: [
                    '50% off year one — locked for as long as you stay with us',
                    'Direct line to the team building it',
                    'Your priorities shape the roadmap',
                    'Onboarding led by us, on your data',
                    'Founding Partner recognition (optional)',
                  ],
                },
                {
                  title: 'What we ask', color: C.blue,
                  items: [
                    'A 30-minute call every two weeks',
                    'Access to your workflows so we can configure it properly',
                    'A short case study once you see results',
                    'One reference call with a future customer',
                    'Honest feedback — including when it\'s bad',
                  ],
                },
              ].map(col => (
                <div key={col.title}>
                  <div style={f({ fontSize: 11, fontWeight: 700, color: col.color,
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 })}>
                    {col.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <CheckCircle2 size={13} color={col.color} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span style={f({ fontSize: 13, color: C.t2, lineHeight: 1.55 })}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Risk reversal — the reason to say yes to a new vendor */}
            <div style={{
              marginTop: 28, padding: isMobile ? '16px 18px' : '20px 24px',
              background: `${C.green}0e`, border: `1px solid ${C.green}35`, borderRadius: 14,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <CheckCircle2 size={18} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={f({ fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 4 })}>
                  Our guarantee: value in 14 days, or your money back
                </div>
                <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.6 })}>
                  If you don't have a working plan running on your own data within 14 days of
                  kickoff, we refund year one in full. We're new — the risk should be ours, not yours.
                </div>
              </div>
            </div>

            <div style={f({ fontSize: 12, color: C.t3, marginTop: 18, lineHeight: 1.6 })}>
              Applications are reviewed in the order received. We're deliberately keeping the first
              cohort small enough to give every partner real attention.
            </div>
          </div>

          {/* Compare toggle */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => setShowTable(s => !s)} style={f({
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: C.t2, fontSize: 14, fontWeight: 500,
            })}
            onMouseEnter={e => e.currentTarget.style.color = C.t1}
            onMouseLeave={e => e.currentTarget.style.color = C.t2}
            >
              <ChevronDown size={16} style={{ transform: showTable ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }} />
              {showTable ? 'Hide' : 'Compare all features'}
            </button>
          </div>

          {/* Compare table — scrollable on mobile */}
          {showTable && (
            <div style={{ marginTop: 24, background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.25s ease' }}>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 520 }}>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    background: C.bg3, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ padding: '14px 20px' }} />
                    {PLANS.map(p => (
                      <div key={p.id} style={{ padding: '14px 16px', textAlign: 'center', borderLeft: `1px solid ${C.border}` }}>
                        <span style={f({ fontSize: 12, fontWeight: 700, color: p.color })}>{p.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                  {/* Rows */}
                  {COMPARE_ROWS.map((row, ri) => (
                    <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      borderBottom: ri < COMPARE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ padding: '12px 20px' }}>
                        <span style={f({ fontSize: 13, color: C.t2 })}>{row.label}</span>
                      </div>
                      {[row.ops, row.fpa, row.ent].map((val, vi) => (
                        <div key={vi} style={{ padding: '12px 16px', textAlign: 'center', borderLeft: `1px solid ${C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {val === true  ? <CheckCircle2 size={14} color={C.green} />
                            : val === false ? <span style={f({ fontSize: 14, color: C.t4 })}>—</span>
                            : <span style={f({ fontSize: 12, color: C.t2, fontWeight: 600 })}>{val}</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ background: C.bg1, padding: isMobile ? '52px 16px' : '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>ROI Calculator</span>
            <h2 style={f({ fontSize: isMobile ? 24 : 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Calculate your organization's return.
            </h2>
          </div>
          <ROICalc isMobile={isMobile} />
        </div>
      </section>

      {/* Enterprise CTA */}
      <section style={{ background: C.bg0, padding: isMobile ? '52px 20px' : '72px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <Shield size={16} color={C.green} />
            <span style={f({ fontSize: 13, color: C.t2 })}>All plans include SOC 2 infrastructure and full audit trail</span>
          </div>
          <h2 style={f({ fontSize: isMobile ? 22 : 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: C.t1,
            margin: '0 0 16px', letterSpacing: '-0.03em' })}>
            Think you're a fit?
          </h2>
          <p style={f({ fontSize: isMobile ? 14 : 15, color: C.t2, lineHeight: 1.7, margin: '0 0 32px' })}>
            Applying takes two minutes and commits you to nothing. We reply within two business
            days — either with a partner call, or an honest no.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={apply} style={f({
              fontSize: 15, fontWeight: 700, color: '#fff', background: C.blue,
              border: 'none', borderRadius: 11, padding: '14px 32px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              boxShadow: `0 4px 24px ${C.blue}44`,
            })}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Apply as Founding Partner <ArrowRight size={16} />
            </button>
            <button onClick={onBookDemo} style={f({
              fontSize: 15, fontWeight: 500, color: C.t2, background: 'transparent',
              border: `1px solid ${C.borderMid}`, borderRadius: 11, padding: '14px 28px',
              cursor: 'pointer', transition: 'all 0.2s',
            })}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.borderHi }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.borderColor = C.borderMid }}
            >
              See a demo first
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
