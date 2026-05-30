import { useState } from 'react'
import { C, f } from '../../../tokens'
import { SCENARIOS } from '../data'
import CashFlowChart from '../CashFlowChart'

export default function Forecasting() {
  const [scenario, setScenario] = useState('base')
  const [revenueGrowth, setRevenueGrowth] = useState(18)
  const [costGrowth, setCostGrowth] = useState(12)
  const [churn, setChurn] = useState(3)

  const sc = SCENARIOS[scenario]

  const BASE_REVENUE  = 6.1
  const BASE_BURN_K   = 890
  const CASH_POSITION = 10.2

  const monthlyGrowth  = revenueGrowth / 100 / 12
  const monthlyChurn   = churn / 100 / 12
  const computedForecast = Array.from({ length: 5 }, (_, i) =>
    parseFloat((BASE_REVENUE * Math.pow(1 + monthlyGrowth, i + 1) * Math.pow(1 - monthlyChurn, i + 1)).toFixed(2))
  )
  const adjustedBurnK  = Math.round(BASE_BURN_K * (1 + costGrowth / 100))
  const adjustedBurnM  = adjustedBurnK / 1000
  const runwayMo       = (CASH_POSITION / adjustedBurnM).toFixed(1)
  const revenue12mo    = (BASE_REVENUE * Math.pow(1 + monthlyGrowth, 12) * Math.pow(1 - monthlyChurn, 12)).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Scenario selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { id: 'base',       label: 'Base Case',   color: C.teal,  desc: 'Current trajectory based on run-rate' },
          { id: 'optimistic', label: 'Optimistic',  color: C.green, desc: '+15% revenue, cost discipline' },
          { id: 'stress',     label: 'Stress Test', color: C.red,   desc: '-20% revenue, cost unchanged' },
        ].map(s => (
          <button key={s.id} onClick={() => setScenario(s.id)} style={f({
            padding: '18px 20px', borderRadius: 14,
            border: `1px solid ${scenario === s.id ? s.color + '60' : C.border}`,
            background: scenario === s.id ? `${s.color}12` : C.bg2,
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
          })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
              <span style={f({ fontSize: 13, fontWeight: 700, color: scenario === s.id ? C.t1 : C.t2 })}>{s.label}</span>
            </div>
            <div style={f({ fontSize: 11, color: C.t3 })}>{s.desc}</div>
            <div style={f({ fontSize: 16, fontWeight: 800, color: s.color, marginTop: 10 })}>{sc.runway}</div>
            <div style={f({ fontSize: 10, color: C.t3 })}>projected runway</div>
          </button>
        ))}
      </div>

      {/* Chart + Assumptions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1 })}>
                Cash Flow Forecast — {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
              </div>
              <div style={f({ fontSize: 11, color: C.t3 })}>Actual (10mo) + 5-month AI projection · ${sc.burn}/mo burn</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={f({
                fontSize: 11, color: sc.color, fontWeight: 700, padding: '3px 10px',
                borderRadius: 4, background: `${sc.color}16`, border: `1px solid ${sc.color}35`,
              })}>
                Runway: {sc.runway}
              </span>
            </div>
          </div>
          <CashFlowChart scenario={scenario} forecastOverride={computedForecast} />
        </div>

        {/* Assumptions */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px' }}>
          <div style={f({ fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 18 })}>Assumptions</div>
          {[
            { label: 'Revenue Growth', val: revenueGrowth, set: setRevenueGrowth, min: 0, max: 50, unit: '%', color: C.green },
            { label: 'Cost Growth',    val: costGrowth,    set: setCostGrowth,    min: 0, max: 40, unit: '%', color: C.amber },
            { label: 'Churn Rate',     val: churn,         set: setChurn,         min: 0, max: 20, unit: '%', color: C.red },
          ].map(inp => (
            <div key={inp.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={f({ fontSize: 12, color: C.t2 })}>{inp.label}</span>
                <span style={f({ fontSize: 14, fontWeight: 800, color: inp.color })}>{inp.val}{inp.unit}</span>
              </div>
              <input type="range" min={inp.min} max={inp.max} value={inp.val}
                onChange={e => inp.set(Number(e.target.value))}
                style={{ width: '100%', accentColor: inp.color, cursor: 'pointer' }} />
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Projected Runway', value: `${runwayMo}mo`,          color: C.teal },
              { label: 'Burn Rate',        value: `$${adjustedBurnK}K/mo`,  color: C.amber },
              { label: '12-mo Revenue',    value: `$${revenue12mo}M`,       color: C.blue },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 7, background: C.bg3,
              }}>
                <span style={f({ fontSize: 11, color: C.t2 })}>{r.label}</span>
                <span style={f({ fontSize: 12, fontWeight: 700, color: r.color })}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sensitivity table */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px' }}>
        <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 16 })}>Scenario Comparison</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Scenario', 'Q3 Revenue', 'Q4 Revenue', 'Runway', 'Burn Rate', 'Risk Level'].map(h => (
                  <th key={h} style={f({
                    fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', padding: '8px 14px', textAlign: 'left',
                    borderBottom: `1px solid ${C.border}`,
                  })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Optimistic', q3: '$8.8M', q4: '$11.8M', runway: '18.2mo', burn: '$780K', risk: 'LOW',  color: C.green },
                { label: 'Base Case',  q3: '$7.6M', q4: '$9.2M',  runway: '11.4mo', burn: '$890K', risk: 'MED',  color: C.teal },
                { label: 'Stress',     q3: '$5.8M', q4: '$5.2M',  runway: '7.1mo',  burn: '$1.1M', risk: 'HIGH', color: C.red },
              ].map((row, i) => (
                <tr key={row.label} style={{ borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color }} />
                      <span style={f({ fontSize: 13, fontWeight: 600, color: C.t1 })}>{row.label}</span>
                    </div>
                  </td>
                  {[row.q3, row.q4, row.runway, row.burn].map((v, vi) => (
                    <td key={vi} style={f({ fontSize: 13, color: C.t2, padding: '12px 14px' })}>{v}</td>
                  ))}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={f({
                      fontSize: 10, color: row.color, fontWeight: 700, padding: '2px 8px',
                      borderRadius: 4, background: `${row.color}16`, border: `1px solid ${row.color}30`,
                    })}>{row.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
