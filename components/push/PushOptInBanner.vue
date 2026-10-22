<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="shouldShowBanner"
      class="fixed bottom-4 left-4 z-40 max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5"
    >
      <div class="flex items-start gap-3.5">
        <div class="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:bell-ring" class="h-5 w-5 text-red-600" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-sm font-extrabold text-gray-900">
              Enable Instant Breaking News & Edition Alerts
            </h4>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              @click="dismissForWeek"
            >
              <Icon name="lucide:x" class="h-4 w-4" />
            </button>
          </div>

          <p class="text-xs text-gray-600 mt-1 leading-relaxed">
            Get notified the moment major Ghana stories break and when the 5:30 AM
            <strong>Daily Graphic</strong> digital edition drops.
          </p>

          <div class="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              :disabled="isSubscribing"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              @click="handleOptIn"
            >
              <Icon name="lucide:bell" class="h-3.5 w-3.5" />
              <span>{{ isSubscribing ? 'Activating...' : 'Allow Browser Alerts' }}</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              @click="openPreferences"
            >
              <span>Customize Topics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';

const DISMISS_KEY = 'gnp_push_optin_dismissed_until';
const route = useRoute();
const { isSubscribed, isSubscribing, isCenterOpen, enableBrowserPush } = usePushNotifications();

const dismissed = ref(true);

onMounted(() => {
  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) || '0');
    dismissed.value = Date.now() < until;
  } catch {
    dismissed.value = false;
  }
});

const shouldShowBanner = computed(() => {
  if (dismissed.value || isSubscribed.value) return false;
  if (route.path.startsWith('/admin') || route.path.includes('/login')) return false;
  return true;
});

async function handleOptIn() {
  await enableBrowserPush();
  dismissed.value = true;
}

function openPreferences() {
  dismissed.value = true;
  isCenterOpen.value = true;
}

function dismissForWeek() {
  dismissed.value = true;
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 3600 * 1000));
  } catch {
    // Ignore storage error
  }
}
</script>
