// Session password history and similarity detection

// Levenshtein distance for edit-distance comparison
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

export function checkSimilarity(active, history) {
  if (!active || history.length === 0) return null
  const results = []
  for (const prev of history) {
    if (prev === active) continue
    const dist = levenshtein(active, prev)
    const maxLen = Math.max(active.length, prev.length, 1)
    const ratio = 1 - dist / maxLen
    if (ratio > 0.6) {
      results.push({ prev, distance: dist, ratio: (ratio * 100).toFixed(1) })
    }
  }
  // Check for incremental patterns: Admin1 → Admin2
  const incMatch = /(\d+)$/
  const suffixA = incMatch.exec(active)
  for (const prev of history) {
    const suffixB = incMatch.exec(prev)
    if (suffixA && suffixB) {
      const prefixA = active.slice(0, suffixA.index)
      const prefixB = prev.slice(0, suffixB.index)
      if (prefixA === prefixB && Number(suffixA[1]) === Number(suffixB[1]) + 1) {
        results.push({ prev, distance: 1, ratio: '99.9', incremental: true })
      }
    }
  }
  return results.length > 0 ? results.sort((a, b) => b.ratio - a.ratio) : null
}
