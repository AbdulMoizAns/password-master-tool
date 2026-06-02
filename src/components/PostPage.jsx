import { useEffect } from 'react'

const CAT_COLORS = {
  security: { bg: 'rgba(0,255,65,0.1)', color: '#00ff41', border: 'rgba(0,255,65,0.2)' },
  password: { bg: 'rgba(0,200,255,0.1)', color: '#00c8ff', border: 'rgba(0,200,255,0.2)' },
  phishing: { bg: 'rgba(255,160,0,0.1)', color: '#ffa000', border: 'rgba(255,160,0,0.2)' },
  privacy: { bg: 'rgba(160,0,255,0.1)', color: '#a000ff', border: 'rgba(160,0,255,0.2)' },
  breach: { bg: 'rgba(255,50,50,0.1)', color: '#ff5050', border: 'rgba(255,50,50,0.2)' },
}

function renderLine(line, i) {
  if (line.startsWith('### ')) return <h4 key={i} style={{ color: '#00ff41', fontSize: 13, margin: '20px 0 6px', opacity: 0.85 }}>{line.slice(4)}</h4>
  if (line.startsWith('## ')) return <h3 key={i} style={{ color: '#00ff41', fontSize: 15, margin: '24px 0 8px' }}>{line.slice(3)}</h3>
  if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#00ff41', fontSize: 18, margin: '16px 0 8px' }}>{line.slice(2)}</h2>
  if (line.startsWith('---')) return <hr key={i} style={{ borderColor: 'rgba(0,255,65,0.1)', margin: '16px 0' }} />
  if (/^\*\*.+\*\*$/.test(line.trim())) {
    const text = line.trim().slice(2, -2)
    return <p key={i} style={{ color: '#00ff41', fontWeight: 600, margin: '8px 0' }}>{text}</p>
  }
  if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 20, marginBottom: 4, listStyle: 'none', color: '#c0c0c8', fontSize: 13 }}>• {line.slice(2)}</li>
  if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
    return <li key={i} style={{ marginLeft: 20, marginBottom: 4, listStyle: 'none', color: '#c0c0c8', fontSize: 13 }}>{line}</li>
  }
  if (/^\*\*.+\*\*:/.test(line.trim())) {
    const idx = line.indexOf('**:')
    const bold = line.slice(0, idx + 2)
    const rest = line.slice(idx + 2)
    return <p key={i} style={{ margin: '6px 0', fontSize: 13 }}><strong style={{ color: '#00ff41' }}>{bold.slice(2)}</strong>{rest}</p>
  }
  if (line.startsWith('|')) return null
  if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
  return <p key={i} style={{ margin: '6px 0', fontSize: 13, lineHeight: 1.7 }}>{line}</p>
}

export default function PostPage({ post, onBack }) {
  const cc = CAT_COLORS[post.category] || CAT_COLORS.security

  // SEO
  useEffect(() => {
    document.title = `${post.title} — Password Master Security Blog`
    const meta = document.querySelector('meta[name="description"]') || (() => { const m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); return m })()
    meta.content = post.excerpt
    window.scrollTo(0, 0)
    return () => { document.title = 'Password Master – Secure Terminal' }
  }, [post])

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="no-select mb-4">
          <button onClick={onBack} className="text-xs px-3 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)]">
            ← BACK TO BLOG
          </button>
        </div>

        {/* Post header */}
        <header className="no-select border border-[var(--neon-glow)] rounded p-4 md:p-6 bg-[rgba(0,255,65,0.02)] mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.border}` }}>
              {post.category.toUpperCase()}
            </span>
            <span className="text-[10px] text-[rgba(0,255,65,0.3)]">{post.readTime}</span>
          </div>
          <h1 className="text-lg md:text-2xl font-bold neon-text leading-snug mb-2">{post.title}</h1>
          <p className="text-[11px] text-[rgba(0,255,65,0.4)]">Password Master Security Blog — Educational Content</p>
        </header>

        {/* Post content */}
        <article className="border border-[var(--neon-glow)] rounded p-4 md:p-6 bg-[rgba(0,255,65,0.01)] mb-4"
          style={{ color: '#c0c0c8', lineHeight: 1.8 }}
          itemScope itemType="https://schema.org/Article"
        >
          <div itemProp="articleBody">
            {post.content.split('\n').map((line, i) => renderLine(line, i))}
          </div>
        </article>

        {/* Navigation footer */}
        <div className="no-select flex items-center justify-between border border-[var(--neon-glow)] rounded p-3 bg-[rgba(0,255,65,0.01)] mb-4">
          <button onClick={onBack} className="text-xs px-3 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)]">← BACK TO BLOG</button>
          <span className="text-[10px] text-[rgba(0,255,65,0.3)]">Password Master Security Education</span>
        </div>

        {/* Footer */}
        <footer className="no-select border border-[var(--neon-glow)] rounded p-3 bg-[rgba(0,255,65,0.01)]">
          <div className="text-center text-[10px] text-[rgba(0,255,65,0.3)]">
            <span className="text-[var(--neon)] cursor">$_&gt; BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4</span>
            <div className="mt-1">⚠️ This content is for educational purposes only. Learn how to protect your digital identity.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
