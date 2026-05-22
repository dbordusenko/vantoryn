export const C = {
  bg0: '#04050a', bg1: '#080b13', bg2: '#0c1019',
  bg3: '#111622', bg4: '#161d2e',
  border: '#171e30', borderMid: '#1f293f', borderHi: '#2a3a58',
  t1: '#eef2fa', t2: '#7e8fa8', t3: '#374256', t4: '#1e2a3a',
  blue: '#3b7fff', blueD: '#2563eb', blueGlow: '#3b7fff28',
  teal: '#00c5b5', tealGlow: '#00c5b520',
  green: '#22c55e', greenGlow: '#22c55e1a',
  amber: '#f59e0b', amberGlow: '#f59e0b1a',
  red: '#f87171', redGlow: '#f8717120',
  purple: '#818cf8', purpleGlow: '#818cf81a',
}

export const FONT = "'Inter', system-ui, -apple-system, sans-serif"
export const f = s => ({ fontFamily: FONT, ...s })

export const btn = (color = C.blue) => ({
  primary: {
    fontSize: 14, fontWeight: 600, color: '#fff',
    background: color, border: 'none', borderRadius: 10,
    padding: '11px 24px', cursor: 'pointer',
    boxShadow: `0 4px 20px ${color}40`,
    display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.2s', fontFamily: FONT,
  },
  ghost: {
    fontSize: 14, fontWeight: 500, color: C.t2,
    background: 'transparent', border: `1px solid ${C.borderMid}`,
    borderRadius: 10, padding: '10px 22px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.2s', fontFamily: FONT,
  },
})

export const sectionHeader = (tag, title, subtitle) => (
  { tag, title, subtitle }
)

export const GLOBAL_STYLES = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulseGreen { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pageFade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
`
