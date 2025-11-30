# 🚀 Deployment Guide

## Production Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Task Management System"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_API_URL`: Your production API URL
   - Click "Deploy"

3. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain

### Option 2: Netlify

#### Steps:
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repository
   - Set environment variables in Site Settings

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://your-api-url/api
    restart: unless-stopped
```

#### Build and Run
```bash
docker build -t task-management-app .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-api-url/api task-management-app
```

### Option 4: Traditional Server (VPS/Dedicated)

#### Prerequisites
- Node.js 18+ installed
- PM2 for process management

#### Steps:

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Create ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [{
       name: 'task-management',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         NEXT_PUBLIC_API_URL: 'https://your-api-url/api'
       }
     }]
   }
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx** (Optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

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

## Environment Variables for Production

Create a `.env.production` file:

```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

## Pre-Deployment Checklist

- [ ] Update API URL in environment variables
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Verify all API endpoints are accessible
- [ ] Check CORS settings on backend
- [ ] Enable HTTPS/SSL
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Test on multiple devices and browsers
- [ ] Optimize images and assets
- [ ] Enable caching headers

## Performance Optimization

### 1. Enable Next.js Image Optimization
Already configured in `next.config.js`

### 2. Add Caching Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ]
  },
}
```

### 3. Enable Compression
Most hosting platforms enable this by default.

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics, Lighthouse CI
- **Uptime**: UptimeRobot, Pingdom

### Setup Sentry (Example)
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use server-side API routes for sensitive operations
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure properly on backend
5. **Rate Limiting**: Implement on backend
6. **Input Validation**: Already implemented with Zod

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Use Redis for session storage

### Database Optimization
- Add indexes on frequently queried fields
- Use connection pooling
- Consider read replicas for high traffic

### CDN Integration
- Use Vercel Edge Network (automatic on Vercel)
- Or configure Cloudflare CDN
- Cache static assets

## Backup Strategy

1. **Database**: Regular automated backups
2. **Code**: Version control (Git)
3. **Environment**: Document all environment variables
4. **Media**: Backup user-uploaded files (if any)

## Rollback Plan

### Vercel
- Click "Rollback" in deployment history

### PM2
```bash
pm2 list
pm2 stop task-management
# Deploy previous version
pm2 start task-management
```

### Docker
```bash
docker pull your-registry/task-management:previous-tag
docker-compose up -d
```

## Post-Deployment Testing

1. **Smoke Tests**
   - [ ] Can users register?
   - [ ] Can users login?
   - [ ] Can users create tasks?
   - [ ] Can users edit tasks?
   - [ ] Can users delete tasks?
   - [ ] Does drag-and-drop work?

2. **Performance Tests**
   - [ ] Page load time < 3s
   - [ ] Time to Interactive < 5s
   - [ ] Lighthouse score > 90

3. **Security Tests**
   - [ ] HTTPS enabled
   - [ ] Security headers present
   - [ ] No exposed secrets

## Support & Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring Logs
```bash
# PM2
pm2 logs task-management

# Docker
docker logs <container-id>

# Vercel
Check dashboard logs
```

---

**Ready to deploy? Choose your platform and follow the steps above!** 🚀
