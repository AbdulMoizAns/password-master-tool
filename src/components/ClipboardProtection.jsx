import { useRef, useState, useCallback, useEffect } from 'react'
import { Shield } from 'lucide-react'

export default function ClipboardProtection() {
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef(null)
  const countRef = useRef(null)

  const scheduleClear = useCallback(() => {
    // Cancel any existing timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countRef.current) clearInterval(countRef.current)

    setRemaining(30)
    // Countdown tick
    countRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(countRef.current); return 0 }
        return prev - 1
      })
    }, 1000)

    // Clear clipboard after 30s
    timerRef.current = setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('')
        setRemaining(0)
      } catch { /* clipboard access may be denied */ }
    }, 30000)
  }, [])

  useEffect(() => {
    // Intercept copy events globally
    function onCopy() {
      scheduleClear()
    }
    document.addEventListener('copy', onCopy)
    return () => {
      document.removeEventListener('copy', onCopy)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countRef.current) clearInterval(countRef.current)
    }
  }, [scheduleClear])

  if (remaining === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 border border-[var(--neon)] rounded bg-black/80 text-[10px] text-[var(--neon)]"
      style={{ boxShadow: '0 0 10px rgba(0,255,65,0.2)' }}>
      <Shield size={12} />
      <span>Clipboard auto-clear in <span className="font-bold">{remaining}s</span></span>
    </div>
  )
}
