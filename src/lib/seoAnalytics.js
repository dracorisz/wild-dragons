/**
 * SEO Analytics and Performance Monitor
 * Tracks SEO metrics, Core Web Vitals, and provides optimization recommendations
 */

class SEOAnalytics {
  constructor() {
    this.metrics = {
      pageViews: 0,
      uniqueVisitors: new Set(),
      sessionDuration: 0,
      bounceRate: 0,
      coreWebVitals: {
        LCP: null, // Largest Contentful Paint
        FID: null, // First Input Delay
        CLS: null  // Cumulative Layout Shift
      },
      searchKeywords: [],
      referrers: [],
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }
    
    this.init()
  }

  init() {
    this.trackPageView()
    this.measureCoreWebVitals()
    this.trackUserInteractions()
    this.monitorPerformance()
    
    // Track session duration
    this.sessionStart = Date.now()
    window.addEventListener('beforeunload', () => {
      this.metrics.sessionDuration = Date.now() - this.sessionStart
      this.sendAnalytics()
    })
  }

  trackPageView() {
    this.metrics.pageViews++
    
    // Track unique visitors using session storage
    const visitorId = this.getOrCreateVisitorId()
    this.metrics.uniqueVisitors.add(visitorId)
    
    // Track referrer
    if (document.referrer) {
      this.metrics.referrers.push(this.extractDomain(document.referrer))
    }
    
    // Track search keywords from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const searchTerms = urlParams.get('q') || urlParams.get('search') || urlParams.get('query')
    if (searchTerms) {
      this.metrics.searchKeywords.push(searchTerms)
    }
  }

  getOrCreateVisitorId() {
    let visitorId = sessionStorage.getItem('wild-dragons-visitor-id')
    if (!visitorId) {
      visitorId = 'visitor-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('wild-dragons-visitor-id', visitorId)
    }
    return visitorId
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname
    } catch {
      return 'unknown'
    }
  }

  measureCoreWebVitals() {
    // Measure Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.coreWebVitals.LCP = Math.round(lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Measure First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          this.metrics.coreWebVitals.FID = Math.round(entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })

      // Measure Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.coreWebVitals.CLS = Math.round(clsValue * 1000) / 1000
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  trackUserInteractions() {
    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
    })

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target
      if (target.matches('button, a, [role="button"]')) {
        this.trackEvent('click', {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim().substring(0, 50),
          className: target.className
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      this.trackEvent('form_submit', {
        formId: event.target.id,
        formClass: event.target.className
      })
    })
  }

  trackEvent(eventType, data = {}) {
    if (!this.metrics.events) {
      this.metrics.events = []
    }
    
    this.metrics.events.push({
      type: eventType,
      data: data,
      timestamp: Date.now(),
      url: window.location.href
    })
  }

  monitorPerformance() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0]
        if (perfData) {
          this.metrics.performance = {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            firstByte: Math.round(perfData.responseStart - perfData.requestStart),
            domInteractive: Math.round(perfData.domInteractive - perfData.navigationStart),
            transferSize: perfData.transferSize,
            encodedBodySize: perfData.encodedBodySize
          }
        }
      }, 1000)
    })
  }

  // SEO Health Check
  performSEOAudit() {
    const audit = {
      title: this.checkTitle(),
      metaDescription: this.checkMetaDescription(),
      headings: this.checkHeadingStructure(),
      images: this.checkImages(),
      links: this.checkLinks(),
      performance: this.checkPerformance(),
      accessibility: this.checkAccessibility(),
      mobileOptimization: this.checkMobileOptimization(),
      structuredData: this.checkStructuredData()
    }

    return audit
  }

  checkTitle() {
    const title = document.title
    return {
      exists: !!title,
      length: title.length,
      optimal: title.length >= 30 && title.length <= 60,
      content: title
    }
  }

  checkMetaDescription() {
    const meta = document.querySelector('meta[name="description"]')
    const content = meta?.getAttribute('content') || ''
    return {
      exists: !!meta,
      length: content.length,
      optimal: content.length >= 120 && content.length <= 160,
      content: content
    }
  }

  checkHeadingStructure() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const h1Count = document.querySelectorAll('h1').length
    
    return {
      h1Count: h1Count,
      h1Optimal: h1Count === 1,
      totalHeadings: headings.length,
      structure: headings.map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent?.trim().substring(0, 50)
      }))
    }
  }

  checkImages() {
    const images = Array.from(document.querySelectorAll('img'))
    const withoutAlt = images.filter(img => !img.alt)
    
    return {
      total: images.length,
      withoutAlt: withoutAlt.length,
      altOptimal: withoutAlt.length === 0,
      lazyLoaded: images.filter(img => img.loading === 'lazy').length
    }
  }

  checkLinks() {
    const links = Array.from(document.querySelectorAll('a[href]'))
    const external = links.filter(link => {
      try {
        const url = new URL(link.href)
        return url.hostname !== window.location.hostname
      } catch {
        return false
      }
    })
    
    return {
      total: links.length,
      external: external.length,
      withoutTarget: external.filter(link => link.target !== '_blank').length
    }
  }

  checkPerformance() {
    const { LCP, FID, CLS } = this.metrics.coreWebVitals
    
    return {
      LCP: {
        value: LCP,
        good: LCP <= 2500,
        needsImprovement: LCP > 2500 && LCP <= 4000,
        poor: LCP > 4000
      },
      FID: {
        value: FID,
        good: FID <= 100,
        needsImprovement: FID > 100 && FID <= 300,
        poor: FID > 300
      },
      CLS: {
        value: CLS,
        good: CLS <= 0.1,
        needsImprovement: CLS > 0.1 && CLS <= 0.25,
        poor: CLS > 0.25
      }
    }
  }

  checkAccessibility() {
    return {
      lang: !!document.documentElement.lang,
      skipLinks: !!document.querySelector('a[href="#main"], a[href="#content"]'),
      focusVisible: !!document.querySelector(':focus-visible'),
      ariaLabels: document.querySelectorAll('[aria-label]').length,
      altTexts: document.querySelectorAll('img[alt]').length
    }
  }

  checkMobileOptimization() {
    const viewport = document.querySelector('meta[name="viewport"]')
    const viewportContent = viewport?.getAttribute('content') || ''
    
    return {
      viewport: !!viewport,
      responsive: viewportContent.includes('width=device-width'),
      touchFriendly: window.innerWidth <= 768 ? this.checkTouchTargets() : null
    }
  }

  checkTouchTargets() {
    const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'))
    const smallTargets = buttons.filter(btn => {
      const rect = btn.getBoundingClientRect()
      return rect.width < 44 || rect.height < 44
    })
    
    return {
      total: buttons.length,
      tooSmall: smallTargets.length,
      optimal: smallTargets.length === 0
    }
  }

  checkStructuredData() {
    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    
    return {
      exists: jsonLd.length > 0,
      count: jsonLd.length,
      types: jsonLd.map(script => {
        try {
          const data = JSON.parse(script.textContent)
          return data['@type'] || 'Unknown'
        } catch {
          return 'Invalid'
        }
      })
    }
  }

  sendAnalytics() {
    // In a real app, send to analytics service
    console.log('SEO Analytics:', this.metrics)
    
    // Store locally for development
    localStorage.setItem('wild-dragons-seo-metrics', JSON.stringify(this.metrics))
  }

  generateSEOReport() {
    const audit = this.performSEOAudit()
    const score = this.calculateSEOScore(audit)
    
    return {
      score: score,
      audit: audit,
      recommendations: this.generateRecommendations(audit),
      metrics: this.metrics
    }
  }

  calculateSEOScore(audit) {
    let score = 0
    let maxScore = 0

    // Title (10 points)
    maxScore += 10
    if (audit.title.optimal) score += 10
    else if (audit.title.exists) score += 5

    // Meta description (10 points)
    maxScore += 10
    if (audit.metaDescription.optimal) score += 10
    else if (audit.metaDescription.exists) score += 5

    // Headings (10 points)
    maxScore += 10
    if (audit.headings.h1Optimal) score += 10
    else if (audit.headings.h1Count > 0) score += 5

    // Images (10 points)
    maxScore += 10
    if (audit.images.altOptimal) score += 10
    else score += Math.max(0, 10 - audit.images.withoutAlt * 2)

    // Performance (30 points)
    maxScore += 30
    const perf = audit.performance
    if (perf.LCP.good) score += 10
    else if (!perf.LCP.poor) score += 5
    if (perf.FID.good) score += 10
    else if (!perf.FID.poor) score += 5
    if (perf.CLS.good) score += 10
    else if (!perf.CLS.poor) score += 5

    // Structured data (10 points)
    maxScore += 10
    if (audit.structuredData.exists) score += 10

    // Mobile optimization (10 points)
    maxScore += 10
    if (audit.mobileOptimization.responsive) score += 10

    // Accessibility (10 points)
    maxScore += 10
    let a11yScore = 0
    if (audit.accessibility.lang) a11yScore += 2
    if (audit.accessibility.ariaLabels > 0) a11yScore += 4
    if (audit.accessibility.altTexts > 0) a11yScore += 4
    score += a11yScore

    return Math.round((score / maxScore) * 100)
  }

  generateRecommendations(audit) {
    const recommendations = []

    if (!audit.title.optimal) {
      recommendations.push({
        priority: 'high',
        issue: 'Title length not optimal',
        current: `${audit.title.length} characters`,
        recommendation: 'Keep title between 30-60 characters for best SEO results'
      })
    }

    if (!audit.metaDescription.optimal) {
      recommendations.push({
        priority: 'high',
        issue: 'Meta description length not optimal',
        current: `${audit.metaDescription.length} characters`,
        recommendation: 'Keep meta description between 120-160 characters'
      })
    }

    if (!audit.headings.h1Optimal) {
      recommendations.push({
        priority: 'medium',
        issue: `Found ${audit.headings.h1Count} H1 tags`,
        recommendation: 'Use exactly one H1 tag per page'
      })
    }

    if (!audit.images.altOptimal) {
      recommendations.push({
        priority: 'medium',
        issue: `${audit.images.withoutAlt} images without alt text`,
        recommendation: 'Add descriptive alt text to all images'
      })
    }

    const perf = audit.performance
    if (perf.LCP.poor) {
      recommendations.push({
        priority: 'high',
        issue: `Poor LCP: ${perf.LCP.value}ms`,
        recommendation: 'Optimize images and server response times. Target < 2.5s'
      })
    }

    if (perf.CLS.poor) {
      recommendations.push({
        priority: 'high',
        issue: `Poor CLS: ${perf.CLS.value}`,
        recommendation: 'Reduce layout shifts by setting image dimensions. Target < 0.1'
      })
    }

    return recommendations
  }
}

// Initialize SEO Analytics
export default new SEOAnalytics()
