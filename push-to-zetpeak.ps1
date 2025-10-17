# Push to Zetpeak Repository - Mukundan Branch
# This script will push your project to the specified repository

Write-Host "🚀 Preparing to push to Zetpeak repository..." -ForegroundColor Cyan
Write-Host ""

# Repository details
$repoUrl = "https://github.com/suhassgirijesh/Zetpeak-batch-3.git"
$branch = "mukundan"
$remoteName = "zetpeak"

Write-Host "📋 Repository Information:" -ForegroundColor Yellow
Write-Host "   Repository: $repoUrl" -ForegroundColor Gray
Write-Host "   Branch: $branch" -ForegroundColor Gray
Write-Host "   Remote name: $remoteName" -ForegroundColor Gray
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git repository not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
    Write-Host ""
}

# Check current git status
Write-Host "📊 Checking current git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Check if remote already exists
$existingRemote = git remote get-url $remoteName 2>$null

if ($existingRemote) {
    Write-Host "⚠️  Remote '$remoteName' already exists: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Do you want to update it to $repoUrl? (y/n)"
    if ($updateRemote -eq 'y') {
        git remote set-url $remoteName $repoUrl
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    Write-Host "➕ Adding remote '$remoteName'..." -ForegroundColor Yellow
    git remote add $remoteName $repoUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
}

Write-Host ""

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    $commitChanges = Read-Host "Do you want to commit all changes? (y/n)"
    if ($commitChanges -eq 'y') {
        Write-Host ""
        $commitMessage = Read-Host "Enter commit message"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Update project - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        
        Write-Host ""
        Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
        git add .
        
        Write-Host "💾 Committing changes..." -ForegroundColor Yellow
        git commit -m "$commitMessage"
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Working directory is clean" -ForegroundColor Green
}

Write-Host ""

# Check current branch
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
Write-Host "🌿 Current branch: $currentBranch" -ForegroundColor Cyan

if ($currentBranch -ne $branch) {
    Write-Host "⚠️  You're on branch '$currentBranch', but need to push to '$branch'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "   1. Create/switch to '$branch' branch locally and push" -ForegroundColor Gray
    Write-Host "   2. Push current branch '$currentBranch' to remote '$branch'" -ForegroundColor Gray
    Write-Host ""
    
    $option = Read-Host "Choose option (1/2)"
    
    if ($option -eq '1') {
        # Check if branch exists locally
        $branchExists = git rev-parse --verify $branch 2>$null
        if ($branchExists) {
            Write-Host "🔄 Switching to existing branch '$branch'..." -ForegroundColor Yellow
            git checkout $branch
        } else {
            Write-Host "🆕 Creating and switching to new branch '$branch'..." -ForegroundColor Yellow
            git checkout -b $branch
        }
        Write-Host "✅ On branch '$branch'" -ForegroundColor Green
    }
}

Write-Host ""

# Fetch to see remote branch status
Write-Host "🔍 Checking remote branch status..." -ForegroundColor Yellow
git fetch $remoteName $branch 2>$null

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "⚠️  READY TO PUSH" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will push to:" -ForegroundColor Yellow
Write-Host "   Repository: $repoUrl" -ForegroundColor White
Write-Host "   Branch: $branch" -ForegroundColor White
Write-Host ""

$finalConfirm = Read-Host "Proceed with push? (y/n)"

if ($finalConfirm -eq 'y') {
    Write-Host ""
    Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Cyan
    Write-Host ""
    
    # Try to push
    git push $remoteName ${currentBranch}:$branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "✅ SUCCESS! Project pushed successfully!" -ForegroundColor Green
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Your code is now at:" -ForegroundColor Cyan
        Write-Host "   $repoUrl" -ForegroundColor White
        Write-Host "   Branch: $branch" -ForegroundColor White
        Write-Host ""
        Write-Host "🌐 View online:" -ForegroundColor Cyan
        Write-Host "   https://github.com/suhassgirijesh/Zetpeak-batch-3/tree/$branch" -ForegroundColor Blue
    } else {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "   1. Authentication failed - You may need to:" -ForegroundColor Gray
        Write-Host "      - Set up a Personal Access Token" -ForegroundColor Gray
        Write-Host "      - Configure Git credentials" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   2. Branch conflicts - Try:" -ForegroundColor Gray
        Write-Host "      git pull $remoteName $branch --rebase" -ForegroundColor Gray
        Write-Host "      then push again" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   3. Permission denied - Check repository access" -ForegroundColor Gray
        Write-Host ""
        
        $forcePush = Read-Host "Do you want to try force push? (use with caution) (y/n)"
        if ($forcePush -eq 'y') {
            Write-Host ""
            Write-Host "⚠️  Force pushing..." -ForegroundColor Yellow
            git push $remoteName ${currentBranch}:$branch --force
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Force push successful!" -ForegroundColor Green
            }
        }
    }
} else {
    Write-Host ""
    Write-Host "❌ Push cancelled" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
