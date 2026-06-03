import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import BootSequence from './components/BootSequence'
import Analyzer from './components/Analyzer'
import Generator from './components/Generator'
import Lockdown from './components/Lockdown'
import Footer from './components/Footer'
import Vault from './components/Vault'
import StrengthChart from './components/StrengthChart'
import DiagnosticExport from './components/DiagnosticExport'
import DictAttack from './components/DictAttack'
import TotpWidget from './components/TotpWidget'
import ComparisonMatrix from './components/ComparisonMatrix'
import ClipboardProtection from './components/ClipboardProtection'
import HotkeyHud from './components/HotkeyHud'
import EntropyWaveform from './components/EntropyWaveform'
import SimilarityMonitor from './components/SimilarityMonitor'
import Blog from './components/Blog'
import PostPage from './components/PostPage'
import { shannonEntropy } from './lib/security'

const BAN_KEYS = ['_sec_ban', '_cache_ts', '_sentinel_lock', '_pm_session_ban']
const BAN_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function generateFakeIP() {
  const r = () => Math.floor(Math.random() * 254) + 1
  return `${r()}.${r()}.${r()}.${r()}`
}
function generateFingerprint() {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().match(/.{4}/g).join('-')
}
function readBan() {
  try {
    for (const k of BAN_KEYS) {
      const raw = localStorage.getItem(k)
      if (!raw) continue
      const data = JSON.parse(raw)
      if (data?.expiresAt && Date.now() < data.expiresAt)
        return { ip: data.ip, fp: data.fingerprint, expiresAt: data.expiresAt }
      else if (data?.expiresAt) localStorage.removeItem(k)
    }
  } catch { /* ignore */ }
  return null
}
function writeBan(ip, fp, expiresAt) {
  const payload = JSON.stringify({ ip, fingerprint: fp, expiresAt, ts: Date.now() })
  try { for (const k of BAN_KEYS) localStorage.setItem(k, payload) } catch { /* noop */ }
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [password, setPassword] = useState('')
  const [attackSpeed, setAttackSpeed] = useState(1_000_000_000)
  const [lockdown, setLockdown] = useState(() => readBan())
  const [screen, setScreen] = useState('tool')
  const [selectedPost, setSelectedPost] = useState(null)
  const [entropyHistory, setEntropyHistory] = useState([])
  const [passwordHistory, setPasswordHistory] = useState([])
  const [sessionStart] = useState(() => Date.now())
  const devtoolsThreshold = useRef(160)
  const lastViolation = useRef(0)
  const lastRecorded = useRef('')

  useEffect(() => {
    if (password.length < 2) return
    const timer = setTimeout(() => {
      if (password === lastRecorded.current) return
      lastRecorded.current = password
      const e = shannonEntropy(password)
      setEntropyHistory(prev => [...prev, Math.round(e * 100) / 100])
      setPasswordHistory(prev => [...prev, password])
    }, 400)
    return () => clearTimeout(timer)
  }, [password])

  const triggerLockdown = useCallback(() => {
    const now = Date.now()
    if (now - lastViolation.current < 1500) return
    lastViolation.current = now
    const ip = generateFakeIP()
    const fp = generateFingerprint()
    const expiresAt = now + BAN_DURATION_MS
    writeBan(ip, fp, expiresAt)
    setLockdown({ ip, fp, expiresAt })
  }, [])

  // Escape panic
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setPassword('')
        setAttackSpeed(1_000_000_000)
        document.querySelectorAll('input:not([type=checkbox]):not([type=range]), textarea').forEach(el => { el.value = '' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // beforeunload cleanup
  useEffect(() => {
    function cleanup() { setPassword('') }
    window.addEventListener('beforeunload', cleanup)
    return () => window.removeEventListener('beforeunload', cleanup)
  }, [])

  // Shortcut blocking
  useEffect(() => {
    function onKey(e) {
      const k = e.key?.toLowerCase()
      if (e.key === 'F12') { e.preventDefault(); triggerLockdown(); return }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'i' || k === 'I' || k === 'j' || k === 'J' || k === 'c' || k === 'C')) {
        e.preventDefault(); triggerLockdown(); return
      }
      if ((e.ctrlKey || e.metaKey) && (k === 'u' || k === 'U' || k === 's' || k === 'S' || k === 'p' || k === 'P')) {
        e.preventDefault(); return
      }
      if (e.metaKey && e.altKey && (k === 'i' || k === 'I')) { e.preventDefault(); triggerLockdown(); return }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [triggerLockdown])

  // DevTools detection
  useEffect(() => {
    function checkDevtools() {
      const dw = window.outerWidth - window.innerWidth
      const dh = window.outerHeight - window.innerHeight
      if (dw > devtoolsThreshold.current || dh > devtoolsThreshold.current) triggerLockdown()
    }
    const interval = setInterval(() => {
      checkDevtools()
      const start = performance.now()
      // eslint-disable-next-line no-debugger
      debugger
      const elapsed = performance.now() - start
      if (elapsed > 100) triggerLockdown()
    }, 1500)
    return () => clearInterval(interval)
  }, [triggerLockdown])

  function onContextMenu(e) { e.preventDefault(); return false }

  if (lockdown) {
    return <Lockdown ip={lockdown.ip} fingerprint={lockdown.fp} expiresAt={lockdown.expiresAt} />
  }

  if (!booted) {
    return (
      <div onContextMenu={onContextMenu} className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--bg-deep)' }}>
        <div className="crt-scanlines" />
        <div className="crt-vignette" />
        <Header />
        <BootSequence onComplete={() => setBooted(true)} />
        <Footer />
      </div>
    )
  }

  if (screen === 'post' && selectedPost) {
    return <PostPage post={selectedPost} onBack={() => { setScreen('blog'); setSelectedPost(null) }} />
  }

  if (screen === 'blog') {
    return <Blog onOpenPost={(post, back) => { if (back) setScreen('tool'); else { setSelectedPost(post); setScreen('post') } }} />
  }

  return (
    <div onContextMenu={onContextMenu} className="min-h-screen p-3 md:p-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Navigation bar */}
        <div className="no-select mb-4 bento-panel flex items-center justify-between">
          <div className="text-[10px] text-muted tracking-widest">TERMINAL MODE</div>
          <button onClick={() => setScreen('blog')} className="btn btn-primary">
            SECURITY BLOG →
          </button>
        </div>

        {/* Row 1: Analyzer + Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Analyzer password={password} setPassword={setPassword} attackSpeed={attackSpeed} setAttackSpeed={setAttackSpeed} />
          <Generator onGenerated={setPassword} attackSpeed={attackSpeed} />
        </div>

        {/* Entropy Waveform (full width) */}
        <div className="mb-4">
          <EntropyWaveform entropy={shannonEntropy(password)} />
        </div>

        {/* Row 2: Vault + Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Vault />
          <ComparisonMatrix />
        </div>

        {/* Row 3: DictAttack + TOTP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <DictAttack />
          <TotpWidget />
        </div>

        {/* Row 4: StrengthChart + SimilarityMonitor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <StrengthChart history={entropyHistory} />
          <SimilarityMonitor currentPassword={password} history={passwordHistory} />
        </div>

        {/* Diagnostic Export (full width) */}
        <div className="mb-4">
          <DiagnosticExport password={password} attackSpeed={attackSpeed} history={entropyHistory} sessionStart={sessionStart} />
        </div>

        {/* Blog link */}
        <div className="no-select mb-4 bento-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs neon-text font-bold tracking-widest">SECURITY EDUCATION BLOG</div>
              <div className="text-[10px] text-muted">55+ articles on passwords, breaches, phishing &amp; privacy</div>
            </div>
            <button onClick={() => setScreen('blog')} className="btn btn-primary">
              BROWSE →
            </button>
          </div>
        </div>

        <Footer />

        {/* Floating UI */}
        <ClipboardProtection />
        <HotkeyHud />
      </div>
    </div>
  )
}
