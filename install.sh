#!/bin/bash
# CoffeeAgent macOS/Linux One-Click Deployment Script
# Requires: Git, Node.js, Rust

set -e

echo "=========================================="
echo "   CoffeeAgent macOS/Linux Installer"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "[1/5] Checking prerequisites..."

command -v git >/dev/null 2>&1 || {
    echo -e "${RED}[ERROR] Git not found. Install via: brew install git${NC}"
    exit 1
}

command -v node >/dev/null 2>&1 || {
    echo -e "${RED}[ERROR] Node.js not found. Install via: brew install node${NC}"
    exit 1
}

if ! command -v rustc >/dev/null 2>&1; then
    echo -e "${YELLOW}[2/5] Rust not found. Installing...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

# Set install directory
INSTALL_DIR="$HOME/CoffeeAgent"
REPO_URL="https://github.com/coffee-notes/CoffeeAgent.git"

echo "[3/5] Cloning CoffeeAgent repository..."
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}[INFO] Directory exists. Pulling latest changes...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

echo "[4/5] Installing Tauri CLI..."
cargo install tauri-cli 2>/dev/null || true

echo "[5/5] Building release binary..."
cargo tauri build --release

# Find the built binary
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    BUNDLE_DIR="src-tauri/target/release/bundle/macos"
    if [ -d "$BUNDLE_DIR" ] && ls "$BUNDLE_DIR"/*.app >/dev/null 2>&1; then
        APP_PATH=$(ls "$BUNDLE_DIR"/*.app | head -1)
        echo ""
        echo "=========================================="
        echo -e "${GREEN}   Installation Complete!${NC}"
        echo "=========================================="
        echo ""
        echo "App location: $PWD/$APP_PATH"
        echo ""
        echo "Quick Start:"
        echo "  1. Install Ollama: brew install ollama"
        echo "  2. Run: ollama pull qwen2.5:7b"
        echo "  3. Open the .app bundle"
        echo "  4. Press ⌥Space (Alt+Space) to activate"
        echo ""
        read -p "Create symlink to /Applications? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ln -sf "$PWD/$APP_PATH" "/Applications/CoffeeAgent.app"
            echo -e "${GREEN}[OK] Symlink created.${NC}"
        fi
    else
        BINARY="src-tauri/target/release/CoffeeAgent"
        if [ -f "$BINARY" ]; then
            echo -e "${GREEN}Binary built: $PWD/$BINARY${NC}"
        fi
    fi
else
    # Linux
    BUNDLE_DIR="src-tauri/target/release/bundle/deb"
    if [ -d "$BUNDLE_DIR" ] && ls "$BUNDLE_DIR"/*.deb >/dev/null 2>&1; then
        DEB_PATH=$(ls "$BUNDLE_DIR"/*.deb | head -1)
        echo -e "${GREEN}Built: $DEB_PATH${NC}"
        read -p "Install .deb package? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo dpkg -i "$DEB_PATH"
        fi
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}   CoffeeAgent is ready!${NC}"
echo "=========================================="
echo ""
