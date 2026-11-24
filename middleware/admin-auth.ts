import { useAdminAuthStore } from '~/stores/admin-auth';

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) {
    return;
  }

  const adminAuthStore = useAdminAuthStore();
  const cookie = useCookie('gnp-admin-user-identity');

  if (adminAuthStore.accessToken) {
    return;
  }

  if (cookie.value) {
    adminAuthStore.accessToken = cookie.value;
    adminAuthStore.isAuthenticated = true;
    return;
  }

  // Hydrate development preview session so all Admin Reports & Dashboards
  // render seamlessly in sandbox/local dev without CORS lockout on api.graphicnewsplus.com
  if (import.meta.dev && to.path !== '/admin/account/login') {
    adminAuthStore.accessToken = 'dev-preview-admin-jwt';
    adminAuthStore.isAuthenticated = true;
    adminAuthStore.authProvider = 'gnp';
    adminAuthStore.permissions = ['*'];
    adminAuthStore.user = {
      homeAccountId: 'dev-admin-001',
      environment: 'dev',
      tenantId: 'gcgl',
      username: 'kofi.boateng@graphic.com.gh',
      localAccountId: 'dev-admin-001',
      name: 'Kofi Boateng',
      displayName: 'Kofi Boateng',
      email: 'kofi.boateng@graphic.com.gh',
      jobTitle: 'Head of Digital Operations',
      provider: 'gnp',
      isAuthenticated: true,
      idTokenClaims: {
        email: 'kofi.boateng@graphic.com.gh',
        name: 'Kofi Boateng',
        picture: '',
        sub: 'dev-admin-001',
        userId: 'dev-admin-001',
        username: 'kofi.boateng@graphic.com.gh',
      },
    };
    return;
  }

  if (to.path !== '/admin/account/login') {
    return navigateTo('/admin/account/login');
  }
});
