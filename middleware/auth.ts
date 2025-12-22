export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const cookie = useCookie('gnp-user-identity')

  // If we have a token in the store, we're good
  if (authStore.accessToken) {
    return
  }

  // If we have a cookie but no store token, try to restore
  if (cookie.value) {
    authStore.setAccessToken(cookie.value)
    return
  }

  // If no token and no cookie, redirect to login
  // Avoid infinite redirect loop if we're already on the login page
  if (to.path !== '/admin/account/login') {
    return navigateTo('/admin/account/login')
  }
})
