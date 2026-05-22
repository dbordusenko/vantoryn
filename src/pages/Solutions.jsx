import { useState } from 'react'
import { ArrowRight, CheckCircle2, TrendingUp, Clock, AlertTriangle,
  BarChart3, Activity, Workflow, Layers, ChevronRight,
  Users, Building2, PieChart, Target } from 'lucide-react'
import { C, f } from '../tokens'

const PERSONAS = [
  {
    id: 'cfo', label: 'CFO', icon: <Building2 size={18} />, color: C.blue,
    headline: 'Real-time executive financial visibility.',
    subheadline: 'Strategic intelligence, not spreadsheet summaries.',
    problem: 'CFOs spend too much time chasing data instead of acting on it. Fragmented systems mean financial position is always a snapshot from last week — never the current reality.',
    problemPoints: [
      'Month-end close takes 2+ weeks of manual effort',
      'Board packs require days of analyst time each quarter',
      'Cash flow risk is discovered after operational damage',
      'Forecast accuracy insufficient for confident decision-making',
    ],
    solution: 'FinAutomate gives CFOs real-time financial position, AI-generated executive reporting, and predictive risk signals — all in one intelligence layer.',
    features: [
      { icon: <BarChart3 size={14} />, label: 'Real-time P&L and balance sheet', desc: 'Live view of financial position across all entities' },
      { icon: <AlertTriangle size={14} />, label: 'Predictive risk alerts', desc: 'Cash flow, budget, and operational anomalies flagged 30–90d early' },
      { icon: <Activity size={14} />, label: 'AI-generated board packs', desc: 'Auto-compiled quarterly reports with narrative summaries' },
      { icon: <Target size={14} />, label: 'Scenario modeling', desc: 'Best/base/stress financial scenarios in minutes' },
    ],
    outcomes: [
      { metric: '74%', label: 'reduction in reporting preparation time' },
      { metric: '3.2×', label: 'faster month-end close' },
      { metric: '91%', label: 'forecast accuracy improvement' },
    ],
    quote: '"FinAutomate turned our month-end from a 2-week sprint into an automated process. The CFO brief every morning is how I start every day."',
    quoteRole: 'CFO, Series B SaaS — $28M ARR',
  },
  {
    id: 'fpa', label: 'FP&A', icon: <Activity size={18} />, color: C.teal,
    headline: 'Predictive planning without spreadsheet chaos.',
    subheadline: 'From reactive analysis to forward-looking intelligence.',
    problem: 'FP&A teams are trapped in a cycle of data gathering, model maintenance, and manual variance analysis. Most time is spent on low-value work, not strategic insight.',
    problemPoints: [
      '43% of FP&A time spent on manual data collection and cleaning',
      'Forecast models break with every ERP data change',
      'Rolling forecasts require days to rebuild manually',
      'Scenario modeling limited by spreadsheet complexity',
    ],
    solution: 'FinAutomate replaces the manual FP&A workflow with AI-driven forecasting models, automated variance analysis, and continuous scenario simulation.',
    features: [
      { icon: <Activity size={14} />, label: 'Driver-based forecast models', desc: 'ML models trained on your business patterns and drivers' },
      { icon: <BarChart3 size={14} />, label: 'Variance analysis automation', desc: 'Budget vs actual with root-cause drill-down, auto-generated' },
      { icon: <Layers size={14} />, label: 'Rolling 12-month projections', desc: 'Always-current forecast that updates with each transaction' },
      { icon: <Target size={14} />, label: 'What-if scenario modeling', desc: 'Multi-variable scenarios with downstream financial impact' },
    ],
    outcomes: [
      { metric: '80%', label: 'less time on data preparation' },
      { metric: '±8%', label: 'forecast accuracy vs ±30% manual' },
      { metric: '4hrs', label: 'to generate a full scenario model' },
    ],
    quote: '"We used to spend 3 days building a scenario model for board. Now it takes a conversation with FinAutomate and 4 hours of review."',
    quoteRole: 'VP FP&A, Private Equity-backed manufacturer',
  },
  {
    id: 'controller', label: 'Controller', icon: <Workflow size={18} />, color: C.purple,
    headline: 'Automate reporting and reconciliation workflows.',
    subheadline: 'Close faster. Audit with confidence. Operate with precision.',
    problem: 'Controllers are responsible for the accuracy and speed of financial close — but the tools haven\'t kept pace. Manual reconciliation, fragmented systems, and compliance overhead consume the team.',
    problemPoints: [
      'Reconciliation across multiple systems takes days each month',
      'Manual journal entries create risk of error and restatement',
      'Audit preparation requires weeks of document assembly',
      'Intercompany eliminations are error-prone and time-intensive',
    ],
    solution: 'FinAutomate automates the close process end-to-end — from bank reconciliation to intercompany elimination — with a full audit trail on every action.',
    features: [
      { icon: <CheckCircle2 size={14} />, label: 'Automated bank reconciliation', desc: 'Match transactions across accounts with ML categorization' },
      { icon: <Workflow size={14} />, label: 'Close task orchestration', desc: 'Step-by-step close checklist with auto-completion tracking' },
      { icon: <Layers size={14} />, label: 'ERP sync without exports', desc: 'Bi-directional sync eliminates manual data movement' },
      { icon: <Target size={14} />, label: 'Audit-ready documentation', desc: 'Every journal, reconciliation, and approval trail logged' },
    ],
    outcomes: [
      { metric: '60%', label: 'faster month-end close cycle' },
      { metric: '100%', label: 'audit trail coverage, zero manual logging' },
      { metric: '8 days', label: 'saved per close cycle on average' },
    ],
    quote: '"Our close went from 14 days to 6 in the first quarter. The audit prep alone saved us weeks of work."',
    quoteRole: 'Controller, Multi-entity professional services firm',
  },
  {
    id: 'ceo', label: 'CEO', icon: <TrendingUp size={18} />, color: C.amber,
    headline: 'Financial intelligence for faster business decisions.',
    subheadline: 'Operate on data, not intuition.',
    problem: 'CEOs need financial clarity to make confident decisions — but the data comes too slowly, is too aggregate, or requires a CFO intermediary to interpret. Reactive finance means reactive strategy.',
    problemPoints: [
      'Financial position known weekly, not in real-time',
      'Cash runway uncertainty creates conservative decision-making',
      'Strategic decisions delayed waiting for finance team outputs',
      'No early warning system for operational financial risk',
    ],
    solution: 'FinAutomate gives CEOs a clear, real-time financial picture — with the AI morning brief, runway visibility, and early warning signals to act decisively.',
    features: [
      { icon: <BarChart3 size={14} />, label: 'Executive morning intelligence brief', desc: 'AI-generated daily summary of key financial signals' },
      { icon: <Activity size={14} />, label: 'Revenue and runway visibility', desc: 'Real-time cash position, runway, and burn forecast' },
      { icon: <AlertTriangle size={14} />, label: 'Early warning system', desc: 'Operational and financial risk signals before they escalate' },
      { icon: <Target size={14} />, label: 'Investor-ready reporting', desc: 'Metrics formatted for board, investors, and lenders' },
    ],
    outcomes: [
      { metric: '2×', label: 'faster response to financial anomalies' },
      { metric: 'Daily', label: 'executive brief delivered before 8 AM' },
      { metric: '30d', label: 'earlier detection of cash flow risk' },
    ],
    quote: '"I used to ask the CFO for financial status every Monday. Now I have more context than I ever did before I even open my laptop."',
    quoteRole: 'CEO, $45M ARR B2B software company',
  },
]

export default function Solutions({ navigate }) {
  const [active, setActive] = useState('cfo')
  const persona = PERSONAS.find(p => p.id === active)

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: '72px 28px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
            marginBottom: 24, background: `${C.teal}14`, border: `1px solid ${C.teal}35` }}>
            <Users size={12} color={C.teal} />
            <span style={f({ fontSize: 12, color: C.teal, fontWeight: 600, letterSpacing: '0.04em' })}>Solutions</span>
          </div>
          <h1 style={f({ fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
            Purpose-built for every<br />
            <span style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              finance leader.
            </span>
          </h1>
          <p style={f({ fontSize: 17, color: C.t2, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' })}>
            FinAutomate is designed around the actual workflows, pain points, and decision needs of each finance role.
          </p>
        </div>
      </section>

      {/* Persona Selector */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.bg1, position: 'sticky', top: 66, zIndex: 99 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px',
          display: 'flex', gap: 4 }}>
          {PERSONAS.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)} style={f({
              display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: `2px solid ${active === p.id ? p.color : 'transparent'}`,
              color: active === p.id ? p.color : C.t2,
              fontSize: 14, fontWeight: active === p.id ? 700 : 500,
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => !active === p.id && (e.currentTarget.style.color = C.t1)}
            onMouseLeave={e => !active === p.id && (e.currentTarget.style.color = C.t2)}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Persona Content */}
      <div key={active} style={{ animation: 'pageFade 0.25s ease' }}>

        {/* Headline block */}
        <section style={{ background: C.bg0, padding: '60px 28px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 6,
                  background: `${persona.color}14`, border: `1px solid ${persona.color}35`, marginBottom: 20 }}>
                  <span style={{ color: persona.color }}>{persona.icon}</span>
                  <span style={f({ fontSize: 11, color: persona.color, fontWeight: 700 })}>{persona.label}</span>
                </div>
                <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1,
                  margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.2 })}>{persona.headline}</h2>
                <p style={f({ fontSize: 16, color: persona.color, fontWeight: 600, margin: '0 0 20px' })}>{persona.subheadline}</p>
                <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 28px' })}>{persona.solution}</p>
                <button onClick={() => navigate('pricing')} style={f({
                  fontSize: 15, fontWeight: 700, color: '#fff',
                  background: persona.color, border: 'none', borderRadius: 10,
                  padding: '13px 28px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${persona.color}40`,
                })}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Book {persona.label} Demo <ArrowRight size={15} />
                </button>
              </div>

              {/* Problem block */}
              <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px' }}>
                <div style={f({ fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 18 })}>The Problem Today</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {persona.problemPoints.map(pt => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '12px', borderRadius: 9, background: `${C.red}08`, border: `1px solid ${C.red}22` }}>
                      <AlertTriangle size={13} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={f({ fontSize: 13, color: C.t2, lineHeight: 1.55 })}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features + Outcomes */}
        <section style={{ background: C.bg1, padding: '60px 28px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              {/* Features */}
              <div>
                <div style={f({ fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 20 })}>Key Capabilities</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {persona.features.map(feat => (
                    <div key={feat.label} style={{ display: 'flex', gap: 14, padding: '16px',
                      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
                      transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = persona.color + '50'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: `${persona.color}16`, border: `1px solid ${persona.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: persona.color }}>{feat.icon}</div>
                      <div>
                        <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 4 })}>{feat.label}</div>
                        <div style={f({ fontSize: 12, color: C.t2, lineHeight: 1.5 })}>{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcomes + Quote */}
              <div>
                <div style={f({ fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 20 })}>Business Outcomes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {persona.outcomes.map(o => (
                    <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 16,
                      padding: '20px 24px', background: C.bg2, border: `1px solid ${C.border}`,
                      borderRadius: 12, borderLeft: `3px solid ${persona.color}` }}>
                      <span style={f({ fontSize: 32, fontWeight: 800, color: persona.color,
                        letterSpacing: '-0.03em', flexShrink: 0 })}>{o.metric}</span>
                      <span style={f({ fontSize: 14, color: C.t2 })}>{o.label}</span>
                    </div>
                  ))}
                </div>
                {/* Quote */}
                <div style={{ padding: '20px 24px', background: `${persona.color}0a`,
                  border: `1px solid ${persona.color}25`, borderRadius: 12 }}>
                  <div style={f({ fontSize: 14, color: C.t2, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 12 })}>
                    {persona.quote}
                  </div>
                  <div style={f({ fontSize: 12, color: persona.color, fontWeight: 600 })}>{persona.quoteRole}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Cross-nav to other roles */}
      <section style={{ background: C.bg0, padding: '60px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={f({ fontSize: 14, color: C.t3, textAlign: 'center', marginBottom: 24 })}>
            Also built for:
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {PERSONAS.filter(p => p.id !== active).map(p => (
              <button key={p.id} onClick={() => setActive(p.id)} style={f({
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                border: `1px solid ${C.borderMid}`, borderRadius: 8, background: 'transparent',
                cursor: 'pointer', color: C.t2, fontSize: 14, fontWeight: 500,
                transition: 'all 0.2s',
              })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '50'; e.currentTarget.style.color = p.color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t2 }}
              >
                {p.icon} {p.label} <ChevronRight size={13} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
