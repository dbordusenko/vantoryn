"""End-to-end API test using FastAPI TestClient (no network needed)."""
import os
os.environ["DATABASE_URL"] = "sqlite:///./aps_test.db"
if os.path.exists("aps_test.db"):
    os.remove("aps_test.db")

from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine, SessionLocal
from app.seed import seed_demo

# explicit setup (TestClient instantiated without context-manager won't run lifespan)
Base.metadata.create_all(bind=engine)
_db = SessionLocal()
try:
    seed_demo(_db)
finally:
    _db.close()

c = TestClient(app)


def main():
    # health
    assert c.get("/").json()["status"] == "ok"
    print("health: ok")

    # auto-seed populated master data
    prods = c.get("/api/aps/products").json()
    print(f"products seeded: {len(prods)}")
    assert len(prods) >= 7

    bom = c.get("/api/aps/bom").json()
    alts = sum(len(x["alternates"]) for x in bom)
    print(f"bom rows: {len(bom)} (alternates: {alts})")
    assert alts >= 1

    # CRUD: create a product, update, delete
    r = c.post("/api/aps/products", json={
        "id": "TEST-1", "sku": "TEST-1", "name": "Test Widget", "type": "RAW",
        "source": "BUY", "standard_cost": 9.9, "lead_time_days": 5})
    assert r.status_code == 201, r.text
    r = c.put("/api/aps/products/TEST-1", json={
        "id": "TEST-1", "sku": "TEST-1", "name": "Test Widget v2", "type": "RAW",
        "source": "BUY", "standard_cost": 11.0, "lead_time_days": 5})
    assert r.json()["name"] == "Test Widget v2"
    assert c.delete("/api/aps/products/TEST-1").status_code == 204
    print("CRUD product: create/update/delete ok")

    # run a plan (persists a version)
    r = c.post("/api/aps/plan/run", json={"weights": {"cash_tie_up": 5}, "label": "run-A"}).json()
    print(f"plan run: status={r['status']} version_id={r['version_id']} "
          f"cost={r['kpis']['total_cost']:.0f} cash_tie={r['kpis']['cash_tie_up']:.0f}")
    assert r["status"] in ("OPTIMAL", "FEASIBLE")
    assert r["version_id"] is not None
    vid = r["version_id"]

    # substitution recommendation present (alternate selection)
    subs = [x for x in r["recommendations"] if "Substituted" in x]
    print("substitution rec:", subs[0] if subs else "none")

    # run second plan
    c.post("/api/aps/plan/run", json={"weights": {"stockout": 20}, "label": "run-B"})

    # history
    hist = c.get("/api/aps/plan/history").json()
    print(f"history versions: {len(hist)} (latest label: {hist[0]['label']})")
    assert len(hist) >= 2

    # fetch a stored version
    stored = c.get(f"/api/aps/plan/{vid}").json()
    assert stored["status"] in ("OPTIMAL", "FEASIBLE")
    print(f"fetched version {vid}: {len(stored['mps'])} mps rows, {len(stored['cash_flow'])} cash points")

    # scenarios
    sc = c.get("/api/aps/plan/scenario") if False else c.post("/api/aps/plan/scenario")
    scd = sc.json()["scenarios"]
    print("scenarios:")
    for k, v in scd.items():
        print(f"  {k:16s} cost={v['kpis']['total_cost']:>10,.0f} "
              f"cash_tie={v['kpis']['cash_tie_up']:>10,.0f} risks={v['risk_count']}")

    print("\nALL API TESTS PASSED")


if __name__ == "__main__":
    main()
