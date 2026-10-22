<template>
  <div class="space-y-6 pb-12">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700"
      >
        <Icon name="lucide:check-circle-2" class="h-4 w-4 text-emerald-400 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Page Header & Cross-Portal Analytics Navigation -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
              Platform Intelligence Suite
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              8 Groups • 26 Reports (10 Suggested New)
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Apache ECharts v6 + `gnp-api` SQL Blueprints
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
            Platform Reports & Backend Analytics Hub
          </h1>
          <p class="mt-1 text-sm text-gray-500 max-w-3xl">
            Interactive mock telemetry, executive summaries, Apache ECharts visualizations, exportable datasets, and verified PostgreSQL / C++ Drogon API contracts mapped directly to <code class="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">rhyolite-prime/gnp-api</code>.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer"
            :class="
              showBackendSpec
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            @click="showBackendSpec = !showBackendSpec"
          >
            <Icon name="lucide:code-2" class="h-4 w-4 text-emerald-400" />
            <span>{{ showBackendSpec ? 'Backend Spec: Visible' : 'Show Backend Spec' }}</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
            @click="openSchemaModal()"
          >
            <Icon name="lucide:database-zap" class="h-4 w-4" />
            <span>PostgreSQL DDL & `gnp-api` Audit (13)</span>
          </button>
        </div>
      </div>

      <!-- Admin Analytics Navigation -->
      <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
        <span class="font-semibold text-gray-400 uppercase tracking-wider text-[11px] mr-1">
          Admin Analytics Views:
        </span>
        <NuxtLink
          to="/admin/dashboard"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200/80 transition-colors"
        >
          <Icon name="lucide:layout-dashboard" class="h-3.5 w-3.5 text-red-600" />
          Executive Overview
        </NuxtLink>
        <NuxtLink
          to="/admin/affiliates/dashboard"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200/80 transition-colors"
        >
          <Icon name="lucide:megaphone" class="h-3.5 w-3.5 text-amber-600" />
          Admin Affiliates Analytics
        </NuxtLink>
        <NuxtLink
          to="/admin/archives/dashboard"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200/80 transition-colors"
        >
          <Icon name="lucide:library" class="h-3.5 w-3.5 text-purple-600" />
          Archives & AI RAG Telemetry
        </NuxtLink>
        <NuxtLink
          to="/admin/push-notifications"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200/80 transition-colors"
        >
          <Icon name="lucide:bell-ring" class="h-3.5 w-3.5 text-emerald-600" />
          Push Notifications Analytics
        </NuxtLink>
      </div>
    </div>

    <!-- Main 12-Col Split Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT SIDEBAR: Report Catalog Navigator -->
      <aside class="lg:col-span-3 space-y-4">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          <!-- Search Reports -->
          <div class="relative">
            <Icon
              name="lucide:search"
              class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              v-model="catalogSearch"
              type="text"
              placeholder="Search 26 reports..."
              class="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <!-- Scope Filter Pills -->
          <div class="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg text-[11px] font-semibold">
            <button
              type="button"
              class="py-1 rounded-md transition-colors cursor-pointer"
              :class="catalogMode === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'"
              @click="catalogMode = 'all'"
            >
              All ({{ totalReportsCount }})
            </button>
            <button
              type="button"
              class="py-1 rounded-md transition-colors cursor-pointer"
              :class="catalogMode === 'core' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'"
              @click="catalogMode = 'core'"
            >
              Core ({{ coreReportsCount }})
            </button>
            <button
              type="button"
              class="py-1 rounded-md transition-colors cursor-pointer"
              :class="catalogMode === 'new' ? 'bg-white text-purple-700 shadow-2xs' : 'text-gray-600 hover:text-gray-900'"
              @click="catalogMode = 'new'"
            >
              New ({{ suggestedReportsCount }})
            </button>
          </div>

          <!-- Grouped Navigation -->
          <div class="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
            <div v-for="group in visibleReportGroups" :key="group.id" class="space-y-1">
              <div class="flex items-center justify-between px-2 py-1">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Icon :name="resolveGroupIcon(group.iconName)" class="h-3.5 w-3.5 text-gray-500" />
                  {{ group.title }}
                </span>
                <span
                  v-if="group.badge"
                  class="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-100 text-purple-700"
                >
                  {{ group.badge }}
                </span>
              </div>

              <button
                v-for="rep in group.reports"
                :key="rep.id"
                type="button"
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2 transition-all cursor-pointer"
                :class="
                  selectedReport.id === rep.id
                    ? 'bg-red-50 text-red-700 font-bold border border-red-200/80 shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                "
                @click="selectReport(rep)"
              >
                <span class="truncate">{{ rep.name }}</span>
                <span
                  v-if="rep.isSuggestedNew"
                  class="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide"
                  :class="
                    selectedReport.id === rep.id
                      ? 'bg-red-600 text-white'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  "
                >
                  NEW
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- RIGHT MAIN WORKSPACE -->
      <div class="lg:col-span-9 space-y-6">
        <!-- Active Report Header + Parameter Filter Bar -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-xl font-extrabold text-gray-900">
                  {{ selectedReport.name }}
                </h2>
                <span
                  v-if="selectedReport.isSuggestedNew"
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"
                >
                  Suggested Domain Report
                </span>
                <code class="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs">
                  POST {{ selectedReport.endpoint }}
                </code>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedReport.description }}
              </p>
              <p
                v-if="selectedReport.suggestedRationale"
                class="text-xs text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-3 py-1.5 mt-2 inline-flex items-center gap-1.5"
              >
                <Icon name="lucide:lightbulb" class="h-3.5 w-3.5 shrink-0 text-indigo-600" />
                <span><strong>Why We Suggested This Report:</strong> {{ selectedReport.suggestedRationale }}</span>
              </p>
            </div>

            <!-- Date Window Quick Presets -->
            <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start shrink-0">
              <button
                v-for="preset in datePresets"
                :key="preset.label"
                type="button"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                :class="
                  activePreset === preset.label
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                "
                @click="applyDatePreset(preset)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <!-- Filter Controls Form -->
          <form
            class="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 items-end"
            @submit.prevent="runSelectedReport"
          >
            <div v-if="hasParam('dateRange')">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Start Date
              </label>
              <input
                v-model="filters.startDate"
                type="date"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="hasParam('dateRange')">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                End Date
              </label>
              <input
                v-model="filters.endDate"
                type="date"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div v-if="hasParam('partner')">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Commercial Partner
              </label>
              <select
                v-model="filters.partnerId"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Partners (Portfolio)</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div v-if="hasParam('publication')">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                GCGL Publication
              </label>
              <select
                v-model="filters.publicationId"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All 6 Publications</option>
                <option v-for="pub in GRAPHIC_PUBLICATIONS" :key="pub.id" :value="pub.id">
                  {{ pub.name }}
                </option>
              </select>
            </div>

            <div v-if="hasParam('granularity')">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Bucket Granularity
              </label>
              <select
                v-model="filters.granularity"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <div class="flex items-center gap-2 xl:justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Icon
                  :name="loading ? 'lucide:loader-2' : 'lucide:play'"
                  class="h-3.5 w-3.5"
                  :class="{ 'animate-spin': loading }"
                />
                <span>{{ loading ? 'Running...' : 'Run Report' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Report Output Workspace -->
        <template v-if="reportResult">
          <!-- Executive Insights Banner -->
          <div class="bg-slate-900 text-slate-100 rounded-xl px-5 py-3.5 border border-slate-800 flex items-start gap-3">
            <Icon name="lucide:sparkles" class="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong class="text-white">Executive Summary:</strong>
              {{ reportResult.executiveSummary }}
            </p>
          </div>

          <!-- 1. KPI Summary Strip with Apache ECharts Sparklines -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <ReportKpiSparkCard
              v-for="kpi in reportResult.kpis"
              :key="kpi.key"
              :metric="kpi"
            />
          </div>

          <!-- 2. Special GRA Tax Invoice Sheet (for Partner Invoices report) -->
          <PartnerInvoicePreview
            v-if="reportResult.invoice"
            :invoice="reportResult.invoice"
            :sending-email="sendingEmail"
            @send-email="handleSendPartnerInvoiceEmail"
          />

          <!-- 3. Interactive Apache ECharts Visualizations Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div
              v-for="chart in reportResult.charts"
              :key="chart.id"
              :class="resolveChartSpanClass(chart.span)"
            >
              <EChartCanvas
                :title="chart.title"
                :subtitle="chart.subtitle"
                :chart-type-badge="chart.chartTypeBadge"
                :option="chart.option"
                :height="chart.height || (chart.span === 'full' ? 335 : 305)"
                :export-filename="`${selectedReport.id}-${chart.id}`"
              />
            </div>
          </div>

          <!-- 4. Granular Tabular Results + CSV / XLSX / PDF Export -->
          <ReportDataTable
            :title="reportResult.tableTitle || `${selectedReport.name} — Granular Dataset`"
            :columns="reportResult.columns"
            :rows="reportResult.rows"
            :filename="`gnp-${selectedReport.id}-${filters.startDate || 'snapshot'}`"
          />

          <!-- 5. Backend Engineering Blueprint (`gnp-api` C++ Drogon & PostgreSQL SQL) -->
          <ReportBackendSpecPanel
            v-if="showBackendSpec"
            :blueprint="reportResult.blueprint"
            :full-result="reportResult"
            @open-schema-modal="openSchemaModal()"
            @inspect-table="openSchemaModal"
          />
        </template>
      </div>
    </div>

    <!-- Full PostgreSQL DDL & C++ Audit Modal -->
    <SchemaAdvisorModal
      :open="schemaModalOpen"
      :highlight-table="highlightedTable"
      @close="schemaModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type {
  CommercialPartner,
  GeneratedReportResult,
  ReportChartSpec,
  ReportDefinition,
  ReportParameterKey,
  ReportRequestDto,
} from '~/models';
import {
  GRAPHIC_PUBLICATIONS,
  MOCK_COMMERCIAL_PARTNERS,
  REPORT_GROUPS,
} from '~/utils/reportsSchemaCatalog';
import { generateMockReportById } from '~/utils/reportsMockEngine';
import {
  executePlatformReport,
  fetchReportPartnersList,
  sendPartnerInvoiceAsEmail,
} from '~/services/reports';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import ReportKpiSparkCard from '~/components/reports/ReportKpiSparkCard.vue';
import ReportDataTable from '~/components/reports/ReportDataTable.vue';
import PartnerInvoicePreview from '~/components/reports/PartnerInvoicePreview.vue';
import ReportBackendSpecPanel from '~/components/reports/ReportBackendSpecPanel.vue';
import SchemaAdvisorModal from '~/components/reports/SchemaAdvisorModal.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const catalogSearch = ref('');
const catalogMode = ref<'all' | 'core' | 'new'>('all');
const showBackendSpec = ref(true);
const schemaModalOpen = ref(false);
const highlightedTable = ref<string | undefined>(undefined);

const partners = ref<CommercialPartner[]>(MOCK_COMMERCIAL_PARTNERS);
const selectedReport = ref<ReportDefinition>(REPORT_GROUPS[0].reports[0]);
const activePreset = ref('Last 14D');

const filters = ref<ReportRequestDto>({
  startDate: '2026-10-09',
  endDate: '2026-10-22',
  partnerId: '',
  publicationId: '',
  granularity: 'day',
});

const reportResult = ref<GeneratedReportResult>(
  generateMockReportById(selectedReport.value.id, filters.value)
);

const loading = ref(false);
const sendingEmail = ref(false);
const toastMessage = ref('');

const datePresets = [
  { label: 'Last 7D', start: '2026-10-16', end: '2026-10-22' },
  { label: 'Last 14D', start: '2026-10-09', end: '2026-10-22' },
  { label: 'Last 30D', start: '2026-09-23', end: '2026-10-22' },
  { label: 'Q3 2026', start: '2026-07-01', end: '2026-09-30' },
];

const allReportsFlat = computed(() => REPORT_GROUPS.flatMap((g) => g.reports));
const totalReportsCount = computed(() => allReportsFlat.value.length);
const suggestedReportsCount = computed(() => allReportsFlat.value.filter((r) => r.isSuggestedNew).length);
const coreReportsCount = computed(() => totalReportsCount.value - suggestedReportsCount.value);

const visibleReportGroups = computed(() => {
  const q = catalogSearch.value.trim().toLowerCase();
  return REPORT_GROUPS.map((group) => {
    const filteredReports = group.reports.filter((r) => {
      if (catalogMode.value === 'core' && r.isSuggestedNew) return false;
      if (catalogMode.value === 'new' && !r.isSuggestedNew) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        group.title.toLowerCase().includes(q)
      );
    });
    return { ...group, reports: filteredReports };
  }).filter((g) => g.reports.length > 0);
});

function resolveGroupIcon(iconName: string) {
  const map: Record<string, string> = {
    DollarSign: 'lucide:circle-dollar-sign',
    Users: 'lucide:users',
    Newspaper: 'lucide:newspaper',
    Archive: 'lucide:library',
    Building2: 'lucide:building-2',
    Megaphone: 'lucide:megaphone',
    Gamepad2: 'lucide:gamepad-2',
    ShieldCheck: 'lucide:shield-check',
  };
  return map[iconName] || 'lucide:bar-chart-3';
}

function resolveChartSpanClass(span: ReportChartSpec['span']) {
  if (span === 'full') return 'lg:col-span-12';
  if (span === 'two-thirds') return 'lg:col-span-8';
  if (span === 'third') return 'lg:col-span-4';
  return 'lg:col-span-6';
}

function hasParam(key: ReportParameterKey) {
  return selectedReport.value.parameters.includes(key);
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

function openSchemaModal(tableName?: string) {
  highlightedTable.value = typeof tableName === 'string' ? tableName : undefined;
  schemaModalOpen.value = true;
}

async function runSelectedReport() {
  loading.value = true;
  try {
    const slug = selectedReport.value.endpoint.replace('/api/v1/reports/', '');
    reportResult.value = await executePlatformReport(slug, { ...filters.value });
  } finally {
    loading.value = false;
  }
}

function selectReport(rep: ReportDefinition) {
  selectedReport.value = rep;
  if (rep.id === 'partner_invoices' && !filters.value.partnerId && partners.value.length) {
    filters.value.partnerId = partners.value[0].id;
  } else if (!rep.parameters.includes('partner')) {
    filters.value.partnerId = '';
  }
  runSelectedReport();
}

function applyDatePreset(preset: { label: string; start: string; end: string }) {
  activePreset.value = preset.label;
  filters.value.startDate = preset.start;
  filters.value.endDate = preset.end;
  runSelectedReport();
}

watch(
  () => [filters.value.partnerId, filters.value.publicationId, filters.value.granularity],
  () => {
    runSelectedReport();
  }
);

async function handleSendPartnerInvoiceEmail() {
  if (!reportResult.value?.invoice) return;
  sendingEmail.value = true;
  try {
    await sendPartnerInvoiceAsEmail({
      partnerId: filters.value.partnerId || partners.value[0]?.id,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    });
    showToast(
      `Invoice ${reportResult.value.invoice.invoiceNo} dispatched to ${reportResult.value.invoice.billedTo.email}`
    );
  } finally {
    sendingEmail.value = false;
  }
}

onMounted(async () => {
  partners.value = await fetchReportPartnersList();
  await runSelectedReport();
});

useHead({
  title: 'Platform Reports & Analytics | Graphic NewsPlus Admin',
});
</script>
