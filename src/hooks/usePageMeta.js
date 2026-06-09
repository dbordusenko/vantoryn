/**
 * usePageMeta — updates document title + meta description on each page navigation.
 * Since this is a SPA, Google will see the default index.html meta on first crawl,
 * but social sharing and return visits benefit from dynamic updates.
 */

const PAGE_META = {
  home: {
    title: 'Vantoryn — AI Financial Operating System',
    description: 'Automate your entire finance operation. Month-end close in 48 hours. Real-time cash intelligence. AI-generated board packs. Built for CFOs and finance leaders.',
  },
  platform: {
    title: 'Platform — Vantoryn AI Finance',
    description: 'Explore Vantoryn\'s AI finance platform: automated reconciliation, cash flow forecasting, FP&A automation, and real-time ERP integration.',
  },
  solutions: {
    title: 'Solutions for Finance Teams — Vantoryn',
    description: 'AI finance automation solutions for CFOs, Controllers, and FP&A teams. Month-end close, budgeting, treasury, and compliance — automated.',
  },
  pricing: {
    title: 'Pricing — Vantoryn AI Financial OS',
    description: 'Vantoryn is financial infrastructure, not a monthly subscription tool. Enterprise pricing built around the value delivered to your organization.',
  },
  security: {
    title: 'Security & Compliance — Vantoryn',
    description: 'Enterprise-grade security for financial data. SOC 2 infrastructure, AES-256 encryption, TLS 1.3, VPC isolation. Your data never leaves your control.',
  },
  insights: {
    title: 'Finance Insights & Intelligence — Vantoryn',
    description: 'AI-powered intelligence briefs for finance leaders. Weekly analysis on AI in FP&A, treasury automation, and financial operations.',
  },
  'health-score': {
    title: 'Finance Health Score — Vantoryn',
    description: 'Assess your finance team\'s automation readiness. Get a personalized score and roadmap for AI-driven financial operations.',
  },
}

export function usePageMeta(page) {
  const meta = PAGE_META[page] || PAGE_META.home

  // Update document title
  document.title = meta.title

  // Update meta description
  let descEl = document.querySelector('meta[name="description"]')
  if (descEl) descEl.setAttribute('content', meta.description)

  // Update OG title
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', meta.title)

  // Update OG description
  let ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', meta.description)

  // Update OG url
  let ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) ogUrl.setAttribute('content', `https://vantoryn.vercel.app/${page === 'home' ? '' : page}`)

  // Update canonical
  let canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', `https://vantoryn.vercel.app/${page === 'home' ? '' : page}`)
}
