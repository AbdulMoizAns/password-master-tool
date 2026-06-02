import { useState } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import { shannonEntropy, getCharsetSize, bruteForceTime, formatTime, auditAdvice, isInTop20 } from '../lib/security'

const SLOTS = [0, 1, 2]

function MetricRow({ label, values, colors }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-1">
      <div className="text-[10px] text-[rgba(0,255,65,0.4)]">{label}</div>
      {values.map((v, i) => (
        <div key={i} className="text-xs font-bold text-center" style={{ color: colors?.[i] || 'var(--neon)', textShadow: '0 0 2px rgba(0,255,65,0.2)' }}>{v}</div>
      ))}
    </div>
  )
}

function StrengthBars({ values }) {
  const max = Math.max(...values, 1)
  return (
    <div className="grid grid-cols-3 gap-2 mb-2">
      {values.map((v, i) => {
        const pct = (v / max) * 100
        const c = v > 80 ? '#00ff41' : v > 60 ? '#00c8ff' : v > 40 ? '#ffa000' : '#ff5050'
        return (
          <div key={i} className="h-4 bg-black/60 rounded overflow-hidden border border-[var(--neon-glow)]">
            <div className="h-full rounded transition-all duration-300" style={{ width: `${pct}%`, background: c, boxShadow: `0 0 4px ${c}` }} />
          </div>
        )
      })}
    </div>
  )
}

export default function ComparisonMatrix() {
  const [pwds, setPwds] = useState(['', '', ''])

  const metrics = pwds.map(p => {
    return {
      length: p.length,
      charset: getCharsetSize(p),
      entropy: shannonEntropy(p),
      crack: p ? formatTime(bruteForceTime(p, 1_000_000_000)) : '—',
      top20: isInTop20(p),
      advice: p ? auditAdvice(p) : [],
    }
  })

  const entColors = metrics.map(m => m.entropy > 80 ? '#00ff41' : m.entropy > 60 ? '#00c8ff' : m.entropy > 40 ? '#ffa000' : '#ff5050')

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ comparison.matrix ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)]">3-WAY ANALYSIS</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {SLOTS.map(i => (
          <div key={i} className="relative">
            <input
              type="text"
              value={pwds[i]}
              onChange={e => {
                const next = [...pwds]; next[i] = e.target.value; setPwds(next)
              }}
              placeholder={`PWD ${i + 1}`}
              className="w-full bg-black/60 border border-[var(--neon-glow)] rounded px-2 py-1 text-xs text-[var(--neon)] placeholder:text-[rgba(0,255,65,0.3)] pr-6 allow-select"
            />
            {pwds[i] && (
              <button onClick={() => { const next = [...pwds]; next[i] = ''; setPwds(next) }} className="absolute right-1 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.3)] hover:text-[var(--neon)]">
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border border-[var(--neon-glow)] rounded p-3 bg-black/40">
        <div className="text-[10px] text-[rgba(0,255,65,0.3)] mb-2">COMPARISON METRICS</div>
        <MetricRow label="LENGTH" values={metrics.map(m => m.length || '—')} colors={entColors} />
        <MetricRow label="CHARSET" values={metrics.map(m => m.charset || '—')} colors={entColors} />
        <MetricRow label="ENTROPY" values={metrics.map(m => m.entropy ? `${m.entropy.toFixed(1)}b` : '—')} colors={entColors} />
        <MetricRow label="CRACK TIME" values={metrics.map(m => m.crack)} colors={entColors} />

        <StrengthBars values={metrics.map(m => m.entropy)} />

        <div className="mt-2 space-y-1">
          {metrics.map((m, i) => {
            const hasIssue = m.top20 || m.advice.length > 0
            return (
              <div key={i} className="text-[10px] flex items-start gap-1">
                <span className="text-[var(--neon)] font-bold shrink-0 w-6">P{i + 1}:</span>
                {!pwds[i] ? (
                  <span className="text-[rgba(0,255,65,0.2)]">empty</span>
                ) : m.top20 ? (
                  <span className="text-[#ff2a2a] flex items-center gap-1"><AlertTriangle size={10} /> TOP-20 BREACHED</span>
                ) : hasIssue ? (
                  <span className="text-[#ffa000] flex items-center gap-1"><AlertTriangle size={10} /> {m.advice.slice(0, 2).join(', ')}</span>
                ) : (
                  <span className="text-[var(--neon)] flex items-center gap-1"><CheckCircle size={10} /> Clean</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-[9px] text-[rgba(0,255,65,0.2)] mt-2 text-center">
        Compare up to 3 credentials side-by-side. Metrics, strength bars, and failure points are displayed simultaneously.
      </div>
    </section>
  )
}
