/**
 * Vercel Serverless Function: POST /api/login
 *
 * Why this exists: the demo credentials used to live in src/pages/Login.jsx,
 * which ships to every visitor — anyone could read the admin password straight
 * out of the JS bundle. This code runs server-side only and is never sent to
 * the browser, so the passwords stay out of the bundle.
 *
 * Honest scope: the product dashboard is a static SPA with demo data, so this
 * is a front door, not a vault — a determined visitor can still render the
 * bundle's views. Real enforcement only becomes possible once the dashboard is
 * served real data from an authenticated API. Treat this as "don't hand out the
 * keys", not "the safe is locked".
 *
 * Optional env override (Vercel → Settings → Environment Variables):
 *   DEMO_USERS = [{"email":"...","password":"...","name":"...","org":"..."}]
 *   SESSION_SECRET = <random string>   // signs the session token
 */
import crypto from 'node:crypto'

const DEFAULT_USERS = [
  { email: 'demo@vantoryn.ai',  password: 'Vantoryn2026', name: 'Demo User', org: 'Acme Corp' },
  { email: 'admin@vantoryn.ai', password: 'Admin2026!',   name: 'Dmytro B.', org: 'Vantoryn'  },
]

function users() {
  if (!process.env.DEMO_USERS) return DEFAULT_USERS
  try { return JSON.parse(process.env.DEMO_USERS) } catch { return DEFAULT_USERS }
}

const SECRET = process.env.SESSION_SECRET || 'vantoryn-dev-secret-change-me'

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}

// constant-time compare so we don't leak the password via response timing
const eq = (a, b) => {
  const ab = Buffer.from(String(a)), bb = Buffer.from(String(b))
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 8
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (arr.length >= MAX_ATTEMPTS) return true
  arr.push(now); hits.set(ip, arr)
  if (hits.size > 2000) hits.clear()
  return false
}

export default async function handler(req, res) {
  res.setHeader('Vary', 'Origin')
  const origin = req.headers.origin || ''
  if (/^https:\/\/([a-z0-9-]+\.)*vantoryn\.(vercel\.app|com)$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many attempts. Try again in a minute.' })
  }

  const { email = '', password = '' } = req.body ?? {}
  const found = users().find(u => u.email.toLowerCase() === String(email).toLowerCase().trim())

  // same generic message either way — don't reveal which emails exist
  if (!found || !eq(found.password, password)) {
    return res.status(401).json({ ok: false, error: 'Incorrect email or password' })
  }

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const user = { email: found.email, name: found.name, org: found.org, exp }
  return res.status(200).json({ ok: true, user: { ...user, token: sign(user) } })
}
