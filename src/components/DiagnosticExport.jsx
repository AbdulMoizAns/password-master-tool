import { useState, useCallback } from 'react'
import { Download, FileText } from 'lucide-react'
import {
  shannonEntropy, getCharsetSize, bruteForceTime, formatTime,
  isInTop20, auditAdvice, detectSequences,
} from '../lib/security'

export default function DiagnosticExport({ password, attackSpeed, history, sessionStart }) {
  const [copied, setCopied] = useState(false)

  const generateLog = useCallback(() => {
    const now = new Date().toISOString()
    const L = password.length
    const C = getCharsetSize(password)
    const ent = shannonEntropy(password)
    const crackSec = bruteForceTime(password, attackSpeed)
    const advice = auditAdvice(password)
    const top20 = isInTop20(password)
    const seqs = detectSequences(password)
    const duration = Math.round((Date.now() - sessionStart) / 1000)

    const lines = [
      '╔══════════════════════════════════════════╗',
      '║  PASSWORD MASTER — DIAGNOSTIC AUDIT LOG  ║',
      '╚══════════════════════════════════════════╝',
      '',
      `Timestamp:        ${now}`,
      `Session duration: ${duration}s`,
      `Attack speed:     ${attackSpeed.toExponential(2)} /sec`,
      '',
      '─── CURRENT PASSWORD ANALYSIS ───',
      `Password length:  ${L}`,
      `Charset size:     ${C}`,
      `Entropy:          ${ent.toFixed(2)} bits`,
      `Crack time:       ${crackSec > 0 ? formatTime(crackSec) : 'N/A'}`,
      `Top-20 match:     ${top20 ? 'YES — BREACHED' : 'No'}`,
      '',
      '─── STRENGTH ADVICE ───',
      ...(advice.length > 0 ? advice : ['(none)']),
      '',
      '─── SEQUENCES DETECTED ───',
      ...(seqs.length > 0 ? seqs : ['(none)']),
      '',
      '─── ENTROPY HISTORY ───',
      ...(history.length > 0
        ? history.map((e, i) => `  [${i + 1}] ${e.toFixed(2)} bits`)
        : ['(no history)']),
      '',
      '─── SESSION STATS ───',
      `Total passwords analyzed: ${history.length}`,
      `Average entropy:          ${history.length > 0 ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(2) : 'N/A'} bits`,
      `Max entropy reached:      ${history.length > 0 ? Math.max(...history).toFixed(2) : 'N/A'} bits`,
      '',
      '╔══════════════════════════════════════════╗',
      '║  END — EDUCATIONAL USE ONLY              ║',
      '╚══════════════════════════════════════════╝',
    ].join('\n')
    return lines
  }, [password, attackSpeed, history, sessionStart])

  const download = useCallback(() => {
    const log = generateLog()
    const blob = new Blob([log], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pm_diagnostic_${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generateLog])

  const copyLog = useCallback(async () => {
    const log = generateLog()
    try {
      await navigator.clipboard.writeText(log)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [generateLog])

  return (
    <section className="no-select bento-panel">
      <div className="bento-panel-header">
        <h2 className="bento-panel-title">[ diagnostic.export ]</h2>
        <div className="bento-panel-badge">AUDIT LOG</div>
      </div>
      <div className="flex gap-2">
        <button onClick={download} className="btn flex-1 justify-center">
          <Download size={12} /> DOWNLOAD .TXT
        </button>
        <button onClick={copyLog} className={`btn ${copied ? 'btn-copied' : ''}`}>
          <FileText size={12} /> {copied ? 'OK' : 'COPY'}
        </button>
      </div>
      <div className="text-[9px] text-muted mt-2 text-center">
        Exports full session diagnostic data including entropy history, advice, and crack-time metrics.
      </div>
    </section>
  )
}
