// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: true,
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  imports: {
    dirs: ["./stores"],
  },
  ui: {
    icons: "all",
  },
  colorMode: {
    preference: "dark",
  },
});