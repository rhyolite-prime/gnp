<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Commissions</h1>
      <p class="mt-2 text-sm text-gray-700">Track all commission earnings from affiliates.</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
       <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        <ArrowDownTrayIcon class="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        Export CSV
      </button>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
    <div class="w-full sm:w-64">
      <label for="affiliate" class="block text-sm font-medium text-gray-700 mb-1">Affiliate</label>
      <input
          type="text"
          id="affiliate"
          v-model="affiliateFilter"
          placeholder="Filter by affiliate name"
          class="block w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
        />
    </div>

    <div class="w-full sm:w-48">
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        id="status"
        v-model="statusFilter"
        class="block w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
      >
        <option value="">All Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>

    <div class="w-full sm:w-48">
       <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
       <select
        id="date"
        class="block w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
      >
        <option>This Month</option>
        <option>Last Month</option>
        <option>All Time</option>
      </select>
    </div>
  </div>

  <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Affiliate</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="commission in filteredCommissions" :key="commission.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            #{{ commission.orderId }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ commission.affiliateName }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
            ₵{{ commission.amount.toFixed(2) }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" :class="{
              'bg-green-100 text-green-800': commission.status === 'Paid',
              'bg-yellow-100 text-yellow-800': commission.status === 'Pending',
              'bg-gray-100 text-gray-800': commission.status === 'Cancelled'
            }">
              {{ commission.status }}
            </span>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ commission.date }}
          </td>
        </tr>
      </tbody>
    </table>
     <!-- Pagination (Placeholder) -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
        <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">1</span>
            to
            <span class="font-medium">10</span>
            of
            <span class="font-medium">{{ commissions.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a href="#" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#" aria-current="page" class="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">1</a>
            <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
            <a href="#" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const affiliateFilter = ref('')
const statusFilter = ref('')

const commissions = [
  { id: 1, orderId: 'ORD-123456', affiliateName: 'Lindsay Walton', amount: 45.00, status: 'Paid', date: 'Feb 10, 2026' },
  { id: 2, orderId: 'ORD-789012', affiliateName: 'Courtney Henry', amount: 120.50, status: 'Pending', date: 'Feb 09, 2026' },
  { id: 3, orderId: 'ORD-345678', affiliateName: 'Tom Cook', amount: 15.00, status: 'Paid', date: 'Feb 08, 2026' },
  { id: 4, orderId: 'ORD-901234', affiliateName: 'Whitney Francis', amount: 210.00, status: 'Pending', date: 'Feb 08, 2026' },
  { id: 5, orderId: 'ORD-567890', affiliateName: 'Lindsay Walton', amount: 35.00, status: 'Paid', date: 'Feb 07, 2026' },
  { id: 6, orderId: 'ORD-234567', affiliateName: 'Leonard Krasner', amount: 60.00, status: 'Cancelled', date: 'Feb 06, 2026' },
  { id: 7, orderId: 'ORD-890123', affiliateName: 'Floyd Miles', amount: 95.00, status: 'Paid', date: 'Feb 05, 2026' },
  { id: 8, orderId: 'ORD-456789', affiliateName: 'Courtney Henry', amount: 110.00, status: 'Pending', date: 'Feb 05, 2026' },
]

const filteredCommissions = computed(() => {
  return commissions.filter(commission => {
     const matchesAffiliate = affiliateFilter.value 
        ? commission.affiliateName.toLowerCase().includes(affiliateFilter.value.toLowerCase()) 
        : true
      const matchesStatus = statusFilter.value 
        ? commission.status === statusFilter.value 
        : true
      return matchesAffiliate && matchesStatus
  })
})
</script>
