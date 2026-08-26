<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header & Back Navigation -->
    <div class="mb-8">
      <NuxtLink to="/admin/affiliates" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeftIcon class="mr-2 h-4 w-4" />
        Back to Affiliates
      </NuxtLink>
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <img 
            :src="affiliate.image" 
            alt="Affiliate Avatar" 
            class="h-16 w-16 rounded-full border border-gray-200"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ affiliate.name }}</h1>
            <p class="text-sm text-gray-500">{{ affiliate.email }} &bull; Joined {{ affiliate.dateJoined }}</p>
          </div>
          <span 
            class="ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
            :class="{
              'bg-green-50 text-green-700 ring-green-600/20': affiliate.status === 'Active',
              'bg-yellow-50 text-yellow-700 ring-yellow-600/20': affiliate.status === 'Pending',
              'bg-red-50 text-red-700 ring-red-600/20': affiliate.status === 'Suspended'
            }">
            {{ affiliate.status }}
          </span>
        </div>
        
        <div class="flex gap-2">
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition">
            Suspend Account
          </button>
          <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition">
            Process Payout
          </button>
        </div>
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

    <!-- Charts and Data Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Performance Chart -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Performance Overview</h2>
          <select v-model="dateFilter" class="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div ref="chartContainer" class="h-72 w-full"></div>
      </div>

      <!-- Traffic Sources / Links -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Traffic Sources</h2>
        </div>
        <div class="space-y-6">
          <div>
             <div class="flex justify-between text-sm mb-1">
               <span class="font-medium text-gray-700">Social Media</span>
               <span class="text-gray-500">45%</span>
             </div>
             <div class="w-full bg-gray-100 rounded-full h-2">
               <div class="bg-purple-500 h-2 rounded-full" style="width: 45%"></div>
             </div>
          </div>
          <div>
             <div class="flex justify-between text-sm mb-1">
               <span class="font-medium text-gray-700">Blogs & Articles</span>
               <span class="text-gray-500">30%</span>
             </div>
             <div class="w-full bg-gray-100 rounded-full h-2">
               <div class="bg-blue-500 h-2 rounded-full" style="width: 30%"></div>
             </div>
          </div>
          <div>
             <div class="flex justify-between text-sm mb-1">
               <span class="font-medium text-gray-700">Direct Links</span>
               <span class="text-gray-500">15%</span>
             </div>
             <div class="w-full bg-gray-100 rounded-full h-2">
               <div class="bg-green-500 h-2 rounded-full" style="width: 15%"></div>
             </div>
          </div>
          <div>
             <div class="flex justify-between text-sm mb-1">
               <span class="font-medium text-gray-700">Others</span>
               <span class="text-gray-500">10%</span>
             </div>
             <div class="w-full bg-gray-100 rounded-full h-2">
               <div class="bg-yellow-500 h-2 rounded-full" style="width: 10%"></div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Commissions Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Recent Commissions</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subscriber</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Commission</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="comm in recentCommissions" :key="comm.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">{{ comm.customer }}</div>
                <div class="text-xs text-gray-500">{{ comm.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">{{ comm.plan }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-900">₵{{ comm.amount }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${comm.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`">
                  {{ comm.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ comm.date }}
              </td>
            </tr>
            <tr v-if="recentCommissions.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                No recent commissions found for this affiliate.
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
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  CursorArrowRaysIcon, 
  BanknotesIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

 
const route = useRoute()
const affiliateId = route.params.id

// Mock Affiliate Profile Data
const affiliate = ref({
  id: affiliateId,
  name: 'Lindsay Walton',
  email: 'lindsay.walton@example.com',
  status: 'Active',
  dateJoined: 'Jan 10, 2026',
  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
})

const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const dateFilter = ref('7days')

const updateChartData = () => {
  if (!chart) return
  let dataClicks = []
  let dataEarnings = []
  let xAxisData = []
  
  if (dateFilter.value === '7days') {
    dataClicks = [120, 200, 150, 80, 70, 110, 130]
    dataEarnings = [40, 60, 45, 90, 75, 80, 55]
    xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (dateFilter.value === '30days') {
    dataClicks = Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 50)
    dataEarnings = Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20)
    xAxisData = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  } else {
    dataClicks = [800, 1200, 950, 1100]
    dataEarnings = [300, 400, 250, 450]
    xAxisData = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  }
  
  chart.setOption({
    xAxis: { data: xAxisData },
    series: [
      { data: dataEarnings },
      { data: dataClicks }
    ]
  })
}

watch(dateFilter, updateChartData)

onMounted(() => {
  // If the ID in URL implies a different mock user, we could fetch here.
  // We'll proceed with the static mock info since there's no backend endpoint yet.
  
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let html = `<div class="font-sans font-bold mb-1">${params[0].name}</div>`
          params.forEach((p: any) => {
            if (p.seriesName === 'Earnings') {
              html += `<div>${p.marker} Earnings: ₵${p.value}</div>`
            } else {
              html += `<div>${p.marker} Clicks: ${p.value}</div>`
            }
          })
          return html
        }
      },
      legend: {
        data: ['Earnings', 'Clicks'],
        bottom: 0,
        icon: 'circle'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '10%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#9ca3af', margin: 16 }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Earnings (₵)',
          position: 'left',
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
          axisLabel: { color: '#9ca3af' }
        },
        {
          type: 'value',
          name: 'Clicks',
          position: 'right',
          splitLine: { show: false },
          axisLabel: { color: '#9ca3af' }
        }
      ],
      series: [
        {
          name: 'Earnings',
          type: 'line',
          smooth: true,
          symbolSize: 8,
          yAxisIndex: 0,
          itemStyle: { color: '#f97316' }, // Primary 500
          lineStyle: { width: 3, color: '#f97316' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(249, 115, 22, 0.4)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0)' }
            ])
          },
          data: []
        },
        {
          name: 'Clicks',
          type: 'bar',
          barWidth: '30%',
          yAxisIndex: 1,
          itemStyle: { color: '#60a5fa', borderRadius: [4, 4, 0, 0] },
          data: []
        }
      ]
    }
    chart.setOption(option)
    updateChartData()
    
    const handleResize = () => chart?.resize()
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
      { label: 'Total Earnings', value: '2,450', growth: 12.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Total Sales', value: '42', growth: 8.2, prefix: '', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '1,450', growth: -2.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Conversion Rate', value: '2.89', growth: 1.1, prefix: '', suffix: '%', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  } else if (dateFilter.value === '30days') {
    return [
      { label: 'Total Earnings', value: '9,500', growth: 5.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Total Sales', value: '160', growth: 4.2, prefix: '', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '5,100', growth: 1.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Conversion Rate', value: '3.13', growth: 2.1, prefix: '', suffix: '%', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  } else {
    return [
      { label: 'Total Earnings', value: '14,200', growth: -1.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Total Sales', value: '240', growth: -2.2, prefix: '', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '8,000', growth: -5.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Conversion Rate', value: '3.00', growth: -0.1, prefix: '', suffix: '%', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
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
