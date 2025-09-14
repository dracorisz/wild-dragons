import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores'
import { pwaManager } from './lib/pwa.js'
import { seoManager } from './lib/seo.js'
import seoAnalytics from './lib/seoAnalytics.js'
import { modalManager } from './lib/modalManager.js'
import { toastManager } from './lib/toastManager.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')

// Initialize stores after mounting
const authStore = useAuthStore()

// Initialize PWA, SEO, and analytics after app is mounted
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize PWA
    await pwaManager.init()
    
    // Initialize SEO
    await seoManager.init()
    
    // Initialize analytics
    seoAnalytics.init()
    
    console.log('✅ All systems initialized successfully!')
    
    // Add debugging helpers for development
    if (import.meta.env.DEV) {
      window.authStore = authStore
      window.pwaManager = pwaManager
      window.seoManager = seoManager
      window.seoAnalytics = seoAnalytics
      window.modalManager = modalManager
      window.toastManager = toastManager
      
      // Add theme awareness check for SEO debugging
      window.checkThemeAwareness = () => {
        console.log('🎨 Current Theme Data:')
        console.log('Document Title:', document.title)
        console.log('Meta Description:', document.querySelector('meta[name="description"]')?.content)
        console.log('Meta Keywords:', document.querySelector('meta[name="keywords"]')?.content)
        console.log('Open Graph Title:', document.querySelector('meta[property="og:title"]')?.content)
        console.log('Open Graph Description:', document.querySelector('meta[property="og:description"]')?.content)
        console.log('Open Graph Image:', document.querySelector('meta[property="og:image"]')?.content)
        console.log('Twitter Title:', document.querySelector('meta[name="twitter:title"]')?.content)
        console.log('Twitter Description:', document.querySelector('meta[name="twitter:description"]')?.content)
        console.log('Twitter Image:', document.querySelector('meta[name="twitter:image"]')?.content)
        console.log('Theme Color:', document.querySelector('meta[name="theme-color"]')?.content)
      }
      
      // Add theme switching test function for development
      window.testThemeSwitch = async (themeName = 'dragons') => {
        const { default: themeManager } = await import('./lib/themeManager.js')
        console.log(`🔄 Switching to ${themeName} theme...`)
        themeManager.setTheme(themeName)
        setTimeout(() => {
          console.log('✅ Theme switch complete! Check SEO with checkThemeAwareness()')
          window.checkThemeAwareness()
        }, 200)
      }
      
      // Add modal testing functions
      window.testModal = async (type = 'default') => {
        const { default: themeManager } = await import('./lib/themeManager.js')
        const theme = themeManager.getTheme()
        
        switch (type) {
          case 'alert':
            modalManager.alert({
              title: theme.test.modal.alert.title,
              message: theme.test.modal.alert.message
            })
            break
          case 'confirm':
            modalManager.confirm({
              title: theme.test.modal.confirm.title,
              message: theme.test.modal.confirm.message,
              confirmText: theme.test.modal.confirm.confirmText,
              cancelText: theme.test.modal.confirm.cancelText
            }).then(result => {
              console.log('User choice:', result)
            })
            break
          case 'custom':
            modalManager.showModal({
              title: theme.test.modal.custom.title,
              content: `
                <div style="text-align: center; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 16px;">
                    ${theme.test.modal.custom.emoji}
                  </div>
                  <p style="font-size: 18px; margin-bottom: 20px;">
                    ${theme.test.modal.custom.welcome}
                  </p>
                  <div style="display: flex; gap: 10px; justify-content: center;">
                    <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                      ${theme.test.modal.custom.feature1}
                    </div>
                    <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                      ${theme.test.modal.custom.feature2}
                    </div>
                  </div>
                </div>
              `,
              size: 'medium',
              buttons: [
                {
                  text: theme.test.modal.custom.buttonText,
                  type: 'primary',
                  action: 'close',
                  icon: theme.test.modal.custom.buttonIcon
                }
              ]
            })
            break
          default:
            modalManager.showModal({
              title: 'Test Modal',
              content: 'This is a test modal to showcase the modal system!',
              buttons: [
                { text: 'Cancel', type: 'secondary', action: 'close' },
                { text: 'OK', type: 'primary', action: 'close' }
              ]
            })
        }
      }
      
      // Add toast testing functions
      window.testToast = async (type = 'info') => {
        const { default: themeManager } = await import('./lib/themeManager.js')
        const theme = themeManager.getTheme()
        
        const testData = theme.test.toast[type]
        
        toastManager.showToast({
          type: type,
          title: testData.title,
          message: testData.message,
          duration: 5000,
          closable: true,
          showProgress: true
        })
      }
      
      // Test all toasts at once
      window.testAllToasts = async () => {
        await window.testToast('success')
        setTimeout(() => window.testToast('error'), 500)
        setTimeout(() => window.testToast('warning'), 1000)
        setTimeout(() => window.testToast('info'), 1500)
      }
      
      // Test suite function
      window.runTestSuite = async () => {
        console.log('🧪 Running Wild Dragons Test Suite...')
        
        console.log('📱 Testing PWA functionality...')
        if ('serviceWorker' in navigator) {
          console.log('✅ Service Worker supported')
        }
        
        console.log('🎨 Testing theme system...')
        await window.testThemeSwitch('dragons')
        setTimeout(async () => {
          await window.testThemeSwitch('puppies')
          setTimeout(async () => {
            await window.testThemeSwitch('dragons')
            console.log('✅ Theme system test complete')
          }, 1000)
        }, 1000)
        
        console.log('🪟 Testing modal system...')
        setTimeout(() => {
          window.testModal('alert')
          setTimeout(() => {
            window.testModal('confirm')
            setTimeout(() => {
              window.testModal('custom')
              console.log('✅ Modal system test complete')
            }, 3000)
          }, 3000)
        }, 3000)
        
        console.log('📢 Testing toast system...')
        setTimeout(() => {
          window.testAllToasts()
          console.log('✅ Toast system test complete')
        }, 10000)
        
        console.log('🔍 Testing SEO awareness...')
        setTimeout(() => {
          window.checkThemeAwareness()
          console.log('✅ All tests completed! Check console for results.')
        }, 15000)
      }
      
      console.log('🛠️ Development helpers available:')
      console.log('- window.testThemeSwitch(themeName)')
      console.log('- window.testModal(type) // alert, confirm, custom')
      console.log('- window.testToast(type) // success, error, warning, info')
      console.log('- window.testAllToasts()')
      console.log('- window.checkThemeAwareness()')
      console.log('- window.runTestSuite()')
    }
  } catch (error) {
    console.error('❌ Error during initialization:', error)
  }
})
