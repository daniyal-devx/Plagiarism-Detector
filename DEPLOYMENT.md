# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Deploying to Other Platforms

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t plagiarism-detector .
   docker run -p 3000:3000 plagiarism-detector
   ```

### AWS (EC2)

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   ```

4. **Clone and build**
   ```bash
   git clone <your-repo-url>
   cd plagiarism-detector
   npm install
   npm run build
   ```

5. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "plagiarism-detector" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Configuration

### Required Environment Variables
None required for basic deployment.

### Optional Environment Variables
```env
# Add these to .env.local for local development
NODE_ENV=production

# Add custom configurations if needed
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Build Optimization

### Analyze Bundle Size
```bash
npm install -g @next/bundle-analyzer
```

Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

Run:
```bash
ANALYZE=true npm run build
```

### Performance Tips

1. **Enable compression**
   - Vercel enables this automatically
   - For custom servers, use compression middleware

2. **Optimize images**
   - Use Next.js Image component
   - Enable image optimization in next.config.js

3. **Enable caching**
   - Set appropriate cache headers
   - Use CDN for static assets

## Monitoring

### Vercel Analytics
Enable in Vercel dashboard for free metrics:
- Page views
- Performance metrics
- Error tracking

### Custom Monitoring
Add monitoring tools:
```bash
npm install @vercel/analytics
```

In `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Build Errors

**Error**: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: "Out of memory"
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Runtime Errors

**API routes not working**
- Ensure routes are in `src/app/api/` directory
- Check route.ts naming convention
- Verify HTTP methods

**Static generation issues**
- Check dynamic routes
- Verify data fetching methods
- Review build logs

## Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify API endpoints work
- [ ] Check mobile responsiveness
- [ ] Test file uploads
- [ ] Verify URL fetching
- [ ] Test analysis with sample documents
- [ ] Check performance metrics
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS

## Scaling Considerations

For production use with many users:

1. **Database Integration**
   - Store analysis results
   - User authentication
   - Document history

2. **Caching**
   - Redis for fingerprint cache
   - CDN for static assets

3. **Load Balancing**
   - Multiple server instances
   - Queue system for heavy processing

4. **Rate Limiting**
   - Prevent API abuse
   - Limit file upload sizes

## Security

1. **Input Validation**
   - Validate file types
   - Limit file sizes
   - Sanitize URLs

2. **CORS Configuration**
   - Restrict origins in production
   - Use HTTPS only

3. **Content Security Policy**
   Add to next.config.js:
   ```javascript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
         ],
       },
     ];
   }
   ```

## Support

For issues or questions:
- Check GitHub Issues
- Review documentation
- Contact project maintainer

---

**Congratulations!** 🎉 Your plagiarism detector is now deployed and ready to use!
