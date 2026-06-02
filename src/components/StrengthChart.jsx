import { useRef, useEffect } from 'react'

export default function StrengthChart({ history }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || history.length < 2) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const maxEnt = Math.max(...history, 128)
    const padding = { top: 8, bottom: 16, left: 8, right: 8 }
    const plotW = W - padding.left - padding.right
    const plotH = H - padding.top - padding.bottom

    // Grid lines
    ctx.strokeStyle = 'rgba(0,255,65,0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH / 4) * i
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke()
    }

    // Area fill
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + plotH)
    history.forEach((e, i) => {
      const x = padding.left + (i / Math.max(history.length - 1, 1)) * plotW
      const y = padding.top + plotH - (e / maxEnt) * plotH
      ctx.lineTo(x, y)
    })
    ctx.lineTo(padding.left + plotW, padding.top + plotH)
    ctx.closePath()
    ctx.fillStyle = 'rgba(0,255,65,0.08)'
    ctx.fill()

    // Line
    ctx.beginPath()
    history.forEach((e, i) => {
      const x = padding.left + (i / Math.max(history.length - 1, 1)) * plotW
      const y = padding.top + plotH - (e / maxEnt) * plotH
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 1.5
    ctx.shadowColor = 'rgba(0,255,65,0.3)'
    ctx.shadowBlur = 4
    ctx.stroke()
    ctx.shadowBlur = 0

    // Dots
    history.forEach((e, i) => {
      const x = padding.left + (i / Math.max(history.length - 1, 1)) * plotW
      const y = padding.top + plotH - (e / maxEnt) * plotH
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2)
      const hue = e > 80 ? '#00ff41' : e > 60 ? '#00c8ff' : e > 40 ? '#ffa000' : '#ff5050'
      ctx.fillStyle = hue; ctx.fill()
      ctx.shadowColor = hue + '80'; ctx.shadowBlur = 6
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Y-axis label
    ctx.fillStyle = 'rgba(0,255,65,0.3)'
    ctx.font = '8px monospace'
    ctx.fillText('ENT', 1, 8)
    ctx.fillText('0', 1, H - 2)
  }, [history])

  if (history.length < 2) {
    return (
      <section className="no-select neon-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ entropy.history ]</h2>
          <div className="text-[10px] text-[rgba(0,255,65,0.3)]">TELEMETRY</div>
        </div>
        <div className="text-xs text-[rgba(0,255,65,0.3)] py-4 text-center">Type at least 2 different passwords to see entropy trend.</div>
      </section>
    )
  }

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ entropy.history ]</h2>
        <div className="text-[10px] text-[rgba(0,255,65,0.3)]">SESSION TELEMETRY</div>
      </div>
      <canvas ref={canvasRef} width={300} height={120} className="w-full h-[120px]" />
      <div className="text-[9px] text-[rgba(0,255,65,0.25)] mt-1 text-center">
        Last {history.length} readings &middot; Entropy bits over time
      </div>
    </section>
  )
}
