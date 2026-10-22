<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PushOptInBanner />
    <NotificationCenterDrawer />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { usePushNotifications } from '~/composables/usePushNotifications';

const { initRealtimeListenersOnce } = usePushNotifications();

onMounted(() => {
  // Initialize Service Worker (`/sw-push.js`), VAPID push listener, and live `/api/v1/push/stream`
  initRealtimeListenersOnce();

  // Global JS error capture -> OTel + Loki
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      trackError('app.global', error || new Error(String(message)), {
        source: String(source || ''),
        lineno: lineno ?? 0,
        colno: colno ?? 0,
      });
    } catch {
      /* ignore */
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const err =
        event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      trackError('app.unhandled_rejection', err, {});
    } catch {
      /* ignore */
    }
  });
});
</script>
