import { C, FONT } from '../../tokens'
import { CF_ACTUAL, CF_FORECAST, CF_HI, CF_LO, MONTHS, SCENARIOS } from './data'

export function Sparkline({ data, color }) {
  const W = 80, H = 28, min = Math.min(...data), max = Math.max(...data)
  const pad = max === min ? 1 : 0
  const tx = i => (i / (data.length - 1)) * W
  const ty = v => H - ((v - min) / (max - min + pad)) * (H - 4) - 2
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ')
  const area = path + ` L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H, display: 'block' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={tx(data.length - 1)} cy={ty(data[data.length - 1])} r="2.5" fill={color} />
    </svg>
  )
}

export default function CashFlowChart({ showForecast = true, scenario = 'base', compact = false, importedData = null, forecastOverride = null }) {
  const H = compact ? 140 : 200
  const W = 600

  const allActual = importedData ? importedData.cashActual   : CF_ACTUAL
  const allF      = importedData ? importedData.cashForecast : (forecastOverride || SCENARIOS[scenario]?.data || CF_FORECAST)
  const hiArr     = importedData ? importedData.cashHi       : CF_HI
  const loArr     = importedData ? importedData.cashLo       : CF_LO
  const monthLbls = importedData ? importedData.allMonths    : MONTHS

  const allVals = [...allActual, ...allF, ...hiArr, ...loArr]
  const min = Math.floor(Math.min(...allVals) - 0.5), max = Math.ceil(Math.max(...allVals) + 0.5)
  const total = monthLbls.length
  const tx = i => (i / (total - 1)) * W
  const ty = v => H - ((v - min) / (max - min)) * H
  const nowIdx = allActual.length - 1

  const aCoords = allActual.map((v, i) => [tx(i), ty(v)])
  const fCoords = allF.map((v, i) => [tx(nowIdx + i), ty(v)])
  const hiCoords = hiArr.map((v, i) => [tx(nowIdx + i), ty(v)])
  const loCoords = loArr.map((v, i) => [tx(nowIdx + i), ty(v)])

  const ap = aCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const fp = fCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const cb = hiCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    + ' ' + [...loCoords].reverse().map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
  const area = ap + ` L${aCoords[aCoords.length - 1][0].toFixed(1)},${H} L0,${H} Z`

  const fColor = SCENARIOS[scenario]?.color || C.teal
  const nowX = tx(nowIdx)

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="cfArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map(f => (
        <g key={f}>
          <line x1="0" y1={H * f} x2={W} y2={H * f} stroke={C.border} strokeWidth="1" strokeDasharray="3,5" />
          <text x="2" y={H * f - 3} fill={C.t3} fontSize="9" fontFamily={FONT}>
            ${(max - (max - min) * f).toFixed(1)}M
          </text>
        </g>
      ))}
      {monthLbls.map((m, i) => i % 2 === 0 && (
        <text key={i} x={tx(i)} y={H + 18} fill={i === nowIdx ? C.t2 : C.t3} fontSize="9" fontFamily={FONT}
          textAnchor="middle" fontWeight={i === nowIdx ? 700 : 400}>{m}</text>
      ))}
      {showForecast && <path d={cb} fill={`${fColor}16`} />}
      <path d={area} fill="url(#cfArea)" />
      <path d={ap} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {showForecast && <path d={fp} fill="none" stroke={fColor} strokeWidth="1.8" strokeDasharray="5,3" strokeLinejoin="round" />}
      <line x1={nowX} y1="0" x2={nowX} y2={H} stroke={C.borderMid} strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={nowX + 4} y="12" fill={C.t3} fontSize="9" fontFamily={FONT}>Now</text>
      <circle cx={aCoords[aCoords.length - 1][0]} cy={aCoords[aCoords.length - 1][1]} r="3.5" fill={C.blue} stroke={C.bg2} strokeWidth="2" />
      {showForecast && <circle cx={fCoords[fCoords.length - 1][0]} cy={fCoords[fCoords.length - 1][1]} r="3" fill={fColor} stroke={C.bg2} strokeWidth="2" />}
    </svg>
  )
}
