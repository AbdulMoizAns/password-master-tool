const STORAGE_KEY = '_pm_vault'

function base64(str) {
  try { return btoa(str) } catch { return str }
}
function debase64(str) {
  try { return atob(str) } catch { return str }
}

export function loadVault() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(e => ({
      ...e,
      password: debase64(e.password),
      username: debase64(e.username),
      site: debase64(e.site),
    }))
  } catch { return [] }
}

export function saveVault(items) {
  const payload = JSON.stringify(items.map(e => ({
    site: base64(e.site),
    username: base64(e.username),
    password: base64(e.password),
    created: e.created || Date.now(),
    label: e.label || '',
  })))
  try { localStorage.setItem(STORAGE_KEY, payload) } catch { /* noop */ }
}
