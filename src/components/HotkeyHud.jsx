import { useState, useEffect } from 'react'
import { Keyboard } from 'lucide-react'

const HOTKEYS = [
  { key: 'Esc', action: 'PANIC — wipe all state & inputs' },
  { key: 'Ctrl+U', action: 'Blocked — view source' },
  { key: 'Ctrl+S', action: 'Blocked — save page' },
  { key: 'F12 / Ctrl+Shift+I', action: 'Blocked — devtools' },
]

export default function HotkeyHud() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function toggle(e) {
      if (e.key === 'h' && e.shiftKey) {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [])

  if (!visible) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 border border-[var(--neon-glow)] rounded bg-black/80 text-[10px] text-[var(--neon)] cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        onClick={() => setVisible(true)}
        title="Press Shift+H to toggle HUD">
        <Keyboard size={12} /> HUD
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 border border-[var(--neon)] rounded bg-black/90 p-3 min-w-[200px]"
      style={{ boxShadow: '0 0 10px rgba(0,255,65,0.2)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs neon-text font-bold tracking-widest">HOTKEY HUD</div>
        <button onClick={() => setVisible(false)} className="text-[10px] text-[rgba(0,255,65,0.5)] hover:text-[var(--neon)]">✕</button>
      </div>
      <div className="space-y-1">
        {HOTKEYS.map((hk, i) => (
          <div key={i} className="flex items-center gap-2 text-[9px]">
            <kbd className="px-1.5 py-0.5 border border-[var(--neon-glow)] rounded text-[var(--neon)] bg-black/60 font-mono text-[8px]">{hk.key}</kbd>
            <span className="text-[rgba(0,255,65,0.6)]">{hk.action}</span>
          </div>
        ))}
      </div>
      <div className="text-[8px] text-[rgba(0,255,65,0.3)] mt-2">Press Shift+H to toggle this panel</div>
    </div>
  )
}
