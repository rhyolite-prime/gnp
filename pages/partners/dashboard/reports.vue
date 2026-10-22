<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            B2B Partner Telemetry
          </span>
          <span class="text-xs font-medium text-gray-500">
            {{ analyticsCharts?.fullName || 'MTN Ghana PLC' }}
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Reports & API Analytics</h1>
        <p class="mt-0.5 text-sm text-gray-500">
          Track corporate reader engagement across Graphic titles and monitor Partner API v1 health.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <select
          v-model="selectedRange"
          class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
          <option value="ytd">Year to Date (2026)</option>
        </select>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          @click="downloadExecutivePdf"
        >
          <Icon name="lucide:download" class="h-4 w-4" />
          <span>Export PDF Summary</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          type="button"
          class="whitespace-nowrap pb-3 px-1 border-b-2 font-bold text-sm transition-colors cursor-pointer"
          :class="
            activeTab === 'engagement'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          "
          @click="activeTab = 'engagement'"
        >
          Engagement & Readership
        </button>
        <button
          type="button"
          class="whitespace-nowrap pb-3 px-1 border-b-2 font-bold text-sm transition-colors cursor-pointer"
          :class="
            activeTab === 'api'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          "
          @click="activeTab = 'api'"
        >
          API Usage & Health
        </button>
      </nav>
    </div>

    <!-- TAB 1: Engagement & Readership -->
    <div v-if="activeTab === 'engagement'" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiSparkCard v-for="m in engagementKpis" :key="m.key" :metric="m" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7">
          <EChartCanvas
            title="Daily Corporate Reads & Unique Active Readers"
            subtitle="Source: GET /api/v1/partners/analytics/charts (Apache ECharts v6)"
            chart-type-badge="Combo Bar + Area"
            :option="readershipTrendOption"
            :height="315"
            export-filename="partner-daily-reads"
          />
        </div>
        <div class="lg:col-span-5">
          <EChartCanvas
            title="Publication Popularity Breakdown"
            subtitle="Reads across GCGL newspaper titles (`publications.name`)"
            chart-type-badge="Horizontal Bar"
            :option="publicationBarOption"
            :height="315"
            export-filename="partner-publication-popularity"
          />
        </div>
      </div>

      <ReportDataTable
        title="Corporate Publication Readership Breakdown"
        :columns="pubColumns"
        :rows="publicationRows"
        filename="partner-publication-engagement"
      />
    </div>

    <!-- TAB 2: API Usage & Health -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiSparkCard v-for="m in apiKpis" :key="m.key" :metric="m" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7">
          <EChartCanvas
            title="Partner API v1 Request Volume & Error Telemetry"
            subtitle="Source: GET /api/v1/partners/api-keys/usage/stats (`partner_api_request_logs`)"
            chart-type-badge="Dual-Axis Line + Bar"
            :option="apiVolumeChartOption"
            :height="315"
            export-filename="partner-api-volume"
          />
        </div>
        <div class="lg:col-span-5">
          <EChartCanvas
            title="Traffic Share by Partner Endpoint"
            subtitle="Distribution of authenticated API calls by route"
            chart-type-badge="Donut"
            :option="endpointPieOption"
            :height="315"
            export-filename="partner-endpoint-share"
          />
        </div>
      </div>

      <ReportDataTable
        title="Endpoint Latency, Volume & Reliability Breakdown"
        :columns="endpointColumns"
        :rows="apiStats.usageByEndpoint"
        filename="partner-api-endpoints"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { ReportKpiMetric, ReportTableColumn } from '~/models/reports';
import { buildPartnerPortalAnalyticsMock } from '~/utils/reportsMockEngine';
import {
  BASE_GRID,
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
import ReportDataTable from '~/components/reports/ReportDataTable.vue';

definePageMeta({
  middleware: 'partner-auth',
});

const activeTab = ref<'engagement' | 'api'>('engagement');
const selectedRange = ref('30d');

const bundle = ref(buildPartnerPortalAnalyticsMock('30d'));

async function loadAnalytics() {
  try {
    const res = await $fetch<any>('/api/v1/portal-analytics/partner-reports', {
      params: { range: selectedRange.value },
    });
    if (res?.success && res.result) {
      bundle.value = res.result;
      return;
    }
  } catch {
    // Fallback below
  }
  bundle.value = buildPartnerPortalAnalyticsMock(selectedRange.value);
}

watch(selectedRange, loadAnalytics);
onMounted(loadAnalytics);

const engagementReport = computed(() => bundle.value.engagementReport);
const analyticsCharts = computed(() => bundle.value.analyticsCharts);
const apiStats = computed(() => bundle.value.apiStats);

const engagementKpis = computed<ReportKpiMetric[]>(() => {
  const series = analyticsCharts.value.engagementData.map((d: any) => d.reads);
  return [
    {
      key: 'reads',
      label: 'Total Edition Reads',
      value: engagementReport.value.totalReads.toLocaleString(),
      rawValue: engagementReport.value.totalReads,
      changePercent: engagementReport.value.totalReadsChange,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: 'Authenticated corporate subscriber sessions',
      sparkline: series,
    },
    {
      key: 'active',
      label: 'Unique Active Readers',
      value: engagementReport.value.activeReaders.toLocaleString(),
      rawValue: engagementReport.value.activeReaders,
      changePercent: engagementReport.value.activeReadersChange,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: 'Active seats reading >= 1 issue',
      sparkline: analyticsCharts.value.engagementData.map((d: any) => d.activeReaders),
    },
    {
      key: 'duration',
      label: 'Avg. Reading Session',
      value: engagementReport.value.avgSessionDuration,
      rawValue: 500,
      changePercent: 9.4,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: engagementReport.value.avgSessionDurationChange,
    },
    {
      key: 'onboarded',
      label: 'New Seats Onboarded',
      value: engagementReport.value.newMembersOnboarded.toLocaleString(),
      rawValue: engagementReport.value.newMembersOnboarded,
      changePercent: 14.0,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: engagementReport.value.newMembersOnboardedChange,
    },
  ];
});

const apiKpis = computed<ReportKpiMetric[]>(() => [
  {
    key: 'total_req',
    label: 'Total API Calls',
    value: apiStats.value.totalRequests.toLocaleString(),
    rawValue: apiStats.value.totalRequests,
    changePercent: 16.5,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Authenticated via X-Partner-Api-Key',
    sparkline: apiStats.value.usageOverTime.map((d: any) => d.count),
  },
  {
    key: 'succ_rate',
    label: '2xx Success Rate',
    value: `${apiStats.value.successRate}%`,
    rawValue: apiStats.value.successRate,
    changePercent: 0.4,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Target SLA >= 99.0%',
  },
  {
    key: 'latency',
    label: 'Avg Response Latency',
    value: `${apiStats.value.avgLatency} ms`,
    rawValue: apiStats.value.avgLatency,
    changePercent: -7.2,
    changeDirection: 'down',
    positiveIsGood: false,
    subtitle: 'Drogon async thread-pool execution',
    sparkline: apiStats.value.usageOverTime.map((d: any) => d.latencyMs),
  },
  {
    key: 'err_cnt',
    label: '4xx / 5xx Errors',
    value: apiStats.value.errorCount.toLocaleString(),
    rawValue: apiStats.value.errorCount,
    changePercent: -12.4,
    changeDirection: 'down',
    positiveIsGood: false,
    subtitle: 'Mostly duplicate MSISDN validation checks',
  },
]);

const readershipTrendOption = computed(() => ({
  color: ['#dc2626', '#2563eb'],
  tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
  legend: BOTTOM_LEGEND,
  grid: BASE_GRID,
  xAxis: categoryXAxis(analyticsCharts.value.engagementData.map((d: any) => d.date)),
  yAxis: valueYAxis(),
  series: [
    {
      name: 'Total Reads',
      type: 'bar',
      barMaxWidth: 20,
      itemStyle: { color: barGradient('#ef4444', '#b91c1c'), borderRadius: [5, 5, 0, 0] },
      data: analyticsCharts.value.engagementData.map((d: any) => d.reads),
    },
    {
      name: 'Unique Active Readers',
      type: 'line',
      smooth: 0.35,
      lineStyle: { width: 3, color: '#2563eb' },
      areaStyle: { color: areaGradient('#2563eb', 0.2) },
      data: analyticsCharts.value.engagementData.map((d: any) => d.activeReaders),
    },
  ],
}));

const publicationBarOption = computed(() => {
  const pubs = [...analyticsCharts.value.topPublications].reverse();
  return {
    color: ['#059669'],
    tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 20, right: 32, bottom: 24, left: 16, containLabel: true },
    xAxis: valueYAxis(),
    yAxis: categoryXAxis(pubs.map((p: any) => p.name)),
    series: [
      {
        name: 'Corporate Reads',
        type: 'bar',
        barMaxWidth: 20,
        itemStyle: { color: barGradient('#10b981', '#059669'), borderRadius: [0, 6, 6, 0] },
        data: pubs.map((p: any) => p.reads),
      },
    ],
  };
});

const apiVolumeChartOption = computed(() => ({
  color: ['#4f46e5', '#e11d48'],
  tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
  legend: BOTTOM_LEGEND,
  grid: DUAL_AXIS_GRID,
  xAxis: categoryXAxis(apiStats.value.usageOverTime.map((d: any) => d.date)),
  yAxis: [valueYAxis('Requests'), valueYAxis('Errors', '', ' errs')],
  series: [
    {
      name: 'API Requests',
      type: 'line',
      smooth: 0.35,
      lineStyle: { width: 3, color: '#4f46e5' },
      areaStyle: { color: areaGradient('#4f46e5', 0.24) },
      data: apiStats.value.usageOverTime.map((d: any) => d.count),
    },
    {
      name: '4xx/5xx Errors',
      type: 'bar',
      yAxisIndex: 1,
      barMaxWidth: 16,
      itemStyle: { color: '#e11d48', borderRadius: [4, 4, 0, 0] },
      data: apiStats.value.usageOverTime.map((d: any) => d.errors),
    },
  ],
}));

const endpointPieOption = computed(() => ({
  color: GNP_PALETTE,
  tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}<br/><b>{c} calls</b> ({d}%)' },
  legend: BOTTOM_LEGEND,
  series: [
    {
      name: 'Endpoint Calls',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: apiStats.value.usageByEndpoint.map((e: any) => ({
        name: e.endpoint.replace('/api/v1/', ''),
        value: e.count,
      })),
    },
  ],
}));

const pubColumns: ReportTableColumn[] = [
  { key: 'name', label: 'Publication Title', format: 'text' },
  { key: 'reads', label: 'Total Reads', format: 'number', align: 'right' },
  { key: 'sharePct', label: 'Share of Partner Reads', format: 'progress' },
  { key: 'change', label: 'Period Growth', format: 'percent', align: 'right' },
];

const publicationRows = computed(() => {
  const total = analyticsCharts.value.topPublications.reduce((s: number, p: any) => s + p.reads, 0) || 1;
  return analyticsCharts.value.topPublications.map((p: any) => ({
    ...p,
    sharePct: +((p.reads / total) * 100).toFixed(1),
  }));
});

const endpointColumns: ReportTableColumn[] = [
  { key: 'endpoint', label: 'Partner API Route', format: 'code' },
  { key: 'count', label: 'Total Calls', format: 'number', align: 'right' },
  { key: 'successRate', label: '2xx Success Rate', format: 'percent', align: 'right' },
  { key: 'avgLatencyMs', label: 'Avg Latency (ms)', format: 'number', align: 'right' },
];

async function downloadExecutivePdf() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFillColor(217, 45, 32);
  doc.rect(40, 36, 515, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('GRAPHIC NEWSPLUS — PARTNER ANALYTICS EXECUTIVE SUMMARY', 54, 62);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(10);
  doc.text(`Partner Account: ${analyticsCharts.value.fullName}`, 40, 106);
  doc.text(`Range: ${selectedRange.value.toUpperCase()}`, 40, 122);
  doc.text(`Total Reads: ${engagementReport.value.totalReads.toLocaleString()}   |   Active Readers: ${engagementReport.value.activeReaders.toLocaleString()}`, 40, 144);
  doc.text(`API Calls: ${apiStats.value.totalRequests.toLocaleString()}   |   Success Rate: ${apiStats.value.successRate}%   |   Avg Latency: ${apiStats.value.avgLatency}ms`, 40, 162);

  doc.save(`gnp-partner-analytics-${selectedRange.value}.pdf`);
}
</script>
