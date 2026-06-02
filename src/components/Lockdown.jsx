import { useEffect, useState } from 'react'
import { Skull, AlertTriangle } from 'lucide-react'

export default function Lockdown({ ip, fingerprint, expiresAt }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = Math.max(0, expiresAt - now)
  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border-2 border-[#ff2a2a] rounded p-6 md:p-8"
        style={{ boxShadow: '0 0 30px rgba(255,42,42,0.4), inset 0 0 20px rgba(255,42,42,0.1)' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skull size={42} className="text-[#ff2a2a]" />
          <AlertTriangle size={42} className="text-[#ff2a2a]" />
          <Skull size={42} className="text-[#ff2a2a]" />
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#ff2a2a] tracking-widest mb-2"
          style={{ textShadow: '0 0 10px rgba(255,42,42,0.6)' }}>
          🔒 SECURITY VIOLATION DETECTED
        </h1>
        <div className="text-center text-sm text-[#ff5050] mb-6">
          Your IP <span className="font-bold text-[#ff2a2a]">{ip}</span> has been blocked for 7 days.
        </div>
        <div className="border border-[#ff2a2a] rounded p-4 bg-[rgba(255,42,42,0.05)] mb-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[#ff5050] tracking-widest text-[10px]">SESSION FINGERPRINT</div>
              <div className="text-[#ff2a2a] font-mono break-all">{fingerprint}</div>
            </div>
            <div>
              <div className="text-[#ff5050] tracking-widest text-[10px]">REMAINING LOCKOUT</div>
              <div className="text-[#ff2a2a] font-mono">
                {days}d {hours}h {minutes}m {seconds}s
              </div>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-[rgba(255,80,80,0.6)] text-center space-y-1">
          <div>⚠ Tampering with developer tools or attempting reverse engineering</div>
          <div>constitutes a violation of the terms of use.</div>
          <div className="mt-3 text-[rgba(255,80,80,0.4)]">
            This is a client-side deterrent only. No real data was transmitted.
          </div>
        </div>
      </div>
    </div>
  )
}
