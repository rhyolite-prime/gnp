<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      @click.self="$emit('close')"
    >
      <div class="bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-red-600/20 border border-red-500/40">
              <Icon name="lucide:server-cog" class="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white">
                `rhyolite-prime/gnp-api` — Reporting Schema & Backend Architecture Blueprint
              </h3>
              <p class="text-xs text-slate-400">
                46 audited Drogon ORM tables • 13 PostgreSQL DDL migrations • 6 verified `gnp-api` code fixes • Upgraded C++ `ReportDto.h`
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              @click="downloadFullSql"
            >
              <Icon name="lucide:download" class="h-3.5 w-3.5" />
              Download All DDL (.sql)
            </button>
            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              @click="$emit('close')"
            >
              <Icon name="lucide:x" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="px-6 pt-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="px-3.5 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-colors flex items-center gap-2 cursor-pointer"
            :class="
              activeTab === tab.id
                ? 'border-red-500 text-white bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            "
            @click="activeTab = tab.id"
          >
            <Icon :name="tab.icon" class="h-4 w-4" />
            <span>{{ tab.label }}</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6 overflow-y-auto space-y-4 flex-1">
          <!-- TAB 1: PostgreSQL Schema Migrations -->
          <template v-if="activeTab === 'migrations'">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="filter in (['ALL', 'new_table', 'alter_table'] as const)"
                  :key="filter"
                  type="button"
                  class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  :class="
                    kindFilter === filter
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  "
                  @click="kindFilter = filter"
                >
                  {{ filter === 'ALL' ? 'All Migrations (13)' : filter === 'new_table' ? 'New Tables (9)' : 'Alter Existing Tables (4)' }}
                </button>
              </div>
              <span v-if="highlightTable" class="text-xs text-amber-300 font-mono">
                Focused: {{ highlightTable }}
              </span>
            </div>

            <div
              v-for="mig in filteredMigrations"
              :key="mig.id"
              class="rounded-xl border p-4 space-y-3 transition-all"
              :class="
                highlightTable && mig.tableName.includes(highlightTable)
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-slate-900/70 border-slate-800'
              "
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
                      :class="
                        mig.priority.startsWith('P0')
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : mig.priority.startsWith('P1')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      "
                    >
                      {{ mig.priority }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      :class="
                        mig.changeType === 'new_table'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      "
                    >
                      {{ mig.changeType === 'new_table' ? 'CREATE TABLE' : 'ALTER TABLE' }}
                    </span>
                    <h4 class="text-sm font-bold text-white font-mono">{{ mig.title }}</h4>
                  </div>
                  <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">{{ mig.solutionSummary }}</p>
                  <p class="text-xs text-slate-400 mt-1 italic">{{ mig.problemInCurrentApi }}</p>
                </div>

                <button
                  type="button"
                  class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  @click="copyText(mig.sqlDdl, mig.id)"
                >
                  <Icon :name="copiedId === mig.id ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5 text-emerald-400" />
                  {{ copiedId === mig.id ? 'Copied' : 'Copy DDL' }}
                </button>
              </div>

              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-[11px] text-slate-400 mr-1">Impacts reports:</span>
                <span
                  v-for="rep in mig.impactedReportIds"
                  :key="rep"
                  class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]"
                >
                  {{ rep }}
                </span>
              </div>

              <pre class="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">{{ mig.sqlDdl }}</pre>
            </div>
          </template>

          <!-- TAB 2: Existing gnp-api Audit Findings & Bugs -->
          <template v-else-if="activeTab === 'findings'">
            <div
              v-for="item in EXISTING_GNP_API_FINDINGS"
              :key="item.id"
              class="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <code class="text-sm font-bold text-amber-300">{{ item.locationInGnpApi }}</code>
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase"
                  :class="
                    item.severity === 'bug'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  "
                >
                  {{ item.severity }}
                </span>
              </div>
              <p class="text-xs font-semibold text-white">{{ item.title }}</p>
              <p class="text-xs text-slate-300 leading-relaxed">{{ item.detail }}</p>
              <div class="pt-1 text-xs text-emerald-300 flex items-start gap-1.5">
                <Icon name="lucide:wrench" class="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span><strong>Fix:</strong> {{ item.recommendedFix }}</span>
              </div>
            </div>
          </template>

          <!-- TAB 3: Upgraded C++ Drogon ReportDto.h -->
          <template v-else>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-300">
                Drop-in replacement for <code class="text-amber-300">dto/ReportDto.h</code> in
                <code class="text-white">rhyolite-prime/gnp-api</code> supporting all 26 reports, filters, and pagination:
              </p>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                @click="copyText(RECOMMENDED_CPP_REPORT_DTO, 'cpp-dto')"
              >
                <Icon :name="copiedId === 'cpp-dto' ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5 text-emerald-400" />
                {{ copiedId === 'cpp-dto' ? 'Copied C++ Header!' : 'Copy ReportDto.h' }}
              </button>
            </div>
            <pre class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">{{ RECOMMENDED_CPP_REPORT_DTO }}</pre>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  EXISTING_GNP_API_FINDINGS,
  RECOMMENDED_CPP_REPORT_DTO,
  SCHEMA_MIGRATION_RECOMMENDATIONS,
  buildFullSqlMigrationScript,
} from '~/utils/reportsSchemaCatalog';

const props = defineProps<{
  open: boolean;
  highlightTable?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const activeTab = ref<'migrations' | 'findings' | 'cpp'>('migrations');
const kindFilter = ref<'ALL' | 'new_table' | 'alter_table'>('ALL');
const copiedId = ref('');

const tabs = [
  { id: 'migrations' as const, label: 'PostgreSQL DDL Migrations', badge: '13', icon: 'lucide:database' },
  { id: 'findings' as const, label: '`gnp-api` Audit & Bug Fixes', badge: '6', icon: 'lucide:bug' },
  { id: 'cpp' as const, label: 'Upgraded C++ `ReportDto.h`', badge: 'DTO', icon: 'lucide:file-code-2' },
];

const filteredMigrations = computed(() => {
  const list =
    kindFilter.value === 'ALL'
      ? SCHEMA_MIGRATION_RECOMMENDATIONS
      : SCHEMA_MIGRATION_RECOMMENDATIONS.filter((m) => m.changeType === kindFilter.value);

  if (!props.highlightTable) return list;
  return [...list].sort((a, b) => {
    const aHit = a.tableName.includes(props.highlightTable!) ? -1 : 0;
    const bHit = b.tableName.includes(props.highlightTable!) ? -1 : 0;
    return aHit - bHit;
  });
});

async function copyText(text: string, id: string) {
  if (!import.meta.client) return;
  await navigator.clipboard.writeText(text);
  copiedId.value = id;
  setTimeout(() => (copiedId.value = ''), 2000);
}

function downloadFullSql() {
  const sql = buildFullSqlMigrationScript();
  const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gnp_reports_schema_migrations.sql';
  link.click();
  URL.revokeObjectURL(url);
}
</script>
