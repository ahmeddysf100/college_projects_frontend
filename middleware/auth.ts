export default defineNuxtRouteMiddleware(async (to, from) => {
  const useStore = useUserStore();
// used to make sure only admins can access this page

  if (useStore.user?.role === 'user' || !useStore.user) {
    return await navigateTo("/login"); 
  }
});
