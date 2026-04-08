<script setup lang="ts">
// This page is replaced by the new login flow in /partners/account/login.vue
definePageMeta({
  middleware: [
    () => navigateTo('/partners/account/login')
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p class="text-white font-bold">Redirecting to login portal...</p>
    </div>
  </div>
</template>
