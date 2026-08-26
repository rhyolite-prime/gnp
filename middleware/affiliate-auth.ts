import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const affiliateAuthStore = useAffiliateAuthStore()
  const cookie = useCookie('gnp-affiliate-user-identity')

  // If we have a token in the store, we're good
  if (affiliateAuthStore.accessToken) {
    return
  }

  // If we have a cookie but no store token, try to restore
  if (cookie.value) {
    // Note: The store's initializeFromStorage handles this on the client-side,
    // but in middleware (which runs on both server and client), we ensure the token is set.
    affiliateAuthStore.accessToken = cookie.value
    // If you have a method to fetch partner info from token, call it here.
    // For now, we'll assume the token presence is enough to allow navigation.
    return
  }

  // If no token and no cookie, redirect to partner login
  // Avoid infinite redirect loop if we're already on the login page
  if (to.path !== '/partners/account/login') {
    return navigateTo('/partners/account/login')
  }
})
