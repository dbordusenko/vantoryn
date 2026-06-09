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

export default function Terms() {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 28px' }}>

        <div style={{ marginBottom: 52 }}>
          <h1 style={f({ fontSize: 36, fontWeight: 800, color: C.t1, marginBottom: 12 })}>Terms of Service</h1>
          <p style={f({ fontSize: 13, color: C.t3 })}>Effective date: June 1, 2026 · Last updated: June 8, 2026</p>
        </div>

        <Section title="Acceptance of Terms">
          <P>By accessing or using https://vantoryn.vercel.app (the "Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.</P>
        </Section>

        <Section title="Description of Service">
          <P>Vantoryn provides an AI Financial Operating System for finance teams. The Site is a marketing and information resource. Access to the Vantoryn platform product requires a separate subscription agreement.</P>
          <P>Demo requests, health score assessments, and other tools on this Site are provided for evaluation purposes only and do not constitute a binding agreement or service delivery.</P>
        </Section>

        <Section title="Intellectual Property">
          <P>All content on this Site — including text, graphics, logos, and software — is the property of Vantoryn and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without express written permission.</P>
        </Section>

        <Section title="Use of the Site">
          <P>You agree not to:</P>
          <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
            {[
              'Use the Site for any unlawful purpose',
              'Submit false or misleading information through our forms',
              'Attempt to gain unauthorized access to any part of the Site',
              'Scrape, crawl, or systematically copy Site content',
              'Transmit malware, viruses, or harmful code',
            ].map(item => (
              <li key={item} style={f({ fontSize: 14, color: C.t2, lineHeight: 2 })}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Disclaimer of Warranties">
          <P>The Site and its content are provided "as is" without warranties of any kind, express or implied. Vantoryn does not warrant that the Site will be error-free, uninterrupted, or free of viruses.</P>
          <P>Financial metrics, benchmarks, and outcomes cited on this Site (e.g., "close in 48 hours", "74% reduction") represent illustrative customer outcomes and are not guarantees of specific results.</P>
        </Section>

        <Section title="Limitation of Liability">
          <P>To the maximum extent permitted by law, Vantoryn shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Site. Our total liability for any claim arising from use of the Site shall not exceed $100.</P>
        </Section>

        <Section title="Third-Party Links">
          <P>The Site may contain links to third-party websites. Vantoryn is not responsible for the content or privacy practices of those sites. Links do not constitute endorsement.</P>
        </Section>

        <Section title="Changes to Terms">
          <P>We reserve the right to modify these terms at any time. We will update the "last updated" date above when changes are made. Continued use of the Site constitutes acceptance of the revised terms.</P>
        </Section>

        <Section title="Governing Law">
          <P>These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved in the competent courts of the jurisdiction in which Vantoryn operates.</P>
        </Section>

        <Section title="Contact">
          <P>Questions about these Terms? Email us at <a href="mailto:contact@vantoryn.com" style={{ color: C.blue }}>contact@vantoryn.com</a>.</P>
        </Section>

      </div>
    </div>
  )
}
