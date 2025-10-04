@echo off
echo ======================================
echo Wild Dragons Data Crawler System
echo ======================================
echo.

echo Creating directory structure...
mkdir data\raw data\collections data\resources assets\pinterest-thumbs meta 2>nul

echo.
echo Step 1: Running TokenTrove crawler...
python crawler\tokentrove_crawler.py --collections 5 --items 10 --output data\raw --delay 1.5

echo.
echo Step 2: Running Pinterest scraper...
python crawler\pinterest_scraper.py --output assets\pinterest-thumbs --limit 5 --delay 2.0 --categories fire water earth air cosmic

echo.
echo Step 3: Processing images...
python processor\image_processor.py --input assets\pinterest-thumbs --output assets

echo.
echo Step 4: Transforming data...
python processor\data_transformer.py --input data\raw --output data\collections

echo.
echo Data crawler system execution complete!
echo ======================================
