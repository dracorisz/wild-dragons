# 🐉 Wild Dragons

A modern, component-based dragon battle game template with advanced game mechanics, PWA capabilities, and comprehensive theming support.

## ✨ Features

### 🎮 Enhanced Game Mechanics
- **Advanced Battle System** with status effects, critical hits, and environmental conditions
- **Multiple Battle Types** - Normal, Elite, Boss, Tournament, and Survival modes
- **Rich Progression** - XP system with achievements, combo bonuses, and daily rewards
- **Dynamic Enemy Scaling** with unique abilities and loot systems

### 🏗️ Modern Architecture
- **Vue 3 Composition API** for optimal performance and maintainability
- **Comprehensive Component Library** with 6+ reusable UI components
- **Centralized Styling System** with CSS variables for easy theming
- **Progressive Web App** with offline support and mobile optimization

### 🎨 Design System
- **Professional UI** with consistent black & white theme
- **Responsive Design** mobile-first approach with smooth animations
- **Accessibility First** ARIA compliance and keyboard navigation
- **Typography System** with Inter and Orbitron fonts

### 🔧 Developer Experience  
- **Template-Ready** for easy re-theming and content adaptation
- **TypeScript-Ready** component props with proper validation
- **Optimized Build** with minimal bundle size and fast loading
- **Comprehensive Documentation** with usage examples and guides

## 🚀 Quick Start

### Prerequisites
- Node.js 24+
- Supabase account

### Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Add your Supabase URL and anon key
   ```

3. **Set up database**
   - Run `database/clean_schema.sql` in your Supabase SQL Editor

4. **Start development**
   ```bash
   npm run dev
   ```

### Development Server
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🏗️ Architecture

### Project Structure
```
📁 src/
├── 🎨 components/
│   ├── ui/            # Component library (Button, Card, Typography, etc.)
│   ├── GameArena.vue  # Main battle interface
│   └── AuthModal.vue  # Authentication system
├── 📱 pages/          # Route pages (Home, Play, Profile)
├── 🏗️ layouts/        # App layouts
├── 💾 stores/         # Pinia state management
├── 🔧 lib/           # Game engine and utilities
├── � data/          # Game content (enemies, abilities, loot)
└── �️ router/         # Navigation with guards
```

### Component Library
```typescript
// Available UI Components
import { 
  Button,    // 5 variants, 5 sizes, accessibility
  Card,      // 4 variants, hover states, clickable 
  Typography, // Semantic HTML, responsive sizing
  ProgressBar, // Multiple variants, animations
  Input,     // Form input with error states
  Modal      // Reusable dialog system
} from '@/components/ui'
```

### Styling System
```css
/* Centralized in src/style.css */
:root {
  --primary: #aa0000;      /* Dragon red accent */
  --background: #ffffff;   /* Clean white background */
  --foreground: #000000;   /* High contrast text */
  /* 50+ CSS variables for complete theming */
}
```

## 🎮 Game Systems

### Battle Mechanics
- **Status Effects**: Burning, Frozen, Stunned, Regeneration, Shield, Weakness
- **Environmental Effects**: Weather conditions affecting battle outcomes
- **Critical Hit System**: Dynamic critical chance and damage multipliers
- **Enemy Abilities**: Unique powers for each enemy type

### Progression System
- **XP Formula**: `100 * level^2.1` for balanced progression
- **Achievement System**: 30+ achievements with XP and point rewards
- **Combo System**: Consecutive wins provide increasing bonuses
- **Daily Bonuses**: First battle each day provides extra rewards

### Battle Types
| Type | Cost | Description | Special Features |
|------|------|-------------|------------------|
| Normal | Free | Standard battles | Basic rewards |
| Elite | 50 pts | Tougher enemies | Higher XP/loot |
| Boss | 100 pts | Epic encounters | Rare loot guaranteed |
| Tournament | 200 pts | Competitive | Ranking rewards |
| Survival | 500 pts | Endless waves | Scaling difficulty |

## 🎨 Theming & Customization

### Re-theming Process
1. **Update CSS Variables** in `src/style.css`
2. **Replace Content** using `THEME_TEMPLATE.md` guide
3. **Modify Game Data** in `src/data/enemies.json`
4. **Update Branding** in `index.html` and manifest

### Theme Template Support
- **Complete Mapping** of all theme-related elements
- **Generic Alternatives** provided for easy adaptation
- **Implementation Strategy** with step-by-step instructions
- **Re-theming Checklist** for systematic updates

## 🔧 Technical Specifications

### Performance
- **Optimized Bundle** < 500KB gzipped
- **Fast Initial Load** < 2s on 3G networks
- **Smooth Animations** 60fps transitions
- **Efficient State Management** minimal re-renders

### PWA Features
- **Offline Support** service worker with caching
- **Mobile Optimization** responsive design and touch support
- **App-like Experience** manifest with icon and theme
- **SEO Optimized** comprehensive meta tags

### Browser Support
- **Modern Browsers** Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Support** iOS Safari, Chrome Mobile
- **Progressive Enhancement** graceful degradation

## 📖 Documentation

- � [Architecture Documentation](ARCHITECTURE.md) - Technical deep dive
- 🎨 [Theme Template Guide](THEME_TEMPLATE.md) - Complete theming reference
- 📝 [Session Summary](SESSION_SUMMARY.md) - Latest development updates
- 🛠️ [Deployment Guide](DEPLOYMENT.md) - Production setup instructions

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper testing
4. Follow the component API patterns
5. Update documentation as needed
6. Submit a pull request

### Component Development
```vue
<!-- Follow this pattern for new components -->
<template>
  <component
    :is="tag"
    :class="computedClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
// Use Composition API with proper prop validation
defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' }
})
</script>
```

## 📈 Project Status

### ✅ Completed Features
- [x] Enhanced game mechanics with status effects
- [x] Complete UI component library
- [x] Centralized styling system
- [x] PWA capabilities with offline support
- [x] SEO optimization and meta tags
- [x] Theme template system
- [x] Advanced battle types and progression

### 🔄 In Progress
- [ ] Complete Profile.vue componentization
- [ ] Advanced battle animations
- [ ] Real-time multiplayer features

### 📋 Planned Features
- [ ] Enhanced dragon management system
- [ ] Guild system implementation
- [ ] Advanced analytics and tracking
- [ ] Mobile app distribution

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Documentation**: Check the docs folder for detailed guides
- **Examples**: See the demo implementation for usage patterns

---

**Built with ❤️ using Vue 3, Vite, Tailwind CSS, and Supabase**

