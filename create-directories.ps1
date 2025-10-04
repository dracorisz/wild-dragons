Write-Host "Creating directory structure for Wild Dragons..." -ForegroundColor Green

# Create directories with PowerShell
$directories = @(
    "data\raw",
    "data\collections", 
    "data\resources",
    "assets\pinterest-thumbs",
    "meta",
    "crawler",
    "processor"
)

foreach ($dir in $directories) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Cyan
    } else {
        Write-Host "Already exists: $dir" -ForegroundColor Yellow
    }
}

Write-Host "`nDirectory structure created successfully!" -ForegroundColor Green
