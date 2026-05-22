import { useState } from 'react'
import { ArrowRight, BookOpen, Clock, ChevronRight, TrendingUp } from 'lucide-react'
import { C, f } from '../tokens'

const ARTICLES = [
  {
    category: 'FP&A',
    tag: 'Strategy',
    color: C.blue,
    title: 'Why Finance Teams Remain Reactive — And What to Do About It',
    excerpt: 'Most finance functions are built for a world where data moved slowly. Here\'s why the structural problem goes deeper than tooling, and how predictive finance changes the equation.',
    readTime: '8 min read',
    date: 'May 19, 2026',
    featured: true,
    points: [
      'The ERP data lag problem most CFOs accept as normal',
      'Why Excel-based reporting creates structural blindspots',
      'The predictive finance maturity model',
      'Three organizations that made the transition in under 90 days',
    ],
  },
  {
    category: 'Operations',
    tag: 'Benchmark',
    color: C.teal,
    title: 'The Hidden Cost of Spreadsheet-Driven Finance Operations',
    excerpt: 'A survey of 200 mid-market finance teams quantifies what everyone already knows: manual finance operations carry a cost that rarely appears on the income statement.',
    readTime: '6 min read',
    date: 'May 14, 2026',
    points: [
      '43% of FP&A hours spent on non-value tasks',
      'Average $2.1M annual cost per finance team',
      'The compounding cost of delayed decisions',
    ],
  },
  {
    category: 'AI',
    tag: 'Insight',
    color: C.purple,
    title: 'AI and the Future of FP&A: What Actually Changes',
    excerpt: 'Beyond the hype, AI has specific, measurable impacts on financial planning and analysis functions. This piece separates the signal from the noise.',
    readTime: '7 min read',
    date: 'May 9, 2026',
    points: [
      'Where ML forecasting outperforms human analysts',
      'The 3 FP&A workflows that automate cleanly',
      'What AI still cannot do in finance',
    ],
  },
  {
    category: 'Leadership',
    tag: 'CFO',
    color: C.amber,
    title: 'How Predictive Finance Changes Executive Decision-Making',
    excerpt: 'When CFOs have 30–90 day financial risk visibility, the entire executive decision cycle changes. A framework for leading with financial intelligence.',
    readTime: '5 min read',
    date: 'May 5, 2026',
    points: [
      'The decision-latency problem in modern businesses',
      'From reactive to predictive: a CFO framework',
      'Case study: $80M manufacturer cuts decision cycle by 60%',
    ],
  },
  {
    category: 'Operations',
    tag: 'Playbook',
    color: C.green,
    title: 'The Month-End Close Playbook: From 14 Days to 3',
    excerpt: 'A step-by-step operational playbook for finance teams that want to compress their close cycle without sacrificing accuracy or audit readiness.',
    readTime: '10 min read',
    date: 'April 28, 2026',
    points: [
      'Mapping the current close — where time actually goes',
      'The 4 automation levers that matter most',
      'Implementation sequencing by team size',
    ],
  },
  {
    category: 'AI',
    tag: 'Technical',
    color: C.red,
    title: 'Why Reporting Cycles Are Broken — And How AI Fixes the Root Cause',
    excerpt: 'The reporting cycle problem is not a process problem. It\'s a data architecture problem. This piece explains why ERP-first reporting is inherently reactive, and what the alternative looks like.',
    readTime: '9 min read',
    date: 'April 21, 2026',
    points: [
      'The ERP-first reporting architecture failure mode',
      'What a real-time financial data model looks like',
      'Moving from periodic to continuous financial intelligence',
    ],
  },
]

const CATEGORIES = ['All', 'FP&A', 'Operations', 'AI', 'Leadership']

const CATEGORY_COLORS = {
  'FP&A': C.blue, Operations: C.teal, AI: C.purple, Leadership: C.amber
}

export default function Insights({ navigate }) {
  const [category, setCategory] = useState('All')
  const filtered = category === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === category)
  const featured = filtered.find(a => a.featured) || filtered[0]
  const rest = filtered.filter(a => !a.featured || a !== featured)

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 66, animation: 'pageFade 0.3s ease' }}>
      <style>{`@keyframes pageFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <section style={{ background: C.bg0, padding: '72px 28px 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.4 }} />
        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
            marginBottom: 24, background: `${C.purple}14`, border: `1px solid ${C.purple}35` }}>
            <BookOpen size={12} color={C.purple} />
            <span style={f({ fontSize: 12, color: C.purple, fontWeight: 600, letterSpacing: '0.04em' })}>Executive Insights</span>
          </div>
          <h1 style={f({ fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, color: C.t1,
            margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 1.1 })}>
            Intelligence for finance leaders<br />
            <span style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              who operate on data.
            </span>
          </h1>
          <p style={f({ fontSize: 16, color: C.t2, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' })}>
            Practical frameworks, research, and strategic thinking on predictive finance, FP&A, and AI-driven financial operations.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.bg1, padding: '0 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', gap: 4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={f({
              padding: '14px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: `2px solid ${category === cat ? (CATEGORY_COLORS[cat] || C.blue) : 'transparent'}`,
              color: category === cat ? (CATEGORY_COLORS[cat] || C.blue) : C.t2,
              fontSize: 13, fontWeight: category === cat ? 700 : 500, transition: 'all 0.2s',
            })}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section style={{ background: C.bg0, padding: '56px 28px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>

          {/* Featured */}
          {featured && (
            <div style={{ background: C.bg2, border: `1px solid ${C.borderMid}`, borderRadius: 20,
              padding: '40px', marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48,
              position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = featured.color + '50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderMid}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: featured.color }} />
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ padding: '3px 10px', borderRadius: 5,
                    background: `${featured.color}16`, border: `1px solid ${featured.color}35` }}>
                    <span style={f({ fontSize: 11, color: featured.color, fontWeight: 700 })}>{featured.tag}</span>
                  </div>
                  <div style={{ padding: '3px 10px', borderRadius: 5, background: C.bg3 }}>
                    <span style={f({ fontSize: 11, color: C.t3 })}>{featured.category}</span>
                  </div>
                  <span style={f({ fontSize: 11, color: C.t3 })}>Featured</span>
                </div>
                <h2 style={f({ fontSize: 24, fontWeight: 800, color: C.t1, margin: '0 0 16px',
                  letterSpacing: '-0.02em', lineHeight: 1.3 })}>{featured.title}</h2>
                <p style={f({ fontSize: 14, color: C.t2, lineHeight: 1.75, margin: '0 0 24px' })}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={f({ fontSize: 12, color: C.t3 })}>{featured.date}</span>
                  <span style={f({ fontSize: 12, color: C.t3 })}>{featured.readTime}</span>
                </div>
              </div>
              <div>
                <div style={f({ fontSize: 12, color: C.t3, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginBottom: 16 })}>In this piece</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {featured.points.map(pt => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '12px 14px', borderRadius: 10, background: C.bg3, border: `1px solid ${C.border}` }}>
                      <ChevronRight size={13} color={featured.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={f({ fontSize: 13, color: C.t2, lineHeight: 1.5 })}>{pt}</span>
                    </div>
                  ))}
                </div>
                <button style={f({
                  display: 'flex', alignItems: 'center', gap: 8, marginTop: 24,
                  background: featured.color, border: 'none', borderRadius: 9,
                  padding: '11px 22px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 14,
                  boxShadow: `0 4px 16px ${featured.color}40`, transition: 'all 0.2s',
                })}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Read Article <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div key={category} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
            animation: 'pageFade 0.25s ease' }}>
            {rest.map((article, i) => {
              const catColor = CATEGORY_COLORS[article.category] || C.blue
              return (
                <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                  borderRadius: 16, padding: '24px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = catColor + '50'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${catColor}14` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                    <div style={{ padding: '3px 9px', borderRadius: 5,
                      background: `${catColor}14`, border: `1px solid ${catColor}30` }}>
                      <span style={f({ fontSize: 10, color: catColor, fontWeight: 700 })}>{article.tag}</span>
                    </div>
                    <div style={{ padding: '3px 9px', borderRadius: 5, background: C.bg3 }}>
                      <span style={f({ fontSize: 10, color: C.t3 })}>{article.category}</span>
                    </div>
                  </div>
                  <h3 style={f({ fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 12px',
                    letterSpacing: '-0.02em', lineHeight: 1.4 })}>{article.title}</h3>
                  <p style={f({ fontSize: 13, color: C.t2, lineHeight: 1.65, margin: '0 0 18px' })}>{article.excerpt}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                    {article.points.map(pt => (
                      <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <ChevronRight size={11} color={catColor} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={f({ fontSize: 12, color: C.t3, lineHeight: 1.5 })}>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={f({ fontSize: 11, color: C.t3 })}>{article.date}</span>
                      <span style={f({ fontSize: 11, color: C.t3 })}>{article.readTime}</span>
                    </div>
                    <ArrowRight size={14} color={catColor} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ background: C.bg1, padding: '72px 28px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 28 }}>
            <TrendingUp size={32} color={C.blue} style={{ margin: '0 auto 16px' }} />
            <h2 style={f({ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: C.t1,
              margin: '0 0 14px', letterSpacing: '-0.03em' })}>
              Weekly intelligence for finance leaders.
            </h2>
            <p style={f({ fontSize: 15, color: C.t2, lineHeight: 1.7 })}>
              One email, every Monday. Practical frameworks, benchmarks, and research on predictive finance and FP&A. No fluff.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}>
            <input type="email" placeholder="CFO email address"
              style={f({
                flex: 1, padding: '12px 16px', borderRadius: 9,
                background: C.bg3, border: `1px solid ${C.borderMid}`,
                color: C.t1, fontSize: 14, outline: 'none',
              })}
              onFocus={e => e.target.style.borderColor = C.blue}
              onBlur={e => e.target.style.borderColor = C.borderMid}
            />
            <button style={f({
              fontSize: 14, fontWeight: 700, color: '#fff', background: C.blue,
              border: 'none', borderRadius: 9, padding: '12px 22px', cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
              boxShadow: `0 4px 16px ${C.blue}40`,
            })}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Subscribe
            </button>
          </div>
          <div style={f({ fontSize: 11, color: C.t3, marginTop: 14 })}>
            3,200+ finance leaders subscribed · Unsubscribe anytime
          </div>
        </div>
      </section>
    </div>
  )
}
