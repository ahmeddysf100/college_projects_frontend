export default defineNuxtPlugin(async (nuxtApp) => {
  const useSotre = useUserStore();

  if (!useSotre.user) {
    await useSotre.fetchUser();
  }
});
