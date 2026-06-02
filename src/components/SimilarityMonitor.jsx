import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function SimilarityMonitor({ currentPassword, history }) {
  const hasHistory = history.length > 1

  if (!currentPassword || !hasHistory) {
    return (
      <section className="no-select neon-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ similarity.monitor ]</h2>
          <div className="text-[10px] text-[rgba(0,255,65,0.3)]">SEQUENCE CHECK</div>
        </div>
        <div className="text-xs text-[rgba(0,255,65,0.3)] py-2 text-center">
          Enter multiple passwords in the session to detect sequential / incremental patterns.
        </div>
      </section>
    )
  }

  // Simple incremental check: detect if current = previous with incremented suffix
  const prevPasswords = history.slice(0, -1) // exclude current
  const warnings = []

  for (const prev of prevPasswords) {
    // Check if current has incremented number vs previous
    const numMatch = /(\d+)$/
    const currNum = numMatch.exec(currentPassword)
    const prevNum = numMatch.exec(prev)
    if (currNum && prevNum) {
      const currPrefix = currentPassword.slice(0, currNum.index)
      const prevPrefix = prev.slice(0, prevNum.index)
      if (currPrefix === prevPrefix) {
        const currVal = Number(currNum[1])
        const prevVal = Number(prevNum[1])
        if (currVal === prevVal + 1) {
          warnings.push(`⚠ Incremental: "${prev}" → "${currentPassword}" (suffix +1)`)
        }
      }
    }

    // Check if they look similar (same prefix, different suffix)
    const commonPrefixLen = (() => {
      let i = 0
      while (i < Math.min(currentPassword.length, prev.length) && currentPassword[i] === prev[i]) i++
      return i
    })()

    if (commonPrefixLen >= Math.min(currentPassword.length, prev.length) * 0.5 && commonPrefixLen >= 3) {
      if (currentPassword !== prev) {
        warnings.push(`⚠ Sequence: "${prev}" → "${currentPassword}" (shared prefix: "${currentPassword.slice(0, commonPrefixLen)}")`)
      }
    }
  }

  // Deduplicate warnings
  const unique = [...new Set(warnings)]

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ similarity.monitor ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)]">SEQUENCE CHECK</div>
      </div>

      {unique.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-[var(--neon)]">
          <CheckCircle size={14} /> No sequential patterns detected against {prevPasswords.length} prior password(s).
        </div>
      ) : (
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {unique.slice(0, 5).map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-[#ffa000]">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-[9px] text-[rgba(0,255,65,0.2)] mt-2 text-center">
        Monitors session history for lazy, predictive credential rotations.
      </div>
    </section>
  )
}
