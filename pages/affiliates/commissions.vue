<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Commission History</h1>
      <p class="text-gray-600 mt-1">Track all your earnings from successful referrals.</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[240px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">Search Referrals</label>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            v-model="searchQuery"
            class="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search by name or email..."
          />
        </div>
      </div>
      <div class="w-full sm:w-48">
        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select v-model="statusFilter" class="block w-full py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      <div class="w-full sm:w-48">
        <label class="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
        <select v-model="periodFilter" class="block w-full py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="year">Past Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>

    <!-- Commissions Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Referral</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Subscription Plan</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Revenue</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Commission</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="comm in commissions" :key="comm.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900">{{ comm.customer }}</div>
                <div class="text-xs text-gray-500">{{ comm.email }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ comm.plan }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 font-medium">₵{{ comm.revenue }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-primary-600">₵{{ comm.commission }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${comm.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`">
                  {{ comm.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ comm.date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-sm text-gray-500">Showing 1 to 10 of 45 commissions</p>
        <div class="flex gap-2">
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition disabled:opacity-50" disabled>Previous</button>
          <button class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: ['affiliate-auth']
})


const searchQuery = ref('')
const statusFilter = ref('All')
const periodFilter = ref('30')

const commissions = ref([
  { id: 1, customer: 'John Doe', email: 'john@example.com', plan: 'Premium Yearly', revenue: 600, commission: 120, status: 'Completed', date: 'Feb 17, 2026' },
  { id: 2, customer: 'Sarah Amponsah', email: 'sarah.am@example.com', plan: 'Basic Monthly', revenue: 75, commission: 15, status: 'Completed', date: 'Feb 17, 2026' },
  { id: 3, customer: 'Akwasi Mensah', email: 'akwasi@network.com', plan: 'Standard Quarterly', revenue: 225, commission: 45, status: 'Pending', date: 'Feb 16, 2026' },
  { id: 4, customer: 'Evelyn White', email: 'ev.white@gmail.com', plan: 'Premium Monthly', revenue: 150, commission: 30, status: 'Completed', date: 'Feb 15, 2026' },
  { id: 5, customer: 'Michael Kojo', email: 'mkojo@yahoo.com', plan: 'Premium Yearly', revenue: 600, commission: 120, status: 'Completed', date: 'Feb 14, 2026' },
  { id: 6, customer: 'Ama Serwaa', email: 'ama.s@test.com', plan: 'Standard Yearly', revenue: 450, commission: 90, status: 'Completed', date: 'Feb 12, 2026' },
  { id: 7, customer: 'Kofi Owusu', email: 'kofi.oo@gmail.com', plan: 'Basic Monthly', revenue: 75, commission: 15, status: 'Completed', date: 'Feb 10, 2026' },
  { id: 8, customer: 'Abena Mansa', email: 'abena.m@test.com', plan: 'Premium Quarterly', revenue: 300, commission: 60, status: 'Completed', date: 'Feb 08, 2026' },
  { id: 9, customer: 'Yaw Boakye', email: 'yaw.b@gmail.com', plan: 'Basic Yearly', revenue: 300, commission: 60, status: 'Completed', date: 'Feb 05, 2026' },
  { id: 10, customer: 'Efua Mensah', email: 'efua.m@test.com', plan: 'Standard Quarterly', revenue: 225, commission: 45, status: 'Completed', date: 'Feb 01, 2026' },
])
</script>
