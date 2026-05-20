# CoffeeAgent / 咖啡特工

<p align="center"><img src="./icon.jpg" width="150" alt="CoffeeAgent Icon"/></p>

> *"The OS for creators who refuse to be a prompt slave."*
> *"拒绝成为提示词奴隶的创作者操作系统。"*

[![Tauri](https://img.shields.io/badge/Tauri-2.0-black?logo=tauri&style=flat-square)](https://tauri.app)
[![Ollama](https://img.shields.io/badge/Ollama-Local-FF6F00?style=flat-square&logoColor=white)](https://ollama.com)
[![Memory](https://img.shields.io/badge/Memory-35MB-238636?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-8B949E?style=flat-square)]()

---

## ⚠️ Status / 运行状态

**Currently in Alpha. Untested in production. Use at your own risk.**

当前处于 **Alpha 内测阶段**，尚未完成全量本地测试。请小白用户耐心等待正式版 Release，开发者可随时提交 PR 参与共建。

---

## 🎯 Project Identity / 项目定位

`CoffeeAgent` is not another AI wrapper. It's a **control center** for the modern content creator's toolchain, designed for **100% local data sovereignty** with **sub-50ms activation latency**.

`CoffeeAgent` 不是又一个云端 AI 套壳工具。它是专为现代内容创作者打造的**控制中枢**，旨在实现**100% 本地数据主权**，并以**低于 50 毫秒**的延迟极速唤醒。

| Component / 组件 | Purpose / 用途 | Integration / 集成方式 |
|------------------|----------------|------------------------|
| **OpenClaw** | `SKILL.md` knowledge base / 技能知识库 | Drag-drop semantic search / 拖拽语义搜索 |
| **Hermes** | Trigger automation configs / 触发器自动化配置 | Real-time YAML/JSON ingest / 实时 YAML/JSON 解析 |
| **OpenHuman** | Obsidian memory vault / 记忆笔记库 | Bidirectional thought linking / 双向思维链接 |
| **Ollama** | Local LLM inference / 本地大模型推理 | Zero-config 11434 port bridge / 零配置 11434 端口桥接 |

---

## 📸 UI Preview / 界面预览

<p align="center">
  <img src="docs/mac-ui.png" width="420" alt="Mac UI Preview / Mac 版界面预览"/>
  <img src="docs/win-ui.png" width="420" alt="Win UI Preview / Win 版界面预览"/>
</p>

*Left: macOS Interface | Right: Windows Interface (Design subject to change in actual releases)*

*左图：macOS 版本界面 | 右图：Windows 版本界面（界面样式以实际版本为准）*

---

## 📥 Easy Install for Beginners / 小白傻瓜式安装

Don't want to touch code? Just download the pre-built installer.

不想折腾代码？直接下载安装包即可开箱即用！

### Windows Users / Windows 用户

1. Click **[Releases]** on the right side of this page.
2. Download the latest `CoffeeAgent-Setup.exe` (or `.msi` package).
3. Double-click to run the installer and follow the prompts.
4. After installation, press `Alt + Space` to wake up the panel.

1. 点击本页面右侧的 **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)**。
2. 下载最新的 `CoffeeAgent-Setup.exe`（或 `.msi` 安装包）。
3. 双击运行安装程序，按提示完成安装。
4. 安装完成后，按 `Alt + 空格键` 即可唤醒面板。

### Mac Users / Mac 用户

1. Click **[Releases]** on the right side of this page.
2. Download the latest `CoffeeAgent.dmg`.
3. Double-click the DMG file and drag the CoffeeAgent icon into your Applications folder.
4. Open CoffeeAgent from Launchpad and press `⌥ + Space` (Option+Space) to wake up the panel.

1. 点击本页面右侧的 **[Releases](https://github.com/coffee-notes/CoffeeAgent/releases)**。
2. 下载最新的 `CoffeeAgent.dmg`。
3. 双击打开 DMG 文件，将 CoffeeAgent 图标拖入「应用程序」文件夹。
4. 从「启动台」打开 CoffeeAgent，按 `⌥ + 空格键`（Option+空格）即可唤醒面板。

> 💡 **Tip / 提示:** If macOS warns "cannot verify developer", go to System Settings → Privacy & Security → Click "Open Anyway."
> 如果系统提示"无法验证开发者"，请前往「系统设置 → 隐私与安全性」中点击"仍要打开"。

---

## 🛠️ One-Command Deployment / 极客一键部署

For developers or power users who prefer terminal control:

适合开发者或喜欢折腾的高级用户：

**macOS / Linux:**
```bash
curl -sSL https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/coffee-notes/CoffeeAgent/main/install.bat | iex
```

---

## 🧠 Ollama Auto-Configuration / 大模型傻瓜配置

CoffeeAgent relies on local LLM inference via Ollama. No internet required, your data stays local.

CoffeeAgent 依靠本地大模型 Ollama 运行，无需联网，保护隐私。

### 3 Simple Steps / 简单 3 步：

1. **Download Ollama / 下载 Ollama**
   - Visit [Ollama Official Site](https://ollama.com/download) / 访问 [Ollama 官网](https://ollama.com/download)
   - Download the installer for your system (Windows or Mac) / 根据你的系统（Windows 或 Mac）下载对应安装包
   - Double-click to install / 双击安装，按提示完成

2. **Pull the AI Model / 下载 AI 模型**
   - Open Terminal (Mac) or Command Prompt (Windows) / 打开终端（Mac）或命令提示符（Windows）
   - Run the following command to download the default model: / 输入以下命令，下载默认模型：
   ```bash
   ollama pull qwen2.5:7b
   ```
   - Wait for download to complete (~4GB) / 等待下载完成（约 4GB）

3. **Launch CoffeeAgent / 启动 CoffeeAgent**
   - Open the CoffeeAgent app / 打开 CoffeeAgent 应用
   - Use the shortcut to wake up the panel and start creating! / 按快捷键唤醒面板，开始创作！

> ✅ Once installed, Ollama runs automatically in the background. No manual startup needed.
> 安装完成后，Ollama 会在后台自动运行，无需每次手动启动。

---

## Why It Exists / 为什么要造这个轮子

```
Problem:                     Solution:
───────────────────────────────────────────────
AI wrappers = cloud lock-in → CoffeeAgent runs locally
20 tabs for 20 tools        → Single ⌥Space spotlight
Electron apps eating 2GB RAM → Tauri: 35MB baseline
Prompt engineering fatigue  → Flesch-calibrated micro-posts
Vector DB complexity        → Pure text, pure speed
```

AI 套壳工具 = 云端锁定 → CoffeeAgent 完全本地运行
20 个工具 20 个标签页 → 一键 `⌥Space` 聚光灯唤醒
Electron 应用吃掉 2GB 内存 → Tauri：35MB 基线占用
提示词工程疲劳 → Flesch 易读度校准微写作
向量数据库复杂度 → 纯文本，纯速度

We believe in **human-curated knowledge** over **synthetic slop**. This tool enforces that philosophy through architecture.

我们相信**人工精选的知识**胜过**合成垃圾**。这个工具通过架构本身强制执行这一理念。

---

## Architecture Diagram / 架构图

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

## Core Features / 核心功能

### 1. Spotlight-Style Activation / 聚光灯式唤醒

- **Global hotkey**: `⌥Space` (Option+Space) from anywhere / 从任何位置按 `⌥Space`（Option+空格）全局快捷键
- **System tray** persistent; no dock icon clutter / 系统托盘常驻，无 Dock 图标干扰
- **Zero-latency** window toggle (<50ms) / 零延迟窗口切换（小于 50 毫秒）

### 2. Native File Bridge / 原生文件桥接

```bash
# Drop zones support:
*.md   → OpenClaw skill files
*.json → Hermes trigger configs
*.yaml → Hermes pipelines
*.md   → OpenHuman memory trees
```

All processing happens **in-memory**. No cloud upload. No telemetry.

所有处理均在**内存中**完成，无云端上传，无遥测追踪。

### 3. Flesch-Calibrated Micro-Posts / Flesch 校准微写作

Hard-coded reading ease formula for instant text audit:

硬编码易读度公式，实时文本审计：

```javascript
// src/main.js - line 23-27
flesch = 206.835 
  - 1.015 × (totalWords / totalSentences)
  - 84.6 × (totalSyllables / totalWords)
```

| Score / 分数 | Readability / 可读性 |
|--------------|---------------------|
| 90-100 | Grade 5 (Very Easy) / 五年级水平（极易）|
| 60-70  | Grade 8-9 (Standard) / 八至九年级水平（标准）|
| 30-40  | College (Difficult) / 大学水平（较难）|
| 0-30   | Professional (Hard) / 专业水平（艰深）|

### 4. Streaming Ollama Pipeline / Ollama 流式管道

```javascript
fetch("http://127.0.0.1:11434/api/generate", {
  stream: true,
  keep_alive: "5m"  // Auto-release VRAM after 5min idle
});
```

---

## Technical Specs / 技术规格

| Metric / 指标 | Value / 数值 |
|---------------|--------------|
| Runtime Memory / 运行时内存 | ~35MB (Rust+WebView) |
| Binary Size / 二进制体积 | ~15MB (macOS ARM64) |
| Boot Time / 启动时间 | <200ms |
| Activation / 唤醒延迟 | <50ms (⌥Space) |
| Dependencies / 运行时依赖 | 0 |
| Build Time / 构建时间 | ~45s (release) |

---

## Roadmap / 路线图

- [ ] v0.2.0: MDX support for OpenHuman v2 / OpenHuman v2 支持 MDX
- [ ] v0.3.0: WebDAV sync for skill libraries / 技能库 WebDAV 同步
- [ ] v0.4.0: WASM plugins for custom transformers / WASM 自定义转换器插件
- [ ] v0.5.0: Linux ARM64 builds / Linux ARM64 构建

---

## Philosophy / 理念

> "The best tool is the one you forget is there."
> "最好的工具是你忘记它存在的那个。"

CoffeeAgent prioritizes: / CoffeeAgent 优先保障：

1. **Local-first** → Your data never leaves the machine / **本地优先** → 您的数据永不离开本机
2. **Ephemeral** → No database, no state files, pure runtime / **无状态** → 无数据库，无状态文件，纯运行时
3. **Composable** → Plays nice with existing CLI workflows / **可组合** → 与现有 CLI 工作流无缝协作
4. **Hackable** → 100% vanilla JS, no build step for UI mods / **可 hack** → 100% 原生 JS，UI 修改无需构建步骤

---

## License / 许可

MIT © 2025 CoffeeAgent Contributors / MIT © 2025 CoffeeAgent 贡献者

---

**Built with** ☕ **by creators, for creators.**
**用** ☕ **铸造，为创作者而生。**

*Star this repo if you believe in local AI sovereignty.*
*若您相信本地 AI 主权，请点亮 Star。*
