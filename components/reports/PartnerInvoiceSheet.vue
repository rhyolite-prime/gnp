<template>
  <div
    class="invoice-sheet"
    :class="mode === 'print' ? 'invoice-sheet--print' : 'invoice-sheet--preview'"
  >
    <!-- Invoice Header -->
    <div class="flex justify-between items-start mb-10 avoid-break">
      <div>
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20 invoice-logo">
            G
          </div>
          <span class="text-2xl font-bold text-gray-900 tracking-tight">NewsPlus<span class="text-primary-600">.</span></span>
        </div>
        <p class="text-sm text-gray-500">Graphic Communications Group Ltd.</p>
        <p class="text-sm text-gray-500">Graphic Road, Accra, Ghana</p>
        <p class="text-sm text-gray-500">billing@graphic.com.gh</p>
      </div>

      <div class="text-right">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
        <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Invoice No:</span> {{ invoice.invoiceNo }}</p>
        <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Date:</span> {{ invoice.date }}</p>
        <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Due Date:</span> {{ invoice.dueDate }}</p>
      </div>
    </div>

    <!-- Billed To -->
    <div class="mb-10 grid grid-cols-2 gap-8 avoid-break">
      <div>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
        <p class="text-base font-semibold text-gray-900">{{ invoice.billedTo?.name || invoice.partnerName }}</p>
        <p v-if="invoice.partnerAddress || fallbackAddress" class="text-sm text-gray-500 whitespace-pre-line">{{ invoice.partnerAddress || fallbackAddress }}</p>
        <p class="text-sm text-gray-500">{{ invoice.billedTo?.email || invoice.partnerEmail }}</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-5 border border-gray-100 invoice-period">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Period</h3>
        <p class="text-sm font-medium text-gray-900">{{ invoice.billingPeriod }}</p>
      </div>
    </div>

    <!-- Invoice Items -->
    <div class="mb-8">
      <table class="w-full border-collapse invoice-table">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty / Imps</th>
            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (₵)</th>
            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₵)</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in invoice.items" :key="`${item.description}-${index}`" class="avoid-break">
            <td class="px-4 py-4 align-top">
              <div class="text-sm font-medium text-gray-900">{{ item.description }}</div>
              <div class="text-xs text-gray-500">{{ item.details }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700 align-top">{{ Number(item.quantity).toLocaleString() }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700 align-top">{{ formatMoney(item.unitPrice) }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 align-top">{{ formatMoney(item.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="flex justify-end avoid-break">
      <div class="w-full max-w-sm space-y-3">
        <div class="flex justify-between text-sm text-gray-600 px-4">
          <span>Subtotal</span>
          <span class="font-medium text-gray-900">GHS {{ formatMoney(invoice.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-600 px-4">
          <span>VAT ({{ invoice.taxPolicy?.vatPercent ?? 15 }}%)</span>
          <span class="font-medium text-gray-900">GHS {{ formatMoney(invoice.vat) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-600 px-4">
          <span>NHIL + GETFL ({{ invoice.taxPolicy?.getflNhilPercent ?? 5 }}%)</span>
          <span class="font-medium text-gray-900">GHS {{ formatMoney(invoice.getflNhil) }}</span>
        </div>
        <div v-if="invoice.discount" class="flex justify-between text-sm text-gray-600 px-4">
          <span>Discount</span>
          <span class="font-medium text-red-600">- GHS {{ formatMoney(invoice.discount) }}</span>
        </div>
        <div class="pt-3 border-t border-gray-200 flex justify-between px-4">
          <span class="text-base font-bold text-gray-900">Total Due</span>
          <span class="text-xl font-bold text-primary-600">GHS {{ formatMoney(invoice.totalDue) }}</span>
        </div>
        <div class="flex justify-between text-xs text-gray-500 px-4">
          <span>Outstanding Balance (pre-tax)</span>
          <span class="font-medium text-gray-700">GHS {{ formatMoney(invoice.outstandingBalance) }}</span>
        </div>
      </div>
    </div>

    <!-- Charts (only when "Include charts" is enabled) -->
    <div
      v-if="includeCharts && invoice.charts?.length"
      class="mt-10 pt-8 border-t border-gray-100 grid gap-8 invoice-charts"
      :class="mode === 'print' ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-2'"
    >
      <div v-for="chart in invoice.charts" :key="chart.id" class="avoid-break">
        <h3 class="text-base font-medium text-gray-900 mb-4">{{ chart.title }}</h3>
        <EChartCanvas
          :option="buildEChartOptionFromPlainData(chart)"
          :height="250"
          :renderer="mode === 'print' ? 'svg' : 'canvas'"
        />
      </div>
    </div>

    <!-- Footer Notes -->
    <div class="mt-14 pt-8 border-t border-gray-100 text-sm text-gray-500 avoid-break">
      <p class="font-medium text-gray-700 mb-1">Payment Instructions:</p>
      <p>Please make payment to Graphic Communications Group Ltd. via Bank Transfer.</p>
      <p>Bank: Guarantee Trust Bank (GT Bank)<br />Account No: 3201001382531</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import { buildEChartOptionFromPlainData } from '~/utils/reportChartOption.js';
import type { PartnerInvoiceReport } from '~/models/reports';

withDefaults(
  defineProps<{
    invoice: PartnerInvoiceReport;
    /** `preview` = fluid width inside the admin card; `print` = fixed A4 sheet (210mm). */
    mode?: 'preview' | 'print';
    includeCharts?: boolean;
    fallbackAddress?: string;
  }>(),
  {
    mode: 'preview',
    includeCharts: true,
    fallbackAddress: '',
  }
);

function formatMoney(val: number): string {
  return Number(val || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
</script>

<style scoped>
.invoice-sheet {
  background: #ffffff;
  color: #111827;
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.invoice-sheet--preview {
  padding: 2rem;
}

/* Exact A4 page (210 x 297mm) with a 14mm / 16mm content margin. */
.invoice-sheet--print {
  width: 210mm;
  box-sizing: border-box;
  padding: 14mm 16mm;
}

.invoice-table th,
.invoice-table td {
  border-bottom: 1px solid #e5e7eb;
}

.invoice-table thead th {
  border-top: 1px solid #e5e7eb;
}

.avoid-break {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
