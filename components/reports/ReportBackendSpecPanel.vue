<template>
  <div class="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
          <Icon name="lucide:database-zap" class="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="text-sm font-bold text-white">
              `gnp-api` Backend API & PostgreSQL Blueprint
            </h4>
            <code class="px-2 py-0.5 rounded bg-slate-800 text-sky-300 text-[11px] font-mono">
              {{ blueprint.controllerMethod }}
            </code>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            Service implementation target: <code class="text-slate-300 font-mono">{{ blueprint.serviceMethod }}</code>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          @click="copyJsonContract"
        >
          <Icon :name="copiedJson ? 'lucide:check' : 'lucide:braces'" class="h-3.5 w-3.5 text-emerald-400" />
          {{ copiedJson ? 'Copied JSON Response!' : 'Copy API JSON Contract' }}
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          @click="$emit('open-schema-modal')"
        >
          <Icon name="lucide:sparkles" class="h-3.5 w-3.5" />
          Full Schema & DDL Suite (13)
        </button>
      </div>
    </div>

    <!-- Body Grid -->
    <div class="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left: Endpoint & Tables -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800">
          <p class="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            REST Endpoint & `ReportDto` Fields
          </p>
          <div class="mt-2 flex items-center gap-2 font-mono text-xs">
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {{ blueprint.httpMethod }}
            </span>
            <span class="text-white break-all">{{ blueprint.endpoint }}</span>
          </div>
          <div class="mt-2.5 flex flex-wrap gap-1">
            <span
              v-for="field in blueprint.cppDtoFields"
              :key="field"
              class="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[10px]"
            >
              dto.{{ field }}
            </span>
          </div>
        </div>

        <!-- Existing Tables -->
        <div class="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800">
          <p class="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
            <Icon name="lucide:check-circle-2" class="h-3.5 w-3.5" />
            Existing `gnp-api` ORM Tables & Columns Mapped
          </p>
          <div class="mt-2.5 space-y-2.5">
            <div
              v-for="tbl in blueprint.existingTables"
              :key="tbl.table"
              class="text-xs border-l-2 border-emerald-500/60 pl-3"
            >
              <div class="flex flex-wrap items-center gap-1.5">
                <code class="font-bold text-white">{{ tbl.table }}</code>
                <span class="text-[11px] text-slate-400">({{ tbl.modelClass }})</span>
              </div>
              <p v-if="tbl.notes" class="text-slate-400 text-[11px] mt-0.5">{{ tbl.notes }}</p>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span
                  v-for="col in tbl.usedColumns"
                  :key="col"
                  class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
                >
                  {{ col }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Schema Gaps + Recommended New/Altered Tables -->
        <div
          v-if="blueprint.schemaGaps.length || blueprint.recommendedTables.length"
          class="bg-amber-950/30 rounded-lg p-3.5 border border-amber-500/30 space-y-2.5"
        >
          <p class="text-[11px] uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
            <Icon name="lucide:wrench" class="h-3.5 w-3.5" />
            Schema Gaps & Recommended PostgreSQL Tables
          </p>

          <ul v-if="blueprint.schemaGaps.length" class="space-y-1 text-xs text-amber-100/85 list-disc pl-4">
            <li v-for="(gap, gIdx) in blueprint.schemaGaps" :key="gIdx">
              {{ gap }}
            </li>
          </ul>

          <div v-if="blueprint.recommendedTables.length" class="flex flex-wrap gap-1.5 pt-1">
            <button
              v-for="rec in blueprint.recommendedTables"
              :key="rec.table"
              type="button"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 font-mono text-xs transition-colors cursor-pointer"
              @click="$emit('inspect-table', rec.table)"
            >
              <Icon name="lucide:table-properties" class="h-3 w-3" />
              {{ rec.table }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Copyable PostgreSQL Query -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="bg-slate-900 rounded-lg border border-slate-800 flex-1 flex flex-col overflow-hidden">
          <div class="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-300 font-mono">
              PostgreSQL Aggregation Query (`ReportingService.cc`)
            </span>
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
              @click="copySql"
            >
              <Icon :name="copiedSql ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5 text-indigo-400" />
              {{ copiedSql ? 'Copied SQL!' : 'Copy SQL' }}
            </button>
          </div>
          <pre class="p-4 text-xs font-mono text-emerald-300/95 overflow-x-auto leading-relaxed flex-1">{{ blueprint.sampleSqlQuery }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GeneratedReportResult, ReportBackendBlueprint } from '~/models/reports';

const props = defineProps<{
  blueprint: ReportBackendBlueprint;
  fullResult: GeneratedReportResult;
}>();

defineEmits<{
  (e: 'open-schema-modal'): void;
  (e: 'inspect-table', tableName: string): void;
}>();

const copiedSql = ref(false);
const copiedJson = ref(false);

async function copySql() {
  if (!import.meta.client) return;
  await navigator.clipboard.writeText(props.blueprint.sampleSqlQuery);
  copiedSql.value = true;
  setTimeout(() => (copiedSql.value = false), 2000);
}

async function copyJsonContract() {
  if (!import.meta.client) return;
  const envelope = {
    success: true,
    message: `${props.fullResult.reportMeta.reportName} generated successfully.`,
    unAuthorizedRequest: false,
    error: null,
    result: {
      reportMeta: props.fullResult.reportMeta,
      executiveSummary: props.fullResult.executiveSummary,
      kpis: props.fullResult.kpis,
      charts: props.fullResult.charts.map((c) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        chartTypeBadge: c.chartTypeBadge,
        span: c.span,
        seriesPreview: c.option?.series?.map((s: any) => ({ name: s.name, type: s.type })),
      })),
      tableTitle: props.fullResult.tableTitle,
      columns: props.fullResult.columns,
      rowsSample: props.fullResult.rows.slice(0, 3),
      ...(props.fullResult.invoice ? { invoice: props.fullResult.invoice } : {}),
    },
  };
  await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
  copiedJson.value = true;
  setTimeout(() => (copiedJson.value = false), 2000);
}
</script>
