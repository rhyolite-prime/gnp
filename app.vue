<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PwaInstall v-if="shouldShowPwaInstall" />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
const { data } = useWebSocket('ws://localhost:5034/notifications', {
  autoReconnect: true,
  onMessage: (_, event) => {
    try {
      const payload = JSON.parse(event.data)
      // Check if it's a notification payload
      if (payload.subject && payload.messageBody && payload.notificationId) {
        notificationStore.addNotification(payload)
      }
    } catch (e) {
      // Ignore parse errors, might be other msg types
    }
  }
})

// Example condition: show PwaInstall only when websocket sends `{ showPwa: true }`
const shouldShowPwaInstall = computed(() => {
  try {
    return data.value && JSON.parse(data.value as string).hasNewContent === true
  } catch {
    return false
  }
})
</script>