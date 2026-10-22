<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Toolbar -->
    <div class="p-4 sm:px-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/60">
      <div>
        <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Icon name="lucide:table-2" class="h-4 w-4 text-red-600" />
          <span>{{ title }}</span>
          <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200/80 text-gray-700">
            {{ filteredSortedRows.length }} rows
          </span>
        </h4>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Icon
            name="lucide:search"
            class="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter rows..."
            class="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 w-44 sm:w-52"
          />
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="exportCsv"
        >
          <Icon name="lucide:file-spreadsheet" class="h-3.5 w-3.5 text-emerald-600" />
          CSV
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="exportExcel"
        >
          <Icon name="lucide:sheet" class="h-3.5 w-3.5 text-blue-600" />
          Excel
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="exportPdf"
        >
          <Icon name="lucide:file-text" class="h-3.5 w-3.5 text-red-600" />
          PDF
        </button>
      </div>
    </div>

    <!-- Responsive Data Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-800 whitespace-nowrap"
              :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'"
              @click="toggleSort(col.key)"
            >
              <span class="inline-flex items-center gap-1">
                <span>{{ col.label }}</span>
                <Icon
                  v-if="sortKey === col.key"
                  :name="sortAsc ? 'lucide:arrow-up' : 'lucide:arrow-down'"
                  class="h-3 w-3 text-red-600"
                />
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
          <tr
            v-for="(row, rIdx) in paginatedRows"
            :key="rIdx"
            class="hover:bg-gray-50/80 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 whitespace-nowrap text-xs sm:text-sm"
              :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'"
            >
              <!-- Currency -->
              <span v-if="col.format === 'currency'" class="font-semibold text-gray-900 tabular-nums">
                GHS {{ Number(row[col.key] ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>

              <!-- Number -->
              <span v-else-if="col.format === 'number'" class="font-medium text-gray-800 tabular-nums">
                {{ Number(row[col.key] ?? 0).toLocaleString('en-US') }}
              </span>

              <!-- Percent -->
              <span v-else-if="col.format === 'percent'" class="font-semibold text-gray-800 tabular-nums">
                {{ Number(row[col.key] ?? 0).toFixed(1) }}%
              </span>

              <!-- Code -->
              <code
                v-else-if="col.format === 'code'"
                class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200/80"
              >
                {{ row[col.key] }}
              </code>

              <!-- Progress Bar -->
              <div v-else-if="col.format === 'progress'" class="flex items-center gap-2 min-w-[115px]">
                <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all"
                    :class="
                      Number(row[col.key]) >= 90
                        ? 'bg-red-600'
                        : Number(row[col.key]) >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    "
                    :style="{ width: `${Math.min(100, Math.max(2, Number(row[col.key] ?? 0)))}%` }"
                  />
                </div>
                <span class="text-xs font-bold tabular-nums text-gray-700 w-11 text-right">
                  {{ Number(row[col.key] ?? 0).toFixed(1) }}%
                </span>
              </div>

              <!-- Status Badge -->
              <span
                v-else-if="col.format === 'badge'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                :class="getBadgeClass(String(row[col.key] ?? ''))"
              >
                {{ row[col.key] }}
              </span>

              <!-- Default Text -->
              <span v-else class="text-gray-800 font-medium">
                {{ row[col.key] }}
              </span>
            </td>
          </tr>

          <tr v-if="!paginatedRows.length">
            <td :colspan="columns.length" class="px-6 py-10 text-center text-gray-500 text-sm">
              No records match "{{ searchQuery }}".
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div
      v-if="totalPages > 1"
      class="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600"
    >
      <span>
        Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong>–<strong>{{
          Math.min(currentPage * pageSize, filteredSortedRows.length)
        }}</strong>
        of <strong>{{ filteredSortedRows.length }}</strong>
      </span>
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          :disabled="currentPage <= 1"
          class="px-2.5 py-1 rounded border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-100 font-medium"
          @click="currentPage--"
        >
          Prev
        </button>
        <span class="px-2 font-semibold text-gray-800">
          Page {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="px-2.5 py-1 rounded border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-100 font-medium"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ReportTableColumn } from '~/models/reports';

const props = withDefaults(
  defineProps<{
    title?: string;
    columns: ReportTableColumn[];
    rows: Record<string, any>[];
    filename?: string;
    pageSize?: number;
  }>(),
  {
    title: 'Detailed Report Dataset',
    filename: 'graphic-newsplus-report',
    pageSize: 10,
  }
);

const searchQuery = ref('');
const sortKey = ref('');
const sortAsc = ref(true);
const currentPage = ref(1);

watch(
  () => [props.rows, searchQuery.value],
  () => {
    currentPage.value = 1;
  }
);

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const filteredSortedRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let list = props.rows || [];
  if (q) {
    list = list.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }
  if (!sortKey.value) return list;

  return [...list].sort((a, b) => {
    const av = a[sortKey.value];
    const bv = b[sortKey.value];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortAsc.value ? av - bv : bv - av;
    }
    return sortAsc.value
      ? String(av ?? '').localeCompare(String(bv ?? ''))
      : String(bv ?? '').localeCompare(String(av ?? ''));
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSortedRows.length / props.pageSize))
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return filteredSortedRows.value.slice(start, start + props.pageSize);
});

function getBadgeClass(val: string) {
  const upper = val.toUpperCase();
  if (
    ['SUCCESS', 'COMPLETED', 'PAID', 'ACTIVE', 'HEALTHY', 'ON TRACK', 'HIGH CITATION', 'GOLD'].some(
      (k) => upper.includes(k)
    )
  ) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  if (
    ['PENDING', 'WARNING', 'NEAR LIMIT', 'REVIEW', 'SENT', 'AT RISK', 'PLATINUM', 'MEDIUM', 'LOW'].some(
      (k) => upper.includes(k)
    )
  ) {
    return 'bg-amber-50 text-amber-800 border border-amber-200';
  }
  if (
    ['FAILED', 'OVERDUE', 'CRITICAL', 'EXHAUSTED', 'BREACHED', 'HIGH', 'HIGH GAP', 'BLOCKED'].some(
      (k) => upper.includes(k)
    )
  ) {
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  }
  return 'bg-blue-50 text-blue-700 border border-blue-200';
}

function buildCleanExportMatrix() {
  const headers = props.columns.map((c) => c.label);
  const body = filteredSortedRows.value.map((r) =>
    props.columns.map((c) => {
      const val = r[c.key];
      if (c.format === 'currency') return Number(val ?? 0).toFixed(2);
      if (c.format === 'percent' || c.format === 'progress') return `${Number(val ?? 0).toFixed(1)}%`;
      return val ?? '';
    })
  );
  return { headers, body };
}

function exportCsv() {
  const { headers, body } = buildCleanExportMatrix();
  const lines = [
    headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...body.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${props.filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportExcel() {
  const xlsxMod = await import('xlsx');
  const XLSX = xlsxMod.default || xlsxMod;
  const rowsObj = filteredSortedRows.value.map((r) => {
    const out: Record<string, any> = {};
    for (const col of props.columns) {
      out[col.label] = r[col.key];
    }
    return out;
  });
  const ws = XLSX.utils.json_to_sheet(rowsObj);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'GNP Report');
  XLSX.writeFile(wb, `${props.filename}.xlsx`);
}

async function exportPdf() {
  const { jsPDF } = await import('jspdf');
  const { headers, body } = buildCleanExportMatrix();
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(14);
  doc.setTextColor(217, 45, 32);
  doc.text('GRAPHIC NEWSPLUS — PLATFORM ANALYTICS REPORT', 40, 38);
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(props.title, 40, 54);

  const colWidth = Math.floor(760 / Math.max(headers.length, 1));
  let y = 80;
  doc.setFillColor(243, 244, 246);
  doc.rect(40, y - 12, 760, 20, 'F');
  doc.setFontSize(8);
  doc.setTextColor(17, 24, 39);
  headers.forEach((h, idx) => {
    doc.text(String(h).slice(0, 22), 44 + idx * colWidth, y + 2);
  });

  y += 20;
  doc.setTextColor(55, 65, 81);
  body.slice(0, 35).forEach((row) => {
    if (y > 545) {
      doc.addPage();
      y = 45;
    }
    row.forEach((cell, idx) => {
      doc.text(String(cell).slice(0, 24), 44 + idx * colWidth, y);
    });
    y += 16;
  });

  doc.save(`${props.filename}.pdf`);
}
</script>
