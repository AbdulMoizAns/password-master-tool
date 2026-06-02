// Category mapping based on content analysis
const CATEGORY_MAP = {
  1:'password',2:'password',3:'password',4:'password',5:'password',
  6:'password',7:'password',8:'password',9:'password',10:'password',
  11:'password',12:'password',13:'password',14:'password',15:'password',
  16:'password',17:'password',18:'password',19:'password',20:'security',
  21:'breach',22:'breach',23:'breach',24:'breach',25:'breach',
  26:'breach',27:'security',28:'breach',29:'breach',30:'breach',
  31:'breach',32:'breach',33:'breach',34:'security',35:'breach',
  36:'security',37:'breach',38:'security',39:'privacy',40:'breach',
  41:'security',42:'security',43:'security',44:'security',45:'security',
  46:'security',47:'security',48:'phishing',51:'security',52:'security',
  53:'security',54:'security',55:'security',56:'security',  57:'security',
  49:'security',50:'security',
  58:'security',59:'security',60:'security',
  61:'password',62:'password',63:'security',
  64:'security',65:'security',66:'password',
  67:'password',68:'security',69:'security',
  70:'password',71:'security',72:'password',
  73:'password',74:'security',75:'security',
  76:'password',77:'security',78:'security',
  79:'security',80:'security',81:'security',
  82:'security',83:'security',84:'security',
  85:'security',86:'security',87:'security',
  88:'security',89:'security',90:'security',
  91:'password',92:'security',93:'security',
  94:'security',95:'security',96:'security',
  97:'security',98:'security',99:'security',
  100:'security',
}

function extractTitle(content) {
  const m = content.match(/^#\s+(.+)/m)
  return m ? m[1].trim() : 'Untitled'
}

function extractExcerpt(content) {
  const lines = content.split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (t && !t.startsWith('#') && !t.startsWith('---') && !t.startsWith('**') && !t.startsWith('- ') && !t.startsWith('|')) {
      return t.length > 200 ? t.slice(0, 200).replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, '').trim() + '...' : t
    }
  }
  return ''
}

function estimateReadTime(content) {
  const words = content.split(/\s+/).length
  const min = Math.max(1, Math.round(words / 200))
  return `${min} min read`
}

function parseId(filename) {
  const m = filename.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 999
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function loadPosts() {
  // We use a dynamic import approach since import.meta.glob can't be in a helper
  // This function signature is used by the components that call it
  return []
}

export function buildPostsFromGlob(modules) {
  const entries = Object.entries(modules).map(([path, content]) => {
    const id = parseId(path)
    const title = extractTitle(content)
    const excerpt = extractExcerpt(content)
    const readTime = estimateReadTime(content)
    const category = CATEGORY_MAP[id] || 'security'
    return { id, title, excerpt, content, category, readTime, date: '2024-01-01', slug: slugify(title) }
  })
  return entries.sort((a, b) => b.id - a.id)
}

export const CATEGORIES = ['all', 'password', 'security', 'breach', 'phishing', 'privacy']
export const CATEGORY_LABELS = {
  all: 'ALL', password: 'PASSWORDS', security: 'SECURITY',
  breach: 'BREACHES', phishing: 'PHISHING', privacy: 'PRIVACY',
}
