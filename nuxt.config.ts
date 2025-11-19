export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  
  app: {
    head: {
      title: 'Graphic NewsPlus - Digital News Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ghana\'s leading digital news platform providing access to trusted newspapers, magazines, and breaking news.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
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
      //proxyApiBaseURL: "https://dev-api.graphicnewsplus.com/api/v1/",
      proxyApiBaseURL: "http://localhost:5034/api/v1/",
    },
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET || '',
    
  },

  '@nuxtjs/tailwindcss': {
    configPath: '~/tailwind.config.js'
  }
})