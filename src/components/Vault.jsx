import { useState, useCallback, useEffect } from 'react'
import { Trash2, Eye, EyeOff, Key, Download } from 'lucide-react'
import { loadVault, saveVault } from '../lib/vault'

export default function Vault() {
  const [items, setItems] = useState(loadVault)
  const [site, setSite] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState({})
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { saveVault(items) }, [items])

  const addItem = useCallback(() => {
    if (!site.trim() || !username.trim() || !password.trim()) return
    const newItem = { site: site.trim(), username: username.trim(), password: password.trim(), created: Date.now() }
    setItems(p => [...p, newItem])
    setSite(''); setUsername(''); setPassword(''); setShowForm(false)
  }, [site, username, password])

  const removeItem = useCallback((idx) => {
    setItems(p => p.filter((_, i) => i !== idx))
  }, [])

  const downloadVault = useCallback(() => {
    if (items.length === 0) return
    const lines = items.map((e, i) => `${i + 1}. ${e.site} | ${e.username} | ${e.password}`)
    const blob = new Blob(['PASSWORD MASTER VAULT EXPORT\n' + '='.repeat(40) + '\n\n' + lines.join('\n') + '\n\n--- END ---'], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `vault_export_${Date.now()}.txt`; a.click()
    URL.revokeObjectURL(url)
  }, [items])

  return (
    <section className="no-select neon-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold neon-text tracking-widest">[ vault.enc ]</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(s => !s)} className="text-[10px] px-2 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)]">
            {showForm ? 'CLOSE' : '+ ADD'}
          </button>
          {items.length > 0 && (
            <button onClick={downloadVault} className="text-[10px] px-2 py-1 border border-[var(--neon-glow)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)]">
              <Download size={12} />
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-3 space-y-2 border border-[var(--neon-glow)] rounded p-3 bg-black/40">
          <input value={site} onChange={e => setSite(e.target.value)} placeholder="Site / service" className="w-full bg-black/60 border border-[var(--neon-glow)] rounded px-2 py-1 text-xs text-[var(--neon)] placeholder:text-[rgba(0,255,65,0.3)]" />
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username / email" className="w-full bg-black/60 border border-[var(--neon-glow)] rounded px-2 py-1 text-xs text-[var(--neon)] placeholder:text-[rgba(0,255,65,0.3)]" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full bg-black/60 border border-[var(--neon-glow)] rounded px-2 py-1 text-xs text-[var(--neon)] placeholder:text-[rgba(0,255,65,0.3)]" />
          <button onClick={addItem} disabled={!site || !username || !password} className="text-xs px-3 py-1 border border-[var(--neon)] text-[var(--neon)] rounded hover:bg-[rgba(0,255,65,0.1)] disabled:opacity-30">SAVE</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-xs text-[rgba(0,255,65,0.3)] py-4 text-center">No stored credentials. Click + ADD to encrypt a new entry.</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="border border-[var(--neon-glow)] rounded p-2 bg-black/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--neon)] font-bold">{item.site}</span>
                <div className="flex gap-1">
                  <button onClick={() => setVisible(v => ({ ...v, [idx]: !v[idx] }))} className="text-[var(--neon)] hover:bg-[rgba(0,255,65,0.1)] p-1 rounded">
                    {visible[idx] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button onClick={() => removeItem(idx)} className="text-[#ff5050] hover:bg-[rgba(255,50,50,0.1)] p-1 rounded">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-[rgba(0,255,65,0.5)]">
                <span>User: {item.username}</span>
              </div>
              <div className="text-[10px] text-[rgba(0,255,65,0.5)] mt-1 flex items-center gap-1">
                <Key size={10} />
                <span>{visible[idx] ? item.password : '•'.repeat(Math.min(item.password.length, 20))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-[9px] text-[rgba(0,255,65,0.2)] mt-2">Data is base64-encoded in localStorage. No plaintext persistence.</div>
    </section>
  )
}
