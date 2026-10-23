<template>
  <div class="relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-100/50 blur-3xl opacity-60 animate-pulse"></div>
      <div class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-[80%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-50/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Subtle Index-Page Opt-In Strip (only shown when notifications are undecided & unsubscribed) -->
    <ClientOnly>
      <div
        v-if="!isSubscribed && permissionState === 'default'"
        class="relative z-20 bg-slate-900 text-white border-b border-slate-800"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 text-xs sm:text-sm">
            <span class="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span>
              <strong>Breaking News &amp; Morning Edition Alerts:</strong>
              Enable browser &amp; in-app notifications so you never miss a major update.
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="isSubscribing"
              @click="handleAllowFromStrip"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{{ isSubscribing ? 'Requesting Permission...' : 'Allow Notifications' }}</span>
            </button>
            <button
              v-if="authStore.isAuthenticated"
              type="button"
              @click="isCenterOpen = true"
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Preferences
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Content -->
    <div class="relative z-10">
      <HeroSection />
      <NewspapersSection />
      <TopStoriesSection />
      <VideosSection />
      <MagazinesSection />
      <TopicsSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePushNotifications } from '~/composables/usePushNotifications';
import { useNotificationStore } from '~/stores/notification';
import { useBasicAuthStore } from '~/stores/basic-user-auth';

const authStore = useBasicAuthStore();
const notificationStore = useNotificationStore();
const { permissionState, isSubscribed, isSubscribing, isCenterOpen, enableBrowserPush } =
  usePushNotifications();

async function handleAllowFromStrip() {
  const res = await enableBrowserPush();
  if (res.ok) {
    notificationStore.addNotification(
      {
        notificationId: `welcome-strip-${Date.now()}`,
        subject: 'Notifications Enabled on Graphic NewsPlus',
        messageBody: res.message,
        category: 'platform_updates',
        urgency: 'normal',
        deepLink: '/newspapers',
        timestamp: Date.now(),
      },
      { showToast: true }
    );
  }
}

// Page metadata
useHead({
  title: 'Graphic NewsPlus - Digital News Platform',
  meta: [
    { name: 'description', content: 'Ghana\'s leading digital news platform providing access to trusted newspapers, magazines, and breaking news.' }
  ]
});
</script>
