<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="lucide:bell-ring" class="w-5 h-5 text-red-600" />
          <span>Browser Push Notifications</span>
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Choose which Graphic NewsPlus updates deliver instant browser & desktop alerts.
        </p>
      </div>

      <span
        class="px-2.5 py-1 rounded-full text-xs font-bold"
        :class="
          isSubscribed
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-gray-100 text-gray-600'
        "
      >
        {{ isSubscribed ? 'Active on This Browser' : 'Paused' }}
      </span>
    </div>

    <div class="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
      <button
        type="button"
        :disabled="isSubscribing"
        class="px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        :class="
          isSubscribed
            ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
            : 'bg-red-600 hover:bg-red-700 text-white'
        "
        @click="isSubscribed ? disableBrowserPush() : enableBrowserPush()"
      >
        {{ isSubscribed ? 'Disable Browser Alerts' : 'Enable Browser Push Alerts' }}
      </button>

      <button
        type="button"
        class="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
        @click="triggerLiveTestNotification()"
      >
        <Icon name="lucide:send" class="h-3.5 w-3.5" />
        <span>Send Test Push</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <label
        v-for="topic in PUSH_TOPIC_DEFINITIONS"
        :key="topic.id"
        class="flex items-start justify-between gap-2.5 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
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
  </div>
</template>

<script setup lang="ts">
import { PUSH_TOPIC_DEFINITIONS } from '~/services/pushNotifications';
import { usePushNotifications } from '~/composables/usePushNotifications';

const {
  isSubscribed,
  isSubscribing,
  subscribedTopics,
  enableBrowserPush,
  disableBrowserPush,
  toggleTopicPreference,
  triggerLiveTestNotification,
} = usePushNotifications();
</script>
