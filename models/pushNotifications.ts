export type PushTopicCategory =
  | 'breaking_news'
  | 'morning_edition'
  | 'subscriptions_billing'
  | 'originals_multimedia'
  | 'archives_research'
  | 'games_daily'
  | 'promotions_offers'
  | 'platform_updates';

export type PushAudienceSegment =
  | 'all_subscribers'
  | 'paid_active'
  | 'free_readers'
  | 'corporate_b2b'
  | 'ghana_local'
  | 'diaspora';

export type PushUrgency = 'high' | 'normal' | 'low';

export interface PushNotificationActionButton {
  action: string;
  title: string;
  url?: string;
}

export interface QuietHoursConfig {
  enabled: boolean;
  start: string; // HH:mm in GMT e.g. "22:00"
  end: string;   // HH:mm in GMT e.g. "05:30"
}

export interface BrowserPushSubscriptionRecord {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  browserName: string;
  osName: string;
  userAgent: string;
  userId?: string;
  userLabel?: string;
  segment: PushAudienceSegment;
  topics: PushTopicCategory[];
  quietHours: QuietHoursConfig;
  isSimulated?: boolean;
  createdAt: string;
  lastSeenAt: string;
}

export interface DispatchPushRequestDto {
  title: string;
  body: string;
  category: PushTopicCategory;
  urgency: PushUrgency;
  deepLink: string;
  imageUrl?: string;
  iconUrl?: string;
  badgeUrl?: string;
  tag?: string;
  requireInteraction?: boolean;
  renotify?: boolean;
  silent?: boolean;
  ttlSeconds?: number;
  actions?: PushNotificationActionButton[];
  targetSegment: PushAudienceSegment;
  publicationId?: string;
  scheduleMode: 'now' | 'scheduled';
  scheduledAt?: string;
  createdBy?: string;
}

export interface PushBroadcastRecord {
  id: string;
  title: string;
  body: string;
  category: PushTopicCategory;
  urgency: PushUrgency;
  deepLink: string;
  imageUrl?: string;
  iconUrl?: string;
  tag: string;
  requireInteraction: boolean;
  actions: PushNotificationActionButton[];
  targetSegment: PushAudienceSegment;
  status: 'SENT' | 'SCHEDULED' | 'CANCELLED' | 'FAILED';
  targetedDevices: number;
  realWebPushDelivered: number;
  sseLiveDelivered: number;
  deliveredCount: number;
  displayedCount: number;
  clickedCount: number;
  dismissedCount: number;
  failedCount: number;
  ctrPercent: number;
  ttlSeconds: number;
  createdBy: string;
  createdAt: string;
  sentAt?: string;
  scheduledAt?: string;
}

export interface PushNotificationInboxItem {
  notificationId: string;
  subject: string;
  messageBody: string;
  category?: PushTopicCategory;
  urgency?: PushUrgency;
  deepLink?: string;
  imageUrl?: string;
  actions?: PushNotificationActionButton[];
  timestamp: number;
  read?: boolean;
}

export interface PushDashboardPayload {
  vapidPublicKey: string;
  vapidSubject: string;
  summary: {
    activeBrowserSubscriptions: number;
    liveConnectedClients: number;
    totalBroadcastsSent: number;
    scheduledQueueCount: number;
    avgDeliveryRatePct: number;
    avgCtrPct: number;
    optInRatePct: number;
  };
  charts: {
    days: string[];
    dailyDelivered: number[];
    dailyClicked: number[];
    dailyNewOptIns: number[];
    categoryPerformance: {
      category: PushTopicCategory;
      label: string;
      sent: number;
      ctrPct: number;
    }[];
    platformBreakdown: {
      name: string;
      value: number;
    }[];
  };
  recentBroadcasts: PushBroadcastRecord[];
  subscriptions: BrowserPushSubscriptionRecord[];
  backendBlueprint: {
    sqlDdl: string;
    cppControllerHeader: string;
    endpoints: {
      method: string;
      path: string;
      description: string;
    }[];
  };
}
