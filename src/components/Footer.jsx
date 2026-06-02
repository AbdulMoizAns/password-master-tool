export default function Footer() {
  return (
    <footer className="no-select mt-6 border border-[var(--neon-glow)] rounded p-3 bg-[rgba(0,255,65,0.01)]">
      <div className="text-center text-[10px] md:text-xs text-[var(--neon)] tracking-widest font-bold mb-2">
        <span className="cursor">$_&gt; BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4</span>
      </div>
      <div className="text-center text-[10px] text-[#ffa000] leading-relaxed border-t border-[rgba(255,160,0,0.2)] pt-2">
        ⚠️ <strong>This tool is for educational &amp; ethical hacking use only.</strong> Note: IP blocking and logging
        are simulated for deterrence. Reverse engineering attempts violate terms of use.
      </div>
      <div className="text-center text-[9px] text-[rgba(0,255,65,0.3)] mt-2">
        Client-side only · No plaintext is ever stored or sent to any unauthorized server
      </div>
    </footer>
  )
}
