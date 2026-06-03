import { useRef, useState, useCallback, useEffect } from 'react'
import { Shield } from 'lucide-react'

export default function ClipboardProtection() {
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef(null)
  const countRef = useRef(null)

  const scheduleClear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countRef.current) clearInterval(countRef.current)

    setRemaining(30)
    countRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(countRef.current); return 0 }
        return prev - 1
      })
    }, 1000)

    timerRef.current = setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('')
        setRemaining(0)
      } catch { /* clipboard access may be denied */ }
    }, 30000)
  }, [])

  useEffect(() => {
    function onCopy() { scheduleClear() }
    document.addEventListener('copy', onCopy)
    return () => {
      document.removeEventListener('copy', onCopy)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countRef.current) clearInterval(countRef.current)
    }
  }, [scheduleClear])

  if (remaining === 0) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-3 py-2 border border-[var(--accent)] rounded bg-[var(--bg-deep)]/90 text-[10px] neon-text-sm"
      style={{ boxShadow: '0 0 10px rgba(0,255,65,0.2)' }}>
      <Shield size={12} />
      <span>Clipboard auto-clear in <span className="font-bold">{remaining}s</span></span>
    </div>
  )
}
