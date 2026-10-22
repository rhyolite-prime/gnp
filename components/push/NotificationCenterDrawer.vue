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
        class="fixed inset-0 z-[55] flex justify-end bg-slate-950/50 backdrop-blur-xs"
        @click.self="isCenterOpen = false"
      >
        <div class="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
          <!-- Header -->
          <div class="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="p-2 rounded-xl bg-red-600/20 border border-red-500/40">
                <Icon name="lucide:bell-ring" class="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h3 class="text-sm font-extrabold">Notifications & Push Settings</h3>
                <p class="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span
                    class="inline-block w-2 h-2 rounded-full"
                    :class="sseConnected ? 'bg-emerald-400' : 'bg-amber-400'"
                  />
                  <span>{{ sseConnected ? 'Real-Time Push Bus Connected' : 'Connecting Stream...' }}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              @click="isCenterOpen = false"
            >
              <Icon name="lucide:x" class="h-5 w-5" />
            </button>
          </div>

          <!-- Push Device Status Strip -->
          <div class="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-bold text-gray-900">
                Browser Push:
                <span :class="isSubscribed ? 'text-emerald-600' : 'text-gray-500'">
                  {{ isSubscribed ? 'Subscribed' : 'Not Subscribed' }}
                </span>
              </p>
              <p class="text-[11px] text-gray-500 truncate">
                {{
                  isSubscribed
                    ? `${subscribedTopics.length}/8 topics active on this browser`
                    : 'Turn on alerts for breaking news & edition drops'
                }}
              </p>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                v-if="isSubscribed"
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                @click="triggerLiveTestNotification()"
              >
                Test Alert
              </button>
              <button
                type="button"
                :disabled="isSubscribing"
                class="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                :class="
                  isSubscribed
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                "
                @click="isSubscribed ? disableBrowserPush() : enableBrowserPush()"
              >
                {{ isSubscribed ? 'Pause' : 'Enable' }}
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="px-5 pt-2.5 border-b border-gray-200 flex items-center justify-between">
            <div class="flex gap-4">
              <button
                type="button"
                class="pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer"
                :class="
                  activeTab === 'inbox'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                "
                @click="activeTab = 'inbox'"
              >
                Inbox ({{ inbox.length }})
              </button>
              <button
                type="button"
                class="pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer"
                :class="
                  activeTab === 'preferences'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                "
                @click="activeTab = 'preferences'"
              >
                Topics & Quiet Hours
              </button>
            </div>

            <button
              v-if="activeTab === 'inbox' && unreadCount > 0"
              type="button"
              class="pb-2 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              @click="clearUnreadCount"
            >
              Mark all read
            </button>
          </div>

          <!-- TAB 1: Notification Inbox -->
          <div v-if="activeTab === 'inbox'" class="flex-1 overflow-y-auto divide-y divide-gray-100">
            <div
              v-for="item in inbox"
              :key="item.notificationId"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer relative"
              :class="!item.read ? 'bg-red-50/35' : ''"
              @click="openInboxItem(item)"
            >
              <div class="flex items-start gap-3">
                <span
                  class="mt-1.5 h-2 w-2 rounded-full shrink-0"
                  :class="!item.read ? 'bg-red-600' : 'bg-transparent'"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                      {{ (item.category || 'update').replace(/_/g, ' ') }}
                    </span>
                    <span class="text-[11px] text-gray-400">
                      {{ formatRelative(item.timestamp) }}
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 leading-snug">
                    {{ item.subject }}
                  </p>
                  <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                    {{ item.messageBody }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="!inbox.length" class="p-10 text-center text-gray-400 text-xs">
              No notifications yet. Click <strong>Test Alert</strong> above to verify browser delivery.
            </div>
          </div>

          <!-- TAB 2: Topic Subscriptions & Quiet Hours -->
          <div v-else class="flex-1 overflow-y-auto p-5 space-y-5">
            <div class="space-y-2.5">
              <p class="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Alert Categories
              </p>
              <label
                v-for="topic in PUSH_TOPIC_DEFINITIONS"
                :key="topic.id"
                class="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div class="min-w-0">
                  <p class="text-xs font-bold text-gray-900">{{ topic.label }}</p>
                  <p class="text-[11px] text-gray-500 mt-0.5 leading-snug">{{ topic.description }}</p>
                </div>
                <input
                  type="checkbox"
                  :checked="subscribedTopics.includes(topic.id)"
                  class="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  @change="toggleTopicPreference(topic.id)"
                />
              </label>
            </div>

            <!-- Quiet Hours -->
            <div class="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-gray-900">Quiet Hours (GMT)</p>
                  <p class="text-[11px] text-gray-500">
                    Mutes standard popups overnight while allowing critical breaking alerts
                  </p>
                </div>
                <input
                  v-model="quietHours.enabled"
                  type="checkbox"
                  class="rounded text-red-600 focus:ring-red-500"
                  @change="updateQuietHours"
                />
              </div>

              <div v-if="quietHours.enabled" class="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">From</label>
                  <input
                    v-model="quietHours.start"
                    type="time"
                    class="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    @change="updateQuietHours"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Until</label>
                  <input
                    v-model="quietHours.end"
                    type="time"
                    class="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    @change="updateQuietHours"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Link to Admin Dispatch Studio -->
          <div class="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
            <NuxtLink
              to="/account"
              class="text-gray-600 hover:text-gray-900 font-medium"
              @click="isCenterOpen = false"
            >
              Account Settings
            </NuxtLink>
            <NuxtLink
              to="/admin/push-notifications"
              class="text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1"
              @click="isCenterOpen = false"
            >
              <span>Push Dispatch Console</span>
              <Icon name="lucide:arrow-up-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PUSH_TOPIC_DEFINITIONS, trackPushInteractionApi } from '~/services/pushNotifications';
import { usePushNotifications } from '~/composables/usePushNotifications';
import type { PushNotificationInboxItem } from '~/models';

const router = useRouter();
const activeTab = ref<'inbox' | 'preferences'>('inbox');

const {
  inbox,
  unreadCount,
  isCenterOpen,
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

function openInboxItem(item: PushNotificationInboxItem) {
  markAsRead(item.notificationId);
  trackPushInteractionApi(item.notificationId, 'clicked');
  isCenterOpen.value = false;
  if (item.deepLink) {
    router.push(item.deepLink);
  }
}

function formatRelative(ts: number) {
  const diffMin = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const hrs = Math.round(diffMin / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
</script>
