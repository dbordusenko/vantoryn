"""Realistic demo dataset: a small electronics assembler.

FG:  SmartSensor (SS-100), SmartHub (SH-200)
WIP: PCB Assembly (PCB-A)
RAW: Microcontroller (MCU-1), Sensor Chip (SEN-1), Enclosure (ENC-1), PCB blank (PCB-B)

BOM (2 levels):
  SS-100 (1) -> PCB-A x1, ENC-1 x1, SEN-1 x2
  SH-200 (1) -> PCB-A x1, ENC-1 x1
  PCB-A  (1) -> PCB-B x1, MCU-1 x1
"""
from __future__ import annotations
from datetime import date
from .models import (
    PlanningDataset, Product, ProductType, SourceType, BOM, BOMComponent,
    AlternateComponent, Resource, RoutingOp, Supplier, InventoryRecord,
    ScheduledReceipt, ForecastEntry, FinancialParams, SafetyStockPolicy, Bucket,
)


def build_demo_dataset() -> PlanningDataset:
    products = [
        Product(id="SS-100", sku="SS-100", name="SmartSensor", type=ProductType.FG,
                source=SourceType.MAKE, standard_cost=42, selling_price=120,
                lead_time_days=7, safety_stock=SafetyStockPolicy(value=50),
                customer_dso_days=45),
        Product(id="SH-200", sku="SH-200", name="SmartHub", type=ProductType.FG,
                source=SourceType.MAKE, standard_cost=58, selling_price=160,
                lead_time_days=7, safety_stock=SafetyStockPolicy(value=30),
                customer_dso_days=30),
        Product(id="PCB-A", sku="PCB-A", name="PCB Assembly", type=ProductType.WIP,
                source=SourceType.MAKE, standard_cost=18, lead_time_days=7,
                safety_stock=SafetyStockPolicy(value=40)),
        Product(id="MCU-1", sku="MCU-1", name="Microcontroller", type=ProductType.RAW,
                source=SourceType.BUY, standard_cost=6.5, lead_time_days=21,
                moq=500, order_multiple=100, supplier_id="SUP-CHIP",
                safety_stock=SafetyStockPolicy(value=300)),
        Product(id="SEN-1", sku="SEN-1", name="Sensor Chip", type=ProductType.RAW,
                source=SourceType.BUY, standard_cost=3.2, lead_time_days=28,
                moq=1000, order_multiple=500, supplier_id="SUP-CHIP",
                safety_stock=SafetyStockPolicy(value=800)),
        Product(id="SEN-1B", sku="SEN-1B", name="Sensor Chip (alt, fast lead)", type=ProductType.RAW,
                source=SourceType.BUY, standard_cost=3.6, lead_time_days=7,
                moq=500, order_multiple=250, supplier_id="SUP-MECH",
                safety_stock=SafetyStockPolicy(value=200)),
        Product(id="ENC-1", sku="ENC-1", name="Enclosure", type=ProductType.RAW,
                source=SourceType.BUY, standard_cost=4.0, lead_time_days=14,
                moq=200, order_multiple=100, supplier_id="SUP-MECH",
                safety_stock=SafetyStockPolicy(value=200)),
        Product(id="PCB-B", sku="PCB-B", name="PCB Blank", type=ProductType.RAW,
                source=SourceType.BUY, standard_cost=2.1, lead_time_days=14,
                moq=500, order_multiple=250, supplier_id="SUP-MECH",
                safety_stock=SafetyStockPolicy(value=400)),
    ]

    boms = [
        BOM(parent_id="SS-100", output_qty=1, components=[
            BOMComponent(component_id="PCB-A", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="ENC-1", quantity_per=1, scrap_rate=0.01),
            BOMComponent(component_id="SEN-1", quantity_per=2, scrap_rate=0.03, priority=1,
                         alternates=[
                             AlternateComponent(component_id="SEN-1B", priority=2,
                                                conversion_factor=1.0, cost_delta=0.4),
                         ]),
        ]),
        BOM(parent_id="SH-200", output_qty=1, components=[
            BOMComponent(component_id="PCB-A", quantity_per=1, scrap_rate=0.02),
            BOMComponent(component_id="ENC-1", quantity_per=1, scrap_rate=0.01),
        ]),
        BOM(parent_id="PCB-A", output_qty=1, components=[
            BOMComponent(component_id="PCB-B", quantity_per=1, scrap_rate=0.05),
            BOMComponent(component_id="MCU-1", quantity_per=1, scrap_rate=0.01),
        ]),
    ]

    # Capacity deliberately tightened so peak-demand weeks exceed regular hours,
    # forcing a real tradeoff: build ahead (inventory/cash tie-up) vs overtime.
    resources = [
        Resource(id="SMT", name="SMT Line", cost_per_hour=85, hours_per_period=14,
                 overtime_cost_per_hour=128, max_overtime_hours=6),
        Resource(id="ASSY", name="Assembly Cell", cost_per_hour=45, hours_per_period=30,
                 overtime_cost_per_hour=68, max_overtime_hours=10),
    ]

    # run times in minutes per unit
    routings = [
        RoutingOp(product_id="PCB-A", resource_id="SMT", run_time_per_unit_min=1.5, setup_time_min=45),
        RoutingOp(product_id="SS-100", resource_id="ASSY", run_time_per_unit_min=4.0, setup_time_min=30),
        RoutingOp(product_id="SH-200", resource_id="ASSY", run_time_per_unit_min=3.0, setup_time_min=30),
    ]

    suppliers = [
        Supplier(id="SUP-CHIP", name="GlobalChip Co", payment_terms_days=45, reliability=0.95),
        Supplier(id="SUP-MECH", name="MechParts Ltd", payment_terms_days=30, reliability=0.99),
    ]

    inventory = [
        InventoryRecord(product_id="SS-100", on_hand_qty=120),
        InventoryRecord(product_id="SH-200", on_hand_qty=60),
        InventoryRecord(product_id="PCB-A", on_hand_qty=80),
        InventoryRecord(product_id="MCU-1", on_hand_qty=600),
        InventoryRecord(product_id="SEN-1", on_hand_qty=1200),
        InventoryRecord(product_id="SEN-1B", on_hand_qty=0),
        InventoryRecord(product_id="ENC-1", on_hand_qty=300),
        InventoryRecord(product_id="PCB-B", on_hand_qty=700),
    ]

    scheduled_receipts = [
        ScheduledReceipt(product_id="MCU-1", period_index=2, qty=500),
        ScheduledReceipt(product_id="SEN-1", period_index=3, qty=1000),
    ]

    # 12-week ramping forecast
    ss_demand = [200, 220, 240, 260, 280, 300, 300, 320, 340, 340, 360, 380]
    sh_demand = [120, 130, 140, 150, 150, 160, 170, 180, 180, 190, 200, 210]
    forecast = []
    for t in range(12):
        forecast.append(ForecastEntry(product_id="SS-100", period_index=t, quantity=ss_demand[t]))
        forecast.append(ForecastEntry(product_id="SH-200", period_index=t, quantity=sh_demand[t]))

    financials = FinancialParams(
        discount_rate_annual=0.12,
        target_cash_balance=50000,
        opening_cash=250000,
        overhead_per_period=8000,
    )

    return PlanningDataset(
        horizon_periods=12,
        bucket=Bucket.WEEK,
        period_start=date(2026, 6, 8),
        products=products,
        boms=boms,
        resources=resources,
        routings=routings,
        suppliers=suppliers,
        inventory=inventory,
        scheduled_receipts=scheduled_receipts,
        forecast=forecast,
        financials=financials,
    )
