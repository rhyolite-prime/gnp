import { defineStore } from 'pinia';
import type {
  PushNotificationInboxItem,
  PushTopicCategory,
  QuietHoursConfig,
} from '~/models/pushNotifications';

export type NotificationPayload = PushNotificationInboxItem;

const STORAGE_INBOX_KEY = 'gnp_push_inbox_v1';
const STORAGE_PREFS_KEY = 'gnp_push_prefs_v1';

const DEFAULT_TOPICS: PushTopicCategory[] = [
  'breaking_news',
  'morning_edition',
  'subscriptions_billing',
  'originals_multimedia',
  'archives_research',
  'games_daily',
  'promotions_offers',
  'platform_updates',
];

const SEED_INBOX_ITEMS: PushNotificationInboxItem[] = [
  {
    notificationId: 'BCAST-20261022-01',
    subject: 'BREAKING: Bank of Ghana Holds Policy Rate Steady Following Inflation Review',
    messageBody:
      'Read Graphic Business’ full breakdown of MPC monetary policy implications for SMEs, Treasury bills, and the Cedi.',
    category: 'breaking_news',
    urgency: 'high',
    deepLink: '/newspapers',
    timestamp: Date.now() - 1000 * 60 * 24,
    read: false,
  },
  {
    notificationId: 'BCAST-20261022-02',
    subject: 'Thursday’s Daily Graphic Digital Edition (48 Pages) Is Ready',
    messageBody:
      'Flip through today’s front page, Parliament coverage, regional reports, and today’s newsroom Crossword.',
    category: 'morning_edition',
    urgency: 'normal',
    deepLink: '/newspapers',
    timestamp: Date.now() - 1000 * 60 * 145,
    read: false,
  },
  {
    notificationId: 'BCAST-20261021-03',
    subject: 'Platform Update: Offline Edition Caching & Instant Archive Citations Live',
    messageBody:
      'Download full PDFs for offline flight reading and export APA/MLA citations directly from 1950–2026 archives.',
    category: 'platform_updates',
    urgency: 'normal',
    deepLink: '/archives',
    timestamp: Date.now() - 1000 * 60 * 480,
    read: true,
  },
];

export const useNotificationStore = defineStore('notification', () => {
  // Active floating toasts (bottom-right)
  const notifications = ref<PushNotificationInboxItem[]>([]);

  // Persistent Notification Center Inbox
  const inbox = ref<PushNotificationInboxItem[]>([...SEED_INBOX_ITEMS]);

  // Drawer open state (shared between public header, admin header, and inline buttons)
  const isCenterOpen = ref(false);

  // Browser Web Push state
  const permissionState = ref<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const isSubscribed = ref(false);
  const isSimulatedSubscription = ref(false);
  const swReady = ref(false);
  const sseConnected = ref(false);
  const activeEndpoint = ref<string>('');
  const subscribedTopics = ref<PushTopicCategory[]>([...DEFAULT_TOPICS]);
  const quietHours = ref<QuietHoursConfig>({
    enabled: false,
    start: '22:00',
    end: '05:30',
  });

  const unreadCount = computed(() => inbox.value.filter((item) => !item.read).length);

  function hydrateFromLocalStorage() {
    if (!import.meta.client) return;
    try {
      const savedInbox = localStorage.getItem(STORAGE_INBOX_KEY);
      if (savedInbox) {
        const parsed = JSON.parse(savedInbox);
        if (Array.isArray(parsed) && parsed.length) {
          inbox.value = parsed;
        }
      }
      const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY);
      if (savedPrefs) {
        const p = JSON.parse(savedPrefs);
        if (typeof p.isSubscribed === 'boolean') isSubscribed.value = p.isSubscribed;
        if (typeof p.isSimulatedSubscription === 'boolean') {
          isSimulatedSubscription.value = p.isSimulatedSubscription;
        }
        if (p.activeEndpoint) activeEndpoint.value = p.activeEndpoint;
        if (Array.isArray(p.subscribedTopics)) subscribedTopics.value = p.subscribedTopics;
        if (p.quietHours) quietHours.value = p.quietHours;
      }
    } catch {
      // Ignore storage parse error
    }
  }

  function persistState() {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(STORAGE_INBOX_KEY, JSON.stringify(inbox.value.slice(0, 40)));
      localStorage.setItem(
        STORAGE_PREFS_KEY,
        JSON.stringify({
          isSubscribed: isSubscribed.value,
          isSimulatedSubscription: isSimulatedSubscription.value,
          activeEndpoint: activeEndpoint.value,
          subscribedTopics: subscribedTopics.value,
          quietHours: quietHours.value,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  function isWithinQuietHours(): boolean {
    if (!quietHours.value.enabled) return false;
    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();
    const [sH, sM] = quietHours.value.start.split(':').map(Number);
    const [eH, eM] = quietHours.value.end.split(':').map(Number);
    const startMins = (sH || 22) * 60 + (sM || 0);
    const endMins = (eH || 5) * 60 + (eM || 30);

    if (startMins <= endMins) {
      return curMins >= startMins && curMins < endMins;
    }
    return curMins >= startMins || curMins < endMins;
  }

  const addNotification = (
    raw: Partial<PushNotificationInboxItem> & { title?: string; body?: string; id?: string },
    options: { showToast?: boolean } = { showToast: true }
  ) => {
    const id = raw.notificationId || raw.id || `notif-${Date.now()}`;
    if (inbox.value.some((n) => n.notificationId === id)) {
      return;
    }

    const item: PushNotificationInboxItem = {
      notificationId: id,
      subject: raw.subject || raw.title || 'Graphic NewsPlus Update',
      messageBody: raw.messageBody || raw.body || '',
      category: raw.category || 'platform_updates',
      urgency: raw.urgency || 'normal',
      deepLink: raw.deepLink || '/',
      imageUrl: raw.imageUrl,
      actions: raw.actions,
      timestamp: raw.timestamp || Date.now(),
      read: false,
    };

    inbox.value.unshift(item);
    if (inbox.value.length > 40) {
      inbox.value = inbox.value.slice(0, 40);
    }
    persistState();

    // Show interactive toast unless suppressed by non-urgent quiet hours
    const shouldShowToast =
      options.showToast !== false && (!isWithinQuietHours() || item.urgency === 'high');

    if (shouldShowToast) {
      notifications.value.unshift(item);
      if (notifications.value.length > 4) {
        notifications.value = notifications.value.slice(0, 4);
      }
      setTimeout(() => {
        removeNotification(id);
      }, 9500);
    }
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.notificationId === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const markAsRead = (id: string) => {
    const target = inbox.value.find((n) => n.notificationId === id);
    if (target) {
      target.read = true;
      persistState();
    }
  };

  const clearUnreadCount = () => {
    inbox.value.forEach((n) => {
      n.read = true;
    });
    persistState();
  };

  const clearInbox = () => {
    inbox.value = [];
    persistState();
  };

  return {
    notifications,
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
    hydrateFromLocalStorage,
    persistState,
    isWithinQuietHours,
    addNotification,
    removeNotification,
    markAsRead,
    clearUnreadCount,
    clearInbox,
  };
});
