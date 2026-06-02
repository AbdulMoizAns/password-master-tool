// Top 20 most common leaked passwords (k-anonymity friendly dictionary)
export const TOP_20_COMMON = [
  '123456', 'password', '123456789', '12345678', '12345',
  '111111', '1234567', 'sunshine', 'qwerty', 'iloveyou',
  'princess', 'admin', 'welcome', '666666', 'abc123',
  'football', '123123', 'monkey', '654321', '!@#$%^&*'
]

export function isInTop20(pwd) {
  if (!pwd) return false
  return TOP_20_COMMON.includes(pwd.toLowerCase())
}

// Calculate character set size based on which categories are present
export function getCharsetSize(pwd) {
  if (!pwd) return 0
  let size = 0
  if (/[a-z]/.test(pwd)) size += 26
  if (/[A-Z]/.test(pwd)) size += 26
  if (/\d/.test(pwd)) size += 10
  if (/[^A-Za-z0-9]/.test(pwd)) size += 33
  return size
}

// Shannon entropy in bits: L * log2(charset)
export function shannonEntropy(pwd) {
  const L = pwd?.length || 0
  const C = getCharsetSize(pwd)
  if (L === 0 || C === 0) return 0
  return L * Math.log2(C)
}

// Format large numbers into human-readable time
export function formatTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '0 seconds'
  if (seconds < 1) return 'instant'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  const units = [
    { s: 31536000, n: 'year' },
    { s: 2592000, n: 'month' },
    { s: 86400, n: 'day' },
    { s: 3600, n: 'hour' },
    { s: 60, n: 'minute' },
  ]
  for (const u of units) {
    if (seconds >= u.s) {
      const v = seconds / u.s
      return v >= 100 ? `${v.toExponential(2)} ${u.n}s` : `${v.toFixed(2)} ${u.n}s`
    }
  }
  return `${Math.round(seconds)} seconds`
}

// Brute-force time: combinations / attackSpeed
export function bruteForceTime(pwd, attackSpeed) {
  const L = pwd?.length || 0
  const C = getCharsetSize(pwd)
  if (L === 0 || C === 0) return 0
  // Average: half the keyspace
  const combinations = Math.pow(C, L) / 2
  return combinations / attackSpeed
}

// Detect predictable sequences
export function detectSequences(pwd) {
  if (!pwd || pwd.length < 3) return []
  const issues = []
  // Sequential numbers (123, 234, 987)
  for (let i = 0; i < pwd.length - 2; i++) {
    const a = pwd.charCodeAt(i)
    const b = pwd.charCodeAt(i + 1)
    const c = pwd.charCodeAt(i + 2)
    if (b - a === 1 && c - b === 1) { issues.push('Sequential ascending'); break }
    if (a - b === 1 && b - c === 1) { issues.push('Sequential descending'); break }
  }
  // Repeating chars (aaa, 111)
  if (/(.)\1{2,}/.test(pwd)) issues.push('Repeating characters')
  // Common keyboard patterns
  const patterns = ['qwerty', 'asdf', 'zxcv', 'qaz', 'wsx', '1q2w3e', '!@#']
  const low = pwd.toLowerCase()
  for (const p of patterns) { if (low.includes(p)) { issues.push('Keyboard pattern'); break } }
  return issues
}

// SHA-1 (required for HIBP k-anonymity) via Web Crypto
export async function sha1(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-1', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

// SHA-256 for live hashing display
export async function sha256(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// HIBP k-anonymity check
// Sends only the first 5 chars of the SHA-1 hash. Never sends the plaintext.
export async function checkHIBP(password) {
  if (!password) return { breached: false, count: 0, error: 'No password' }
  try {
    const hash = await sha1(password)
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    })
    if (!res.ok) return { breached: false, count: 0, error: `HTTP ${res.status}` }
    const text = await res.text()
    const lines = text.split('\n')
    for (const line of lines) {
      const [h, count] = line.trim().split(':')
      if (h === suffix) {
        return { breached: true, count: parseInt(count, 10), error: null }
      }
    }
    return { breached: false, count: 0, error: null }
  } catch (e) {
    return { breached: false, count: 0, error: e.message || 'Network error' }
  }
}

// Cryptographically secure password generator with strict validation
// Guarantees at least one char from EACH selected criteria.
export function generateSecurePassword({
  length = 16,
  useUpper = true,
  useLower = true,
  useNumbers = true,
  useSymbols = true,
} = {}) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const all = []
  const required = []
  if (useUpper) { all.push(upper); required.push(pickRandom(upper)) }
  if (useLower) { all.push(lower); required.push(pickRandom(lower)) }
  if (useNumbers) { all.push(numbers); required.push(pickRandom(numbers)) }
  if (useSymbols) { all.push(symbols); required.push(pickRandom(symbols)) }
  if (all.length === 0) return ''
  const pool = all.join('')
  const chars = [...required]
  for (let i = chars.length; i < length; i++) chars.push(pickRandom(pool))
  // Fisher-Yates shuffle with crypto-strong randomness
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

function pickRandom(charset) {
  return charset[randomInt(0, charset.length - 1)]
}

function randomInt(min, max) {
  const range = max - min + 1
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % range)
  const buf = new Uint32Array(1)
  let r
  do { crypto.getRandomValues(buf); r = buf[0] } while (r >= limit)
  return min + (r % range)
}

// Audit advice strings
export function auditAdvice(pwd) {
  const advice = []
  if (!pwd) return advice
  if (pwd.length < 8) advice.push('❌ Length < 8 — too short')
  else if (pwd.length < 12) advice.push('⚠️ Length < 12 — extend to 12+ for safety')
  if (!/[A-Z]/.test(pwd)) advice.push('⚠️ Missing uppercase')
  if (!/[a-z]/.test(pwd)) advice.push('⚠️ Missing lowercase')
  if (!/\d/.test(pwd)) advice.push('⚠️ Missing numbers')
  if (!/[^A-Za-z0-9]/.test(pwd)) advice.push('⚠️ Missing special characters')
  const seqs = detectSequences(pwd)
  for (const s of seqs) advice.push(`⚠️ ${s} detected`)
  if (/^(.)\1+$/.test(pwd)) advice.push('❌ All characters are identical')
  return advice
}
