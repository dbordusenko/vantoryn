# Vantoryn APS — Production & Supply Optimizer (MVP backend)

FastAPI + Google OR-Tools backend implementing the core APS pipeline:

```
Demand Aggregation → MPS → Multi-level MRP (finite capacity) → Procurement → Cash Flow
```

See the full design in [`../docs/APS-Module-Specification.md`](../docs/APS-Module-Specification.md).

## What it does

- **Demand netting** of independent forecast against on-hand + scheduled receipts
- **Multi-level MRP** with low-level coding, scrap/yield factors (≤10 BOM levels)
- **Capacity-aware MPS** for make items via an **OR-Tools MILP** smoothing step
  (minimizes weighted holding + overtime + cash-tie-up, respects finite capacity)
- **Procurement plan** with MOQ / order-multiple rounding, lead-time offset,
  supplier payment timing (DPO)
- **Integrated cash flow**: cash-out (material @ DPO + direct labor + overhead),
  cash-in (sales collections @ customer DSO), cumulative balance vs target
- **Capacity loads** + bottleneck detection, **risk alerts**, **recommendations**
- **Scenario comparison**: min-inventory / min-cash / max-service / balanced

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Vite proxies `/api` → `localhost:8000` (already configured in the frontend).

## Smoke test (no server needed)

```bash
python smoke_test.py
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/` | health |
| GET  | `/api/aps/demo-dataset` | the demo `PlanningDataset` |
| POST | `/api/aps/plan/run` | run pipeline (body: `PlanRequest`; empty → demo data) |
| POST | `/api/aps/plan/scenario` | run 4 preset scenarios, return KPI comparison |

### Example

```bash
curl -X POST localhost:8000/api/aps/plan/run \
  -H 'content-type: application/json' \
  -d '{"weights":{"holding":5,"cash_tie_up":5,"stockout":8},"time_limit_s":15}'
```

Response = `PlanResult`: `mps[]`, `purchase_plan[]`, `capacity_loads[]`,
`cash_flow[]`, `risks[]`, `recommendations[]`, `kpis`.

## Demo case

Small electronics assembler — 2 FG (SmartSensor, SmartHub), 1 WIP (PCB assembly),
4 raw materials, 2 work centers (SMT line, assembly cell), 12-week ramping demand.
Capacity is deliberately tight so peak weeks force a real build-ahead vs overtime
tradeoff — which is why the scenarios produce different KPIs.

## Next steps (per spec roadmap)

- CP-SAT detailed scheduling (sequence-dependent setup) → Gantt
- Multi-objective NSGA-II Pareto front
- Persist to Supabase (RLS per tenant), Celery for long runs
- React "Production Planning" tab (Gantt / capacity heatmap / cash waterfall)
