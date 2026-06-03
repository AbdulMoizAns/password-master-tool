import { useState, useMemo } from 'react'
import { Copy, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { generateSecurePassword, shannonEntropy, bruteForceTime, formatTime } from '../lib/security'

export default function Generator({ onGenerated, attackSpeed }) {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const pwd = useMemo(() => {
    return generateSecurePassword({ length, useUpper, useLower, useNumbers, useSymbols })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useUpper, useLower, useNumbers, useSymbols, refreshKey])

  function regenerate() {
    setRefreshKey(k => k + 1)
    if (onGenerated) {
      const newPwd = generateSecurePassword({ length, useUpper, useLower, useNumbers, useSymbols })
      onGenerated(newPwd)
    }
  }

  async function copy() {
    if (!pwd) return
    try {
      await navigator.clipboard.writeText(pwd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard may be denied */ }
  }

  const ent = shannonEntropy(pwd)
  const crackSeconds = bruteForceTime(pwd, attackSpeed)
  const crackLabel = pwd ? formatTime(crackSeconds) : '—'
  const hasCriteria = useUpper || useLower || useNumbers || useSymbols
  const strictValid = hasCriteria && length >= (useUpper + useLower + useNumbers + useSymbols)

  return (
    <section className="no-select bento-panel focus-glow">
      <div className="bento-panel-header">
        <h2 className="bento-panel-title">[ generator.elf ]</h2>
        <div className="bento-panel-badge">CRYPTO-SECURE</div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest text-muted">LENGTH</span>
          <span className="text-[10px] neon-text-sm">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer neon-text-sm">
          <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />
          <span>A-Z</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer neon-text-sm">
          <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} />
          <span>a-z</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer neon-text-sm">
          <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} />
          <span>0-9</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer neon-text-sm">
          <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} />
          <span>!@#$</span>
        </label>
      </div>

      {!strictValid && (
        <div className="text-[10px] text-[var(--warning)] mb-2">Length must be &ge; # of selected criteria</div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest text-muted">OUTPUT</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="neon-text-sm">{ent.toFixed(1)} bits</span>
            <span className="text-muted">{crackLabel}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={pwd}
            readOnly
            className="flex-1 input-field allow-select"
            spellCheck={false}
          />
          <button onClick={regenerate} className="btn" title="Regenerate">
            <RefreshCw size={14} />
          </button>
          <button onClick={copy} disabled={!pwd} className={`btn ${copied ? 'btn-copied' : ''}`}>
            {copied ? <><Check size={14} /> OK</> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Advanced Options Dropdown */}
      <button
        onClick={() => setShowAdvanced(s => !s)}
        className="btn w-full mt-2 text-muted justify-between"
      >
        <span className="text-muted">ADVANCED OPTIONS</span>
        {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {showAdvanced && (
        <div className="mt-2 p-3 border border-[var(--border-subtle)] rounded bg-[rgba(0,0,0,0.3)]">
          <div className="text-[10px] text-muted mb-2">
            <span className="block mb-1">Hash Algorithm: SHA-256 (hardware accelerated)</span>
            <span className="block mb-1">PRNG: <code className="neon-text-sm">crypto.getRandomValues()</code></span>
            <span className="block">Entropy source: Window.crypto (Web Crypto API)</span>
          </div>
          <div className="text-[9px] text-muted">
            Per-criteria guarantee: every selected character class appears at least once.
          </div>
        </div>
      )}

      <div className="text-[9px] text-muted mt-2">
        Uses <code className="neon-text-sm">crypto.getRandomValues()</code> with strict per-criteria guarantee.
      </div>
    </section>
  )
}
