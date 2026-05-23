/**
 * VantorynMark — official brand symbol
 *
 * V letterform · double stroke · center diamond · full circle ring
 * · corner guide marks at top-left and top-right arms
 *
 * Props:
 *   size  — px dimension (default 36)
 *   mono  — single-color mode for monochrome contexts
 */

import { C } from '../tokens'

export default function VantorynMark({ size = 36, mono = false }) {
  const id = `vm${size}${mono ? 'm' : ''}`

  const gold1 = '#c9a84c'
  const gold2 = '#e8d070'
  const gold3 = '#a07828'

  const G  = `url(#${id}-g)`   // main gold
  const GI = `url(#${id}-gi)`  // inner / lighter
  const GD = `url(#${id}-gd)`  // diamond
  const GA = `url(#${id}-ga)`  // arc / ring (fades to transparent)

  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vantoryn">
      <defs>
        {/* Main gold — diagonal warm-to-deep */}
        <linearGradient id={`${id}-g`} x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t1 : gold2}/>
          <stop offset="50%"  stopColor={mono ? C.t2 : gold1}/>
          <stop offset="100%" stopColor={mono ? C.t3 : gold3}/>
        </linearGradient>
        {/* Inner V — slightly lighter, more transparent */}
        <linearGradient id={`${id}-gi`} x1="30" y1="10" x2="70" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t1 : gold2} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={mono ? C.t3 : gold1} stopOpacity="0.35"/>
        </linearGradient>
        {/* Diamond */}
        <linearGradient id={`${id}-gd`} x1="44" y1="60" x2="56" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t1 : gold2}/>
          <stop offset="100%" stopColor={mono ? C.t3 : gold3}/>
        </linearGradient>
        {/* Ring / arcs — fades at bottom */}
        <linearGradient id={`${id}-ga`} x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={mono ? C.t2 : gold2} stopOpacity="0.75"/>
          <stop offset="65%"  stopColor={mono ? C.t3 : gold1} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={mono ? C.t4 : gold3} stopOpacity="0.1"/>
        </linearGradient>
      </defs>

      {/* ── Full circle ring ────────────────────────────────────────────────── */}
      {/*  Center (50,48), radius 46 — hugs the outer edge of the viewBox  */}
      <circle cx="50" cy="48" r="46"
        stroke={GA} strokeWidth="1.6" fill="none"/>

      {/* ── Top-left corner guide: short arc + tick at the left V arm ──────── */}
      {/*
          The left arm of the outer V tops out at roughly (10, 12).
          We draw a small open-corner bracket shape at that point:
          a short vertical tick + a short horizontal tick, forming an L-corner.
          Positioned just outside the ring at top-left.
      */}
      {/* Top-left corner — vertical part */}
      <line x1="6" y1="4"  x2="6"  y2="20"  stroke={G} strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>
      {/* Top-left corner — horizontal part */}
      <line x1="6" y1="4"  x2="22" y2="4"   stroke={G} strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>

      {/* ── Top-right corner guide ──────────────────────────────────────────── */}
      {/* Top-right corner — vertical part */}
      <line x1="94" y1="4"  x2="94" y2="20"  stroke={G} strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>
      {/* Top-right corner — horizontal part */}
      <line x1="78" y1="4"  x2="94" y2="4"   stroke={G} strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>

      {/* ── Small diamond accent at top of each V arm ──────────────────────── */}
      {/* Left arm tip diamond (rotated square) at ~(10,12) */}
      <path d="M 10 7  L 15 12 L 10 17 L 5 12 Z"
        fill={G} opacity="0.8"/>
      {/* Right arm tip diamond at ~(90,12) */}
      <path d="M 90 7  L 95 12 L 90 17 L 85 12 Z"
        fill={G} opacity="0.8"/>

      {/* ── Outer V — bold strokes ──────────────────────────────────────────── */}
      <path d="M 10 12 L 50 83 L 90 12"
        stroke={G} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Inner V — thinner, creates the double-line depth ─────────────────── */}
      <path d="M 21 12 L 50 69 L 79 12"
        stroke={GI} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Center diamond — sits right at the V convergence point ─────────── */}
      <path d="M 50 61 L 57 72 L 50 83 L 43 72 Z"
        fill={GD} opacity="0.95"/>
      {/* Diamond inner shadow facet */}
      <path d="M 50 65 L 54 72 L 50 79 L 46 72 Z"
        fill={gold3} opacity="0.45"/>
      {/* Diamond top highlight */}
      <path d="M 50 61 L 57 72 L 50 67 L 43 72 Z"
        fill={gold2} opacity="0.3"/>
    </svg>
  )
}
