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
