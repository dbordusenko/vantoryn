import { useState } from 'react'
import { ArrowRight, Database, Brain, Target, CheckCircle2,
  BarChart3, Activity, Workflow, Layers, PlugZap, Sparkles,
  AlertTriangle, RefreshCw, SlidersHorizontal, TrendingUp,
  ArrowUpRight, ArrowDownRight, Shield, Zap, Eye } from 'lucide-react'
import { C, f, FONT } from '../tokens'

/* ─── Architecture Diagram ───────────────────────────────── */
function ArchDiagram() {
  const sources = ['SAP', 'Oracle NetSuite', 'QuickBooks', 'Xero', 'Payroll', 'Banking', 'Salesforce CRM']
  const outputs = [
    { icon: <BarChart3 size={16} color={C.blue} />, label: 'Executive Reporting', color: C.blue },
    { icon: <Activity size={16} color={C.teal} />,  label: 'Predictive Finance', color: C.teal },
    { icon: <Workflow size={16} color={C.purple} />, label: 'AI Operations',      color: C.purple },
    { icon: <Layers size={16} color={C.amber} />,   label: 'Unified Intelligence',color: C.amber },
  ]
  return (
    <div style={{ position: 'relative', padding: '0 20px' }}>
      {/* Row 1 — Sources */}
      <div style={{ marginBottom: 20 }}>
        <div style={f({ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 })}>
          Your Financial Data Sources
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {sources.map(s => (
            <div key={s} style={{
              padding: '8px 14px', borderRadius: 8,
              background: C.bg3, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green,
                boxShadow: `0 0 6px ${C.green}` }} />
              <span style={f({ fontSize: 12, color: C.t2, fontWeight: 500 })}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow down */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20, gap: 3 }}>
        <div style={{ width: 1, height: 28, background: `linear-gradient(180deg, ${C.border}, ${C.blue})` }} />
        <div style={f({ fontSize: 10, color: C.t3, fontWeight: 600, letterSpacing: '0.08em' })}>Real-time sync</div>
      </div>

      {/* Row 2 — AI Layer */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.bg3} 0%, ${C.bg2} 100%)`,
          border: `1px solid ${C.borderHi}`,
          borderRadius: 20, padding: '28px 32px',
          boxShadow: `0 0 60px ${C.blue}14, 0 0 120px ${C.teal}0a`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${C.blue}, ${C.teal}, ${C.purple})` }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.blue}28, ${C.teal}28)`,
                  border: `1px solid ${C.teal}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} color={C.teal} />
                </div>
                <div>
                  <div style={f({ fontSize: 16, fontWeight: 800, color: C.t1, letterSpacing: '-0.02em' })}>
                    AI Intelligence Layer
                  </div>
                  <div style={f({ fontSize: 12, color: C.t3 })}>The core of Vantoryn</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { icon: <Sparkles size={13} color={C.teal} />,        label: 'Data Unification',       sub: 'Cross-system entity resolution' },
                { icon: <Activity size={13} color={C.blue} />,         label: 'Predictive Engine',      sub: 'ML forecasting models' },
                { icon: <AlertTriangle size={13} color={C.amber} />,   label: 'Anomaly Detection',      sub: 'Real-time risk signals' },
                { icon: <SlidersHorizontal size={13} color={C.purple}/>,label: 'Scenario Modeling',    sub: 'What-if simulations' },
                { icon: <RefreshCw size={13} color={C.green} />,       label: 'Auto-Reconciliation',    sub: 'Workflow automation' },
                { icon: <Eye size={13} color={C.red} />,               label: 'Compliance Monitoring',  sub: 'Audit trail & governance' },
              ].map(c => (
                <div key={c.label} style={{ padding: '8px 12px', borderRadius: 8,
                  background: C.bg4, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    {c.icon}
                    <span style={f({ fontSize: 11, fontWeight: 700, color: C.t1 })}>{c.label}</span>
                  </div>
                  <span style={f({ fontSize: 10, color: C.t3 })}>{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20, gap: 3 }}>
        <div style={{ width: 1, height: 28, background: `linear-gradient(180deg, ${C.teal}, ${C.border})` }} />
        <div style={f({ fontSize: 10, color: C.t3, fontWeight: 600, letterSpacing: '0.08em' })}>Executive intelligence</div>
      </div>

      {/* Row 3 — Outputs */}
      <div>
        <div style={f({ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 })}>
          Finance Leaders Act Faster
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {outputs.map(o => (
            <div key={o.label} style={{
              padding: '16px', borderRadius: 12, textAlign: 'center',
              background: C.bg3, border: `1px solid ${C.border}`,
              borderTop: `2px solid ${o.color}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${o.color}18` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{o.icon}</div>
              <div style={f({ fontSize: 12, fontWeight: 700, color: C.t1 })}>{o.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Module Detail ──────────────────────────────────────── */
function ModuleDetail({ mod, isOpen, onToggle }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${isOpen ? mod.color + '50' : C.border}`,
      borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={onToggle} style={f({
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 28px', background: 'transparent', border: 'none', cursor: 'pointer',
        gap: 16,
      })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: `${mod.color}16`, border: `1px solid ${mod.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: mod.color }}>{mod.icon}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={f({ fontSize: 10, color: mod.color, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 3 })}>{mod.tag}</div>
            <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1 })}>{mod.title}</div>
          </div>
        </div>
        <div style={{ color: mod.color, fontSize: 20, transition: 'transform 0.25s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</div>
      </button>
      {isOpen && (
        <div style={{ padding: '0 28px 28px', animation: 'fadeUp 0.25s ease' }}>
          <p style={f({ fontSize: 14, color: C.t2, lineHeight: 1.75, margin: '0 0 20px' })}>{mod.body}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {mod.features.map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 9,
                padding: '10px 14px', borderRadius: 9, background: C.bg3, border: `1px solid ${C.border}` }}>
                <CheckCircle2 size={13} color={mod.color} />
                <span style={f({ fontSize: 13, color: C.t2 })}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Dashboard Preview ──────────────────────────────────── */
function DashboardPreview({ title, subtitle, color, children }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 16, overflow: 'hidden',
      boxShadow: `0 16px 48px rgba(0,0,0,0.5)` }}>
      <div style={{ padding: '12px 20px', background: C.bg3, borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={f({ fontSize: 12, fontWeight: 700, color: C.t1 })}>{title}</div>
          <div style={f({ fontSize: 10, color: C.t3 })}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 8px', borderRadius: 4, background: `${color}1a`, border: `1px solid ${color}40` }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
          <span style={f({ fontSize: 9, color: color, fontWeight: 700 })}>LIVE</span>
        </div>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Platform({ navigate, onBookDemo }) {
  const [openMod, setOpenMod] = useState(0)

  const modules = [
    {
      tag: 'Module 01', title: 'Executive Reporting & Board Intelligence', icon: <BarChart3 size={18} />, color: C.blue,
      body: 'Vantoryn transforms financial data into board-ready deliverables automatically. From monthly management accounts to investor decks, the reporting cycle compresses from weeks to hours.',
      features: [
        'Automated month-end reporting pack',
        'Board deck generation with AI narrative',
        'KPI dashboards with variance drill-down',
        'Management account reconciliation',
        'Custom executive summary templates',
        'One-click PDF + Excel export',
      ],
    },
    {
      tag: 'Module 02', title: 'Predictive Forecasting & Risk Intelligence', icon: <Activity size={18} />, color: C.teal,
      body: 'Machine learning models trained on your historical financial patterns, seasonality, and external signals generate 30–90 day forecasts with measurable confidence intervals.',
      features: [
        'Cash flow prediction with confidence bands',
        'Budget variance analysis & alerts',
        'Scenario modeling — best/base/stress',
        'AP/AR aging risk detection',
        'Revenue run-rate forecasting',
        'FX exposure & sensitivity analysis',
      ],
    },
    {
      tag: 'Module 03', title: 'AI Finance Workflow Automation', icon: <Workflow size={18} />, color: C.purple,
      body: 'The operational backbone of finance — reconciliation, approvals, and close processes — runs automatically, replacing repetitive manual work with auditable AI workflows.',
      features: [
        'Automated invoice reconciliation',
        'Multi-level approval routing',
        'Month-end close task orchestration',
        'ERP bi-directional synchronization',
        'Intercompany elimination automation',
        'Bank feed categorization & matching',
      ],
    },
    {
      tag: 'Module 04', title: 'Unified Financial Intelligence Layer', icon: <Layers size={18} />, color: C.amber,
      body: 'A single, normalized financial data model across your entire tech stack. Every system speaks the same language, every metric is consistent, every report pulls from one source of truth.',
      features: [
        'Cross-system entity resolution',
        'Centralized chart of accounts mapping',
        'Custom KPI definition engine',
        'Multi-currency & multi-entity support',
        'API + webhook access for all data',
        'Data lineage tracking per transaction',
      ],
    },
  ]

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: '80px 28px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}66 1px, transparent 1px), linear-gradient(90deg, ${C.border}66 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 20, marginBottom: 28,
              background: `${C.blue}14`, border: `1px solid ${C.blue}35` }}>
              <Layers size={12} color={C.blue} />
              <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.04em' })}>The Platform</span>
            </div>
            <h1 style={f({ fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800,
              color: C.t1, margin: '0 0 20px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
              One AI layer across your<br />
              <span style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                entire finance operation.
              </span>
            </h1>
            <p style={f({ fontSize: 18, color: C.t2, lineHeight: 1.7, margin: '0 0 36px' })}>
              Vantoryn connects reporting, forecasting, operational workflows, and financial analytics into a unified executive intelligence platform.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={onBookDemo} style={f({
                fontSize: 15, fontWeight: 700, color: '#fff', background: C.blue,
                border: 'none', borderRadius: 10, padding: '13px 28px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                boxShadow: `0 4px 20px ${C.blue}40`,
              })}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Book Executive Demo <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('solutions')} style={f({
                fontSize: 14, fontWeight: 500, color: C.t2,
                background: 'transparent', border: `1px solid ${C.borderMid}`,
                borderRadius: 10, padding: '12px 24px', cursor: 'pointer', transition: 'all 0.2s',
              })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.t1 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t2 }}
              >
                View Solutions by Role
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section style={{ background: C.bg1, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>System Architecture</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              From fragmented data to unified executive intelligence.
            </h2>
          </div>
          <ArchDiagram />
        </div>
      </section>

      {/* Modules */}
      <section style={{ background: C.bg0, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Core Capabilities</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Four modules. One intelligence layer.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {modules.map((mod, i) => (
              <ModuleDetail key={i} mod={mod} isOpen={openMod === i}
                onToggle={() => setOpenMod(openMod === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Gallery */}
      <section style={{ background: C.bg1, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Platform Screens</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              What your finance team sees every day.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {/* Screen 1 — KPI */}
            <DashboardPreview title="Executive Overview" subtitle="Real-time financial position" color={C.blue}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Total Revenue', value: '$14.2M', delta: '+18%', up: true },
                  { label: 'Gross Margin',  value: '67.4%',  delta: '+2.1pp', up: true },
                  { label: 'Cash Position', value: '$8.9M',  delta: '-$340K', up: false },
                  { label: 'Burn Rate',     value: '$890K',  delta: '+4%',   up: false },
                ].map(k => (
                  <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: 8, background: C.bg3 }}>
                    <span style={f({ fontSize: 12, color: C.t2 })}>{k.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>{k.value}</span>
                      <span style={f({ fontSize: 10, color: k.up ? C.green : C.amber, fontWeight: 600 })}>{k.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPreview>

            {/* Screen 2 — Forecast */}
            <DashboardPreview title="Risk Intelligence" subtitle="AI-detected anomalies" color={C.amber}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { sev: 'HIGH',   color: C.red,   text: 'AP payables +23% above plan', sub: '$340K cash impact · Jul 2026' },
                  { sev: 'MED',    color: C.amber,  text: 'Opex Q3 at 88% budget M+2',  sub: 'Engineering overage flagged' },
                  { sev: 'LOW',    color: C.blue,   text: 'AR aging: 3 invoices >60d',   sub: '$420K exposure · Action needed' },
                  { sev: 'INFO',   color: C.green,  text: 'Revenue variance +$182K',     sub: 'Tracking 4% ahead of plan' },
                ].map(a => (
                  <div key={a.text} style={{ padding: '10px 12px', borderRadius: 8,
                    background: `${a.color}0c`, border: `1px solid ${a.color}30` }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={f({ fontSize: 9, color: a.color, fontWeight: 800,
                        padding: '1px 5px', borderRadius: 3, background: `${a.color}20`, flexShrink: 0 })}>{a.sev}</span>
                      <div>
                        <div style={f({ fontSize: 11, fontWeight: 600, color: C.t1, marginBottom: 2 })}>{a.text}</div>
                        <div style={f({ fontSize: 10, color: C.t3 })}>{a.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPreview>

            {/* Screen 3 — Board Pack */}
            <DashboardPreview title="Board Reporting" subtitle="Auto-generated pack" color={C.green}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={f({ fontSize: 11, color: C.t3, marginBottom: 6 })}>Q2 2026 Board Pack — 47 pages</div>
                {[
                  { label: 'Executive Summary', status: 'Ready', color: C.green },
                  { label: 'P&L Statement',     status: 'Ready', color: C.green },
                  { label: 'Cash Flow Analysis', status: 'Ready', color: C.green },
                  { label: 'Variance Report',    status: 'Ready', color: C.green },
                  { label: 'Forecast Slides',    status: 'Ready', color: C.green },
                  { label: 'KPI Dashboard',      status: 'Ready', color: C.green },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 12px', borderRadius: 7, background: C.bg3 }}>
                    <span style={f({ fontSize: 11, color: C.t2 })}>{r.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={11} color={r.color} />
                      <span style={f({ fontSize: 10, color: r.color, fontWeight: 600 })}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPreview>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section style={{ background: C.bg0, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Platform Impact</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1, margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Measured outcomes from day one.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { value: '74%', label: 'Reduction in reporting time', color: C.blue },
              { value: '3.2×', label: 'Faster financial close', color: C.teal },
              { value: '91%', label: 'Forecast accuracy improvement', color: C.green },
              { value: '24h', label: 'Time to first connected insight', color: C.purple },
            ].map(m => (
              <div key={m.value} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: '32px 24px', textAlign: 'center' }}>
                <div style={f({ fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
                  marginBottom: 12, background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' })}>{m.value}</div>
                <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.5 })}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.bg1, padding: '72px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.03em' })}>
            Ready to see it with your data?
          </h2>
          <p style={f({ fontSize: 16, color: C.t2, lineHeight: 1.7, margin: '0 0 32px' })}>
            A 30-minute executive demo shows Vantoryn working with your actual ERP and accounting data.
          </p>
          <button onClick={onBookDemo} style={f({
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

