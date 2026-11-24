# Graphic NewsPlus — Browser Push Notification & Real-Time Update Dispatch Module

> **Live Admin Dispatch Studio:** `/admin/push-notifications`  
> **Service Worker:** [`public/sw-push.js`](../public/sw-push.js) (registered at root `/` + imported into `@vite-pwa/nuxt` Workbox)  
> **Backend Nitro API & Real-Time Stream:** [`server/api/v1/push/[...slug].ts`](../server/api/v1/push/%5B...slug%5D.ts) & [`server/utils/pushDispatchStore.ts`](../server/utils/pushDispatchStore.ts)  
> **Target C++ Backend Integration:** [`https://github.com/rhyolite-prime/gnp-api`](https://github.com/rhyolite-prime/gnp-api) (`controllers/NotificationsHub.{h,cc}` + `controllers/PushNotificationsController.{h,cc}`)

---

## 1. Architecture Overview

The module implements a **dual-transport browser push & update pipeline** so notifications deliver reliably both when the browser tab is closed/backgrounded **and** instantaneously while readers browse Graphic NewsPlus:

1. **Background W3C Web Push (RFC 8030 / RFC 8291 + VAPID ECDSA P-256 via `web-push`)**
   - Generates/loads an ECDSA P-256 VAPID keypair (`NUXT_VAPID_PUBLIC_KEY` / `NUXT_VAPID_PRIVATE_KEY` / `NUXT_VAPID_SUBJECT`).
   - Registers `/sw-push.js` at root scope `/` and subscribes browsers via `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`.
   - Encrypts and delivers payloads to FCM (Chrome/Edge/Android), Mozilla Autopush (Firefox), and Apple Web Push (Safari macOS/iOS), automatically pruning stale `HTTP 404` / `410 Gone` subscriptions.
2. **Real-Time HTTPS-Safe Push Stream (`/api/v1/push/stream`) + Cross-Tab `BroadcastChannel`**
   - Replaces the previous insecure hardcoded `ws://localhost:5034/notifications` WebSocket URL in `app.vue` (which triggered browser Mixed-Content `SecurityError` over HTTPS) with a relative Server-Sent Events stream (`/api/v1/push/stream`), Service Worker `postMessage` bridge, and `BroadcastChannel('gnp-push-bus')`.
   - Respects subscriber **Topic Preferences** (8 categories) and **GMT Quiet Hours** (suppressing non-urgent popups overnight while allowing `high` urgency Breaking News alerts through).

---

## 2. User-Facing & Admin Touchpoints

| Touchpoint | File | Capabilities |
|---|---|---|
| **Admin Push Dispatch Studio** | `pages/admin/push-notifications/index.vue` | 5 one-click newsroom templates, rich headline/body/image/deep-link/action-button composer, real-time **macOS / Windows 11 / Android** notification preview stage, audience segment selector, instant vs scheduled delivery, **Live Browser Test Push**, **3 Apache ECharts v6 charts**, broadcast history, subscribed devices table, and copyable C++/SQL backend specs. |
| **Service Worker Engine** | `public/sw-push.js` | Handles `push`, `message` (`GNP_SW_SHOW_NOTIFICATION`), `notificationclick` (with up to 2 action buttons + existing tab focus & Vue Router navigation), `notificationclose`, and `pushsubscriptionchange` auto-rotation, posting live telemetry (`displayed`, `clicked`, `dismissed`) to `/api/v1/push/track`. |
| **Slide-Over Notification Center** | `components/push/NotificationCenterDrawer.vue` | Accessible from the Bell icon in both `components/AppHeader.vue` (public site) and `layouts/admin.vue` (admin shell). Includes unread inbox, category labels, 1-click Enable/Pause toggle, Test Alert button, 8 topic switches, and GMT Quiet Hours. |
| **Smart Reader Opt-In Banner** | `components/push/PushOptInBanner.vue` | Non-intrusive opt-in card on public pages with 1-click permission activation, topic customization shortcut, and 7-day snooze persistence. |
| **Account Push Preferences Card** | `components/push/SubscriberPushPreferencesCard.vue` | Embedded in `/account` (`pages/account/index.vue`) for per-topic opt-in/out and live browser alert testing. |
| **Rich Foreground Toast** | `components/NotificationToast.vue` | Displays category badges, optional hero banner image, interactive CTA buttons, deep-link routing, and click tracking. |

---

## 3. REST & Streaming API Contract (`/api/v1/push/*`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/push/vapid-public-key` | Returns `{ publicKey, subject }` in `BaseApiResponse<T>` envelope |
| `GET` | `/api/v1/push/stream` | `text/event-stream` real-time push broadcast channel with 20s keepalive heartbeats |
| `GET` | `/api/v1/push/dashboard` | Returns live KPIs, 14-day Apache ECharts series, broadcast log, subscribed endpoints & SQL/C++ blueprints |
| `POST` | `/api/v1/push/subscribe` | Registers or updates a browser `PushSubscription` (`endpoint`, `keys.p256dh`, `keys.auth`, topics, quiet hours) |
| `POST` | `/api/v1/push/preferences` | Updates subscribed topic categories and GMT quiet hours |
| `POST` / `DELETE` | `/api/v1/push/unsubscribe` | Removes a browser push subscription |
| `POST` | `/api/v1/push/dispatch` | Dispatches an instant broadcast or queues a scheduled broadcast |
| `POST` | `/api/v1/push/test` | Sends a live verification notification directly to the current browser |
| `POST` | `/api/v1/push/trigger-scheduled` | Immediately dispatches a queued scheduled notification |
| `POST` | `/api/v1/push/cancel-scheduled` | Cancels a queued scheduled notification |
| `POST` | `/api/v1/push/track` | Records `displayed`, `clicked`, and `dismissed` events and recalculates CTR % |
