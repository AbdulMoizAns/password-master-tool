# Password Master – Secure Terminal

A comprehensive, client-side password security education and analysis tool built with **React + Vite + Tailwind CSS**. Features a retro terminal aesthetic with real-time password analysis, cryptographically secure generation, breach checking, educational blog, and theatrical security deterrents.

## Features

### Core Password Tools
- **Password Analyzer `[analyzer.exe]`** — Shannon entropy, charset size, brute-force crack time calculator (adjustable attack speed: 1K/s to 100B/s), strength classification, dynamic audit advice
- **Password Generator `[generator.elf]`** — `crypto.getRandomValues()` with strict per-criteria guarantee (every selected character class appears at least once), length 8–64
- **HIBP Integration** — k-anonymity check against Have I Been Pwned (sends only first 5 chars of SHA-1 hash, never the plaintext)
- **Real-time SHA-256 Hashing** — Live Web Crypto API hash display
- **Top-20 Dictionary Check** — Instantly flags passwords matching the 20 most common leaked passwords: "🔥 CRACKED (top 20 common) - BREACHED"

### Educational Blog (100 Articles)
- Full **Security Education Blog** with 100 articles covering passwords, breaches, phishing, privacy, 2FA, password managers, and cybersecurity fundamentals
- Category filters: ALL / PASSWORDS / SECURITY / BREACHES / PHISHING / PRIVACY
- Search bar, responsive grid layout, full markdown reader
- Lazy-loaded via `import.meta.glob` — each post code-split into its own chunk
- SEO meta tags, Schema.org Article microdata

### Additional Tools
| Feature | Description |
|---|---|
| **`[vault.enc]`** | Local encrypted password vault with add/delete/view, base64-encoded localStorage, .txt export |
| **`[entropy.history]`** | Canvas line chart tracking entropy bits over your session |
| **`[entropy.waveform]`** | 32-bar CSS waveform responding to real-time entropy (amplitude, speed, hue) |
| **`[comparison.matrix]`** | 3-way side-by-side password comparison: length, charset, entropy, crack time, strength bars, failure points |
| **`[dict.attack]`** | Sandboxed wordlist brute-force simulator (100–100K wordlists), animated progress, live log |
| **`[totp.2fa]`** | Educational RFC 6238 6-digit TOTP authenticator widget with 30s rotation and countdown bar |
| **`[similarity.monitor]`** | Detects incremental/sequential password patterns (Admin1 → Admin2) against session history |
| **`[diagnostic.export]`** | Downloads full audit log (.txt) with all metrics, entropy history, advice, and crack-time data |
| **Clipboard Protection** | Auto-clears clipboard buffer 30s after any copy action with live countdown indicator |
| **Hotkey HUD** | Toggleable keybinding overlay (Shift+H) showing all hotkeys |

### Security & Anti-Inspection
- **DevTools Detection** — Viewport dimension diff + `debugger` timing trap, fires every 1.5s
- **Shortcut Blocking** — F12, Ctrl+Shift+I/C/J, Cmd+Option+I, Ctrl+U, Ctrl+S blocked
- **Right-Click Blocked** — Global `onContextMenu` prevention
- **Panic Button** — `Escape` key instantly wipes all state and inputs
- **Lockdown Simulation** — Triggered by DevTools/shortcuts, generates fake IP + session fingerprint, 7-day ban stored across 4 redundant localStorage keys
- **Memory Clearing** — `beforeunload` event listener wipes state on page close
- **CSS Copy Protection** — `select-none` on labels, `allow-select` on inputs/outputs

### Aesthetic
- Dark terminal theme with matrix green neon accents (`#00ff41`)
- CRT scanline overlay + vignette effect
- Share Tech Mono / Fira Code typography
- Blinking cursor in footer
- Pill badges: ETHICAL BREACH LAB / CRACK-TIME SIMULATOR / QUANTUM RESISTANT VIBE
- Footer: `$_> BRUTE-FORCE RESISTANCE ANALYZER | v.0x7E4`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 + custom CSS (CRT effects, neon glow) |
| Icons | lucide-react |
| Crypto | Web Crypto API (`crypto.getRandomValues`, `crypto.subtle`) |
| Routing | View-state based (no router dependency) |
| Blog | `import.meta.glob` lazy-loading of 100 markdown files |
| Linting | ESLint + React Hooks plugin |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── blog-posts/              # 100 educational markdown articles
├── public/
├── scripts/
│   └── generate-blog-posts.js     # Blog post generator
├── src/
│   ├── App.jsx              # Main shell: state, lockdown, routing
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind + CRT scanlines + neon glow
│   ├── lib/
│   │   ├── security.js      # Entropy, top-20 dict, SHA-1/256, HIBP, generator, audit
│   │   ├── blog.js          # Blog post loader + category mapping
│   │   ├── vault.js         # Encrypted vault persistence
│   │   ├── totp.js          # RFC 6238 TOTP implementation
│   │   └── similarity.js    # Levenshtein distance + incremental detection
│   └── components/
│       ├── Header.jsx       # Title + 3 badges
│       ├── BootSequence.jsx # Terminal boot animation
│       ├── Analyzer.jsx     # Password analysis panel
│       ├── Generator.jsx    # Password generator panel
│       ├── Metrics.jsx      # Entropy/charset/length/crack-time grid
│       ├── HashDisplay.jsx  # SHA-256 live hash
│       ├── HibpCheck.jsx    # k-anonymity HIBP fetch
│       ├── Vault.jsx        # Encrypted credential store
│       ├── StrengthChart.jsx      # Canvas entropy history chart
│       ├── EntropyWaveform.jsx    # Animated CSS entropy waveform
│       ├── ComparisonMatrix.jsx   # 3-way password comparison
│       ├── DictAttack.jsx         # Dictionary attack simulator
│       ├── TotpWidget.jsx         # Educational 2FA TOTP widget
│       ├── SimilarityMonitor.jsx  # Password sequence detection
│       ├── DiagnosticExport.jsx   # Audit log .txt download
│       ├── ClipboardProtection.jsx # 30s auto-clear timer
│       ├── HotkeyHud.jsx          # Keybinding overlay
│       ├── Blog.jsx               # Blog listing with search + filters
│       ├── PostPage.jsx           # Full post markdown reader
│       ├── Lockdown.jsx           # Ban screen overlay
│       └── Footer.jsx             # Legal notice + blinking cursor
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── eslint.config.js
```

## Navigation

```
Boot Screen → Terminal Tool → [SECURITY BLOG →] Blog Listing → click post → Full Reader
                              ↑                                     ← BACK
                              └─────── ← BACK TO TERMINAL
```

- **Shift+H** — Toggle hotkey HUD overlay
- **Escape** — Panic: wipe all state and inputs
- **F12/Ctrl+Shift+I** — Blocked + triggers lockdown simulation

## Privacy

- All password analysis happens entirely **client-side** in your browser
- Zero data transmitted to external servers (except HIBP k-anonymity hash prefix)
- No tracking, analytics, or telemetry
- HIBP integration uses the k-anonymity protocol — only the first 5 characters of your password's SHA-1 hash are sent to the API

## Educational Notice

> ⚠️ **This tool is for educational & ethical hacking use only.** IP blocking, logging, and ban simulations are client-side deterrents for educational purposes. Reverse engineering attempts violate terms of use. No plaintext passwords are ever logged or transmitted to unauthorized servers.

## License

Private project — all rights reserved.
