export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vite-pwa/nuxt'],
  
  app: {
    head: {
      title: 'Graphic NewsPlus - Digital News Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ghana\'s leading digital news platform providing access to trusted newspapers, magazines, and breaking news.' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/favicon-mag.png', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/pwa-icons/apple-touch-icon-180x180.png' }
      ]
    }
  },

  pwa: {
    manifest: {
      name: 'Graphic NewsPlus',
      short_name: 'NewsPlus',
      description: 'Ghana\'s leading digital news platform providing access to trusted newspapers, magazines, and breaking news.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-icons/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'  
        },
        {
          src: '/pwa-icons/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },
  
  css: ['~/assets/css/main.css'],

  imports: {
    dirs: ["services"],
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      microsoftClientId: process.env.NUXT_MICROSOFT_CLIENT_ID || '',
      googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID || '',
      proxyApiBaseURL: "https://dev-api.graphicnewsplus.com/api/v1/",
      //proxyApiBaseURL: "http://localhost:5034/api/v1/",
    },
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET || '',
    
  },

  '@nuxtjs/tailwindcss': {
    configPath: '~/tailwind.config.js'
  }
})