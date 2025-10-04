@echo off
echo ======================================
echo Wild Dragons Mock Data Generator
echo ======================================
echo.

echo Generating mock NFT data...
python crawler\mock_data_generator.py

echo.
echo Creating placeholder images...
python create-placeholder-images.py

echo.
echo Mock data generation complete!
echo You can now start the application with: npm run dev
echo.
pause
