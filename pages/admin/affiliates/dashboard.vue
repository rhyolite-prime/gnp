<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            Creator & Referral Network
          </span>
          <span class="text-xs text-gray-500">Apache ECharts v6 Telemetry</span>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Affiliate Program Analytics</h1>
        <p class="mt-0.5 text-sm text-gray-500">
          Monitor referred subscriber growth, traffic channels, commission accruals, and Mobile Money payout batches.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <select
          v-model="selectedPeriod"
          class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-red-500"
        >
          <option value="14d">Last 14 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="q3">Q3 2026</option>
        </select>

        <NuxtLink
          to="/admin/affiliates/payouts"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
        >
          <Icon name="lucide:wallet" class="h-4 w-4" />
          <span>Process Payouts (GHS 6,840)</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 4 KPI Sparkline Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportKpiSparkCard v-for="m in kpis" :key="m.key" :metric="m" />
    </div>

    <!-- Apache ECharts Visualizations -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7">
        <EChartCanvas
          title="Referred Subscription Revenue vs Accrued Commissions (GHS)"
          subtitle="Mapped to `affiliate_commissions` + `payments.amount` (`gnp-api` bugfix applied)"
          chart-type-badge="Dual-Axis Bar + Area"
          :option="commissionTrendOption"
          :height="320"
          export-filename="admin-affiliate-commissions"
        />
      </div>

      <div class="lg:col-span-5">
        <EChartCanvas
          title="Referral Acquisition Channels (28,450 Clicks)"
          subtitle="Attribution from `affiliate_referral_clicks.utm_source`"
          chart-type-badge="Donut"
          :option="trafficSourceOption"
          :height="320"
          export-filename="admin-affiliate-channels"
        />
      </div>
    </div>

    <!-- Top Performing Affiliates Table -->
    <ReportDataTable
      title="Top Ghanaian Affiliates & Media Creators Leaderboard"
      :columns="leaderboardColumns"
      :rows="leaderboardRows"
      filename="gnp-top-affiliates-leaderboard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ReportKpiMetric, ReportTableColumn } from '~/models/reports';
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
import ReportDataTable from '~/components/reports/ReportDataTable.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const selectedPeriod = ref('14d');

const mult = computed(() => (selectedPeriod.value === '14d' ? 1 : selectedPeriod.value === '30d' ? 2.1 : 5.8));

const labels = ['09 Oct', '11 Oct', '13 Oct', '15 Oct', '17 Oct', '19 Oct', '21 Oct', '22 Oct'];
const baseRev = [4820, 5390, 5120, 6480, 7150, 6890, 7940, 8420];
const baseComm = [770, 862, 819, 1036, 1144, 1102, 1270, 1347];

const kpis = computed<ReportKpiMetric[]>(() => [
  {
    key: 'active_aff',
    label: 'Active Approved Affiliates',
    value: '164',
    rawValue: 164,
    changePercent: 14.2,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: '9 pending KYC / MoMo verification',
  },
  {
    key: 'ref_rev',
    label: 'Gross Referred Revenue',
    value: `GHS ${Math.round(52210 * mult.value).toLocaleString()}`,
    rawValue: Math.round(52210 * mult.value),
    changePercent: 21.8,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: '6.1x return over commission cost',
    sparkline: baseRev.map((v) => Math.round(v * mult.value)),
  },
  {
    key: 'accrued_comm',
    label: 'Total Commissions Accrued',
    value: `GHS ${Math.round(8350 * mult.value).toLocaleString()}`,
    rawValue: Math.round(8350 * mult.value),
    changePercent: 18.4,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Effective blended commission rate: 16.0%',
    sparkline: baseComm.map((v) => Math.round(v * mult.value)),
  },
  {
    key: 'pending_pay',
    label: 'Pending MoMo Payout Queue',
    value: 'GHS 6,840.00',
    rawValue: 6840,
    changePercent: -8.5,
    changeDirection: 'down',
    positiveIsGood: false,
    subtitle: '14 creators above GHS 100 payout threshold',
  },
]);

const commissionTrendOption = computed(() => ({
  color: ['#2563eb', '#d97706'],
  tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
  legend: BOTTOM_LEGEND,
  grid: DUAL_AXIS_GRID,
  xAxis: categoryXAxis(labels),
  yAxis: [valueYAxis('Gross GHS', '₵'), valueYAxis('Comm GHS', '₵')],
  series: [
    {
      name: 'Referred Subscription Revenue (GHS)',
      type: 'bar',
      barMaxWidth: 22,
      itemStyle: { color: barGradient('#2563eb', '#1d4ed8'), borderRadius: [6, 6, 0, 0] },
      data: baseRev.map((v) => Math.round(v * mult.value)),
    },
    {
      name: 'Accrued Commission (GHS)',
      type: 'line',
      yAxisIndex: 1,
      smooth: 0.35,
      lineStyle: { width: 3, color: '#d97706' },
      areaStyle: { color: areaGradient('#d97706', 0.2) },
      data: baseComm.map((v) => Math.round(v * mult.value)),
    },
  ],
}));

const trafficSourceOption = computed(() => ({
  color: GNP_PALETTE,
  tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}<br/><b>{c} clicks</b> ({d}%)' },
  legend: BOTTOM_LEGEND,
  series: [
    {
      name: 'Referral Source',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { name: 'WhatsApp Channels & Communities', value: Math.round(11240 * mult.value) },
        { name: 'X (Twitter) & Tech Threads GH', value: Math.round(7680 * mult.value) },
        { name: 'YouTube & Podcast Show Notes', value: Math.round(4920 * mult.value) },
        { name: 'University Campus Ambassadors', value: Math.round(2890 * mult.value) },
        { name: 'Newsletters & Blogs', value: Math.round(1720 * mult.value) },
      ],
    },
  ],
}));

const leaderboardColumns: ReportTableColumn[] = [
  { key: 'code', label: 'Ref Code', format: 'code' },
  { key: 'name', label: 'Affiliate / Creator', format: 'text' },
  { key: 'tier', label: 'Commission Tier', format: 'badge', align: 'center' },
  { key: 'clicks', label: 'Link Clicks', format: 'number', align: 'right' },
  { key: 'conversions', label: 'Paid Signups', format: 'number', align: 'right' },
  { key: 'convRate', label: 'Conv. Rate', format: 'percent', align: 'right' },
  { key: 'grossRevenue', label: 'Referred Revenue', format: 'currency', align: 'right' },
  { key: 'commissionEarned', label: 'Commission Earned', format: 'currency', align: 'right' },
];

const leaderboardRows = computed(() => [
  { code: 'KWAME2026', name: 'Kwame Tech & Finance GH', tier: 'PLATINUM (20%)', clicks: Math.round(4820 * mult.value), conversions: Math.round(312 * mult.value), convRate: 6.5, grossRevenue: Math.round(24960 * mult.value), commissionEarned: Math.round(4992 * mult.value) },
  { code: 'ACCRAINSIGHT', name: 'Ama Mensah Media Brief', tier: 'GOLD (18%)', clicks: Math.round(3910 * mult.value), conversions: Math.round(238 * mult.value), convRate: 6.1, grossRevenue: Math.round(17850 * mult.value), commissionEarned: Math.round(3213 * mult.value) },
  { code: 'LEGONHUB', name: 'UG Legon Economics Society', tier: 'GOLD (18%)', clicks: Math.round(3140 * mult.value), conversions: Math.round(179 * mult.value), convRate: 5.7, grossRevenue: Math.round(11635 * mult.value), commissionEarned: Math.round(2094 * mult.value) },
  { code: 'BIZDIGESTGH', name: 'Kofi Owusu Business Digest', tier: 'SILVER (15%)', clicks: Math.round(2290 * mult.value), conversions: Math.round(124 * mult.value), convRate: 5.4, grossRevenue: Math.round(9920 * mult.value), commissionEarned: Math.round(1488 * mult.value) },
  { code: 'DIASPORAGH', name: 'UK-Ghana Diaspora Network', tier: 'SILVER (15%)', clicks: Math.round(1840 * mult.value), conversions: Math.round(108 * mult.value), convRate: 5.9, grossRevenue: Math.round(10800 * mult.value), commissionEarned: Math.round(1620 * mult.value) },
]);
</script>
