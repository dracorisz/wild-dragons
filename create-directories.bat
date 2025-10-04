@echo off
echo Creating directory structure for Wild Dragons...

if not exist "data" mkdir data
if not exist "data\raw" mkdir data\raw
if not exist "data\collections" mkdir data\collections
if not exist "data\resources" mkdir data\resources
if not exist "assets" mkdir assets
if not exist "assets\pinterest-thumbs" mkdir assets\pinterest-thumbs
if not exist "meta" mkdir meta
if not exist "crawler" mkdir crawler
if not exist "processor" mkdir processor

echo Directory structure created successfully!
echo.
echo The following directories have been created:
echo - data\raw
echo - data\collections
echo - data\resources
echo - assets\pinterest-thumbs
echo - meta
echo - crawler
echo - processor
