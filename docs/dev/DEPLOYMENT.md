# Wild Dragons - Deployment Instructions

## Quick Deploy Options

### 1. Vercel (Recommended)
1. Push code to GitHub repository
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automatically on push to main branch

### 2. Netlify
1. Build project: `npm run build`
2. Drag and drop `dist` folder to Netlify
3. Or connect GitHub repo for automatic deployments

### 3. Traditional Hosting (Hostinger, cPanel, etc.)
1. Build project: `npm run build`
2. Upload contents of `dist` folder to your web hosting
3. Ensure your hosting supports SPA routing (add `.htaccess` if needed)

## Environment Variables

Required for production:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## SPA Routing Setup

For hosting providers that need manual SPA configuration, create `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Build Configuration

The project builds to `dist/` directory with:
- Optimized assets
- Code splitting
- CSS purging
- Environment variable injection

## Performance Checklist

- ✅ Asset optimization
- ✅ Code splitting
- ✅ CSS purging
- ✅ Environment variables
- ✅ Error boundaries
- ✅ Loading states

## Post-Deployment

1. Test authentication flow
2. Verify database connectivity
3. Check game mechanics
4. Monitor error logs
5. Set up analytics (optional)
