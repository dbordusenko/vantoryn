# APS Module Specification for Vantoryn
### "APS Production & Supply Optimizer" — Advanced Planning & Scheduling Engine

> **Версия:** 1.0
> **Класс системы:** Constraint-Based Finite Capacity Planning (аналог Kinaxis RapidResponse / PlanetTogether / Siemens Opcenter APS)
> **Парадигма:** Mathematical Optimization (MILP/CP-SAT) + Heuristics + LLM-driven reasoning
> **Интеграция:** нативная связь с финансовым ядром Vantoryn (Cash Flow, Budgeting, P&L Forecast)

---

## 0. Executive Summary

`APS Production & Supply Optimizer` — это автономный планировочный агент, который превращает **план продаж** в исполнимый, ограничениями-выверенный (constraint-feasible) и **финансово-оптимальный** план производства и снабжения.

Ключевое отличие от классических APS (Kinaxis, CyberPlan): движок не просто минимизирует производственные издержки, а оптимизирует **связанный оборотный капитал (cash tie-up)** и **NPV денежного потока**, потому что работает внутри финансовой ОС. Это «финансово-осознанный APS».

Три слоя интеллекта:
1. **Optimization Core** — детерминированный решатель (MILP / CP-SAT) для математически формализуемых задач.
2. **Heuristic Layer** — метаэвристики (GA, Tabu Search, Simulated Annealing) для NP-трудных задач большого размера (детальное расписание, sequencing).
3. **LLM Reasoning Layer** — интерпретация результатов, генерация рекомендаций, what-if на естественном языке, разрешение конфликтов данных.

---

## 1. Общая архитектура модуля

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VANTORYN FRONTEND (React 18 + Vite)           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│  │  Demand    │ │   MPS /    │ │  Gantt /   │ │  Cash Flow         │  │
│  │  Planner   │ │   MRP      │ │  Pegging   │ │  Waterfall + KPI   │  │
│  │  Workbench │ │  Workbench │ │  Scheduler │ │  Scenario Compare  │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │
│         │  (REST / WebSocket — live re-plan progress)                   │
└─────────┼──────────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────────────┐
│                    APS ORCHESTRATION API (FastAPI / Python)              │
│  /plan/run  /plan/scenario  /plan/whatif  /plan/adjust  /plan/explain    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    PLANNING PIPELINE (Rolling Horizon)             │  │
│  │  ① Demand Aggregation → ② MPS → ③ MRP-II (finite) → ④ Detailed     │  │
│  │     Scheduling → ⑤ Capacity/Bottleneck → ⑥ Procurement →           │  │
│  │     ⑦ Financial Impact Simulation                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Optimization │  │  Heuristic   │  │  LLM Reasoning│  │  Scenario   │  │
│  │ Core         │  │  Engine      │  │  Layer        │  │  Manager    │  │
│  │ OR-Tools     │  │  GA/Tabu/SA  │  │  (Groq/Claude)│  │  (Pareto)   │  │
│  │ CP-SAT/MILP  │  │  DEAP        │  │               │  │             │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└─────────┼────────────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────────────┐
│           DATA LAYER (Supabase / PostgreSQL + Redis cache)              │
│  Master Data: Products, BOM, Routing, Resources, Materials, Suppliers   │
│  Transactional: Inventory, Open POs/MOs, Sales Forecast                 │
│  Results: Plan Versions, Scenarios, Pegging, Cash Projections           │
│                                                                          │
│  ┌───────────────── FINANCIAL CORE INTEGRATION BUS ─────────────────┐   │
│  │  Cash Flow Engine ◄──► Budgeting ◄──► P&L Forecast ◄──► Working   │   │
│  │  Capital model (DSO/DPO/DIO)                                       │   │
│  └───────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Технологический стек

| Слой | Технология | Обоснование |
|------|-----------|-------------|
| Frontend | React 18 + Vite (как у Vantoryn), `lucide-react`, hand-coded SVG Gantt/charts | согласован со стеком ОС |
| API | **FastAPI** (Python 3.12), Pydantic v2, async | math-стек живёт в Python |
| Optimization | **Google OR-Tools** (CP-SAT, MILP), **PuLP** (быстрые LP), SCIP/CBC backend | CP-SAT — лучший open-source решатель для scheduling |
| Heuristics | **DEAP** (GA), кастомный Tabu/SA | для задач, где MILP не масштабируется |
| LLM | Groq (llama-3.3-70b) / Claude — explainability + NL what-if | reasoning слой |
| Data | Supabase Postgres + **Redis** (кэш промежуточных решений) | RLS-hardening как в Vantoryn-agent |
| Async jobs | **Celery + Redis** или RQ — длинные оптимизации в фоне | план может считаться минуты |
| Export | `openpyxl` (Excel), `weasyprint`/`reportlab` (PDF) | требование п.8 |

---

## 2. Data Model (TypeScript / JSON Schema)

> Все сущности используют `id: string` (UUID), `tenantId` для мульти-тенантности и RLS, `version` для optimistic locking.

### 2.1 Product (с иерархией)

```typescript
interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  type: 'FG' | 'WIP' | 'RAW' | 'PHANTOM';   // готовое / полуфабрикат / сырьё / фантом
  uom: string;                               // base unit of measure
  productFamily?: string;                    // для агрегации спроса
  parentId?: string;                         // иерархия продуктов
  abcClass?: 'A' | 'B' | 'C';                // ABC-классификация
  xyzClass?: 'X' | 'Y' | 'Z';                // по вариативности спроса
  shelfLifeDays?: number;                    // shelf life (пищевка/химия)
  lotControlled: boolean;                    // batch/lot traceability
  standardCost: number;                      // нормативная себестоимость
  sellingPrice?: number;
  planningStrategy: 'MTS' | 'MTO' | 'ATO' | 'ETO'; // make-to-stock/order/...
  safetyStock?: SafetyStockPolicy;
}

interface SafetyStockPolicy {
  method: 'STATIC' | 'DAYS_OF_SUPPLY' | 'STATISTICAL'; // фикс / дни / σ-based
  value: number;                             // шт. или дни
  serviceLevel?: number;                     // 0.95 → z-score для статистики
}
```

### 2.2 BOM (многоуровневый, alternates, scrap)

```typescript
interface BOM {
  id: string;
  tenantId: string;
  parentProductId: string;
  bomType: 'PRIMARY' | 'ALTERNATE';
  priority: number;                          // 1 = основной, 2+ = заменители
  validFrom: string;                         // ISO date — engineering change control
  validTo?: string;
  outputQty: number;                         // сколько единиц даёт 1 прогон
  components: BOMComponent[];
}

interface BOMComponent {
  componentProductId: string;
  quantityPer: number;                       // коэффициент расхода на outputQty
  scrapRate: number;                         // 0.02 = 2% брак → gross = net/(1-scrap)
  isPhantom: boolean;                        // фантомные узлы «протекают» вверх
  operationSeq?: number;                     // на какой операции потребляется
  alternates?: AlternateComponent[];         // допустимые замены
  leadTimeOffsetDays?: number;               // смещение потребления внутри MO
}

interface AlternateComponent {
  componentProductId: string;
  conversionFactor: number;                  // 1.0 = 1:1 замена
  priority: number;
  costDelta?: number;                        // разница в стоимости при замене
}
```

### 2.3 Routing (технологические маршруты)

```typescript
interface Routing {
  id: string;
  tenantId: string;
  productId: string;
  bomId?: string;                            // связка BOM↔Routing
  priority: number;                          // alternate routings
  operations: Operation[];
}

interface Operation {
  seq: number;                               // 10, 20, 30...
  name: string;
  workCenterId: string;                      // ресурс/группа ресурсов
  setupTimeMin: number;                      // время переналадки (sequence-dependent — см. ниже)
  runTimePerUnitMin: number;                 // штучное время
  queueTimeMin?: number;                     // межоперационное ожидание
  moveTimeMin?: number;
  overlapAllowed?: boolean;                  // operation overlapping (lap phasing)
  tooling?: string[];                        // требуемый инструмент (вторичные ресурсы)
  laborSkillRequired?: string;               // требуемая квалификация
  yieldRate?: number;                        // выход годного на операции
  setupMatrix?: Record<string, number>;      // sequence-dependent setup: fromProduct→minutes
}
```

### 2.4 Resource (мощности + календари)

```typescript
interface Resource {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'MACHINE' | 'LINE' | 'LABOR' | 'TOOL' | 'CELL';
  workCenterId: string;
  capacityType: 'FINITE' | 'INFINITE';       // finite capacity scheduling
  parallelCapacity: number;                  // сколько MO одновременно (станков в группе)
  efficiency: number;                        // 0.85 = 85% OEE-фактор
  costPerHour: number;                       // прямые затраты (→ в P&L и cash)
  overtimeCostPerHour?: number;
  maxOvertimeHrsPerDay?: number;
  calendar: ResourceCalendar;
}

interface ResourceCalendar {
  id: string;
  timezone: string;
  shifts: Shift[];                           // рабочие смены по дням недели
  holidays: string[];                        // ISO dates — простои
  plannedMaintenance: TimeWindow[];          // окна ТОиР
  availabilityOverrides?: AvailabilityOverride[]; // ручные корректировки
}

interface Shift {
  dayOfWeek: 0|1|2|3|4|5|6;
  startTime: string;                         // "08:00"
  endTime: string;                           // "16:30"
  breakMinutes: number;
}
```

### 2.5 Material (lead time, MOQ/EOQ, suppliers)

```typescript
interface Material {
  id: string;
  tenantId: string;
  productId: string;                         // ссылка на Product type=RAW
  procurementType: 'BUY' | 'MAKE';
  leadTimeDays: number;                      // plan lead time
  leadTimeVariabilityDays?: number;          // σ для safety lead time
  moq: number;                               // minimum order quantity
  orderMultiple?: number;                    // кратность партии (rounding value)
  eoq?: number;                              // economic order quantity (расчётный)
  safetyStock: SafetyStockPolicy;
  shelfLifeDays?: number;
  suppliers: SupplierLink[];
  defaultSupplierId: string;
}

interface SupplierLink {
  supplierId: string;
  priority: number;
  unitPrice: number;
  currency: string;
  priceBreaks?: PriceBreak[];                // объёмные скидки
  leadTimeDays: number;
  moq: number;
  reliability?: number;                      // 0.98 on-time score → risk
}

interface PriceBreak { minQty: number; unitPrice: number; }
```

### 2.6 Inventory (по складам, по статусам)

```typescript
interface InventoryRecord {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  status: 'RAW' | 'WIP' | 'FG' | 'QUARANTINE' | 'IN_TRANSIT';
  onHandQty: number;
  allocatedQty: number;                      // зарезервировано под заказы
  availableQty: number;                      // onHand - allocated
  lots?: LotRecord[];                        // для lot-traceability + FEFO
  valuationПerUnit: number;                  // для расчёта связанного капитала
}

interface LotRecord {
  lotId: string;
  qty: number;
  expiryDate?: string;                       // FEFO для shelf-life
  receivedDate: string;
}
```

### 2.7 SalesForecast (драйвер всего плана)

```typescript
interface SalesForecast {
  id: string;
  tenantId: string;
  productId: string;
  bucket: 'WEEK' | 'MONTH';
  periodStart: string;                       // ISO date — начало корзины
  quantity: number;                          // базовый прогноз
  scenarios?: ForecastScenario[];            // вероятностные варианты
  confidence?: number;                       // 0–1
  demandType: 'INDEPENDENT' | 'DEPENDENT';   // independent — на уровне FG
  customerId?: string;                       // для customer-specific payment terms
}

interface ForecastScenario {
  name: 'BASE' | 'OPTIMISTIC' | 'PESSIMISTIC' | string;
  quantity: number;
  probability: number;                       // веса для expected value
}
```

### 2.8 SupplierContract (для cash-out)

```typescript
interface SupplierContract {
  id: string;
  tenantId: string;
  supplierId: string;
  paymentTermsDays: number;                  // DPO: net-30/45/60
  paymentSchedule?: 'NET' | 'EOM' | 'INSTALLMENTS';
  earlyPaymentDiscount?: { days: number; pct: number }; // 2/10 net 30
  minOrderValue?: number;
  annualVolumeCommitment?: number;
  currency: string;
}
```

### 2.9 Output: PlanResult / Pegging / CashProjection

```typescript
interface PlanResult {
  id: string;
  tenantId: string;
  scenarioId: string;
  horizonStart: string;
  horizonEnd: string;
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE' | 'TIMEOUT';
  objectiveValues: Record<string, number>;  // {totalCost, cashTieUp, otd, setupTime}
  mps: MPSEntry[];
  purchasePlan: PurchaseOrder[];
  productionSchedule: ScheduledOperation[];
  cashProjection: CashFlowPoint[];
  risks: RiskAlert[];
  kpis: PlanKPIs;
}

interface MPSEntry {
  productId: string;
  periodStart: string;
  plannedQty: number;
  sourceType: 'MAKE' | 'BUY';
  netRequirement: number;
  projectedOnHand: number;                   // ending inventory
}

interface PeggingLink {                      // material pegging — трассировка
  demandId: string;                          // от какого спроса
  supplyId: string;                          // каким supply покрыт
  productId: string;
  qty: number;
  level: number;                             // уровень BOM
}

interface CashFlowPoint {
  date: string;
  cashIn: number;                            // collections от продаж
  cashOut: number;                           // оплата поставщикам + labor + overhead
  netCash: number;
  cumulativeCash: number;
  breakdown: {
    materialPurchases: number;
    directLabor: number;
    overhead: number;
    salesCollections: number;
  };
}
```

---

## 3. Входные данные и pipeline

| # | Вход | Источник | Обязательность |
|---|------|----------|----------------|
| 1 | Sales Forecast | Demand Planner / интеграция CRM (Salesforce/HubSpot из Vantoryn) | ✅ драйвер |
| 2 | Остатки складов | Inventory (ERP-интеграция: SAP/NetSuite) | ✅ |
| 3 | Открытые PO/MO | ERP | ✅ |
| 4 | BOM + Routing | Master Data | ✅ |
| 5 | Календари ресурсов | Master Data | ✅ |
| 6 | Стоимости (ресурс/материал) | Cost structure + Vantoryn Budgeting | ✅ |
| 7 | Финансовые параметры | Vantoryn Financial Core (discount rate, target cash) | ✅ |

---

## 4. Функциональные блоки

### ① Demand Planning & Aggregation
- Консолидация прогноза по уровням (SKU → family → site).
- **Demand netting:** вычитание доступных запасов и открытых заказов.
- **Forecast consumption:** фактические заказы «съедают» прогноз (avoid double-counting).
- Применение вероятностных сценариев → expected demand = Σ(qty × probability).
- LLM-слой: обнаружение аномалий прогноза, объяснение скачков.

### ② Master Production Scheduling (MPS)
- Расчёт по периодам: `Net Req = Gross Demand − Projected On-Hand − Scheduled Receipts + Safety Stock`.
- Lot-sizing на уровне MPS: **Wagner-Whitin** (оптимальный динамический lot-sizing) или Silver-Meal эвристика.
- Привязка к стратегии (MTS/MTO/ATO).
- Time-fence логика: frozen / slushy / liquid зоны горизонта.

### ③ MRP-II с finite capacity
- Многоуровневый BOM explosion (до 10 уровней) — **low-level coding** для корректного порядка обсчёта.
- Расчёт gross→net по уровням с учётом scrap и yield.
- **Главное отличие от классического MRP:** не «infinite capacity», а сразу проверка на конечной мощности через CRP (Capacity Requirements Planning). Перегруженные периоды → перенос/overtime/alternate routing.

### ④ Detailed Scheduling (Sequencing + Setup optimization)
- Finite Capacity Scheduling на уровне операций.
- **Sequence-dependent setup minimization** (setup matrix) — это TSP-подобная задача → CP-SAT или GA.
- Правила диспетчеризации как warm-start: EDD, SPT, Critical Ratio, slack-based.
- Operation overlapping / lap phasing для сжатия lead time.

### ⑤ Capacity Planning & Bottleneck Detection
- Расчёт загрузки каждого work center: `Load% = required_hrs / available_hrs`.
- **Theory of Constraints:** определение узкого места (drum), buffer management, DBR (Drum-Buffer-Rope).
- Heatmap загрузки по ресурсам × периодам.

### ⑥ Procurement Planning
- Lot-sizing закупок: EOQ / MOQ / order multiple / price breaks.
- Расчёт дат заказа: `Order Date = Need Date − Lead Time − Safety Lead Time`.
- Выбор поставщика: multi-criteria (цена × надёжность × lead time × payment terms).
- Учёт объёмных скидок и early-payment discount в финансовой оптимизации.

### ⑦ Financial Impact Simulation
- См. раздел 6.

---

## 5. Алгоритмы и оптимизация

### 5.1 Распределение задач по решателям

| Задача | Метод | Инструмент | Почему |
|--------|-------|-----------|--------|
| Lot-sizing (single-level) | Wagner-Whitin DP / Silver-Meal | custom Python | полиномиально, точно |
| MPS/MRP capacity-feasible | **MILP** | OR-Tools (CBC/SCIP) или PuLP | линейные ограничения мощности |
| Job-shop / flow-shop scheduling | **CP-SAT** | OR-Tools CP-SAT | лучший для disjunctive scheduling |
| Sequence-dependent setup | CP-SAT (circuit constraint) / **GA** | OR-Tools / DEAP | TSP-подобное |
| Multi-objective (Pareto) | **NSGA-II** | DEAP | недоминируемый фронт |
| Очень большие инстансы | Tabu / Simulated Annealing | custom | когда exact не сходится за SLA |

### 5.2 MILP-формулировка ядра (упрощённо)

**Множества:** продукты `p`, периоды `t`, ресурсы `r`, поставщики `s`.

**Переменные решения:**
- `X[p,t]` — объём производства продукта p в периоде t (≥0)
- `Y[p,t]` ∈ {0,1} — индикатор запуска партии (для setup cost)
- `I[p,t]` — запас на конец периода (≥0)
- `B[p,t]` — backorder/дефицит (≥0)
- `Q[p,s,t]` — объём закупки у поставщика s
- `O[r,t]` — overtime-часы на ресурсе r

**Целевая функция (взвешенная мультицель):**

```
minimize  Z = w₁·Σ(h[p]·I[p,t])          // inventory holding cost
            + w₂·Σ(setup[p]·Y[p,t])        // setup cost
            + w₃·Σ(otCost[r]·O[r,t])       // overtime
            + w₄·Σ(stockout[p]·B[p,t])      // дефицит/потерянные продажи
            + w₅·CASH_TIE_UP                // связанный оборотный капитал (NPV-weighted)
```

**Ключевые ограничения:**

```
// 1. Баланс запасов (inventory balance)
I[p,t] = I[p,t-1] + X[p,t] + Σ_s Q[p,s,t-LT] − Demand[p,t] − DependentDemand[p,t] + B[p,t] − B[p,t-1]

// 2. Конечная мощность ресурса
Σ_p (runTime[p,r]·X[p,t] + setupTime[p,r]·Y[p,t]) ≤ availableHrs[r,t] + O[r,t]

// 3. Overtime cap
O[r,t] ≤ maxOvertime[r,t]

// 4. Связь запуска партии (Big-M)
X[p,t] ≤ M·Y[p,t]

// 5. MOQ / order multiple
Q[p,s,t] ≥ MOQ[p,s]·Z_order[p,s,t]
Q[p,s,t] = orderMultiple · k   (целочисленное k)

// 6. Зависимый спрос через BOM
DependentDemand[c,t] = Σ_parent (quantityPer[c,parent]/(1−scrap)) · X[parent,t]

// 7. Cash tie-up (связь с финансовым ядром)
CASH_TIE_UP = Σ_t discount(t) · (valuation·I[p,t] + WIP_value[t])
```

### 5.3 Rolling Horizon Planning
- Горизонт делится на **frozen / firm / free** зоны.
- Перепланирование с шагом (например, еженедельно) с переносом фактического состояния.
- Frozen-зона не меняется (стабильность для цеха), free-зона полностью переоптимизируется.

### 5.4 Multi-objective (Pareto)
- NSGA-II генерирует фронт недоминируемых решений по осям: `[Total Cost, Cash Tie-Up, OTD, Setup Time]`.
- Пользователь двигает веса слайдерами → выбирает точку на фронте.
- Выдаём 3–5 «характерных» решений: *Min Inventory*, *Min Cash*, *Max Profit*, *Max OTD*, *Balanced*.

### 5.5 Псевдокод оркестрации

```python
def run_aps_plan(tenant_id, scenario, weights, time_limit_s=120):
    data = load_planning_data(tenant_id)            # master + transactional
    demand = aggregate_demand(data.forecast, data.inventory, data.open_orders)

    mps = solve_mps(demand, data, lot_sizing="wagner_whitin")
    mrp = explode_bom_finite(mps, data.boms, data.routings,
                             data.resources)         # low-level coding

    # детальное расписание — CP-SAT, warm-start эвристикой
    schedule = solve_scheduling_cpsat(
        mrp.production_orders, data.resources,
        objective="min_makespan_and_setup",
        warm_start=dispatch_rule(mrp, rule="critical_ratio"),
        time_limit=time_limit_s,
    )

    purchase = plan_procurement(mrp.material_reqs, data.materials,
                                data.supplier_contracts)

    cash = simulate_cash_flow(purchase, schedule, demand,
                              data.financial_params)  # → Vantoryn core

    risks = detect_risks(mrp, schedule, cash)         # shortages, bottlenecks
    recommendations = llm_explain(plan=(mps, mrp, schedule, cash, risks))

    return PlanResult(mps, purchase, schedule, cash, risks, recommendations)
```

---

## 6. Интеграция с Cash Flow (ядро ценности)

Модуль строит **точный посуточный/понедельный денежный поток**, связывая три графика:

### 6.1 Cash-Out
```
Закупки:  для каждого PO →
   payment_date = receipt_date + supplierContract.paymentTermsDays
   amount = qty × unitPrice  (с учётом price breaks)
   если early-payment discount выгоднее cost of capital → платим раньше

Производство:
   direct_labor = Σ scheduled_hrs × costPerHour  (по дате операции)
   overhead = allocation по драйверу (machine-hrs)
```

### 6.2 Cash-In
```
Отгрузки:  shipment_date из MPS/FG-готовности →
   collection_date = shipment_date + customerDSO (payment terms клиента)
   amount = qty × sellingPrice
```

### 6.3 Выход
- `CashFlowPoint[]` по дням/неделям с breakdown (purchases / labor / overhead / collections).
- **Cash Flow Waterfall** визуализация.
- **Working Capital модель:** DIO (запасы) + DSO (дебиторка) − DPO (кредиторка) = Cash Conversion Cycle.
- Alert: «План пробивает target cash balance в неделе W → рекомендации (сдвинуть закупки, увеличить DPO, перенести MO)».

### 6.4 Bidirectional с финядром Vantoryn
| Vantoryn модуль | Направление | Что обменивается |
|-----------------|-------------|------------------|
| **Cash Flow Engine** | APS → Core | прогноз cash-in/out из плана |
| **Budgeting** | Core → APS | бюджетные лимиты OPEX/CAPEX как ограничения |
| **P&L Forecast** | APS → Core | прогноз COGS, gross margin из плана производства |
| **Working Capital** | APS ↔ Core | DIO/DSO/DPO целевые ↔ фактические из плана |

---

## 7. Выходные результаты

1. **MPS** — таблица: продукт × период × план / net req / projected on-hand.
2. **Purchase Plan** — что / сколько / когда / у кого / по какой цене / дата оплаты.
3. **Detailed Production Schedule** — по операциям с временами начала/конца на ресурсах.
4. **Resource Utilization Dashboard** — heatmap загрузки, bottleneck-маркеры.
5. **Cash Flow Forecast** — интегрированный, с waterfall и breakdown.
6. **Risk Report** — дефициты, перегрузы, срывы сроков, риск поставщиков, shelf-life риски.
7. **Optimization Scenarios** — 3–5 вариантов с KPI-сравнением (Pareto).
8. **Actionable Recommendations** (LLM) — «замени материал X на Y (−$12K cash, +2 дня)», «перенеси MO-204 на след. неделю → снимет bottleneck на Line-3».

---

## 8. Визуализация (frontend, в стиле Vantoryn dark theme)

| Виджет | Реализация |
|--------|-----------|
| **Gantt Chart** | hand-coded SVG (как charts в Product.jsx), drag-to-adjust → авто-replan |
| **Material Pegging Tree** | разворачиваемое дерево demand→supply по уровням BOM |
| **Capacity Heatmap** | grid ресурс × период, цвет = load% (green→amber→red из tokens.js) |
| **Cash Flow Waterfall** | SVG bars: cash-in/out/cumulative |
| **Scenario Compare** | radar/bar chart по KPI осям |

---

## 9. User Flow внутри Vantoryn

```
1. Product → новая вкладка "Production Planning" (рядом с Forecasting/Reports)
2. [Demand] Импорт/просмотр Sales Forecast → выбор сценария (Base/Opt/Pess)
3. [Setup] Проверка master data (BOM/Routing/Resources) — health-check с LLM-валидацией
4. [Configure] Слайдеры весов целевой функции:
      Min Inventory ←———○———→ Max Service Level
      Min Cash Tie-Up ←——○——→ Min Total Cost
5. [Run] Запуск оптимизации → progress через WebSocket (Demand→MPS→MRP→Schedule→Cash)
6. [Review] Дашборды: MPS / Gantt / Capacity / Cash Flow / Risks
7. [Compare] Pareto-сценарии — выбор лучшего по KPI
8. [Adjust] Ручная правка (drag MO на Gantt) → авто-replan затронутой части
9. [Approve] Фиксация версии плана → публикация в ERP + обновление Vantoryn Cash Forecast
10.[Export] Excel / PDF / API
```

---

## 10. API (ключевые эндпоинты)

```
POST /api/aps/plan/run            { scenarioId, weights, horizon }   → jobId
GET  /api/aps/plan/{jobId}/status                                    → progress
GET  /api/aps/plan/{jobId}/result                                    → PlanResult
POST /api/aps/plan/scenario       { baseId, overrides }              → scenario
POST /api/aps/plan/whatif         { planId, changes[], nlQuery? }    → delta + cash impact
POST /api/aps/plan/adjust         { planId, manualMove }             → repaired plan
POST /api/aps/plan/explain        { planId, question }               → LLM answer
POST /api/aps/export              { planId, format: xlsx|pdf }       → file
```

---

## 11. Нефункциональные требования

- **Производительность:** план на 5K SKU / 50 ресурсов / 26 недель ≤ 2 мин (CP-SAT с time-limit + warm-start).
- **Масштаб BOM:** до 10 уровней, low-level coding.
- **Traceability:** lot/batch pegging, FEFO для shelf-life.
- **Безопасность:** RLS на tenantId (как Vantoryn-agent), секреты через env, SSL.
- **Аудит:** версионирование планов, кто/когда/что менял.
- **Explainability:** каждое решение объяснимо (LLM-слой + pegging).

---

## 12. Дорожная карта (фазы)

| Фаза | Содержание | Срок |
|------|-----------|------|
| **MVP** | Demand→MPS→MRP (infinite cap) + базовый Cash Flow + таблицы | 4–6 нед |
| **V1** | Finite capacity (CRP) + Capacity heatmap + Procurement + Pareto (2 цели) | +6 нед |
| **V2** | CP-SAT detailed scheduling + Gantt + sequence-dependent setup | +8 нед |
| **V3** | Multi-objective NSGA-II + What-if NL + ручной replan + Export | +6 нед |
| **V4** | Shelf-life/lot, supplier risk, rolling horizon автоматизация | +ongoing |
```
