export default function Footer() {
  return (
    <footer className="no-select mt-6 bento-panel">
      <div className="text-center text-[10px] md:text-xs neon-text tracking-widest font-bold mb-2">
        <span className="cursor">$_&gt; BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4</span>
      </div>
      <div className="text-center text-[10px] text-[var(--warning)] leading-relaxed border-t border-[rgba(255,215,0,0.15)] pt-2">
        <strong>This tool is for educational &amp; ethical hacking use only.</strong> Note: IP blocking and logging are simulated for deterrence.
      </div>
      <div className="text-center text-[9px] text-muted mt-2">
        Client-side only · No plaintext is ever stored or sent to any unauthorized server
      </div>
    </footer>
  )
}
