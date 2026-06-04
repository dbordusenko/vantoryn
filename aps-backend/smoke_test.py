"""Smoke test: run the full APS pipeline on demo data and print a summary."""
import json
from app.demo_data import build_demo_dataset
from app.models import PlanWeights
from app.engine import run_plan


def main():
    ds = build_demo_dataset()
    r = run_plan(ds, PlanWeights(), time_limit_s=30)
    print("STATUS:", r.status)
    print("OBJECTIVE:", r.objective_value)
    print("KPIs:", json.dumps(r.kpis.model_dump(), indent=2))
    print("MPS rows:", len(r.mps))
    print("Purchase orders:", len(r.purchase_plan))
    print("Cash points:", len(r.cash_flow))
    print("Risks:", len(r.risks))
    for x in r.risks[:8]:
        print(f"  - [{x.severity}] {x.category}: {x.message}")
    print("RECOMMENDATIONS:")
    for x in r.recommendations:
        print("  *", x)

    # sanity assertions
    assert r.mps, "MPS should not be empty"
    assert r.cash_flow, "cash flow should not be empty"
    assert len(r.cash_flow) == ds.horizon_periods
    print("\nFirst 3 cash points:")
    for cf in r.cash_flow[:3]:
        print(f"  P{cf.period_index}: in={cf.cash_in:,.0f} out={cf.cash_out:,.0f} "
              f"cum={cf.cumulative_cash:,.0f}")
    print("\nSAMPLE MPS (SS-100):")
    for e in [m for m in r.mps if m.product_id == "SS-100"][:4]:
        print(f"  P{e.period_index}: gross={e.gross_demand} net={e.net_requirement} "
              f"plan={e.planned_order} onhand={e.projected_on_hand}")
    print("\nALL OK")


def scenarios():
    from app.models import PlanWeights
    ds = build_demo_dataset()
    presets = {
        "min_inventory": PlanWeights(holding=5, cash_tie_up=5, stockout=8),
        "min_cash":      PlanWeights(cash_tie_up=10, stockout=5),
        "max_service":   PlanWeights(stockout=20),
        "balanced":      PlanWeights(),
    }
    print("\nSCENARIO COMPARISON:")
    print(f"  {'scenario':14s} {'cost':>12s} {'cash_tie':>11s} {'peak%':>7s} "
          f"{'OTD%':>6s} {'min_cash':>11s} {'risks':>6s}")
    for n, w in presets.items():
        r = run_plan(ds, w, 15)
        k = r.kpis
        print(f"  {n:14s} {k.total_cost:>12,.0f} {k.cash_tie_up:>11,.0f} "
              f"{k.peak_capacity_load_pct:>6.1f}% {k.on_time_delivery_pct:>5.1f}% "
              f"{k.min_cash_balance:>11,.0f} {len(r.risks):>6d}")

    # verify API object imports
    from app.main import app
    print("\nAPI import OK:", app.title)


if __name__ == "__main__":
    main()
    scenarios()
