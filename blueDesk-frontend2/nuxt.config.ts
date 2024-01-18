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
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "Trouvez des offres d'emploi passionnantes aux Comores et boostez votre carrière avec notre plateforme de recherche d'emploi." },
        { hid: 'keywords', name: 'keywords', content: "emploi, recherche d'emploi, carrière, offres d'emploi Comores, opportunités professionnelles Comores" },
        { hid: 'og:title', property: 'og:title', content: "Trouvez votre emploi idéal aux Comores | Blue Desk" },
        { hid: 'og:description', property: 'og:description', content: "Trouvez des offres d'emploi passionnantes aux Comores et boostez votre carrière avec notre plateforme de recherche d'emploi." },
        { hid: 'twitter:title', name: 'twitter:title', content: "Trouvez votre emploi idéal aux Comores | Blue Desk" },
        { hid: 'twitter:description', name: 'twitter:description', content: "Trouvez des offres d'emploi passionnantes aux Comores et boostez votre carrière avec notre plateforme de recherche d'emploi." },
      ]
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
