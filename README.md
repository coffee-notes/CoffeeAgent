# CoffeeAgent

<p align="center"><img src="./icon.jpg" width="150" alt="CoffeeAgent Icon"/></p>

> *"The OS for creators who refuse to be a prompt slave."*

[![Tauri](https://img.shields.io/badge/Tauri-2.0-black?logo=tauri&style=flat-square)](https://tauri.app)
[![Ollama](https://img.shields.io/badge/Ollama-Local-FF6F00?style=flat-square&logoColor=white)](https://ollama.com)
[![Memory](https://img.shields.io/badge/Memory-35MB-238636?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-8B949E?style=flat-square)]()

---

## ⚠️ Status / 运行状态

**Currently in Alpha. Untested in production. Use at your own risk.**

当前处于 **Alpha 内测阶段**，尚未经过生产环境全量测试，非技术创作者请耐心等待正式版 Release。

---

## 📸 UI Preview / 界面预览

<p align="center">
  <img src="docs/mac-ui.png" width="420" alt="macOS Interface"/>
  <img src="docs/win-ui.png" width="420" alt="Windows Interface"/>
</p>

---

## 📥 Quick Install / 极速安装

### For Non-technical Creators / 面向非技术创作者

**Windows:**
1. Visit **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)** → Download `CoffeeAgent-Setup.exe`
2. Double-click to install → Press `Alt + Space` to activate

**Mac:**
1. Visit **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)** → Download `CoffeeAgent.dmg`
2. Drag to Applications → Press `⌥ + Space` to activate

**Windows 用户：**
1. 访问 **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)** → 下载 `CoffeeAgent-Setup.exe`
2. 双击安装 → 按 `Alt + 空格键` 唤醒

**Mac 用户：**
1. 访问 **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)** → 下载 `CoffeeAgent.dmg`
2. 拖入应用程序文件夹 → 按 `⌥ + 空格键` 唤醒

### One-Command Deployment / 一键部署

**macOS / Linux:**
```bash
curl -sSL https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.bat | iex
```

---

## 🧠 Ollama Setup / 大模型配置

CoffeeAgent requires local LLM inference via Ollama. Your data never leaves your machine.

CoffeeAgent 依赖本地大模型 Ollama 运行，数据永不离开本机。

### 3-Step Configuration / 三步配置

1. **Download Ollama / 下载 Ollama**
   - Visit [ollama.com/download](https://ollama.com/download)
   - 访问 [ollama.com/download](https://ollama.com/download)

2. **Pull Model / 拉取模型**
   ```bash
   ollama pull qwen2.5:7b
   ```

3. **Launch CoffeeAgent / 启动 CoffeeAgent**
   - The app will auto-detect Ollama on port 11434
   - 应用将自动检测 11434 端口的 Ollama 服务

> ✅ Ollama runs as a background service. Zero-config after initial setup.
> 安装后 Ollama 作为后台服务运行，Zero-config 免配置。

---

## 🎯 Project Identity

`CoffeeAgent` is not another AI wrapper. It is a **control center** for the modern content creator's toolchain, engineered for **100% local data sovereignty** with **sub-50ms activation latency**.

| Component | Purpose | Integration |
|-----------|---------|-------------|
| **OpenClaw** | `SKILL.md` knowledge base | Drag-drop semantic search |
| **Hermes** | Trigger automation configs | Real-time YAML/JSON ingest |
| **OpenHuman** | Obsidian memory vault | Bidirectional thought linking |
| **Ollama** | Local LLM inference | Zero-config 11434 bridge |

---

## Why It Exists

```
Problem:                          Solution:
─────────────────────────────────────────────────────────
Cloud AI lock-in              →  CoffeeAgent: 100% local
20 tools, 20 browser tabs     →  Single ⌥Space spotlight
Electron apps: 2GB RAM        →  Tauri baseline: 35MB
Prompt engineering fatigue    →  Flesch-calibrated output
Vector DB complexity          →  Pure text, pure speed
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
- **Global hotkey**: `⌥Space` (Option+Space)
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

### 3. Flesch-Calibrated Output
```javascript
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
  keep_alive: "5m"
});
```

---

## Technical Specs

| Metric | Value |
|--------|-------|
| Runtime Memory | ~35MB (Rust+WebView) |
| Binary Size | ~15MB (macOS ARM64) |
| Boot Time | <200ms |
| Activation | <50ms (⌥Space) |
| Runtime Dependencies | 0 |
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
