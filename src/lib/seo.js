// SEO Meta Management for Wild Dragons
// Dynamically manages page titles, descriptions, and meta tags with theme awareness

import themeManager from './themeManager.js'

export class SEOManager {
  constructor() {
    this.defaultMeta = {
      title: '🐉 Wild Dragons - Epic Dragon Battle Game',
      description: 'Enter the realm of legendary dragons and epic adventures. Battle fierce enemies, gain XP, and collect rare treasures in this immersive web-based game.',
      keywords: 'dragon game, web game, play to earn, battle game, fantasy game, vue game, browser game',
      ogImage: '/icons/og-image.png',
      twitterImage: '/icons/twitter-image.png'
    }
  }

  // Generate theme-aware meta data
  getThemeAwareMeta(baseMeta = {}) {
    const theme = themeManager.getTheme()
    
    // Theme-specific content replacements
    const themeReplacements = {
      'Wild Dragons': {
        gameType: 'dragon battle',
        creatures: 'dragons',
        creatureSingle: 'dragon',
        action: 'battle legendary dragons',
        setting: 'medieval fantasy realm',
        mood: 'epic and fierce'
      },
      'Cute Puppies': {
        gameType: 'puppy adventure',
        creatures: 'puppies',
        creatureSingle: 'puppy',
        action: 'play with adorable puppies',
        setting: 'colorful playground',
        mood: 'cute and fun'
      }
    }
    
    const replacements = themeReplacements[theme.meta.name] || themeReplacements['Wild Dragons']
    
    return {
      title: baseMeta.title?.replace(/Wild Dragons/g, theme.ui.game_title)
                            .replace(/Dragon/g, theme.meta.name.slice(0, -1)) // Wild Dragons → Wild Dragon, Cute Puppies → Cute Puppy
                            .replace(/dragon/g, replacements.creatureSingle) || 
             `${theme.ui.game_title} - ${theme.ui.game_subtitle}`,
             
      description: baseMeta.description?.replace(/dragons?/gi, replacements.creatures)
                                      .replace(/dragon battle/gi, replacements.gameType)
                                      .replace(/epic adventures/gi, `${replacements.mood} adventures`)
                                      .replace(/realm of legendary/gi, `${replacements.setting} of`) ||
                  `Experience ${replacements.mood} ${replacements.creatures} adventures! ${theme.ui.play_description || `${replacements.action} and collect amazing rewards in this immersive web-based game.`}`,
                  
      keywords: baseMeta.keywords?.replace(/dragon/gi, replacements.creatureSingle)
                                .replace(/battle/gi, theme.seo_action_word) ||
               `${replacements.creatureSingle} game, ${replacements.gameType}, web game, ${replacements.creatures} ${theme.seo_action_word}, ${theme.seo_keywords_suffix}`,
               
      ogImage: baseMeta.ogImage || this.defaultMeta.ogImage,
      twitterImage: baseMeta.twitterImage || this.defaultMeta.twitterImage
    }
  }

  // Set page meta data with theme awareness and complete override
  setPageMeta(meta) {
    const themeMeta = this.getThemeAwareMeta(meta)
    const title = themeMeta.title
    const description = themeMeta.description
    const keywords = themeMeta.keywords
    const ogImage = themeMeta.ogImage
    const twitterImage = themeMeta.twitterImage

    // Update title
    document.title = title

    // Update meta tags
    this.updateMetaTag('description', description)
    this.updateMetaTag('keywords', keywords)
    this.updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    
    // Update application-specific meta tags with theme awareness
    const theme = themeManager.getTheme()
    this.updateMetaTag('application-name', theme.ui.game_title)
    this.updateMetaTag('msapplication-tooltip', `Epic ${theme.meta.name.toLowerCase()} battle game - play for free!`)
    this.updateMetaTag('apple-mobile-web-app-title', theme.ui.game_title)
    
    // Update Open Graph tags with theme awareness
    this.updateMetaTag('og:title', title, 'property')
    this.updateMetaTag('og:description', description, 'property')
    this.updateMetaTag('og:image', ogImage, 'property')
    this.updateMetaTag('og:url', window.location.href, 'property')
    this.updateMetaTag('og:type', 'website', 'property')
    this.updateMetaTag('og:site_name', theme.ui.game_title, 'property')
    this.updateMetaTag('og:locale', 'en_US', 'property')
    
    // Update Twitter tags with theme awareness
    this.updateMetaTag('twitter:card', 'summary_large_image', 'property')
    this.updateMetaTag('twitter:title', title, 'property')
    this.updateMetaTag('twitter:description', description, 'property')
    this.updateMetaTag('twitter:image', twitterImage, 'property')
    this.updateMetaTag('twitter:site', '@wilddragons', 'property')
    this.updateMetaTag('twitter:creator', '@wilddragons', 'property')
    
    // Add theme color that matches current theme
    const themeColor = theme.colors?.primary || '#000000'
    this.updateMetaTag('theme-color', themeColor, 'name')
    this.updateMetaTag('msapplication-TileColor', themeColor, 'name')
    
    // Update content classification with theme awareness
    this.updateMetaTag('page-topic', `Gaming, Entertainment, ${theme.meta.name} Games`, 'name')
    this.updateMetaTag('audience', 'all', 'name')
    this.updateMetaTag('document-rating', 'safe for kids', 'name')
  }

  // Update individual meta tag
  updateMetaTag(name, content, attribute = 'name') {
    let element = document.querySelector(`meta[${attribute}="${name}"]`)
    
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, name)
      document.head.appendChild(element)
    }
    
    element.setAttribute('content', content)
  }

  // Add canonical URL
  setCanonicalUrl(url) {
    let canonical = document.querySelector('link[rel="canonical"]')
    
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    
    canonical.href = url
  }

  // Add structured data (JSON-LD) with dynamic removal
  addStructuredData(data, id = 'structured-data') {
    // Remove existing structured data with same ID
    const existing = document.querySelector(`script#${id}`)
    if (existing) {
      existing.remove()
    }

    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // Generate game-specific structured data with full theme awareness
  generateGameStructuredData(pageData = {}) {
    const theme = themeManager.getTheme()
    
    // Theme-specific content
    const themeContent = {
      'Wild Dragons': {
        gameDescription: `Epic dragon battle game where players fight legendary creatures, gain experience, and collect rare treasures`,
        gameFeatures: [
          "Epic dragon battles",
          "Medieval fantasy setting", 
          "Legendary boss encounters",
          "Dragon collection system",
          "Epic loot and treasures"
        ],
        audience: "Fantasy game enthusiasts, dragon lovers, RPG players"
      },
      'Cute Puppies': {
        gameDescription: `Adorable puppy adventure game where players care for cute puppies, play fun activities, and collect toys`,
        gameFeatures: [
          "Cute puppy adventures",
          "Colorful playground setting",
          "Adorable puppy collection", 
          "Fun mini-games and activities",
          "Collectible toys and treats"
        ],
        audience: "Family-friendly gamers, pet lovers, casual players"
      }
    }
    
    const content = themeContent[theme.meta.name] || themeContent['Wild Dragons']
    
    return {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": theme.ui.game_title,
      "alternateName": `${theme.ui.game_title} - ${theme.ui.game_subtitle}`,
      "description": content.gameDescription,
      "url": window.location.origin + '/play',
      "sameAs": [
        window.location.origin,
        `${window.location.origin}/play`,
        `${window.location.origin}/profile`
      ],
      "genre": theme.seo_game_genre === "family" ? 
        ["Casual", "Family", "Adventure", "Simulation"] : 
        ["Action", "Fantasy", "Battle", "Strategy", "RPG"],
      "gamePlatform": ["Web Browser", "Mobile Web", "Progressive Web App"],
      "operatingSystem": "Any",
      "applicationCategory": "Game",
      "audience": {
        "@type": "Audience",
        "audienceType": content.audience
      },
      "gameItem": [
        {
          "@type": "Thing",
          "name": theme.enemies?.boss?.name || `Legendary ${theme.meta.name.slice(0, -1)}`,
          "description": `Powerful ${theme.meta.name.toLowerCase()} ${theme.meta.name === 'Wild Puppies' ? 'friend' : 'boss'} encounter`
        }
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "category": "Free to Play"
      },
      "author": {
        "@type": "Organization",
        "name": "Wild Dragons Team",
        "url": window.location.origin,
        "sameAs": [
          "https://twitter.com/wilddragons"
        ]
      },
      "publisher": {
        "@type": "Organization", 
        "name": "Wild Dragons Team",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/icons/apple-touch-icon.png`,
          "width": 180,
          "height": 180
        }
      },
      "datePublished": "2025-09-14",
      "dateModified": new Date().toISOString(),
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "browserRequirements": "Requires JavaScript. Works on all modern browsers.",
      "contentRating": "Everyone",
      "interactionType": "https://schema.org/PlayAction",
      "featureList": [
        ...content.gameFeatures,
        "Progressive Web App",
        "Offline gameplay",
        "Character progression", 
        "Achievement system",
        "Free to play",
        "Cross-platform compatibility",
        "No downloads required"
      ],
      "screenshot": [
        `${window.location.origin}/icons/og-image.png`,
        `${window.location.origin}/icons/play-screenshot.png`
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "mainEntity": {
        "@type": "SoftwareApplication",
        "applicationCategory": "Game",
        "operatingSystem": "Web Browser"
      }
    }
  }

  // Generate profile structured data
  generateProfileStructuredData(userData = {}) {
    const theme = themeManager.getTheme()
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": userData.username ? `${userData.username}'s Profile` : "Player Profile",
      "description": `View player statistics, achievements, and progress in ${theme.ui.game_title}`,
      "url": window.location.href,
      "mainEntity": {
        "@type": "Person",
        "name": userData.username || "Game Player",
        "description": `Level ${userData.level || 1} ${theme.ui.hero_class || 'hero'} with ${userData.totalPoints || 0} points`,
        "hasOccupation": {
          "@type": "Role",
          "roleName": `${theme.ui.game_title} Player`
        }
      },
      "about": {
        "@type": "VideoGame",
        "name": theme.ui.game_title
      }
    }
  }

  // Add breadcrumb structured data
  addBreadcrumbs(breadcrumbs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
    
    this.addStructuredData(structuredData, 'breadcrumb-data')
  }

  // Add FAQ structured data for pages
  addFAQData(faqs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
    
    this.addStructuredData(structuredData, 'faq-data')
  }

  // Performance and indexing hints
  addPerformanceHints() {
    // Preconnect to important domains
    this.addLinkTag('preconnect', 'https://fonts.googleapis.com')
    this.addLinkTag('preconnect', 'https://fonts.gstatic.com', { crossorigin: true })
    
    // DNS prefetch for external resources
    this.addLinkTag('dns-prefetch', 'https://cdnjs.cloudflare.com')
  }

  // Initialize theme-aware SEO by overriding all static HTML meta tags
  initializeThemeAwareSEO() {
    // Override the static structured data from index.html
    this.addStructuredData(this.generateGameStructuredData(), 'main-structured-data')
    
    // Set initial page meta with theme awareness (this will override static tags)
    this.setPageMeta(this.defaultMeta)
    
    // Add performance hints
    this.addPerformanceHints()
    
    console.log(`🎨 SEO initialized with ${themeManager.getTheme().name} theme`)
  }

  // Add link tags
  addLinkTag(rel, href, attributes = {}) {
    let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`)
    
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      link.href = href
      
      // Add additional attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (value === true) {
          link.setAttribute(key, '')
        } else {
          link.setAttribute(key, value)
        }
      })
      
      document.head.appendChild(link)
    }
  }
}

// Pre-configured page meta data with theme awareness
export const pageMeta = {
  home: {
    title: '🐉 Wild Dragons - Epic Battle Game',
    description: 'Enter the realm of legendary dragons and epic adventures. Battle fierce enemies, gain XP, and collect rare treasures in this immersive web-based game.',
    keywords: 'dragon game, web game, play to earn, battle game, fantasy game, vue game, browser game, free game, PWA game'
  },
  
  play: {
    title: '🎮 Play Dragon Battle Arena',
    description: 'Jump into the Dragon Arena and battle fierce enemies! Gain XP, earn points, and collect legendary loot in epic combat encounters.',
    keywords: 'play dragon game, battle arena, dragon combat, gaming online, web battles, free online game'
  },
  
  profile: {
    title: '👤 Your Dragon Profile',
    description: 'View your dragon collection, battle statistics, achievements, and progress. Manage your legendary dragons and track your gaming journey.',
    keywords: 'dragon profile, game stats, achievements, dragon collection, gaming progress, player stats'
  }
}

// Enhanced sitemap data with better SEO practices
export const sitemapData = {
  baseUrl: 'https://wildragons.game',
  urls: [
    {
      loc: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
      images: ['/icons/og-image.png']
    },
    {
      loc: '/play',
      priority: 0.9,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
      images: ['/icons/play-screenshot.png']
    },
    {
      loc: '/profile',
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    }
  ]
}

// Initialize SEO Manager
export const seoManager = new SEOManager()

// Enhanced Vue Router integration
export function setupSEORouting(router, authStore) {
  router.beforeEach((to, from, next) => {
    // Set page meta based on route with theme awareness
    const routeName = to.name?.toLowerCase() || 'home'
    const baseMeta = pageMeta[routeName] || pageMeta.home
    
    // Get user data for personalized SEO
    const userData = authStore?.profile || {}
    
    seoManager.setPageMeta(baseMeta)
    seoManager.setCanonicalUrl(window.location.origin + to.fullPath)
    
    // Add performance hints
    seoManager.addPerformanceHints()
    
    // Add page-specific structured data
    if (routeName === 'play') {
      seoManager.addStructuredData(seoManager.generateGameStructuredData(), 'game-data')
    } else if (routeName === 'profile' && userData.username) {
      seoManager.addStructuredData(seoManager.generateProfileStructuredData(userData), 'profile-data')
    }
    
    // Add breadcrumbs for nested routes
    if (to.matched.length > 1) {
      const breadcrumbs = to.matched.map((route, index) => ({
        name: route.meta?.title || route.name || 'Page',
        url: window.location.origin + (index === 0 ? '/' : route.path)
      }))
      seoManager.addBreadcrumbs(breadcrumbs)
    }
    
    // Add FAQ data for home page
    if (routeName === 'home') {
      const faqs = [
        {
          question: "What is Wild Dragons?",
          answer: "Wild Dragons is a free web-based battle game where you can fight legendary creatures, gain experience points, and collect amazing rewards. It works on all devices and browsers."
        },
        {
          question: "How do I start playing?",
          answer: "Simply click the 'Start Playing' button on the home page. You can play as a guest or create an account to save your progress and compete on leaderboards."
        },
        {
          question: "Is Wild Dragons free to play?",
          answer: "Yes! Wild Dragons is completely free to play. There are no hidden costs or required purchases. All game features are available to all players."
        },
        {
          question: "Can I play offline?",
          answer: "Yes! Wild Dragons works offline as a Progressive Web App (PWA). You can battle enemies and progress even without an internet connection."
        },
        {
          question: "What devices support Wild Dragons?",
          answer: "Wild Dragons works on all modern web browsers including Chrome, Firefox, Safari, and Edge. It's fully responsive and works great on desktop, tablet, and mobile devices."
        }
      ]
      seoManager.addFAQData(faqs)
    }
    
    next()
  })
  
  // After route change, scroll to top and update focus for accessibility
  router.afterEach((to) => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Update focus for screen readers
    const main = document.querySelector('main')
    if (main) {
      main.focus()
    }
  })
}
