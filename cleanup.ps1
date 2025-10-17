# Safe Project Cleanup Script
# This script removes unnecessary documentation and cache files
# while preserving all essential project files

Write-Host "🧹 Starting Safe Project Cleanup..." -ForegroundColor Cyan
Write-Host ""

# Create backup folder name with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "..\djscene-backup-$timestamp"

# Ask for confirmation
Write-Host "⚠️  This script will delete:" -ForegroundColor Yellow
Write-Host "   - Extra documentation markdown files"
Write-Host "   - Python cache files (__pycache__, *.pyc)"
Write-Host "   - Unused service files"
Write-Host ""
Write-Host "✅ This script will KEEP:" -ForegroundColor Green
Write-Host "   - db.sqlite3 (your database)"
Write-Host "   - All source code"
Write-Host "   - Essential documentation (README, SETUP_GUIDE, etc.)"
Write-Host "   - media/ folder"
Write-Host ""

$confirm = Read-Host "Do you want to create a backup first? (y/n)"
if ($confirm -eq 'y') {
    Write-Host "📦 Creating backup at: $backupPath" -ForegroundColor Cyan
    Copy-Item -Path "." -Destination $backupPath -Recurse -Exclude "node_modules",".venv","__pycache__"
    Write-Host "✅ Backup created successfully!" -ForegroundColor Green
    Write-Host ""
}

$proceed = Read-Host "Proceed with cleanup? (y/n)"
if ($proceed -ne 'y') {
    Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🗑️  Starting cleanup..." -ForegroundColor Cyan
Write-Host ""

# Counter for deleted items
$deletedCount = 0

# 1. Delete extra documentation files
Write-Host "📄 Removing extra documentation files..." -ForegroundColor Yellow
$docsToDelete = @(
    "DELETE_API_FIX.md",
    "ROUTE_FIX.md",
    "COMPLETE_FIX_SUMMARY.md",
    "STORYBOARD_LIST_FIX.md",
    "IMAGE_STORAGE_GUIDE.md",
    "IMAGE_PERSISTENCE_FIX.md",
    "PDF_EXPORT_GUIDE.md",
    "THEME_SYSTEM.md",
    "PROFILE_FEATURE_GUIDE.md",
    "PROFILE_QUICK_START.md",
    "PROFILE_IMPLEMENTATION_SUMMARY.md",
    "REPOSITORY_SETUP_COMPLETE.md",
    "frontend/MODERN_REDESIGN.md",
    "frontend/AI_SETUP_COMPLETE.md",
    "frontend/AI_SETUP_GUIDE.md",
    "frontend/NEW_TOKEN_ACTIVATED.md",
    "frontend/PERSISTENCE_COMPLETE.md"
)

foreach ($file in $docsToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
        $deletedCount++
    }
}

# 2. Clean Python cache
Write-Host ""
Write-Host "🐍 Cleaning Python cache files..." -ForegroundColor Yellow
$pycacheCount = 0

# Remove __pycache__ directories
Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
    Write-Host "   ✓ Deleted: $($_.FullName)" -ForegroundColor Gray
    $pycacheCount++
}

# Remove .pyc files
Get-ChildItem -Path . -Recurse -File -Filter "*.pyc" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "   ✓ Deleted: $($_.FullName)" -ForegroundColor Gray
    $pycacheCount++
}

Write-Host "   Cleaned $pycacheCount Python cache files/folders" -ForegroundColor Gray

# 3. Check for unused service files
Write-Host ""
Write-Host "🔍 Checking for unused service files..." -ForegroundColor Yellow

$unusedServices = @(
    "frontend/src/services/database.js",
    "frontend/src/supabaseClient.js"
)

foreach ($file in $unusedServices) {
    if (Test-Path $file) {
        # Check if file is imported anywhere
        $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
        if ($content) {
            Write-Host "   ⚠️  Found: $file (checking if in use...)" -ForegroundColor Yellow
            
            # Search for imports of this file
            $importFound = $false
            Get-ChildItem -Path "frontend/src" -Recurse -File -Filter "*.jsx" -ErrorAction SilentlyContinue | ForEach-Object {
                $fileContent = Get-Content $_.FullName -Raw
                if ($fileContent -match [regex]::Escape($file.Split('/')[-1].Replace('.js', ''))) {
                    $importFound = $true
                }
            }
            
            if (-not $importFound) {
                $delete = Read-Host "   File appears unused. Delete $file? (y/n)"
                if ($delete -eq 'y') {
                    Remove-Item $file -Force
                    Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
                    $deletedCount++
                }
            } else {
                Write-Host "   ✓ File is in use, keeping it" -ForegroundColor Green
            }
        }
    }
}

# 4. Clean test files
Write-Host ""
Write-Host "🧪 Checking for test/demo files..." -ForegroundColor Yellow

$testFiles = @(
    "test_ai_direct.py",
    "test_api.ps1",
    "test_direct_hf.py",
    "test_hf_token.py",
    "test_image_generation.ps1",
    "test_real_ai.ps1",
    "frontend/test-database.js",
    "frontend/test-tables.html"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "   ⚠️  Found test file: $file" -ForegroundColor Yellow
        $delete = Read-Host "   Delete this test file? (y/n)"
        if ($delete -eq 'y') {
            Remove-Item $file -Force
            Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
            $deletedCount++
        } else {
            Write-Host "   ✓ Keeping: $file" -ForegroundColor Green
        }
    }
}

# 5. Clean old CSS files (if modern versions exist)
Write-Host ""
Write-Host "🎨 Checking for duplicate CSS files..." -ForegroundColor Yellow

$cssCheck = @{
    "frontend/src/components/Landing.css" = "frontend/src/components/Landing.modern.css"
    "frontend/src/components/Header.css" = "frontend/src/components/Header.modern.css"
    "frontend/src/components/Dashboard.css" = "frontend/src/components/Dashboard.modern.css"
}

foreach ($oldCss in $cssCheck.Keys) {
    $modernCss = $cssCheck[$oldCss]
    if ((Test-Path $oldCss) -and (Test-Path $modernCss)) {
        Write-Host "   ⚠️  Found both $oldCss and $modernCss" -ForegroundColor Yellow
        $delete = Read-Host "   Delete old version ($oldCss)? (y/n)"
        if ($delete -eq 'y') {
            Remove-Item $oldCss -Force
            Write-Host "   ✓ Deleted: $oldCss" -ForegroundColor Gray
            $deletedCount++
        }
    }
}

# 6. Summary
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Documentation files: $deletedCount removed"
Write-Host "   - Python cache files: $pycacheCount removed"
Write-Host ""

# Calculate space saved (rough estimate)
$spaceSaved = ($deletedCount * 50) + ($pycacheCount * 10)
Write-Host "💾 Estimated space saved: ~$([math]::Round($spaceSaved/1024, 2)) MB" -ForegroundColor Green
Write-Host ""

# Check essential files
Write-Host "🔍 Verifying essential files..." -ForegroundColor Cyan
$essentialFiles = @(
    "manage.py",
    "db.sqlite3",
    "requirements.txt",
    "frontend/package.json",
    "frontend/src/App.jsx",
    "frontend/src/main.jsx"
)

$allPresent = $true
foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MISSING: $file" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""
if ($allPresent) {
    Write-Host "🎉 All essential files are intact!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some essential files are missing! Restore from backup if needed." -ForegroundColor Red
}

Write-Host ""
Write-Host "📍 Backup location (if created): $backupPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
