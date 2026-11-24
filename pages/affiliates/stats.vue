<script setup lang="ts">
definePageMeta({ middleware: ['affiliate-auth'] })
await navigateTo('/affiliates/dashboard', { redirectCode: 302, replace: true })
</script>

<template><div /></template>
