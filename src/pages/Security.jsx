import { useState } from 'react'
import { Shield, Lock, Eye, Users, Building2, Globe, CheckCircle2,
  ArrowRight, BadgeCheck, Server, ChevronDown } from 'lucide-react'
import { C, f } from '../tokens'

const PILLARS = [
  {
    icon: <Lock size={22} />, color: C.blue, title: 'Data Encryption',
    headline: 'AES-256 at rest. TLS 1.3 in transit.',
    body: 'All financial data stored in Vantoryn is encrypted using AES-256 encryption at rest. All data transmitted between your systems and Vantoryn uses TLS 1.3 — the strongest transport encryption standard available.',
    points: ['AES-256 field-level encryption', 'TLS 1.3 for all data in transit', 'Encryption keys managed per tenant', 'Zero plaintext storage of sensitive fields'],
  },
  {
    icon: <Users size={22} />, color: C.teal, title: 'Role-Based Access Control',
    headline: 'Granular permissions. Principle of least privilege.',
    body: 'Vantoryn enforces role-based access control at every layer — from module access to individual data field visibility. Admins define roles by team, function, and data sensitivity.',
    points: ['Custom role definitions per organization', 'Data-level visibility rules', 'Module and feature permissions', 'SSO + SAML 2.0 support'],
  },
  {
    icon: <Eye size={22} />, color: C.purple, title: 'Audit Logs & Data Lineage',
    headline: 'Every action logged. Every data point traceable.',
    body: 'Vantoryn maintains immutable audit logs for every read, write, export, and configuration change. Data lineage is tracked from source system transaction to report output.',
    points: ['Immutable audit log per event', 'User + timestamp + action + data', 'Data lineage from ERP to report', 'Exportable audit trail for compliance'],
  },
  {
    icon: <Server size={22} />, color: C.amber, title: 'Infrastructure Security',
    headline: 'Cloud-native. Multi-region. Monitored 24/7.',
    body: 'Vantoryn runs on hardened cloud infrastructure with automated threat detection, network isolation, and continuous vulnerability scanning. Uptime SLA: 99.9%.',
    points: ['VPC network isolation per tenant', 'Automated vulnerability scanning', 'DDoS mitigation and WAF', '99.9% uptime SLA with incident response'],
  },
  {
    icon: <Building2 size={22} />, color: C.green, title: 'Single-Tenant Option',
    headline: 'Dedicated infrastructure for enterprise clients.',
    body: 'Enterprise clients with strict data residency or isolation requirements can deploy Vantoryn on dedicated, single-tenant infrastructure with guaranteed data separation.',
    points: ['Dedicated cloud environment', 'Data residency guarantees (EU, US, custom)', 'Custom SLAs available', 'Private connectivity (VPN / Direct Connect)'],
  },
  {
    icon: <Globe size={22} />, color: C.red, title: 'GDPR & CCPA Compliance',
    headline: 'Built for global regulatory requirements.',
    body: 'Vantoryn was designed with privacy-by-default principles. Data processing agreements, right-to-erasure workflows, and data portability are built into the platform.',
    points: ['DPA available on request', 'Right-to-erasure supported', 'Data portability export', 'CCPA opt-out mechanisms'],
  },
]

const FAQ = [
  { q: 'Who owns the financial data in Vantoryn?', a: 'You do. Vantoryn is a data processor, not a data controller. Your organization retains full ownership of all financial data. We process it only to provide the service, and you can export or delete your data at any time.' },
  { q: 'How is our ERP data transmitted to Vantoryn?', a: 'All data transmission uses OAuth 2.0 and TLS 1.3 encrypted connections. Credentials are never stored in plaintext. Integration tokens are encrypted and scoped to minimum-required permissions.' },
  { q: 'Can we restrict which team members see which financial data?', a: 'Yes. Vantoryn\'s RBAC system lets you define custom roles with field-level data visibility rules. A Controller can see all transaction data while an FP&A analyst might see only aggregated forecasting views.' },
  { q: 'What happens to our data if we cancel?', a: 'You retain access to export all data for 30 days after cancellation. After that, data is securely deleted from all Vantoryn systems within 60 days, with written confirmation available.' },
  { q: 'Is Vantoryn compliant with SOX financial reporting requirements?', a: 'Vantoryn\'s audit trail, role-based access controls, data lineage tracking, and change management logs are designed to support SOX compliance requirements. We recommend review with your compliance counsel.' },
  { q: 'Do you offer security assessments or penetration test reports?', a: 'Yes. We conduct annual third-party penetration tests and SOC 2 Type II audits. Summarized results and our latest audit reports are available to enterprise clients under NDA.' },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: `1px solid ${open ? C.borderHi : C.border}`, borderRadius: 12,
      overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(o => !o)} style={f({
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px', background: open ? C.bg3 : C.bg2, border: 'none', cursor: 'pointer',
        gap: 16,
      })}>
        <span style={f({ fontSize: 14, fontWeight: 600, color: C.t1, textAlign: 'left' })}>{item.q}</span>
        <ChevronDown size={16} color={C.t3} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.25s' }} />
      </button>
      {open && (
        <div style={{ padding: '16px 24px 20px', background: C.bg2, animation: 'fadeUp 0.2s ease',
          borderTop: `1px solid ${C.border}` }}>
          <p style={f({ fontSize: 14, color: C.t2, lineHeight: 1.75, margin: 0 })}>{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function Security({ navigate, onBookDemo }) {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: '72px 28px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
                marginBottom: 28, background: `${C.green}14`, border: `1px solid ${C.green}35` }}>
                <Shield size={12} color={C.green} />
                <span style={f({ fontSize: 12, color: C.green, fontWeight: 600, letterSpacing: '0.04em' })}>Security & Governance</span>
              </div>
              <h1 style={f({ fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: C.t1,
                margin: '0 0 20px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
                Enterprise-grade security<br />
                <span style={{ background: `linear-gradient(135deg, ${C.green}, ${C.teal})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  for financial infrastructure.
                </span>
              </h1>
              <p style={f({ fontSize: 17, color: C.t2, lineHeight: 1.7, margin: '0 0 36px' })}>
                Vantoryn was built for organizations where financial data integrity, auditability, and access control are non-negotiable. Security is not a feature — it is the foundation.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={onBookDemo} style={f({
                  fontSize: 14, fontWeight: 700, color: '#fff', background: C.green,
                  border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${C.green}40`,
                })}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Request Security Documentation <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {[
                { icon: <BadgeCheck size={24} color={C.green} />, title: 'SOC 2 Type II', sub: 'Annual independent audit' },
                { icon: <Lock size={24} color={C.blue} />,       title: 'AES-256',        sub: 'Encryption at rest' },
                { icon: <Globe size={24} color={C.teal} />,      title: 'GDPR Ready',     sub: 'EU data privacy compliant' },
                { icon: <Shield size={24} color={C.purple} />,   title: 'CCPA',           sub: 'US privacy compliance' },
                { icon: <Eye size={24} color={C.amber} />,       title: 'Full Audit Trail',sub: 'Every action logged' },
                { icon: <Server size={24} color={C.red} />,      title: '99.9% Uptime',   sub: 'Infrastructure SLA' },
              ].map(b => (
                <div key={b.title} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  {b.icon}
                  <div>
                    <div style={f({ fontSize: 14, fontWeight: 700, color: C.t1 })}>{b.title}</div>
                    <div style={f({ fontSize: 12, color: C.t3 })}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Pillars */}
      <section style={{ background: C.bg1, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Security Architecture</span>
            <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
              margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Six pillars of enterprise security.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PILLARS.map(p => (
              <div key={p.title} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: '28px', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                  background: `${p.color}16`, border: `1px solid ${p.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color }}>
                  {p.icon}
                </div>
                <h3 style={f({ fontSize: 15, fontWeight: 800, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.02em' })}>{p.title}</h3>
                <div style={f({ fontSize: 12, color: p.color, fontWeight: 600, marginBottom: 12 })}>{p.headline}</div>
                <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 16px' })}>{p.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {p.points.map(pt => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={11} color={p.color} style={{ flexShrink: 0 }} />
                      <span style={f({ fontSize: 12, color: C.t2 })}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Governance */}
      <section style={{ background: C.bg0, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Data Governance</span>
              <h2 style={f({ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: C.t1,
                margin: '14px 0 18px', letterSpacing: '-0.03em', lineHeight: 1.2 })}>
                Financial data governance built for enterprise.
              </h2>
              <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 28px' })}>
                Vantoryn treats governance as infrastructure — not an afterthought. Every permission, every data flow, every integration is controlled, auditable, and compliant.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Financial data isolation between entities', desc: 'Multi-entity setups maintain strict data separation' },
                  { label: 'Secure API integrations with minimal scope', desc: 'OAuth scopes limited to minimum required permissions' },
                  { label: 'Configurable data retention policies', desc: 'Set retention rules by data type and regulatory requirement' },
                  { label: 'Compliance workflow support', desc: 'SOX, GDPR, and CCPA workflow templates included' },
                ].map(i => (
                  <div key={i.label} style={{ display: 'flex', gap: 14, padding: '14px 16px',
                    background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 11 }}>
                    <CheckCircle2 size={14} color={C.teal} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={f({ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 })}>{i.label}</div>
                      <div style={f({ fontSize: 12, color: C.t3 })}>{i.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Compliance checklist */}
            <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20, padding: '32px 28px' }}>
              <div style={f({ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 20 })}>Compliance Coverage</div>
              {[
                { area: 'SOX',  items: ['Audit trail completeness', 'Access control evidence', 'Change management logs'] },
                { area: 'GDPR', items: ['Data processing agreement', 'Right to erasure', 'Data portability'] },
                { area: 'CCPA', items: ['Data inventory', 'Opt-out mechanisms', 'Third-party disclosure'] },
              ].map(c => (
                <div key={c.area} style={{ marginBottom: 20 }}>
                  <div style={f({ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', marginBottom: 10 })}>{c.area}</div>
                  {c.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9,
                      padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                      <CheckCircle2 size={12} color={C.green} />
                      <span style={f({ fontSize: 12, color: C.t2 })}>{item}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: C.green, fontWeight: 700, fontFamily: 'monospace' }}>✓ Covered</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: C.bg1, padding: '80px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={f({ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' })}>Security FAQ</span>
            <h2 style={f({ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: C.t1, margin: '14px 0 0', letterSpacing: '-0.03em' })}>
              Common security questions.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQ.map((item, i) => <FAQItem key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.bg0, padding: '72px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={f({ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.03em' })}>
            Security questions? Let's talk.
          </h2>
          <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.7, margin: '0 0 32px' })}>
            Our security team is available for enterprise security reviews, penetration test result discussions, and compliance questionnaires.
          </p>
          <button onClick={onBookDemo} style={f({
            fontSize: 15, fontWeight: 700, color: '#fff', background: C.green,
            border: 'none', borderRadius: 10, padding: '14px 32px', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            boxShadow: `0 4px 24px ${C.green}40`,
          })}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Request Security Documentation <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

