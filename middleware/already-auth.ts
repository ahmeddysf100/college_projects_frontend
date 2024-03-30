export default defineNuxtRouteMiddleware(async (to, from) => {
  const useSotre = useUserStore();
 // for login page if user is login redirect to dash if he admin and for main if he user
  if (useSotre.user?.role === 'admin') {
    return await navigateTo("/dashboard");
  }
  if(useSotre.user?.role === 'user') {
    return await navigateTo('/')
  }
});
