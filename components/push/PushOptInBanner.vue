<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 -translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <div
      v-if="shouldShowPrompt"
      role="dialog"
      aria-label="Allow Browser & In-App Notifications"
      class="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 ring-1 ring-black/5 p-5"
    >
      <div class="flex items-start gap-4">
        <div class="relative h-12 w-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:bell-ring" class="h-6 w-6 text-primary-600" />
          <span class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-600" />
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-gray-900">
                Allow Browser &amp; In-App Notifications?
              </h3>
              <p class="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                Stay ahead with instant breaking news alerts, 5:30 AM
                <strong>Daily Graphic</strong> edition drops, and important updates.
              </p>
            </div>

            <button
              type="button"
              aria-label="Dismiss notification prompt"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer shrink-0"
              @click="dismissForSession"
            >
              <Icon name="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              @click="dismissForSession"
            >
              Not Now
            </button>

            <button
              v-if="authStore.isAuthenticated"
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              @click="openTopicSettings"
            >
              Customize Topics
            </button>

            <button
              type="button"
              :disabled="isSubscribing"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              @click="handleAcceptNotifications"
            >
              <Icon name="lucide:bell" class="h-4 w-4" />
              <span>{{ isSubscribing ? 'Requesting Permission...' : 'Allow Notifications' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Icon from '~/components/reports/Icon.vue';
import { usePushNotifications } from '~/composables/usePushNotifications';
import { useNotificationStore } from '~/stores/notification';
import { useBasicAuthStore } from '~/stores/basic-user-auth';

const SESSION_DISMISS_KEY = 'gnp_push_prompt_dismissed_session';
const route = useRoute();
const authStore = useBasicAuthStore();
const notificationStore = useNotificationStore();
const {
  permissionState,
  isSubscribed,
  isSubscribing,
  isCenterOpen,
  enableBrowserPush,
} = usePushNotifications();

const hydrated = ref(false);
const dismissedThisSession = ref(false);

onMounted(() => {
  try {
    localStorage.removeItem('gnp_push_optin_dismissed_until');
    dismissedThisSession.value = sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
  } catch {
    dismissedThisSession.value = false;
  }
  setTimeout(() => {
    hydrated.value = true;
  }, 250);
});

watch(
  () => route.path,
  (nextPath) => {
    if (nextPath === '/' && !isSubscribed.value) {
      try {
        dismissedThisSession.value = sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
      } catch {
        dismissedThisSession.value = false;
      }
    }
  }
);

const shouldShowPrompt = computed(() => {
  if (!hydrated.value || dismissedThisSession.value || isSubscribed.value) return false;
  // Never show prompt if browser permission was explicitly disallowed or unsupported
  if (permissionState.value !== 'default') return false;
  if (route.path.startsWith('/admin') || route.path.includes('/login')) return false;
  return true;
});

async function handleAcceptNotifications() {
  const res = await enableBrowserPush();
  if (res.ok) {
    dismissedThisSession.value = true;
    notificationStore.addNotification(
      {
        notificationId: `welcome-optin-${Date.now()}`,
        subject: 'Notifications Enabled on Graphic NewsPlus',
        messageBody: res.message,
        category: 'platform_updates',
        urgency: 'normal',
        deepLink: '/newspapers',
        timestamp: Date.now(),
      },
      { showToast: true }
    );
  } else if (res.permission === 'denied') {
    // User explicitly disallowed notifications in the browser prompt — dismiss quietly with zero enabled popup
    dismissForSession();
  }
}

function openTopicSettings() {
  isCenterOpen.value = true;
}

function dismissForSession() {
  dismissedThisSession.value = true;
  try {
    sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
  } catch {
    // Ignore storage error
  }
}
</script>
