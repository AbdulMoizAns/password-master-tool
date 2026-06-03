import { useState, useEffect, useMemo } from 'react'
import { buildPostsFromGlob, CATEGORIES, CATEGORY_LABELS } from '../lib/blog'

const CAT_COLORS = {
  security: { bg: 'rgba(0,255,65,0.1)', color: '#00FF41', border: 'rgba(0,255,65,0.2)' },
  password: { bg: 'rgba(0,200,255,0.1)', color: '#00c8ff', border: 'rgba(0,200,255,0.2)' },
  phishing: { bg: 'rgba(255,215,0,0.1)', color: '#FFD700', border: 'rgba(255,215,0,0.2)' },
  privacy: { bg: 'rgba(160,0,255,0.1)', color: '#a000ff', border: 'rgba(160,0,255,0.2)' },
  breach: { bg: 'rgba(255,49,49,0.1)', color: '#FF3131', border: 'rgba(255,49,49,0.2)' },
}

export default function Blog({ onOpenPost }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const modules = import.meta.glob('../../blog-posts/*.md', { query: '?raw', import: 'default', eager: false })
      const entries = []
      for (const [path, loader] of Object.entries(modules)) {
        const content = await loader()
        entries.push({ path, content })
      }
      const map = {}
      for (const e of entries) map[e.path] = e.content
      setPosts(buildPostsFromGlob(map))
    }
    load()
  }, [])

  useEffect(() => {
    document.title = 'Security Blog — checkself.site'
    const meta = document.querySelector('meta[name="description"]') || (() => { const m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); return m })()
    meta.content = 'Learn about password security, phishing prevention, data breaches, and cybersecurity best practices at Password Master Security Education Blog.'
    return () => { document.title = 'checkself.site – Password Security Analyzer' }
  }, [])

  const filtered = useMemo(() => {
    let f = filter === 'all' ? posts : posts.filter(p => p.category === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      f = f.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    }
    return f
  }, [posts, filter, search])

  return (
    <div className="min-h-screen p-3 md:p-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="no-select mb-6 bento-panel">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl md:text-2xl font-bold neon-text tracking-widest">SECURITY EDUCATION BLOG</h1>
            <button onClick={() => onOpenPost?.(null, true)} className="btn btn-primary">
              ← BACK TO TERMINAL
            </button>
          </div>
          <div className="text-[10px] md:text-xs text-muted tracking-widest">
            Learn about password security, phishing prevention, data breaches, and best practices to protect your digital identity.
          </div>
        </header>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input-field flex-1 min-w-[200px]"
          />
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`text-[10px] px-3 py-1.5 rounded border tracking-widest transition-all ${filter === c ? 'border-[var(--accent)] neon-text-sm bg-[rgba(0,255,65,0.08)]' : 'border-[var(--border-subtle)] text-muted hover:border-[var(--border-default)]'}`}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {filtered.length === 0 && <div className="text-sm text-muted text-center py-8">No posts found.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filtered.map(post => {
            const cc = CAT_COLORS[post.category] || CAT_COLORS.security
            return (
              <article key={post.id}
                onClick={() => onOpenPost?.(post)}
                className="bento-panel cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.border}` }}>
                    {post.category.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-muted">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-bold neon-text-sm mb-2 leading-snug">{post.title}</h2>
                <p className="text-[11px] text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="mt-3 text-[10px] neon-text-sm flex items-center gap-1">
                  READ MORE →
                </div>
              </article>
            )
          })}
        </div>

        {/* Footer */}
        <footer className="no-select bento-panel">
          <div className="text-center text-[10px] text-muted">
            <span className="neon-text cursor">$_&gt; BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4</span>
            <div className="mt-1">© 2024 Password Master — {posts.length} educational articles on cybersecurity awareness</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
