<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome back! Here's how your performance is looking.</p>
      </div>
      <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
        <select v-model="dateFilter" class="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2">
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="month">This Month</option>
        </select>
        <NuxtLink 
          to="/affiliates/links" 
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm font-medium"
        >
          <LinkIcon class="h-5 w-5 mr-2" />
          Generate Link
        </NuxtLink>
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium">
          <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
          Export Data
        </button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in quickStats" :key="stat.label" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div :class="`p-2 rounded-xl ${stat.bgColor}`">
            <component :is="stat.icon" :class="`h-6 w-6 ${stat.iconColor}`" />
          </div>
          <span :class="`text-xs font-bold px-2 py-1 rounded-full ${stat.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
            {{ stat.growth >= 0 ? '+' : '' }}{{ stat.growth }}%
          </span>
        </div>
        <div class="text-sm font-medium text-gray-500 mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ stat.prefix }}{{ stat.value }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Performance Chart -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Earnings Overview</h2>
        </div>
        <div ref="chartContainer" class="h-72 w-full"></div>
      </div>

      <!-- Recent Payouts -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Recent Payouts</h2>
          <NuxtLink to="/affiliates/payouts" class="text-sm font-medium text-primary-600 hover:text-primary-700">View All</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-for="payout in recentPayouts" :key="payout.id" class="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <BanknotesIcon class="h-5 w-5 text-gray-600" />
              </div>
              <div class="ml-3">
                <div class="text-sm font-bold text-gray-900">₵{{ payout.amount }}</div>
                <div class="text-xs text-gray-500">{{ payout.date }}</div>
              </div>
            </div>
            <span :class="`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${payout.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`">
              {{ payout.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Referrals/Commissions Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Recent Commissions</h2>
        <NuxtLink to="/affiliates/commissions" class="text-sm font-medium text-primary-600 hover:text-primary-700">See All Details</NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Referral</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Plan</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Earnings</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="comm in recentCommissions" :key="comm.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900">{{ comm.customer }}</div>
                <div class="text-xs text-gray-500">{{ comm.email }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ comm.plan }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">₵{{ comm.amount }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  CursorArrowRaysIcon, 
  BanknotesIcon,
  LinkIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: ['affiliate-auth']

})

const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const dateFilter = ref('7days')

const updateChartData = () => {
  if (!chart) return
  let data = []
  let xAxisData = []
  if (dateFilter.value === '7days') {
    data = [40, 60, 45, 90, 75, 80, 55]
    xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (dateFilter.value === '30days') {
    data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20)
    xAxisData = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  } else {
    data = [300, 400, 250, 450]
    xAxisData = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  }
  chart.setOption({
    xAxis: { data: xAxisData },
    series: [{ data }]
  })
}

watch(dateFilter, updateChartData)

onMounted(() => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0]
          return `<div class="font-sans">
            <div class="font-bold mb-1">${p.name}</div>
            <div>Earnings: ₵${p.value * 10}</div>
          </div>`
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#9ca3af', margin: 16 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#9ca3af', formatter: '₵{value}' }
      },
      series: [
        {
          name: 'Earnings',
          type: 'line',
          smooth: true,
          symbolSize: 8,
          itemStyle: {
            color: '#f97316', // Primary 500
          },
          lineStyle: {
            width: 3,
            color: '#f97316'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(249, 115, 22, 0.4)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0)' }
            ])
          },
          data: [40, 60, 45, 90, 75, 80, 55]
        }
      ]
    }
    chart.setOption(option)
    
    updateChartData()
    
    const handleResize = () => {
      chart?.resize()
    }
    window.addEventListener('resize', handleResize)
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      chart?.dispose()
    })
  }
})

const quickStats = computed(() => {
  if (dateFilter.value === '7days') {
    return [
      { label: 'Total Revenue', value: '4,520', growth: 12.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Commissions', value: '1,240', growth: 8.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '12,450', growth: -2.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Referrals', value: '156', growth: 15.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  } else if (dateFilter.value === '30days') {
    return [
      { label: 'Total Revenue', value: '18,500', growth: 5.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Commissions', value: '5,100', growth: 4.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '52,100', growth: 1.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Referrals', value: '620', growth: 8.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  } else {
    return [
      { label: 'Total Revenue', value: '14,200', growth: -1.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Commissions', value: '4,000', growth: -2.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '38,000', growth: -5.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Referrals', value: '450', growth: -3.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  }
})

const recentPayouts = computed(() => {
  if (dateFilter.value === '7days') {
    return [
      { id: 1, amount: 450, date: 'Feb 12, 2026', status: 'Paid' },
      { id: 2, amount: 120, date: 'Feb 05, 2026', status: 'Paid' },
      { id: 3, amount: 840, date: 'Jan 28, 2026', status: 'Paid' },
      { id: 4, amount: 300, date: 'Jan 10, 2026', status: 'Paid' },
    ]
  } else {
    return [
      { id: 1, amount: 1200, date: 'Jan 31, 2026', status: 'Paid' },
      { id: 2, amount: 850, date: 'Dec 31, 2025', status: 'Paid' },
      { id: 3, amount: 940, date: 'Nov 30, 2025', status: 'Paid' },
      { id: 4, amount: 730, date: 'Oct 31, 2025', status: 'Paid' },
    ]
  }
})

const recentCommissions = computed(() => {
  if (dateFilter.value === '7days') {
    return [
      { id: 1, customer: 'John Doe', email: 'john@example.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Just now' },
      { id: 2, customer: 'Sarah Amponsah', email: 'sarah.am@example.com', plan: 'Basic Monthly', amount: 15, status: 'Completed', date: '2 hours ago' },
      { id: 3, customer: 'Akwasi Mensah', email: 'akwasi@network.com', plan: 'Standard Quarterly', amount: 45, status: 'Pending', date: 'Yesterday' },
      { id: 4, customer: 'Evelyn White', email: 'ev.white@gmail.com', plan: 'Premium Monthly', amount: 30, status: 'Completed', date: 'Feb 15, 2026' },
      { id: 5, customer: 'Michael Kojo', email: 'mkojo@yahoo.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Feb 14, 2026' },
    ]
  } else {
    return [
      { id: 1, customer: 'Kofi Annan', email: 'kofi@example.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Jan 10, 2026' },
      { id: 2, customer: 'Ama Serwaa', email: 'ama.s@example.com', plan: 'Basic Monthly', amount: 15, status: 'Completed', date: 'Jan 12, 2026' },
      { id: 3, customer: 'Yaw Osei', email: 'yaw@network.com', plan: 'Standard Quarterly', amount: 45, status: 'Pending', date: 'Jan 15, 2026' },
    ]
  }
})
</script>
