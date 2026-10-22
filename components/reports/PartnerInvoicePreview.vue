<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Action bar -->
    <div class="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-red-600/20 border border-red-500/40">
          <Icon name="lucide:receipt-text" class="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h4 class="text-sm font-bold tracking-wide">
            Official GRA Tax Invoice Preview — {{ invoice.invoiceNo }}
          </h4>
          <p class="text-xs text-slate-300">
            Includes corrected `gnp-api` formula: Subtotal - Discount + NHIL/GETFund (5%) + VAT (15%)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="sendingEmail"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors disabled:opacity-50 cursor-pointer"
          @click="$emit('send-email')"
        >
          <Icon name="lucide:mail" class="h-3.5 w-3.5" />
          {{ sendingEmail ? 'Sending...' : `Email ${invoice.billedTo.email}` }}
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
          @click="downloadInvoicePdf"
        >
          <Icon name="lucide:download" class="h-3.5 w-3.5" />
          Download Invoice PDF
        </button>
      </div>
    </div>

    <!-- Printable Invoice Sheet -->
    <div class="p-6 sm:p-8 space-y-6 bg-white">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div class="inline-flex items-center gap-2">
            <span class="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs tracking-wider">
              GRAPHIC NEWSPLUS
            </span>
            <span class="text-xs font-semibold text-gray-500">B2B COMMERCIAL BILLING</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mt-2">
            Graphic Communications Group Ltd.
          </h3>
          <p class="text-xs text-gray-500">
            No. 3 Graphic Road, South Industrial Area, Accra, Ghana • GRA TIN: C0003819204
          </p>
        </div>

        <div class="sm:text-right space-y-1">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
            :class="
              invoice.status === 'PAID'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            "
          >
            {{ invoice.status }}
          </span>
          <p class="text-sm font-bold text-gray-900">{{ invoice.invoiceNo }}</p>
          <p class="text-xs text-gray-500">Issued: {{ invoice.date }} • Due: {{ invoice.dueDate }}</p>
          <p class="text-xs text-gray-500">Billing Window: {{ invoice.billingPeriod }}</p>
        </div>
      </div>

      <!-- Bill To -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200/70">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Bill To (Partner)</p>
          <p class="text-sm font-bold text-gray-900 mt-1">
            {{ invoice.billedTo.name }} ({{ invoice.billedTo.identifier }})
          </p>
          <p class="text-xs text-gray-600 mt-0.5">Attn: {{ invoice.billedTo.contactName }} • {{ invoice.billedTo.phone }}</p>
          <p class="text-xs text-gray-600">{{ invoice.billedTo.address }}</p>
          <p class="text-xs font-mono text-gray-500 mt-0.5">Billing Email: {{ invoice.billedTo.email }}</p>
        </div>

        <div class="sm:text-right">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Settlement Account (GHS)</p>
          <p class="text-sm font-bold text-gray-900 mt-1">GCB Bank PLC — Corporate Branch, High Street</p>
          <p class="text-xs text-gray-600 mt-0.5">Account Name: Graphic Communications Group Ltd</p>
          <p class="text-xs font-mono text-gray-700 mt-0.5">Acc No: 1011130004928 • SWIFT: GHCBGHAC</p>
        </div>
      </div>

      <!-- Line Items -->
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2.5 text-left font-bold text-gray-600">Description</th>
              <th class="px-4 py-2.5 text-left font-bold text-gray-600">Details</th>
              <th class="px-4 py-2.5 text-right font-bold text-gray-600">Qty / Seats</th>
              <th class="px-4 py-2.5 text-right font-bold text-gray-600">Unit Rate</th>
              <th class="px-4 py-2.5 text-right font-bold text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(item, idx) in invoice.items" :key="idx">
              <td class="px-4 py-3 font-medium text-gray-900">{{ item.description }}</td>
              <td class="px-4 py-3 text-gray-600">{{ item.details }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ item.quantity.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right tabular-nums">GHS {{ item.unitPrice.toFixed(2) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                GHS {{ item.amount.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tax Breakdown -->
      <div class="flex justify-end">
        <div class="w-full sm:w-84 space-y-2 text-sm border-t sm:border-t-0 pt-4 sm:pt-0">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span class="font-medium tabular-nums">GHS {{ invoice.subtotal.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-emerald-700">
            <span>Corporate Volume Discount</span>
            <span class="font-medium tabular-nums">- GHS {{ invoice.discount.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>NHIL (2.5%) + GETFund (2.5%)</span>
            <span class="font-medium tabular-nums">GHS {{ invoice.getflNhil.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Standard VAT (15%)</span>
            <span class="font-medium tabular-nums">GHS {{ invoice.vat.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-gray-800 font-semibold pt-2 border-t border-gray-200">
            <span>Total Invoice Value</span>
            <span class="tabular-nums">GHS {{ invoice.totalDue.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-emerald-700">
            <span>Amount Paid / Settled</span>
            <span class="font-medium tabular-nums">- GHS {{ invoice.amountPaid.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between pt-3 border-t-2 border-gray-900 text-base font-extrabold text-gray-900">
            <span>Balance Due</span>
            <span class="text-red-600 tabular-nums">
              GHS {{ invoice.balanceDue.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartnerInvoiceDocument } from '~/models/reports';

const props = defineProps<{
  invoice: PartnerInvoiceDocument;
  sendingEmail?: boolean;
}>();

defineEmits<{
  (e: 'send-email'): void;
}>();

async function downloadInvoicePdf() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const inv = props.invoice;

  doc.setFillColor(217, 45, 32);
  doc.rect(40, 36, 515, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('GRAPHIC COMMUNICATIONS GROUP LTD — TAX INVOICE', 54, 62);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${inv.invoiceNo}`, 40, 104);
  doc.text(`Issue Date: ${inv.date}   |   Due Date: ${inv.dueDate}`, 40, 120);
  doc.text(`Bill To: ${inv.billedTo.name} (${inv.billedTo.email})`, 40, 140);
  doc.text(`Billing Period: ${inv.billingPeriod}`, 40, 156);

  let y = 190;
  doc.setFillColor(243, 244, 246);
  doc.rect(40, y - 14, 515, 22, 'F');
  doc.setFontSize(9);
  doc.text('Description', 46, y);
  doc.text('Qty', 340, y);
  doc.text('Unit (GHS)', 405, y);
  doc.text('Total (GHS)', 480, y);

  y += 22;
  inv.items.forEach((item) => {
    doc.text(item.description.slice(0, 48), 46, y);
    doc.text(String(item.quantity), 340, y);
    doc.text(item.unitPrice.toFixed(2), 405, y);
    doc.text(item.amount.toFixed(2), 480, y);
    y += 18;
  });

  y += 18;
  doc.line(340, y, 555, y);
  y += 18;
  doc.text(`Subtotal: GHS ${inv.subtotal.toFixed(2)}`, 390, y);
  y += 16;
  doc.text(`Discount: -GHS ${inv.discount.toFixed(2)}`, 390, y);
  y += 16;
  doc.text(`NHIL + GETFund (5%): GHS ${inv.getflNhil.toFixed(2)}`, 390, y);
  y += 16;
  doc.text(`VAT (15%): GHS ${inv.vat.toFixed(2)}`, 390, y);
  y += 20;
  doc.setFontSize(12);
  doc.setTextColor(217, 45, 32);
  doc.text(`BALANCE DUE: GHS ${inv.balanceDue.toFixed(2)}`, 370, y);

  doc.save(`${inv.invoiceNo}.pdf`);
}
</script>
