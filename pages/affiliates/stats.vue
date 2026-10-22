<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header & Quick Referral Link Copy -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            {{ stats.tier }}
          </span>
          <code class="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono text-gray-800">
            Code: {{ stats.affiliateCode }}
          </code>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Affiliate Performance & Earnings</h1>
        <p class="mt-0.5 text-sm text-gray-500">
          Track referral link clicks, paid subscriber conversions, and Mobile Money commission payouts.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
          https://graphicnewsplus.com/?ref={{ stats.affiliateCode }}
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
          @click="copyRefLink"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
          {{ copied ? 'Copied Link!' : 'Copy Referral Link' }}
        </button>
      </div>
    </div>

    <!-- 4 KPI Sparkline Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportKpiSparkCard v-for="m in kpiMetrics" :key="m.key" :metric="m" />
    </div>

    <!-- Apache ECharts Visualizations -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7">
        <EChartCanvas
          title="Monthly Commission Earnings & Referral Conversions (2026)"
          subtitle="Dual-axis telemetry (`affiliate_commissions` + `affiliate_referral_clicks`)"
          chart-type-badge="Dual-Axis Bar + Area"
          :option="earningsAndClicksOption"
          :height="320"
          export-filename="affiliate-monthly-earnings"
        />
      </div>

      <div class="lg:col-span-5">
        <EChartCanvas
          title="Commission Earned by Subscription Plan"
          subtitle="Contribution across Standard Monthly, Annual Pro & Weekly Pass"
          chart-type-badge="Donut"
          :option="planBreakdownOption"
          :height="320"
          export-filename="affiliate-plan-breakdown"
        />
      </div>
    </div>

    <!-- Commission Ledger Table -->
    <ReportDataTable
      title="Recent Referral Commissions Ledger"
      :columns="commissionColumns"
      :rows="stats.recentCommissions"
      filename="affiliate-commissions-ledger"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  middleware: 'affiliate-auth',
});

const copied = ref(false);

const stats = ref({
  affiliateCode: 'KWAME2026',
  tier: 'Gold Tier (18%)',
  totalClicks: 9935,
  totalSignups: 601,
  conversionRate: 6.05,
  totalEarnings: 25230.0,
  pendingEarnings: 1485.0,
  paidEarnings: 23745.0,
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  earningsOverTime: [1180, 1490, 1820, 2140, 2060, 2590, 2940, 3280, 3610, 4120],
  clicksOverTime: [490, 610, 740, 860, 815, 980, 1120, 1290, 1410, 1625],
  signupsOverTime: [29, 36, 44, 52, 48, 61, 69, 78, 86, 98],
  conversionsByPlan: [
    { plan: 'Standard Monthly (GHS 65)', signups: 342, revenueGhs: 22230, commissionGhs: 10944 },
    { plan: 'Annual Pro (GHS 720)', signups: 118, revenueGhs: 84960, commissionGhs: 9126 },
    { plan: 'Weekly Pass (GHS 18)', signups: 96, revenueGhs: 1728, commissionGhs: 1940 },
    { plan: 'Institutional Lead Referral', signups: 45, revenueGhs: 32400, commissionGhs: 3220 },
  ],
  recentCommissions: [
    { id: 'COM-9941', date: '2026-10-22', subscriberMasked: 'a.mensah***@gmail.com', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'PENDING' },
    { id: 'COM-9918', date: '2026-10-20', subscriberMasked: 'k.owusu***@yahoo.com', plan: 'Standard Monthly', subscriptionAmount: 65, commissionRate: '18%', commissionAmount: 11.7, status: 'PENDING' },
    { id: 'COM-9872', date: '2026-10-16', subscriberMasked: 'efua.d***@ug.edu.gh', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'APPROVED' },
    { id: 'COM-9815', date: '2026-10-11', subscriberMasked: 'nana.b***@mtn.com.gh', plan: 'Standard Monthly', subscriptionAmount: 65, commissionRate: '18%', commissionAmount: 11.7, status: 'PAID' },
    { id: 'COM-9764', date: '2026-10-05', subscriberMasked: 's.adjei***@gcgl.com.gh', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'PAID' },
  ],
});

onMounted(async () => {
  try {
    const res = await $fetch<any>('/api/v1/portal-analytics/affiliate-stats');
    if (res?.success && res.result) {
      stats.value = res.result;
    }
  } catch {
    // Keep pre-rendered stats
  }
});

async function copyRefLink() {
  if (!import.meta.client) return;
  await navigator.clipboard.writeText(`https://graphicnewsplus.com/?ref=${stats.value.affiliateCode}`);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

const kpiMetrics = computed<ReportKpiMetric[]>(() => [
  {
    key: 'clicks',
    label: 'Referral Link Clicks',
    value: stats.value.totalClicks.toLocaleString(),
    rawValue: stats.value.totalClicks,
    changePercent: 15.2,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Tracked via ?ref= landing cookies',
    sparkline: stats.value.clicksOverTime,
  },
  {
    key: 'signups',
    label: 'Paid Conversions',
    value: stats.value.totalSignups.toLocaleString(),
    rawValue: stats.value.totalSignups,
    changePercent: 13.9,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Verified Paystack subscription checkouts',
    sparkline: stats.value.signupsOverTime,
  },
  {
    key: 'conv_rate',
    label: 'Click-to-Paid Rate',
    value: `${stats.value.conversionRate}%`,
    rawValue: stats.value.conversionRate,
    changePercent: 0.8,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: 'Top 10% across GCGL creator network',
  },
  {
    key: 'earnings',
    label: 'Total Earned (YTD)',
    value: `GHS ${stats.value.totalEarnings.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`,
    rawValue: stats.value.totalEarnings,
    changePercent: 22.4,
    changeDirection: 'up',
    positiveIsGood: true,
    subtitle: `Pending next MoMo batch: GHS ${stats.value.pendingEarnings.toFixed(2)}`,
    sparkline: stats.value.earningsOverTime,
  },
]);

const earningsAndClicksOption = computed(() => ({
  color: ['#059669', '#2563eb'],
  tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
  legend: BOTTOM_LEGEND,
  grid: DUAL_AXIS_GRID,
  xAxis: categoryXAxis(stats.value.months),
  yAxis: [valueYAxis('GHS', '₵'), valueYAxis('Signups')],
  series: [
    {
      name: 'Commission Earned (GHS)',
      type: 'bar',
      barMaxWidth: 22,
      itemStyle: { color: barGradient('#059669', '#047857'), borderRadius: [6, 6, 0, 0] },
      data: stats.value.earningsOverTime,
    },
    {
      name: 'Paid Conversions',
      type: 'line',
      yAxisIndex: 1,
      smooth: 0.35,
      lineStyle: { width: 3, color: '#2563eb' },
      areaStyle: { color: areaGradient('#2563eb', 0.16) },
      data: stats.value.signupsOverTime,
    },
  ],
}));

const planBreakdownOption = computed(() => ({
  color: GNP_PALETTE,
  tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}<br/><b>GHS {c}</b> ({d}%)' },
  legend: BOTTOM_LEGEND,
  series: [
    {
      name: 'Commission by Plan',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: stats.value.conversionsByPlan.map((p) => ({
        name: p.plan,
        value: p.commissionGhs,
      })),
    },
  ],
}));

const commissionColumns: ReportTableColumn[] = [
  { key: 'id', label: 'Commission ID', format: 'code' },
  { key: 'date', label: 'Date', format: 'text' },
  { key: 'subscriberMasked', label: 'Subscriber', format: 'text' },
  { key: 'plan', label: 'Plan Tier', format: 'text' },
  { key: 'subscriptionAmount', label: 'Checkout Amount', format: 'currency', align: 'right' },
  { key: 'commissionRate', label: 'Tier Rate', format: 'text', align: 'right' },
  { key: 'commissionAmount', label: 'Commission Earned', format: 'currency', align: 'right' },
  { key: 'status', label: 'Status', format: 'badge', align: 'center' },
];
</script>
