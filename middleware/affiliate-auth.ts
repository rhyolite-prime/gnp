import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

export default defineNuxtRouteMiddleware((to) => {
  const affiliateAuthStore = useAffiliateAuthStore()

  // The store restores the full session (token + profile) from cookies on both
  // server and client, falling back to sessionStorage on the client. Re-run
  // restoration as a safety net for stores created before the cookie existed
  // (e.g. right after login in another tab) — never fabricate a token-only
  // session, which is what previously left the account menu without a name.
  if (!affiliateAuthStore.accessToken) {
    affiliateAuthStore.initializeFromStorage()
  }

  if (affiliateAuthStore.isAuthenticated && affiliateAuthStore.accessToken) {
    return
  }

  // No session: send to login, unless we're already there (avoid a loop).
  if (to.path !== '/affiliates/login') {
    return navigateTo('/affiliates/login')
  }
})
