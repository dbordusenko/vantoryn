"""Realistic client-demo dataset: a mid-size IoT electronics manufacturer.

Tells a clear story the optimizer can surface:
  • 4 finished goods, 2 sub-assemblies, 11 raw materials, 3 work centers, 12 weeks
  • SMT line + both assembly cells hit capacity in peak weeks → build-ahead vs overtime
  • RF-CHIP has a 35-day lead time with a fast 10-day alternate → auto substitution
  • Purchases lead collections (DSO 45-60d) → mid-horizon cash dip vs target
"""
from __future__ import annotations
from datetime import date
from .models import (
    PlanningDataset, Product, ProductType, SourceType, BOM, BOMComponent,
    AlternateComponent, Resource, RoutingOp, Supplier, InventoryRecord,
    ScheduledReceipt, ForecastEntry, FinancialParams, SafetyStockPolicy, Bucket,
)


def _fg(id, name, cost, price, dso, ss):
    return Product(id=id, sku=id, name=name, type=ProductType.FG, source=SourceType.MAKE,
                   standard_cost=cost, selling_price=price, lead_time_days=7,
                   customer_dso_days=dso, safety_stock=SafetyStockPolicy(value=ss))


def _wip(id, name, cost, ss):
    return Product(id=id, sku=id, name=name, type=ProductType.WIP, source=SourceType.MAKE,
                   standard_cost=cost, lead_time_days=7,
                   safety_stock=SafetyStockPolicy(value=ss))


def _raw(id, name, cost, lead, moq, mult, sup, ss):
    return Product(id=id, sku=id, name=name, type=ProductType.RAW, source=SourceType.BUY,
                   standard_cost=cost, lead_time_days=lead, moq=moq, order_multiple=mult,
                   supplier_id=sup, safety_stock=SafetyStockPolicy(value=ss))


def build_demo_dataset() -> PlanningDataset:
    products = [
        # Finished goods
        _fg("HUB-PRO",  "Smart Hub Pro",   78, 210, 45, 40),
        _fg("HUB-LITE", "Smart Hub Lite",  52, 140, 45, 50),
        _fg("SENS-X",   "Sensor X",        34,  95, 30, 60),
        _fg("CAM-1",    "Security Camera", 96, 260, 60, 25),
        # Sub-assemblies
        _wip("PCBA-MAIN", "Main PCB Assembly", 22, 60),
        _wip("PCBA-RF",   "RF PCB Assembly",   28, 40),
        # Raw materials
        _raw("MCU",        "Microcontroller",   6.5, 21,  500, 100, "SUP-CHIP", 400),
        _raw("RF-CHIP",    "RF Transceiver",    8.2, 35,  500, 100, "SUP-CHIP", 300),
        _raw("RF-CHIP-B",  "RF Transceiver (alt, fast)", 9.1, 10, 250, 50, "SUP-ALT", 150),
        _raw("SENSOR",     "Sensor Element",    3.2, 28, 1000, 500, "SUP-CHIP", 800),
        _raw("LENS",       "Optical Lens",      5.5, 21,  300, 100, "SUP-OPT",  200),
        _raw("CAM-MODULE", "Camera Module",    18.0, 28,  200,  50, "SUP-OPT",  100),
        _raw("ENCL-L",     "Enclosure Large",   4.0, 14,  200, 100, "SUP-MECH", 200),
        _raw("ENCL-S",     "Enclosure Small",   3.2, 14,  200, 100, "SUP-MECH", 200),
        _raw("PCB-BLANK",  "PCB Blank",         2.1, 14,  500, 250, "SUP-MECH", 500),
        _raw("CONNECTOR",  "Connector",         0.8, 10, 2000,1000, "SUP-MECH",1500),
        _raw("BATTERY",    "Battery Pack",      7.0, 21,  500, 100, "SUP-PWR",  300),
    ]

    boms = [
        BOM(parent_id="HUB-PRO", components=[
            BOMComponent(component_id="PCBA-MAIN", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="PCBA-RF",   quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="ENCL-L",    quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="CONNECTOR", quantity_per=3, scrap_rate=0.02),
            BOMComponent(component_id="BATTERY",   quantity_per=1, scrap_rate=0.01),
        ]),
        BOM(parent_id="HUB-LITE", components=[
            BOMComponent(component_id="PCBA-MAIN", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="ENCL-L",    quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="CONNECTOR", quantity_per=2, scrap_rate=0.02),
            BOMComponent(component_id="BATTERY",   quantity_per=1, scrap_rate=0.01),
        ]),
        BOM(parent_id="SENS-X", components=[
            BOMComponent(component_id="PCBA-MAIN", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="SENSOR",    quantity_per=2, scrap_rate=0.03),
            BOMComponent(component_id="ENCL-S",    quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="CONNECTOR", quantity_per=1, scrap_rate=0.02),
        ]),
        BOM(parent_id="CAM-1", components=[
            BOMComponent(component_id="PCBA-MAIN",  quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="PCBA-RF",    quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="CAM-MODULE", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="LENS",       quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="ENCL-L",     quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="BATTERY",    quantity_per=1, scrap_rate=0.01),
        ]),
        BOM(parent_id="PCBA-MAIN", components=[
            BOMComponent(component_id="PCB-BLANK", quantity_per=1, scrap_rate=0.05),
            BOMComponent(component_id="MCU",       quantity_per=1, scrap_rate=0.01),
        ]),
        BOM(parent_id="PCBA-RF", components=[
            BOMComponent(component_id="PCB-BLANK", quantity_per=1, scrap_rate=0.05),
            BOMComponent(component_id="RF-CHIP",   quantity_per=1, scrap_rate=0.01, priority=1,
                         alternates=[AlternateComponent(component_id="RF-CHIP-B", priority=2,
                                                        conversion_factor=1.0, cost_delta=0.9)]),
        ]),
    ]

    # Capacity deliberately tight in peak weeks → real build-ahead vs overtime tradeoff
    resources = [
        Resource(id="SMT",   name="SMT Line",        cost_per_hour=85, hours_per_period=24,
                 overtime_cost_per_hour=128, max_overtime_hours=8),
        Resource(id="ASSY1", name="Assembly Cell 1", cost_per_hour=45, hours_per_period=28,
                 overtime_cost_per_hour=68, max_overtime_hours=10),
        Resource(id="ASSY2", name="Assembly Cell 2", cost_per_hour=48, hours_per_period=24,
                 overtime_cost_per_hour=72, max_overtime_hours=10),
    ]

    routings = [
        RoutingOp(product_id="PCBA-MAIN", resource_id="SMT",   run_time_per_unit_min=1.2, setup_time_min=40),
        RoutingOp(product_id="PCBA-RF",   resource_id="SMT",   run_time_per_unit_min=1.8, setup_time_min=50),
        RoutingOp(product_id="HUB-PRO",   resource_id="ASSY1", run_time_per_unit_min=5.0, setup_time_min=30),
        RoutingOp(product_id="HUB-LITE",  resource_id="ASSY1", run_time_per_unit_min=3.5, setup_time_min=25),
        RoutingOp(product_id="SENS-X",    resource_id="ASSY2", run_time_per_unit_min=3.0, setup_time_min=20),
        RoutingOp(product_id="CAM-1",     resource_id="ASSY2", run_time_per_unit_min=6.0, setup_time_min=35),
    ]

    suppliers = [
        Supplier(id="SUP-CHIP", name="GlobalChip Co",   payment_terms_days=45, reliability=0.94),
        Supplier(id="SUP-ALT",  name="FastSemi Ltd",    payment_terms_days=30, reliability=0.97),
        Supplier(id="SUP-OPT",  name="OptiVision Inc",  payment_terms_days=45, reliability=0.96),
        Supplier(id="SUP-MECH", name="MechParts Ltd",   payment_terms_days=30, reliability=0.99),
        Supplier(id="SUP-PWR",  name="PowerCell Corp",  payment_terms_days=30, reliability=0.98),
    ]

    inventory = [
        InventoryRecord(product_id="HUB-PRO", on_hand_qty=90),
        InventoryRecord(product_id="HUB-LITE", on_hand_qty=140),
        InventoryRecord(product_id="SENS-X", on_hand_qty=170),
        InventoryRecord(product_id="CAM-1", on_hand_qty=50),
        InventoryRecord(product_id="PCBA-MAIN", on_hand_qty=120),
        InventoryRecord(product_id="PCBA-RF", on_hand_qty=70),
        InventoryRecord(product_id="MCU", on_hand_qty=700),
        InventoryRecord(product_id="RF-CHIP", on_hand_qty=400),
        InventoryRecord(product_id="RF-CHIP-B", on_hand_qty=0),
        InventoryRecord(product_id="SENSOR", on_hand_qty=1400),
        InventoryRecord(product_id="LENS", on_hand_qty=260),
        InventoryRecord(product_id="CAM-MODULE", on_hand_qty=130),
        InventoryRecord(product_id="ENCL-L", on_hand_qty=350),
        InventoryRecord(product_id="ENCL-S", on_hand_qty=300),
        InventoryRecord(product_id="PCB-BLANK", on_hand_qty=800),
        InventoryRecord(product_id="CONNECTOR", on_hand_qty=4000),
        InventoryRecord(product_id="BATTERY", on_hand_qty=600),
    ]

    scheduled_receipts = [
        ScheduledReceipt(product_id="MCU", period_index=2, qty=500),
        ScheduledReceipt(product_id="SENSOR", period_index=3, qty=1000),
        ScheduledReceipt(product_id="CAM-MODULE", period_index=4, qty=200),
    ]

    # 12-week ramping demand (units/week)
    demand = {
        "HUB-PRO":  [80, 90, 100, 110, 120, 130, 140, 150, 150, 160, 160, 170],
        "HUB-LITE": [120, 130, 150, 160, 180, 190, 200, 210, 220, 230, 240, 240],
        "SENS-X":   [150, 160, 180, 200, 210, 230, 250, 260, 270, 280, 290, 300],
        "CAM-1":    [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 90],
    }
    forecast = []
    for pid, series in demand.items():
        for t, q in enumerate(series):
            forecast.append(ForecastEntry(product_id=pid, period_index=t, quantity=q))

    financials = FinancialParams(
        discount_rate_annual=0.12, target_cash_balance=120000,
        opening_cash=450000, overhead_per_period=14000,
    )

    return PlanningDataset(
        horizon_periods=12, bucket=Bucket.WEEK, period_start=date(2026, 6, 8),
        products=products, boms=boms, resources=resources, routings=routings,
        suppliers=suppliers, inventory=inventory, scheduled_receipts=scheduled_receipts,
        forecast=forecast, financials=financials,
    )
