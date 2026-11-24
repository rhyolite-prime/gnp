<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
    <AppFooter v-if="!isDiscover" />
    <PwaInstall v-if="!isDiscover" />
    <!-- Global Floating AI Research Assistant Launcher -->
    <RagWidgetLauncher v-if="!isDiscover" />
  </div>
</template>

<script setup>
const route = useRoute()
const isDiscover = computed(() => /^\/discover\/?$/.test(route.path))
// Layout metadata
useHead({
  htmlAttrs: {
    class: 'scroll-smooth'
  },
  bodyAttrs: {
    class: 'bg-gray-50 text-gray-900 font-sans antialiased'
  }
})
</script>