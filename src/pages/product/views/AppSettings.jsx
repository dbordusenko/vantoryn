import { useState } from 'react'
import { Check } from 'lucide-react'
import { C, f } from '../../../tokens'

export default function AppSettings() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{
      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '32px',
      display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640,
    }}>
      <div style={f({ fontSize: 15, fontWeight: 700, color: C.t1 })}>Organization Settings</div>
      {[
        { label: 'Company Name',         value: 'Acme Corporation' },
        { label: 'Fiscal Year Start',    value: 'January 1' },
        { label: 'Base Currency',        value: 'USD ($)' },
        { label: 'Reporting Timezone',   value: 'America/New_York' },
      ].map(s => (
        <div key={s.label}>
          <div style={f({ fontSize: 11, color: C.t3, marginBottom: 6, fontWeight: 600 })}>{s.label}</div>
          <input defaultValue={s.value} style={f({
            width: '100%', padding: '10px 14px', borderRadius: 8,
            background: C.bg3, border: `1px solid ${C.borderMid}`,
            color: C.t1, fontSize: 14, outline: 'none',
          })}
            onFocus={e => (e.target.style.borderColor = C.blue)}
            onBlur={e => (e.target.style.borderColor = C.borderMid)}
          />
        </div>
      ))}
      <button onClick={handleSave} style={f({
        alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 9,
        background: saved ? C.green : C.blue,
        border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        transition: 'background 0.3s', display: 'flex', alignItems: 'center', gap: 7,
      })}>
        {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
      </button>
    </div>
  )
}
