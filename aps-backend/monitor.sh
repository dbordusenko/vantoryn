#!/bin/bash
# Health monitor for the APS backend.
#   • checks the local app and the public HTTPS path (catches nginx/cert breakage too)
#   • alerts to Telegram ONLY on state change (up→down, down→up) — no spam every 5 min
#   • tries to self-heal by restarting the service when it's down
# Runs from cron every 5 minutes.
set -uo pipefail

STATE=/home/ubuntu/aps-backend/.monitor_state
LOG=/home/ubuntu/aps-backend/backups/monitor.log
LOCAL_URL="http://127.0.0.1:8000/"
PUBLIC_URL="https://192.18.131.82.sslip.io/aps/products"
CHAT_ID=390061464

# reuse the existing Telegram bot's token (never hard-code secrets here)
TOKEN=$(grep -oP '(?<=TELEGRAM_BOT_TOKEN=).*' /opt/vantoryn-bot/.env 2>/dev/null | tr -d '\r' || true)

send() {
  [ -n "${TOKEN:-}" ] || { echo "$(date -u '+%F %T') no bot token, alert skipped" >> "$LOG"; return 0; }
  curl -s -o /dev/null --max-time 10 \
    -d "chat_id=${CHAT_ID}" \
    --data-urlencode "text=$1" \
    "https://api.telegram.org/bot${TOKEN}/sendMessage"
}

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$LOCAL_URL" 2>/dev/null || echo 000)
pub=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$PUBLIC_URL" 2>/dev/null || echo 000)

if [ "$code" = "200" ] && [ "$pub" = "200" ]; then now=UP; else now=DOWN; fi
prev=$(cat "$STATE" 2>/dev/null || echo UP)

if [ "$now" != "$prev" ]; then
  echo "$now" > "$STATE"
  ts=$(date -u '+%F %T UTC')
  if [ "$now" = DOWN ]; then
    send "🔴 Vantoryn APS backend is DOWN
app: HTTP $code | public: HTTP $pub
$ts
Attempting auto-restart…"
  else
    send "✅ Vantoryn APS backend recovered
$ts"
  fi
  echo "$(date -u '+%F %T') state -> $now (app=$code public=$pub)" >> "$LOG"
fi

# self-heal: restart the unit if it isn't running
if [ "$now" = DOWN ]; then
  if ! systemctl is-active --quiet aps-backend; then
    sudo systemctl restart aps-backend 2>>"$LOG" && \
      echo "$(date -u '+%F %T') restarted aps-backend" >> "$LOG"
  fi
fi
