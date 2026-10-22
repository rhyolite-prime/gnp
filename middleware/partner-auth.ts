import { usePartnerAuthStore } from '~/stores/partner-auth';

export default defineNuxtRouteMiddleware((to) => {
  const partnerAuthStore = usePartnerAuthStore();
  const cookie = useCookie('gnp-partner-user-identity');

  if (partnerAuthStore.accessToken) {
    return;
  }

  if (cookie.value) {
    partnerAuthStore.accessToken = cookie.value;
    partnerAuthStore.isAuthenticated = true;
    return;
  }

  if (import.meta.dev && to.path !== '/partners/account/login') {
    partnerAuthStore.accessToken = 'dev-preview-partner-jwt';
    partnerAuthStore.isAuthenticated = true;
    partnerAuthStore.partner = {
      token: 'dev-preview-partner-jwt',
      id: 'c8f92e10-4b11-4e7a-9b1a-010000000001',
      name: 'MTN Ghana PLC',
      email: 'enterprise-digital@mtn.com.gh',
    } as any;
    return;
  }

  if (to.path !== '/partners/account/login') {
    return navigateTo('/partners/account/login');
  }
});
