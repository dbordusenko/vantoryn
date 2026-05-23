# Vantoryn — AI Financial Operating System

Marketing site + SaaS product UI built with React 18 + Vite.

## Stack

- **React 18** + **Vite 5**
- **lucide-react** — icons
- **CSS-in-JS** via inline styles (no Tailwind, no CSS modules)
- State-based routing (no react-router)
- Hand-coded SVG charts

## Pages

| Route (state) | Description |
|---|---|
| `home` | Landing page |
| `platform` | Product architecture |
| `solutions` | Role-based personas (CFO / FP&A / Controller / CEO) |
| `security` | Enterprise trust & compliance |
| `pricing` | ROI calculator + pricing tiers |
| `insights` | Executive blog |
| `product` | **Full SaaS product UI** |

## Product App Views

Overview · Forecasting · Reports · AI Brief · Alerts · Integrations · Settings · Getting Started

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## CSV Demo Import

1. Open the app → Integrations → scroll to "Import Financial Data"
2. Click **Download Demo CSV** — get `vantoryn_acme_corp_demo.csv`
3. Edit the numbers in Excel/Sheets
4. Drop the file back → dashboard updates live

## Deploy

```bash
npm run build
vercel --prod
```

## Design Tokens

All colors, fonts, and helpers live in `src/tokens.js`:

```js
import { C, f, FONT } from './tokens'
// C.blue, C.teal, C.t1...t4, C.bg0...bg4
// f({ fontSize: 14, color: C.t1 }) → adds fontFamily automatically
```

