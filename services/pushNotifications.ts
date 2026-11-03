import type {
  BaseApiResponse,
  BrowserPushSubscriptionRecord,
  DispatchPushRequestDto,
  PushAudienceSegment,
  PushBroadcastRecord,
  PushDashboardPayload,
  PushTopicCategory,
  QuietHoursConfig,
} from '~/models';

export const PUSH_TOPIC_DEFINITIONS: {
  id: PushTopicCategory;
  label: string;
  description: string;
  icon: string;
  badgeColor: string;
}[] = [
  {
    id: 'breaking_news',
    label: 'Breaking news',
    description: 'Major national, economic and election stories, as they happen.',
    icon: 'lucide:flame',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    id: 'morning_edition',
    label: 'Morning edition',
    description: 'A heads-up when the day’s papers are ready — Daily Graphic, Graphic Business, The Mirror and Sports.',
    icon: 'lucide:newspaper',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'platform_updates',
    label: 'Product news',
    description: 'New reader tools and improvements, plus the occasional maintenance notice.',
    icon: 'lucide:sparkles',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'subscriptions_billing',
    label: 'Subscription & billing',
    description: 'Renewals, Mobile Money receipts, and a reminder before your plan expires.',
    icon: 'lucide:credit-card',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'originals_multimedia',
    label: 'Originals & live',
    description: 'New documentaries, interviews, podcasts and live broadcasts.',
    icon: 'lucide:clapperboard',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'archives_research',
    label: 'Archives & history',
    description: 'Historical front pages, This Day in History, and research credit alerts.',
    icon: 'lucide:library',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'games_daily',
    label: 'Daily games',
    description: 'The day’s crossword, sudoku and riddles — and a nudge if a streak is about to lapse.',
    icon: 'lucide:gamepad-2',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'promotions_offers',
    label: 'Offers & promos',
    description: 'Subscriber discounts, plan upgrades and partner perks.',
    icon: 'lucide:ticket',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
];

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function fetchVapidPublicKey() {
  const res = await $fetch<BaseApiResponse<{ publicKey: string; subject: string }>>(
    '/api/v1/push/vapid-public-key'
  );
  return res.result;
}

export async function fetchPushDashboard(): Promise<PushDashboardPayload> {
  const res = await $fetch<BaseApiResponse<PushDashboardPayload>>('/api/v1/push/dashboard');
  return res.result;
}

export const fetchPushDashboardApi = fetchPushDashboard;

export async function registerPushSubscriptionOnServer(payload: {
  subscription?: PushSubscriptionJSON | null;
  deviceId?: string;
  userId?: string;
  userLabel?: string;
  segment?: PushAudienceSegment;
  topics?: PushTopicCategory[];
  quietHours?: QuietHoursConfig;
  isSimulated?: boolean;
}): Promise<BrowserPushSubscriptionRecord> {
  const res = await $fetch<BaseApiResponse<BrowserPushSubscriptionRecord>>('/api/v1/push/subscribe', {
    method: 'POST',
    body: payload,
  });
  return res.result;
}

export async function savePushPreferencesOnServer(payload: {
  endpoint?: string;
  topics: PushTopicCategory[];
  quietHours: QuietHoursConfig;
}) {
  const res = await $fetch<BaseApiResponse<BrowserPushSubscriptionRecord>>(
    '/api/v1/push/preferences',
    {
      method: 'POST',
      body: payload,
    }
  );
  return res.result;
}

export async function unregisterPushSubscriptionOnServer(endpoint: string) {
  const res = await $fetch<BaseApiResponse<{ unsubscribed: boolean }>>('/api/v1/push/unsubscribe', {
    method: 'POST',
    body: { endpoint },
  });
  return res.result;
}

export async function dispatchPushBroadcastApi(
  payload: DispatchPushRequestDto
): Promise<PushBroadcastRecord> {
  const res = await $fetch<BaseApiResponse<PushBroadcastRecord>>('/api/v1/push/dispatch', {
    method: 'POST',
    body: payload,
  });
  return res.result;
}

export async function sendTestPushApi(
  payload: Partial<DispatchPushRequestDto> & { endpoint?: string } = {}
): Promise<PushBroadcastRecord> {
  const res = await $fetch<BaseApiResponse<PushBroadcastRecord>>('/api/v1/push/test', {
    method: 'POST',
    body: payload,
  });
  return res.result;
}

export async function triggerScheduledBroadcastApi(id: string): Promise<PushBroadcastRecord> {
  const res = await $fetch<BaseApiResponse<PushBroadcastRecord>>(
    '/api/v1/push/trigger-scheduled',
    {
      method: 'POST',
      body: { id },
    }
  );
  return res.result;
}

export async function cancelScheduledBroadcastApi(id: string) {
  const res = await $fetch<BaseApiResponse<PushBroadcastRecord>>('/api/v1/push/cancel-scheduled', {
    method: 'POST',
    body: { id },
  });
  return res.result;
}

export async function trackPushInteractionApi(
  id: string,
  event: 'displayed' | 'clicked' | 'dismissed'
) {
  return $fetch('/api/v1/push/track', {
    method: 'POST',
    body: { id, event },
  }).catch(() => null);
}
