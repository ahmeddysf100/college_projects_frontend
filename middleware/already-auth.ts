export default defineNuxtRouteMiddleware(async (to, from) => {
  const useSotre = useUserStore();

  if (!!useSotre.user) {
    return await navigateTo("/dashboard");
  }
});
