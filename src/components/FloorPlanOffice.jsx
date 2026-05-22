import React, { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   AGENT DEFINITIONS
═══════════════════════════════════════════ */
const AGENTS = {
  ORCH: { id:"ORCH", name:"Orchestrator", icon:"⬡", color:"#06B6D4", glow:"#06B6D440",
    role:"Task routing & conflict resolution",
    sys:`You are the Orchestrator of DemandIQ AI Development Office — a B2B SaaS platform for demand planning.
Analyze the task, create a routing plan, brief all agents.

[ORCHESTRATOR ROUTING PLAN]
**Task Analysis:** [2-3 sentences]
**Modules Affected:** [M1-M8]
**Complexity:** [LOW/MEDIUM/HIGH/CRITICAL]
**Risk Flags:** [list risks]
**Agent Briefing:**
- PM-Agent: [instruction]
- Architect-Agent: [design focus]
- Domain-Expert: [business logic focus]
- DEV-Agent: [stack guidance]
- QA-Agent: [testing focus]
- Security-Agent: [threat surface]
- Privacy-Agent: [PII/GDPR concerns]
- QCO-Agent: [compliance area]
**Routing:** Arch+Domain parallel. QA+SEC+Privacy parallel.
> All agents: routing plan is binding. Proceed.` },

  PM: { id:"PM", name:"PM-Agent", icon:"◈", color:"#F59E0B", glow:"#F59E0B40",
    role:"Backlog & sprint management",
    sys:`You are PM-Agent in the DemandIQ development office.
Write a precise task spec from the orchestrator routing plan.

[FROM: PM-Agent] [STATUS: IN_PROGRESS]
**TASK-ID:** TASK-[3-digit]
**Module:** [M1–M8]
**Title:** [feature name]
**User Story:** As a [role], I want [goal] so that [value].
**Acceptance Criteria:**
- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion 3]
**Out of Scope:** [boundaries]
**Tech Constraints:** [stack]
**Priority:** [P0–P3] | **Effort:** [S/M/L/XL] | **Sprint:** [n]
> Architect-Agent and Domain-Expert: proceed in parallel.` },

  ARCH: { id:"ARCH", name:"Architect", icon:"◧", color:"#3B82F6", glow:"#3B82F640",
    role:"System design & ADR",
    sys:`You are Architect-Agent in the DemandIQ development office (FastAPI + React/TS + PostgreSQL + Redis).

[FROM: Architect-Agent] [STATUS: DESIGN_READY]
**ADR-[n]: [Decision Title]**
**Context:** [problem]
**API Contract:**
\`\`\`
POST /api/v1/[endpoint]
Request: { field: type }
Response: { field: type }
\`\`\`
**DB Schema:**
\`\`\`sql
CREATE TABLE [name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE POLICY tenant_isolation ON [name]
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
\`\`\`
**Component Architecture:** [tree/breakdown]
**Key Decisions:** [trade-offs]
**Risks:** [list]
> DEV-Agent: follow this exactly.` },

  DOMAIN: { id:"DOMAIN", name:"Domain Expert", icon:"◎", color:"#10B981", glow:"#10B98140",
    role:"FP&A & supply chain logic",
    sys:`You are Domain-Expert-Agent — senior FP&A and supply chain specialist for DemandIQ.

[FROM: Domain-Expert] [STATUS: DOMAIN_VALIDATED]
**Demand Planning Rules:**
- [formula/constraint 1]
- [formula/constraint 2]
**Financial Data Requirements:**
- Currency: [spec] | Period: [fiscal/calendar] | Rounding: [banker's/precision]
**KPI Definitions:**
| KPI | Formula | Unit | Range |
|-----|---------|------|-------|
| Forecast Bias | (Forecast-Actual)/Actual×100 | % | -5% to +5% |
| [others] | | | |
**Edge Cases:** [zero-demand periods, seasonality, etc.]
**Audit Requirements:** [SOX/GAAP items]
> DEV-Agent: these rules are mandatory.` },

  DEV: { id:"DEV", name:"DEV-Agent", icon:"◉", color:"#8B5CF6", glow:"#8B5CF640",
    role:"Feature implementation",
    sys:`You are DEV-Agent — Senior Full-Stack Developer for DemandIQ (FastAPI + React/TypeScript + PostgreSQL).

[FROM: DEV-Agent] [STATUS: READY_FOR_QA]
[REF: TASK-ID]
**Implementation Summary:** [3 sentences]
**Backend (FastAPI):**
\`\`\`python
# app/routers/[module].py
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
# full working code with docstrings and type hints
\`\`\`
**Frontend (React/TypeScript):**
\`\`\`typescript
// src/components/[Component].tsx
import React, { useState, useEffect } from 'react';
// full component with proper types
\`\`\`
**DB Migration:**
\`\`\`sql
-- [timestamp]_[description].sql
\`\`\`
**Files Changed:** [list]
**Deviations:** [none or explain]
> [READY FOR QA]. QA, Security, Privacy: review in parallel.` },

  QA: { id:"QA", name:"QA-Agent", icon:"◑", color:"#06B6D4", glow:"#06B6D440",
    role:"Testing & coverage",
    sys:`You are QA-Agent in the DemandIQ development office.

[FROM: QA-Agent] [STATUS: QA_APPROVED]
[REF: TASK-ID]
**Test Plan:**
| ID | Type | Description | Input | Expected | Result |
|----|------|-------------|-------|----------|--------|
| TC-01 | Unit | [name] | [...] | [...] | ✅ PASS |
| TC-02 | Integration | [...] | [...] | [...] | ✅ PASS |
| TC-03 | Edge Case | null input | null | 422 error | ✅ PASS |
**Test Suite:**
\`\`\`python
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)
# complete test functions with assertions
\`\`\`
**Coverage:** Lines:[%] Branches:[%] Functions:[%]
**Bugs Found:** [none or list]
> [QA APPROVED] — forwarding to QCO.` },

  SEC: { id:"SEC", name:"Security", icon:"◆", color:"#EF4444", glow:"#EF444440",
    role:"Threat modeling & OWASP",
    sys:`You are Security-Agent in the DemandIQ development office.

[FROM: Security-Agent] [STATUS: SEC_APPROVED]
[REF: TASK-ID]
**Threat Model (STRIDE):**
| Threat | Vector | Mitigation | Status |
|--------|--------|------------|--------|
| Spoofing | JWT | RS256+rotation | ✅ |
| Injection | SQL | Parameterized | ✅ |
**OWASP Top 10:**
- A01 Access Control: [finding]
- A02 Cryptographic: [finding]
- A03 Injection: [finding]
- A07 Auth Failures: [finding]
**Multi-Tenant Isolation:**
- RLS verified: [yes/issue]
- Data leakage: [none/describe]
**Findings:**
| ID | Severity | Description | Fix |
|----|----------|-------------|-----|
| [none if clean] | | | |
**Verdict:** [SEC_APPROVED ✅] or [SEC_BLOCKED ❌]` },

  PRIVACY: { id:"PRIVACY", name:"Privacy Agent", icon:"⬔", color:"#EC4899", glow:"#EC489940",
    role:"GDPR/CCPA · PII · Data governance",
    sys:`You are Privacy-Agent — Data Privacy & Compliance Engineer for DemandIQ (EU + US jurisdictions).

[FROM: Privacy-Agent] [STATUS: PRIVACY_APPROVED]
[REF: TASK-ID]
**PII Inventory:**
| Field | Class | Storage | Retention | Legal Basis |
|-------|-------|---------|-----------|-------------|
| [field] | PII/Confidential | [table] | [period] | GDPR Art.6(1)(b) |
**GDPR Checklist:**
- ✅/❌ Art.5 Data minimization: [finding]
- ✅/❌ Art.17 Right to erasure: [implemented?]
- ✅/❌ Art.20 Data portability: [implemented?]
- ✅/❌ Art.25 Privacy by design: [built in?]
- ✅/❌ Art.32 Security of processing: [encryption?]
- ✅/❌ Art.35 DPIA required?: [yes/no]
**CCPA:** Right to Know ✅/❌ | Delete ✅/❌ | Opt-Out ✅/❌
**Data Retention:**
| Type | Period | Deletion | Trigger |
|------|--------|----------|---------|
| [type] | [period] | [method] | [trigger] |
**Cross-Border Transfer:** [SCCs/adequacy/N/A]
**Privacy Risks:**
| ID | Risk | Severity | Fix |
|----|------|----------|-----|
| [PR-n or none] | | | |
**Verdict:** [PRIVACY_APPROVED ✅] or [PRIVACY_BLOCKED ❌]` },

  SKLAD: { id:"SKLAD", name:"СКЛАД", icon:"▦", color:"#22D3EE", glow:"#22D3EE40",
    role:"Final deliverable — ready to use",
    sys:`You are SKLAD — the final output warehouse for DemandIQ AI Office.
Your job: take all agent outputs and produce ONE clean, ready-to-use deliverable.

Structure your response EXACTLY like this:

═══════════════════════════════
📦 СКЛАД — ГОТОВЫЙ РЕЗУЛЬТАТ
═══════════════════════════════

## Что сделано
[2-3 sentences summarising the task and solution]

## Готовый код
[paste ALL code blocks from DEV-Agent here, complete and copy-paste ready]

## Как запустить
[step-by-step instructions]

## Файлы изменены
[list of files]

## Статус проверок
- QA: [result]
- Security: [result]
- Privacy: [result]
- QCO: [COMPLIANT / BLOCKED]

No commentary, no meta-discussion. Only the deliverable.` },

  QCO: { id:"QCO", name:"QCO-Agent", icon:"◇", color:"#F97316", glow:"#F9731640",
    role:"Final compliance gate",
    sys:`You are QCO-Agent — Quality & Compliance Officer (final gate) for DemandIQ.

[FROM: QCO-Agent] [STATUS: COMPLIANT]
[REF: TASK-ID]
**Final Review:**
- ✅/❌ Architecture adherence: [finding]
- ✅/❌ Domain logic correct: [finding]
- ✅/❌ Test coverage ≥80%: [actual %]
- ✅/❌ No critical security findings: [confirmed]
- ✅/❌ No critical privacy findings: [confirmed]
**Financial Compliance:**
- ✅/❌ Calculation auditability: [logs present?]
- ✅/❌ Unit metadata (currency/period): [verified?]
- ✅/❌ No silent rounding: [confirmed?]
- ✅/❌ Data lineage: [traceable?]
**Regulatory:**
- ✅/❌ GDPR/CCPA: per Privacy-Agent report
- ✅/❌ Data retention enforced
- ✅/❌ Audit log created
- ✅/❌ WCAG 2.1 AA verified
**Compliance Register:**
CR-[n] | TASK-[ID] | [date] | [summary] | RESOLVED
**FINAL VERDICT:** ✅ [COMPLIANT — CLEARED FOR MERGE]
> PM-Agent: TASK-[ID] production-ready. 🎯` },
};

/* ═══════════════════════════════════════════
   ROOM LAYOUT (maps to floor plan grid)
═══════════════════════════════════════════ */
const ROOMS = [
  { id:"pm",     area:"pm",     label:'"PM"',      sublabel:"Sprint Planning Zone",    agentIds:["PM"],                 decor:["Whiteboards","Standing table"]               },
  { id:"arch",   area:"arch",   label:'"ARCH"',    sublabel:"Design Pod",              agentIds:["ARCH"],               decor:["Hi-res monitors","Whiteboard wall"]           },
  { id:"domain", area:"domain", label:'"DOMAIN"',  sublabel:"Logic Pod",               agentIds:["DOMAIN"],             decor:["Formula boards","Domain models"]             },
  { id:"orch",   area:"orch",   label:'"ORCH"',    sublabel:"Central Hub",             agentIds:["ORCH"], isHub:true,   decor:["Routing panel","Live dashboard"]             },
  { id:"dev",    area:"dev",    label:'"DEV"',     sublabel:"Build Bays",              agentIds:["DEV"],                decor:["Workstations","DevOps Corner"]               },
  { id:"verify", area:"verify", label:'"VERIFY"',  sublabel:"Specialized Labs ∥",     agentIds:["QA","SEC","PRIVACY"], decor:["Testing stations","Security monitoring"]     },
  { id:"qco",    area:"qco",    label:'"QCO"',     sublabel:"Gatekeeper Suite",        agentIds:["QCO"],                decor:["Compliance desk","Final gate"]               },
  { id:"sklad",  area:"sklad",  label:'"СКЛАД"',   sublabel:"Готовый результат",       agentIds:["SKLAD"], isSklad:true, decor:["Output storage","Ready to ship"]            },
];

const DECOR = [
  { id:"cafe",    area:"cafe",    label:"Micro-Kitchen & Café", icon:"☕", note:"Comfortable lounge · Coffee · Snack bar" },
  { id:"hotdesk", area:"hotdesk", label:"Hot-Desking Area",     icon:"⬚", note:"Open collaboration space" },
];

const PIPELINE = [
  { phase:"orchestrate", ids:["ORCH"],              parallel:false },
  { phase:"plan",        ids:["PM"],                parallel:false },
  { phase:"design",      ids:["ARCH","DOMAIN"],     parallel:true  },
  { phase:"build",       ids:["DEV"],               parallel:false },
  { phase:"verify",      ids:["QA","SEC","PRIVACY"],parallel:true  },
  { phase:"gate",        ids:["QCO"],               parallel:false },
];

const SAMPLES = [
  { l:"Forecasting API",   t:"Build a REST API endpoint for demand forecasting that accepts historical sales data (SKU, date, quantity) and returns ARIMA+XGBoost ensemble predictions for 12 periods ahead with confidence intervals, stored per tenant in PostgreSQL." },
  { l:"Multi-Tenant Auth", t:"Implement complete user auth: JWT with refresh token rotation, RBAC roles (Admin/Analyst/Viewer), and PostgreSQL row-level security for multi-tenant data isolation." },
  { l:"Variance Dashboard",t:"Create a React variance analysis dashboard showing planned vs actual demand with drill-down by SKU and region. Include Forecast Bias, MAPE KPIs and Excel export." },
];

const BACKEND_URL = "http://localhost:8001";

/* ═══════════════════════════════════════════
   LIVE STREAMING HELPER (SSE)
═══════════════════════════════════════════ */
async function streamAgent({ agentId, messages, onChunk, onDone, onError }) {
  let accumulated = "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/agents/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: agentId,
        system_prompt: AGENTS[agentId].sys,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete last line

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          onDone(accumulated);
          return accumulated;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.delta) {
            accumulated += parsed.delta;
            onChunk(accumulated);
          }
        } catch (parseErr) {
          // skip malformed SSE lines
        }
      }
    }

    onDone(accumulated);
    return accumulated;
  } catch (e) {
    const errMsg = `[ERROR: ${agentId}] Не удалось подключиться к бэкенду.\n` +
      `Убедитесь что сервер запущен: cd backend && python -m uvicorn main:app --port 8001\n\n` +
      `Детали: ${e.message}`;
    onError(errMsg);
    return errMsg;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ═══════════════════════════════════════════
   ROOM COMPONENT
═══════════════════════════════════════════ */
function Room({ room, isSelected, activeAgents, doneAgents, outputs, onClick }) {
  const primaryAgent = AGENTS[room.agentIds[0]];
  const isActive = room.agentIds.some(id => activeAgents.has(id));
  const isDone = room.agentIds.every(id => doneAgents.has(id));
  const hasOutput = room.agentIds.some(id => outputs[id]);

  const borderColor = isActive ? primaryAgent.color :
                      isSelected ? primaryAgent.color + "99" :
                      isDone ? primaryAgent.color + "50" : "#0e1e30";
  const bg = isActive ? `${primaryAgent.color}10` :
             isSelected ? `${primaryAgent.color}08` : "#060d1a";

  return (
    <div onClick={() => onClick(room)} style={{
      gridArea: room.area,
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: 8,
      padding: room.isHub ? "10px 12px" : "8px 10px",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      boxShadow: isActive
        ? `0 0 20px ${primaryAgent.color}30, inset 0 0 30px ${primaryAgent.color}08`
        : isSelected ? `0 0 12px ${primaryAgent.color}20` : "none",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      {/* Active top beam */}
      {isActive && (
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent, ${primaryAgent.color}, transparent)`,
          animation:"beam 1.8s linear infinite",
        }} />
      )}

      {/* Agent badge(s) */}
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {room.agentIds.map(aid => {
          const ag = AGENTS[aid];
          const agActive = activeAgents.has(aid);
          const agDone = doneAgents.has(aid);
          return (
            <div key={aid} style={{
              display:"flex", alignItems:"center", gap:3,
              padding:"2px 6px", borderRadius:3,
              background: agActive ? `${ag.color}20` : agDone ? `${ag.color}12` : "#0a1628",
              border:`1px solid ${agActive ? ag.color+"60" : agDone ? ag.color+"30" : "#0e1e30"}`,
              transition:"all 0.3s",
            }}>
              <span style={{ fontSize:9, color: agActive ? ag.color : agDone ? ag.color+"aa" : "#1e3050" }}>
                {ag.icon}
              </span>
              <span style={{
                fontSize:8, fontFamily:"'Space Mono',monospace", letterSpacing:"0.06em",
                color: agActive ? ag.color : agDone ? ag.color+"aa" : "#1e3050",
                fontWeight:700,
              }}>{ag.id}</span>
              {agActive && (
                <span style={{ display:"inline-flex", gap:2 }}>
                  {[0,1,2].map(i=>(
                    <span key={i} style={{ width:3,height:3,borderRadius:"50%",
                      background:ag.color, animation:`dot 1.2s ease ${i*0.2}s infinite`,display:"block" }} />
                  ))}
                </span>
              )}
              {agDone && !agActive && <span style={{ fontSize:7, color:ag.color+"99" }}>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Room name */}
      <div style={{
        fontFamily:"'Bebas Neue',sans-serif",
        fontSize: room.isHub ? 15 : 12,
        letterSpacing:"0.06em",
        color: isActive ? primaryAgent.color : isSelected ? primaryAgent.color+"cc" : "#1e3a5a",
        lineHeight:1.1, transition:"all 0.3s",
      }}>{room.label}</div>

      <div style={{ fontSize:8, color: isActive ? "#4a7a9b" : "#162438",
        fontFamily:"'Space Mono',monospace", letterSpacing:"0.05em" }}>
        {room.sublabel}
      </div>

      {/* Decor items */}
      {!room.isHub && (
        <div style={{ marginTop:2, display:"flex", flexDirection:"column", gap:2 }}>
          {room.decor.slice(0,2).map((d,i) => (
            <div key={i} style={{ fontSize:7, color:"#0e1e2e",
              fontFamily:"'Space Mono',monospace", display:"flex", gap:3, alignItems:"center" }}>
              <span style={{ color:"#0d1e30" }}>·</span> {d}
            </div>
          ))}
        </div>
      )}

      {/* Output preview for hub */}
      {room.isHub && hasOutput && (
        <div style={{ fontSize:8, color:"#1e4060", fontFamily:"'Space Mono',monospace",
          lineHeight:1.5, marginTop:2, overflow:"hidden",
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {outputs[room.agentIds[0]]?.slice(0,80)}…
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div style={{ position:"absolute", bottom:0, right:0,
          width:0,height:0,
          borderLeft:"10px solid transparent",
          borderBottom:`10px solid ${primaryAgent.color}60`,
        }} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DECOR ROOM
═══════════════════════════════════════════ */
function DecorRoom({ room }) {
  return (
    <div style={{
      gridArea:room.area,
      background:"#050b16",
      border:"1px solid #080f1e",
      borderRadius:8,
      padding:"8px 10px",
      display:"flex", flexDirection:"column", gap:3,
    }}>
      <div style={{ fontSize:13, color:"#0c1a2a" }}>{room.icon}</div>
      <div style={{ fontSize:8, fontFamily:"'Space Mono',monospace",
        color:"#0c1a2a", letterSpacing:"0.08em", lineHeight:1.4 }}>
        {room.label}
      </div>
      <div style={{ fontSize:7, color:"#081018",
        fontFamily:"'Space Mono',monospace", lineHeight:1.5 }}>
        {room.note}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   OUTPUT PANEL
═══════════════════════════════════════════ */
function OutputPanel({ room, outputs, activeAgents, activeTab, setActiveTab }) {
  const ref = useRef(null);
  const agent = room ? AGENTS[room.agentIds[activeTab] || room.agentIds[0]] : null;
  const output = agent ? outputs[agent.id] : null;

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);

  if (!room) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Space Mono',monospace", color:"#0d1e30", fontSize:10,
      flexDirection:"column", gap:6, textAlign:"center" }}>
      <div style={{ fontSize:24, color:"#0a1828" }}>◫</div>
      <div style={{ letterSpacing:"0.12em" }}>CLICK A ROOM</div>
      <div style={{ fontSize:8, color:"#081018" }}>to view agent output</div>
    </div>
  );

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8, minHeight:0 }}>
      {/* Room header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ fontSize:16, color: agent?.color || "#06B6D4" }}>
          {agent?.icon}
        </div>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14,
            letterSpacing:"0.06em", color: agent?.color || "#06B6D4" }}>
            {room.label} — {room.sublabel}
          </div>
          <div style={{ fontSize:8, color:"#1e3050", fontFamily:"'Space Mono',monospace" }}>
            {agent?.role}
          </div>
        </div>
      </div>

      {/* Tabs for multi-agent rooms */}
      {room.agentIds.length > 1 && (
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {room.agentIds.map((aid, i) => {
            const ag = AGENTS[aid];
            const isActive = activeAgents.has(aid);
            return (
              <button key={aid} onClick={() => setActiveTab(i)} style={{
                padding:"3px 10px", borderRadius:4,
                background: activeTab===i ? `${ag.color}20` : "#080f1e",
                border:`1px solid ${activeTab===i ? ag.color+"60" : "#0d1828"}`,
                color: activeTab===i ? ag.color : "#1e3050",
                fontSize:9, fontFamily:"'Space Mono',monospace",
                fontWeight:700, letterSpacing:"0.06em",
                cursor:"pointer", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:4,
              }}>
                {ag.icon} {ag.id}
                {isActive && <span style={{ width:4,height:4,borderRadius:"50%",
                  background:ag.color, display:"inline-block",
                  animation:"pulse 1s ease infinite" }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* Terminal output */}
      <div ref={ref} style={{
        flex:1, background:"#030810", borderRadius:6,
        border:`1px solid ${agent?.color ? agent.color+"20" : "#0d1828"}`,
        padding:"10px 12px", overflowY:"auto", minHeight:0,
        fontFamily:"'Space Mono',monospace", fontSize:10,
        lineHeight:1.75, color:"#4a7a9b",
        whiteSpace:"pre-wrap", wordBreak:"break-word",
      }}>
        {output ? (
          <span style={{ color:"#8bb8d8" }}>
            {output}
            {activeAgents.has(agent?.id) && (
              <span style={{ display:"inline-flex", gap:2, marginLeft:3 }}>
                {[0,1,2].map(i=>(
                  <span key={i} style={{ width:4,height:4,borderRadius:"50%",
                    background:agent.color, animation:`dot 1.2s ease ${i*0.2}s infinite`,display:"inline-block" }} />
                ))}
              </span>
            )}
          </span>
        ) : (
          <span style={{ color:"#0d1e30" }}>
            {activeAgents.has(agent?.id) ? "⟳ Agent initializing…" : "No output yet. Launch the pipeline to activate this agent."}
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function FloorPlanOffice() {
  const [task, setTask] = useState("");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [outputs, setOutputs] = useState({});
  const [activeAgents, setActiveAgents] = useState(new Set());
  const [doneAgents, setDoneAgents] = useState(new Set());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [progress, setProgress] = useState(0);
  const [memory, setMemory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'terminal'

  const setOut = useCallback((id, txt) => setOutputs(o => ({...o, [id]:txt})), []);
  const addActive = useCallback(id => setActiveAgents(s => new Set([...s, id])), []);
  const removeActive = useCallback(id => setActiveAgents(s => { const n=new Set(s); n.delete(id); return n; }), []);
  const addDone = useCallback(id => setDoneAgents(s => new Set([...s, id])), []);

  const runAgent = useCallback((agentId, messages) => {
    addActive(agentId);
    return new Promise(resolve => {
      streamAgent({
        agentId, messages,
        onChunk: t => setOut(agentId, t),
        // onDone тоже сохраняет финальный текст — на случай race condition
        onDone: t => { setOut(agentId, t); removeActive(agentId); addDone(agentId); resolve(t); },
        onError: t => { setOut(agentId, t); removeActive(agentId); addDone(agentId); resolve(t); },
      });
    });
  }, [addActive, removeActive, addDone, setOut]);

  const handleRoomClick = useCallback((room) => {
    setSelectedRoom(room);
    setActiveTab(0);
  }, []);

  const launch = useCallback(async () => {
    if (!task.trim() || running) return;
    setRunning(true); setDone(false); setOutputs({});
    setActiveAgents(new Set()); setDoneAgents(new Set());
    setProgress(0);

    // Phase 0: Orchestrate
    setProgress(5);
    const orchOut = await runAgent("ORCH", [{role:"user", content:`New feature for DemandIQ:\n\n${task}`}]);
    setProgress(16); await sleep(350);

    // Phase 1: Plan
    const pmOut = await runAgent("PM", [{role:"user", content:`Routing plan:\n${orchOut}\n\nTask: ${task}`}]);
    setProgress(32); await sleep(350);

    // Phase 2: Design (parallel)
    const [archOut, domainOut] = await Promise.all([
      runAgent("ARCH",   [{role:"user", content:`Task spec:\n${pmOut}\n\nRouting:\n${orchOut}\n\nCreate system design.`}]),
      runAgent("DOMAIN", [{role:"user", content:`Task spec:\n${pmOut}\n\nRouting:\n${orchOut}\n\nValidate business logic.`}]),
    ]);
    setProgress(50); await sleep(350);

    // Phase 3: Build — DEV-agent with real tool-calling loop
    addActive("DEV");
    setOut("DEV", "[DEV-Agent] Connecting to autonomous agent loop...\nModel will read/write files and run commands in the project.");

    let devOut = "";
    try {
      // Обрезаем контекст чтобы не превышать лимит токенов
      const trim = (s, n) => s.length > n ? s.slice(0, n) + "…" : s;
      const devRes = await fetch(`${BACKEND_URL}/api/v1/agents/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_description:
            `REQUEST: ${task}\n\nSPEC:\n${trim(pmOut, 400)}\n\nARCH:\n${trim(archOut, 300)}`,
        }),
      });
      const devData = await devRes.json();
      if (devRes.ok) {
        devOut = `[FROM: DEV-Agent] [STATUS: READY_FOR_QA]\n` +
          `Iterations used: ${devData.iterations || "?"}\n\n` +
          (devData.result || devData.response || "No output from agent.");
      } else {
        devOut = `[DEV-Agent ERROR]\n${devData.detail || devData.message || "Unknown backend error"}`;
      }
    } catch (e) {
      devOut = `[DEV-Agent] Could not reach backend.\nEnsure server is running at ${BACKEND_URL}\nError: ${e.message}`;
    }

    setOut("DEV", devOut);
    removeActive("DEV");
    addDone("DEV");
    setProgress(66); await sleep(350);

    // Phase 4: Verify (parallel) — контекст обрезан для экономии токенов
    const trim = (s, n) => s.length > n ? s.slice(0, n) + "…" : s;
    const [qaOut, secOut, privOut] = await Promise.all([
      runAgent("QA",      [{role:"user", content:`Task: ${task}\nCode:\n${trim(devOut,400)}\nSpec:\n${trim(pmOut,300)}\nWrite test plan.`}]),
      runAgent("SEC",     [{role:"user", content:`Task: ${task}\nCode:\n${trim(devOut,400)}\nSecurity review.`}]),
      runAgent("PRIVACY", [{role:"user", content:`Task: ${task}\nCode:\n${trim(devOut,300)}\nGDPR/CCPA privacy review.`}]),
    ]);
    setProgress(83); await sleep(350);

    // Phase 5: Gate
    await runAgent("QCO", [{role:"user",
      content:`Task: ${task}\nQA: ${trim(qaOut,200)}\nSEC: ${trim(secOut,200)}\nPRIVACY: ${trim(privOut,200)}\nFinal compliance verdict.`}]);
    setProgress(100);

    // Memory
    const tid = pmOut.match(/TASK-(\d+)/)?.[1];
    const title = pmOut.match(/\*\*Title:\*\*\s*([^\n]+)/)?.[1]?.trim().slice(0,28);
    const mod = pmOut.match(/\*\*Module:\*\*\s*([^\n]+)/)?.[1]?.trim();
    if (tid) setMemory(m => [`TASK-${tid}${title?` · ${title}`:""}${mod?` [${mod}]`:""}`, ...m].slice(0,10));

    setRunning(false); setDone(true);
    setViewMode('terminal'); // автоматически показываем все результаты
  }, [task, running, runAgent]);

  const reset = () => {
    setTask(""); setRunning(false); setDone(false); setOutputs({});
    setActiveAgents(new Set()); setDoneAgents(new Set());
    setProgress(0); setSelectedRoom(null);
  };

  // Auto-select room when agent activates
  useEffect(() => {
    if (activeAgents.size === 0) return;
    const activeId = [...activeAgents][0];
    const room = ROOMS.find(r => r.agentIds.includes(activeId));
    if (room) {
      setSelectedRoom(room);
      setActiveTab(room.agentIds.indexOf(activeId));
    }
  }, [activeAgents]);

  return (
    <div style={{ height:"100vh", background:"#030810", color:"#c8d6e8",
      fontFamily:"'Space Mono',monospace", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        @keyframes dot{0%,80%,100%{opacity:.1}40%{opacity:1}}
        @keyframes beam{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#030810}
        ::-webkit-scrollbar-thumb{background:#0d1e30;border-radius:2px}
        textarea:focus,button:focus{outline:none}
        button{cursor:pointer}
        button:disabled{cursor:not-allowed}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ padding:"12px 16px 0", flexShrink:0 }}>
        <div style={{ maxWidth:1100, margin:"0 auto",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontSize:8, color:"#0d1e30", letterSpacing:"0.22em" }}>
              DEMANDIQ · AI DEVELOPMENT OFFICE V2.1
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(20px,3.5vw,32px)", letterSpacing:"0.08em", margin:0, lineHeight:1,
                background:"linear-gradient(100deg,#06B6D4 0%,#3B82F6 30%,#8B5CF6 60%,#F97316 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                AI AGENT OFFICE
              </h1>
              
              {/* VIEW MODE TABS */}
              <div style={{ display:"flex", background:"#060d1a", borderRadius:6, padding:2, border:"1px solid #0d1828" }}>
                <button onClick={()=>setViewMode('map')} style={{
                  padding:"4px 12px", border:"none", borderRadius:4, fontSize:9, fontWeight:700,
                  background: viewMode==='map'?"#06B6D420":"transparent",
                  color: viewMode==='map'?"#06B6D4":"#1e3050", cursor:"pointer"
                }}>FLOOR PLAN</button>
                <button onClick={()=>setViewMode('terminal')} style={{
                  padding:"4px 12px", border:"none", borderRadius:4, fontSize:9, fontWeight:700,
                  background: viewMode==='terminal'?"#3B82F620":"transparent",
                  color: viewMode==='terminal'?"#3B82F6":"#1e3050", cursor:"pointer"
                }}>AGENT TERMINAL</button>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            {done && (
              <div style={{ padding:"4px 12px", borderRadius:4,
                background:"#06B6D410", border:"1px solid #06B6D430",
                fontSize:9, color:"#06B6D4", fontWeight:700, letterSpacing:"0.1em" }}>
                ✓ PIPELINE COMPLETE
              </div>
            )}
            {/* Agent legend */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {Object.values(AGENTS).map(ag => (
                <div key={ag.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:8, color: activeAgents.has(ag.id) ? ag.color :
                    doneAgents.has(ag.id) ? ag.color+"80" : "#0d1e30" }}>
                    {ag.icon}
                  </span>
                  <span style={{ fontSize:7, color: activeAgents.has(ag.id) ? ag.color :
                    doneAgents.has(ag.id) ? ag.color+"80" : "#0d1e30",
                    fontFamily:"'Space Mono',monospace" }}>{ag.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRESS ── */}
      <div style={{ padding:"6px 16px 0", flexShrink:0 }}>
        <div style={{ maxWidth:1100, margin:"0 auto",
          height:2, background:"#060d1a", borderRadius:1, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`,
            background:"linear-gradient(90deg,#06B6D4,#3B82F6,#8B5CF6,#F97316)",
            transition:"width 0.5s ease",
            boxShadow: progress>0?"0 0 6px #3B82F660":"none" }} />
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ flex:1, display:"flex", gap:10, padding:"10px 16px 14px",
        maxWidth:1100, margin:"0 auto", width:"100%", minHeight:0, overflow:"hidden" }}>

        {/* ── MAIN CONTENT AREA (Conditional) ── */}
        {viewMode === 'map' ? (
          <div style={{ flex:"0 0 62%", display:"grid", gap:6,
            gridTemplateAreas:`
              "pm     pm     hotdesk arch   domain"
              "cafe   orch   orch    dev    dev   "
              "verify verify qco     qco    qco   "
              "sklad  sklad  sklad   sklad  sklad "
            `,
            gridTemplateColumns:"1.1fr 0.9fr 1fr 1fr 1fr",
            gridTemplateRows:"1fr 1.4fr 1fr 1.2fr",
            minHeight:520,
          }}>
            {ROOMS.map(room => (
              <Room key={room.id} room={room}
                isSelected={selectedRoom?.id === room.id}
                activeAgents={activeAgents} doneAgents={doneAgents}
                outputs={outputs} onClick={handleRoomClick} />
            ))}
            {DECOR.map(d => <DecorRoom key={d.id} room={d} />)}
          </div>
        ) : (
          <div style={{ flex:"0 0 62%", minHeight:0, display:"flex", flexDirection:"column" }}>
            {/* скроллируемая область */}
            <div style={{ flex:1, minHeight:0, overflowY:"auto", paddingRight:6,
              display:"flex", flexDirection:"column", gap:10 }}>
              {Object.values(AGENTS).map(ag => (
                <div key={ag.id} style={{
                  background:"#050b16", border:`1px solid ${outputs[ag.id] ? ag.color+'40' : '#0d1828'}`,
                  borderRadius:8, padding:12, flexShrink:0,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ color:ag.color, fontSize:14 }}>{ag.icon}</span>
                    <span style={{ color:ag.color, fontWeight:700, fontSize:11 }}>{ag.name}</span>
                    {activeAgents.has(ag.id) && <span style={{ fontSize:9, color:ag.color, animation:"pulse 1s infinite" }}>● ACTIVE</span>}
                    {doneAgents.has(ag.id) && <span style={{ fontSize:9, color:ag.color+'80' }}>✓ DONE</span>}
                  </div>
                  <div style={{
                    fontFamily:"'Space Mono',monospace", fontSize:10,
                    color:outputs[ag.id] ? "#8bb8d8" : "#1e3050",
                    whiteSpace:"pre-wrap", wordBreak:"break-word",
                    background:"#030810", padding:10, borderRadius:4, minHeight:40,
                    lineHeight:1.7,
                  }}>
                    {outputs[ag.id] || "Waiting for signal..."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8,
          background:"#060d1a", border:"1px solid #0d1828", borderRadius:10,
          padding:"14px", minHeight:0, minWidth:0 }}>

          {/* Task input */}
          <div style={{ flexShrink:0 }}>
            <div style={{ fontSize:8, color:"#0d1e30", letterSpacing:"0.18em", marginBottom:5 }}>
              ▸ TASK INPUT
            </div>
            <textarea value={task} 
              onChange={e=>setTask(e.target.value)} 
              disabled={running}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const start = e.target.selectionStart;
                  const end = e.target.selectionEnd;
                  const newValue = task.substring(0, start) + "  " + task.substring(end);
                  setTask(newValue);
                  setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + 2;
                  }, 0);
                }
              }}
              placeholder="Describe the feature to build…"
              style={{ width:"100%", minHeight:86, background:"#030810",
                border:"1px solid #0d1828", borderRadius:5, padding:"8px 10px",
                color:"#6a9ab8", fontFamily:"'Space Mono',monospace",
                fontSize:10, lineHeight:1.6, resize:"vertical",
                opacity: running?0.4:1 }} />

            <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
              {SAMPLES.map((s,i) => (
                <button key={i} onClick={() => !running && setTask(s.t)} disabled={running}
                  style={{ background:"#080f1e", border:"1px solid #0d1828",
                    borderRadius:3, padding:"2px 8px",
                    color:running?"#0d1828":"#1e4060", fontSize:8,
                    fontFamily:"'Space Mono',monospace", transition:"all 0.2s" }}>
                  {s.l}
                </button>
              ))}
            </div>

            <div style={{ display:"flex", gap:6, marginTop:8 }}>
              <button onClick={launch} disabled={running || !task.trim()} style={{
                background: running||!task.trim() ? "#0a1020"
                  : "linear-gradient(135deg,#06B6D4,#3B82F6)",
                border:"none", borderRadius:5, padding:"7px 16px",
                color: running||!task.trim() ? "#0d1e30" : "#000",
                fontSize:10, fontWeight:700, letterSpacing:"0.07em", transition:"all 0.2s",
              }}>
                {running ? "⟳ RUNNING…" : "▶ LAUNCH"}
              </button>
              <button onClick={reset} disabled={running} style={{
                background:"transparent", border:"1px solid #0d1828",
                borderRadius:5, padding:"7px 14px", color:running?"#0d1e30":"#1e3050",
                fontSize:10, transition:"all 0.2s",
              }}>↺ RESET</button>
            </div>
          </div>

          <div style={{ height:1, background:"#0a1525", flexShrink:0 }} />

          {/* Output panel */}
          <OutputPanel room={selectedRoom} outputs={outputs}
            activeAgents={activeAgents} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Memory */}
          {memory.length > 0 && (
            <div style={{ flexShrink:0, borderTop:"1px solid #0a1525", paddingTop:8 }}>
              <div style={{ fontSize:8, color:"#0d1828", letterSpacing:"0.15em", marginBottom:5 }}>
                ▣ MEMORY LAYER
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {memory.map((e,i) => (
                  <div key={i} style={{ fontSize:7, color:"#1e3050",
                    background:"#080f1e", border:"1px solid #0a1828",
                    borderRadius:3, padding:"2px 7px",
                    fontFamily:"'Space Mono',monospace" }}>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
