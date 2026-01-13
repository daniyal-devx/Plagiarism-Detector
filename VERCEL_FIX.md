# Vercel Deployment Fix

## 🔴 Error: "Couldn't find any `pages` or `app` directory"

This error occurs because Vercel is looking in the wrong location.

---

## ✅ Solution (Choose One):

### **Method 1: Fix Root Directory Setting** (RECOMMENDED)

When deploying to Vercel:

1. **During Import:**
   - Click "Edit" next to Root Directory
   - Change from `./` to `./plagiarism-detector`
   - Click "Continue"

2. **For Existing Project:**
   - Go to Project Settings
   - General → Root Directory
   - Change to: `plagiarism-detector`
   - Save and Redeploy

### **Method 2: Restructure for Vercel**

If you uploaded the folder directly, make sure your GitHub repo structure is:

```
your-repo/
├── plagiarism-detector/    ← Your project is here
│   ├── src/
│   ├── package.json
│   └── next.config.js
```

**Fix:** Set Root Directory to `plagiarism-detector` in Vercel

**OR** if your structure is:

```
your-repo/
├── src/                    ← Files at root level
├── package.json
└── next.config.js
```

**Fix:** Set Root Directory to `./` (default)

---

## 📋 Step-by-Step Fix:

### For Current Deployment (Already Started):

1. **Go to Vercel Dashboard**
2. Click on your project
3. Go to **Settings**
4. Scroll to **General**
5. Find **Root Directory**
6. Click **Edit**
7. Enter: `plagiarism-detector`
8. Click **Save**
9. Go to **Deployments**
10. Click **Redeploy** (three dots menu)

### For New Deployment:

**Option A: Import Correctly**
```bash
# Make sure your GitHub structure is:
repo-root/
└── plagiarism-detector/
    └── [all project files]

# In Vercel:
Root Directory: plagiarism-detector
```

**Option B: Flatten Structure**
```bash
# Move all files from plagiarism-detector/ to root:
cd your-repo
mv plagiarism-detector/* .
mv plagiarism-detector/.* . 2>/dev/null
rmdir plagiarism-detector

# Then commit:
git add .
git commit -m "Flatten structure for Vercel"
git push

# In Vercel:
Root Directory: ./ (default)
```

---

## 🎯 Correct Vercel Settings:

### If Using Subfolder (`plagiarism-detector/`):
```
Framework Preset: Next.js
Root Directory: plagiarism-detector
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x or 20.x
```

### If Files at Root:
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x or 20.x
```

---

## 🔍 Verify Your Structure:

Check where your `package.json` is located:

**Scenario 1:** (Need to set Root Directory)
```
repo/
└── plagiarism-detector/
    ├── package.json  ← HERE
    ├── src/
    └── next.config.js
```
**Vercel Setting:** Root Directory = `plagiarism-detector`

**Scenario 2:** (Default works)
```
repo/
├── package.json  ← HERE
├── src/
└── next.config.js
```
**Vercel Setting:** Root Directory = `./` (default)

---

## 🚀 Quick Fix Commands:

### Check Your Current Structure:
```bash
cd your-repo
ls -la
# Look for package.json location
```

### If You Need to Flatten:
```bash
# Move files to root
mv plagiarism-detector/* .
git add .
git commit -m "Restructure for Vercel"
git push
```

### If You Need to Keep Subfolder:
Just set Root Directory to `plagiarism-detector` in Vercel settings.

---

## ✅ After Fixing:

1. ✓ Root Directory is set correctly
2. ✓ Click "Redeploy" or "Deploy"
3. ✓ Wait 2-3 minutes
4. ✓ Check build logs
5. ✓ Visit your deployed URL

---

## 🆘 Still Not Working?

### Check Build Logs For:
- ✓ "Found Next.js" message
- ✓ "Building..." progress
- ✗ No "Couldn't find" errors

### Common Issues:

**Issue:** Still can't find `app` directory
**Fix:** Verify `src/app` folder exists with `page.tsx`

**Issue:** Module not found
**Fix:** Run locally first: `npm install && npm run build`

**Issue:** TypeScript errors
**Fix:** Check `tsconfig.json` exists at correct level

---

## 📞 Need More Help?

1. Share your GitHub repo structure
2. Show the exact error from Vercel logs
3. Confirm where `package.json` is located

---

## 🎉 Success Checklist:

After successful deployment, you should see:
- ✅ Build completed
- ✅ Live URL generated
- ✅ App loads in browser
- ✅ Can upload files and analyze

Your app will be live at: `https://your-project.vercel.app`
