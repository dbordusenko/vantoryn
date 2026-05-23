/**
 * VantorynMark — the official brand symbol
 *
 * Style: V letterform with double inner stroke, centered diamond,
 *        and two partial circular arcs — top-right reference variant.
 *
 * Props:
 *   size   — number, controls both width and height (default 36)
 *   mono   — bool, if true renders in single-color (C.t1) instead of gradient
 *   light  — bool, renders on light background (uses dark fill)
 */

import { C } from '../tokens'

export default function VantorynMark({ size = 36, mono = false, light = false }) {
  const id = `vm-${size}-${mono ? 'm' : 'g'}`

  // Gold/silver gradient matching the reference image
  const gold1 = '#c9a84c'
  const gold2 = '#e8c96a'
  const gold3 = '#a07828'
  const silver = '#d0d8e8'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vantoryn"
    >
      <defs>
        {/* Main gold gradient — diagonal */}
        <linearGradient id={`${id}-gold`} x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t1 : gold2} />
          <stop offset="45%"  stopColor={mono ? C.t2 : gold1} />
          <stop offset="100%" stopColor={mono ? C.t3 : gold3} />
        </linearGradient>
        {/* Inner V stroke gradient — slightly lighter */}
        <linearGradient id={`${id}-inner`} x1="30" y1="15" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t2 : gold2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={mono ? C.t3 : gold1} stopOpacity="0.5" />
        </linearGradient>
        {/* Diamond gradient */}
        <linearGradient id={`${id}-dia`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={mono ? C.t1 : gold2} />
          <stop offset="100%" stopColor={mono ? C.t3 : gold3} />
        </linearGradient>
        {/* Arc gradient */}
        <linearGradient id={`${id}-arc`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={mono ? C.t2 : gold2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={mono ? C.t3 : gold1} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ── Outer V (thick, bold) ─────────────────────────────────────────── */}
      {/* Left arm: top-left → bottom center */}
      <path
        d="M 10 12 L 50 82 L 90 12"
        stroke={`url(#${id}-gold)`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Inner V (thinner, slightly inset, creates double-stroke look) ─── */}
      <path
        d="M 22 12 L 50 68 L 78 12"
        stroke={`url(#${id}-inner)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Center diamond at the bottom tip ─────────────────────────────── */}
      {/* The diamond sits just above the V tip, centered at ~(50, 72) */}
      <path
        d="M 50 60 L 56 72 L 50 84 L 44 72 Z"
        fill={`url(#${id}-dia)`}
        opacity="0.9"
      />
      {/* Diamond inner highlight facet */}
      <path
        d="M 50 63 L 54 72 L 50 79 L 46 72 Z"
        fill={mono ? C.t4 : gold3}
        opacity="0.5"
      />

      {/* ── Left partial arc ─────────────────────────────────────────────── */}
      {/*
          Arc sweeps from about 200° to 290° on a circle centered ~(50,46) r=42
          That's the left side: from bottom-left going up to top
          We'll draw it as a path arc.
          Center: (50, 46), radius: 42
          Start angle 195°: x=50+42*cos(195°)=50-40.6=9.4, y=46+42*sin(195°)=46-10.9=35.1
          End angle 265°:  x=50+42*cos(265°)=50-3.7=46.3, y=46+42*sin(265°)=46+41.9=87.9
          → arc from (9.4, 35.1) to (46.3, 87.9), large-arc=0, sweep=1
      */}
      <path
        d="M 9 35 A 42 42 0 0 1 46 88"
        stroke={`url(#${id}-arc)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* ── Right partial arc ────────────────────────────────────────────── */}
      {/*
          Mirror: from (54, 88) to (91, 35)
          Same circle, other side
      */}
      <path
        d="M 54 88 A 42 42 0 0 1 91 35"
        stroke={`url(#${id}-arc)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* ── Top horizontal accent bar (caps the V arms at the top) ────────── */}
      {/* Left cap tick */}
      <line x1="6" y1="12" x2="24" y2="12"
        stroke={`url(#${id}-gold)`} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      {/* Right cap tick */}
      <line x1="76" y1="12" x2="94" y2="12"
        stroke={`url(#${id}-gold)`} strokeWidth="3" strokeLinecap="round" opacity="0.55" />

      {/* ── Small star/point at the very tip of the outer V ──────────────── */}
      {/* Actually the diamond covers this — add a small glow dot at tip */}
      <circle cx="50" cy="82" r="2.5" fill={mono ? C.t2 : gold2} opacity="0.6" />
    </svg>
  )
}
