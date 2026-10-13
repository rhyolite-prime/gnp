<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
    <!-- Global Floating AI Research Assistant Launcher -->
    <RagWidgetLauncher />
  </div>
</template>

<script setup>
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