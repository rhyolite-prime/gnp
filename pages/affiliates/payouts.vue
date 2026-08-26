<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payouts</h1>
        <p class="text-gray-600 mt-1">Manage your withdrawals and view payout history.</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-sm font-bold">
          <BanknotesIcon class="h-5 w-5 mr-2" />
          Request Payout
        </button>
      </div>
    </div>

    <!-- Payout Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="text-sm font-medium text-gray-500 mb-1">Available for Payout</div>
        <div class="text-3xl font-extrabold text-gray-900">₵1,240.00</div>
        <div class="mt-4 text-xs text-gray-400">Minimum payout: ₵50.00</div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="text-sm font-medium text-gray-500 mb-1">Pending Payouts</div>
        <div class="text-3xl font-extrabold text-orange-600">₵0.00</div>
        <div class="mt-4 text-xs text-gray-400">Processing usually takes 3-5 days</div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Payouts to Date</div>
        <div class="text-3xl font-extrabold text-green-600">₵5,840.00</div>
        <div class="mt-4 text-xs text-gray-400">Last payout: Feb 12, 2026</div>
      </div>
    </div>

    <!-- Payout History -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">Payout History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Payout ID</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Method</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-900">#{{ payout.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-8 w-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <component :is="getIcon(payout.method)" class="h-4 w-4 text-gray-600" />
                  </div>
                  <span class="text-sm text-gray-600">{{ payout.method }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">₵{{ payout.amount }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 tracking-wider uppercase`">
                  {{ payout.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ payout.date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BanknotesIcon, CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: ['affiliate-auth']
})

const getIcon = (method: string) => {
  if (method.includes('Mobile')) return DevicePhoneMobileIcon
  return CreditCardIcon
}

const payouts = ref([
  { id: 'PAY-8921', method: 'Mobile Money (MTN)', amount: 450.00, status: 'Paid', date: 'Feb 12, 2026' },
  { id: 'PAY-7742', method: 'Bank Transfer', amount: 120.00, status: 'Paid', date: 'Feb 05, 2026' },
  { id: 'PAY-6531', method: 'Mobile Money (Telecel)', amount: 840.00, status: 'Paid', date: 'Jan 28, 2026' },
  { id: 'PAY-5520', method: 'Mobile Money (MTN)', amount: 300.00, status: 'Paid', date: 'Jan 10, 2026' },
])
</script>
