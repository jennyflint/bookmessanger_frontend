import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useUserStore();
  const isLoggedIn = authStore.isAuthenticated;

  const localePath = useLocalePath();
  const getRouteBaseName = useRouteBaseName();
  const { $i18n } = useNuxtApp();

  // Route names without the locale suffix, so every language version matches
  const publicPages = new Set([
    'auth-login',
  ]);
  const isPublicPage = publicPages.has(String(getRouteBaseName(to)));

  // The target URL defines the language: the current locale is not switched yet at this point.
  // "/" has no language of its own, so it keeps the detected one.
  const pathLocale = $i18n.localeCodes.value.find((code) => code === to.path.split('/')[1]);
  const locale = to.path === '/' ? $i18n.locale.value : (pathLocale ?? $i18n.defaultLocale);

  if (!isLoggedIn && !isPublicPage) {
    return navigateTo(localePath('/auth/login', locale));
  }

  if (isLoggedIn && isPublicPage) {
    return navigateTo(localePath('/dashboard', locale));
  }
});