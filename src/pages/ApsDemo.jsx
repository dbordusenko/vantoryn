import { Factory, ArrowRight, Boxes, DollarSign, Gauge } from 'lucide-react'
import { C, FONT, f } from '../tokens'
import ProductionPlanning from './product/views/ProductionPlanning'

/* Public, no-login client demo of the APS Production & Supply Optimizer.
   Reuses the live ProductionPlanning module (connected to the real backend). */
export default function ApsDemo({ navigate, onBookDemo }) {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 64 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin .9s linear infinite}`}</style>

      {/* Hero banner */}
      <div style={{
        background: `linear-gradient(180deg, ${C.bg1}, ${C.bg0})`,
        borderBottom: `1px solid ${C.border}`, padding: '40px 28px 32px',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.blue}14`, border: `1px solid ${C.blue}35`,
            borderRadius: 20, padding: '5px 12px', marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green,
              boxShadow: `0 0 6px ${C.green}` }} />
            <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600 })}>Live interactive demo</span>
          </div>

          <h1 style={f({ fontSize: 34, fontWeight: 800, color: C.t1, letterSpacing: '-0.03em',
            margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 12 })}>
            <Factory size={30} color={C.blue} /> Production &amp; Supply Optimizer
          </h1>
          <p style={f({ fontSize: 15, color: C.t2, maxWidth: 720, lineHeight: 1.6, margin: '0 0 20px' })}>
            Turn a sales forecast into an executable, capacity-checked production and purchasing plan —
            with the exact cash impact, computed live. Below is a real optimization run for a sample
            IoT electronics manufacturer (4 products, multi-level BOMs, 3 lines, 12 weeks).
          </p>

          {/* value props */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { icon: <Gauge size={15} />, t: 'Detects capacity bottlenecks before they hit' },
              { icon: <Boxes size={15} />, t: 'Auto-substitutes long-lead components' },
              { icon: <DollarSign size={15} />, t: 'Integrated weekly cash-flow forecast' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.teal }}>{v.icon}</span>
                <span style={f({ fontSize: 13, color: C.t2 })}>{v.t}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => onBookDemo?.()} style={f({
              background: C.blue, border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 14, fontWeight: 600, padding: '11px 22px', cursor: 'pointer',
              boxShadow: `0 4px 20px ${C.blue}40`, display: 'flex', alignItems: 'center', gap: 8 })}>
              Book a CFO demo <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate?.('platform')} style={f({
              background: 'transparent', border: `1px solid ${C.borderMid}`, borderRadius: 10,
              color: C.t2, fontSize: 14, fontWeight: 500, padding: '10px 20px', cursor: 'pointer' })}>
              See the platform
            </button>
          </div>
        </div>
      </div>

      {/* The live module */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px' }}>
        <ProductionPlanning />
      </div>

      {/* Closing CTA */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '40px 28px', textAlign: 'center' }}>
        <h2 style={f({ fontSize: 22, fontWeight: 700, color: C.t1, margin: '0 0 8px' })}>
          Run this on your own data
        </h2>
        <p style={f({ fontSize: 14, color: C.t2, margin: '0 0 18px' })}>
          Connected to your ERP, Vantoryn plans your real BOMs, inventory and forecast every night.
        </p>
        <button onClick={() => onBookDemo?.()} style={f({
          background: C.blue, border: 'none', borderRadius: 10, color: '#fff',
          fontSize: 14, fontWeight: 600, padding: '11px 24px', cursor: 'pointer',
          boxShadow: `0 4px 20px ${C.blue}40`, display: 'inline-flex', alignItems: 'center', gap: 8 })}>
          Book a CFO demo <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
