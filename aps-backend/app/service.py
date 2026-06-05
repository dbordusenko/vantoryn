"""Service layer: build the engine's PlanningDataset from DB rows and run plans."""
from __future__ import annotations
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select

from . import orm
from .config import DEFAULT_TENANT
from .models import (
    PlanningDataset, Product, ProductType, SourceType, BOM, BOMComponent,
    AlternateComponent, Resource, RoutingOp, Supplier, InventoryRecord,
    ScheduledReceipt, ForecastEntry, FinancialParams, SafetyStockPolicy, Bucket,
    PlanWeights,
)
from .engine import run_plan


def build_dataset(db: Session, tenant: str = DEFAULT_TENANT) -> PlanningDataset:
    def q(model):
        return db.scalars(select(model).where(model.tenant_id == tenant)).all()

    products = [Product(
        id=p.id, sku=p.sku, name=p.name, type=ProductType(p.type), uom=p.uom,
        source=SourceType(p.source), standard_cost=p.standard_cost,
        selling_price=p.selling_price, lead_time_days=p.lead_time_days,
        moq=p.moq, order_multiple=p.order_multiple,
        safety_stock=SafetyStockPolicy(method=p.safety_stock_method, value=p.safety_stock_value),
        supplier_id=p.supplier_id, customer_dso_days=p.customer_dso_days,
    ) for p in q(orm.Product)]

    # group bom components by parent
    boms_by_parent: dict[str, BOM] = {}
    for c in q(orm.BomComponent):
        bom = boms_by_parent.setdefault(c.parent_id, BOM(parent_id=c.parent_id, output_qty=c.output_qty))
        bom.components.append(BOMComponent(
            component_id=c.component_id, quantity_per=c.quantity_per,
            scrap_rate=c.scrap_rate, priority=c.priority,
            alternates=[AlternateComponent(
                component_id=a.component_id, priority=a.priority,
                conversion_factor=a.conversion_factor, cost_delta=a.cost_delta,
            ) for a in c.alternates],
        ))
    boms = list(boms_by_parent.values())

    resources = [Resource(
        id=r.id, name=r.name, cost_per_hour=r.cost_per_hour,
        hours_per_period=r.hours_per_period,
        overtime_cost_per_hour=r.overtime_cost_per_hour,
        max_overtime_hours=r.max_overtime_hours,
    ) for r in q(orm.Resource)]

    routings = [RoutingOp(
        product_id=r.product_id, resource_id=r.resource_id,
        run_time_per_unit_min=r.run_time_per_unit_min, setup_time_min=r.setup_time_min,
    ) for r in q(orm.RoutingOp)]

    suppliers = [Supplier(
        id=s.id, name=s.name, payment_terms_days=s.payment_terms_days,
        reliability=s.reliability,
    ) for s in q(orm.Supplier)]

    inventory = [InventoryRecord(
        product_id=i.product_id, on_hand_qty=i.on_hand_qty, allocated_qty=i.allocated_qty,
    ) for i in q(orm.InventoryRecord)]

    receipts = [ScheduledReceipt(
        product_id=r.product_id, period_index=r.period_index, qty=r.qty,
    ) for r in q(orm.ScheduledReceipt)]

    forecast = [ForecastEntry(
        product_id=f.product_id, period_index=f.period_index, quantity=f.quantity,
    ) for f in q(orm.ForecastEntry)]

    st = db.get(orm.PlanSettings, tenant)
    if st is None:
        st = orm.PlanSettings(tenant_id=tenant)
        db.add(st); db.commit()
    financials = FinancialParams(
        discount_rate_annual=st.discount_rate_annual,
        target_cash_balance=st.target_cash_balance,
        opening_cash=st.opening_cash, overhead_per_period=st.overhead_per_period,
    )

    return PlanningDataset(
        horizon_periods=st.horizon_periods, bucket=Bucket(st.bucket),
        period_start=date.fromisoformat(st.period_start),
        products=products, boms=boms, resources=resources, routings=routings,
        suppliers=suppliers, inventory=inventory, scheduled_receipts=receipts,
        forecast=forecast, financials=financials,
    )


def run_and_optionally_save(db: Session, weights: dict, time_limit_s: int,
                            label: str | None, save: bool, tenant: str = DEFAULT_TENANT):
    ds = build_dataset(db, tenant)
    w = PlanWeights(**{k: v for k, v in (weights or {}).items()
                       if k in PlanWeights.model_fields})
    result = run_plan(ds, w, time_limit_s)
    if save:
        pv = orm.PlanVersion(
            tenant_id=tenant, label=label, status=result.status,
            weights=w.model_dump(), kpis=result.kpis.model_dump(),
            result=result.model_dump(),
        )
        db.add(pv); db.commit(); db.refresh(pv)
        return result, pv.id
    return result, None
