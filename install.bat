@echo off
chcp 65001 >nul
REM CoffeeAgent Windows One-Click Deployment Script
REM Requires: Git, Node.js, Rust

echo ==========================================
echo    CoffeeAgent Windows Installer
echo ==========================================
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...

git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git not found. Please install Git from https://git-scm.com/
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install from https://nodejs.org/
    exit /b 1
)

rustc --version >nul 2>&1
if errorlevel 1 (
    echo [2/5] Rust not found. Installing via rustup...
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    if errorlevel 1 (
        echo [ERROR] Rust installation failed. Please install manually from https://rustup.rs/
        exit /b 1
    )
)

REM Set install directory
set INSTALL_DIR=%USERPROFILE%\CoffeeAgent
set REPO_URL=https://github.com/coffee-notes/CoffeeAgent.git

echo [3/5] Cloning CoffeeAgent repository...
if exist "%INSTALL_DIR%" (
    echo [INFO] Directory exists. Pulling latest changes...
    cd /d "%INSTALL_DIR%"
    git pull origin main
) else (
    git clone %REPO_URL% "%INSTALL_DIR%"
    cd /d "%INSTALL_DIR%"
)

echo [4/5] Installing Tauri CLI...
cargo install tauri-cli 2>nul

echo [5/5] Building release binary...
cargo tauri build --release

if exist "%INSTALL_DIR%\src-tauri\target\release\CoffeeAgent.exe" (
    echo.
    echo ==========================================
    echo    Installation Complete!
    echo ==========================================
    echo.
    echo Binary location: %INSTALL_DIR%\src-tauri\target\release\CoffeeAgent.exe
    echo.
    echo Quick Start:
    echo   1. Install Ollama from https://ollama.com
    echo   2. Run: ollama pull qwen2.5:7b
    echo   3. Double-click CoffeeAgent.exe
    echo   4. Press Alt+Space to activate spotlight panel
    echo.
    echo Create shortcut? (Y/N)
    choice /c YN /n
    if errorlevel 1 if not errorlevel 2 (
        powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\CoffeeAgent.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\src-tauri\target\release\CoffeeAgent.exe'; $Shortcut.Save()"
        echo [OK] Desktop shortcut created.
    )
) else (
    echo [ERROR] Build failed. Check logs above.
    exit /b 1
)

echo.
echo Press any key to exit...
pause >nul
