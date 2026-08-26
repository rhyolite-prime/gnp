<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PwaInstall v-if="showPwaInstall" />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { useNotificationStore } from '~/stores/notification'

const showPwaInstall = ref(true);
const notificationStore = useNotificationStore()
const { data } = useWebSocket('ws://localhost:5034/notifications', {
  autoReconnect: true,
  onMessage: (_, event) => {
    try {
      const payload = JSON.parse(event.data)

      console.log('payload=>', payload)

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

 

onMounted(() => {
  // Global JS error capture → OTel + Loki
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      trackError('app.global', error || new Error(String(message)), {
        source: String(source || ''),
        lineno: lineno ?? 0,
        colno: colno ?? 0,
      })
    } catch { /* ignore */ }
    return false // Don't suppress the error
  }

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const err = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
      trackError('app.unhandled_rejection', err, {})
    } catch { /* ignore */ }
  })

  
})
</script>