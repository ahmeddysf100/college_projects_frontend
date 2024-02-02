export default defineNuxtRouteMiddleware(async (to, from) => {
    const useStore = useUserStore();
  
    if (!useStore.user) {
      return await navigateTo("/login");
    }
  });
  