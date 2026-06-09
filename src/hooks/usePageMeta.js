import { useEffect } from 'react'

const BASE_URL = 'https://vantoryn.vercel.app'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

const PAGE_META = {
  home: {
    title: 'Vantoryn — AI Financial Operating System',
    description: 'Automate your entire finance operation. Month-end close in 48 hours. Real-time cash intelligence. AI-generated board packs. Built for CFOs and finance leaders.',
    image: DEFAULT_IMAGE,
    path: '',
  },
  platform: {
    title: 'Platform — Vantoryn AI Finance',
    description: 'Automated reconciliation, cash flow forecasting, FP&A automation, and real-time ERP integration. One unified platform for modern finance teams.',
    image: DEFAULT_IMAGE,
    path: 'platform',
  },
  solutions: {
    title: 'Finance Automation Solutions — Vantoryn',
    description: 'AI finance automation for CFOs, Controllers, and FP&A teams. Month-end close, budgeting, treasury, and compliance — all automated.',
    image: DEFAULT_IMAGE,
    path: 'solutions',
  },
  pricing: {
    title: 'Pricing — Vantoryn AI Financial OS',
    description: 'Vantoryn is financial infrastructure, not a monthly subscription. Enterprise pricing built around the value it delivers to your organization.',
    image: DEFAULT_IMAGE,
    path: 'pricing',
  },
  security: {
    title: 'Security & Compliance — Vantoryn',
    description: 'SOC 2 infrastructure, AES-256 field-level encryption, TLS 1.3, VPC isolation per tenant. Your financial data is protected at every layer.',
    image: DEFAULT_IMAGE,
    path: 'security',
  },
  insights: {
    title: 'Finance AI Insights — Vantoryn',
    description: 'Weekly intelligence for finance leaders: AI in FP&A, treasury automation, month-end close best practices, and financial operations strategy.',
    image: DEFAULT_IMAGE,
    path: 'insights',
  },
  'health-score': {
    title: 'Finance Health Score — Vantoryn',
    description: 'Assess your finance automation readiness in 3 minutes. Get a personalized score and AI-powered roadmap for your finance operations.',
    image: DEFAULT_IMAGE,
    path: 'health-score',
  },
  privacy: {
    title: 'Privacy Policy — Vantoryn',
    description: 'Vantoryn Privacy Policy — how we collect, use, and protect your information.',
    image: DEFAULT_IMAGE,
    path: 'privacy',
  },
  terms: {
    title: 'Terms of Service — Vantoryn',
    description: 'Vantoryn Terms of Service — terms governing use of the Vantoryn website and services.',
    image: DEFAULT_IMAGE,
    path: 'terms',
  },
}

function setMeta(name, value, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel, value) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', value)
}

export function usePageMeta(page) {
  useEffect(() => {
    const meta = PAGE_META[page] ?? PAGE_META.home
    const url = `${BASE_URL}/${meta.path}`

    // Title
    document.title = meta.title

    // Standard meta
    setMeta('description', meta.description)
    setMeta('robots', 'index, follow')

    // Open Graph
    setMeta('og:type',        'website',       'property')
    setMeta('og:title',       meta.title,      'property')
    setMeta('og:description', meta.description,'property')
    setMeta('og:url',         url,             'property')
    setMeta('og:image',       meta.image,      'property')
    setMeta('og:image:width', '1200',          'property')
    setMeta('og:image:height','630',           'property')
    setMeta('og:site_name',   'Vantoryn',      'property')

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:title',       meta.title)
    setMeta('twitter:description', meta.description)
    setMeta('twitter:image',       meta.image)

    // Canonical
    setLink('canonical', url)
  }, [page])
}
