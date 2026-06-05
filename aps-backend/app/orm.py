"""ORM table definitions mirroring the APS domain (master + transactional + results)."""
from __future__ import annotations
from datetime import datetime
from sqlalchemy import (
    String, Float, Integer, Boolean, ForeignKey, DateTime, JSON, Text, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base


class Product(Base):
    __tablename__ = "products"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    sku: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)            # FG | WIP | RAW
    uom: Mapped[str] = mapped_column(String, default="ea")
    source: Mapped[str] = mapped_column(String)          # MAKE | BUY
    standard_cost: Mapped[float] = mapped_column(Float, default=0.0)
    selling_price: Mapped[float] = mapped_column(Float, default=0.0)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=0)
    moq: Mapped[float] = mapped_column(Float, default=0.0)
    order_multiple: Mapped[float] = mapped_column(Float, default=0.0)
    safety_stock_method: Mapped[str] = mapped_column(String, default="STATIC")
    safety_stock_value: Mapped[float] = mapped_column(Float, default=0.0)
    supplier_id: Mapped[str | None] = mapped_column(String, nullable=True)
    customer_dso_days: Mapped[int] = mapped_column(Integer, default=30)


class BomComponent(Base):
    __tablename__ = "bom_components"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    parent_id: Mapped[str] = mapped_column(String, index=True)
    output_qty: Mapped[float] = mapped_column(Float, default=1.0)
    component_id: Mapped[str] = mapped_column(String)
    quantity_per: Mapped[float] = mapped_column(Float, default=1.0)
    scrap_rate: Mapped[float] = mapped_column(Float, default=0.0)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    alternates: Mapped[list["BomAlternate"]] = relationship(
        back_populates="component", cascade="all, delete-orphan")


class BomAlternate(Base):
    __tablename__ = "bom_alternates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bom_component_id: Mapped[int] = mapped_column(ForeignKey("bom_components.id"))
    component_id: Mapped[str] = mapped_column(String)
    priority: Mapped[int] = mapped_column(Integer, default=2)
    conversion_factor: Mapped[float] = mapped_column(Float, default=1.0)
    cost_delta: Mapped[float] = mapped_column(Float, default=0.0)
    component: Mapped["BomComponent"] = relationship(back_populates="alternates")


class Resource(Base):
    __tablename__ = "resources"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    name: Mapped[str] = mapped_column(String)
    cost_per_hour: Mapped[float] = mapped_column(Float, default=0.0)
    hours_per_period: Mapped[float] = mapped_column(Float, default=0.0)
    overtime_cost_per_hour: Mapped[float] = mapped_column(Float, default=0.0)
    max_overtime_hours: Mapped[float] = mapped_column(Float, default=0.0)


class RoutingOp(Base):
    __tablename__ = "routing_ops"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    product_id: Mapped[str] = mapped_column(String, index=True)
    resource_id: Mapped[str] = mapped_column(String)
    run_time_per_unit_min: Mapped[float] = mapped_column(Float, default=0.0)
    setup_time_min: Mapped[float] = mapped_column(Float, default=0.0)


class Supplier(Base):
    __tablename__ = "suppliers"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    name: Mapped[str] = mapped_column(String)
    payment_terms_days: Mapped[int] = mapped_column(Integer, default=30)
    reliability: Mapped[float] = mapped_column(Float, default=0.98)


class InventoryRecord(Base):
    __tablename__ = "inventory"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    product_id: Mapped[str] = mapped_column(String, index=True)
    on_hand_qty: Mapped[float] = mapped_column(Float, default=0.0)
    allocated_qty: Mapped[float] = mapped_column(Float, default=0.0)


class ScheduledReceipt(Base):
    __tablename__ = "scheduled_receipts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    product_id: Mapped[str] = mapped_column(String, index=True)
    period_index: Mapped[int] = mapped_column(Integer)
    qty: Mapped[float] = mapped_column(Float)


class ForecastEntry(Base):
    __tablename__ = "forecast"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    product_id: Mapped[str] = mapped_column(String, index=True)
    period_index: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[float] = mapped_column(Float)


class PlanSettings(Base):
    """Singleton-ish per tenant: horizon + financial params."""
    __tablename__ = "plan_settings"
    tenant_id: Mapped[str] = mapped_column(String, primary_key=True, default="default")
    horizon_periods: Mapped[int] = mapped_column(Integer, default=12)
    bucket: Mapped[str] = mapped_column(String, default="WEEK")
    period_start: Mapped[str] = mapped_column(String, default="2026-06-08")
    discount_rate_annual: Mapped[float] = mapped_column(Float, default=0.12)
    target_cash_balance: Mapped[float] = mapped_column(Float, default=0.0)
    opening_cash: Mapped[float] = mapped_column(Float, default=0.0)
    overhead_per_period: Mapped[float] = mapped_column(Float, default=0.0)


class PlanVersion(Base):
    """History of every plan run — the audit trail."""
    __tablename__ = "plan_versions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True, default="default")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    label: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String)
    weights: Mapped[dict] = mapped_column(JSON)
    kpis: Mapped[dict] = mapped_column(JSON)
    result: Mapped[dict] = mapped_column(JSON)          # full PlanResult snapshot
