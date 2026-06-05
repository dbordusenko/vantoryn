"""Pydantic schemas for the CRUD API (request/response)."""
from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------------- Product ----------------
class ProductIn(BaseModel):
    id: str
    sku: str
    name: str
    type: str                       # FG | WIP | RAW
    uom: str = "ea"
    source: str                     # MAKE | BUY
    standard_cost: float = 0.0
    selling_price: float = 0.0
    lead_time_days: int = 0
    moq: float = 0.0
    order_multiple: float = 0.0
    safety_stock_method: str = "STATIC"
    safety_stock_value: float = 0.0
    supplier_id: str | None = None
    customer_dso_days: int = 30


class ProductOut(ProductIn, ORMModel):
    pass


# ---------------- BOM ----------------
class AlternateIn(BaseModel):
    component_id: str
    priority: int = 2
    conversion_factor: float = 1.0
    cost_delta: float = 0.0


class AlternateOut(AlternateIn, ORMModel):
    id: int


class BomComponentIn(BaseModel):
    parent_id: str
    output_qty: float = 1.0
    component_id: str
    quantity_per: float = 1.0
    scrap_rate: float = 0.0
    priority: int = 1
    alternates: list[AlternateIn] = Field(default_factory=list)


class BomComponentOut(ORMModel):
    id: int
    parent_id: str
    output_qty: float
    component_id: str
    quantity_per: float
    scrap_rate: float
    priority: int
    alternates: list[AlternateOut] = Field(default_factory=list)


# ---------------- Resource / Routing / Supplier ----------------
class ResourceIn(BaseModel):
    id: str
    name: str
    cost_per_hour: float = 0.0
    hours_per_period: float = 0.0
    overtime_cost_per_hour: float = 0.0
    max_overtime_hours: float = 0.0


class ResourceOut(ResourceIn, ORMModel):
    pass


class RoutingIn(BaseModel):
    product_id: str
    resource_id: str
    run_time_per_unit_min: float = 0.0
    setup_time_min: float = 0.0


class RoutingOut(RoutingIn, ORMModel):
    id: int


class SupplierIn(BaseModel):
    id: str
    name: str
    payment_terms_days: int = 30
    reliability: float = 0.98


class SupplierOut(SupplierIn, ORMModel):
    pass


# ---------------- Transactional ----------------
class InventoryIn(BaseModel):
    product_id: str
    on_hand_qty: float = 0.0
    allocated_qty: float = 0.0


class InventoryOut(InventoryIn, ORMModel):
    id: int


class ReceiptIn(BaseModel):
    product_id: str
    period_index: int
    qty: float


class ReceiptOut(ReceiptIn, ORMModel):
    id: int


class ForecastIn(BaseModel):
    product_id: str
    period_index: int
    quantity: float


class ForecastOut(ForecastIn, ORMModel):
    id: int


# ---------------- Settings ----------------
class SettingsIn(BaseModel):
    horizon_periods: int = 12
    bucket: str = "WEEK"
    period_start: str = "2026-06-08"
    discount_rate_annual: float = 0.12
    target_cash_balance: float = 0.0
    opening_cash: float = 0.0
    overhead_per_period: float = 0.0


class SettingsOut(SettingsIn, ORMModel):
    tenant_id: str


# ---------------- Planning ----------------
class RunPlanIn(BaseModel):
    weights: dict = Field(default_factory=dict)     # {holding, setup, overtime, stockout, cash_tie_up}
    time_limit_s: int = 30
    label: str | None = None
    save: bool = True                               # persist to plan history


class PlanVersionMeta(ORMModel):
    id: int
    created_at: datetime
    label: str | None
    status: str
    weights: dict
    kpis: dict
