export default defineNuxtRouteMiddleware(async (to, from) => {
    const useStore = useUserStore();
  // if user is logedin can access web pages 
    if (!useStore.user) {
      return await navigateTo("/login");
    }
  });
  