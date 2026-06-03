function Cell({ label, value, color = 'var(--data-primary)' }) {
  return (
    <div className="metric-cell">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color, textShadow: `0 0 4px ${color}40` }}>
        {value}
      </div>
    </div>
  )
}

export default function Metrics({ length, charset, entropy, crackTime }) {
  const entColor = entropy >= 80 ? 'var(--accent)' : entropy >= 60 ? '#00c8ff' : entropy >= 40 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Cell label="LENGTH" value={length} />
      <Cell label="CHARSET" value={charset} />
      <Cell label="ENTROPY" value={`${entropy.toFixed(2)} bits`} color={entColor} />
      <Cell label="CRACK TIME" value={crackTime} />
    </div>
  )
}
