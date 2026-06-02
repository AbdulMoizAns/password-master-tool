export default function Header() {
  return (
    <header className="no-select mb-6 border border-[var(--neon-glow)] rounded p-4 bg-[rgba(0,255,65,0.02)]">
      <div className="flex flex-col items-center gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold tracking-widest neon-text text-center"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          PASSWORD MASTER
        </h1>
        <div className="text-[10px] md:text-xs text-[rgba(0,255,65,0.4)] tracking-widest text-center">
          SECURE TERMINAL · v.0x7E4 · CLIENT-SIDE ONLY
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="px-3 py-1 text-[10px] md:text-xs border border-[var(--neon)] text-[var(--neon)] rounded-full tracking-widest"
            style={{ boxShadow: '0 0 6px rgba(0,255,65,0.3)' }}>
            ETHICAL BREACH LAB
          </span>
          <span className="px-3 py-1 text-[10px] md:text-xs border border-[var(--neon)] text-[var(--neon)] rounded-full tracking-widest"
            style={{ boxShadow: '0 0 6px rgba(0,255,65,0.3)' }}>
            CRACK-TIME SIMULATOR
          </span>
          <span className="px-3 py-1 text-[10px] md:text-xs border border-[var(--neon)] text-[var(--neon)] rounded-full tracking-widest"
            style={{ boxShadow: '0 0 6px rgba(0,255,65,0.3)' }}>
            QUANTUM RESISTANT VIBE
          </span>
        </div>
      </div>
    </header>
  )
}
