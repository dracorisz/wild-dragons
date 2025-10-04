@echo off
echo ===================================================
echo Wild Dragons NFT Marketplace - Master Setup Script
echo ===================================================
echo.

echo Step 1: Checking Python installation...
python --version 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating directory structure...
if not exist "data" mkdir data
if not exist "data\collections" mkdir data\collections
if not exist "data\resources" mkdir data\resources
if not exist "assets" mkdir assets
if not exist "assets\dragons" mkdir assets\dragons
if not exist "assets\cosmic" mkdir assets\cosmic
if not exist "assets\elemental" mkdir assets\elemental
if not exist "assets\fantasy" mkdir assets\fantasy
if not exist "assets\mythical" mkdir assets\mythical
if not exist "meta" mkdir meta
if not exist "src" mkdir src
if not exist "src\components" mkdir src\components
if not exist "src\views" mkdir src\views
if not exist "src\router" mkdir src\router
if not exist "crawler" mkdir crawler

echo.
echo Step 3: Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install requests beautifulsoup4 pillow argparse

echo.
echo Step 4: Generating mock data and images...
python crawler\wild_dragons_crawler.py --mode=mock
if %errorlevel% neq 0 (
    echo Failed to generate mock data.
    pause
    exit /b 1
)

echo.
echo Step 5: Checking Node.js dependencies...
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Node.js dependency installation failed.
        pause
        exit /b 1
    )
)

echo.
echo ===================================================
echo Wild Dragons NFT Marketplace setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To view the application, navigate to:
echo   http://localhost:5173/
echo ===================================================
pause
