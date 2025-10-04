@echo off
echo ======================================
echo Wild Dragons Setup Script for Windows
echo ======================================
echo.

echo Checking for Python installation...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo Python found! Checking version...
python --version

echo.
echo Creating directory structure...
if not exist "data" mkdir data
if not exist "data\raw" mkdir data\raw
if not exist "data\collections" mkdir data\collections
if not exist "data\resources" mkdir data\resources
if not exist "assets" mkdir assets
if not exist "assets\pinterest-thumbs" mkdir assets\pinterest-thumbs
if not exist "meta" mkdir meta
if not exist "crawler" mkdir crawler
if not exist "processor" mkdir processor

echo.
echo Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install requests beautifulsoup4 pillow argparse

echo.
echo Checking for Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, run this script again to continue setup.
    pause
    exit /b 1
) else (
    echo Node.js found! Checking version...
    node --version
    
    echo.
    echo Installing Node.js dependencies...
    if exist "package.json" (
        npm install
    ) else (
        echo package.json not found. Skipping npm install.
    )
)

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Run the data crawler: python crawler\tokentrove_crawler.py --collections=5 --items=10
echo 2. Run the image scraper: python crawler\pinterest_scraper.py --limit=5
echo 3. Process images: python processor\image_processor.py --input="assets\pinterest-thumbs" --output="assets"
echo 4. Start the application: npm run dev
echo.
pause
