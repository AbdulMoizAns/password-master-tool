import { useMemo } from 'react'

export default function EntropyWaveform({ entropy }) {
  const bars = useMemo(() => {
    const count = 32
    const result = []
    for (let i = 0; i < count; i++) {
      // Phase shift for each bar to create wave effect
      const phase = (i / count) * Math.PI * 4
      // Height based on entropy (0-128 bits scaled to 0-1) plus sin wave for motion
      const base = Math.min(entropy / 128, 1)
      const wave = Math.sin(phase) * 0.3
      const height = Math.max(0.05, Math.min(1, base + wave * base))
      result.push(height)
    }
    return result
  }, [entropy])

  const baseHue = entropy > 80 ? 130 : entropy > 60 ? 190 : entropy > 40 ? 40 : 0
  const speed = Math.max(1, entropy / 10)

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ entropy.waveform ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)]">
          {entropy.toFixed(1)} BITS
        </div>
      </div>
      <div className="flex items-end gap-[2px] h-16 md:h-20">
        {bars.map((h, i) => {
          const hue = baseHue + (i / bars.length) * 20
          const color = `hsl(${hue}, 100%, ${40 + h * 30}%)`
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-75"
              style={{
                height: `${h * 100}%`,
                background: color,
                boxShadow: `0 0 4px ${color}`,
                animation: `wavePulse ${speed}s ease-in-out infinite`,
                animationDelay: `${(i / bars.length) * 0.1}s`,
              }}
            />
          )
        })}
      </div>
      <div className="text-[9px] text-[rgba(0,255,65,0.3)] text-center mt-2">
        Amplitude, speed, and hue respond to real-time entropy.
      </div>
      <style>{`
        @keyframes wavePulse {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.05); }
        }
      `}</style>
    </section>
  )
}
