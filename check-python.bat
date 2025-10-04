@echo off
echo Checking Python installation options...
echo.

echo Testing 'python' command...
python --version 2>nul
if %errorlevel% equ 0 (
    echo Python is installed and accessible via 'python' command.
    echo To install dependencies, use: python -m pip install requests beautifulsoup4 pillow argparse
    goto :end
)

echo Testing 'py' command...
py --version 2>nul
if %errorlevel% equ 0 (
    echo Python is installed and accessible via 'py' command.
    echo To install dependencies, use: py -m pip install requests beautifulsoup4 pillow argparse
    goto :end
)

echo Testing 'python3' command...
python3 --version 2>nul
if %errorlevel% equ 0 (
    echo Python is installed and accessible via 'python3' command.
    echo To install dependencies, use: python3 -m pip install requests beautifulsoup4 pillow argparse
    goto :end
)

echo.
echo No Python installation was detected.
echo.
echo Please install Python from https://www.python.org/downloads/
echo Make sure to check "Add Python to PATH" during installation.
echo.

:end
pause
