import { useState, useEffect } from 'react'
import { Copy, Check, Shield } from 'lucide-react'
import { createTOTPSecret, generateTOTP } from '../lib/totp'

export default function TotpWidget() {
  const [secret] = useState(() => createTOTPSecret())
  const [totp, setTotp] = useState('------')
  const [expiresIn, setExpiresIn] = useState(30)
  const [copied, setCopied] = useState(false)

  // Run every 5s for new code, every 1s for countdown
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
  const circleColor = expiresIn > 10 ? '#00ff41' : expiresIn > 5 ? '#ffa000' : '#ff5050'

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ totp.2fa ]</h2>
        <div className="flex items-center gap-1 text-[10px] text-[rgba(0,255,65,0.3)]">
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
          <div className="w-24 h-1.5 bg-black/60 rounded overflow-hidden border border-[var(--neon-glow)]">
            <div className="h-full rounded transition-all duration-1000" style={{ width: `${pct}%`, background: circleColor, boxShadow: `0 0 4px ${circleColor}` }} />
          </div>
          <button onClick={copyCode} className="text-[10px] px-2 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)] flex items-center gap-1">
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="text-[9px] text-[rgba(0,255,65,0.3)] text-center">
        Secret: <span className="text-[var(--neon)] font-mono text-[8px] break-all">{secret}</span>
      </div>
      <div className="text-[9px] text-[rgba(0,255,65,0.2)] mt-1 text-center">
        Educational simulation only. Not connected to any real authentication service.
      </div>
    </section>
  )
}
