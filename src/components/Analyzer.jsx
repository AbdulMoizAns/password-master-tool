import { Eye, EyeOff, Copy, Check, Zap, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import {
  shannonEntropy,
  getCharsetSize,
  bruteForceTime,
  formatTime,
  isInTop20,
  auditAdvice,
  detectSequences,
} from '../lib/security'
import Metrics from './Metrics'
import HashDisplay from './HashDisplay'
import HibpCheck from './HibpCheck'

export default function Analyzer({ password, setPassword, attackSpeed, setAttackSpeed }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  const L = password.length
  const C = getCharsetSize(password)
  const ent = shannonEntropy(password)
  const crackSeconds = bruteForceTime(password, attackSpeed)
  const crackLabel = L === 0 ? '—' : formatTime(crackSeconds)
  const top20 = isInTop20(password)
  const advice = auditAdvice(password)
  const seqs = detectSequences(password)

  let strengthLabel = 'EMPTY'
  let strengthColor = '#666'
  if (top20) { strengthLabel = '🔥 CRACKED (top 20 common) — BREACHED'; strengthColor = '#ff2a2a' }
  else if (L > 0) {
    if (ent >= 100) { strengthLabel = 'QUANTUM-GRADE'; strengthColor = 'var(--neon)' }
    else if (ent >= 80) { strengthLabel = 'EXCELLENT'; strengthColor = 'var(--neon)' }
    else if (ent >= 60) { strengthLabel = 'STRONG'; strengthColor = '#00c8ff' }
    else if (ent >= 40) { strengthLabel = 'MODERATE'; strengthColor = '#ffa000' }
    else { strengthLabel = 'WEAK'; strengthColor = '#ff5050' }
  }

  async function copyPwd() {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard may be denied */ }
  }

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ analyzer.exe ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)] tracking-widest">PRO ANALYSIS</div>
      </div>

      <div className="relative mb-3">
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password to analyze..."
          className="w-full bg-black/60 border border-[var(--neon-glow)] rounded px-3 py-2 pr-20 text-sm text-[var(--neon)] placeholder:text-[rgba(0,255,65,0.3)] allow-select"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={() => setShow(s => !s)}
            className="p-1 text-[var(--neon)] hover:bg-[rgba(0,255,65,0.1)] rounded"
            title={show ? 'Hide' : 'Show'}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={copyPwd}
            disabled={!password}
            className="p-1 text-[var(--neon)] hover:bg-[rgba(0,255,65,0.1)] rounded disabled:opacity-30"
            title="Copy"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {copied && (
        <div className="text-[10px] text-[var(--neon)] mb-2">✅ COPIED!</div>
      )}

      <div className="mb-3 flex items-center gap-2">
        <Zap size={14} className="text-[var(--neon)]" />
        <span className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)]">STRENGTH</span>
        <span className="text-xs font-bold" style={{ color: strengthColor, textShadow: `0 0 4px ${strengthColor}40` }}>
          {strengthLabel}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)]">ATTACK SPEED</span>
          <span className="text-[10px] text-[var(--neon)]">{attackSpeed.toExponential(2)} /sec</span>
        </div>
        <input
          type="range"
          min="1000"
          max="100000000000"
          step="1000"
          value={attackSpeed}
          onChange={e => setAttackSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[9px] text-[rgba(0,255,65,0.3)] mt-1">
          <span>1K/s</span>
          <span>1B/s (default)</span>
          <span>100B/s</span>
        </div>
      </div>

      <Metrics length={L} charset={C} entropy={ent} crackTime={crackLabel} />

      {(advice.length > 0 || top20 || seqs.length > 0) && (
        <div className="mt-3 space-y-1">
          {top20 && (
            <div className="text-xs text-[#ff2a2a] flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span>🔥 CRACKED (top 20 common) - BREACHED</span>
            </div>
          )}
          {advice.map((a, i) => (
            <div key={i} className="text-xs text-[#ffa000] flex items-start gap-2">
              <span className="text-[#ffa000]">›</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-3">
        <HashDisplay password={password} />
        <HibpCheck password={password} />
      </div>
    </section>
  )
}
