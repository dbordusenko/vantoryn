import { useState } from 'react'
import { CheckCircle2, ArrowRight, Zap, BarChart3, Activity,
  Building2, Shield, ChevronDown, Calculator } from 'lucide-react'
import { C, f } from '../tokens'

const PLANS = [
  {
    id: 'ops', name: 'Finance Operations', color: C.blue,
    price: 'From $15K', period: 'per year',
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
      'Email + chat support',
    ],
    cta: 'Start with Finance Ops',
  },
  {
    id: 'fpa', name: 'FP&A Intelligence', color: C.teal,
    price: 'From $28K', period: 'per year',
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
      'Priority support + CSM',
    ],
    cta: 'Start with FP&A Intelligence',
  },
  {
    id: 'enterprise', name: 'Enterprise Control', color: C.purple,
    price: 'Custom', period: 'annual contract',
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
      'Dedicated implementation team',
      'Enterprise SLA (99.9% uptime)',
      'Executive business reviews',
      'SAML SSO + advanced RBAC',
    ],
    cta: 'Talk to Enterprise Sales',
  },
]

const COMPARE_ROWS = [
  { label: 'Executive reporting automation', ops: true, fpa: true, ent: true },
  { label: 'Month-end close orchestration',  ops: true, fpa: true, ent: true },
  { label: 'ERP integration',                ops: '3',  fpa: '∞',  ent: 'Custom' },
  { label: 'AI forecasting engine',          ops: false,fpa: true, ent: true },
  { label: 'Scenario modeling',              ops: false,fpa: true, ent: true },
  { label: 'Anomaly detection',              ops: false,fpa: true, ent: true },
  { label: 'CFO morning brief',              ops: false,fpa: true, ent: true },
  { label: 'Multi-entity support',           ops: false,fpa: false,ent: true },
  { label: 'Single-tenant infrastructure',   ops: false,fpa: false,ent: true },
  { label: 'SOX compliance workflows',       ops: false,fpa: false,ent: true },
  { label: 'Custom integrations',            ops: false,fpa: false,ent: true },
  { label: 'Dedicated CSM',                  ops: false,fpa: true, ent: true },
  { label: 'SLA guarantee',                  ops: '99%',fpa: '99.5%',ent: '99.9%' },
]

/* ROI Calculator */
function ROICalc() {
  const [team, setTeam] = useState(4)
  const [hoursClose, setHoursClose] = useState(80)
  const [rate, setRate] = useState(85)

  const monthlyHoursSaved = (hoursClose * 0.65) + (team * 8 * 0.4) // 65% close + 40% ad hoc
  const annualSavings = monthlyHoursSaved * 12 * rate
  const roi = Math.round(((annualSavings - 20000) / 20000) * 100)

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20, padding: '36px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <Calculator size={20} color={C.blue} />
        <span style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>ROI Calculator</span>
        <span style={f({ fontSize: 12, color: C.t3 })}>Estimate your annual savings</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Finance team size (FTEs)',      val: team,       set: setTeam,       min: 1, max: 20, step: 1 },
          { label: 'Hours on monthly close cycle',  val: hoursClose, set: setHoursClose, min: 20, max: 200, step: 10 },
          { label: 'Avg. hourly cost of team ($)',  val: rate,       set: setRate,       min: 40, max: 200, step: 5 },
        ].map(input => (
          <div key={input.label}>
            <div style={f({ fontSize: 11, color: C.t3, marginBottom: 8, fontWeight: 600 })}>{input.label}</div>
            <div style={f({ fontSize: 22, fontWeight: 800, color: C.t1, marginBottom: 8 })}>{input.val}</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Hours saved / month',  value: `${Math.round(monthlyHoursSaved)}h`, color: C.blue },
          { label: 'Annual time savings',  value: `$${(annualSavings/1000).toFixed(0)}K`,    color: C.green },
          { label: 'Estimated ROI',        value: `${roi > 0 ? '+' : ''}${roi}%`, color: roi > 0 ? C.teal : C.amber },
        ].map(r => (
          <div key={r.label} style={{ background: C.bg3, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '18px', textAlign: 'center' }}>
            <div style={f({ fontSize: 30, fontWeight: 800, color: r.color, letterSpacing: '-0.03em', marginBottom: 6 })}>{r.value}</div>
            <div style={f({ fontSize: 12, color: C.t2 })}>{r.label}</div>
          </div>
        ))}
      </div>
      <div style={f({ fontSize: 11, color: C.t3, marginTop: 16, lineHeight: 1.5 })}>
        * Estimate based on industry benchmarks. Actual results vary by organization. Based on starting at Finance Operations tier ($15K/year).
      </div>
    </div>
  )
}

export default function Pricing({ navigate }) {
  const [showTable, setShowTable] = useState(false)

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: '72px 28px 56px', textAlign: 'center',
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
            marginBottom: 24, background: `${C.blue}14`, border: `1px solid ${C.blue}35` }}>
            <Zap size={12} color={C.blue} />
            <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.04em' })}>Pricing</span>
          </div>
          <h1 style={f({ fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
            Strategic platform pricing<br />
            <span style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              for serious finance teams.
            </span>
          </h1>
          <p style={f({ fontSize: 17, color: C.t2, lineHeight: 1.7, margin: '0 auto' })}>
            FinAutomate is not a monthly subscription tool. It is financial infrastructure — priced to reflect the value it delivers to your organization.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ background: C.bg0, padding: '0 28px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.highlighted ? C.bg3 : C.bg2,
                border: `1px solid ${plan.highlighted ? plan.color + '55' : C.border}`,
                borderRadius: 20, padding: '32px 28px',
                position: 'relative', overflow: 'hidden',
                boxShadow: plan.highlighted ? `0 0 60px ${plan.color}14` : 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: plan.color }} />
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.color }}>
                    {plan.icon}
                  </div>
                  <div>
                    <div style={f({ fontSize: 14, fontWeight: 800, color: C.t1 })}>{plan.name}</div>
                    <div style={f({ fontSize: 11, color: plan.color, fontWeight: 600 })}>{plan.tagline}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={f({ fontSize: 32, fontWeight: 800, color: C.t1, letterSpacing: '-0.03em', marginBottom: 4 })}>
                    {plan.price}
                  </div>
                  <div style={f({ fontSize: 12, color: C.t3 })}>{plan.period}</div>
                </div>

                <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.65, margin: '0 0 20px' })}>{plan.description}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
                  {plan.features.map(feat => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <CheckCircle2 size={13} color={plan.color} style={{ flexShrink: 0 }} />
                      <span style={f({ fontSize: 13, color: C.t2 })}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('home')} style={f({
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

          {/* Compare table */}
          {showTable && (
            <div style={{ marginTop: 24, background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.25s ease' }}>
              <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
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
              {COMPARE_ROWS.map((row, ri) => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  borderBottom: ri < COMPARE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ padding: '12px 20px' }}>
                    <span style={f({ fontSize: 13, color: C.t2 })}>{row.label}</span>
                  </div>
                  {[row.ops, row.fpa, row.ent].map((val, vi) => (
                    <div key={vi} style={{ padding: '12px 16px', textAlign: 'center', borderLeft: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {val === true ? <CheckCircle2 size={14} color={C.green} />
                        : val === false ? <span style={f({ fontSize: 14, color: C.t4 })}>—</span>
                        : <span style={f({ fontSize: 12, color: C.t2, fontWeight: 600 })}>{val}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ background: C.bg1, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>ROI Calculator</span>
            <h2 style={f({ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Calculate your organization's return.
            </h2>
          </div>
          <ROICalc />
        </div>
      </section>

      {/* Enterprise CTA */}
      <section style={{ background: C.bg0, padding: '72px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            <Shield size={16} color={C.green} />
            <span style={f({ fontSize: 13, color: C.t2 })}>All plans include SOC 2 infrastructure and full audit trail</span>
          </div>
          <h2 style={f({ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: C.t1,
            margin: '0 0 16px', letterSpacing: '-0.03em' })}>
            Ready to see the platform?
          </h2>
          <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.7, margin: '0 0 32px' })}>
            A 30-minute executive demo shows FinAutomate with your actual ERP data. No commitment, no pressure — just the platform working for your finance operation.
          </p>
          <button onClick={() => navigate('home')} style={f({
            fontSize: 15, fontWeight: 700, color: '#fff', background: C.blue,
            border: 'none', borderRadius: 11, padding: '14px 32px', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            boxShadow: `0 4px 24px ${C.blue}44`,
          })}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Book CFO Strategy Demo <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
