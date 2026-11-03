<template>
  <div class="mb-6 space-y-4">
    <!-- Top Header Row -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-700">{{ title }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          :disabled="isSendingTest"
          @click="handleSendTest"
          class="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <BellAlertIcon class="h-4 w-4 mr-1.5 text-gray-500" />
          {{ isSendingTest ? 'Sending...' : 'Test Browser Push' }}
        </button>

        <button
          type="button"
          @click="handleToggleBrowserPush"
          class="inline-flex items-center px-3.5 py-2 border shadow-sm text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer"
          :class="
            notificationStore.isSubscribed
              ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          "
        >
          <CheckCircleIcon v-if="notificationStore.isSubscribed" class="h-4 w-4 mr-1.5 text-green-600" />
          <BellIcon v-else class="h-4 w-4 mr-1.5 text-gray-500" />
          {{ notificationStore.isSubscribed ? 'Browser Subscribed' : 'Subscribe Browser' }}
        </button>

        <NuxtLink
          v-if="route.path !== '/admin/campaigns/new'"
          to="/admin/campaigns/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          <PlusIcon class="h-4 w-4 mr-1.5" />
          New Broadcast
        </NuxtLink>
      </div>
    </div>

    <!-- Clean Page Switcher Tabs -->
    <div class="border-b border-gray-200 flex items-center gap-6 overflow-x-auto">
      <NuxtLink
        to="/admin/campaigns"
        class="pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-2 transition-colors"
        :class="
          route.path === '/admin/campaigns'
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
        "
      >
        <ChartBarSquareIcon class="h-4 w-4" />
        <span>Overview & Analytics</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/campaigns/history"
        class="pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-2 transition-colors"
        :class="
          route.path === '/admin/campaigns/history'
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
        "
      >
        <ClockIcon class="h-4 w-4" />
        <span>Broadcast History</span>
      </NuxtLink>

      <NuxtLink
        to="/admin/campaigns/new"
        class="pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-2 transition-colors"
        :class="
          route.path === '/admin/campaigns/new'
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
        "
      >
        <PaperAirplaneIcon class="h-4 w-4" />
        <span>New Broadcast Wizard</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  BellIcon,
  BellAlertIcon,
  CheckCircleIcon,
  PlusIcon,
  ChartBarSquareIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline';
import { useNotificationStore } from '~/stores/notification';
import { usePushNotifications } from '~/composables/usePushNotifications';

defineProps<{
  title: string;
  subtitle: string;
}>();

const route = useRoute();
const { $toast } = useNuxtApp();
const notificationStore = useNotificationStore();
const { enablePushNotifications, disablePushNotifications, sendLiveBrowserTestPush } =
  usePushNotifications();

const isSendingTest = ref(false);

async function handleToggleBrowserPush() {
  if (notificationStore.isSubscribed) {
    await disablePushNotifications();
    $toast?.info?.('Browser push alerts paused on this device.');
  } else {
    const res = await enablePushNotifications();
    if (res.ok) {
      $toast?.success?.('Browser subscribed to live Web Push & In-App notifications.');
    } else if (res.message) {
      $toast?.warning?.(res.message);
    }
  }
}

async function handleSendTest() {
  isSendingTest.value = true;
  try {
    const sent = await sendLiveBrowserTestPush();
    if (sent) {
      $toast?.success?.('Live test notification dispatched to your browser.');
    } else {
      $toast?.warning?.('Allow browser notifications first to receive a test push.');
    }
  } finally {
    isSendingTest.value = false;
  }
}
</script>
