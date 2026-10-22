<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            1950–2026 Historical Heritage & AI RAG
          </span>
          <span class="text-xs text-gray-500">OCR + `pgvector` Semantic Search Telemetry</span>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Digital Archives & AI Research Analytics</h1>
        <p class="mt-0.5 text-sm text-gray-500">
          Monitor historical newspaper retrieval, AI RAG synthesis latency, citation accuracy, and institutional credit pools.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/admin/archives/institutions"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 transition-colors"
        >
          <Icon name="lucide:landmark" class="h-4 w-4 text-purple-600" />
          <span>Manage Institutions</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/archives/access-credits"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
        >
          <Icon name="lucide:coins" class="h-4 w-4" />
          <span>Access Credits Ledger</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 4 KPI Sparkline Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportKpiSparkCard v-for="m in archiveKpis" :key="m.key" :metric="m" />
    </div>

    <!-- Apache ECharts Visualizations -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7">
        <EChartCanvas
          title="Daily Full-Text Archive Searches vs AI RAG Synthesis Queries"
          subtitle="Powered by `articles.search_vector` (GIN) + `articles.embedding` (`pgvector`)"
          :chart-type-badge="ragReport.charts[0].chartTypeBadge"
          :option="ragSearchTrendOption"
          :height="320"
          export-filename="archives-rag-search-trend"
        />
      </div>

      <div class="lg:col-span-5">
        <EChartCanvas
          title="Historical Research Demand by Decade (1950–2026)"
          subtitle="Archive retrievals grouped by original Daily Graphic publication era"
          :chart-type-badge="ragReport.charts[1].chartTypeBadge"
          :option="decadeDemandOption"
          :height="320"
          export-filename="archives-decade-demand"
        />
      </div>
    </div>

    <!-- Institutional Credit Utilization Table -->
    <ReportDataTable
      title="Institutional & Academic Research Accounts — Credit Consumption"
      :columns="instColumns"
      :rows="instRows"
      filename="gnp-institutional-archive-usage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReportKpiMetric, ReportTableColumn } from '~/models/reports';
import { generateMockReportById } from '~/utils/reportsMockEngine';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import ReportKpiSparkCard from '~/components/reports/ReportKpiSparkCard.vue';
import ReportDataTable from '~/components/reports/ReportDataTable.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const ragReport = generateMockReportById('archive_rag_intelligence', {
  startDate: '2026-10-09',
  endDate: '2026-10-22',
});

const creditsReport = generateMockReportById('institutional_archive_credits', {
  startDate: '2026-10-09',
  endDate: '2026-10-22',
});

const archiveKpis = computed<ReportKpiMetric[]>(() => [
  ragReport.kpis[0],
  ragReport.kpis[1],
  creditsReport.kpis[0],
  creditsReport.kpis[2],
]);

const ragSearchTrendOption = computed(() => ragReport.charts[0].option);
const decadeDemandOption = computed(() => ragReport.charts[1].option);

const instColumns = computed<ReportTableColumn[]>(() => creditsReport.columns);
const instRows = computed(() => creditsReport.rows);
</script>
