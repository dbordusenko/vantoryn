import { useState, useEffect, useRef } from 'react'
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowRight,
  BarChart3, Brain, Shield, Zap, Users, ChevronRight, Activity,
  Database, Lock, Globe, Clock, ArrowUpRight, ArrowDownRight,
  FileText, Bell, Play, ChevronDown,
  Layers, Target, Cpu, RefreshCw, PieChart,
  Building2, BadgeCheck, Workflow,
  PlugZap, CalendarCheck, AreaChart, Mail, Inbox,
  ServerCrash, Sparkles, Radio, GitMerge, CircleDot,
  MoveRight, SlidersHorizontal, Gauge, AlarmClock
} from 'lucide-react'

/* ─── DESIGN TOKENS ──────────────────────────────────────── */
const C = {
  bg0:       '#04050a',
  bg1:       '#080b13',
  bg2:       '#0c1019',
  bg3:       '#111622',
  bg4:       '#161d2e',
  border:    '#171e30',
  borderMid: '#1f293f',
  borderHi:  '#2a3a58',
  t1:        '#eef2fa',
  t2:        '#7e8fa8',
  t3:        '#374256',
  t4:        '#1e2a3a',
  blue:      '#3b7fff',
  blueD:     '#2563eb',
  blueGlow:  '#3b7fff28',
  teal:      '#00c5b5',
  tealGlow:  '#00c5b520',
  green:     '#22c55e',
  greenGlow: '#22c55e1a',
  amber:     '#f59e0b',
  amberGlow: '#f59e0b1a',
  red:       '#f87171',
  redGlow:   '#f8717120',
  purple:    '#818cf8',
  purpleGlow:'#818cf81a',
}

const FONT = "'Inter', system-ui, -apple-system, sans-serif"
const f = s => ({ fontFamily: FONT, ...s })

/* ─── NAV ────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={f({
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(4,5,10,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
      transition: 'all 0.3s ease',
    })}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={f({ fontSize: 17, fontWeight: 700, color: C.t1, letterSpacing: '-0.025em' })}>
            FinAutomate
          </span>
        </div>

        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {['Platform', 'Use Cases', 'Security', 'Pricing'].map(l => (
            <a key={l} href="#" style={f({ fontSize: 14, color: C.t2, textDecoration: 'none', fontWeight: 500 })}
              onMouseEnter={e => e.target.style.color = C.t1}
              onMouseLeave={e => e.target.style.color = C.t2}
            >{l}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="#" style={f({ fontSize: 14, color: C.t2, textDecoration: 'none', fontWeight: 500, padding: '8px 16px' })}>
            Sign in
          </a>
          <button style={f({
            fontSize: 14, fontWeight: 600, color: '#fff',
            background: C.blue, border: 'none', borderRadius: 9,
            padding: '10px 22px', cursor: 'pointer',
            boxShadow: `0 0 24px ${C.blueGlow}`,
            transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.background = C.blueD; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Book CFO Demo
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ─── DASHBOARD MOCKUP (Command Center) ─────────────────── */
function DashboardMockup() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3400)
    return () => clearInterval(id)
  }, [])

  // SVG chart
  const actual   = [42, 45, 41, 50, 53, 48, 57, 61, 58, 65]
  const fcast    = [65, 72, 80, 88, 95]
  const fcastHi  = [65, 76, 85, 95, 103]
  const fcastLo  = [65, 68, 75, 81, 87]
  const W = 380, H = 96, min = 32, max = 110
  const total = actual.length + fcast.length - 1
  const tx = (i) => (i / (total - 1)) * W
  const ty = v => H - ((v - min) / (max - min)) * H

  const aCoords = actual.map((v, i) => [tx(i), ty(v)])
  const fCoords = fcast.map((v, i) => [tx(actual.length - 1 + i), ty(v)])
  const fHiCoords = fcastHi.map((v, i) => [tx(actual.length - 1 + i), ty(v)])
  const fLoCoords = fcastLo.map((v, i) => [tx(actual.length - 1 + i), ty(v)])

  const aPath = aCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const fPath = fCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const confBand = fHiCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    + ' ' + [...fLoCoords].reverse().map((p, i) => `${i === 0 ? 'L' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
  const aArea = aPath + ` L${aCoords[aCoords.length-1][0].toFixed(1)},${H} L0,${H} Z`

  const feeds = [
    { color: C.amber,  icon: <AlertTriangle size={10} />, text: 'AP payables +23% above plan — $340K cash impact detected' },
    { color: C.green,  icon: <CheckCircle2 size={10} />,  text: 'Q3 cash flow forecast generated · Confidence 91%' },
    { color: C.blue,   icon: <RefreshCw size={10} />,     text: 'SAP ERP sync complete · 847 transactions reconciled' },
    { color: C.purple, icon: <TrendingUp size={10} />,    text: 'Revenue variance +$182K vs plan · Breakdown ready' },
    { color: C.red,    icon: <AlertTriangle size={10} />, text: 'Opex Q3 budget: 88% utilized at Month 2 — review flagged' },
  ]
  const visibleFeed = feeds[(tick) % feeds.length]

  return (
    <div style={{
      background: C.bg2, border: `1px solid ${C.borderMid}`,
      borderRadius: 18, overflow: 'hidden', width: '100%', maxWidth: 500,
      boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.border}, 0 0 60px ${C.blueGlow}`,
    }}>

      {/* ERP Integration Status Bar */}
      <div style={{
        padding: '8px 18px', background: C.bg3,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {[
            { label: 'SAP',       ok: true },
            { label: 'NetSuite',  ok: true },
            { label: 'QB',        ok: true },
            { label: 'Payroll',   ok: true },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: s.ok ? C.green : C.red,
                boxShadow: s.ok ? `0 0 6px ${C.green}` : `0 0 6px ${C.red}`,
              }} />
              <span style={f({ fontSize: 10, color: C.t2, fontWeight: 500 })}>{s.label}</span>
            </div>
          ))}
        </div>
        <span style={f({ fontSize: 10, color: C.t3 })}>Last sync: 2 min ago</span>
      </div>

      {/* Dashboard Header */}
      <div style={{
        padding: '12px 18px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green,
            boxShadow: `0 0 8px ${C.green}`, animation: 'pulseGreen 2s ease infinite' }} />
          <span style={f({ fontSize: 11, fontWeight: 700, color: C.t2, letterSpacing: '0.07em', textTransform: 'uppercase' })}>
            Executive Command Center
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={f({ fontSize: 10, color: C.t3 })}>Q2 2026</span>
          <div style={{
            padding: '2px 8px', borderRadius: 4,
            background: `${C.blue}1a`, border: `1px solid ${C.blue}45`,
          }}>
            <span style={f({ fontSize: 10, color: C.blue, fontWeight: 700 })}>● LIVE</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: C.border }}>
        {[
          { label: 'Revenue',     value: '$14.2M', delta: '+18%',  up: true,  color: C.blue },
          { label: 'EBITDA',      value: '$3.8M',  delta: '+11%',  up: true,  color: C.green },
          { label: 'Cash Runway', value: '11.4mo', delta: '−2mo',  up: false, color: C.amber },
          { label: 'Burn Rate',   value: '$890K',  delta: '+4%',   up: false, color: C.red },
        ].map(k => (
          <div key={k.label} style={{ background: C.bg2, padding: '12px 14px' }}>
            <div style={f({ fontSize: 9, color: C.t3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' })}>{k.label}</div>
            <div style={f({ fontSize: 18, fontWeight: 800, color: C.t1, letterSpacing: '-0.03em', marginBottom: 3 })}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {k.up ? <ArrowUpRight size={10} color={k.up ? C.green : C.amber} /> : <ArrowDownRight size={10} color={C.amber} />}
              <span style={f({ fontSize: 10, color: k.up ? C.green : C.amber, fontWeight: 600 })}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={f({ fontSize: 10, fontWeight: 700, color: C.t2, letterSpacing: '0.04em' })}>Cash Flow · Actual vs AI Forecast</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 2, background: C.blue, borderRadius: 1 }} />
              <span style={f({ fontSize: 9, color: C.t3 })}>Actual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 2, background: C.teal, borderRadius: 1 }} />
              <span style={f({ fontSize: 9, color: C.t3 })}>Forecast</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 8, background: `${C.teal}22`, borderRadius: 2, border: `1px solid ${C.teal}40` }} />
              <span style={f({ fontSize: 9, color: C.t3 })}>±Confidence</span>
            </div>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 96, display: 'block' }}>
          <defs>
            <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.blue} stopOpacity="0.18" />
              <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map(f => (
            <line key={f} x1="0" y1={H * f} x2={W} y2={H * f}
              stroke={C.border} strokeWidth="1" strokeDasharray="3,5" />
          ))}
          {/* Confidence band */}
          <path d={confBand} fill={`${C.teal}14`} stroke="none" />
          <path d={confBand.split(' Z')[0].replace('M', 'M')} fill="none" stroke={`${C.teal}25`} strokeWidth="0.5" />
          {/* Area */}
          <path d={aArea} fill="url(#aGrad)" />
          {/* Actual */}
          <path d={aPath} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {/* Forecast */}
          <path d={fPath} fill="none" stroke={C.teal} strokeWidth="1.5"
            strokeDasharray="5,3" strokeLinejoin="round" />
          {/* Divider line */}
          <line x1={aCoords[aCoords.length-1][0]} y1="0" x2={aCoords[aCoords.length-1][0]} y2={H}
            stroke={C.borderMid} strokeWidth="1" strokeDasharray="3,3" />
          <text x={aCoords[aCoords.length-1][0] + 4} y="10"
            fill={C.t3} fontSize="8" fontFamily={FONT}>Now</text>
          {/* Dots */}
          <circle cx={aCoords[aCoords.length-1][0]} cy={aCoords[aCoords.length-1][1]}
            r="3.5" fill={C.blue} stroke={C.bg2} strokeWidth="2" />
          <circle cx={fCoords[fCoords.length-1][0]} cy={fCoords[fCoords.length-1][1]}
            r="3" fill={C.teal} stroke={C.bg2} strokeWidth="2" />
        </svg>
      </div>

      {/* AI Signal Feed */}
      <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 9, color: C.t3, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 3, fontFamily: FONT }}>
          ◉ AI Intelligence Feed
        </div>
        <div key={tick} style={{
          display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 12px',
          background: `${visibleFeed.color}0e`, border: `1px solid ${visibleFeed.color}30`,
          borderRadius: 8, animation: 'fadeIn 0.35s ease',
        }}>
          <span style={{ color: visibleFeed.color, marginTop: 1, flexShrink: 0 }}>{visibleFeed.icon}</span>
          <span style={f({ fontSize: 11, color: C.t2, lineHeight: 1.5 })}>{visibleFeed.text}</span>
        </div>
        {/* Feed dots */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', paddingTop: 4 }}>
          {feeds.map((_, i) => (
            <div key={i} style={{
              width: i === tick % feeds.length ? 16 : 5, height: 5, borderRadius: 3,
              background: i === tick % feeds.length ? C.blue : C.borderMid,
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero({ navigate }) {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: C.bg0, position: 'relative', overflow: 'hidden',
      padding: '110px 28px 90px',
    }}>
      <style>{`
        @keyframes pulseGreen { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(${C.border}88 1px, transparent 1px), linear-gradient(90deg, ${C.border}88 1px, transparent 1px)`,
        backgroundSize: '64px 64px', opacity: 0.5,
        maskImage: 'radial-gradient(ellipse 80% 60% at 60% 40%, black 20%, transparent 80%)',
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '58%', width: 700, height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.blue}14 0%, ${C.teal}08 40%, transparent 70%)`,
        transform: 'translate(-50%,-50%)', zIndex: 0,
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 56, alignItems: 'center' }}>
          {/* Left */}
          <div style={{ animation: 'slideUp 0.6s ease' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20,
              background: `${C.blue}14`, border: `1px solid ${C.blue}35`,
              marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue,
                animation: 'pulseGreen 2s ease infinite' }} />
              <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.04em' })}>
                AI Financial Operating System
              </span>
            </div>

            {/* Headline */}
            <h1 style={f({
              fontSize: 'clamp(40px, 4.8vw, 62px)',
              fontWeight: 800, lineHeight: 1.08,
              color: C.t1, margin: '0 0 8px',
              letterSpacing: '-0.035em',
            })}>
              The AI Operating
            </h1>
            <h1 style={f({
              fontSize: 'clamp(40px, 4.8vw, 62px)',
              fontWeight: 800, lineHeight: 1.08,
              margin: '0 0 28px',
              letterSpacing: '-0.035em',
              background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 60%, ${C.teal} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            })}>
              System for Finance.
            </h1>

            <p style={f({
              fontSize: 18, lineHeight: 1.7, color: C.t2,
              margin: '0 0 40px', maxWidth: 450,
            })}>
              Finance leaders use FinAutomate to close in hours, predict risk weeks early, and replace fragmented reporting with real-time executive intelligence.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              <button style={f({
                fontSize: 15, fontWeight: 700, color: '#fff',
                background: C.blue, border: 'none', borderRadius: 11,
                padding: '15px 32px', cursor: 'pointer',
                boxShadow: `0 4px 24px ${C.blue}44`,
                display: 'flex', alignItems: 'center', gap: 9,
                transition: 'all 0.2s',
              })}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 36px ${C.blue}55` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${C.blue}44` }}
              >
                See Predictive Finance in Action <ArrowRight size={16} />
              </button>
              <button style={f({
                fontSize: 14, fontWeight: 500, color: C.t2,
                background: 'transparent', border: `1px solid ${C.borderMid}`,
                borderRadius: 11, padding: '14px 24px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.t1 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t2 }}
              >
                <Play size={13} fill={C.t2} /> Watch 3-min Overview
              </button>
            </div>

            {/* Trust proof */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { icon: <PlugZap size={13} color={C.teal} />, text: 'Connect ERP, accounting, and payroll in under 24 hours' },
                { icon: <Shield size={13} color={C.green} />, text: 'SOC 2 Type II · AES-256 encryption · Full audit trail' },
                { icon: <Building2 size={13} color={C.blue} />, text: 'Deployed at companies managing $10M–$500M in revenue' },
              ].map(t => (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t.icon}
                  <span style={f({ fontSize: 13, color: C.t2 })}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'slideUp 0.7s ease 0.1s both' }}>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── TRUST BAR ──────────────────────────────────────────── */
function TrustBar() {
  return (
    <section style={{
      background: C.bg1,
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Top: integrations */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' })}>
            Connects with
          </span>
          <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
            {['SAP', 'Oracle NetSuite', 'QuickBooks', 'Xero', 'Salesforce', 'MS Dynamics', 'Snowflake'].map(l => (
              <span key={l} style={f({ fontSize: 13, fontWeight: 600, color: C.t3, letterSpacing: '0.01em' })}>{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: <Shield size={11} color={C.green} />, label: 'SOC 2' },
              { icon: <Lock size={11} color={C.blue} />, label: 'AES-256' },
              { icon: <BadgeCheck size={11} color={C.teal} />, label: 'GDPR' },
            ].map(b => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                border: `1px solid ${C.border}`, borderRadius: 7,
              }}>
                {b.icon}
                <span style={f({ fontSize: 11, color: C.t3 })}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FINANCIAL ANXIETY SECTION ──────────────────────────── */
function FinancialAnxietySection({ navigate }) {
  const stats = [
    { value: '14',  unit: 'days',          label: 'average month-end close cycle at mid-market companies',   color: C.amber },
    { value: '43%', unit: 'of FP&A time',  label: 'spent on manual data collection and formatting',          color: C.red   },
    { value: '$2.1M',unit: 'per year',     label: 'average cost of delayed financial decisions per company',  color: C.purple},
    { value: '6–8', unit: 'week lag',      label: 'before finance teams detect a cash flow problem early enough to act', color: C.blue  },
  ]
  return (
    <section style={{ background: C.bg0, padding: '88px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>
            The Cost of Staying Reactive
          </span>
          <h2 style={f({
            fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800,
            color: C.t1, margin: '16px 0 20px', letterSpacing: '-0.03em',
          })}>Finance teams lose months every year<br />to infrastructure that isn't built for today.</h2>
          <p style={f({ fontSize: 16, color: C.t2, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 })}>
            While your team is reconciling exports and formatting decks, competitors are making data-driven decisions in real time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
          {stats.map(s => (
            <div key={s.value} style={{
              background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '28px 24px', textAlign: 'center',
              borderTop: `2px solid ${s.color}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${s.color}18` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={f({ fontSize: 42, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: s.color, marginBottom: 4 })}>
                {s.value}
              </div>
              <div style={f({ fontSize: 12, color: s.color, fontWeight: 600, marginBottom: 12, opacity: 0.8 })}>
                {s.unit}
              </div>
              <div style={f({ fontSize: 13, color: C.t2, lineHeight: 1.6 })}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transition statement */}
        <div style={{
          background: C.bg2, border: `1px solid ${C.borderMid}`,
          borderRadius: 16, padding: '28px 36px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1 }}>
            <div style={f({ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8, letterSpacing: '-0.02em' })}>
              FinAutomate replaces reactive finance operations with real-time AI intelligence.
            </div>
            <div style={f({ fontSize: 14, color: C.t2, lineHeight: 1.65 })}>
              One platform that unifies your financial data, automates the operational backbone, and gives executive teams predictive visibility.
            </div>
          </div>
          <button onClick={() => navigate('platform')} style={f({
            fontSize: 14, fontWeight: 600, color: '#fff',
            background: C.blue, border: 'none', borderRadius: 10,
            padding: '13px 28px', cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s', flexShrink: 0,
          })}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            See the Solution <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── PLATFORM MODULES ───────────────────────────────────── */
function PlatformSection() {
  const [active, setActive] = useState(0)
  const modules = [
    {
      icon: <BarChart3 size={19} />, color: C.blue,
      tag: 'Module 01', title: 'Executive Reporting',
      headline: 'Board-ready reporting in hours, not weeks.',
      body: 'FinAutomate compiles financial data across all connected systems and generates board packs, variance reports, and management decks — formatted, accurate, and automated.',
      outcomes: ['Automated month-end close', 'Auto-generated board packs', 'KPI dashboards with drill-down', '70% faster reporting cycle'],
    },
    {
      icon: <Activity size={19} />, color: C.teal,
      tag: 'Module 02', title: 'Predictive Finance',
      headline: 'Detect cash flow and budget risk 30–90 days early.',
      body: 'AI forecasting models analyze run rates, payment patterns, and external signals to predict financial risk before it becomes operational impact.',
      outcomes: ['Cash flow risk alerts', 'Budget anomaly detection', 'Scenario modeling', 'Confidence-interval forecasts'],
    },
    {
      icon: <Workflow size={19} />, color: C.purple,
      tag: 'Module 03', title: 'AI Finance Operations',
      headline: 'Automate the operational backbone of finance.',
      body: 'Approval routing, invoice reconciliation, ERP synchronization — FinAutomate eliminates the manual workflows that consume your team capacity.',
      outcomes: ['Approval workflow automation', 'Invoice reconciliation', 'ERP bi-directional sync', 'Full audit trail per action'],
    },
    {
      icon: <Layers size={19} />, color: C.amber,
      tag: 'Module 04', title: 'Unified Financial Intelligence',
      headline: 'One source of truth across your entire financial stack.',
      body: 'A unified data layer across accounting, ERP, payroll, and operations — so every KPI, metric, and report pulls from the same verified real-time source.',
      outcomes: ['Single source of truth', 'Cross-system data integrity', 'Custom metric definitions', 'API + webhook access'],
    },
  ]
  const m = modules[active]
  return (
    <section style={{ background: C.bg1, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>The Platform</span>
          <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1, margin: '16px 0 0', letterSpacing: '-0.03em' })}>
            Four capabilities. One intelligence layer.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActive(i)} style={f({
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderRadius: 11, cursor: 'pointer', border: 'none',
                background: active === i ? `${mod.color}12` : 'transparent',
                borderLeft: `2px solid ${active === i ? mod.color : 'transparent'}`,
                textAlign: 'left', transition: 'all 0.2s',
              })}>
                <span style={{ color: active === i ? mod.color : C.t3 }}>{mod.icon}</span>
                <div>
                  <div style={f({ fontSize: 10, color: active === i ? mod.color : C.t3, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 2 })}>{mod.tag}</div>
                  <div style={f({ fontSize: 14, fontWeight: 600, color: active === i ? C.t1 : C.t2 })}>{mod.title}</div>
                </div>
                {active === i && <ChevronRight size={14} color={mod.color} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20, padding: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
              borderRadius: 6, background: `${m.color}14`, marginBottom: 24 }}>
              <span style={{ color: m.color }}>{m.icon}</span>
              <span style={f({ fontSize: 12, color: m.color, fontWeight: 700 })}>{m.tag} — {m.title}</span>
            </div>
            <h3 style={f({ fontSize: 26, fontWeight: 800, color: C.t1, margin: '0 0 18px', letterSpacing: '-0.03em', lineHeight: 1.3 })}>{m.headline}</h3>
            <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 30px' })}>{m.body}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {m.outcomes.map(o => (
                <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10, background: C.bg3, border: `1px solid ${C.border}` }}>
                  <CheckCircle2 size={13} color={m.color} />
                  <span style={f({ fontSize: 13, color: C.t2 })}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── HOW IT WORKS (Visual Flow) ─────────────────────────── */
function HowItWorksSection() {
  return (
    <section style={{ background: C.bg0, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Architecture</span>
          <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1, margin: '16px 0 0', letterSpacing: '-0.03em' })}>
            From fragmented data to executive intelligence.
          </h2>
        </div>

        {/* Flow diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 0, alignItems: 'center', marginBottom: 40 }}>
          {/* Layer 1: Data Sources */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: '28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.blue}16`,
                border: `1px solid ${C.blue}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={16} color={C.blue} />
              </div>
              <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Your Data Sources</span>
            </div>
            {['SAP / Oracle ERP', 'QuickBooks / Xero', 'Payroll systems', 'Salesforce CRM', 'Bank & treasury'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0',
                borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, flexShrink: 0 }} />
                <span style={f({ fontSize: 12, color: C.t2 })}>{s}</span>
              </div>
            ))}
          </div>

          {/* Arrow 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', gap: 6 }}>
            <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, ${C.blue}, ${C.teal})` }} />
            <ArrowRight size={16} color={C.teal} />
            <span style={f({ fontSize: 9, color: C.t3, textAlign: 'center', lineHeight: 1.4, maxWidth: 60 })}>
              Real-time<br/>sync
            </span>
          </div>

          {/* Layer 2: AI Intelligence Layer */}
          <div style={{
            background: `linear-gradient(180deg, ${C.bg3} 0%, ${C.bg2} 100%)`,
            border: `1px solid ${C.borderHi}`,
            borderRadius: 18, padding: '28px 24px', position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 40px ${C.blue}14`,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${C.blue}, ${C.teal})`,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9,
                background: `linear-gradient(135deg, ${C.blue}30, ${C.teal}30)`,
                border: `1px solid ${C.teal}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={16} color={C.teal} />
              </div>
              <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>AI Intelligence Layer</span>
            </div>
            {[
              { icon: <Sparkles size={12} />, label: 'Data unification & enrichment', color: C.teal },
              { icon: <Activity size={12} />, label: 'Predictive forecasting engine', color: C.blue },
              { icon: <AlertTriangle size={12} />, label: 'Anomaly detection', color: C.amber },
              { icon: <SlidersHorizontal size={12} />, label: 'Scenario modeling', color: C.purple },
              { icon: <RefreshCw size={12} />, label: 'Auto-reconciliation', color: C.green },
            ].map(i => (
              <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0',
                borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: i.color }}>{i.icon}</span>
                <span style={f({ fontSize: 12, color: C.t2 })}>{i.label}</span>
              </div>
            ))}
          </div>

          {/* Arrow 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', gap: 6 }}>
            <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <ArrowRight size={16} color={C.purple} />
            <span style={f({ fontSize: 9, color: C.t3, textAlign: 'center', lineHeight: 1.4, maxWidth: 60 })}>
              Decision<br/>intelligence
            </span>
          </div>

          {/* Layer 3: Executive Output */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: '28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.green}16`,
                border: `1px solid ${C.green}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={16} color={C.green} />
              </div>
              <span style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>Executive Actions</span>
            </div>
            {[
              'Auto board & management packs',
              'Predictive risk alerts',
              'Real-time executive dashboards',
              'Automated approval workflows',
              'CFO morning intelligence brief',
            ].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0',
                borderBottom: `1px solid ${C.border}` }}>
                <CheckCircle2 size={11} color={C.green} style={{ flexShrink: 0 }} />
                <span style={f({ fontSize: 12, color: C.t2 })}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── AI EXECUTIVE BRIEFING (Killer Feature) ────────────── */
function ExecutiveBriefingSection() {
  return (
    <section style={{ background: C.bg1, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          {/* Left — copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
              borderRadius: 6, background: `${C.teal}14`, border: `1px solid ${C.teal}35`, marginBottom: 24 }}>
              <Sparkles size={12} color={C.teal} />
              <span style={f({ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: '0.06em' })}>Signature Feature</span>
            </div>
            <h2 style={f({
              fontSize: 'clamp(28px, 3.2vw, 42px)', fontWeight: 800,
              color: C.t1, margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.2,
            })}>
              Your CFO morning briefing.<br />
              <span style={{ color: C.teal }}>Generated automatically.</span>
            </h2>
            <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 28px' })}>
              Every morning at 8 AM, FinAutomate delivers a concise executive intelligence brief directly to your inbox — key financial signals, anomalies, and decisions that require attention. No dashboards to open. No exports to run.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {[
                { icon: <AlarmClock size={15} color={C.teal} />, text: 'Delivered before market open, every business day' },
                { icon: <Brain size={15} color={C.blue} />,     text: 'Synthesizes data across all connected financial systems' },
                { icon: <Bell size={15} color={C.amber} />,     text: 'Flags anomalies, variances, and decisions requiring action' },
                { icon: <Gauge size={15} color={C.green} />,    text: 'Calibrated to your company stage, structure, and KPIs' },
              ].map(i => (
                <div key={i.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {i.icon}
                  <span style={f({ fontSize: 14, color: C.t2 })}>{i.text}</span>
                </div>
              ))}
            </div>
            <button style={f({
              fontSize: 14, fontWeight: 600, color: C.t1,
              background: 'transparent', border: `1px solid ${C.borderMid}`,
              borderRadius: 9, padding: '12px 24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHi}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderMid}
            >
              See a Sample Brief <ChevronRight size={15} />
            </button>
          </div>

          {/* Right — Email mockup */}
          <div style={{
            background: C.bg2, border: `1px solid ${C.borderMid}`,
            borderRadius: 18, overflow: 'hidden',
            boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 40px ${C.teal}14`,
          }}>
            {/* Email chrome */}
            <div style={{ background: C.bg3, padding: '12px 20px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 8 }}>
              <Inbox size={14} color={C.t3} />
              <span style={f({ fontSize: 11, color: C.t3 })}>FinAutomate Intelligence</span>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Email header */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                <div style={f({ fontSize: 11, color: C.t3, marginBottom: 6 })}>Friday, May 23, 2026 · 08:00 AM</div>
                <div style={f({ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4, letterSpacing: '-0.02em' })}>
                  CFO Intelligence Brief — Week 21
                </div>
                <div style={f({ fontSize: 12, color: C.t3 })}>To: sarah.chen@company.com (CFO)</div>
              </div>

              {/* AI Summary */}
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: `${C.teal}0c`, border: `1px solid ${C.teal}28`, marginBottom: 16,
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Brain size={13} color={C.teal} />
                  <span style={f({ fontSize: 11, color: C.teal, fontWeight: 700 })}>AI Executive Summary</span>
                </div>
                <p style={f({ fontSize: 12, color: C.t2, lineHeight: 1.7, margin: 0 })}>
                  "Cash position improved $1.2M this week — AP cycle optimization yielding expected results. Q2 revenue is tracking 4% above plan. Three items require your attention before Monday's board call."
                </p>
              </div>

              {/* Signal rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={f({ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 })}>
                  Signals requiring attention
                </div>
                {[
                  { color: C.green, icon: <TrendingUp size={11} />,     text: 'Revenue +$182K vs plan · Q2 forecast upgraded to $14.9M' },
                  { color: C.amber, icon: <AlertTriangle size={11} />,   text: 'Opex Q3 budget 88% utilized at M+2 · Engineering overage' },
                  { color: C.red,   icon: <AlertTriangle size={11} />,   text: 'AR aging: 3 invoices >60 days · $420K exposure flagged' },
                  { color: C.blue,  icon: <CalendarCheck size={11} />,   text: 'Month-end close on track · T-minus 4 days · 94% complete' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 10px',
                    borderRadius: 7, background: `${s.color}0a`, border: `1px solid ${s.color}28` }}>
                    <span style={{ color: s.color, marginTop: 1, flexShrink: 0 }}>{s.icon}</span>
                    <span style={f({ fontSize: 11, color: C.t2 })}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── IMPACT METRICS ─────────────────────────────────────── */
function ImpactSection() {
  const metrics = [
    { value: '74%', label: 'reduction in time spent on monthly financial reporting', color: C.blue },
    { value: '3.2×', label: 'faster financial close cycle vs pre-FinAutomate baseline',  color: C.teal },
    { value: '91%', label: 'forecast accuracy improvement in first 90 days of deployment', color: C.green },
  ]
  return (
    <section style={{ background: C.bg0, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Business Impact</span>
          <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1, margin: '16px 0 0', letterSpacing: '-0.03em' })}>
            Finance operations, fundamentally changed.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {metrics.map(m => (
            <div key={m.value} style={{ background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: '44px 36px', textAlign: 'center' }}>
              <div style={f({
                fontSize: 68, fontWeight: 800, lineHeight: 1, marginBottom: 16, letterSpacing: '-0.04em',
                background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              })}>{m.value}</div>
              <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.65, margin: 0 })}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── BEFORE / AFTER ─────────────────────────────────────── */
function BeforeAfterSection() {
  const rows = [
    ['Month-end close',      '12–18 days of manual collection',     '24–48 hours, fully automated'],
    ['Financial visibility', 'Week-old Excel snapshots',             'Real-time unified intelligence layer'],
    ['Risk detection',       'Discovered after operational impact',  'Predicted 30–90 days early'],
    ['Board reporting',      'Manual data pull + PowerPoint',        'Auto-generated, export-ready packs'],
    ['Forecast accuracy',    'Analyst estimate ±30%',                'AI model ±8% with confidence bands'],
    ['Compliance audit',     'Spreadsheet trail, high manual effort','Full audit log, one-click export'],
  ]
  return (
    <section style={{ background: C.bg1, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>The Difference</span>
          <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1, margin: '16px 0 0', letterSpacing: '-0.03em' })}>
            Before FinAutomate. After FinAutomate.
          </h2>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: C.bg3, borderBottom: `1px solid ${C.border}` }}>
            {['', 'Before', 'After — FinAutomate'].map((h, i) => (
              <div key={i} style={{ padding: '14px 24px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <span style={f({ fontSize: 11, fontWeight: 700, color: i === 2 ? C.blue : C.t3,
                  letterSpacing: '0.07em', textTransform: 'uppercase' })}>{h}</span>
              </div>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              borderBottom: ri < rows.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ padding: '16px 24px', borderRight: `1px solid ${C.border}` }}>
                <span style={f({ fontSize: 14, fontWeight: 600, color: C.t2 })}>{r[0]}</span>
              </div>
              <div style={{ padding: '16px 24px', borderRight: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={11} color={C.red} style={{ flexShrink: 0 }} />
                <span style={f({ fontSize: 13, color: C.t3 })}>{r[1]}</span>
              </div>
              <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={11} color={C.green} style={{ flexShrink: 0 }} />
                <span style={f({ fontSize: 13, color: C.t1 })}>{r[2]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SECURITY ───────────────────────────────────────────── */
function SecuritySection({ navigate }) {
  const items = [
    { icon: <Shield size={19} />,   color: C.blue,   title: 'SOC 2 Type II Certified',        body: 'Annual independent audits of security, availability, and confidentiality.' },
    { icon: <Lock size={19} />,     color: C.green,  title: 'End-to-End Encryption',           body: 'AES-256 at rest, TLS 1.3 in transit. Financial data is always protected.' },
    { icon: <FileText size={19} />, color: C.teal,   title: 'Full Audit Logs',                 body: 'Every read, write, and export logged with user, timestamp, and data lineage.' },
    { icon: <Users size={19} />,    color: C.purple, title: 'Role-Based Access Control',       body: 'Granular permissions by team, module, and sensitivity. Least-privilege by default.' },
    { icon: <Building2 size={19} />,color: C.amber,  title: 'Single-Tenant Option',            body: 'Dedicated infrastructure for enterprise clients with strict isolation needs.' },
    { icon: <Globe size={19} />,    color: C.red,    title: 'GDPR & CCPA Compliant',           body: 'Full compliance with EU and US privacy regulations. DPA available on request.' },
  ]
  return (
    <section style={{ background: C.bg0, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Security & Governance</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: C.t1, margin: '16px 0 20px', letterSpacing: '-0.03em', lineHeight: 1.2 })}>
              Enterprise-grade infrastructure for financial data.
            </h2>
            <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 32px' })}>
              FinAutomate was designed for organizations where data integrity and auditability are non-negotiable. Every layer meets enterprise security standards.
            </p>
            <button style={f({ fontSize: 14, fontWeight: 600, color: C.t1, background: 'transparent',
              border: `1px solid ${C.borderMid}`, borderRadius: 9, padding: '12px 22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' })}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHi}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderMid}
            >
              Security Documentation <ChevronRight size={15} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {items.map(item => (
              <div key={item.title} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '20px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = item.color + '50'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ color: item.color, marginBottom: 12 }}>{item.icon}</div>
                <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 6 })}>{item.title}</div>
                <div style={f({ fontSize: 12, color: C.t2, lineHeight: 1.65 })}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── USE CASES ──────────────────────────────────────────── */
function UseCasesSection({ navigate }) {
  const personas = [
    { role: 'CFO', color: C.blue, headline: 'Strategic visibility without manual overhead.',
      points: ['Real-time financial position', 'Board pack auto-generation', 'Risk alerts before impact', 'Scenario analysis in minutes'] },
    { role: 'FP&A Director', color: C.teal, headline: 'AI forecasting that replaces spreadsheets.',
      points: ['Driver-based forecast models', 'Variance analysis automation', 'Rolling 12-month projections', 'What-if scenario modeling'] },
    { role: 'Controller', color: C.purple, headline: 'Faster close. Cleaner data. Full audit trail.',
      points: ['Automated reconciliation', 'ERP sync without exports', 'Compliance-ready logs', 'Intercompany elimination'] },
    { role: 'CEO', color: C.amber, headline: 'Financial intelligence, not just numbers.',
      points: ['Executive summary with signals', 'Revenue and runway visibility', 'Department cost breakdown', 'Investor-ready reporting'] },
  ]
  return (
    <section style={{ background: C.bg1, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Who It's For</span>
          <h2 style={f({ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.t1, margin: '16px 0 0', letterSpacing: '-0.03em' })}>
            Built for every finance leader.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {personas.map(p => (
            <div key={p.role} style={{ background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '28px 22px', position: 'relative', overflow: 'hidden',
              transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 36px ${p.color}14` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.color }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
                borderRadius: 6, marginBottom: 16, background: `${p.color}16`, border: `1px solid ${p.color}30` }}>
                <span style={f({ fontSize: 12, color: p.color, fontWeight: 700 })}>{p.role}</span>
              </div>
              <h4 style={f({ fontSize: 14, fontWeight: 700, color: C.t1, margin: '0 0 18px', lineHeight: 1.4 })}>{p.headline}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.points.map(pt => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <ChevronRight size={11} color={p.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={f({ fontSize: 12, color: C.t2, lineHeight: 1.5 })}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FINAL CTA ──────────────────────────────────────────── */
function FinalCTA({ navigate }) {
  return (
    <section style={{ background: C.bg0, padding: '110px 28px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          borderRadius: 20, background: `${C.blue}14`, border: `1px solid ${C.blue}35`, marginBottom: 36 }}>
          <CalendarCheck size={13} color={C.blue} />
          <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.04em' })}>
            30-minute executive demo · No commitment required
          </span>
        </div>
        <h2 style={f({
          fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800,
          color: C.t1, margin: '0 0 24px', letterSpacing: '-0.035em', lineHeight: 1.1,
        })}>
          Replace reactive finance<br />with predictive intelligence.
        </h2>
        <p style={f({ fontSize: 17, color: C.t2, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' })}>
          Join finance teams that have moved from spreadsheet-driven reporting to real-time AI intelligence. See FinAutomate in action with your actual data stack.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <button style={f({
            fontSize: 16, fontWeight: 700, color: '#fff',
            background: C.blue, border: 'none', borderRadius: 12,
            padding: '17px 40px', cursor: 'pointer',
            boxShadow: `0 8px 36px ${C.blue}44`,
            display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 48px ${C.blue}55` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 36px ${C.blue}44` }}
          >
            Book CFO Strategy Demo <ArrowRight size={18} />
          </button>
          <button style={f({
            fontSize: 14, fontWeight: 500, color: C.t2,
            background: 'transparent', border: `1px solid ${C.borderMid}`,
            borderRadius: 12, padding: '16px 28px', cursor: 'pointer', transition: 'all 0.2s',
          })}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.t1 }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.t2 }}
          >
            Download Platform Overview
          </button>
        </div>
        <p style={f({ fontSize: 12, color: C.t3 })}>
          Deployed at mid-market finance teams · Implementation support included · No credit card required
        </p>
      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer({ navigate }) {
  return (
    <footer style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: '52px 28px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 52 }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9,
                background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={17} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={f({ fontSize: 17, fontWeight: 700, color: C.t1, letterSpacing: '-0.025em' })}>FinAutomate</span>
            </div>
            <p style={f({ fontSize: 13, color: C.t3, lineHeight: 1.75, margin: 0 })}>
              AI Financial Operating System for modern finance teams. Predictive intelligence, automated operations, enterprise governance.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Executive Reporting', 'Predictive Finance', 'AI Operations', 'Unified Intelligence'] },
            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
            { title: 'Resources', links: ['Documentation', 'Security', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <div style={f({ fontSize: 11, fontWeight: 700, color: C.t2, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 18 })}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={f({ fontSize: 13, color: C.t3, textDecoration: 'none', transition: 'color 0.2s' })}
                    onMouseEnter={e => e.target.style.color = C.t2}
                    onMouseLeave={e => e.target.style.color = C.t3}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={f({ fontSize: 12, color: C.t3 })}>© 2026 FinAutomate. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['SOC 2 Type II', 'GDPR Compliant', 'CCPA Ready'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <BadgeCheck size={11} color={C.green} />
                <span style={f({ fontSize: 11, color: C.t3 })}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── ROOT ───────────────────────────────────────────────── */
export default function FinAutomateLanding({ navigate = () => {} }) {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', fontFamily: FONT }}>
      {/* Nav is handled by App.jsx router — no double nav */}
      <Hero navigate={navigate} />
      <TrustBar />
      <FinancialAnxietySection navigate={navigate} />
      <PlatformSection />
      <HowItWorksSection />
      <ExecutiveBriefingSection />
      <ImpactSection />
      <BeforeAfterSection />
      <SecuritySection navigate={navigate} />
      <UseCasesSection navigate={navigate} />
      <FinalCTA navigate={navigate} />
      <Footer navigate={navigate} />
    </div>
  )
}
