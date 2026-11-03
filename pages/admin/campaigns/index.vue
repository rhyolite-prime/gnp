<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <CampaignsSubNav
      title="Campaigns & Multi-Channel Messaging"
      subtitle="Unified analytics across Browser & In-App Notifications, Email newsletters, and SMS broadcasts."
    />

    <!-- Filter Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div class="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
        <button
          v-for="opt in periodOptions"
          :key="opt.value"
          type="button"
          @click="selectedPeriod = opt.value"
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
          :class="
            selectedPeriod === opt.value
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          {{ opt.label }}
        </button>
      </div>

      <div class="flex items-center gap-3 text-xs text-gray-500">
        <span class="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <span class="h-2 w-2 rounded-full bg-green-500" />
          <span>{{ overview?.pushHealth.activeWebPushSubscriptions ?? 0 }} Web Push Devices</span>
          <span class="text-gray-300">|</span>
          <span>{{ overview?.pushHealth.connectedLiveStreams ?? 0 }} Live In-App Streams</span>
        </span>

        <button
          type="button"
          @click="loadOverview"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
        >
          <ArrowPathIcon class="h-3.5 w-3.5" :class="{ 'animate-spin': loading }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && !overview" class="py-20 text-center bg-white rounded-xl border border-gray-200">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
      <p class="mt-3 text-sm text-gray-500">Loading campaign performance metrics...</p>
    </div>

    <div v-else-if="overview" class="space-y-6">
      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="kpi in overview.kpis"
          :key="kpi.key"
          class="bg-white rounded-xl p-5 shadow-xs border border-gray-200 flex flex-col justify-between"
        >
          <span class="text-xs font-medium text-gray-500">{{ kpi.label }}</span>
          <div class="mt-2 flex items-baseline justify-between gap-2">
            <span class="text-2xl font-bold text-gray-900">
              {{ formatKpiValue(kpi.value, kpi.format) }}
            </span>
            <span
              v-if="kpi.changePct !== undefined"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="
                kpi.changePct >= 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              "
            >
              {{ kpi.changePct >= 0 ? '+' : '' }}{{ kpi.changePct }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Apache ECharts 2x2 Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="chart in overview.charts"
          :key="chart.id"
          class="bg-white rounded-xl p-5 shadow-xs border border-gray-200"
        >
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold text-gray-900">{{ chart.title }}</h2>
          </div>

          <ClientOnly>
            <div
              :ref="(el) => setChartEl(chart.id, el as HTMLElement | null)"
              class="w-full h-72"
            />
            <template #fallback>
              <div class="w-full h-72 flex items-center justify-center text-xs text-gray-400">
                Initializing chart...
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Recent Broadcasts Snapshot + Link to History -->
      <div class="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-gray-900">Recent Broadcast Activity</h2>
            <p class="text-xs text-gray-500">Latest multi-channel sends and upcoming scheduled dispatches</p>
          </div>
          <NuxtLink
            to="/admin/campaigns/history"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All History ({{ overview.statusBreakdown.all }}) &rarr;
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in overview.recentBroadcasts" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                  <p class="text-xs text-gray-500 truncate max-w-xs">{{ item.pushTitle || item.subject }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="ch in item.channels"
                      :key="ch"
                      class="px-2 py-0.5 text-xs font-medium rounded-md border"
                      :class="channelBadgeClass(ch)"
                    >
                      {{ formatChannel(ch) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  {{ item.audienceLabel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize"
                    :class="statusBadgeClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {{ item.metrics.delivered.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                  {{ item.metrics.openRate ? `${item.metrics.openRate}%` : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import * as echarts from 'echarts/core.js';
import { CanvasRenderer } from 'echarts/renderers.js';
import { BarChart, LineChart, PieChart, FunnelChart, HeatmapChart } from 'echarts/charts.js';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from 'echarts/components.js';
import CampaignsSubNav from '~/components/campaigns/CampaignsSubNav.vue';
import {
  fetchCampaignsOverview,
  type CampaignsOverviewResult,
  type MessagingChannel,
  type BroadcastStatus,
} from '~/services/campaigns';
import { buildEChartOptionFromPlainData } from '~/utils/reportChartOption.js';

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
]);

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
});

const periodOptions = [
  { label: 'Last 7 Days', value: '7d' as const },
  { label: 'Last 14 Days', value: '14d' as const },
  { label: 'Last 30 Days', value: '30d' as const },
];

const selectedPeriod = ref<'7d' | '14d' | '30d'>('14d');
const loading = ref(true);
const overview = ref<CampaignsOverviewResult | null>(null);

const chartElements = new Map<string, HTMLElement>();
const chartInstances = new Map<string, echarts.ECharts>();

function setChartEl(id: string, el: HTMLElement | null) {
  if (el) {
    chartElements.set(id, el);
  } else {
    chartElements.delete(id);
  }
}

function renderAllCharts() {
  if (!import.meta.client || !overview.value?.charts?.length) return;

  for (const spec of overview.value.charts) {
    const container = chartElements.get(spec.id);
    if (!container) continue;

    let instance = chartInstances.get(spec.id);
    if (!instance || instance.isDisposed()) {
      instance = echarts.init(container);
      chartInstances.set(spec.id, instance);
    }
    const option = buildEChartOptionFromPlainData(spec);
    instance.setOption(option, true);
    instance.resize();
  }
}

function handleResize() {
  chartInstances.forEach((instance) => {
    if (!instance.isDisposed()) instance.resize();
  });
}

async function loadOverview() {
  loading.value = true;
  try {
    overview.value = await fetchCampaignsOverview(selectedPeriod.value);
    await nextTick();
    setTimeout(renderAllCharts, 40);
  } finally {
    loading.value = false;
  }
}

watch(selectedPeriod, () => {
  loadOverview();
});

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  await loadOverview();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstances.forEach((inst) => inst.dispose());
  chartInstances.clear();
});

function formatKpiValue(value: number, format: 'number' | 'percent' | 'currency'): string {
  if (format === 'currency') {
    return `GH₵ ${Number(value || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (format === 'percent') {
    return `${Number(value || 0).toFixed(1)}%`;
  }
  return Number(value || 0).toLocaleString();
}

function formatChannel(ch: MessagingChannel): string {
  if (ch === 'push') return 'Browser & In-App';
  if (ch === 'email') return 'Email';
  return 'SMS';
}

function channelBadgeClass(ch: MessagingChannel): string {
  if (ch === 'push') return 'bg-red-50 text-red-700 border-red-200';
  if (ch === 'email') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

function statusBadgeClass(status: BroadcastStatus): string {
  if (status === 'sent') return 'bg-green-100 text-green-800';
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-800';
}
</script>
