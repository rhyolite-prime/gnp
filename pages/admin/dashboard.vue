<template>
  <div class="space-y-6 pb-10">
    <!-- Executive Header -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            Executive Command Center
          </span>
          <span class="text-xs text-gray-500">Real-time Newsroom & Commercial Telemetry</span>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Graphic NewsPlus Admin Dashboard</h1>
        <p class="mt-0.5 text-sm text-gray-500">
          Consolidated performance across subscriptions, Paystack settlements, B2B partners, and digital archives.
        </p>
      </div>

      <NuxtLink
        to="/admin/reports"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors shrink-0"
      >
        <Icon name="lucide:bar-chart-3" class="h-4 w-4" />
        <span>Open All 26 Platform Reports</span>
      </NuxtLink>
    </div>

    <!-- 4 KPI Sparkline Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <ReportKpiSparkCard v-for="m in kpiCards" :key="m.key" :metric="m" />
    </div>

    <!-- Apache ECharts Executive Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7">
        <EChartCanvas
          title="14-Day Revenue & Paid Subscriber Velocity"
          subtitle="Daily Paystack & B2B collections (GHS) vs new subscriber activations"
          chart-type-badge="Dual-Axis Bar + Area"
          :option="revenueGrowthOption"
          :height="320"
          export-filename="executive-revenue-velocity"
        />
      </div>

      <div class="lg:col-span-5">
        <EChartCanvas
          title="Monthly Revenue Mix by Stream (GHS 312.5k)"
          subtitle="Diversification across B2C plans, B2B bulk seats & Institutional Archives"
          chart-type-badge="Donut"
          :option="revenueMixOption"
          :height="320"
          export-filename="executive-revenue-mix"
        />
      </div>
    </div>

    <!-- Bottom Grid: Live Activity Stream + Quick Module Launchpad -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Icon name="lucide:activity" class="h-4 w-4 text-red-600" />
            Live Platform Operations Stream
          </h3>
          <NuxtLink to="/admin/reports" class="text-xs font-semibold text-red-600 hover:text-red-700">
            Audit Logs &rarr;
          </NuxtLink>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="item in summary.recentActivities"
            :key="item.id"
            class="py-3 flex items-start justify-between gap-3 text-xs"
          >
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                  {{ item.badge }}
                </span>
                <span class="font-bold text-gray-900">{{ item.actor }}</span>
              </div>
              <p class="text-gray-600">{{ item.event }}</p>
            </div>
            <span class="text-gray-400 whitespace-nowrap shrink-0">{{ item.time }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-bold text-gray-900">Quick Analytics Shortcuts</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="p-3.5 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <Icon :name="link.icon" class="h-5 w-5 text-red-600" />
              <Icon name="lucide:arrow-up-right" class="h-4 w-4 text-gray-400 group-hover:text-red-600" />
            </div>
            <p class="text-xs font-bold text-gray-900 mt-2">{{ link.title }}</p>
            <p class="text-[11px] text-gray-500 mt-0.5">{{ link.desc }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import type { ReportKpiMetric } from '~/models/reports';
import {
  BASE_TOOLTIP,
  BOTTOM_LEGEND,
  DUAL_AXIS_GRID,
  GNP_PALETTE,
  areaGradient,
  barGradient,
  categoryXAxis,
  valueYAxis,
} from '~/utils/echartsHelpers';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import ReportKpiSparkCard from '~/components/reports/ReportKpiSparkCard.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const summary = ref({
  totalUsers: 28450,
  activeSubscriptions: 15820,
  monthlyRevenue: 312480,
  totalPartners: 14,
  userGrowthPct: 14.8,
  revenueGrowthPct: 21.3,
  days: Array.from({ length: 14 }, (_, i) => dayjs('2026-10-22').subtract(13 - i, 'day').format('DD MMM')),
  dailyRevenue: [9420, 10180, 9860, 11240, 12650, 8920, 8410, 10940, 11680, 12390, 13120, 14480, 10290, 11850],
  dailySignups: [64, 72, 68, 85, 94, 58, 52, 79, 84, 91, 97, 112, 74, 88],
  revenueByStream: [
    { name: 'Individual Subscriptions', value: 148200 },
    { name: 'B2B Partner Bulk Invoices', value: 96400 },
    { name: 'Institutional Archive Credits', value: 42800 },
    { name: 'Single-Copy Paystack Purchases', value: 25080 },
  ],
  recentActivities: [
    { id: 'ACT-1', time: '12 mins ago', actor: 'Paystack Webhook', event: 'Settled 48 recurring MTN MoMo renewals (GHS 3,120.00)', badge: 'FINANCE' },
    { id: 'ACT-2', time: '41 mins ago', actor: 'MTN Ghana PLC', event: 'Onboarded 24 corporate subscribers via Partner API v1', badge: 'PARTNER' },
    { id: 'ACT-3', time: '1 hr ago', actor: 'OCR Worker #2', event: 'Indexed Daily Graphic 22 Oct 2026 (48 pages, 168 articles, embeddings stored)', badge: 'INGESTION' },
    { id: 'ACT-4', time: '3 hrs ago', actor: 'University of Ghana', event: 'Topped up +2,500 Archive Research Credits (INV-ARC-412)', badge: 'ARCHIVES' },
    { id: 'ACT-5', time: '5 hrs ago', actor: 'Ama Serwaa (Finance)', event: 'Dispatched Oct 2026 VAT/GETFund Invoice to GCB Bank PLC', badge: 'BILLING' },
  ],
});

onMounted(async () => {
  try {
    const res = await $fetch<any>('/api/v1/portal-analytics/admin-executive-summary');
    if (res?.success && res.result) {
      summary.value = res.result;
    }
  } catch {
    // Keep pre-rendered executive data
  }
});

const kpiCards = computed<ReportKpiMetric[]>(() => [
  {
    key: 'rev',
    label: '30-Day Platform Revenue',
    value: `GHS ${summary.value.monthlyRevenue.toLocaleString()}`,
    rawValue: summary.value.monthlyRevenue,
    changePercent: summary.value.revenueGrowthPct,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Paystack + B2B Invoices + Archive Credits',
    sparkline: summary.value.dailyRevenue,
  },
  {
    key: 'subs',
    label: 'Active Paid Subscriptions',
    value: summary.value.activeSubscriptions.toLocaleString(),
    rawValue: summary.value.activeSubscriptions,
    changePercent: 11.4,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Individual + Corporate bulk seats',
    sparkline: summary.value.dailySignups,
  },
  {
    key: 'users',
    label: 'Registered Readers',
    value: summary.value.totalUsers.toLocaleString(),
    rawValue: summary.value.totalUsers,
    changePercent: summary.value.userGrowthPct,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Ghana (74.2%) & Diaspora (25.8%)',
  },
  {
    key: 'partners',
    label: 'Active B2B Commercial Partners',
    value: String(summary.value.totalPartners),
    rawValue: summary.value.totalPartners,
    changePercent: 16.7,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: '84.2% seat quota utilization',
  },
]);

const revenueGrowthOption = computed(() => ({
  color: ['#dc2626', '#059669'],
  tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
  legend: BOTTOM_LEGEND,
  grid: DUAL_AXIS_GRID,
  xAxis: categoryXAxis(summary.value.days),
  yAxis: [valueYAxis('GHS', '₵'), valueYAxis('Signups')],
  series: [
    {
      name: 'Daily Revenue (GHS)',
      type: 'bar',
      barMaxWidth: 20,
      itemStyle: { color: barGradient('#dc2626', '#991b1b'), borderRadius: [5, 5, 0, 0] },
      data: summary.value.dailyRevenue,
    },
    {
      name: 'New Paid Signups',
      type: 'line',
      yAxisIndex: 1,
      smooth: 0.35,
      lineStyle: { width: 3, color: '#059669' },
      areaStyle: { color: areaGradient('#059669', 0.2) },
      data: summary.value.dailySignups,
    },
  ],
}));

const revenueMixOption = computed(() => ({
  color: GNP_PALETTE,
  tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}<br/><b>GHS {c}</b> ({d}%)' },
  legend: BOTTOM_LEGEND,
  series: [
    {
      name: 'Revenue Stream',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: summary.value.revenueByStream,
    },
  ],
}));

const quickLinks = [
  { to: '/admin/reports', title: '26 Platform Reports', desc: 'Full SQL & API contracts', icon: 'lucide:file-bar-chart-2' },
  { to: '/admin/affiliates/dashboard', title: 'Affiliate Program', desc: 'Commissions & MoMo payouts', icon: 'lucide:megaphone' },
  { to: '/admin/archives/dashboard', title: 'Archives & AI RAG', desc: '1950–2026 search & credits', icon: 'lucide:library' },
  { to: '/partners/dashboard/reports', title: 'Partner B2B Portal', desc: 'API health & corporate reads', icon: 'lucide:building-2' },
];
</script>
