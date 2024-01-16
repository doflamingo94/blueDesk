// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backend: process.env.NUXT_PUBLIC_BACKEND
    }
  },
  devtools: { enabled: false },
  app: {
    head: {
      title: "Blue Desk",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  plugins: [
    '@/plugins/maska.ts'
  ],
  css: [
    '@/assets/global.css',
    '@/assets/scss/main.scss'
  ],
  modules: ['@nuxtjs/google-fonts', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  googleFonts: {
    display: "swap",
    families:{
        'Raleway': true,
        'Architects Daughter': true,
        'Poppins': true,
        'Roboto': true,
        'Inter': [400, 700],
        'Josefin+Sans': true,
        'Lato': [100, 300]
    }
  }
})
