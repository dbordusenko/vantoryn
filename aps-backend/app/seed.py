"""Seed the database from the built-in demo dataset (idempotent: only if empty)."""
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from . import orm
from .config import DEFAULT_TENANT
from .demo_data import build_demo_dataset


def is_empty(db: Session, tenant: str = DEFAULT_TENANT) -> bool:
    n = db.scalar(select(func.count()).select_from(orm.Product)
                  .where(orm.Product.tenant_id == tenant))
    return (n or 0) == 0


def seed_demo(db: Session, tenant: str = DEFAULT_TENANT, force: bool = False):
    if force:
        for m in (orm.BomAlternate, orm.BomComponent, orm.RoutingOp, orm.InventoryRecord,
                  orm.ScheduledReceipt, orm.ForecastEntry, orm.Supplier, orm.Resource,
                  orm.Product, orm.PlanSettings, orm.PlanVersion):
            db.query(m).delete()
        db.commit()
    elif not is_empty(db, tenant):
        return False

    ds = build_demo_dataset()

    for p in ds.products:
        db.add(orm.Product(
            id=p.id, tenant_id=tenant, sku=p.sku, name=p.name, type=p.type.value,
            uom=p.uom, source=p.source.value, standard_cost=p.standard_cost,
            selling_price=p.selling_price, lead_time_days=p.lead_time_days,
            moq=p.moq, order_multiple=p.order_multiple,
            safety_stock_method=p.safety_stock.method, safety_stock_value=p.safety_stock.value,
            supplier_id=p.supplier_id, customer_dso_days=p.customer_dso_days,
        ))
    db.flush()

    for b in ds.boms:
        for c in b.components:
            comp = orm.BomComponent(
                tenant_id=tenant, parent_id=b.parent_id, output_qty=b.output_qty,
                component_id=c.component_id, quantity_per=c.quantity_per,
                scrap_rate=c.scrap_rate, priority=c.priority,
            )
            db.add(comp); db.flush()
            for a in c.alternates:
                db.add(orm.BomAlternate(
                    bom_component_id=comp.id, component_id=a.component_id,
                    priority=a.priority, conversion_factor=a.conversion_factor,
                    cost_delta=a.cost_delta,
                ))

    for r in ds.resources:
        db.add(orm.Resource(
            id=r.id, tenant_id=tenant, name=r.name, cost_per_hour=r.cost_per_hour,
            hours_per_period=r.hours_per_period,
            overtime_cost_per_hour=r.overtime_cost_per_hour,
            max_overtime_hours=r.max_overtime_hours,
        ))
    for r in ds.routings:
        db.add(orm.RoutingOp(
            tenant_id=tenant, product_id=r.product_id, resource_id=r.resource_id,
            run_time_per_unit_min=r.run_time_per_unit_min, setup_time_min=r.setup_time_min,
        ))
    for s in ds.suppliers:
        db.add(orm.Supplier(
            id=s.id, tenant_id=tenant, name=s.name,
            payment_terms_days=s.payment_terms_days, reliability=s.reliability,
        ))
    for i in ds.inventory:
        db.add(orm.InventoryRecord(
            tenant_id=tenant, product_id=i.product_id,
            on_hand_qty=i.on_hand_qty, allocated_qty=i.allocated_qty,
        ))
    for sr in ds.scheduled_receipts:
        db.add(orm.ScheduledReceipt(
            tenant_id=tenant, product_id=sr.product_id,
            period_index=sr.period_index, qty=sr.qty,
        ))
    for f in ds.forecast:
        db.add(orm.ForecastEntry(
            tenant_id=tenant, product_id=f.product_id,
            period_index=f.period_index, quantity=f.quantity,
        ))

    db.add(orm.PlanSettings(
        tenant_id=tenant, horizon_periods=ds.horizon_periods, bucket=ds.bucket.value,
        period_start=ds.period_start.isoformat(),
        discount_rate_annual=ds.financials.discount_rate_annual,
        target_cash_balance=ds.financials.target_cash_balance,
        opening_cash=ds.financials.opening_cash,
        overhead_per_period=ds.financials.overhead_per_period,
    ))
    db.commit()
    return True
