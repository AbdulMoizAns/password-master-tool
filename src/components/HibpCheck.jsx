import { useState } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react'
import { checkHIBP } from '../lib/security'

export default function HibpCheck({ password }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!password) return
    setLoading(true)
    setResult(null)
    const r = await checkHIBP(password)
    setResult(r)
    setLoading(false)
  }

  let color = 'var(--data-primary)'
  let Icon = ShieldCheck
  let text = 'Click CHECK to query HIBP'
  if (loading) { Icon = Loader2; text = 'Querying k-anonymity endpoint...'; color = '#00c8ff' }
  else if (result) {
    if (result.breached) { Icon = ShieldAlert; color = 'var(--danger)'; text = `BREACHED — seen ${result.count.toLocaleString()} times` }
    else if (result.error) { Icon = Shield; color = 'var(--warning)'; text = `Error: ${result.error}` }
    else { Icon = ShieldCheck; text = 'Not found in known breaches' }
  }

  return (
    <div className="metric-cell">
      <div className="flex items-center justify-between mb-2">
        <div className="metric-label">HIBP K-ANONYMITY CHECK</div>
        <button onClick={run} disabled={!password || loading} className="btn btn-primary min-h-0 py-0.5 px-2">
          {loading ? '...' : 'CHECK'}
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ color }}>
        <Icon size={14} className={loading ? 'animate-spin' : ''} />
        <span className="allow-select">{text}</span>
      </div>
      <div className="text-[9px] text-muted mt-2">
        Only the first 5 chars of the SHA-1 hash are transmitted. Plaintext never leaves your browser.
      </div>
    </div>
  )
}
