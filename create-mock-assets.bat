@echo off
echo ======================================
echo Wild Dragons Mock Asset Generator
echo ======================================
echo.

echo Checking for Python installation...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo.
    echo Please run setup-windows.bat first to set up the environment.
    pause
    exit /b 1
)

echo Creating directory structure...
if not exist "data\collections" mkdir data\collections
if not exist "assets" mkdir assets
if not exist "assets\dragons" mkdir assets\dragons
if not exist "assets\cosmic" mkdir assets\cosmic
if not exist "assets\elemental" mkdir assets\elemental
if not exist "assets\fantasy" mkdir assets\fantasy
if not exist "assets\mythical" mkdir assets\mythical
if not exist "meta" mkdir meta

echo.
echo Generating mock NFT data...
python crawler\mock_data_generator.py

echo.
echo Creating placeholder images...
echo This will create colored boxes as placeholders for NFT images.
echo.

REM You'll need to install Pillow first
python -c "from PIL import Image, ImageDraw; import os; collections=['dragons','cosmic','elemental','fantasy','mythical']; colors=[(255,0,0),(0,0,255),(0,255,0),(255,0,255),(255,255,0)]; sizes=[('thumb',256),('preview',512),('full',800)]; [[[Image.new('RGB', (size[1],size[1]), colors[cid]).save(f'assets/{cname}/{cname}_{i}_{size[0]}.png') for size in sizes] for i in range(1,11)] for cid, cname in enumerate(collections)]" 2>nul

if %errorlevel% neq 0 (
    echo Failed to generate placeholder images.
    echo Please make sure Pillow is installed: python -m pip install pillow
) else (
    echo Successfully created placeholder images.
)

echo.
echo Mock data and assets generation complete!
echo You can now start the application with: npm run dev
echo.
pause
