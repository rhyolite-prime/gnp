import { useAffiliateAuthStore } from '~/stores/affiliate-auth';

export default defineNuxtRouteMiddleware((to) => {
  const affiliateAuthStore = useAffiliateAuthStore();
  const cookie = useCookie('gnp-affiliate-user-identity');

  if (affiliateAuthStore.accessToken) {
    return;
  }

  if (cookie.value) {
    affiliateAuthStore.accessToken = cookie.value;
    affiliateAuthStore.isAuthenticated = true;
    return;
  }

  if (import.meta.dev && to.path !== '/affiliates/login') {
    affiliateAuthStore.accessToken = 'dev-preview-affiliate-jwt';
    affiliateAuthStore.isAuthenticated = true;
    affiliateAuthStore.affiliateUser = {
      token: 'dev-preview-affiliate-jwt',
      id: 'aff-kwame-001',
      firstName: 'Kwame',
      lastName: 'Mensah',
      email: 'kwame@techgh.com',
      affiliateCode: 'KWAME2026',
    } as any;
    return;
  }

  if (to.path !== '/affiliates/login') {
    return navigateTo('/affiliates/login');
  }
});
