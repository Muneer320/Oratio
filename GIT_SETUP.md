# 🚀 Git Setup & Push Guide

This guide will help you initialize Git and push Oratio to GitHub.

---

## 📋 Prerequisites

- Git installed on your system
- GitHub account created
- GitHub repository created (or ready to create)

---

## 🔧 Step 1: Initialize Git Repository

Open PowerShell in the project root directory:

```powershell
# Navigate to project root
cd c:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\Hackaton\Oratio

# Initialize Git repository
git init

# Check status
git status
```

---

## 📝 Step 2: Stage All Files

```powershell
# Add all files to staging
git add .

# Verify staged files
git status
```

You should see all project files staged for commit.

---

## 💾 Step 3: Create Initial Commit

```powershell
# Create initial commit
git commit -m "Initial commit: Oratio - AI-Powered Debate Platform

- Backend foundation with FastAPI
- Replit Database, AI, and Auth integration
- Frontend structure with React + Vite
- TailwindCSS configuration
- Comprehensive documentation
- Ready for Replit Vibeathon"
```

---

## 🌐 Step 4: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name**: `oratio`
   - **Description**: "AI-Powered Debate Platform for Replit Vibeathon"
   - **Visibility**: Public (recommended for hackathon)
   - **DO NOT** initialize with README (we already have one)
3. Click "Create repository"

### Option B: Via GitHub CLI (if installed)

```powershell
gh repo create oratio --public --source=. --description "AI-Powered Debate Platform for Replit Vibeathon"
```

---

## 🔗 Step 5: Connect to GitHub

Copy the remote URL from GitHub (should look like: `https://github.com/USERNAME/oratio.git`)

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/oratio.git

# Verify remote
git remote -v
```

---

## 🚀 Step 6: Push to GitHub

```powershell
# Rename default branch to 'main' (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ✅ Step 7: Verify on GitHub

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/oratio`
2. Verify all files are present
3. Check that README.md displays correctly
4. Verify .gitignore is working (no `node_modules/`, `.venv/`, etc.)

---

## 📌 Step 8: Add Repository Topics (Optional)

On GitHub repository page:

1. Click ⚙️ **Settings**
2. Under "Topics", add:
   - `replit`
   - `vibeathon`
   - `ai`
   - `debate`
   - `fastapi`
   - `react`
   - `hackathon`
   - `python`
   - `javascript`

This helps with discoverability!

---

## 🏷️ Step 9: Create Initial Release (Optional)

```powershell
# Create tag for v1.0.0-replit
git tag -a v1.0.0-replit -m "Initial release for Replit Vibeathon

- Replit-optimized architecture
- Backend foundation complete
- Frontend structure ready
- Comprehensive documentation"

# Push tag to GitHub
git push origin v1.0.0-replit
```

Then on GitHub:

1. Go to "Releases"
2. Click "Draft a new release"
3. Select tag `v1.0.0-replit`
4. Fill in release notes (copy from CHANGELOG.md)
5. Publish release

---

## 🔄 Future Workflow

### Making Changes

```powershell
# 1. Make your code changes

# 2. Check what changed
git status
git diff

# 3. Stage changes
git add .
# Or stage specific files:
git add backend/app/routers/auth.py

# 4. Commit with descriptive message
git commit -m "feat: implement authentication router"

# 5. Push to GitHub
git push
```

### Working with Branches

```powershell
# Create feature branch
git checkout -b feature/ai-judging

# Work on feature...

# Commit changes
git add .
git commit -m "feat: implement AI judging endpoint"

# Push branch to GitHub
git push -u origin feature/ai-judging

# Create Pull Request on GitHub
# After merge, switch back to main
git checkout main
git pull
```

---

## 🛠️ Common Commands

### Viewing History

```powershell
# View commit history
git log

# View compact log
git log --oneline --graph

# View changes in last commit
git show
```

### Undoing Changes

```powershell
# Discard local changes (before staging)
git checkout -- filename

# Unstage files (keep changes)
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard last commit entirely (DANGER!)
git reset --hard HEAD~1
```

### Syncing with Remote

```powershell
# Fetch changes without merging
git fetch origin

# Pull latest changes
git pull

# Push local commits
git push
```

---

## 🔍 Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution**: Set up SSH key or use HTTPS with personal access token

```powershell
# Use HTTPS instead
git remote set-url origin https://github.com/USERNAME/oratio.git
```

### Issue: "Updates were rejected because the tip of your current branch is behind"

**Solution**: Pull latest changes first

```powershell
git pull --rebase origin main
git push
```

### Issue: Accidentally committed sensitive data

**Solution**: Remove from history (URGENT!)

```powershell
# Remove file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (use with caution!)
git push origin --force --all
```

**Better**: Use `.gitignore` to prevent this!

---

## 📦 What Gets Pushed?

### ✅ Included (pushed to GitHub)

- All source code (`backend/`, `frontend/`)
- Documentation (`README.md`, `CONTRIBUTING.md`, etc.)
- Configuration files (`.replit`, `.env.example`, etc.)
- License and legal files

### ❌ Excluded (via .gitignore)

- Dependencies (`node_modules/`, `.venv/`)
- Environment variables (`.env`)
- Database files (`*.db`, `.replit_db/`)
- Build artifacts (`dist/`, `build/`)
- IDE settings (`.vscode/`, `.idea/`)
- Logs and temporary files

---

## 🎯 Pre-Push Checklist

Before pushing to GitHub, verify:

- [ ] No sensitive data in commit (API keys, passwords)
- [ ] `.env` file is **NOT** committed (check .gitignore)
- [ ] `node_modules/` and `.venv/` are **NOT** committed
- [ ] README.md is up-to-date
- [ ] CHANGELOG.md reflects current version
- [ ] All documentation files are accurate
- [ ] License file is present
- [ ] Commit message is descriptive

---

## 🌟 GitHub Repository Best Practices

### Repository Settings

1. **Enable Issues** - For bug tracking and feature requests
2. **Enable Discussions** - For community engagement
3. **Add Description** - Clear one-liner about the project
4. **Add Topics** - For better discoverability
5. **Add README** - Already done! ✅

### Protection Rules (Optional)

For collaborative projects:

- Require pull request reviews
- Require status checks to pass
- Enforce linear history

### GitHub Actions (Future)

Set up CI/CD:

- Automated testing on PR
- Code quality checks
- Auto-deployment to Replit

---

## 📞 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Common Issues**: https://stackoverflow.com/questions/tagged/git

---

## 🎉 You're Ready!

Your Oratio project is now:

- ✅ Version controlled with Git
- ✅ Backed up on GitHub
- ✅ Ready for collaboration
- ✅ Ready for Replit Vibeathon submission

**Next Steps**:

1. Share repository link with judges/reviewers
2. Deploy to Replit from GitHub
3. Continue development
4. Submit to Vibeathon!

---

**Good luck with Replit Vibeathon! 🚀**
