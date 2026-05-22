<p align="center"><img src="./icon.jpg" width="150" alt="CoffeeAgent" style="border-radius: 16px;"/></p>

<h1 align="center">CoffeeAgent</h1>

<p align="center">
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-2.0-black?logo=tauri&style=flat-square" alt="Tauri 2.0"/></a>
  <a href="https://www.rust-lang.org"><img src="https://img.shields.io/badge/Rust-000000?logo=rust&style=flat-square" alt="Rust"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Local--First-2ea043?style=flat-square" alt="Local-First"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Privacy--Focused-8B949E?style=flat-square" alt="Privacy-Focused"/></a>
</p>

<p align="center"><strong>A cross-platform, local-first agent shell for creators.</strong></p>

---

## Overview

CoffeeAgent is an open-source, native application shell built with Tauri 2.0 and Rust. It provides a lightweight, high-performance interface for integrating local LLM backends (Ollama) into your daily workflow without compromising data privacy.

Designed for developers and technical creators who prioritize sovereignty over convenience.

---

## Quick Start

### Option A: Pre-built Binaries

Download the latest release from [GitHub Releases](https://github.com/coffee-notes/CoffeeAgent/releases).

**macOS:**
1. Download `CoffeeAgent.dmg`
2. Drag to Applications folder
3. Launch and press `⌥ + Space` to activate

**Windows:**
1. Download `CoffeeAgent-Setup.exe`
2. Install and launch
3. Press `Alt + Space` to activate

### Option B: One-Command Deployment

**macOS / Linux:**
```bash
curl -sSL https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.bat | iex
```

### Option C: Build from Source

```bash
# Clone repository
git clone https://github.com/coffee-notes/CoffeeAgent.git
cd CoffeeAgent

# Install dependencies
npm install

# Development mode
npm run tauri dev

# Production build
npm run tauri build
```

*Contributions and feedback are welcome.*

---

## Core Philosophy

- **Local-First**: All processing happens on-device. No cloud dependencies, no external API calls.
- **Privacy-Focused**: Your data never leaves your machine. No telemetry, no tracking.
- **Extensible**: Modular architecture supporting custom skill files and workflow integrations.

---

## Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla JavaScript + CSS (Zero framework overhead) |
| **Shell** | Tauri 2.0 (Rust) |
| **Backend** | Ollama (Local LLM inference) |
| **Design** | Minimalist, distraction-free interface |

---

## Collaboration

We are looking for contributors to help improve the cross-platform experience. Areas of interest:

- Linux ARM64 support
- Windows integration optimization
- Custom transformer plugins (WASM)
- Documentation and localization

Please open an issue or submit a PR if you'd like to contribute.

---

## License

MIT © CoffeeAgent Contributors

---

**Official Hub:** https://hub.coffeenotehq.com/

*Built for creators who value data sovereignty.*
