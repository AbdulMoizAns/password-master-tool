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
    <div className="metric-cell">
      <div className="flex items-center justify-between mb-2">
        <div className="metric-label">SHA-256 HASH</div>
        <button onClick={copy} disabled={!hash} className={`btn min-h-0 py-0.5 px-2 ${copied ? 'btn-copied' : ''}`}>
          {copied ? <><Check size={12} /> OK</> : <Copy size={12} />}
        </button>
      </div>
      <div className="font-mono text-[10px] md:text-xs neon-text-sm break-all allow-select min-h-[20px]">
        {hash || '—'}
      </div>
    </div>
  )
}
