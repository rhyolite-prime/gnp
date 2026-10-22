/* eslint-disable no-undef */
/**
 * Graphic NewsPlus — Browser Web Push & Notification Service Worker (`sw-push.js`)
 * Supports:
 * 1. W3C encrypted `push` events (VAPID RFC 8030 / RFC 8291 via `web-push` or C++ `gnp-api`)
 * 2. Foreground/SSE `GNP_SW_SHOW_NOTIFICATION` messages (unlocking OS action buttons & rich imagery)
 * 3. `notificationclick` deep-link routing + action button handling + CTR telemetry tracking
 * 4. `notificationclose` dismissal telemetry tracking
 * 5. `pushsubscriptionchange` automatic token rotation back to `/api/v1/push/subscribe`
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function buildNotificationOptions(payload) {
  const actions = Array.isArray(payload.actions)
    ? payload.actions.slice(0, 2).map((a) => ({
        action: a.action,
        title: a.title,
      }))
    : [
        { action: 'open', title: 'Read Now' },
        { action: 'dismiss', title: 'Dismiss' },
      ];

  return {
    body: payload.body || payload.messageBody || 'New update on Graphic NewsPlus',
    icon: payload.iconUrl || '/pwa-icons/pwa-192x192.png',
    badge: payload.badgeUrl || '/pwa-icons/pwa-64x64.png',
    image: payload.imageUrl || undefined,
    tag: payload.tag || payload.id || payload.notificationId || `gnp-${Date.now()}`,
    renotify: payload.renotify !== false,
    requireInteraction: Boolean(payload.requireInteraction || payload.urgency === 'high'),
    silent: Boolean(payload.silent),
    vibrate: payload.urgency === 'high' ? [200, 100, 200, 100, 300] : [140, 70, 140],
    timestamp: payload.timestamp || Date.now(),
    actions,
    data: {
      id: payload.id || payload.notificationId,
      deepLink: payload.deepLink || '/',
      category: payload.category || 'platform_updates',
      actions: payload.actions || [],
    },
  };
}

function trackPushTelemetry(broadcastId, eventName) {
  if (!broadcastId) return Promise.resolve();
  return fetch('/api/v1/push/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: broadcastId, event: eventName }),
  }).catch(() => {});
}

async function notifyOpenWindows(type, payload) {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  for (const client of windowClients) {
    client.postMessage({ type, payload });
  }
}

// 1. Standard W3C Push Event (Encrypted Web Push Payload)
self.addEventListener('push', (event) => {
  let payload = {
    id: `push-${Date.now()}`,
    title: 'Graphic NewsPlus',
    body: 'New edition & breaking news update available.',
    deepLink: '/newspapers',
    category: 'breaking_news',
    urgency: 'normal',
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  const title = payload.title || payload.subject || 'Graphic NewsPlus';
  const options = buildNotificationOptions(payload);

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      notifyOpenWindows('GNP_PUSH_RECEIVED', payload),
      trackPushTelemetry(payload.id, 'displayed'),
    ])
  );
});

// 2. Direct Service Worker Bridge for Instant OS Notification Rendering
self.addEventListener('message', (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;

  if (msg.type === 'GNP_SW_SHOW_NOTIFICATION' && msg.payload) {
    const p = msg.payload;
    const title = p.title || p.subject || 'Graphic NewsPlus';
    const options = buildNotificationOptions(p);
    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, options),
        trackPushTelemetry(p.id || p.notificationId, 'displayed'),
      ])
    );
  }
});

// 3. Notification Click & Action Button Deep-Link Handler
self.addEventListener('notificationclick', (event) => {
  const data = event.notification.data || {};
  event.notification.close();

  if (event.action === 'dismiss') {
    event.waitUntil(trackPushTelemetry(data.id, 'dismissed'));
    return;
  }

  let targetUrl = data.deepLink || '/';
  if (event.action && Array.isArray(data.actions)) {
    const matchedAction = data.actions.find((a) => a.action === event.action);
    if (matchedAction && matchedAction.url) {
      targetUrl = matchedAction.url;
    }
  }

  event.waitUntil(
    (async () => {
      await trackPushTelemetry(data.id, 'clicked');

      const allClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if ('focus' in client) {
          await client.focus();
          client.postMessage({
            type: 'GNP_PUSH_NAVIGATE',
            url: targetUrl,
            broadcastId: data.id,
          });
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});

// 4. Dismissal Telemetry
self.addEventListener('notificationclose', (event) => {
  const data = event.notification.data || {};
  event.waitUntil(trackPushTelemetry(data.id, 'dismissed'));
});

// 5. Automatic Push Subscription Rotation
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const res = await fetch('/api/v1/push/vapid-public-key');
        const json = await res.json();
        const publicKey = json?.result?.publicKey;
        if (!publicKey) return;

        const padding = '='.repeat((4 - (publicKey.length % 4)) % 4);
        const base64 = (publicKey + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        const applicationServerKey = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          applicationServerKey[i] = rawData.charCodeAt(i);
        }

        const newSub = await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        await fetch('/api/v1/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: newSub.toJSON() }),
        });
      } catch {
        // Ignore background rotation failure when offline
      }
    })()
  );
});
