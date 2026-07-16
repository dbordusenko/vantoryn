"""Runtime configuration. All via env vars (12-factor)."""
import os

# DATABASE_URL examples:
#   sqlite:///./aps.db                              (default, zero-setup)
#   postgresql+psycopg://user:pass@host:5432/db     (Supabase / Postgres)
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./aps.db")

# CORS — comma-separated origins, or "*" for all
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

# default tenant (single-tenant MVP; ready for multi-tenant later)
DEFAULT_TENANT = os.environ.get("DEFAULT_TENANT", "default")

# auto-seed demo data on first startup if DB is empty
AUTO_SEED = os.environ.get("AUTO_SEED", "true").lower() == "true"

# ── Security ───────────────────────────────────────────────────────────────
# Shared secret required for every mutating request (POST/PUT/DELETE) and for
# persisting plan versions. If unset, writes are DISABLED (fail-safe), so a
# misconfigured deploy can never expose an open write API to the internet.
API_KEY = os.environ.get("API_KEY", "").strip()

# Sliding-window rate limit for the public planning endpoint (per client IP).
RATE_LIMIT_RUNS = int(os.environ.get("RATE_LIMIT_RUNS", "10"))       # requests
RATE_LIMIT_WINDOW_S = int(os.environ.get("RATE_LIMIT_WINDOW_S", "60"))  # per window
