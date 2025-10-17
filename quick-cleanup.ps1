# Quick Cleanup - Remove Only Safe Files
# No prompts, just removes obviously unnecessary files

Write-Host "🧹 Quick Cleanup Starting..." -ForegroundColor Cyan

$deletedCount = 0

# 1. Remove extra documentation
Write-Host "📄 Removing extra documentation..." -ForegroundColor Yellow

$docs = @(
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
    "REPOSITORY_SETUP_COMPLETE.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Remove-Item $doc -Force
        Write-Host "   ✓ $doc" -ForegroundColor Gray
        $deletedCount++
    }
}

# 2. Clean Python cache
Write-Host "🐍 Cleaning Python cache..." -ForegroundColor Yellow
$cacheCount = 0

Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
    $cacheCount++
}

Get-ChildItem -Path . -Recurse -File -Filter "*.pyc" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    $cacheCount++
}

Write-Host "   ✓ Removed $cacheCount cache files" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "   Removed: $deletedCount documentation files" -ForegroundColor Gray
Write-Host "   Removed: $cacheCount Python cache files" -ForegroundColor Gray
Write-Host ""
