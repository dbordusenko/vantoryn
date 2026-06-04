"""APS Production & Supply Optimizer — FastAPI MVP.

Endpoints:
  GET  /                      health
  GET  /api/aps/demo-dataset  returns the demo planning dataset
  POST /api/aps/plan/run      runs the planning pipeline (uses demo data if none provided)
  POST /api/aps/plan/scenario runs 3 preset scenarios for comparison
"""
from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import PlanRequest, PlanResult, PlanningDataset, PlanWeights
from .demo_data import build_demo_dataset
from .engine import run_plan

app = FastAPI(title="Vantoryn APS Production & Supply Optimizer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to frontend domain in prod
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok", "service": "aps-optimizer", "version": "1.0.0"}


@app.get("/api/aps/demo-dataset", response_model=PlanningDataset)
def demo_dataset():
    return build_demo_dataset()


@app.post("/api/aps/plan/run", response_model=PlanResult)
def plan_run(req: PlanRequest):
    ds = req.dataset or build_demo_dataset()
    return run_plan(ds, req.weights, req.time_limit_s)


@app.post("/api/aps/plan/scenario")
def plan_scenarios(req: PlanRequest):
    """Run preset optimization scenarios and return KPI comparison."""
    ds = req.dataset or build_demo_dataset()
    presets = {
        "min_inventory":   PlanWeights(holding=5, setup=1, overtime=1, stockout=8, cash_tie_up=5),
        "min_cash_tie_up": PlanWeights(holding=2, setup=1, overtime=2, stockout=5, cash_tie_up=10),
        "max_service":     PlanWeights(holding=1, setup=1, overtime=3, stockout=20, cash_tie_up=1),
        "balanced":        PlanWeights(),
    }
    results = {}
    for name, w in presets.items():
        r = run_plan(ds, w, req.time_limit_s)
        results[name] = {
            "status": r.status,
            "kpis": r.kpis.model_dump(),
            "risk_count": len(r.risks),
            "high_risks": sum(1 for x in r.risks if x.severity == "HIGH"),
        }
    return {"scenarios": results}
