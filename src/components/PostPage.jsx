import { useEffect } from 'react'

const CAT_COLORS = {
  security: { bg: 'rgba(0,255,65,0.1)', color: '#00FF41', border: 'rgba(0,255,65,0.2)' },
  password: { bg: 'rgba(0,200,255,0.1)', color: '#00c8ff', border: 'rgba(0,200,255,0.2)' },
  phishing: { bg: 'rgba(255,215,0,0.1)', color: '#FFD700', border: 'rgba(255,215,0,0.2)' },
  privacy: { bg: 'rgba(160,0,255,0.1)', color: '#a000ff', border: 'rgba(160,0,255,0.2)' },
  breach: { bg: 'rgba(255,49,49,0.1)', color: '#FF3131', border: 'rgba(255,49,49,0.2)' },
}

function renderLine(line, i) {
  if (line.startsWith('### ')) return <h4 key={i} style={{ color: '#00FF41', fontSize: 13, margin: '20px 0 6px', opacity: 0.85 }}>{line.slice(4)}</h4>
  if (line.startsWith('## ')) return <h3 key={i} style={{ color: '#00FF41', fontSize: 15, margin: '24px 0 8px' }}>{line.slice(3)}</h3>
  if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#00FF41', fontSize: 18, margin: '16px 0 8px' }}>{line.slice(2)}</h2>
  if (line.startsWith('---')) return <hr key={i} style={{ borderColor: 'rgba(0,255,65,0.1)', margin: '16px 0' }} />
  if (/^\*\*.+\*\*$/.test(line.trim())) {
    const text = line.trim().slice(2, -2)
    return <p key={i} style={{ color: '#00FF41', fontWeight: 600, margin: '8px 0' }}>{text}</p>
  }
  if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 20, marginBottom: 4, listStyle: 'none', color: '#c0c0c8', fontSize: 13 }}>• {line.slice(2)}</li>
  if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
    return <li key={i} style={{ marginLeft: 20, marginBottom: 4, listStyle: 'none', color: '#c0c0c8', fontSize: 13 }}>{line}</li>
  }
  if (/^\*\*.+\*\*:/.test(line.trim())) {
    const idx = line.indexOf('**:')
    const bold = line.slice(0, idx + 2)
    const rest = line.slice(idx + 2)
    return <p key={i} style={{ margin: '6px 0', fontSize: 13 }}><strong style={{ color: '#00FF41' }}>{bold.slice(2)}</strong>{rest}</p>
  }
  if (line.startsWith('|')) return null
  if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
  return <p key={i} style={{ margin: '6px 0', fontSize: 13, lineHeight: 1.7 }}>{line}</p>
}

export default function PostPage({ post, onBack }) {
  const cc = CAT_COLORS[post.category] || CAT_COLORS.security

  useEffect(() => {
    document.title = `${post.title} — checkself.site Security Blog`
    const meta = document.querySelector('meta[name="description"]') || (() => { const m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); return m })()
    meta.content = post.excerpt
    window.scrollTo(0, 0)
    return () => { document.title = 'checkself.site – Password Security Analyzer' }
  }, [post])

  return (
    <div className="min-h-screen p-3 md:p-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="no-select mb-4">
          <button onClick={onBack} className="btn btn-primary">
            ← BACK TO BLOG
          </button>
        </div>

        {/* Post header */}
        <header className="no-select bento-panel mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.border}` }}>
              {post.category.toUpperCase()}
            </span>
            <span className="text-[10px] text-muted">{post.readTime}</span>
          </div>
          <h1 className="text-lg md:text-2xl font-bold neon-text leading-snug mb-2">{post.title}</h1>
          <p className="text-[11px] text-muted">Password Master Security Blog — Educational Content</p>
        </header>

        {/* Post content */}
        <article className="bento-panel mb-4"
          style={{ color: '#c0c0c8', lineHeight: 1.8 }}
          itemScope itemType="https://schema.org/Article"
        >
          <div itemProp="articleBody">
            {post.content.split('\n').map((line, i) => renderLine(line, i))}
          </div>
        </article>

        {/* Navigation footer */}
        <div className="no-select flex items-center justify-between bento-panel mb-4">
          <button onClick={onBack} className="btn btn-primary">← BACK TO BLOG</button>
          <span className="text-[10px] text-muted">Password Master Security Education</span>
        </div>

        {/* Footer */}
        <footer className="no-select bento-panel">
          <div className="text-center text-[10px] text-muted">
            <span className="neon-text cursor">$_&gt; BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4</span>
            <div className="mt-1">This content is for educational purposes only. Learn how to protect your digital identity.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
