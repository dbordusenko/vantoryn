# Vantoryn APS — Client Demo Script
### "Production & Supply Optimizer" — live walkthrough (≈10 min)

> **Setup before the call:** open https://vantoryn.vercel.app → log in → **Production Planning** tab.
> Backend is live (`https://192.18.131.82.sslip.io/aps`) — status line should read **"live backend"**.
> The demo company is a **mid-size IoT electronics manufacturer**: 4 products, 2 sub-assemblies,
> 11 materials, 3 production lines, 12-week horizon.

---

## The one-sentence pitch

> "Vantoryn turns your sales forecast into an executable, capacity-checked production and
> purchasing plan — and shows the exact cash impact before you commit a single dollar."

---

## Demo flow (what to click → what to say)

### 1. Open the tab — set the scene  *(1 min)*
**Click:** Production Planning.
**Say:**
> "This is the same engine an APS like Kinaxis runs — but wired directly into the financial core.
> Top row: total plan cost, **cash tied up in inventory**, peak capacity load, on-time delivery,
> and the lowest cash balance we'll hit. Everything you see was computed live from the forecast,
> bills of material, machine capacities and supplier terms."

Point at the KPI cards:
- **On-time delivery: 100%** → "We can meet the entire demand plan."
- **Peak capacity load: ~106%** → "But we're pushing a line past its limit — let's see where."

### 2. Capacity heatmap — find the bottleneck  *(2 min)*
**Point at:** the heatmap, weeks 7–10 on the **SMT line** turning amber/red.
**Say:**
> "Green is comfortable, red is overloaded. The system flags that the **SMT line tips over 100%
> in weeks 7 to 10** as demand ramps. A planner would discover this in a spreadsheet weeks too late —
> here it's surfaced instantly, per line, per week."

Hover a red cell → tooltip shows required vs available hours.

### 3. Risk alerts + recommendations — the AI value  *(2 min)*
**Point at:** the Risk panel on the right.
**Say:**
> "It doesn't just flag problems, it recommends actions. Two things to notice:"

1. **Substitution:**
   > "A key RF chip has a **35-day lead time** — too slow for the ramp. The optimizer automatically
   > switched ~770 units to a **faster 10-day alternate**, at a small premium, and tells you the exact
   > cost. No stockout, no manual expediting."

2. **Bottleneck recommendation:**
   > "It identifies the SMT line as a recurring constraint and suggests a second shift or load-leveling —
   > with the periods that need it."

### 4. Cash flow waterfall — the differentiator  *(2 min)*
**Point at:** the cash-flow chart, the dip in the middle, the target line.
**Say:**
> "This is what makes Vantoryn different from a pure planning tool. Every purchase order pays the
> supplier on their terms; every shipment collects from the customer 45–60 days later. The system
> weaves that into a **weekly cash forecast**. You can see exactly when cash dips and whether it
> stays above your target — *before* you place the orders."

### 5. Optimization sliders — run a scenario  *(2 min)*
**Do:** drag **"Min cash tie-up"** up → click **Run Optimization**.
**Say:**
> "Now the powerful part. These sliders are the business tradeoff. Let's tell it we care most about
> **freeing up working capital**."

When it re-runs, point at the KPI changes:
> "Watch the numbers move — **cash tied up drops**, but peak load rises because we're building
> leaner and closer to demand. Push **'Max service level'** instead and it builds a buffer — more
> cash tied up, but bulletproof delivery. Same data, different strategy, instant answer.
> This is a conversation the CFO and the Head of Operations can finally have on the *same screen*."

### 6. Close  *(30 sec)*
**Say:**
> "Forecast in, executable plan out — production schedule, purchase plan, capacity check, and the
> integrated cash forecast. Connected to your ERP, this runs every night on your real data and
> tells you each morning exactly what to build, what to buy, and what it does to your cash."

---

## The story beats to land (cheat sheet)

| Beat | KPI / element | The point |
|------|---------------|-----------|
| Plan is feasible | OTD 100% | We can meet demand |
| Hidden constraint | SMT 106% wks 7–10 | We catch bottlenecks early |
| Smart sourcing | RF-CHIP → RF-CHIP-B substitution | Auto-avoids stockouts |
| Financial truth | Cash waterfall vs target | Plan ↔ cash, not separate silos |
| Strategy in one click | Sliders re-run scenarios | CFO & Ops align on tradeoffs |

---

## Anticipated questions

**"Is this our real data?"**
> "This is a representative demo company. Connected to your ERP (SAP, NetSuite, etc. — already
> supported in the Integrations tab), it runs on your live BOMs, inventory and forecast."

**"How long to set up?"**
> "The engine is ready. Onboarding is mapping your master data — BOMs, routings, supplier terms.
> Typically a few weeks for a pilot product line."

**"What's the math?"**
> "A constraint-based optimizer (Google OR-Tools) for capacity and lot-sizing, plus heuristics for
> sequencing — the same class of methods as tier-1 APS systems, with the financial layer built in."

**"Can we change the plan manually?"**
> "Yes — on the roadmap is drag-to-adjust on a Gantt with automatic re-planning of the affected part."

---

## Reset between demos
If you edited data during a demo, restore the clean dataset:
```
POST https://192.18.131.82.sslip.io/aps/seed?force=true
```
