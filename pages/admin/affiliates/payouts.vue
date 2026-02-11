<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Payouts</h1>
      <p class="mt-2 text-sm text-gray-700">Manage affiliate payout requests.</p>
    </div>
  </div>

  <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Affiliate</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Method</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Requested</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="payout in payouts" :key="payout.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            {{ payout.affiliateName }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
            ₵{{ payout.amount.toFixed(2) }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ payout.method }} <span class="text-xs text-gray-400">({{ payout.details }})</span>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ payout.date }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
             <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" :class="{
              'bg-green-100 text-green-800': payout.status === 'Paid',
              'bg-yellow-100 text-yellow-800': payout.status === 'Requested',
              'bg-blue-100 text-blue-800': payout.status === 'Processing'
            }">
              {{ payout.status }}
            </span>
          </td>
          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            <button 
              v-if="payout.status === 'Requested'" 
              @click="markAsPaid(payout.id)" 
              class="text-primary-600 hover:text-primary-900"
            >
              Mark as Paid
            </button>
            <span v-else class="text-gray-400 text-xs">No actions</span>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="payouts.length === 0" class="p-12 text-center">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <BanknotesIcon class="h-12 w-12" />
      </div>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No payout requests</h3>
      <p class="mt-1 text-sm text-gray-500">All caught up on payments!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BanknotesIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const payouts = ref([
  { id: 1, affiliateName: 'Kwame Mensah', amount: 450.00, method: 'Mobile Money', details: '024xxxxxxx', date: 'Feb 10, 2026', status: 'Requested' },
  { id: 2, affiliateName: 'Sarah Smith', amount: 1200.00, method: 'Bank Transfer', details: 'GCB Bank', date: 'Feb 09, 2026', status: 'Processing' },
  { id: 3, affiliateName: 'John Doe', amount: 250.00, method: 'Mobile Money', details: '054xxxxxxx', date: 'Feb 08, 2026', status: 'Paid' },
  { id: 4, affiliateName: 'Tech Review GH', amount: 890.00, method: 'Bank Transfer', details: 'Ecobank', date: 'Feb 08, 2026', status: 'Requested' },
])

const markAsPaid = (id: number) => {
  if(confirm('Confirm payment for this request?')) {
    const payout = payouts.value.find(p => p.id === id)
    if (payout) payout.status = 'Paid'
  }
}
</script>
