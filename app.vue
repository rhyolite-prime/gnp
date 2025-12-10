<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PwaInstall v-if="shouldShowPwaInstall" />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { data } = useWebSocket('ws://localhost:5034/notifications', {
  autoReconnect: true,
})

// Example condition: show PwaInstall only when websocket sends `{ showPwa: true }`
const shouldShowPwaInstall = computed(() => {
  try {
    console.log('data ->', data.value);
    return data.value && JSON.parse(data.value as string).hasNewContent === true
  } catch {
    return false
  }
})
</script>