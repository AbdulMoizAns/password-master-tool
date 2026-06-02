import { useState, useMemo } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { generateSecurePassword, shannonEntropy, bruteForceTime, formatTime } from '../lib/security'

export default function Generator({ onGenerated, attackSpeed }) {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const pwd = useMemo(() => {
    return generateSecurePassword({ length, useUpper, useLower, useNumbers, useSymbols })
    // refreshKey is included so the memo recomputes when user clicks regenerate
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
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ generator.elf ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)] tracking-widest">CRYPTO-SECURE</div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)]">LENGTH</span>
          <span className="text-[10px] text-[var(--neon)]">{length}</span>
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
        <label className="flex items-center gap-2 cursor-pointer text-[var(--neon)]">
          <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />
          <span>A-Z</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[var(--neon)]">
          <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} />
          <span>a-z</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[var(--neon)]">
          <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} />
          <span>0-9</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[var(--neon)]">
          <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} />
          <span>!@#$</span>
        </label>
      </div>

      {!strictValid && (
        <div className="text-[10px] text-[#ffa000] mb-2">⚠️ Length must be ≥ # of selected criteria</div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)]">OUTPUT</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[var(--neon)]">{ent.toFixed(1)} bits</span>
            <span className="text-[rgba(0,255,65,0.4)]">{crackLabel}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={pwd}
            readOnly
            className="flex-1 bg-black/60 border border-[var(--neon-glow)] rounded px-3 py-2 text-sm text-[var(--neon)] allow-select"
            spellCheck={false}
          />
          <button
            onClick={regenerate}
            className="px-3 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)]"
            title="Regenerate"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={copy}
            disabled={!pwd}
            className="px-3 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)] disabled:opacity-30 flex items-center gap-1"
          >
            {copied ? <><Check size={14} /> COPIED!</> : <><Copy size={14} /></>}
          </button>
        </div>
        {copied && <div className="text-[10px] text-[var(--neon)] mt-1">✅ COPIED!</div>}
      </div>

      <div className="text-[9px] text-[rgba(0,255,65,0.3)] mt-2">
        Uses <code className="text-[var(--neon)]">crypto.getRandomValues()</code> with strict per-criteria guarantee. Every selected character class is represented at least once.
      </div>
    </section>
  )
}
