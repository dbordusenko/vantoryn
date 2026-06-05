"""All API routers: CRUD for master + transactional data, planning, and history."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from . import orm, schemas
from .db import get_db
from .config import DEFAULT_TENANT
from .service import build_dataset, run_and_optionally_save
from .seed import seed_demo

api = APIRouter(prefix="/api/aps")
T = DEFAULT_TENANT


# ───────────────────────── generic CRUD factory (flat, string-PK entities) ─────────────────────────
def make_crud(name: str, model, in_schema, out_schema, pk: str = "id"):
    r = APIRouter(prefix=f"/{name}", tags=[name])

    @r.get("", response_model=list[out_schema])
    def list_all(db: Session = Depends(get_db)):
        return db.scalars(select(model).where(model.tenant_id == T)).all()

    @r.post("", response_model=out_schema, status_code=201)
    def create(payload: in_schema, db: Session = Depends(get_db)):
        data = payload.model_dump()
        if pk in data and db.get(model, data[pk]) is not None:
            raise HTTPException(409, f"{name} '{data[pk]}' already exists")
        obj = model(tenant_id=T, **data)
        db.add(obj); db.commit(); db.refresh(obj)
        return obj

    @r.put("/{item_id}", response_model=out_schema)
    def update(item_id: str, payload: in_schema, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None or obj.tenant_id != T:
            raise HTTPException(404, f"{name} '{item_id}' not found")
        for k, v in payload.model_dump().items():
            setattr(obj, k, v)
        db.commit(); db.refresh(obj)
        return obj

    @r.delete("/{item_id}", status_code=204)
    def remove(item_id: str, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None or obj.tenant_id != T:
            raise HTTPException(404, f"{name} '{item_id}' not found")
        db.delete(obj); db.commit()

    return r


api.include_router(make_crud("products", orm.Product, schemas.ProductIn, schemas.ProductOut))
api.include_router(make_crud("resources", orm.Resource, schemas.ResourceIn, schemas.ResourceOut))
api.include_router(make_crud("suppliers", orm.Supplier, schemas.SupplierIn, schemas.SupplierOut))


# ───────────────────────── integer-PK flat entities (routing, inventory, receipts, forecast) ─────────────────────────
def make_crud_int(name: str, model, in_schema, out_schema):
    r = APIRouter(prefix=f"/{name}", tags=[name])

    @r.get("", response_model=list[out_schema])
    def list_all(db: Session = Depends(get_db)):
        return db.scalars(select(model).where(model.tenant_id == T)).all()

    @r.post("", response_model=out_schema, status_code=201)
    def create(payload: in_schema, db: Session = Depends(get_db)):
        obj = model(tenant_id=T, **payload.model_dump())
        db.add(obj); db.commit(); db.refresh(obj)
        return obj

    @r.put("/{item_id}", response_model=out_schema)
    def update(item_id: int, payload: in_schema, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None or obj.tenant_id != T:
            raise HTTPException(404, f"{name} '{item_id}' not found")
        for k, v in payload.model_dump().items():
            setattr(obj, k, v)
        db.commit(); db.refresh(obj)
        return obj

    @r.delete("/{item_id}", status_code=204)
    def remove(item_id: int, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None or obj.tenant_id != T:
            raise HTTPException(404, f"{name} '{item_id}' not found")
        db.delete(obj); db.commit()

    return r


api.include_router(make_crud_int("routings", orm.RoutingOp, schemas.RoutingIn, schemas.RoutingOut))
api.include_router(make_crud_int("inventory", orm.InventoryRecord, schemas.InventoryIn, schemas.InventoryOut))
api.include_router(make_crud_int("receipts", orm.ScheduledReceipt, schemas.ReceiptIn, schemas.ReceiptOut))
api.include_router(make_crud_int("forecast", orm.ForecastEntry, schemas.ForecastIn, schemas.ForecastOut))


# ───────────────────────── BOM (nested alternates) ─────────────────────────
bom = APIRouter(prefix="/bom", tags=["bom"])


@bom.get("", response_model=list[schemas.BomComponentOut])
def list_bom(db: Session = Depends(get_db)):
    return db.scalars(select(orm.BomComponent).where(orm.BomComponent.tenant_id == T)).all()


@bom.post("", response_model=schemas.BomComponentOut, status_code=201)
def create_bom(payload: schemas.BomComponentIn, db: Session = Depends(get_db)):
    comp = orm.BomComponent(
        tenant_id=T, parent_id=payload.parent_id, output_qty=payload.output_qty,
        component_id=payload.component_id, quantity_per=payload.quantity_per,
        scrap_rate=payload.scrap_rate, priority=payload.priority,
    )
    db.add(comp); db.flush()
    for a in payload.alternates:
        db.add(orm.BomAlternate(bom_component_id=comp.id, **a.model_dump()))
    db.commit(); db.refresh(comp)
    return comp


@bom.put("/{comp_id}", response_model=schemas.BomComponentOut)
def update_bom(comp_id: int, payload: schemas.BomComponentIn, db: Session = Depends(get_db)):
    comp = db.get(orm.BomComponent, comp_id)
    if comp is None or comp.tenant_id != T:
        raise HTTPException(404, f"bom component '{comp_id}' not found")
    comp.parent_id = payload.parent_id; comp.output_qty = payload.output_qty
    comp.component_id = payload.component_id; comp.quantity_per = payload.quantity_per
    comp.scrap_rate = payload.scrap_rate; comp.priority = payload.priority
    db.execute(delete(orm.BomAlternate).where(orm.BomAlternate.bom_component_id == comp_id))
    for a in payload.alternates:
        db.add(orm.BomAlternate(bom_component_id=comp.id, **a.model_dump()))
    db.commit(); db.refresh(comp)
    return comp


@bom.delete("/{comp_id}", status_code=204)
def delete_bom(comp_id: int, db: Session = Depends(get_db)):
    comp = db.get(orm.BomComponent, comp_id)
    if comp is None or comp.tenant_id != T:
        raise HTTPException(404, f"bom component '{comp_id}' not found")
    db.delete(comp); db.commit()


api.include_router(bom)


# ───────────────────────── Settings ─────────────────────────
settings_r = APIRouter(prefix="/settings", tags=["settings"])


@settings_r.get("", response_model=schemas.SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    st = db.get(orm.PlanSettings, T)
    if st is None:
        st = orm.PlanSettings(tenant_id=T); db.add(st); db.commit(); db.refresh(st)
    return st


@settings_r.put("", response_model=schemas.SettingsOut)
def update_settings(payload: schemas.SettingsIn, db: Session = Depends(get_db)):
    st = db.get(orm.PlanSettings, T)
    if st is None:
        st = orm.PlanSettings(tenant_id=T); db.add(st)
    for k, v in payload.model_dump().items():
        setattr(st, k, v)
    db.commit(); db.refresh(st)
    return st


api.include_router(settings_r)


# ───────────────────────── Dataset + Planning + History ─────────────────────────
plan = APIRouter(tags=["planning"])


@plan.get("/dataset")
def get_dataset(db: Session = Depends(get_db)):
    return build_dataset(db)


@plan.post("/plan/run")
def plan_run(payload: schemas.RunPlanIn, db: Session = Depends(get_db)):
    result, version_id = run_and_optionally_save(
        db, payload.weights, payload.time_limit_s, payload.label, payload.save)
    out = result.model_dump()
    out["version_id"] = version_id
    return out


@plan.post("/plan/scenario")
def plan_scenario(db: Session = Depends(get_db)):
    presets = {
        "min_inventory":   {"holding": 5, "cash_tie_up": 5, "stockout": 8},
        "min_cash_tie_up": {"cash_tie_up": 10, "stockout": 5},
        "max_service":     {"stockout": 20},
        "balanced":        {},
    }
    results = {}
    for name, w in presets.items():
        r, _ = run_and_optionally_save(db, w, 15, f"scenario:{name}", save=False)
        results[name] = {"status": r.status, "kpis": r.kpis.model_dump(),
                         "risk_count": len(r.risks),
                         "high_risks": sum(1 for x in r.risks if x.severity == "HIGH")}
    return {"scenarios": results}


@plan.get("/plan/history", response_model=list[schemas.PlanVersionMeta])
def plan_history(limit: int = 25, db: Session = Depends(get_db)):
    return db.scalars(
        select(orm.PlanVersion).where(orm.PlanVersion.tenant_id == T)
        .order_by(orm.PlanVersion.created_at.desc()).limit(limit)
    ).all()


@plan.get("/plan/{version_id}")
def plan_get(version_id: int, db: Session = Depends(get_db)):
    pv = db.get(orm.PlanVersion, version_id)
    if pv is None or pv.tenant_id != T:
        raise HTTPException(404, f"plan version '{version_id}' not found")
    return pv.result


@plan.post("/seed")
def reseed(force: bool = False, db: Session = Depends(get_db)):
    changed = seed_demo(db, force=force)
    return {"seeded": changed, "forced": force}


api.include_router(plan)
