Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Wild Dragons NFT Marketplace - Complete Build Script" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python installation
Write-Host "Step 1: Checking Python installation..." -ForegroundColor Green
try {
    $pythonVersion = python --version
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Yellow
    Exit 1
}

# Step 2: Create directory structure
Write-Host ""
Write-Host "Step 2: Creating directory structure..." -ForegroundColor Green
$directories = @(
    "data\raw",
    "data\collections",
    "data\resources",
    "assets\pinterest-thumbs",
    "meta",
    "crawler",
    "processor",
    "src",
    "src\components",
    "src\views",
    "src\router",
    "src\stores"
)

foreach ($dir in $directories) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Cyan
    } else {
        Write-Host "Already exists: $dir" -ForegroundColor Yellow
    }
}

# Step 3: Install Python dependencies
Write-Host ""
Write-Host "Step 3: Installing Python dependencies..." -ForegroundColor Green
python -m pip install --upgrade pip
python -m pip install requests beautifulsoup4 pillow argparse

# Step 4: Generate mock data
Write-Host ""
Write-Host "Step 4: Generating mock data..." -ForegroundColor Green
if (Test-Path -Path "crawler\mock_data_generator.py") {
    python crawler\mock_data_generator.py
} else {
    Write-Host "Mock data generator not found. Running create-mock-assets.bat instead..." -ForegroundColor Yellow
    cmd.exe /c create-mock-assets.bat
}

# Step 5: Create placeholder images
Write-Host ""
Write-Host "Step 5: Creating placeholder images..." -ForegroundColor Green
python create-placeholder-images.py

# Step 6: Install Node.js dependencies
Write-Host ""
Write-Host "Step 6: Installing Node.js dependencies..." -ForegroundColor Green
if (-not (Test-Path -Path "node_modules")) {
    npm install
} else {
    Write-Host "Node modules already installed. Use 'npm install' to update dependencies." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Wild Dragons NFT Marketplace build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "To view the application, navigate to:" -ForegroundColor White
Write-Host "  http://localhost:5173/" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan
