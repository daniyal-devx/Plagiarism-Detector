# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- A code editor (VS Code recommended)
- Terminal/Command Prompt

### Installation

1. **Navigate to project directory**
   ```bash
   cd plagiarism-detector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will take 1-2 minutes.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Visit: http://localhost:3000
   - App should load automatically

### First Analysis

1. **Create test files**
   
   Create `test1.txt`:
   ```
   Discrete mathematics is the study of mathematical structures that are fundamentally discrete rather than continuous. It deals with objects that can assume only distinct, separated values.
   ```

   Create `test2.txt`:
   ```
   Discrete mathematics studies mathematical structures that are discrete rather than continuous. It involves objects that can only have distinct, separate values.
   ```

2. **Upload files**
   - Click "Select Files" or drag & drop
   - Upload both test files

3. **Configure settings** (optional)
   - K-Gram Size: 5 (default is fine)
   - Threshold: 50% (default)

4. **Analyze**
   - Click "Analyze Documents"
   - Wait 1-2 seconds
   - View results!

### Understanding Results

The test files above should show:
- **~70-80% similarity** (high)
- Flagged as **plagiarized** (above 50% threshold)
- Multiple similarity metrics displayed

### What to Try Next

1. **Adjust threshold**
   - Lower it to 40% → more pairs flagged
   - Raise it to 60% → fewer pairs flagged

2. **Change k-gram size**
   - Smaller (k=3) → detect shorter matches
   - Larger (k=8) → detect longer sequences

3. **Try winnowing**
   - Enable "Use Winnowing Algorithm"
   - More robust to minor changes

4. **Add more documents**
   - Upload 3-4 documents
   - See pairwise comparisons

5. **Test with URLs**
   - Add any article URL
   - Compare web content

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Build errors:**
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Project Structure

```
plagiarism-detector/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/             # Core algorithms
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json         # Dependencies
```

### Key Files

- `src/lib/algorithms/plagiarism-detector.ts` - Main algorithm
- `src/app/page.tsx` - Main UI
- `src/app/api/analyze/route.ts` - Analysis endpoint

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or push to GitHub and import in Vercel dashboard.

### Need Help?

- Read `README.md` for detailed docs
- Check `MATHEMATICS.md` for algorithm details
- Review `DEPLOYMENT.md` for hosting guide

### Next Steps

1. ✅ Test with sample documents
2. ✅ Experiment with settings
3. ✅ Try different file types
4. ✅ Deploy to production
5. ✅ Add custom features

---

**You're all set!** 🎉 Start detecting plagiarism with discrete mathematics!
