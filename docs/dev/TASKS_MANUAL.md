# 📋 Manual Tasks for Wild Dragons Project

## 🔧 Immediate Setup Tasks (Required for Live Project)

### 1. Supabase Database Setup
- [x] Create account at [supabase.com](https://supabase.com)
- [x] Create new project
- [x] Run SQL from `database/schema.sql` in Supabase SQL Editor
- [x] Copy project URL and anon key to `.env` file
- [ ] Test database connection from application

### 2. Environment Configuration
- [x] Copy `.env.example` to `.env`
- [x] Add your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

### 3. Repository & Version Control
- [x] Create GitHub repository
- [x] Push code to GitHub: `git init`, `git add .`, `git commit -m "Initial commit"`, `git push`
- [ ] Set up branch protection rules on main branch
- [ ] Add GitHub secrets for CI/CD (if using automated deployment)

## 🚀 Deployment Tasks

### 4. Choose Hosting Platform
**Option A: Vercel (Recommended)**
- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy automatically

**Option B: Netlify**
- [ ] Build project locally: `npm run build`
- [ ] Upload `dist` folder to Netlify
- [ ] Configure environment variables

**Option C: Traditional Hosting**
- [ ] Build project: `npm run build`
- [ ] Upload `dist` contents via FTP/cPanel
- [ ] Add `.htaccess` for SPA routing (see `docs/DEPLOYMENT.md`)

### 5. Domain & SSL
- [ ] Purchase domain name (optional)
- [ ] Configure DNS settings
- [ ] Set up SSL certificate (usually automatic with modern hosting)

## 🎮 Game Configuration

### 7. Game Content
- [ ] Review enemy configurations in `src/data/themes.json`
- [ ] Adjust XP/points scaling if needed
- [ ] Add placeholder dragon images to `src/assets/`
- [ ] Test battle system thoroughly

## 🔐 Security & Monitoring

### 8. Supabase Security
- [ ] Review Row Level Security (RLS) policies
- [ ] Set up rate limiting
- [ ] Configure email templates for auth
- [ ] Enable proper CORS settings

### 9. Monitoring Setup (Optional)
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Monitor database performance
- [ ] Set up uptime monitoring

## 📱 Web3 Integration (Future)

### 10. Wallet Integration
- [ ] Test MetaMask connection
- [ ] Set up WalletConnect project ID (if needed)
- [ ] Configure Web3 provider settings

### 11. Smart Contracts (TGE Phase)
- [ ] Develop ERC-20 token contract
- [ ] Develop NFT contract for dragons/items
- [ ] Security audit (mandatory before mainnet)
- [ ] Legal review for token compliance

## 🎨 Art & Branding

### 12. Visual Assets
- [ ] Create or commission dragon artwork
- [ ] Design game UI sprites and icons
- [ ] Create social media banners (1200x628)
- [ ] Make gameplay demo GIF/video

### 13. Branding
- [ ] Finalize logo design
- [ ] Create brand guidelines
- [ ] Design marketing materials
- [ ] Update meta tags and favicon

## 📈 Marketing & Community

### 14. Social Presence
- [ ] Create Twitter/X account
- [ ] Set up Discord server
- [ ] Create Telegram group
- [ ] Set up Reddit community

### 15. Content Marketing
- [ ] Write launch blog post
- [ ] Create gameplay tutorial
- [ ] Develop social media content calendar
- [ ] Reach out to gaming influencers

## 🧪 Testing & QA

### 16. Comprehensive Testing
- [ ] Test all game mechanics
- [ ] Test authentication flows
- [ ] Test on mobile devices
- [ ] Test battle system thoroughly
- [ ] Verify XP/points calculations

### 17. User Acceptance Testing
- [ ] Invite beta testers
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Performance optimization

## 📊 Analytics & Optimization

### 18. Performance Monitoring
- [ ] Set up Core Web Vitals monitoring
- [ ] Optimize images and assets
- [ ] Monitor database query performance
- [ ] Set up CDN (if needed)

### 19. Game Analytics
- [ ] Track player retention metrics
- [ ] Monitor battle completion rates
- [ ] Analyze level progression data
- [ ] Track economic metrics (points/XP earned)

## 🏆 Launch Preparation

### 20. Pre-Launch Checklist
- [ ] Final security review
- [ ] Performance testing under load
- [ ] Backup and recovery procedures
- [ ] Customer support setup
- [ ] Launch announcement preparation

### 21. Grant Applications (Optional)
- [ ] Research gaming/Web3 grants
- [ ] Prepare pitch deck
- [ ] Write grant applications
- [ ] Submit to relevant programs

## 📝 Documentation & Legal

### 22. Legal Compliance
- [ ] Privacy policy creation
- [ ] Terms of service
- [ ] Cookie policy (if applicable)
- [ ] Jurisdiction-specific gaming regulations

### 23. Documentation
- [ ] User guide/tutorial
- [ ] Developer documentation
- [ ] API documentation (if applicable)
- [ ] Troubleshooting guide

---

## ⏰ Estimated Timeline

- **Immediate (Day 1-3)**: Tasks 1-6 (Core setup)
- **Week 1**: Tasks 7-12 (Game configuration & security)
- **Week 2-3**: Tasks 13-17 (Branding & testing)
- **Week 4**: Tasks 18-23 (Launch preparation)

## 💰 Estimated Costs

- **Hosting**: $0-50/month
- **Domain**: $10-20/year
- **Art/Design**: $300-3,000
- **Marketing**: $500-5,000
- **Legal/Audit**: $1,000-50,000+ (for token launch)

## 🎯 Priority Levels

**🔥 Critical (Must do before launch)**
- Tasks 1-8, 16-17

**⚡ Important (Should do for professional launch)**
- Tasks 9-15, 18-20

**🌟 Nice to have (Can do post-launch)**
- Tasks 21-23

---

**Status**: Ready for setup! The codebase is complete and functional. Focus on tasks 1-8 first to get a working live version.
