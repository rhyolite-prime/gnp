<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isCenterOpen"
        class="fixed inset-0 z-[55] flex justify-end bg-gray-900/40"
        @click.self="isCenterOpen = false"
      >
        <div class="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 leading-tight">Notifications</h3>
              <p v-if="!sseConnected" class="text-xs text-gray-400 mt-1 italic">
                Reconnecting to live alerts…
              </p>
            </div>
            <div class="flex items-center gap-1 pt-0.5">
              <button
                v-if="unreadCount > 0"
                type="button"
                class="px-2 py-1 rounded-md text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                @click="clearUnreadCount"
              >
                Mark all as read
              </button>
              <button
                type="button"
                class="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                @click="isCenterOpen = false"
              >
                <Icon name="lucide:x" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Browser notifications -->
          <div class="px-5 pb-4 border-b border-gray-100">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-gray-900">
                  {{
                    isSubscribed
                      ? 'Browser notifications are on.'
                      : permissionState === 'denied'
                        ? 'Your browser is blocking notifications.'
                        : 'Browser notifications are off.'
                  }}
                </p>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">
                  {{
                    isSubscribed
                      ? topicCountLabel
                      : permissionState === 'denied'
                        ? 'Allow them from your browser\u2019s address bar to turn alerts back on.'
                        : 'Turn them on to get breaking news and other alerts here.'
                  }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0 pt-0.5">
                <button
                  v-if="isSubscribed"
                  type="button"
                  class="px-2.5 py-1.5 rounded-md text-xs text-gray-600 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                  @click="triggerLiveTestNotification()"
                >
                  Send a test
                </button>
                <button
                  v-if="permissionState !== 'denied'"
                  type="button"
                  :disabled="isSubscribing"
                  class="rounded-md text-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="
                    isSubscribed
                      ? 'px-2.5 py-1.5 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      : 'px-3 py-1.5 font-medium text-white bg-red-600 hover:bg-red-700'
                  "
                  @click="isSubscribed ? disableBrowserPush() : enableBrowserPush()"
                >
                  {{ isSubscribed ? 'Turn off' : 'Turn on' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="px-5 border-b border-gray-200 flex items-center gap-6">
            <button
              type="button"
              class="pt-1 pb-2.5 text-sm border-b-2 -mb-px cursor-pointer"
              :class="
                activeTab === 'inbox'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              "
              @click="activeTab = 'inbox'"
            >
              Inbox<template v-if="inbox.length"> ({{ inbox.length }})</template>
            </button>
            <button
              type="button"
              class="pt-1 pb-2.5 text-sm border-b-2 -mb-px cursor-pointer"
              :class="
                activeTab === 'preferences'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              "
              @click="activeTab = 'preferences'"
            >
              Settings
            </button>
          </div>

          <!-- Inbox -->
          <div v-if="activeTab === 'inbox'" class="flex-1 overflow-y-auto">
            <template v-if="inbox.length">
              <div
                v-for="item in inbox"
                :key="item.notificationId"
                class="px-5 py-4 border-b border-gray-100 cursor-pointer transition-colors"
                :class="!item.read ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'"
                @click="openInboxItem(item)"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                    :class="!item.read ? 'bg-red-500' : 'bg-transparent'"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-500">
                      <span class="font-medium text-gray-600">{{ formatCategory(item.category) }}</span>
                      <span class="mx-1 text-gray-300">·</span>
                      {{ formatRelative(item.timestamp) }}
                    </p>
                    <p
                      class="text-sm mt-1 leading-snug"
                      :class="!item.read ? 'text-gray-900 font-semibold' : 'text-gray-800 font-medium'"
                    >
                      {{ item.subject }}
                    </p>
                    <p class="text-[13px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {{ item.messageBody }}
                    </p>
                  </div>
                </div>
              </div>
            </template>

            <div v-else class="px-8 py-16 text-center">
              <p class="text-sm font-medium text-gray-900">You&rsquo;re all caught up</p>
              <p class="text-[13px] text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                New alerts will show up here &mdash; breaking news, your morning edition, and anything
                else you&rsquo;ve turned on.
              </p>
            </div>
          </div>

          <!-- Settings -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="px-5 pt-5 pb-3">
              <p class="text-sm font-medium text-gray-900">What we&rsquo;ll send you</p>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed">
                Tick the alerts you actually want. Everything else stays quiet.
              </p>
            </div>

            <label
              v-for="topic in PUSH_TOPIC_DEFINITIONS"
              :key="topic.id"
              class="flex items-start justify-between gap-3 px-5 py-3.5 border-t border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <div class="min-w-0">
                <p class="text-sm text-gray-900 font-medium">{{ topic.label }}</p>
                <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ topic.description }}</p>
              </div>
              <input
                type="checkbox"
                :checked="subscribedTopics.includes(topic.id)"
                class="mt-1 rounded text-red-600 focus:ring-red-500"
                @change="toggleTopicPreference(topic.id)"
              />
            </label>

            <!-- Quiet hours -->
            <div class="px-5 py-5 border-t border-gray-100 mt-2">
              <label class="flex items-start justify-between gap-3 cursor-pointer">
                <div class="min-w-0">
                  <p class="text-sm text-gray-900 font-medium">Quiet hours</p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    We&rsquo;ll hold non-urgent alerts until morning. Breaking news still comes through.
                  </p>
                </div>
                <input
                  v-model="quietHours.enabled"
                  type="checkbox"
                  class="mt-1 rounded text-red-600 focus:ring-red-500"
                  @change="updateQuietHours"
                />
              </label>

              <div v-if="quietHours.enabled" class="flex items-center gap-2 mt-3 text-xs text-gray-600">
                <span>From</span>
                <input
                  v-model="quietHours.start"
                  type="time"
                  class="px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white"
                  @change="updateQuietHours"
                />
                <span>until</span>
                <input
                  v-model="quietHours.end"
                  type="time"
                  class="px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white"
                  @change="updateQuietHours"
                />
                <span class="text-gray-400">GMT</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-xs">
            <NuxtLink
              to="/account"
              class="text-gray-500 hover:text-gray-900"
              @click="isCenterOpen = false"
            >
              Account settings
            </NuxtLink>
            <NuxtLink
              v-if="isAdminRoute"
              to="/admin/campaigns"
              class="text-gray-900 hover:text-red-600 font-medium inline-flex items-center gap-1"
              @click="isCenterOpen = false"
            >
              <span>Campaigns console</span>
              <Icon name="lucide:arrow-up-right" class="h-3.5 w-3.5" />
            </NuxtLink>
            <NuxtLink
              v-else
              to="/newspapers"
              class="text-gray-900 hover:text-red-600 font-medium inline-flex items-center gap-1"
              @click="isCenterOpen = false"
            >
              <span>Today&rsquo;s editions</span>
              <Icon name="lucide:arrow-up-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Icon from '~/components/reports/Icon.vue';
import { PUSH_TOPIC_DEFINITIONS, trackPushInteractionApi } from '~/services/pushNotifications';
import { usePushNotifications } from '~/composables/usePushNotifications';
import type { PushNotificationInboxItem } from '~/models';

const route = useRoute();
const router = useRouter();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const activeTab = ref<'inbox' | 'preferences'>('inbox');

const {
  inbox,
  unreadCount,
  isCenterOpen,
  permissionState,
  isSubscribed,
  isSubscribing,
  sseConnected,
  subscribedTopics,
  quietHours,
  enableBrowserPush,
  disableBrowserPush,
  toggleTopicPreference,
  updateQuietHours,
  triggerLiveTestNotification,
  markAsRead,
  clearUnreadCount,
} = usePushNotifications();

const topicCountLabel = computed(() => {
  const n = subscribedTopics.value.length;
  const total = PUSH_TOPIC_DEFINITIONS.length;
  if (n === 0) return 'No alert types are selected yet.';
  if (n === total) return `All ${total} alert types are on.`;
  return `${n} of ${total} alert types are on.`;
});

function openInboxItem(item: PushNotificationInboxItem) {
  markAsRead(item.notificationId);
  trackPushInteractionApi(item.notificationId, 'clicked');
  isCenterOpen.value = false;
  if (item.deepLink) {
    router.push(item.deepLink);
  }
}

function formatCategory(cat?: string) {
  const map: Record<string, string> = {
    breaking_news: 'Breaking news',
    morning_edition: 'Morning edition',
    platform_updates: 'Product news',
    subscriptions_billing: 'Billing',
    originals_multimedia: 'Originals',
    archives_research: 'Archives',
    games_daily: 'Games',
    promotions_offers: 'Offers',
  };
  return map[cat || ''] || 'Update';
}

function formatRelative(ts: number) {
  const ms = ts > 1e14 ? ts / 1000 : ts;
  const diffMin = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const hrs = Math.round(diffMin / 60);
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}
</script>
