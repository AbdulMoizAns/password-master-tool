import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function SimilarityMonitor({ currentPassword, history }) {
  const hasHistory = history.length > 1

  if (!currentPassword || !hasHistory) {
    return (
      <section className="no-select bento-panel">
        <div className="bento-panel-header">
          <h2 className="bento-panel-title">[ similarity.monitor ]</h2>
          <div className="bento-panel-badge">SEQUENCE CHECK</div>
        </div>
        <div className="text-xs text-muted py-2 text-center">
          Enter multiple passwords in the session to detect sequential / incremental patterns.
        </div>
      </section>
    )
  }

  const prevPasswords = history.slice(0, -1)
  const warnings = []

  for (const prev of prevPasswords) {
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
          warnings.push(`Incremental: "${prev}" → "${currentPassword}" (suffix +1)`)
        }
      }
    }

    const commonPrefixLen = (() => {
      let i = 0
      while (i < Math.min(currentPassword.length, prev.length) && currentPassword[i] === prev[i]) i++
      return i
    })()

    if (commonPrefixLen >= Math.min(currentPassword.length, prev.length) * 0.5 && commonPrefixLen >= 3) {
      if (currentPassword !== prev) {
        warnings.push(`Sequence: "${prev}" → "${currentPassword}" (shared prefix: "${currentPassword.slice(0, commonPrefixLen)}")`)
      }
    }
  }

  const unique = [...new Set(warnings)]

  return (
    <section className="no-select bento-panel">
      <div className="bento-panel-header">
        <h2 className="bento-panel-title">[ similarity.monitor ]</h2>
        <div className="bento-panel-badge">SEQUENCE CHECK</div>
      </div>

      {unique.length === 0 ? (
        <div className="flex items-center gap-2 text-xs neon-text-sm">
          <CheckCircle size={14} /> No sequential patterns detected against {prevPasswords.length} prior password(s).
        </div>
      ) : (
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {unique.slice(0, 5).map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--warning)]">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-[9px] text-muted mt-2 text-center">
        Monitors session history for lazy, predictive credential rotations.
      </div>
    </section>
  )
}
