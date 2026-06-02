import { useState, useRef, useEffect } from 'react'
import { Play, Square, Zap } from 'lucide-react'

const WORDLIST_LABELS = [
  { value: 100, label: '100 (common)' },
  { value: 1000, label: '1K (small)' },
  { value: 10000, label: '10K (medium)' },
  { value: 100000, label: '100K (large)' },
]

function simulateSpeed(wordlistSize, speed) {
  // Number of attempts to simulate visually
  const total = Math.min(wordlistSize, 500)
  const msPerWord = 1000 / speed
  return { total, msPerWord }
}

export default function DictAttack() {
  const [wordlistSize, setWordlistSize] = useState(1000)
  const [speed, setSpeed] = useState(1_000_000_000)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [found, setFound] = useState(false)
  const [log, setLog] = useState([])
  const animRef = useRef(null)

  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [])

  function start() {
    setRunning(true)
    setProgress(0)
    setFound(false)
    setLog([])
    const { total, msPerWord } = simulateSpeed(wordlistSize, speed)
    let idx = 0
    let foundAt = null

    function tick() {
      if (idx >= total) {
        setRunning(false)
        setLog(p => [...p, `[DONE] Scanned ${total} passwords. Target ${foundAt ? 'FOUND' : 'NOT FOUND'}.`])
        return
      }
      idx++
      const pct = Math.round((idx / total) * 100)
      setProgress(pct)
      // Simulate random "found" at ~60-80%
      if (!foundAt && Math.random() < 0.003 && idx > total * 0.3) {
        foundAt = idx
        setFound(true)
        setLog(p => [...p, `[MATCH] Candidate found at position #${idx.toLocaleString()}`])
      }
      if (idx % Math.max(1, Math.floor(total / 20)) === 0) {
        setLog(p => [...p, `[SCAN] ${idx.toLocaleString()}/${total.toLocaleString()} (${pct}%) — ${(idx * msPerWord / 1000).toFixed(2)}s elapsed`])
      }
      animRef.current = setTimeout(tick, Math.min(msPerWord, 50))
    }
    setLog(p => [...p, `[INIT] Wordlist: ${total.toLocaleString()} passwords`])
    setLog(p => [...p, `[INIT] Speed: ${speed.toExponential(2)} hashes/sec`])
    animRef.current = setTimeout(tick, 200)
  }

  function stop() {
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(false)
  }

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ dict.attack ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)]">SANDBOX SIMULATION</div>
      </div>

      <div className="space-y-3 mb-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[rgba(0,255,65,0.4)]">WORDLIST SIZE</span>
            <span className="text-[10px] text-[var(--neon)]">{wordlistSize.toLocaleString()}</span>
          </div>
          <div className="flex gap-1">
            {WORDLIST_LABELS.map(w => (
              <button key={w.value} onClick={() => !running && setWordlistSize(w.value)}
                className={`flex-1 text-[9px] px-1 py-1 border rounded ${wordlistSize === w.value ? 'border-[var(--neon)] text-[var(--neon)] bg-[rgba(0,255,65,0.1)]' : 'border-[var(--neon-glow)] text-[rgba(0,255,65,0.5)] hover:bg-[rgba(0,255,65,0.05)]'}`}>
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[rgba(0,255,65,0.4)]">ATTACK SPEED</span>
            <span className="text-[10px] text-[var(--neon)]">{speed.toExponential(2)} /sec</span>
          </div>
          <input type="range" min="100000" max="100000000000" step="100000" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-[9px] text-[rgba(0,255,65,0.3)]"><span>100K/s</span><span>1B/s</span><span>100B/s</span></div>
        </div>
      </div>

      {!running && progress === 0 && (
        <button onClick={start} className="w-full text-xs py-2 border border-[var(--neon)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)] flex items-center justify-center gap-2">
          <Play size={14} /> START SIMULATION
        </button>
      )}

      {(running || progress > 0) && (
        <div className="space-y-2">
          <div className="w-full h-3 bg-black/60 rounded overflow-hidden border border-[var(--neon-glow)]">
            <div className="h-full transition-all duration-150 rounded" style={{
              width: `${progress}%`,
              background: found ? '#ff2a2a' : 'linear-gradient(90deg, #00ff41, #00c8ff)',
              boxShadow: `0 0 6px ${found ? '#ff2a2a' : '#00ff41'}`,
            }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--neon)]">{progress}%</span>
            {found && <span className="text-[10px] text-[#ff2a2a] font-bold">🔥 PASSWORD FOUND</span>}
            <button onClick={stop} disabled={!running} className="text-[10px] px-2 py-1 border border-[#ff5050] text-[#ff5050] rounded hover:bg-[rgba(255,50,50,0.1)] disabled:opacity-30">
              <Square size={12} />
            </button>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-3 border border-[var(--neon-glow)] rounded p-2 bg-black/60 max-h-24 overflow-y-auto">
          {log.slice(-8).map((line, i) => (
            <div key={i} className="text-[9px] text-[var(--neon)] leading-relaxed">{line}</div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mt-2 text-[9px] text-[rgba(0,255,65,0.25)]">
        <Zap size={10} />
        <span>Sandboxed simulation using {wordlistSize <= 1000 ? 'fast' : 'realistic'} timing. No actual data transmitted.</span>
      </div>
    </section>
  )
}
