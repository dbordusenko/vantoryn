import { C, f, FONT } from '../tokens'

/* ─── GRADIENT DEFS (shared) ────────────────────────────────────────────── */
const DEFS = (id) => (
  <defs>
    <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#3b7fff" />
      <stop offset="100%" stopColor="#00c5b5" />
    </linearGradient>
    <linearGradient id={`gv-${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3b7fff" />
      <stop offset="100%" stopColor="#00c5b5" />
    </linearGradient>
    <linearGradient id={`gs-${id}`} x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#00c5b5" />
      <stop offset="100%" stopColor="#3b7fff" />
    </linearGradient>
  </defs>
)

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 1 — VERTEX
   Two nested V strokes. Outer bold, inner ghost. Institutional + clean.
   Reference feel: Palantir, Stripe
════════════════════════════════════════════════════════════════════════════ */
function V1({ size = 44 }) {
  const s = size / 44
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v1')}
      <rect width="44" height="44" rx={10 * s} fill="#060a12" />
      {/* outer V */}
      <path d="M 9 11 L 22 33 L 35 11"
        stroke="url(#g-v1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* inner V echo */}
      <path d="M 15 11 L 22 25 L 29 11"
        stroke="url(#g-v1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 2 — PRISM
   A faceted diamond cut into 4 triangular faces with different opacities.
   Reference feel: Snowflake, crystalline intelligence
════════════════════════════════════════════════════════════════════════════ */
function V2({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v2')}
      <rect width="44" height="44" rx="10" fill="#060a12" />
      {/* diamond outline: top(22,7) right(37,22) bottom(22,37) left(7,22) */}
      {/* top-left face */}
      <path d="M 22 7 L 7 22 L 22 22 Z" fill="url(#g-v2)" fillOpacity="0.9" />
      {/* top-right face */}
      <path d="M 22 7 L 37 22 L 22 22 Z" fill="url(#g-v2)" fillOpacity="0.45" />
      {/* bottom-left face */}
      <path d="M 7 22 L 22 37 L 22 22 Z" fill="url(#g-v2)" fillOpacity="0.55" />
      {/* bottom-right face */}
      <path d="M 37 22 L 22 37 L 22 22 Z" fill="url(#g-v2)" fillOpacity="0.25" />
      {/* edge strokes */}
      <path d="M 22 7 L 7 22 L 22 37 L 37 22 Z"
        stroke="url(#g-v2)" strokeWidth="0.75" strokeOpacity="0.6" />
      <line x1="22" y1="7" x2="22" y2="37" stroke="url(#g-v2)" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="7" y1="22" x2="37" y2="22" stroke="url(#g-v2)" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 3 — SIGNAL
   An upward trend line that forms a V — forecast meets execution.
   Reference feel: Bloomberg, trading terminal, operational data
════════════════════════════════════════════════════════════════════════════ */
function V3({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v3')}
      <rect width="44" height="44" rx="10" fill="#060a12" />
      {/* baseline */}
      <line x1="8" y1="33" x2="36" y2="33" stroke="#1a2640" strokeWidth="1" />
      {/* signal line: goes down then sharply up = V shape */}
      <polyline points="8,14 18,30 28,14" fill="none"
        stroke="url(#g-v3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* upward arrow from bottom of V */}
      <line x1="28" y1="14" x2="36" y2="14" stroke="url(#g-v3)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45" />
      {/* dot at peak */}
      <circle cx="18" cy="30" r="2" fill="url(#g-v3)" />
      {/* vertical tick marks */}
      {[14, 22, 30].map((y, i) => (
        <line key={i} x1="6" y1={y} x2="8" y2={y} stroke="#2a3a55" strokeWidth="0.75" />
      ))}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 4 — NODES
   Five connected nodes forming a V — unified data intelligence network.
   Reference feel: Databricks, graph intelligence, connected systems
════════════════════════════════════════════════════════════════════════════ */
function V4({ size = 44 }) {
  // V node positions: TL, TR, ML, MR, Bottom
  const nodes = [
    { x: 9,  y: 10 },   // 0 top-left
    { x: 35, y: 10 },   // 1 top-right
    { x: 14, y: 22 },   // 2 mid-left
    { x: 30, y: 22 },   // 3 mid-right
    { x: 22, y: 34 },   // 4 bottom (V tip)
  ]
  const edges = [[0,2],[2,4],[4,3],[3,1],[2,3]]
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v4')}
      <rect width="44" height="44" rx="10" fill="#060a12" />
      {/* edges */}
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#g-v4)" strokeWidth="1" strokeOpacity="0.45" />
      ))}
      {/* nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="3.5" fill="url(#g-v4)" fillOpacity={i === 4 ? 1 : 0.7} />
          <circle cx={n.x} cy={n.y} r="5.5" fill="url(#g-v4)" fillOpacity="0.12" />
        </g>
      ))}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 5 — STRATA
   Three horizontal bars with left-angled cut — operational layers of finance.
   Reference feel: Databricks, layered architecture, financial infrastructure
════════════════════════════════════════════════════════════════════════════ */
function V5({ size = 44 }) {
  const bars = [
    { y: 11, w: 28, x: 8 },
    { y: 20, w: 20, x: 12 },
    { y: 29, w: 12, x: 16 },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v5')}
      <rect width="44" height="44" rx="10" fill="#060a12" />
      {bars.map((b, i) => (
        <g key={i}>
          {/* bar */}
          <rect x={b.x} y={b.y} width={b.w} height="4" rx="2"
            fill="url(#g-v5)" fillOpacity={1 - i * 0.22} />
          {/* right end glow dot */}
          <circle cx={b.x + b.w} cy={b.y + 2} r="2.5"
            fill="url(#g-v5)" fillOpacity={0.9 - i * 0.2} />
        </g>
      ))}
      {/* left anchor rail */}
      <line x1="8" y1="11" x2="8" y2="33" stroke="url(#g-v5)" strokeWidth="1.5"
        strokeLinecap="round" strokeOpacity="0.35" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   VARIANT 6 — CORE
   A bold V lettermark with a single horizontal rule cutting through it.
   Reference feel: Linear, Vercel, ultra-minimal wordmark architecture
════════════════════════════════════════════════════════════════════════════ */
function V6({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {DEFS('v6')}
      <rect width="44" height="44" rx="10" fill="#060a12" />
      {/* Bold V path */}
      <path d="M 8 10 L 22 32 L 36 10"
        stroke="url(#g-v6)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Horizontal slice — cuts across upper third of the V */}
      <line x1="8" y1="19" x2="36" y2="19"
        stroke="url(#g-v6)" strokeWidth="1" strokeOpacity="0.4" />
      {/* Small accent square at tip */}
      <rect x="19.5" y="29.5" width="5" height="5" rx="1.5"
        fill="url(#g-v6)" fillOpacity="0.7" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   SHOWCASE PAGE
════════════════════════════════════════════════════════════════════════════ */
const VARIANTS = [
  {
    id: 1, Component: V1, name: 'VERTEX',
    tagline: 'Nested V strokes, outer bold / inner ghost',
    feel: 'Palantir · Stripe · Institutional',
    notes: 'Most conservative. Pure letterform, zero decoration. Scales perfectly to 16px favicon.',
  },
  {
    id: 2, Component: V2, name: 'PRISM',
    tagline: 'Faceted diamond, 4 triangular faces with layered opacity',
    feel: 'Snowflake · Faceted intelligence · Multidimensional',
    notes: 'Distinctive at large sizes. Conveys depth of analysis. Complex but premium.',
  },
  {
    id: 3, Component: V3, name: 'SIGNAL',
    tagline: 'Trend line / V formed by a market signal path',
    feel: 'Bloomberg · Trading terminal · Operational data',
    notes: 'Narrative in the mark — the V tells a story of variance and recovery/growth.',
  },
  {
    id: 4, Component: V4, name: 'NODES',
    tagline: '5 connected nodes forming a V — unified data network',
    feel: 'Databricks · Graph intelligence · Connected systems',
    notes: 'Communicates integration and intelligence. Loses detail below 32px.',
  },
  {
    id: 5, Component: V5, name: 'STRATA',
    tagline: 'Three descending bars with left rail — layered finance architecture',
    feel: 'Databricks · Infrastructure · Operational layers',
    notes: 'Instantly reads as "data / dashboard." Strong as an app icon. Unique in fintech.',
  },
  {
    id: 6, Component: V6, name: 'CORE',
    tagline: 'Bold V with a single horizontal rule through it',
    feel: 'Linear · Vercel · Minimal wordmark precision',
    notes: 'Most modern / software feel. The horizontal cut creates ambiguity that rewards attention.',
  },
]

/* Logo lockup: icon + wordmark side by side */
function Lockup({ Component, name, size = 36 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Component size={size} />
      <span style={f({ fontSize: size * 0.44, fontWeight: 700, color: C.t1, letterSpacing: '-0.04em' })}>
        Vantoryn
      </span>
    </div>
  )
}

export default function LogoShowcase() {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', padding: '60px 0 100px' }}>

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px 60px' }}>
        <div style={f({ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 16 })}>
          Brand Symbol · 6 Variants
        </div>
        <h1 style={f({ fontSize: 42, fontWeight: 800, color: C.t1, letterSpacing: '-0.04em',
          margin: 0, lineHeight: 1.1 })}>
          Vantoryn<br />
          <span style={{ color: C.t3 }}>Logo Exploration</span>
        </h1>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {VARIANTS.map(({ id, Component, name, tagline, feel, notes }) => (
            <div key={id} style={{
              background: C.bg1,
              border: `1px solid ${C.borderMid}`,
              borderRadius: 16,
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              margin: 1,
            }}>
              {/* Top: sizes */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
                {/* Large icon */}
                <Component size={72} />
                {/* Mid icon */}
                <Component size={44} />
                {/* Small icon */}
                <Component size={28} />
                {/* Tiny — favicon size */}
                <Component size={16} />
              </div>

              {/* Lockup on dark + light-ish backgrounds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* On dark */}
                <div style={{
                  background: C.bg0, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '16px 20px',
                }}>
                  <Lockup Component={Component} size={32} />
                </div>
                {/* On mid-dark (card surface) */}
                <div style={{
                  background: C.bg3, border: `1px solid ${C.borderMid}`,
                  borderRadius: 10, padding: '16px 20px',
                }}>
                  <Lockup Component={Component} size={32} />
                </div>
              </div>

              {/* Metadata */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={f({ fontSize: 11, fontWeight: 700, color: C.t4,
                    letterSpacing: '0.1em' })}>0{id}</span>
                  <span style={f({ fontSize: 18, fontWeight: 800, color: C.t1,
                    letterSpacing: '-0.03em' })}>{name}</span>
                </div>
                <p style={f({ fontSize: 13, color: C.t2, margin: '0 0 8px', lineHeight: 1.5 })}>
                  {tagline}
                </p>
                <div style={f({ fontSize: 11, color: C.teal, fontWeight: 600,
                  letterSpacing: '0.04em', marginBottom: 10 })}>
                  {feel}
                </div>
                <p style={f({ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.6,
                  borderTop: `1px solid ${C.border}`, paddingTop: 10 })}>
                  {notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All icons in a strip */}
      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 40px' }}>
        <div style={{
          background: C.bg1, border: `1px solid ${C.borderMid}`,
          borderRadius: 16, padding: '32px 40px',
        }}>
          <div style={f({ fontSize: 11, color: C.t3, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 })}>
            Side by side comparison — 44px
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            {VARIANTS.map(({ id, Component, name }) => (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Component size={44} />
                <span style={f({ fontSize: 10, color: C.t3, fontWeight: 600,
                  letterSpacing: '0.08em' })}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All lockups strip */}
      <div style={{ maxWidth: 1100, margin: '4px auto 0', padding: '0 40px' }}>
        <div style={{
          background: C.bg1, border: `1px solid ${C.borderMid}`,
          borderRadius: 16, padding: '32px 40px',
        }}>
          <div style={f({ fontSize: 11, color: C.t3, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 })}>
            Wordmark lockups — 28px icon
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            {VARIANTS.map(({ id, Component }) => (
              <Lockup key={id} Component={Component} size={28} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
