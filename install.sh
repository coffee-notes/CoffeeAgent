#!/bin/bash

# CoffeeAgent One-Command Installer for macOS/Linux
# Optimized & Robust Automated Deployment Script

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error trap handler
error_handler() {
    log_error "An error occurred on line $1. Deployment failed!"
    log_info "Please check the logs above to identify the missing dependency or build issue."
}
trap 'error_handler $LINENO' ERR

# Phase 1: Environment Detection
echo ""
log_info "╔════════════════════════════════════════════════════════════╗"
log_info "║   CoffeeAgent Quick Deploy — macOS/Linux Edition           ║"
log_info "╚════════════════════════════════════════════════════════════╝"
echo ""

log_info "Phase 1/5: Detecting system environment..."
OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
    Darwin)
        PLATFORM="macos"
        if [[ "$ARCH" == "arm64" ]]; then
            TARGET="aarch64-apple-darwin"
            log_success "Detected: macOS Apple Silicon (M-series)"
        else
            TARGET="x86_64-apple-darwin"
            log_success "Detected: macOS Intel"
        fi
        ;;
    Linux)
        PLATFORM="linux"
        if [[ "$ARCH" == "aarch64" ]]; then
            TARGET="aarch64-unknown-linux-gnu"
            log_success "Detected: Linux ARM64"
        else
            TARGET="x86_64-unknown-linux-gnu"
            log_success "Detected: Linux x64"
        fi
        ;;
    *)
        log_error "Unsupported OS: $OS"
        exit 1
        ;;
esac

# Phase 2: Dependency Check
log_info ""
log_info "Phase 2/5: Validating dependencies..."

check_command() {
    if command -v "$1" &> /dev/null; then
        log_success "$1 installed: $(command -v "$1")"
        return 0
    else
        return 1
    fi
}

MISSING_DEPS=()

if ! check_command "git"; then
    MISSING_DEPS+=("git")
fi

# Detect available JS Package Managers
PKG_MANAGER=""
if check_command "bun"; then
    PKG_MANAGER="bun"
elif check_command "pnpm"; then
    PKG_MANAGER="pnpm"
elif check_command "yarn"; then
    PKG_MANAGER="yarn"
elif check_command "npm"; then
    PKG_MANAGER="npm"
elif check_command "node" || check_command "nodejs"; then
    log_warn "Node.js detected but no package manager (npm/yarn/pnpm/bun) found."
    MISSING_DEPS+=("npm")
else
    MISSING_DEPS+=("node")
fi

if [ -n "$PKG_MANAGER" ]; then
    log_success "Selected package manager: $PKG_MANAGER"
fi

if ! check_command "cargo"; then
    MISSING_DEPS+=("rust")
fi

if [ "$PLATFORM" == "linux" ]; then
    log_info "System check: Ensuring required packages are ready for Linux Tauri compilation..."
    log_info "If compilation fails, please ensure you run:"
    log_info "  Ubuntu/Debian: sudo apt install -y libsoup-3.0-dev libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev"
    log_info "  Fedora: sudo dnf groupinstall \"Development Tools\" && sudo dnf install webkit2gtk4.1-devel openssl-devel gtk3-devel libsoup3-devel libayatana-appindicator-devel librsvg2-devel"
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    log_error "Missing required dependencies: ${MISSING_DEPS[*]}"
    log_info ""
    if [ "$PLATFORM" == "macos" ]; then
        log_info "Install via Homebrew:"
        log_info "  brew install git node rust"
    else
        log_info "Please install git, nodejs/npm, and rust using your system package manager."
    fi
    log_info ""
    log_info "Or install Rust via rustup:"
    log_info "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Phase 3: Workspace Setup
log_info ""
log_info "Phase 3/5: Setting up workspace..."

INSTALL_DIR="${INSTALL_DIR:-$HOME/CoffeeAgent}"
if [ -d "$INSTALL_DIR" ]; then
    log_warn "Directory exists: $INSTALL_DIR"
    
    # Check if stdout & stdin are terminal TTYs to support non-interactive pipes
    if [ -t 0 ] && [ -t 1 ] && [ -z "${NON_INTERACTIVE}" ]; then
        read -p "Remove and reclone? [y/N]: " -n 1 -r REPLY
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$INSTALL_DIR"
        else
            log_info "Using existing directory"
        fi
    else
        if [ "${FORCE_CLEAN}" = "1" ]; then
            log_info "FORCE_CLEAN=1 detected. Removing existing directory..."
            rm -rf "$INSTALL_DIR"
        else
            log_info "Running non-interactively. Keeping existing directory. (Set FORCE_CLEAN=1 to override)"
        fi
    fi
fi

if [ ! -d "$INSTALL_DIR" ]; then
    log_info "Cloning repository..."
    git clone https://github.com/coffee-notes/CoffeeAgent.git "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
log_success "Workspace ready at: $INSTALL_DIR"

# Phase 4: Rust Toolchain & Target Setup
log_info ""
log_info "Phase 4/5: Configuring Rust toolchain..."

# Handle target list safely without crashing if rustup is missing (e.g. system-installed Rust)
if command -v rustup &> /dev/null; then
    if ! rustup target list --installed | grep -q "$TARGET"; then
        log_info "Adding target: $TARGET"
        rustup target add "$TARGET" || log_warn "Could not add target via rustup. Continuing anyway..."
    fi
    log_success "Rust toolchain verified via rustup"
else
    log_info "rustup not detected. Assuming native host toolchain is configured for $TARGET."
fi

# Phase 5: Build Application (Tauri 2.0 Optimized)
log_info ""
log_info "Phase 5/5: Building CoffeeAgent..."

# Install node modules using detected package manager
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
    log_info "Installing dependencies via $PKG_MANAGER..."
    case "$PKG_MANAGER" in
        bun)  bun install ;;
        pnpm) pnpm install ;;
        yarn) yarn install ;;
        *)    npm install ;;
    esac
fi

# Resolve the most efficient Tauri executor
TAURI_CMD=""
if [ -f "package.json" ] && grep -q "@tauri-apps/cli" package.json; then
    log_success "Detected project-local Tauri CLI"
    case "$PKG_MANAGER" in
        bun)  TAURI_CMD="bunx tauri" ;;
        pnpm) TAURI_CMD="pnpm tauri" ;;
        yarn) TAURI_CMD="yarn tauri" ;;
        *)    TAURI_CMD="npx tauri" ;;
    esac
else
    if command -v "cargo-tauri" &> /dev/null; then
        TAURI_CMD="cargo tauri"
    else
        log_warn "Tauri CLI not found locally or globally. Installing Tauri CLI globally via Cargo..."
        cargo install tauri-cli --locked
        TAURI_CMD="cargo tauri"
    fi
fi

log_info "Compiling application using: $TAURI_CMD build --target $TARGET"
$TAURI_CMD build --target "$TARGET"

# Locate built binary
BUNDLE_DIR="src-tauri/target/$TARGET/release/bundle"
if [ "$PLATFORM" == "macos" ]; then
    APP_PATH="$BUNDLE_DIR/macos/CoffeeAgent.app"
    DMG_PATH=$(find "$BUNDLE_DIR/dmg" -name "*.dmg" 2>/dev/null | head -n 1)
  
    if [ -f "$DMG_PATH" ]; then
        log_success "Build complete: $DMG_PATH"
        log_info ""
        log_info "Install by opening the DMG and dragging to Applications"
        if [ -t 0 ] && [ -t 1 ]; then
            open "$BUNDLE_DIR/dmg" 2>/dev/null || true
        fi
    elif [ -d "$APP_PATH" ]; then
        log_success "Build complete: $APP_PATH"
        log_info ""
        log_info "Manual install:"
        log_info "  cp -r \"$APP_PATH\" /Applications/"
    else
        log_warn "Bundle not found at expected path"
        find "$BUNDLE_DIR" -type f -name "*.app" -o -name "*.dmg" 2>/dev/null | head -5
    fi
else
    # Linux builds
    APPIMAGE=$(find "$BUNDLE_DIR/appimage" -name "*.AppImage" 2>/dev/null | head -n 1)
    DEB=$(find "$BUNDLE_DIR/deb" -name "*.deb" 2>/dev/null | head -n 1)
  
    if [ -f "$APPIMAGE" ]; then
        log_success "Build complete: $APPIMAGE"
        chmod +x "$APPIMAGE"
        log_info ""
        log_info "Run directly: $APPIMAGE"
    elif [ -f "$DEB" ]; then
        log_success "Build complete: $DEB"
        log_info "Install with: sudo dpkg -i $DEB"
    else
        BINARY="src-tauri/target/$TARGET/release/CoffeeAgent"
        if [ -f "$BINARY" ]; then
            log_success "Binary built: $BINARY"
        fi
    fi
fi

# Completion
echo ""
log_info "╔════════════════════════════════════════════════════════════╗"
log_info "║               Deployment Complete                          ║"
log_info "╚════════════════════════════════════════════════════════════╝"
echo ""
log_info "Quick start:"
log_info "  1. Ensure Ollama is running: ollama serve"
log_info "  2. Pull default model: ollama pull qwen2.5:7b"
log_info "  3. Launch CoffeeAgent from Applications or run the binary"
log_info ""
log_info "Global shortcut: ⌥ + Space (Option+Space)"
log_info ""
log_success "Enjoy your local-first AI workspace!"
