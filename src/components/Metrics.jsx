function Cell({ label, value, color = 'var(--neon)' }) {
  return (
    <div className="no-select border border-[var(--neon-glow)] rounded p-3 bg-black/40">
      <div className="text-[10px] tracking-widest text-[rgba(0,255,65,0.4)] mb-1">{label}</div>
      <div className="text-sm md:text-base font-bold" style={{ color, textShadow: '0 0 4px rgba(0,255,65,0.2)' }}>
        {value}
      </div>
    </div>
  )
}

export default function Metrics({ length, charset, entropy, crackTime }) {
  const entColor = entropy >= 80 ? 'var(--neon)' : entropy >= 60 ? '#00c8ff' : entropy >= 40 ? '#ffa000' : '#ff5050'
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Cell label="LENGTH" value={length} />
      <Cell label="CHARSET" value={charset} />
      <Cell label="ENTROPY" value={`${entropy.toFixed(2)} bits`} color={entColor} />
      <Cell label="CRACK TIME" value={crackTime} />
    </div>
  )
}
