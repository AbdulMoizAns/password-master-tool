import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import { sha256 } from '../lib/security'

export default function HashDisplay({ password }) {
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!password) return
    let cancelled = false
    sha256(password).then(h => { if (!cancelled) setHash(h) })
    return () => { cancelled = true }
  }, [password])

  async function copy() {
    if (!hash) return
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard may be denied */ }
  }

  return (
    <div className="no-select border border-[var(--neon-glow)] rounded p-3 bg-black/40">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)]">SHA-256 HASH</div>
        <button
          onClick={copy}
          disabled={!hash}
          className="text-[10px] px-2 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)] disabled:opacity-30 flex items-center gap-1"
        >
          {copied ? <><Check size={12} /> COPIED!</> : <><Copy size={12} /> COPY</>}
        </button>
      </div>
      <div className="font-mono text-[10px] md:text-xs text-[var(--neon)] break-all allow-select min-h-[20px]"
        style={{ textShadow: '0 0 2px rgba(0,255,65,0.2)' }}>
        {hash || '—'}
      </div>
    </div>
  )
}
