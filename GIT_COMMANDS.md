# 🚀 COPY-PASTE THESE COMMANDS

## Step 1: Navigate to this folder
```bash
cd plagiarism-detector-final
```

## Step 2: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit - Plagiarism Detector"
```

## Step 3: Connect to GitHub

### Option A: Create New Repo on GitHub
1. Go to https://github.com/new
2. Repository name: `Plagiarism-Detector` (or any name)
3. Make it **Public**
4. **DO NOT** add README, .gitignore, or license
5. Click "Create repository"

### Option B: Use Existing Repo
Make sure it's empty or delete all files first

## Step 4: Push to GitHub
```bash
# Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub details
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Example:
```bash
git remote add origin https://github.com/daniyal-devx/Plagiarism-Detector.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import" next to your GitHub repo
4. Vercel auto-detects everything ✅
5. Click "Deploy"
6. Wait 2-3 minutes
7. Done! 🎉

---

## ✅ Verify GitHub Upload Success

After pushing, visit your GitHub repo. You should see:

```
📁 src/
📁 public/
📄 package.json
📄 next.config.js
📄 README.md
... (and other files)
```

If you see folders (📁), not just files, you're good! ✅

---

## 🆘 Troubleshooting

### "Permission denied" error:
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### "Repository not found":
- Check the URL is correct
- Make sure the repo exists on GitHub
- Verify you're logged into the right GitHub account

### "Already exists" error:
```bash
git remote remove origin
git remote add origin YOUR_NEW_URL
```

---

## 📱 Quick Test Commands

### Test locally before deploying:
```bash
npm install
npm run dev
```
Then visit: http://localhost:3000

### Build for production:
```bash
npm run build
npm start
```

---

## 🎯 Expected Timeline

- Git setup: 30 seconds
- Push to GitHub: 1 minute
- Vercel deployment: 2-3 minutes
- **Total: ~5 minutes** ⚡

---

## 🏆 Success!

Your app will be live at:
```
https://your-project-name.vercel.app
```

Vercel will show you this URL after deployment completes.

---

**That's it! Just follow these steps and you're done!** 🚀
