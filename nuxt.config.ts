// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
ssr: true,
runtimeConfig:{
  public:{
    IP_HOME: process.env.NUXT_PUBLIC_IP_HOME,
  }
},
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxt/ui", "@pinia/nuxt",'@vueuse/motion/nuxt',],
  imports: {
    dirs: ["./stores"],
  },
  ui: {
    icons: "all",
  },
  colorMode: {
    preference: "dark",
  },
  plugins:[
    {src:'~/plugins/auth.ts', mode: 'all'},
  ]
});
