import { useState, useEffect } from 'react'
import { Copy, Check, Shield } from 'lucide-react'
import { createTOTPSecret, generateTOTP } from '../lib/totp'

export default function TotpWidget() {
  const [secret] = useState(() => createTOTPSecret())
  const [totp, setTotp] = useState('------')
  const [expiresIn, setExpiresIn] = useState(30)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const gi = setInterval(() => generateTOTP(secret).then(r => { setTotp(r.totp); setExpiresIn(r.expiresIn) }).catch(() => {}), 5000)
    const ci = setInterval(() => {
      const rem = 30 - (Math.floor(Date.now() / 1000) % 30)
      setExpiresIn(rem)
    }, 1000)
    generateTOTP(secret).then(r => { setTotp(r.totp); setExpiresIn(r.expiresIn) }).catch(() => {})
    return () => { clearInterval(gi); clearInterval(ci) }
  }, [secret])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(totp)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* noop */ }
  }

  const pct = (expiresIn / 30) * 100
  const circleColor = expiresIn > 10 ? 'var(--accent)' : expiresIn > 5 ? 'var(--warning)' : 'var(--danger)'

  return (
    <section className="no-select bento-panel">
      <div className="bento-panel-header">
        <h2 className="bento-panel-title">[ totp.2fa ]</h2>
        <div className="flex items-center gap-1 text-[10px] text-muted">
          <Shield size={12} /> 30S ROTATION
        </div>
      </div>

      <div className="text-center py-3">
        <div className="text-3xl md:text-4xl font-bold tracking-[0.25em] neon-text mb-2 allow-select"
          style={{ textShadow: '0 0 10px rgba(0,255,65,0.4)' }}>
          {totp}
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ borderColor: circleColor, color: circleColor, boxShadow: `0 0 4px ${circleColor}40` }}>
            {expiresIn}
          </div>
          <div className="w-24 h-1.5 bg-black/60 rounded overflow-hidden border border-[var(--border-subtle)]">
            <div className="h-full rounded transition-all duration-1000" style={{ width: `${pct}%`, background: circleColor, boxShadow: `0 0 4px ${circleColor}` }} />
          </div>
          <button onClick={copyCode} className={`btn min-h-0 py-1 ${copied ? 'btn-copied' : ''}`}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="text-[9px] text-muted text-center">
        Secret: <span className="neon-text-sm font-mono text-[8px] break-all">{secret}</span>
      </div>
      <div className="text-[9px] text-muted mt-1 text-center">
        Educational simulation only. Not connected to any real authentication service.
      </div>
    </section>
  )
}
