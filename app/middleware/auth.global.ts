import { useUserStore } from '~/stores/user'


export default defineNuxtRouteMiddleware((to) => {
  const authStore = useUserStore();
  const isLoggedIn = authStore.isAuthenticated;

  const publicPages = new Set([
    '/auth/login',
  ]);
  const isPublicPage = publicPages.has(to.path);
  if (!isLoggedIn && !isPublicPage) {
    return navigateTo('/auth/login');
  }

  if (isLoggedIn && isPublicPage) {
    return navigateTo('/dashboard');
  }
});