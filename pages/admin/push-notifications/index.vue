<template>
  <div class="p-12 text-center text-sm text-gray-500">
    Redirecting to unified Campaigns &amp; Messaging...
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: [
    'admin-auth',
    () => navigateTo('/admin/campaigns', { replace: true }),
  ],
});
</script>
