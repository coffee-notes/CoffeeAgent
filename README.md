# CoffeeAgent

`Cross-platform, Local-First AI Agent Shell for Deep Work`

**CoffeeAgent** is an open-source, local-first interface layer designed for high-efficiency creators. It bridges the gap between raw LLM backends (like Ollama) and your daily local workflows. Built with Tauri 2.0, it prioritizes performance, privacy, and low-latency interaction.

---

## 🛠 Tech Stack & Architecture

* **Frontend**: JavaScript/CSS (Optimized for Apple Silicon retina displays).
* **Core**: Rust (Tauri 2.0 shell for native OS integration).
* **Backend**: Local LLM providers (Ollama recommended).
* **Design Philosophy**: Minimalist UI, strict data sovereignty, no telemetry.

## 🚀 Building from Source

For developers interested in contributing or modifying the core shell:

### Prerequisites

- Node.js (Latest LTS)
- Rust (Latest Stable)
- Tauri CLI

### Development Setup

```bash
# Clone the repository
git clone https://github.com/coffee-notes/CoffeeAgent.git
cd CoffeeAgent

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## 📦 Installation

Pre-built binaries are available on the [Releases](https://github.com/coffee-notes/CoffeeAgent/releases) page.

**macOS:**
1. Download `CoffeeAgent.dmg`
2. Drag to Applications
3. Press `⌥ + Space` to activate

**Windows:**
1. Download `CoffeeAgent-Setup.exe`
2. Install and launch
3. Press `Alt + Space` to activate

## 🤝 Contributing

We welcome PRs that improve performance, reduce memory footprint, or enhance the local-first architecture.

## 🔗 Official Hub

https://hub.coffeenotehq.com/

---

*Built by Coffee Notes | For creators who value data sovereignty.*
