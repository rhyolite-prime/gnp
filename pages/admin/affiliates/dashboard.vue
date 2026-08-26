<template>
  <div>
    <!-- Date Filter -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Affiliate Dashboard</h1>
        <p class="text-sm text-gray-500">
          Overview of affiliate program performance
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            v-model="dateFrom"
            class="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            v-model="dateTo"
            class="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.name" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full" :class="stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-sm font-medium text-gray-500">{{ stat.name }}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="stat.value" :duration="2" :options="{ prefix: stat.prefix, suffix: stat.suffix }" />
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column (2/3) -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Commission Trends (Placeholder for Chart) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Commission Trends</h2>
             <select v-model="dateFilter" class="text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div ref="chartContainer" class="h-72 w-full mt-4"></div>
        </div>

        <!-- Recent Affiliate Activity -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <NuxtLink to="/admin/affiliates/commissions" class="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="activity in recentActivity" :key="activity.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <img class="h-8 w-8 rounded-full" :src="activity.avatar" alt="" />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ activity.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">{{ activity.action }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-semibold" :class="activity.amount > 0 ? 'text-green-600' : 'text-gray-900'">
                      {{ activity.amount > 0 ? '+' : '' }}₵{{ activity.amount }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ activity.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Right Column (1/3) -->
      <div class="space-y-8">
        
        <!-- Top Performing Affiliates -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Affiliates</h2>
          <div class="space-y-5">
            <div v-for="affiliate in topAffiliates" :key="affiliate.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <img :src="affiliate.avatar" class="h-10 w-10 rounded-full border border-gray-200" alt="">
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ affiliate.name }}</p>
                  <p class="text-xs text-gray-500">{{ affiliate.referrals }} Referrals</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900">₵{{ affiliate.earnings }}</p>
                <p class="text-xs text-green-600 flex items-center justify-end">
                  <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
                  {{ affiliate.growth }}%
                </p>
              </div>
            </div>
          </div>
          <button class="w-full mt-6 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
            View Leaderboard
          </button>
        </div>

        <!-- Traffic Sources -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          
           <div class="relative h-48 w-48 mx-auto my-4">
             <svg viewBox="0 0 100 100" class="h-full w-full transform -rotate-90">
               <!-- Social Media (45%) -->
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" stroke-width="20" stroke-dasharray="113 251" /> 
               <!-- Blogs (30%) -->
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" stroke-width="20" stroke-dasharray="75 251" stroke-dashoffset="-113" />
               <!-- Direct (15%) -->
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="20" stroke-dasharray="38 251" stroke-dashoffset="-188" />
               <!-- Other (10%) -->
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" stroke-width="20" stroke-dasharray="25 251" stroke-dashoffset="-226" />
             </svg>
             <div class="absolute inset-0 flex items-center justify-center">
               <div class="text-center">
                 <span class="block text-2xl font-bold text-gray-900">12.5k</span>
                 <span class="text-xs text-gray-500">Visits</span>
               </div>
             </div>
           </div>

           <div class="space-y-3 mt-4">
             <div class="flex items-center justify-between text-sm">
               <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>Social Media</div>
               <span class="font-medium">45%</span>
             </div>
             <div class="flex items-center justify-between text-sm">
               <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Blogs & Content</div>
               <span class="font-medium">30%</span>
             </div>
             <div class="flex items-center justify-between text-sm">
               <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Direct Link</div>
               <span class="font-medium">15%</span>
             </div>
             <div class="flex items-center justify-between text-sm">
               <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>Others</div>
               <span class="font-medium">10%</span>
             </div>
           </div>
        </div>

        <!-- Pending Payouts Action -->
        <div class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-primary-100 text-sm font-medium mb-1">Pending Payouts</p>
              <h3 class="text-3xl font-bold">₵4,250.00</h3>
            </div>
            <div class="p-2 bg-white/20 rounded-lg">
              <BanknotesIcon class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-primary-100 text-xs mt-2 mb-6">12 affiliates requesting payout</p>
          <NuxtLink to="/admin/affiliates/payouts" class="block w-full text-center bg-white text-primary-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors">
            Process Payouts
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  DocumentCheckIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'

definePageMeta({
  layout: 'admin'
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
            <div>Commissions: ₵${p.value * 10}</div>
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
          name: 'Commissions',
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

const today = new Date()
const oneMonthAgo = new Date()
oneMonthAgo.setMonth(today.getMonth() - 1)

const dateFrom = ref(oneMonthAgo.toISOString().substring(0, 10))
const dateTo = ref(today.toISOString().substring(0, 10))

const stats = [
  { 
    name: 'Total Affiliates', 
    value: 156, 
    change: '+12%', 
    changeType: 'increase', 
    icon: UsersIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Total Commission', 
    value: 45200, 
    change: '+8.2%', 
    changeType: 'increase', 
    icon: CurrencyDollarIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    prefix: '₵',
    suffix: ''
  },
  { 
    name: 'Pending Applications', 
    value: 8, 
    change: '3 new', 
    changeType: 'increase', 
    icon: DocumentCheckIcon,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Pending Payouts', 
    value: 4250, 
    change: '-5%', 
    changeType: 'decrease', 
    icon: BanknotesIcon,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    prefix: '₵',
    suffix: ''
  },
]

const recentActivity = [
  { id: 1, name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe', action: 'Earned Commission', amount: 120, date: '2 mins ago' },
  { id: 2, name: 'Sarah Smith', avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith', action: 'New Affiliate Signup', amount: 0, date: '1 hour ago' },
  { id: 3, name: 'Michael Brown', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown', action: 'Payout Processed', amount: -450, date: '3 hours ago' },
  { id: 4, name: 'Emily White', avatar: 'https://ui-avatars.com/api/?name=Emily+White', action: 'Earned Commission', amount: 85, date: '5 hours ago' },
  { id: 5, name: 'David Wilson', avatar: 'https://ui-avatars.com/api/?name=David+Wilson', action: 'Application Approved', amount: 0, date: '1 day ago' },
]

const topAffiliates = [
  { id: 1, name: 'Tech Review GH', avatar: 'https://ui-avatars.com/api/?name=Tech+Review', referrals: 450, earnings: 5200, growth: 15 },
  { id: 2, name: 'Ama Influencer', avatar: 'https://ui-avatars.com/api/?name=Ama+Influencer', referrals: 380, earnings: 4100, growth: 8 },
  { id: 3, name: 'Student Hub', avatar: 'https://ui-avatars.com/api/?name=Student+Hub', referrals: 210, earnings: 2800, growth: 12 },
  { id: 4, name: 'News Daily', avatar: 'https://ui-avatars.com/api/?name=News+Daily', referrals: 150, earnings: 1900, growth: 5 },
]
</script>
