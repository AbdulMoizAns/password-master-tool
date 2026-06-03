import { useState, useCallback, useEffect } from 'react'
import { Trash2, Eye, EyeOff, Key, Download, Shield } from 'lucide-react'
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
    <section className="no-select bento-panel focus-glow">
      <div className="bento-panel-header">
        <h2 className="bento-panel-title">[ vault.enc ]</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(s => !s)} className="btn">
            {showForm ? 'CLOSE' : '+ ADD'}
          </button>
          {items.length > 0 && (
            <button onClick={downloadVault} className="btn p-1.5">
              <Download size={12} />
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-3 space-y-2 border border-[var(--border-subtle)] rounded p-3 bg-[rgba(0,0,0,0.3)]">
          <input value={site} onChange={e => setSite(e.target.value)} placeholder="Site / service" className="input-field" />
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username / email" className="input-field" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="input-field" />
          <button onClick={addItem} disabled={!site || !username || !password} className="btn btn-primary">SAVE</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="pulse-glow text-center">
            <Shield size={48} className="text-[var(--accent)]" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.3))' }} />
          </div>
          <pre className="text-muted text-center leading-tight" style={{ fontSize: 10 }}>
{`╔═══════════════════════╗
║  N E O N   V A U L T ║
║                       ║
║    [  🔒  ]           ║
║   ENCRYPTED EMPTY     ║
╚═══════════════════════╝`}
          </pre>
          <div className="text-xs text-muted">No stored credentials. Click + ADD to encrypt a new entry.</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="border border-[var(--border-subtle)] rounded p-2 bg-[rgba(0,0,0,0.3)] hover:border-[var(--border-default)] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs neon-text-sm font-bold">{item.site}</span>
                <div className="flex gap-1">
                  <button onClick={() => setVisible(v => ({ ...v, [idx]: !v[idx] }))} className="btn min-h-0 p-1">
                    {visible[idx] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button onClick={() => removeItem(idx)} className="btn btn-danger min-h-0 p-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-muted">
                <span>User: {item.username}</span>
              </div>
              <div className="text-[10px] text-muted mt-1 flex items-center gap-1">
                <Key size={10} />
                <span>{visible[idx] ? item.password : '•'.repeat(Math.min(item.password.length, 20))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-[9px] text-muted mt-2">Data is base64-encoded in localStorage. No plaintext persistence.</div>
    </section>
  )
}
