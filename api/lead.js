/**
 * Vercel Serverless Function: POST /api/lead
 * Receives lead data from BookDemoModal and HealthScore,
 * sends a formatted Telegram notification.
 *
 * Required env vars (set in Vercel dashboard):
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 */

export default async function handler(req, res) {
  // CORS for same-origin SPA
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token   = process.env.TELEGRAM_BOT_TOKEN
  const chatId  = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    // Return OK so the user still sees the success screen
    return res.status(200).json({ ok: true })
  }

  const body = req.body ?? {}
  const type = body.type ?? 'demo'

  let text = ''

  if (type === 'demo') {
    // BookDemoModal submission
    const { name, email, company, role, size, slot } = body
    text = [
      `🗓 <b>New Demo Request — Vantoryn</b>`,
      ``,
      `👤 <b>Name:</b> ${esc(name)}`,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💼 <b>Role:</b> ${esc(role)}`,
      `👥 <b>Team size:</b> ${esc(size)}`,
      `📅 <b>Slot:</b> ${esc(slot)}`,
    ].join('\n')
  } else if (type === 'health') {
    // HealthScore submission
    const { email, company, revenue, erps, pain, score } = body
    text = [
      `📊 <b>Finance Health Score — Vantoryn</b>`,
      ``,
      `📧 <b>Email:</b> ${esc(email)}`,
      `🏢 <b>Company:</b> ${esc(company)}`,
      `💰 <b>Revenue:</b> ${esc(revenue)}`,
      `🔗 <b>ERPs:</b> ${esc(erps)}`,
      `🎯 <b>Main pain:</b> ${esc(pain)}`,
      `📈 <b>Score:</b> ${score}/100`,
    ].join('\n')
  } else {
    // Generic contact
    text = `📩 <b>Lead — Vantoryn</b>\n\n${JSON.stringify(body, null, 2)}`
  }

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      }
    )
    const tgData = await tgRes.json()
    if (!tgData.ok) console.error('Telegram error:', tgData)
  } catch (err) {
    console.error('Failed to send Telegram message:', err)
  }

  return res.status(200).json({ ok: true })
}

function esc(v) {
  if (!v) return '—'
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
