<template>
  <div class="fixed bottom-4 right-4 z-[60] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-3 sm:px-0">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-3 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="notification in notifications"
        :key="notification.notificationId"
        class="bg-slate-900/95 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-2xl border pointer-events-auto cursor-pointer hover:border-slate-500 transition-all relative group"
        :class="
          notification.urgency === 'high'
            ? 'border-red-500/70 ring-1 ring-red-500/30'
            : 'border-slate-700/90'
        "
        @click="handleClick(notification)"
      >
        <!-- Optional Rich Banner Image -->
        <img
          v-if="notification.imageUrl"
          :src="notification.imageUrl"
          alt=""
          class="w-full h-28 object-cover border-b border-slate-800"
        />

        <div class="p-4">
          <div class="flex items-start gap-3">
            <div
              class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs shadow-sm"
              :class="notification.urgency === 'high' ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400 border border-slate-700'"
            >
              GN+
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1 pr-5">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                  :class="categoryBadgeClass(notification.category)"
                >
                  {{ formatCategoryLabel(notification.category) }}
                </span>
                <span class="text-[11px] text-slate-400 shrink-0">
                  {{ formatTime(notification.timestamp) }}
                </span>
              </div>

              <p class="text-sm font-bold text-white leading-snug line-clamp-2">
                {{ notification.subject }}
              </p>
              <p class="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {{ notification.messageBody }}
              </p>

              <!-- Action Buttons -->
              <div
                v-if="notification.actions && notification.actions.length"
                class="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2"
              >
                <button
                  v-for="act in notification.actions.slice(0, 2)"
                  :key="act.action"
                  type="button"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  :class="
                    act.action === 'dismiss'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  "
                  @click.stop="handleActionClick(notification, act.url)"
                >
                  {{ act.title }}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            @click.stop="removeNotification(notification.notificationId)"
          >
            <span class="sr-only">Close</span>
            <Icon name="lucide:x" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '~/stores/notification';
import { trackPushInteractionApi } from '~/services/pushNotifications';
import type { PushNotificationInboxItem } from '~/models';

const store = useNotificationStore();
const { notifications } = storeToRefs(store);
const { removeNotification, markAsRead } = store;
const router = useRouter();

function navigateDeepLink(link?: string) {
  if (!link) return;
  if (link.startsWith('http') && !link.includes(window.location.host)) {
    window.open(link, '_blank');
    return;
  }
  try {
    const url = new URL(link);
    router.push(url.pathname + url.search);
  } catch {
    router.push(link);
  }
}

const handleClick = (notification: PushNotificationInboxItem) => {
  markAsRead(notification.notificationId);
  trackPushInteractionApi(notification.notificationId, 'clicked');
  navigateDeepLink(notification.deepLink);
  removeNotification(notification.notificationId);
};

const handleActionClick = (notification: PushNotificationInboxItem, actionUrl?: string) => {
  markAsRead(notification.notificationId);
  trackPushInteractionApi(notification.notificationId, 'clicked');
  navigateDeepLink(actionUrl || notification.deepLink);
  removeNotification(notification.notificationId);
};

function formatCategoryLabel(cat?: string) {
  const map: Record<string, string> = {
    breaking_news: 'Breaking News',
    morning_edition: 'Edition Ready',
    subscriptions_billing: 'Billing',
    originals_multimedia: 'GN+ Originals',
    archives_research: 'Archives',
    games_daily: 'Daily Games',
    promotions_offers: 'Special Offer',
    platform_updates: 'Platform Update',
  };
  return map[cat || ''] || 'NewsPlus Alert';
}

function categoryBadgeClass(cat?: string) {
  if (cat === 'breaking_news') return 'bg-red-500/25 text-red-300 border border-red-500/40';
  if (cat === 'morning_edition') return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
  if (cat === 'subscriptions_billing') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  return 'bg-slate-800 text-slate-300 border border-slate-700';
}

const formatTime = (microTimestamp: number) => {
  const ms = microTimestamp > 1e14 ? microTimestamp / 1000 : microTimestamp;
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>
