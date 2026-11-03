import fs from 'node:fs';
import path from 'node:path';
import webpush from 'web-push';
import type {
  BrowserPushSubscriptionRecord,
  DispatchPushRequestDto,
  PushBroadcastRecord,
  PushDashboardPayload,
  PushTopicCategory,
} from '~/models/pushNotifications';
import dayjs from 'dayjs';

const PERSIST_FILE_PATH = path.resolve(process.cwd(), '.data', 'push-hub-state.json');

const CATEGORY_ALIAS_MAP: Record<string, PushTopicCategory> = {
  weekend_digest: 'morning_edition',
  subscription: 'subscriptions_billing',
  promo_offer: 'promotions_offers',
  system: 'platform_updates',
};

export function normalizePushTopic(category?: string): PushTopicCategory {
  if (!category) return 'platform_updates';
  if (category in CATEGORY_ALIAS_MAP) {
    return CATEGORY_ALIAS_MAP[category];
  }
  return category as PushTopicCategory;
}

function readPersistedPushState(): {
  vapidKeys?: { publicKey: string; privateKey: string; subject: string };
  subscriptions?: BrowserPushSubscriptionRecord[];
} | null {
  try {
    if (!fs.existsSync(PERSIST_FILE_PATH)) return null;
    return JSON.parse(fs.readFileSync(PERSIST_FILE_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

export function persistPushHubState(hub: GlobalPushHubState) {
  try {
    const dir = path.dirname(PERSIST_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      PERSIST_FILE_PATH,
      JSON.stringify(
        {
          vapidKeys: hub.vapidKeys,
          subscriptions: Array.from(hub.subscriptions.values()),
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch {
    // Ignore read-only filesystem environments
  }
}

interface SseClient {
  id: string;
  send: (event: string, data: any) => void;
}

interface GlobalPushHubState {
  vapidKeys: {
    publicKey: string;
    privateKey: string;
    subject: string;
  };
  subscriptions: Map<string, BrowserPushSubscriptionRecord>;
  broadcasts: PushBroadcastRecord[];
  sseClients: Map<string, SseClient>;
}

const ALL_TOPICS: PushTopicCategory[] = [
  'breaking_news',
  'morning_edition',
  'subscriptions_billing',
  'originals_multimedia',
  'archives_research',
  'games_daily',
  'promotions_offers',
  'platform_updates',
];

function createInitialSeedState(): GlobalPushHubState {
  const persisted = readPersistedPushState();
  const generated = persisted?.vapidKeys || webpush.generateVAPIDKeys();
  const publicKey = process.env.NUXT_VAPID_PUBLIC_KEY || generated.publicKey;
  const privateKey = process.env.NUXT_VAPID_PRIVATE_KEY || generated.privateKey;
  const subject =
    process.env.NUXT_VAPID_SUBJECT ||
    (generated as any).subject ||
    'mailto:digital-alerts@graphic.com.gh';

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const seedSubs: BrowserPushSubscriptionRecord[] = [
    {
      id: 'sub-gh-accra-001',
      endpoint: 'https://fcm.googleapis.com/fcm/send/gnp-seed-chrome-accra-9012a',
      keys: { p256dh: 'BSeedKeyAccraChrome001P256dh', auth: 'SeedAuth001' },
      browserName: 'Chrome 131',
      osName: 'Android 15',
      userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 8)',
      userLabel: 'Kwame Mensah (Accra)',
      segment: 'paid_active',
      topics: ALL_TOPICS,
      quietHours: { enabled: true, start: '22:30', end: '05:30' },
      isSimulated: true,
      createdAt: '2026-10-04T07:20:00Z',
      lastSeenAt: '2026-10-22T06:45:00Z',
    },
    {
      id: 'sub-gh-kumasi-002',
      endpoint: 'https://fcm.googleapis.com/fcm/send/gnp-seed-edge-mtn-4410b',
      keys: { p256dh: 'BSeedKeyKumasiEdge002P256dh', auth: 'SeedAuth002' },
      browserName: 'Edge 131',
      osName: 'Windows 11',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/131.0',
      userLabel: 'Akosua Boateng — GCB Corporate Seat',
      segment: 'corporate_b2b',
      topics: ['breaking_news', 'morning_edition', 'subscriptions_billing', 'platform_updates'],
      quietHours: { enabled: false, start: '22:00', end: '06:00' },
      isSimulated: true,
      createdAt: '2026-10-08T09:10:00Z',
      lastSeenAt: '2026-10-22T08:12:00Z',
    },
    {
      id: 'sub-uk-london-003',
      endpoint: 'https://web.push.apple.com/QSeedSafariMacOSLondon7821c',
      keys: { p256dh: 'BSeedKeyLondonSafari003P256dh', auth: 'SeedAuth003' },
      browserName: 'Safari 18',
      osName: 'iOS 18.1',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)',
      userLabel: 'Nana Ofori (London Diaspora)',
      segment: 'diaspora',
      topics: ['breaking_news', 'morning_edition', 'originals_multimedia', 'archives_research'],
      quietHours: { enabled: true, start: '23:00', end: '06:30' },
      isSimulated: true,
      createdAt: '2026-10-11T14:35:00Z',
      lastSeenAt: '2026-10-22T07:55:00Z',
    },
    {
      id: 'sub-gh-legon-004',
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gnp-seed-firefox-legon-3391d',
      keys: { p256dh: 'BSeedKeyLegonFirefox004P256dh', auth: 'SeedAuth004' },
      browserName: 'Firefox 132',
      osName: 'macOS Sequoia',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:132.0)',
      userLabel: 'Prof. Ama Nyarko (UG Legon)',
      segment: 'corporate_b2b',
      topics: ['morning_edition', 'archives_research', 'platform_updates'],
      quietHours: { enabled: false, start: '22:00', end: '06:00' },
      isSimulated: true,
      createdAt: '2026-10-14T11:05:00Z',
      lastSeenAt: '2026-10-22T09:02:00Z',
    },
  ];

  const subscriptions = new Map<string, BrowserPushSubscriptionRecord>();
  for (const s of seedSubs) {
    subscriptions.set(s.endpoint, s);
  }
  if (Array.isArray(persisted?.subscriptions)) {
    for (const saved of persisted.subscriptions) {
      if (saved?.endpoint) {
        subscriptions.set(saved.endpoint, saved);
      }
    }
  }

  const broadcasts: PushBroadcastRecord[] = [
    {
      id: 'BCAST-20261022-01',
      title: 'BREAKING: Bank of Ghana Holds Policy Rate Steady Following Inflation Review',
      body: 'Read Graphic Business’ full breakdown of MPC monetary policy implications for SMEs, Treasury bills, and the Cedi.',
      category: 'breaking_news',
      urgency: 'high',
      deepLink: '/newspapers',
      tag: 'breaking-bog-mpc',
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Read Full Analysis', url: '/newspapers' },
        { action: 'archives', title: 'MPC Archive Context', url: '/archives' },
      ],
      targetSegment: 'all_subscribers',
      status: 'SENT',
      targetedDevices: 14820,
      realWebPushDelivered: 14510,
      sseLiveDelivered: 642,
      deliveredCount: 14510,
      displayedCount: 13890,
      clickedCount: 2694,
      dismissedCount: 1840,
      failedCount: 310,
      ctrPercent: 18.6,
      ttlSeconds: 14400,
      createdBy: 'Newsroom Desk (Kofi Boateng)',
      createdAt: '2026-10-22T08:30:00Z',
      sentAt: '2026-10-22T08:30:04Z',
    },
    {
      id: 'BCAST-20261022-02',
      title: 'Thursday’s Daily Graphic Digital Edition (48 Pages) Is Ready',
      body: 'Flip through today’s front page, Parliament coverage, regional reports, and today’s newsroom Crossword.',
      category: 'morning_edition',
      urgency: 'normal',
      deepLink: '/newspapers',
      tag: 'daily-graphic-2026-10-22',
      requireInteraction: false,
      actions: [
        { action: 'open', title: 'Open Today’s Paper', url: '/newspapers' },
        { action: 'games', title: 'Play Daily Crossword', url: '/games' },
      ],
      targetSegment: 'paid_active',
      status: 'SENT',
      targetedDevices: 11240,
      realWebPushDelivered: 11065,
      sseLiveDelivered: 418,
      deliveredCount: 11065,
      displayedCount: 10540,
      clickedCount: 2456,
      dismissedCount: 1290,
      failedCount: 175,
      ctrPercent: 22.2,
      ttlSeconds: 43200,
      createdBy: 'Automated Morning Scheduler (05:30 GMT)',
      createdAt: '2026-10-22T05:30:00Z',
      sentAt: '2026-10-22T05:30:09Z',
    },
    {
      id: 'BCAST-20261021-03',
      title: 'Platform Update: Offline Edition Caching & Instant Archive Citations Live',
      body: 'Download full PDFs for offline flight reading and export APA/MLA citations directly from 1950–2026 archives.',
      category: 'platform_updates',
      urgency: 'normal',
      deepLink: '/archives',
      tag: 'platform-update-oct-2026',
      requireInteraction: false,
      actions: [{ action: 'open', title: 'Explore Archives', url: '/archives' }],
      targetSegment: 'all_subscribers',
      status: 'SENT',
      targetedDevices: 14690,
      realWebPushDelivered: 14320,
      sseLiveDelivered: 510,
      deliveredCount: 14320,
      displayedCount: 13410,
      clickedCount: 1689,
      dismissedCount: 2110,
      failedCount: 370,
      ctrPercent: 11.8,
      ttlSeconds: 86400,
      createdBy: 'Product Engineering',
      createdAt: '2026-10-21T13:00:00Z',
      sentAt: '2026-10-21T13:00:06Z',
    },
    {
      id: 'BCAST-20261023-SCHED',
      title: 'Friday Weekend Mirror & Showbiz Early-Access Preview',
      body: 'Get first access to tomorrow’s weekend lifestyle stories, interviews, and weekend sports fixtures.',
      category: 'morning_edition',
      urgency: 'normal',
      deepLink: '/newspapers',
      tag: 'mirror-weekend-drop',
      requireInteraction: false,
      actions: [{ action: 'open', title: 'Preview Weekend Issue', url: '/newspapers' }],
      targetSegment: 'all_subscribers',
      status: 'SCHEDULED',
      targetedDevices: 14890,
      realWebPushDelivered: 0,
      sseLiveDelivered: 0,
      deliveredCount: 0,
      displayedCount: 0,
      clickedCount: 0,
      dismissedCount: 0,
      failedCount: 0,
      ctrPercent: 0,
      ttlSeconds: 43200,
      createdBy: 'Weekend Editorial Desk',
      createdAt: '2026-10-22T10:15:00Z',
      scheduledAt: '2026-10-23T05:30:00Z',
    },
  ];

  return {
    vapidKeys: { publicKey, privateKey, subject },
    subscriptions,
    broadcasts,
    sseClients: new Map(),
  };
}

export function getPushHub(): GlobalPushHubState {
  const g = globalThis as any;
  if (!g.__gnpPushHub) {
    g.__gnpPushHub = createInitialSeedState();
    persistPushHubState(g.__gnpPushHub);
  }
  return g.__gnpPushHub as GlobalPushHubState;
}

export function detectBrowserAndOs(ua = ''): { browserName: string; osName: string } {
  const browserName = ua.includes('Edg/')
    ? 'Edge'
    : ua.includes('Firefox/')
    ? 'Firefox'
    : ua.includes('Chrome/')
    ? 'Chrome'
    : ua.includes('Safari/')
    ? 'Safari'
    : 'Web Browser';

  const osName = ua.includes('Android')
    ? 'Android'
    : ua.includes('iPhone') || ua.includes('iPad')
    ? 'iOS'
    : ua.includes('Mac OS X')
    ? 'macOS'
    : ua.includes('Windows')
    ? 'Windows'
    : ua.includes('Linux')
    ? 'Linux'
    : 'Desktop';

  return { browserName, osName };
}

export async function executeBroadcastDispatch(
  dto: DispatchPushRequestDto,
  options: { targetEndpointOnly?: string } = {}
): Promise<PushBroadcastRecord> {
  const hub = getPushHub();
  const nowIso = new Date().toISOString();
  const id = `BCAST-${dayjs().format('YYYYMMDD-HHmmss')}-${Math.floor(100 + Math.random() * 900)}`;

  if (dto.scheduleMode === 'scheduled' && !options.targetEndpointOnly) {
    const scheduledRecord: PushBroadcastRecord = {
      id,
      title: dto.title,
      body: dto.body,
      category: dto.category,
      urgency: dto.urgency || 'normal',
      deepLink: dto.deepLink || '/',
      imageUrl: dto.imageUrl,
      iconUrl: dto.iconUrl,
      tag: dto.tag || id,
      requireInteraction: Boolean(dto.requireInteraction || dto.urgency === 'high'),
      actions: dto.actions?.length
        ? dto.actions
        : [{ action: 'open', title: 'Read on NewsPlus', url: dto.deepLink || '/' }],
      targetSegment: dto.targetSegment || 'all_subscribers',
      status: 'SCHEDULED',
      targetedDevices: estimateSegmentReach(dto.targetSegment),
      realWebPushDelivered: 0,
      sseLiveDelivered: 0,
      deliveredCount: 0,
      displayedCount: 0,
      clickedCount: 0,
      dismissedCount: 0,
      failedCount: 0,
      ctrPercent: 0,
      ttlSeconds: dto.ttlSeconds || 43200,
      createdBy: dto.createdBy || 'Admin Console',
      createdAt: nowIso,
      scheduledAt: dto.scheduledAt || dayjs().add(2, 'hour').toISOString(),
    };
    hub.broadcasts.unshift(scheduledRecord);
    return scheduledRecord;
  }

  const normalizedCategory = normalizePushTopic(dto.category);

  const wirePayload = {
    id,
    notificationId: id,
    title: dto.title,
    subject: dto.title,
    body: dto.body,
    messageBody: dto.body,
    category: normalizedCategory,
    urgency: dto.urgency || 'normal',
    deepLink: dto.deepLink || '/',
    imageUrl: dto.imageUrl || '',
    iconUrl: dto.iconUrl || '/pwa-icons/pwa-192x192.png',
    badgeUrl: dto.badgeUrl || '/pwa-icons/pwa-64x64.png',
    tag: dto.tag || id,
    requireInteraction: Boolean(dto.requireInteraction || dto.urgency === 'high'),
    silent: Boolean(dto.silent),
    actions: dto.actions?.length
      ? dto.actions
      : [{ action: 'open', title: 'Read Now', url: dto.deepLink || '/' }],
    timestamp: Date.now(),
  };

  let realDelivered = 0;
  let failedCount = 0;
  let prunedAny = false;
  const deliveredWebPushEndpoints: string[] = [];

  const candidates = Array.from(hub.subscriptions.values()).filter((sub) => {
    if (options.targetEndpointOnly) {
      return sub.endpoint === options.targetEndpointOnly;
    }
    if (sub.topics?.length && !sub.topics.includes(normalizedCategory)) return false;
    if (dto.targetSegment !== 'all_subscribers' && sub.segment !== dto.targetSegment) {
      // Always deliver live dispatches to real interactive browser sessions in dev/demo
      if (sub.isSimulated) return false;
    }
    return true;
  });

  // 1. Deliver genuine RFC 8291 Web Push payloads to real browser PushSubscription endpoints
  //    (Wakes up `/sw-push.js` even when all Graphic NewsPlus tabs are completely closed)
  await Promise.all(
    candidates
      .filter((s) => !s.isSimulated && s.endpoint.startsWith('https://'))
      .map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            JSON.stringify(wirePayload),
            {
              TTL: dto.ttlSeconds || 43200,
              urgency: dto.urgency === 'high' ? 'high' : dto.urgency === 'low' ? 'low' : 'normal',
            }
          );
          realDelivered++;
          deliveredWebPushEndpoints.push(sub.endpoint);
        } catch (err: any) {
          failedCount++;
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            hub.subscriptions.delete(sub.endpoint);
            prunedAny = true;
          }
        }
      })
  );

  if (prunedAny) {
    persistPushHubState(hub);
  }

  // 2. Simultaneously broadcast over live SSE stream to every open browser tab
  let sseDelivered = 0;
  const ssePayload = {
    ...wirePayload,
    deliveredWebPushEndpoints,
  };
  for (const [, client] of hub.sseClients) {
    try {
      client.send('push-notification', ssePayload);
      sseDelivered++;
    } catch {
      // Stale stream cleaned on close
    }
  }

  const baseAudience = options.targetEndpointOnly ? 1 : estimateSegmentReach(dto.targetSegment);
  const deliveredCount = options.targetEndpointOnly
    ? Math.max(1, realDelivered + sseDelivered)
    : baseAudience + realDelivered;

  const record: PushBroadcastRecord = {
    id,
    title: dto.title,
    body: dto.body,
    category: dto.category,
    urgency: dto.urgency || 'normal',
    deepLink: dto.deepLink || '/',
    imageUrl: dto.imageUrl,
    iconUrl: dto.iconUrl,
    tag: wirePayload.tag,
    requireInteraction: wirePayload.requireInteraction,
    actions: wirePayload.actions,
    targetSegment: dto.targetSegment || 'all_subscribers',
    status: 'SENT',
    targetedDevices: deliveredCount + failedCount,
    realWebPushDelivered: realDelivered,
    sseLiveDelivered: sseDelivered,
    deliveredCount,
    displayedCount: options.targetEndpointOnly ? 1 : Math.round(deliveredCount * 0.94),
    clickedCount: options.targetEndpointOnly ? 0 : Math.round(deliveredCount * 0.165),
    dismissedCount: 0,
    failedCount,
    ctrPercent: options.targetEndpointOnly ? 0 : 16.5,
    ttlSeconds: dto.ttlSeconds || 43200,
    createdBy: options.targetEndpointOnly
      ? 'Live Device Test'
      : dto.createdBy || 'Newsroom & Platform Admin',
    createdAt: nowIso,
    sentAt: nowIso,
  };

  hub.broadcasts.unshift(record);
  return record;
}

export function estimateSegmentReach(segment: string): number {
  switch (segment) {
    case 'paid_active':
      return 11240;
    case 'free_readers':
      return 3580;
    case 'corporate_b2b':
      return 4315;
    case 'ghana_local':
      return 11190;
    case 'diaspora':
      return 3630;
    default:
      return 14820;
  }
}

export function buildPushDashboardPayload(): PushDashboardPayload {
  const hub = getPushHub();
  const sentList = hub.broadcasts.filter((b) => b.status === 'SENT');
  const scheduledList = hub.broadcasts.filter((b) => b.status === 'SCHEDULED');

  const avgCtr = sentList.length
    ? +(sentList.reduce((acc, b) => acc + b.ctrPercent, 0) / sentList.length).toFixed(1)
    : 17.4;

  const days = Array.from({ length: 14 }, (_, idx) =>
    dayjs('2026-10-22').subtract(13 - idx, 'day').format('DD MMM')
  );

  return {
    vapidPublicKey: hub.vapidKeys.publicKey,
    vapidSubject: hub.vapidKeys.subject,
    summary: {
      activeBrowserSubscriptions: 14820 + Math.max(0, hub.subscriptions.size - 4),
      liveConnectedClients: hub.sseClients.size,
      totalBroadcastsSent: sentList.length + 38,
      scheduledQueueCount: scheduledList.length,
      avgDeliveryRatePct: 98.1,
      avgCtrPct: avgCtr,
      optInRatePct: 42.6,
    },
    charts: {
      days,
      dailyDelivered: [24100, 26800, 25400, 28900, 31200, 19800, 18400, 27600, 29400, 32100, 30800, 34900, 26300, 31800],
      dailyClicked: [4120, 4890, 4510, 5420, 6180, 3490, 3180, 5090, 5580, 6240, 5890, 6910, 4780, 6080],
      dailyNewOptIns: [94, 112, 105, 138, 156, 82, 76, 124, 131, 149, 142, 178, 118, 164],
      categoryPerformance: [
        { category: 'morning_edition', label: 'Morning Edition Ready (05:30 GMT)', sent: 14, ctrPct: 22.4 },
        { category: 'breaking_news', label: 'Breaking News Alerts', sent: 19, ctrPct: 19.8 },
        { category: 'subscriptions_billing', label: 'Renewal & Billing Reminders', sent: 8, ctrPct: 16.9 },
        { category: 'games_daily', label: 'Daily Crossword & Sudoku Nudge', sent: 10, ctrPct: 15.2 },
        { category: 'platform_updates', label: 'Platform & Archive Updates', sent: 5, ctrPct: 12.1 },
        { category: 'promotions_offers', label: 'Promo & Bundle Offers', sent: 6, ctrPct: 9.7 },
      ],
      platformBreakdown: [
        { name: 'Chrome on Android (Ghana Mobile)', value: 6840 },
        { name: 'Chrome on Windows / macOS', value: 3920 },
        { name: 'Safari on iOS / macOS (Web Push)', value: 2190 },
        { name: 'Microsoft Edge Corporate Desktop', value: 1280 },
        { name: 'Mozilla Firefox Desktop', value: 590 },
      ],
    },
    recentBroadcasts: hub.broadcasts,
    subscriptions: Array.from(hub.subscriptions.values()),
    backendBlueprint: {
      endpoints: [
        { method: 'GET', path: '/api/v1/push/vapid-public-key', description: 'Returns VAPID ECDSA P-256 public key for `pushManager.subscribe()`' },
        { method: 'POST', path: '/api/v1/push/subscribe', description: 'Upserts W3C browser `endpoint`, `p256dh`, `auth`, device UA & topic preferences' },
        { method: 'POST', path: '/api/v1/push/preferences', description: 'Updates per-subscriber topic subscriptions and GMT quiet hours' },
        { method: 'DELETE', path: '/api/v1/push/unsubscribe', description: 'Deactivates browser push endpoint on opt-out or HTTP 410 Gone' },
        { method: 'POST', path: '/api/v1/push/dispatch', description: 'Encrypts RFC 8291 Web Push payload + broadcasts over `NotificationsHub` WebSocket/SSE' },
        { method: 'POST', path: '/api/v1/push/track', description: 'Records `displayed`, `clicked`, and `dismissed` events from `sw-push.js`' },
      ],
      sqlDdl: `CREATE TABLE IF NOT EXISTS public.web_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh_key VARCHAR(255) NOT NULL,
    auth_secret VARCHAR(128) NOT NULL,
    browser_name VARCHAR(64),
    os_name VARCHAR(64),
    user_agent TEXT,
    segment VARCHAR(40) NOT NULL DEFAULT 'all_subscribers',
    subscribed_topics JSONB NOT NULL DEFAULT '["breaking_news","morning_edition","platform_updates"]'::jsonb,
    quiet_hours JSONB NOT NULL DEFAULT '{"enabled":false,"start":"22:00","end":"05:30"}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.push_broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(40) NOT NULL,
    urgency VARCHAR(16) NOT NULL DEFAULT 'normal',
    deep_link VARCHAR(512) NOT NULL DEFAULT '/',
    image_url VARCHAR(512),
    actions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_segment VARCHAR(40) NOT NULL DEFAULT 'all_subscribers',
    status VARCHAR(20) NOT NULL DEFAULT 'SENT',
    targeted_devices INTEGER NOT NULL DEFAULT 0,
    delivered_count INTEGER NOT NULL DEFAULT 0,
    displayed_count INTEGER NOT NULL DEFAULT 0,
    clicked_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    ttl_seconds INTEGER NOT NULL DEFAULT 43200,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_push_subs_active_segment
    ON public.web_push_subscriptions (is_active, segment);`,
      cppControllerHeader: `#pragma once
#include <drogon/HttpController.h>

namespace gnp::controllers {
class PushNotificationsController : public drogon::HttpController<PushNotificationsController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(PushNotificationsController::getVapidPublicKey, "/api/v1/push/vapid-public-key", drogon::Get);
    ADD_METHOD_TO(PushNotificationsController::subscribeDevice, "/api/v1/push/subscribe", drogon::Post);
    ADD_METHOD_TO(PushNotificationsController::updatePreferences, "/api/v1/push/preferences", drogon::Post);
    ADD_METHOD_TO(PushNotificationsController::unsubscribeDevice, "/api/v1/push/unsubscribe", drogon::Delete);
    ADD_METHOD_TO(PushNotificationsController::dispatchBroadcast, "/api/v1/push/dispatch", drogon::Post, "gnp::filters::AdminJwtFilter");
    ADD_METHOD_TO(PushNotificationsController::trackEvent, "/api/v1/push/track", drogon::Post);
    METHOD_LIST_END

    drogon::Task<drogon::HttpResponsePtr> getVapidPublicKey(const drogon::HttpRequestPtr req);
    drogon::Task<drogon::HttpResponsePtr> subscribeDevice(const drogon::HttpRequestPtr req);
    drogon::Task<drogon::HttpResponsePtr> updatePreferences(const drogon::HttpRequestPtr req);
    drogon::Task<drogon::HttpResponsePtr> unsubscribeDevice(const drogon::HttpRequestPtr req);
    drogon::Task<drogon::HttpResponsePtr> dispatchBroadcast(const drogon::HttpRequestPtr req);
    drogon::Task<drogon::HttpResponsePtr> trackEvent(const drogon::HttpRequestPtr req);
};
}`,
    },
  };
}
