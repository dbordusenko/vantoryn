"""APS Production & Supply Optimizer — full backend (FastAPI + SQLAlchemy + OR-Tools).

CRUD for all master/transactional data, planning pipeline, and plan-version history.
DB-agnostic via DATABASE_URL (SQLite by default, Postgres/Supabase in prod).
"""
from __future__ import annotations
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine, SessionLocal
from .config import CORS_ORIGINS, AUTO_SEED
from . import orm  # noqa: F401 — register models on Base
from .routers import api
from .seed import seed_demo


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    if AUTO_SEED:
        db = SessionLocal()
        try:
            seed_demo(db)          # idempotent: only seeds if empty
        finally:
            db.close()
    yield


app = FastAPI(title="Vantoryn APS Production & Supply Optimizer",
              version="2.0.0", lifespan=lifespan)

origins = ["*"] if CORS_ORIGINS.strip() == "*" else [o.strip() for o in CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware, allow_origins=origins,
    allow_methods=["*"], allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok", "service": "aps-optimizer", "version": "2.0.0"}


app.include_router(api)
