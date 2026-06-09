import { C, f } from '../tokens'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={f({ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 12 })}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children }) {
  return <p style={f({ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 12px' })}>{children}</p>
}

export default function Privacy() {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 28px' }}>

        <div style={{ marginBottom: 52 }}>
          <h1 style={f({ fontSize: 36, fontWeight: 800, color: C.t1, marginBottom: 12 })}>Privacy Policy</h1>
          <p style={f({ fontSize: 13, color: C.t3 })}>Effective date: June 1, 2026 · Last updated: June 8, 2026</p>
        </div>

        <Section title="Overview">
          <P>Vantoryn ("we", "us", or "our") operates https://vantoryn.vercel.app. This Privacy Policy explains how we collect, use, and protect information when you visit our website or use our services.</P>
          <P>By using Vantoryn, you agree to the collection and use of information in accordance with this policy.</P>
        </Section>

        <Section title="Information We Collect">
          <P><strong style={{ color: C.t1 }}>Information you provide:</strong> When you book a demo, request a health score, or contact us, we collect your name, work email, company name, and role. This information is used solely to respond to your inquiry and schedule requested meetings.</P>
          <P><strong style={{ color: C.t1 }}>Usage data:</strong> We may collect anonymized analytics data about how visitors interact with our site (pages visited, time spent). This data is aggregated and does not identify individual users.</P>
          <P><strong style={{ color: C.t1 }}>Cookies:</strong> We use minimal functional cookies required to operate the site. We do not use advertising or cross-site tracking cookies.</P>
        </Section>

        <Section title="How We Use Your Information">
          <P>We use collected information to:</P>
          <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
            {[
              'Respond to demo requests and schedule calls',
              'Send your Finance Health Score report',
              'Improve the website and product experience',
              'Communicate product updates (only if you opt in)',
            ].map(item => (
              <li key={item} style={f({ fontSize: 14, color: C.t2, lineHeight: 2 })}>{item}</li>
            ))}
          </ul>
          <P>We do not sell, rent, or share your personal information with third parties for marketing purposes.</P>
        </Section>

        <Section title="Data Storage and Security">
          <P>Lead data submitted through our forms is transmitted securely (HTTPS/TLS 1.3) and stored in internal systems accessible only to authorized Vantoryn team members. We retain contact information for up to 24 months unless you request deletion.</P>
          <P>Our infrastructure runs on Vercel, which maintains SOC 2 Type II compliance for its platform services.</P>
        </Section>

        <Section title="Your Rights">
          <P>You may request to access, correct, or delete your personal information at any time by emailing us at <a href="mailto:contact@vantoryn.com" style={{ color: C.blue }}>contact@vantoryn.com</a>. We will respond within 30 days.</P>
          <P>If you are a resident of the European Economic Area (EEA), you have rights under GDPR including the right to erasure, portability, and to lodge a complaint with a supervisory authority.</P>
        </Section>

        <Section title="Third-Party Services">
          <P>We use the following third-party services to operate our site:</P>
          <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
            {[
              'Vercel — hosting and edge delivery',
              'Google Fonts — typography (fonts loaded from Google servers)',
              'Telegram — internal lead notifications (not shared externally)',
            ].map(item => (
              <li key={item} style={f({ fontSize: 14, color: C.t2, lineHeight: 2 })}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the "last updated" date at the top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.</P>
        </Section>

        <Section title="Contact">
          <P>Questions about this policy? Contact us at <a href="mailto:contact@vantoryn.com" style={{ color: C.blue }}>contact@vantoryn.com</a>.</P>
        </Section>

      </div>
    </div>
  )
}
