"""APS domain models (Pydantic v2). Subset of the full spec — MVP scope."""
from __future__ import annotations
from datetime import date
from enum import Enum
from pydantic import BaseModel, Field


# ----------------------------- Enums -----------------------------
class ProductType(str, Enum):
    FG = "FG"
    WIP = "WIP"
    RAW = "RAW"


class SourceType(str, Enum):
    MAKE = "MAKE"
    BUY = "BUY"


class Bucket(str, Enum):
    WEEK = "WEEK"
    MONTH = "MONTH"


# ----------------------------- Master data -----------------------------
class SafetyStockPolicy(BaseModel):
    method: str = "STATIC"          # STATIC | DAYS_OF_SUPPLY
    value: float = 0.0


class Product(BaseModel):
    id: str
    sku: str
    name: str
    type: ProductType
    uom: str = "ea"
    source: SourceType
    standard_cost: float = 0.0      # unit cost (for inventory valuation / cash)
    selling_price: float = 0.0      # FG only
    lead_time_days: int = 0         # purchase or production lead time
    moq: float = 0.0
    order_multiple: float = 0.0     # 0 = no rounding
    safety_stock: SafetyStockPolicy = Field(default_factory=SafetyStockPolicy)
    supplier_id: str | None = None
    customer_dso_days: int = 30     # collection terms (FG)


class AlternateComponent(BaseModel):
    component_id: str
    priority: int = 2               # 2,3,... — lower number = preferred
    conversion_factor: float = 1.0  # 1.0 = 1:1 replacement
    cost_delta: float = 0.0         # extra unit cost vs primary (informational)


class BOMComponent(BaseModel):
    component_id: str
    quantity_per: float
    scrap_rate: float = 0.0         # 0.02 = 2%
    priority: int = 1               # primary component = 1
    alternates: list[AlternateComponent] = Field(default_factory=list)


class BOM(BaseModel):
    parent_id: str
    output_qty: float = 1.0
    components: list[BOMComponent] = Field(default_factory=list)


class Resource(BaseModel):
    id: str
    name: str
    cost_per_hour: float = 0.0
    hours_per_period: float = 0.0   # available capacity per planning bucket
    overtime_cost_per_hour: float = 0.0
    max_overtime_hours: float = 0.0


class RoutingOp(BaseModel):
    product_id: str
    resource_id: str
    run_time_per_unit_min: float = 0.0
    setup_time_min: float = 0.0


class Supplier(BaseModel):
    id: str
    name: str
    payment_terms_days: int = 30    # DPO
    reliability: float = 0.98


# ----------------------------- Transactional -----------------------------
class InventoryRecord(BaseModel):
    product_id: str
    on_hand_qty: float = 0.0
    allocated_qty: float = 0.0

    @property
    def available(self) -> float:
        return self.on_hand_qty - self.allocated_qty


class ScheduledReceipt(BaseModel):
    """Open PO or MO that will arrive in a given period."""
    product_id: str
    period_index: int
    qty: float


class ForecastEntry(BaseModel):
    product_id: str
    period_index: int               # 0-based bucket index
    quantity: float


class FinancialParams(BaseModel):
    discount_rate_annual: float = 0.12
    target_cash_balance: float = 0.0
    opening_cash: float = 0.0
    overhead_per_period: float = 0.0


# ----------------------------- Plan request / dataset -----------------------------
class PlanningDataset(BaseModel):
    horizon_periods: int = 12
    bucket: Bucket = Bucket.WEEK
    period_start: date
    products: list[Product]
    boms: list[BOM] = Field(default_factory=list)
    resources: list[Resource] = Field(default_factory=list)
    routings: list[RoutingOp] = Field(default_factory=list)
    suppliers: list[Supplier] = Field(default_factory=list)
    inventory: list[InventoryRecord] = Field(default_factory=list)
    scheduled_receipts: list[ScheduledReceipt] = Field(default_factory=list)
    forecast: list[ForecastEntry] = Field(default_factory=list)
    financials: FinancialParams = Field(default_factory=FinancialParams)


class PlanWeights(BaseModel):
    holding: float = 1.0
    setup: float = 1.0
    overtime: float = 1.0
    stockout: float = 5.0
    cash_tie_up: float = 1.0


class PlanRequest(BaseModel):
    dataset: PlanningDataset | None = None   # None → use demo dataset
    weights: PlanWeights = Field(default_factory=PlanWeights)
    time_limit_s: int = 30


# ----------------------------- Outputs -----------------------------
class MPSEntry(BaseModel):
    product_id: str
    period_index: int
    gross_demand: float
    net_requirement: float
    planned_order: float
    projected_on_hand: float
    source: SourceType


class PurchaseOrder(BaseModel):
    product_id: str
    supplier_id: str | None
    order_period: int
    receipt_period: int
    qty: float
    unit_cost: float
    amount: float
    payment_period: int             # when cash leaves (DPO)


class CapacityLoad(BaseModel):
    resource_id: str
    period_index: int
    required_hours: float
    available_hours: float
    overtime_hours: float
    load_pct: float


class CashFlowPoint(BaseModel):
    period_index: int
    cash_in: float
    cash_out: float
    net_cash: float
    cumulative_cash: float
    material_purchases: float
    direct_labor: float
    overhead: float
    sales_collections: float


class RiskAlert(BaseModel):
    severity: str                   # HIGH | MED | LOW | INFO
    category: str                   # SHORTAGE | BOTTLENECK | CASH | OTD
    period_index: int | None
    product_id: str | None
    resource_id: str | None
    message: str


class PlanKPIs(BaseModel):
    total_cost: float
    cash_tie_up: float
    peak_capacity_load_pct: float
    on_time_delivery_pct: float
    total_setup_min: float
    min_cash_balance: float


class PlanResult(BaseModel):
    status: str
    objective_value: float
    kpis: PlanKPIs
    mps: list[MPSEntry]
    purchase_plan: list[PurchaseOrder]
    capacity_loads: list[CapacityLoad]
    cash_flow: list[CashFlowPoint]
    risks: list[RiskAlert]
    recommendations: list[str]
