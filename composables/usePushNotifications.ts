import { storeToRefs } from 'pinia';
import { useNotificationStore } from '~/stores/notification';
import {
  fetchVapidPublicKey,
  registerPushSubscriptionOnServer,
  savePushPreferencesOnServer,
  sendTestPushApi,
  trackPushInteractionApi,
  unregisterPushSubscriptionOnServer,
  urlBase64ToUint8Array,
} from '~/services/pushNotifications';
import type { DispatchPushRequestDto, PushTopicCategory } from '~/models';

let singletonInitialized = false;
let sharedSwRegistration: ServiceWorkerRegistration | null = null;
let sharedEventSource: EventSource | null = null;
let sharedBroadcastChannel: BroadcastChannel | null = null;

export function usePushNotifications() {
  const store = useNotificationStore();
  const router = useRouter();
  const {
    inbox,
    unreadCount,
    isCenterOpen,
    permissionState,
    isSubscribed,
    isSimulatedSubscription,
    swReady,
    sseConnected,
    activeEndpoint,
    subscribedTopics,
    quietHours,
  } = storeToRefs(store);

  const isSubscribing = ref(false);
  const statusBannerMessage = ref('');

  function refreshPermissionState() {
    if (!import.meta.client) return;
    if (!('Notification' in window)) {
      permissionState.value = 'unsupported';
      return;
    }
    permissionState.value = Notification.permission;
  }

  async function cleanupConflictingRootServiceWorkers() {
    if (!import.meta.client || !('serviceWorker' in navigator)) return;
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        const scriptUrl =
          r.active?.scriptURL || r.waiting?.scriptURL || r.installing?.scriptURL || '';
        const scopePath = new URL(r.scope).pathname;
        // Remove stale dev-sw.js or previous root-scoped sw-push.js registrations
        // that fought over scope '/' and triggered controllerchange reload loops.
        if (
          scriptUrl.includes('dev-sw.js') ||
          (scriptUrl.endsWith('/sw-push.js') && scopePath === '/')
        ) {
          await r.unregister().catch(() => {});
        }
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  async function ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!import.meta.client || !('serviceWorker' in navigator)) return null;
    if (sharedSwRegistration) {
      swReady.value = true;
      return sharedSwRegistration;
    }
    try {
      await cleanupConflictingRootServiceWorkers();
      // Register on dedicated sub-scope '/sw-push-scope/' so it NEVER collides
      // with root '/' navigation or triggers controllerchange reloads.
      const reg = await navigator.serviceWorker.register('/sw-push.js', {
        scope: '/sw-push-scope/',
      });
      sharedSwRegistration = reg;
      swReady.value = true;
      return reg;
    } catch {
      swReady.value = false;
      return null;
    }
  }

  async function showNativeBrowserNotification(payload: any) {
    if (!import.meta.client || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (store.isWithinQuietHours() && payload?.urgency !== 'high') return;

    const reg = await ensureServiceWorker();
    if (reg?.active) {
      reg.active.postMessage({
        type: 'GNP_SW_SHOW_NOTIFICATION',
        payload,
      });
      return;
    }

    try {
      const n = new Notification(payload.title || payload.subject || 'Graphic NewsPlus', {
        body: payload.body || payload.messageBody || '',
        icon: payload.iconUrl || '/pwa-icons/pwa-192x192.png',
        tag: payload.tag || payload.id || payload.notificationId,
      });
      n.onclick = () => {
        window.focus();
        if (payload.deepLink) {
          router.push(payload.deepLink);
        }
        if (payload.id || payload.notificationId) {
          trackPushInteractionApi(payload.id || payload.notificationId, 'clicked');
        }
        n.close();
      };
    } catch {
      // Ignore environments blocking direct Notification constructor
    }
  }

  const CLIENT_CATEGORY_ALIAS: Record<string, PushTopicCategory> = {
    weekend_digest: 'morning_edition',
    subscription: 'subscriptions_billing',
    promo_offer: 'promotions_offers',
    system: 'platform_updates',
  };

  function handleIncomingPayload(payload: any, fromSwPushEvent = false) {
    if (!payload) return;
    const rawCat = String(payload.category || 'platform_updates');
    const category = (CLIENT_CATEGORY_ALIAS[rawCat] || rawCat) as PushTopicCategory;

    // Filter out unsubscribed topics unless user hasn't configured topics yet
    if (
      store.isSubscribed &&
      store.subscribedTopics.length > 0 &&
      !store.subscribedTopics.includes(category)
    ) {
      return;
    }

    store.addNotification(payload, { showToast: true });

    const alreadyDeliveredBySwWebPush =
      Array.isArray(payload.deliveredWebPushEndpoints) &&
      Boolean(store.activeEndpoint) &&
      payload.deliveredWebPushEndpoints.includes(store.activeEndpoint);

    // Trigger genuine OS notification over SSE/BroadcastChannel ONLY if Web Push didn't already display it
    if (!fromSwPushEvent && !alreadyDeliveredBySwWebPush && store.isSubscribed) {
      showNativeBrowserNotification(payload);
    }
  }

  function initRealtimeListenersOnce() {
    if (!import.meta.client || singletonInitialized) return;
    singletonInitialized = true;

    store.hydrateFromLocalStorage();
    refreshPermissionState();
    ensureServiceWorker();

    // 1. Service Worker postMessage bridge (Web Push arrival + notification click routing)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const msg = event.data;
        if (!msg || typeof msg !== 'object') return;
        if (msg.type === 'GNP_PUSH_RECEIVED' && msg.payload) {
          handleIncomingPayload(msg.payload, true);
        } else if (msg.type === 'GNP_PUSH_NAVIGATE' && msg.url) {
          if (msg.broadcastId) {
            store.markAsRead(msg.broadcastId);
          }
          router.push(msg.url);
        }
      });
    }

    // 2. Cross-tab BroadcastChannel sync
    if ('BroadcastChannel' in window) {
      sharedBroadcastChannel = new BroadcastChannel('gnp-push-bus');
      sharedBroadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'LOCAL_PUSH_PREVIEW') {
          handleIncomingPayload(event.data.payload, false);
        }
      };
    }

    // 3. Relative HTTPS-safe Server-Sent Events stream (`/api/v1/push/stream`)
    if ('EventSource' in window) {
      const connectSse = () => {
        try {
          sharedEventSource?.close();
          const es = new EventSource('/api/v1/push/stream');
          sharedEventSource = es;

          es.addEventListener('connected', () => {
            sseConnected.value = true;
          });

          es.addEventListener('push-notification', (ev: MessageEvent) => {
            try {
              const parsed = JSON.parse(ev.data);
              handleIncomingPayload(parsed, false);
            } catch {
              // Ignore malformed frame
            }
          });

          es.onerror = () => {
            sseConnected.value = false;
          };
        } catch {
          sseConnected.value = false;
        }
      };
      connectSse();
    }
  }

  /**
   * Requests browser notification permission, registers W3C PushManager subscription
   * using server VAPID public key, and gracefully falls back to Live Stream Subscription
   * when running inside a cross-origin preview iframe that restricts OS permission dialogs.
   */
  async function enableBrowserPush(): Promise<{ ok: boolean; message: string }> {
    if (!import.meta.client) return { ok: false, message: 'Client-only action.' };
    isSubscribing.value = true;

    try {
      let granted = false;
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          granted = true;
        } else if (Notification.permission !== 'denied') {
          try {
            const result = await Notification.requestPermission();
            permissionState.value = result;
            granted = result === 'granted';
          } catch {
            refreshPermissionState();
          }
        }
      }

      const reg = await ensureServiceWorker();
      let realPushJson: PushSubscriptionJSON | null = null;

      if (granted && reg && 'pushManager' in reg) {
        try {
          const existingSub = await reg.pushManager.getSubscription();
          if (existingSub) {
            realPushJson = existingSub.toJSON();
          } else {
            const { publicKey } = await fetchVapidPublicKey();
            const created = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
            });
            realPushJson = created.toJSON();
          }
        } catch {
          // Falls back cleanly to live SSE/SW stream subscription below
        }
      }

      const savedRecord = await registerPushSubscriptionOnServer({
        subscription: realPushJson,
        deviceId: getOrCreateDeviceId(),
        topics: subscribedTopics.value,
        quietHours: quietHours.value,
        isSimulated: !realPushJson,
      });

      isSubscribed.value = true;
      isSimulatedSubscription.value = Boolean(savedRecord.isSimulated);
      activeEndpoint.value = savedRecord.endpoint;
      store.persistState();

      const msg = realPushJson
        ? 'Native Browser Web Push enabled (VAPID encrypted + Service Worker active)!'
        : granted
        ? 'Browser Push enabled via Service Worker + Real-Time Stream!'
        : 'Real-Time Push Stream active! (Grant OS browser permission anytime for desktop popups.)';

      statusBannerMessage.value = msg;
      return { ok: true, message: msg };
    } finally {
      isSubscribing.value = false;
    }
  }

  async function disableBrowserPush() {
    if (!import.meta.client) return;
    isSubscribing.value = true;
    try {
      const reg = await ensureServiceWorker();
      if (reg && 'pushManager' in reg) {
        const sub = await reg.pushManager.getSubscription().catch(() => null);
        if (sub) {
          await sub.unsubscribe().catch(() => {});
        }
      }
      if (activeEndpoint.value) {
        await unregisterPushSubscriptionOnServer(activeEndpoint.value);
      }
      isSubscribed.value = false;
      activeEndpoint.value = '';
      store.persistState();
      statusBannerMessage.value = 'Browser push notifications paused on this device.';
    } finally {
      isSubscribing.value = false;
    }
  }

  async function toggleTopicPreference(topic: PushTopicCategory) {
    const current = new Set(subscribedTopics.value);
    if (current.has(topic)) {
      current.delete(topic);
    } else {
      current.add(topic);
    }
    subscribedTopics.value = Array.from(current);
    store.persistState();

    await savePushPreferencesOnServer({
      endpoint: activeEndpoint.value || undefined,
      topics: subscribedTopics.value,
      quietHours: quietHours.value,
    }).catch(() => {});
  }

  async function updateQuietHours() {
    store.persistState();
    await savePushPreferencesOnServer({
      endpoint: activeEndpoint.value || undefined,
      topics: subscribedTopics.value,
      quietHours: quietHours.value,
    }).catch(() => {});
  }

  async function triggerLiveTestNotification(custom?: Partial<DispatchPushRequestDto>) {
    if (!isSubscribed.value) {
      await enableBrowserPush();
    }
    return sendTestPushApi({
      ...custom,
      endpoint: activeEndpoint.value || undefined,
    });
  }

  return {
    inbox,
    unreadCount,
    isCenterOpen,
    permissionState,
    isSubscribed,
    isSimulatedSubscription,
    isSubscribing,
    swReady,
    sseConnected,
    activeEndpoint,
    subscribedTopics,
    quietHours,
    statusBannerMessage,
    initRealtimeListenersOnce,
    enableBrowserPush,
    disableBrowserPush,
    enablePushNotifications: enableBrowserPush,
    disablePushNotifications: disableBrowserPush,
    toggleTopicPreference,
    updateQuietHours,
    triggerLiveTestNotification,
    sendLiveBrowserTestPush: triggerLiveTestNotification,
    markAsRead: store.markAsRead,
    clearUnreadCount: store.clearUnreadCount,
    clearInbox: store.clearInbox,
  };
}

function getOrCreateDeviceId(): string {
  if (!import.meta.client) return 'server';
  const key = 'gnp_browser_device_id';
  let existing = localStorage.getItem(key);
  if (!existing) {
    existing = `dev-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    localStorage.setItem(key, existing);
  }
  return existing;
}
