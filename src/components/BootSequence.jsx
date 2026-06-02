import { useState, useEffect } from 'react'

const BOOT_LINES = [
  '[ OK ]  Booting Password Master kernel v0x7E4',
  '[ OK ]  Loading crypto.subtle module',
  '[ OK ]  Initializing entropy pool',
  '[ OK ]  Mounting /dev/secure_ram',
  '[ OK ]  Loading analyzer.exe',
  '[ OK ]  Loading generator.elf',
  '[ OK ]  Connecting to HIBP k-anonymity endpoint',
  '[ OK ]  No external data persistence detected',
  '[ OK ]  System ready. Awaiting user input...',
]

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let i = 0
    const tick = () => {
      if (cancelled) return
      if (i >= BOOT_LINES.length) {
        setDone(true)
        return
      }
      setLines(prev => [...prev, BOOT_LINES[i]])
      i++
      setTimeout(tick, 200 + Math.random() * 150)
    }
    const start = setTimeout(tick, 300)
    return () => { cancelled = true; clearTimeout(start) }
  }, [])

  return (
    <div className="no-select w-full max-w-2xl mx-auto">
      <div className="border border-[var(--neon-glow)] rounded p-4 bg-black/60 min-h-[260px]">
        {lines.map((line, i) => (
          <div key={i} className="text-[var(--neon)] text-xs md:text-sm leading-relaxed">
            {line}
          </div>
        ))}
        {!done && (
          <div className="text-[var(--neon)] text-xs md:text-sm">
            <span className="animate-blink">▊</span>
          </div>
        )}
        {done && (
          <div className="mt-6 text-center">
            <button
              onClick={onComplete}
              className="px-8 py-3 border border-[var(--neon)] text-[var(--neon)] text-sm tracking-widest rounded hover:bg-[rgba(0,255,65,0.1)] transition-all"
              style={{ boxShadow: '0 0 8px rgba(0,255,65,0.4)' }}
            >
              [ ENTER TERMINAL ]
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
