// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  // nuxtjs/mdc的位置必须出现在@nuxt/content之前,否则会出现:
  //  WARN  [Vue Router warn]: No match found for location with path "/api/_mdc/highlight"
  // 导致mdc的highlight功能无法使用.
  // 原因可能是因为@nuxt/content和@nuxtjs/mdc都会对路由进行处理,但是@nuxt/content的优先级更高.
  // 并且两者使用相同的底层代码.
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/mdc", "@nuxt/content"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
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
    "/add": { redirect: "/edit-new" },
    "/": { redirect: "/exec" },
  },
  mdc: {
    highlight: {
      theme: "github-dark",
      wrapperStyle: true,
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: "github-light",
            // Theme used if `html.dark`
            dark: "github-dark",
            // Theme used if `html.sepia`
            sepia: "monokai",
          },
        },
      },
    },
  },
})
