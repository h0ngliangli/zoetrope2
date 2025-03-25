// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/content"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",
  nitro: {
    experimental: {
      database: true,
    },
  },
  routeRules: {
    // /add -> /edit-new
    "/add": {redirect: "/edit-new"},
    "/": {redirect: "/exec"},
  },

  ssr: false,
})
