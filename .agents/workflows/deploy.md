---
description: How to commit, merge, and auto-deploy to Vercel
---

# Deploy to Vercel

Vercel is connected to the GitHub repo `vivekarya2026/Capstone-MPD-Team-Green` on the `main` branch.
Any push to `main` on GitHub will **automatically trigger a production deployment** on Vercel.

## Standard Workflow

### 1. Create a feature branch for your work
```bash
git checkout -b feature/your-feature-name
```

### 2. Make your changes and commit
```bash
git add -A
git commit -m "feat: description of your changes"
```

### 3. Switch to main and merge
```bash
git checkout main
git merge feature/your-feature-name --no-ff -m "Merge feature/your-feature-name into main"
```

// turbo
### 4. Push to GitHub (this triggers Vercel auto-deploy)
```bash
git push origin main
```

### 5. Verify deployment
- Go to https://vercel.com/dashboard and check the deployment status
- Or visit your Vercel URL to see the live changes (takes ~1-2 minutes to build)

## Quick Deploy (if already on main)

// turbo
### 1. Stage and commit all changes
```bash
git add -A && git commit -m "update: description"
```

// turbo
### 2. Push to trigger deploy
```bash
git push origin main
```

## Important Notes
- **Vercel URL**: Check your Vercel dashboard for the production URL
- **Build time**: Deployments typically take 1-2 minutes
- **Branch previews**: Vercel also creates preview deployments for pull requests
- **Remote URL**: `https://github.com/vivekarya2026/Capstone-MPD-Team-Green.git`
