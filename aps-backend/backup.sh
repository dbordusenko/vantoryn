#!/bin/bash
# Daily SQLite backup for the APS backend.
# Uses sqlite3 .backup (consistent snapshot even while the API is serving).
# Keeps the 7 most recent copies.
set -e

D=/home/ubuntu/aps-backend
mkdir -p "$D/backups"

sqlite3 "$D/aps.db" ".backup '$D/backups/aps-$(date +%F).db'"

# prune: keep newest 7
ls -1t "$D"/backups/aps-*.db 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "backup ok: $(ls -1 "$D"/backups/aps-*.db | wc -l) copies retained"
