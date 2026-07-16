/**
 * Vercel Serverless Function: POST /api/lead
 * Receives lead data (BookDemoModal, HealthScore, Waitlist) and sends a
 * formatted Telegram notification.
 *
 * Required env vars (set in Vercel dashboard → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *
 * Design decisions:
 *  • Fails LOUDLY. A misconfigured or broken Telegram send returns 5xx so the
 *    UI can tell the visitor to email instead — silently answering {ok:true}
 *    while dropping the lead is worse than an honest error.
 *  • Every interpolated value is escaped (parse_mode: HTML) — including the
 *    generic branch, which previously injected raw JSON into the message.
 *  • Best-effort per-IP rate limit + honeypot to blunt spam. Serverless
 *    instances don't share memory, so this is a speed bump, not a wall; for a
 *    hard limit put Vercel KV / Upstash behind it.
 */

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map() // ip -> number[] (timestamps), per-instance

function rateLimited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (arr.length >= MAX_PER_WINDOW) return true
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 2000) hits.clear() // crude memory bound
  return false
}

function esc(v) {
  if (v === undefined || v === null || v === '') return '—'
  return String(v)
    .slice(0, 300) // cap length — no unbounded text into Telegram
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const isEmail = v => typeof v === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)

export default async function handler(req, res) {
  // Same-origin SPA only — no wildcard CORS (this endpoint messages the owner).
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
    return res.status(429).json({ ok: false, error: 'Too many submissions. Please try again shortly.' })
  }

  const body = req.body ?? {}

  // Honeypot: real users never fill this hidden field; bots do.
  if (body.website) return res.status(200).json({ ok: true })

  // Basic validation — reject junk before it reaches Telegram
  if (body.email && !isEmail(body.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' })
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('[lead] MISCONFIGURED: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID missing — lead not delivered', {
      type: body.type, email: body.email,
    })
    return res.status(503).json({ ok: false, error: 'Lead delivery is not configured.' })
  }

  const type = body.type ?? 'demo'
  let text

  if (type === 'demo') {
    const { name, email, company, role, size, slot } = body
    text = [
      `🗓 <b>New Demo Request — Vantoryn</b>`, ``,
      `👤 <b>Name:</b> ${esc(name)}`,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💼 <b>Role:</b> ${esc(role)}`,
      `👥 <b>Team size:</b> ${esc(size)}`,
      `📅 <b>Slot:</b> ${esc(slot)}`,
    ].join('\n')
  } else if (type === 'health') {
    const { email, company, revenue, erps, pain, score } = body
    text = [
      `📊 <b>Finance Health Score — Vantoryn</b>`, ``,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💰 <b>Revenue:</b> ${esc(revenue)}`,
      `🔗 <b>ERPs:</b> ${esc(erps)}`,
      `🎯 <b>Main pain:</b> ${esc(pain)}`,
      `📈 <b>Score:</b> ${esc(score)}/100`,
    ].join('\n')
  } else if (type === 'founding') {
    const { name, email, company, role, teamSize, erp, challenge, timeline } = body
    text = [
      `🏆 <b>Founding Partner Application — Vantoryn</b>`, ``,
      `👤 <b>Name:</b> ${esc(name)}`,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💼 <b>Role:</b> ${esc(role)}`,
      `👥 <b>Finance team:</b> ${esc(teamSize)}`,
      `🗄 <b>Current system:</b> ${esc(erp)}`,
      `⏱ <b>Timeline:</b> ${esc(timeline)}`,
      ``,
      `🎯 <b>Wants fixed first:</b>`,
      `${esc(challenge)}`,
    ].join('\n')
  } else if (type === 'waitlist') {
    const { name, email, company, revenue, role, position } = body
    text = [
      `⭐ <b>New Waitlist Signup — Vantoryn</b>`, ``,
      `👤 <b>Name:</b> ${esc(name)}`,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💰 <b>Revenue:</b> ${esc(revenue)}`,
      `💼 <b>Role:</b> ${esc(role)}`,
      `#️⃣ <b>Position:</b> ${esc(position)}`,
    ].join('\n')
  } else {
    // Generic contact — escape each field, never dump raw JSON into the message
    const lines = Object.entries(body)
      .filter(([k]) => k !== 'type')
      .slice(0, 15)
      .map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`)
    text = [`📩 <b>Lead — Vantoryn</b>`, ``, ...lines].join('\n')
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
    const tgData = await tgRes.json()
    if (!tgData.ok) {
      console.error('[lead] Telegram rejected the message — lead NOT delivered', tgData)
      return res.status(502).json({ ok: false, error: 'Could not deliver your request.' })
    }
  } catch (err) {
    console.error('[lead] Telegram request failed — lead NOT delivered', err)
    return res.status(502).json({ ok: false, error: 'Could not deliver your request.' })
  }

  return res.status(200).json({ ok: true })
}
