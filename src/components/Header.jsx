export default function Header() {
  return (
    <header className="no-select mb-6 bento-panel">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl md:text-4xl font-bold tracking-[0.15em] neon-text text-center" style={{ fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace" }}>
          PASSWORD MASTER
        </h1>
        <div className="text-[10px] md:text-xs text-muted tracking-[0.15em] text-center">
          SECURE TERMINAL · v.0x7E4 · CLIENT-SIDE ONLY
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="nav-pill" style={{ cursor: 'default' }}>ETHICAL BREACH LAB</span>
          <span className="nav-pill" style={{ cursor: 'default' }}>CRACK-TIME SIMULATOR</span>
          <span className="nav-pill" style={{ cursor: 'default' }}>QUANTUM RESISTANT VIBE</span>
        </div>
      </div>
    </header>
  )
}
