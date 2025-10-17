# Quick Push to Zetpeak Repository
# Direct push without prompts (make sure you've committed changes first)

$repoUrl = "https://github.com/suhassgirijesh/Zetpeak-batch-3.git"
$branch = "mukundan"
$remoteName = "zetpeak"

Write-Host "🚀 Quick Push to Zetpeak..." -ForegroundColor Cyan
Write-Host ""

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git..." -ForegroundColor Yellow
    git init
}

# Add remote
Write-Host "Setting up remote..." -ForegroundColor Yellow
git remote remove $remoteName 2>$null
git remote add $remoteName $repoUrl

# Stage all changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing..." -ForegroundColor Yellow
$commitMsg = "Update CiniKraft project - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m "$commitMsg" 2>$null

# Get current branch
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
}

Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
Write-Host "Pushing to remote branch: $branch" -ForegroundColor Cyan
Write-Host ""

# Push
Write-Host "Pushing to $repoUrl..." -ForegroundColor Cyan
git push $remoteName ${currentBranch}:$branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push successful!" -ForegroundColor Green
    Write-Host "View at: https://github.com/suhassgirijesh/Zetpeak-batch-3/tree/$branch" -ForegroundColor Blue
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Trying with force..." -ForegroundColor Yellow
    git push $remoteName ${currentBranch}:$branch --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Force push successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed. You may need to authenticate." -ForegroundColor Red
        Write-Host "Run 'git push $remoteName ${currentBranch}:$branch' manually" -ForegroundColor Yellow
    }
}

Write-Host ""
