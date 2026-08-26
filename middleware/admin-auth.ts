import { useAdminAuthStore } from '~/stores/admin-auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const adminAuthStore = useAdminAuthStore()
  const cookie = useCookie('gnp-admin-user-identity')

  // If we have a token in the store, we're good
  if (adminAuthStore.accessToken) {
    return
  }

  // If we have a cookie but no store token, try to restore
  if (cookie.value) {
    // Note: The store's initializeFromStorage handles this on the client-side,
    // but in middleware (which runs on both server and client), we ensure the token is set.
    adminAuthStore.accessToken = cookie.value
    // If you have a method to fetch partner info from token, call it here.
    // For now, we'll assume the token presence is enough to allow navigation.
    return
  }

  // If no token and no cookie, redirect to partner login
  // Avoid infinite redirect loop if we're already on the login page
  if (to.path !== '/admin/account/login') {
    return navigateTo('/admin/account/login')
  }
})
