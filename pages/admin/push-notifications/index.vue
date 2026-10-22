<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Push Notifications</h1>
        <p class="text-sm text-gray-500">
          Compose and dispatch browser push alerts and platform updates to subscribed readers.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          :disabled="isSendingTest"
          @click="handleSendTest"
          class="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <BellAlertIcon class="h-4 w-4 mr-2 text-gray-500" />
          {{ isSendingTest ? 'Sending Test...' : 'Send Test Alert' }}
        </button>

        <button
          type="button"
          @click="handleToggleThisBrowser"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white transition-colors"
          :class="notificationStore.isSubscribed ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'"
        >
          <CheckCircleIcon v-if="notificationStore.isSubscribed" class="h-4 w-4 mr-2" />
          <BellIcon v-else class="h-4 w-4 mr-2" />
          {{ notificationStore.isSubscribed ? 'Browser Subscribed' : 'Subscribe This Browser' }}
        </button>
      </div>
    </div>

    <!-- Stats Grid (matching Admin Dashboard & Affiliate Dashboard) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
          <span
            class="text-xs font-medium px-2.5 py-0.5 rounded-full"
            :class="stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'"
          >
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-sm font-medium text-gray-500">{{ stat.name }}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="stat.value" :duration="1.5" :options="{ prefix: stat.prefix, suffix: stat.suffix, decimalPlaces: stat.decimals || 0 }" />
        </p>
      </div>
    </div>

    <!-- Composer + Preview Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Composer Card (2/3) -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">New Broadcast</h2>
            <p class="text-sm text-gray-500">Configure payload, target segment, and delivery timing</p>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="preset in presets"
              :key="preset.id"
              type="button"
              @click="applyPreset(preset)"
              class="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <form @submit.prevent="handleDispatch" class="p-6 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="form.category"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white"
              >
                <option v-for="t in topics" :key="t.id" :value="t.id">{{ t.label }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Audience Segment</label>
              <select
                v-model="form.targetSegment"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white"
              >
                <option value="all_subscribers">All Subscribed Browsers</option>
                <option value="paid_active">Paid Active Subscribers</option>
                <option value="free_readers">Free Registered Readers</option>
                <option value="corporate_b2b">Corporate B2B Readers</option>
                <option value="ghana_readers">Ghana Readers</option>
                <option value="diaspora_readers">Diaspora Readers</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="form.urgency"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white"
              >
                <option value="high">High (Persistent Alert)</option>
                <option value="normal">Normal</option>
                <option value="low">Low (Silent Digest)</option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Notification Title</label>
              <span class="text-xs text-gray-400">{{ form.title.length }}/90</span>
            </div>
            <input
              v-model="form.title"
              type="text"
              maxlength="90"
              required
              placeholder="e.g. Daily Graphic Friday Edition is Ready"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Message Body</label>
              <span class="text-xs text-gray-400">{{ form.body.length }}/220</span>
            </div>
            <textarea
              v-model="form.body"
              rows="3"
              maxlength="220"
              required
              placeholder="Write a clear summary for the notification banner..."
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
              <input
                v-model="form.deepLink"
                type="text"
                placeholder="/newspapers"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hero Banner Image (Optional)</label>
              <input
                v-model="form.imageUrl"
                type="text"
                placeholder="https://example.com/banner.jpg"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Primary Button Label (Optional)</label>
              <input
                v-model="primaryActionTitle"
                type="text"
                maxlength="28"
                placeholder="Read Now"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Timing</label>
              <div class="flex items-center gap-3">
                <select
                  v-model="form.scheduleMode"
                  class="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white"
                >
                  <option value="now">Send Immediately</option>
                  <option value="scheduled">Schedule</option>
                </select>
                <input
                  v-if="form.scheduleMode === 'scheduled'"
                  v-model="form.scheduledAt"
                  type="datetime-local"
                  required
                  class="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-500">
              Estimated reach: <span class="font-semibold text-gray-900">{{ estimatedAudience.toLocaleString() }}</span> browsers
            </p>

            <button
              type="submit"
              :disabled="isDispatching"
              class="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
            >
              <PaperAirplaneIcon class="h-4 w-4 mr-2" />
              {{ isDispatching ? 'Dispatching...' : form.scheduleMode === 'scheduled' ? 'Schedule Broadcast' : 'Send Broadcast' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Live Preview Card (1/3) -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Live Preview</h2>
            <select
              v-model="previewPlatform"
              class="text-xs border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-1"
            >
              <option value="desktop">Desktop Browser</option>
              <option value="mobile">Mobile Lockscreen</option>
            </select>
          </div>

          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div class="flex items-center gap-2">
                  <span class="inline-flex h-5 w-5 items-center justify-center rounded bg-primary-600 text-[10px] font-bold text-white">G</span>
                  <span class="font-medium text-gray-800">Graphic NewsPlus</span>
                </div>
                <span>now</span>
              </div>

              <p class="text-sm font-semibold text-gray-900 leading-snug">
                {{ form.title || 'Notification headline preview' }}
              </p>
              <p class="mt-1 text-xs text-gray-600 leading-relaxed">
                {{ form.body || 'Notification message summary appears here as you type.' }}
              </p>

              <img
                v-if="form.imageUrl"
                :src="form.imageUrl"
                alt="Preview banner"
                class="mt-3 h-32 w-full rounded-lg object-cover border border-gray-100"
              />

              <div v-if="primaryActionTitle" class="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span class="text-xs font-medium text-primary-600">{{ primaryActionTitle }}</span>
                <span class="text-[11px] text-gray-400">{{ previewPlatform === 'mobile' ? 'Android / iOS Web Push' : 'Chrome / Edge / Safari' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection Status Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Delivery Status</h2>
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Service Worker</span>
              <span class="font-medium" :class="notificationStore.swReady ? 'text-green-600' : 'text-amber-600'">
                {{ notificationStore.swReady ? 'Active (/sw-push.js)' : 'Initializing' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Live Stream</span>
              <span class="font-medium" :class="notificationStore.sseConnected ? 'text-green-600' : 'text-amber-600'">
                {{ notificationStore.sseConnected ? 'Connected' : 'Standby' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Browser Permission</span>
              <span class="font-medium text-gray-900 capitalize">{{ notificationStore.permissionState }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Row (Apache ECharts) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">14-Day Delivery & Click Performance</h2>
        <EChartCanvas v-if="deliveryChartOption" :option="deliveryChartOption" :height="270" />
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Browser Breakdown</h2>
        <EChartCanvas v-if="browserChartOption" :option="browserChartOption" :height="270" />
      </div>
    </div>

    <!-- Broadcast History Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Recent & Scheduled Broadcasts</h2>
        <span class="text-xs text-gray-500">{{ broadcasts.length }} broadcasts</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broadcast</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in broadcasts" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 max-w-md truncate">{{ item.title }}</div>
                <div class="text-xs text-gray-500">{{ item.sentAt || item.scheduledAt }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ segmentLabels[item.targetSegment] || item.targetSegment }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {{ item.deliveredCount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                {{ item.ctrPercent.toFixed(1) }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                  :class="
                    item.status === 'sent'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'scheduled'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-700'
                  "
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <template v-if="item.status === 'scheduled'">
                  <button type="button" @click="triggerScheduledNow(item.id)" class="text-primary-600 hover:text-primary-900">
                    Send Now
                  </button>
                  <button type="button" @click="cancelScheduled(item.id)" class="text-gray-500 hover:text-red-600">
                    Cancel
                  </button>
                </template>
                <span v-else class="text-xs text-gray-400">Completed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import {
  BellIcon,
  BellAlertIcon,
  PaperAirplaneIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import type {
  PushCategory,
  PushDashboardPayload,
  PushDispatchRequestDto,
  PushTargetSegment,
  PushUrgency,
} from '~/models/pushNotifications';
import {
  PUSH_TOPIC_DEFINITIONS,
  cancelScheduledBroadcastApi,
  dispatchPushBroadcastApi,
  fetchPushDashboardApi,
  triggerScheduledBroadcastApi,
} from '~/services/pushNotifications';
import { createCartesianOption, createPieOption } from '~/utils/echartsHelpers';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const { $toast } = useNuxtApp();
const notificationStore = useNotificationStore();
const { enablePushNotifications, disablePushNotifications, sendLiveBrowserTestPush } =
  usePushNotifications();

const topics = PUSH_TOPIC_DEFINITIONS;
const dashboard = ref<PushDashboardPayload | null>(null);
const isDispatching = ref(false);
const isSendingTest = ref(false);
const previewPlatform = ref<'desktop' | 'mobile'>('desktop');
const primaryActionTitle = ref('Read Edition');

const form = reactive<{
  title: string;
  body: string;
  category: PushCategory;
  urgency: PushUrgency;
  deepLink: string;
  imageUrl: string;
  targetSegment: PushTargetSegment;
  scheduleMode: 'now' | 'scheduled';
  scheduledAt: string;
}>({
  title: 'Daily Graphic Friday Edition Now Live — Read the 48-Page Digital Replica',
  body: 'Top stories: 2027 Fiscal Framework, Tema Port Expansion & Weekend Sports Preview.',
  category: 'morning_edition',
  urgency: 'normal',
  deepLink: '/newspapers',
  imageUrl: '',
  targetSegment: 'all_subscribers',
  scheduleMode: 'now',
  scheduledAt: '2026-10-23T05:30',
});

interface QuickPreset {
  id: string;
  label: string;
  title: string;
  body: string;
  category: PushCategory;
  urgency: PushUrgency;
  deepLink: string;
  actionLabel: string;
}

const presets: QuickPreset[] = [
  {
    id: 'breaking',
    label: 'Breaking News',
    title: 'BREAKING: Bank of Ghana Holds Policy Rate Following MPC Review',
    body: 'Read Graphic Business live coverage, economist reaction, and market impact across Ghana.',
    category: 'breaking_news',
    urgency: 'high',
    deepLink: '/newspapers',
    actionLabel: 'Read Live Story',
  },
  {
    id: 'edition',
    label: 'Morning Edition',
    title: 'Good Morning Ghana: Today’s Daily Graphic & Graphic Sports Are Ready',
    body: 'Flip through full page-turn replicas or switch to clean article view on any device.',
    category: 'morning_edition',
    urgency: 'normal',
    deepLink: '/newspapers',
    actionLabel: 'Open Newsstand',
  },
  {
    id: 'update',
    label: 'Platform Update',
    title: 'New Feature: Instant Browser Push & Offline Reading Improvements',
    body: 'Customize alert topics and quiet hours anytime from your notification bell.',
    category: 'platform_updates',
    urgency: 'normal',
    deepLink: '/account',
    actionLabel: 'Explore',
  },
  {
    id: 'promo',
    label: 'Renewal Offer',
    title: 'Renew Your Graphic NewsPlus Plan with 1-Tap MTN MoMo Checkout',
    body: 'Keep uninterrupted access to all 6 Graphic publications plus historical archives.',
    category: 'subscription_billing',
    urgency: 'normal',
    deepLink: '/packages',
    actionLabel: 'View Plans',
  },
];

function applyPreset(p: QuickPreset) {
  form.title = p.title;
  form.body = p.body;
  form.category = p.category;
  form.urgency = p.urgency;
  form.deepLink = p.deepLink;
  primaryActionTitle.value = p.actionLabel;
}

const segmentAudienceMap: Record<PushTargetSegment, number> = {
  all_subscribers: 14820,
  paid_active: 9640,
  free_readers: 5180,
  corporate_b2b: 3420,
  ghana_readers: 10520,
  diaspora_readers: 4300,
};

const segmentLabels: Record<string, string> = {
  all_subscribers: 'All Subscribers',
  paid_active: 'Paid Active',
  free_readers: 'Free Readers',
  corporate_b2b: 'Corporate B2B',
  ghana_readers: 'Ghana Readers',
  diaspora_readers: 'Diaspora Readers',
};

const estimatedAudience = computed(() => segmentAudienceMap[form.targetSegment] || 14820);

const stats = computed(() => {
  const k = dashboard.value?.kpis;
  return [
    {
      name: 'Subscribed Browsers',
      value: k?.activeEndpoints ?? 14820,
      change: '+14.6%',
      changeType: 'increase',
      icon: BellIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      prefix: '',
      suffix: '',
      decimals: 0,
    },
    {
      name: 'Delivered (30 Days)',
      value: k?.sentLast30d ?? 129610,
      change: '98.4% delivery',
      changeType: 'increase',
      icon: PaperAirplaneIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      prefix: '',
      suffix: '',
      decimals: 0,
    },
    {
      name: 'Average CTR',
      value: k?.avgCtrPercent ?? 17.8,
      change: '+2.3%',
      changeType: 'increase',
      icon: CursorArrowRaysIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      prefix: '',
      suffix: '%',
      decimals: 1,
    },
    {
      name: 'Scheduled Queue',
      value: k?.scheduledCount ?? 2,
      change: 'Upcoming',
      changeType: 'neutral',
      icon: ClockIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      prefix: '',
      suffix: '',
      decimals: 0,
    },
  ];
});

const broadcasts = computed(() => dashboard.value?.broadcasts || []);

const deliveryChartOption = computed<EChartsOption | null>(() => {
  const ts = dashboard.value?.deliveryTimeSeries;
  if (!ts) return null;
  return createCartesianOption({
    categories: ts.dates,
    yAxisName: 'Delivered',
    secondaryYAxisName: 'Clicked',
    series: [
      { name: 'Delivered', type: 'bar', data: ts.delivered, color: '#2563EB' },
      { name: 'Clicked', type: 'line', yAxisIndex: 1, data: ts.clicked, color: '#DC2626', area: true },
    ],
  });
});

const browserChartOption = computed<EChartsOption | null>(() => {
  if (!dashboard.value?.browserBreakdown) return null;
  return createPieOption(dashboard.value.browserBreakdown, { donut: true, centerLabel: 'Browsers' });
});

async function loadDashboard() {
  try {
    dashboard.value = await fetchPushDashboardApi();
  } catch (err) {
    console.error('[PushStudio] Failed to load dashboard:', err);
  }
}

async function handleToggleThisBrowser() {
  if (notificationStore.isSubscribed) {
    await disablePushNotifications();
    $toast?.info?.('Browser push paused for this device.');
  } else {
    const res = await enablePushNotifications();
    if (res.ok) {
      $toast?.success?.('This browser is now subscribed to push notifications.');
    }
  }
  await loadDashboard();
}

async function handleSendTest() {
  isSendingTest.value = true;
  try {
    await sendLiveBrowserTestPush();
    await loadDashboard();
  } finally {
    isSendingTest.value = false;
  }
}

async function handleDispatch() {
  isDispatching.value = true;
  try {
    const payload: PushDispatchRequestDto = {
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      urgency: form.urgency,
      deepLink: form.deepLink.trim() || '/',
      imageUrl: form.imageUrl.trim() || undefined,
      actions: primaryActionTitle.value.trim()
        ? [{ action: 'primary', title: primaryActionTitle.value.trim(), url: form.deepLink.trim() || '/' }]
        : [],
      targetSegment: form.targetSegment,
      scheduleMode: form.scheduleMode,
      scheduledAt: form.scheduleMode === 'scheduled' ? form.scheduledAt : undefined,
    };

    const record = await dispatchPushBroadcastApi(payload);
    if (record.status === 'scheduled') {
      $toast?.success?.(`Broadcast scheduled for ${record.scheduledAt}.`);
    } else {
      $toast?.success?.(`Broadcast dispatched to ${record.deliveredCount.toLocaleString()} browsers.`);
    }
    await loadDashboard();
  } catch {
    $toast?.error?.('Failed to dispatch broadcast.');
  } finally {
    isDispatching.value = false;
  }
}

async function triggerScheduledNow(id: string) {
  await triggerScheduledBroadcastApi(id);
  $toast?.success?.('Scheduled broadcast dispatched.');
  await loadDashboard();
}

async function cancelScheduled(id: string) {
  await cancelScheduledBroadcastApi(id);
  $toast?.info?.('Scheduled broadcast cancelled.');
  await loadDashboard();
}

onMounted(() => {
  loadDashboard();
});
</script>
