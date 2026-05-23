import { C } from '../tokens'

export default function VantorynMark({ size = 36, mono = false }) {
  const id = `vm${size}`
  const g  = mono ? C.t1  : '#e8d070'
  const g2 = mono ? C.t2  : '#c9a84c'
  const g3 = mono ? C.t3  : '#8a6520'

  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vantoryn">
      <defs>
        {/* Gold diagonal */}
        <linearGradient id={`${id}a`} x1="20" y1="10" x2="180" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={g}/>
          <stop offset="50%"  stopColor={g2}/>
          <stop offset="100%" stopColor={g3}/>
        </linearGradient>
        {/* Inner V — lighter */}
        <linearGradient id={`${id}b`} x1="60" y1="20" x2="140" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={g}  stopOpacity="0.95"/>
          <stop offset="100%" stopColor={g2} stopOpacity="0.4"/>
        </linearGradient>
        {/* Ring — fades bottom */}
        <linearGradient id={`${id}c`} x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={g}  stopOpacity="0.9"/>
          <stop offset="60%"  stopColor={g2} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={g3} stopOpacity="0.15"/>
        </linearGradient>
        {/* Side arc — fades top & bottom */}
        <linearGradient id={`${id}d`} x1="0" y1="30" x2="0" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={g}  stopOpacity="0.15"/>
          <stop offset="35%"  stopColor={g2} stopOpacity="0.8"/>
          <stop offset="65%"  stopColor={g2} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={g3} stopOpacity="0.15"/>
        </linearGradient>
      </defs>

      {/* ── Main circle ring — center (100,95) r=88 ─────────────────────── */}
      <circle cx="100" cy="95" r="88"
        stroke={`url(#${id}c)`} strokeWidth="3" fill="none"/>

      {/* ── Left side arc (outside or along the circle, left sweep) ─────── */}
      {/* A tighter arc on the left, from ~(20,50) sweeping down to ~(20,150) */}
      <path d="M 28 42 A 72 72 0 0 0 28 158"
        stroke={`url(#${id}d)`} strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* ── Right side arc (mirror) ──────────────────────────────────────── */}
      <path d="M 172 42 A 72 72 0 0 1 172 158"
        stroke={`url(#${id}d)`} strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* ── Outer V — thick bold ─────────────────────────────────────────── */}
      {/* Left arm: (18,18) → tip (100,168) */}
      {/* Right arm: tip (100,168) → (182,18) */}
      <path d="M 18 18 L 100 168 L 182 18"
        stroke={`url(#${id}a)`} strokeWidth="14"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Inner V — thinner, inset ─────────────────────────────────────── */}
      <path d="M 48 18 L 100 138 L 152 18"
        stroke={`url(#${id}b)`} strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── 4-pointed star at top of left arm ───────────────────────────── */}
      {/* Center ~(18,18) */}
      <path d="M 18 4  L 22 18 L 18 32 L 14 18 Z" fill={`url(#${id}a)`}/>
      <path d="M 4  18 L 18 22 L 32 18 L 18 14 Z" fill={`url(#${id}a)`} opacity="0.6"/>

      {/* ── 4-pointed star at top of right arm ──────────────────────────── */}
      {/* Center ~(182,18) */}
      <path d="M 182 4  L 186 18 L 182 32 L 178 18 Z" fill={`url(#${id}a)`}/>
      <path d="M 168 18 L 182 22 L 196 18 L 182 14 Z" fill={`url(#${id}a)`} opacity="0.6"/>

      {/* ── Center diamond at V tip ──────────────────────────────────────── */}
      {/* Center (100, 160) — sits at bottom of the V */}
      <path d="M 100 144 L 114 162 L 100 180 L 86 162 Z"
        fill={`url(#${id}a)`} opacity="0.95"/>
      {/* Inner facet — shadow */}
      <path d="M 100 150 L 110 162 L 100 174 L 90 162 Z"
        fill={g3} opacity="0.5"/>
      {/* Top highlight */}
      <path d="M 100 144 L 114 162 L 100 154 L 86 162 Z"
        fill={g} opacity="0.35"/>

      {/* ── Horizontal cap lines at top of each arm ──────────────────────── */}
      {/* These mirror the reference — short lines bridging from the arm top outward */}
      <line x1="2"   y1="18" x2="36"  y2="18"
        stroke={`url(#${id}a)`} strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
      <line x1="164" y1="18" x2="198" y2="18"
        stroke={`url(#${id}a)`} strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}
