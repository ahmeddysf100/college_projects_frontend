export default defineNuxtRouteMiddleware(async (to, from) => {
  const useSotre = useUserStore();

  if (useSotre.user?.role === 'admin') {
    return await navigateTo("/dashboard");
  }
  if(useSotre.user?.role === 'user') {
    return await navigateTo('/')
  }
});
