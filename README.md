# CoffeeAgent

> *"The OS for creators who refuse to be a prompt slave."*

[![Tauri](https://img.shields.io/badge/Tauri-2.0-black?logo=tauri&style=flat-square)](https://tauri.app)
[![Ollama](https://img.shields.io/badge/Ollama-Local-FF6F00?style=flat-square&logoColor=white)](https://ollama.com)
[![Memory](https://img.shields.io/badge/Memory-35MB-238636?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-8B949E?style=flat-square)]()

A **lightweight, cross-platform** Tauri 2.0 menu bar agent panel that unifies **OpenClaw**, **Hermes**, and **OpenHuman** for local-first digital creators.

No cloud API keys. No electron bloat. No tracking. Just your files, your models, your workflow.

---

## Project Identity

`CoffeeAgent` is not another AI wrapper. It's a **control center** for the modern content creator's toolchain:

| Component | Purpose | Integration |
|-----------|---------|-------------|
| **OpenClaw** | `SKILL.md` knowledge base | Drag-drop semantic search |
| **Hermes** | Trigger automation configs | Real-time YAML/JSON ingest |
| **OpenHuman** | Obsidian memory vault | Bidirectional thought linking |
| **Ollama** | Local LLM inference | Zero-config 11434 port bridge |

The goal: **100% local data sovereignty** with **sub-50ms activation latency**.

---

## Why It Exists

```
Problem:                     Solution:
───────────────────────────────────────────────
AI wrappers = cloud lock-in → CoffeeAgent runs locally
20 tabs for 20 tools        → Single ⌥Space spotlight
Electron apps eating 2GB RAM → Tauri: 35MB baseline
Prompt engineering fatigue  → Flesch-calibrated micro-posts
Vector DB complexity        → Pure text, pure speed
```

We believe in **human-curated knowledge** over **synthetic slop**. This tool enforces that philosophy through architecture.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    macOS / Linux / Windows                 │
│                        (System Tray)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ ⌥Space Global Shortcut
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Tauri 2.0 Runtime                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Rust Core      │  │   WebView       │  │  Tokio HTTP  │ │
│  │  • System Tray  │  │   • Vanilla JS  │  │  • Ollama    │ │
│  │  • Global Keys  │  │   • No React    │  │    Streaming │ │
│  │  • File I/O     │  │   • CSS Grid    │  │  • 5m TTL    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
┌────────────────┐ ┌─────────┐ ┌──────────────────┐
│   OpenClaw     │ │ Hermes  │ │   OpenHuman      │
│  (SKILL.md)    │ │ (YAML)  │ │  (Obsidian MD)   │
│   ─────────    │ │ ─────── │ │   ────────────   │
│  • Drag-drop   │ │ • Trig. │ │  • Wiki-links    │
│  • Flesch Ease │ │ • Pipes │ │  • Knowledge G.  │
└────────────────┘ └─────────┘ └──────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────┐
│              Ollama (127.0.0.1:11434)              │
│  • qwen2.5:7b  (default, multilingual)             │
│  • llama3.2:3b (ultra-light)                       │
│  • phi4:3.8b   (reasoning)                         │
│  • gemma3:4b   (Google)                            │
│  Streaming: true | Keep-alive: 5min | VRAM: auto   │
└────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Spotlight-Style Activation
- **Global hotkey**: `⌥Space` (Option+Space) from anywhere
- **System tray** persistent; no dock icon clutter
- **Zero-latency** window toggle (<50ms)

### 2. Native File Bridge
```bash
# Drop zones support:
*.md   → OpenClaw skill files
*.json → Hermes trigger configs
*.yaml → Hermes pipelines
*.md   → OpenHuman memory trees
```
All processing happens **in-memory**. No cloud upload. No telemetry.

### 3. Flesch-Calibrated Micro-Posts
Hard-coded reading ease formula for instant text audit:

```javascript
// src/main.js - line 23-27
flesch = 206.835 
  - 1.015 × (totalWords / totalSentences)
  - 84.6 × (totalSyllables / totalWords)
```

| Score | Readability |
|-------|-------------|
| 90-100 | Grade 5 (Very Easy) |
| 60-70  | Grade 8-9 (Standard) |
| 30-40  | College (Difficult) |
| 0-30   | Professional (Hard) |

### 4. Streaming Ollama Pipeline
```javascript
fetch("http://127.0.0.1:11434/api/generate", {
  stream: true,
  keep_alive: "5m"  // Auto-release VRAM after 5min idle
});
```

---

## Hacker-Friendly Guide

### Pure Text Configuration

No GUI bloat. Just JSON. Create `~/.config/coffeeagent/prompts.json`:

```json
{
  "micro-post": {
    "system": "You are a micro-content editor.",
    "rules": [
      "Preserve original intent",
      "Max 280 chars per version",
      "3 alternative phrasings"
    ],
    "temperature": 0.7,
    "models": ["qwen2.5:7b", "llama3.2:3b"]
  },
  "skill-boost": {
    "system": "Enhance SKILL.md content.",
    "context_injection": true,
    "flesch_target": 60
  }
}
```

### Build from Source

```bash
# 1. Clone
git clone https://github.com/YOURNAME/CoffeeAgent.git
cd CoffeeAgent

# 2. Rust toolchain (if missing)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 3. Tauri CLI
cargo install tauri-cli

# 4. Build native binary
cargo tauri build --release

# 5. Find your binary
ls src-tauri/target/release/bundle/
```

### Ollama Auto-Configuration

CoffeeAgent expects Ollama on `127.0.0.1:11434`. One-liner setup:

```bash
# macOS (Homebrew)
brew install ollama
ollama serve &
ollama pull qwen2.5:7b  # default model

# Verify
ollama list
```

---

## Technical Specs

| Metric | Value |
|--------|-------|
| Runtime Memory | ~35MB (Rust+WebView) |
| Binary Size | ~15MB (macOS ARM64) |
| Boot Time | <200ms |
| Activation | <50ms (⌥Space) |
| Dependencies | 0 (runtime) |
| Build Time | ~45s (release) |

---

## Roadmap

- [ ] v0.2.0: MDX support for OpenHuman v2
- [ ] v0.3.0: WebDAV sync for skill libraries
- [ ] v0.4.0: WASM plugins for custom transformers
- [ ] v0.5.0: Linux ARM64 builds

---

## Philosophy

> "The best tool is the one you forget is there."

CoffeeAgent prioritizes:
1. **Local-first** → Your data never leaves the machine
2. **Ephemeral** → No database, no state files, pure runtime
3. **Composable** → Plays nice with existing CLI workflows
4. **Hackable** → 100% vanilla JS, no build step for UI mods

---

## License

MIT © 2025 CoffeeAgent Contributors

---

**Built with** ☕ **by creators, for creators.**

*Star this repo if you believe in local AI sovereignty.*
