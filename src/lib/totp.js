// TOTP (RFC 6238) educational implementation

async function hmacSha1(keyBytes, data) {
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, data))
}

function base32decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const cleaned = str.toUpperCase().replace(/[^A-Z2-7]/g, '')
  const bits = []
  for (const c of cleaned) {
    const val = alphabet.indexOf(c)
    if (val >= 0) bits.push(val.toString(2).padStart(5, '0'))
  }
  const bin = bits.join('')
  const bytes = []
  for (let i = 0; i + 8 <= bin.length; i += 8) bytes.push(parseInt(bin.slice(i, i + 8), 2))
  return new Uint8Array(bytes)
}

function generateBase32Secret(len = 16) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => alphabet[b % 32]).join('')
}

// Counter → 8-byte big-endian buffer
function counterBytes(counter) {
  const buf = new ArrayBuffer(8)
  const dv = new DataView(buf)
  dv.setBigUint64(0, BigInt(counter), false)
  return new Uint8Array(buf)
}

// Dynamic truncation per RFC 4226
function truncate(hmac) {
  const offset = hmac[hmac.length - 1] & 0xf
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff)
  return code % 1000000
}

export async function generateTOTP(secretB32, timeStep = 30) {
  const counter = Math.floor(Date.now() / 1000 / timeStep)
  const keyBytes = base32decode(secretB32)
  const msg = counterBytes(counter)
  const hmac = await hmacSha1(keyBytes, msg)
  const code = truncate(hmac)
  const totp = String(code).padStart(6, '0')
  const expiresIn = timeStep - (Math.floor(Date.now() / 1000) % timeStep)
  return { totp, expiresIn, secret: secretB32 }
}

export function createTOTPSecret() {
  return generateBase32Secret(16)
}
