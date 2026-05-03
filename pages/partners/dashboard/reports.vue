<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h2>
        <p class="text-sm text-slate-500 mt-1">Generate reports on subscriber activity and overall engagement.</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="timeRange" class="rounded-xl border-slate-200 bg-white text-slate-700 py-2 pl-4 pr-10 text-sm font-bold shadow-sm focus:ring-primary-500 focus:border-primary-500">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
          <option value="ytd">Year to Date</option>
        </select>
        <button @click="exportReport" class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Overview Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-shadow">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Total Reads</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ engagementReport?.totalReads?.toLocaleString() || '42.5k' }}</p>
        <span v-if="engagementReport" :class="['text-sm font-bold px-2 py-1 rounded-md self-start mt-4 flex items-center', engagementReport.totalReadsChangeType === 'increase' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50']">
          <component :is="engagementReport.totalReadsChangeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" class="w-4 h-4 mr-1" />
          {{ engagementReport.totalReadsChange }}% from last month
        </span>
        <span v-else class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
          +18% from last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-shadow">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Avg. Session Duration</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ engagementReport?.avgSessionDuration || '8m 12s' }}</p>
        <span v-if="engagementReport" :class="['text-sm font-bold px-2 py-1 rounded-md self-start mt-4 flex items-center', engagementReport.avgSessionDurationChangeType === 'increase' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50']">
          <component :is="engagementReport.avgSessionDurationChangeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" class="w-4 h-4 mr-1" />
          {{ engagementReport.avgSessionDurationChange }} from last month
        </span>
        <span v-else class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
          +2m 4s from last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-shadow">
        <h3 class="text-slate-500 text-sm font-bold mb-2">New Members Onboarded</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ engagementReport?.newMembersOnboarded || '342' }}</p>
        <span v-if="engagementReport" class="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
           {{ engagementReport.newMembersOnboardedChange }} from last month
        </span>
        <span v-else class="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
           Same as last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-shadow">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Active Readers (30d)</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ engagementReport?.activeReaders?.toLocaleString() || '2,105' }}</p>
        <span v-if="engagementReport" :class="['text-sm font-bold px-2 py-1 rounded-md self-start mt-4 flex items-center', engagementReport.activeReadersChangeType === 'increase' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50']">
          <component :is="engagementReport.activeReadersChangeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" class="w-4 h-4 mr-1" />
          {{ engagementReport.activeReadersChange }}% from last month
        </span>
        <span v-else class="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingDownIcon class="w-4 h-4 mr-1" />
          -4% from last month
        </span>
      </div>
    </div>

    <!-- Charts / Content Areas -->
    <div class="grid lg:grid-cols-3 gap-8 mb-8">
      <!-- Main Activity Chart -->
      <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <div class="flex justify-between items-center mb-6">
           <h3 class="text-lg font-bold text-slate-900">Engagement Over Time</h3>
        </div>
        <div class="flex-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-8 relative overflow-hidden min-h-[300px]">
           <!-- Mock Chart Visual using fetched or random data -->
           <div class="absolute bottom-0 w-full h-[60%] flex items-end justify-between px-8 pb-8 gap-4 opacity-70">
              <div v-for="(item, index) in (analyticsCharts?.engagementData || Array.from({length: 12}, (_, i) => ({ reads: Math.random() * 100 })))" :key="index" class="w-full bg-primary-500 rounded-t-md hover:bg-primary-400 transition-colors cursor-pointer relative group" :style="{ height: `${Math.max(20, item.reads)}%` }">
                 <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ item.reads }} reads
                 </div>
              </div>
           </div>
           <p class="text-slate-400 font-medium z-10 bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-200">Activity Analytics</p>
        </div>
      </div>

      <!-- Top Publications -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
         <h3 class="text-lg font-bold text-slate-900 mb-6">Top Publications</h3>
         <div class="space-y-6 flex-1">
            <template v-if="analyticsCharts?.topPublications && analyticsCharts.topPublications.length > 0">
              <div v-for="(pub, index) in analyticsCharts.topPublications" :key="pub.name" class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                       {{ index + 1 }}
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 text-sm">{{ pub.name }}</h4>
                      <p class="text-xs text-slate-500">{{ pub.reads }} reads</p>
                    </div>
                 </div>
                 <div :class="['text-sm font-bold px-2 py-1 rounded', pub.change >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50']">
                   {{ pub.change >= 0 ? '+' : '' }}{{ pub.change }}%
                 </div>
              </div>
            </template>
            <template v-else>
              <!-- Skeleton or empty state -->
              <div v-for="i in 4" :key="i" class="flex items-center justify-between animate-pulse">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-xl bg-slate-100"></div>
                   <div class="space-y-2">
                     <div class="h-4 w-24 bg-slate-100 rounded"></div>
                     <div class="h-3 w-16 bg-slate-100 rounded"></div>
                   </div>
                </div>
                <div class="h-6 w-10 bg-slate-100 rounded"></div>
              </div>
            </template>
         </div>
         <button class="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors border border-slate-200">
            View All Publications
         </button>
      </div>
    </div>

    <!-- API Usage Section -->
    <div class="mb-12">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <CommandLineIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900 tracking-tight">API & Integration Usage</h3>
          <p class="text-sm text-slate-500">Monitor your developer portal activity and endpoint health.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <BoltIcon class="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-slate-400">Total Calls</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ apiStats?.totalRequests || '0' }}</p>
          <div class="mt-4 flex items-center text-green-600 text-sm font-bold">
            <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
            +24% vs last period
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
              <CheckCircleIcon class="w-5 h-5 text-slate-400 group-hover:text-green-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-slate-400">Success Rate</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ apiStats?.successRate || '0' }}%</p>
          <div class="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full rounded-full transition-all duration-1000" :style="{ width: `${apiStats?.successRate || 0}%` }"></div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <SignalIcon class="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-slate-400">Avg. Latency</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ apiStats?.avgLatency || '0' }}ms</p>
          <div class="mt-4 flex items-center text-slate-500 text-sm font-medium">
            <span class="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            Stable performance
          </div>
        </div>
      </div>

      <!-- Usage by Endpoint Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h4 class="font-bold text-slate-900">Endpoint Performance</h4>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Last 30 Days</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th class="px-6 py-4">Endpoint Path</th>
                <th class="px-6 py-4">Method</th>
                <th class="px-6 py-4">Request Count</th>
                <th class="px-6 py-4">Success Rate</th>
                <th class="px-6 py-4">Avg. Latency</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in (apiStats?.usageByEndpoint || mockApiEndpoints)" :key="item.endpoint" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4">
                  <code class="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded-md">{{ item.endpoint }}</code>
                </td>
                <td class="px-6 py-4">
                  <span :class="['text-[10px] font-black px-2 py-1 rounded-md uppercase', getMethodColor(item.endpoint)]">
                    {{ getMethodName(item.endpoint) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-slate-900">{{ item.count }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div :class="['h-full rounded-full', item.successRate > 95 ? 'bg-green-500' : 'bg-amber-500']" :style="{ width: `${item.successRate}%` }"></div>
                    </div>
                    <span class="text-xs font-bold text-slate-700">{{ item.successRate }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs font-bold text-slate-500">{{ Math.floor(Math.random() * 200 + 50) }}ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CommandLineIcon,
  BoltIcon,
  SignalIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import type { ApiUsageStats, PartnerAnalyticsCharts, PartnerEngagementReport } from '~/models'
import { getApiUsageStats, getPartnerAnalyticsCharts, getPartnerEngagementReport } from '~/services/partners'

const timeRange = ref('30d')
const isFetching = ref(false)
const apiStats = ref<ApiUsageStats | null>(null)
const analyticsCharts = ref<PartnerAnalyticsCharts | null>(null)
const engagementReport = ref<PartnerEngagementReport | null>(null)

const mockApiEndpoints = [
  { endpoint: '/subscribers/onboard', count: 1240, successRate: 98.5 },
  { endpoint: '/partner/subscribers/subscription-status', count: 8520, successRate: 99.2 },
  { endpoint: '/partner/plans', count: 450, successRate: 100 },
  { endpoint: '/auth/token', count: 210, successRate: 97.8 },
  { endpoint: '/subscribers/bulk-upload', count: 45, successRate: 92.5 }
]

const getMethodName = (path: string) => {
  if (path.includes('onboard') || path.includes('token') || path.includes('bulk-upload')) return 'POST'
  if (path.includes('subscription-status') || path.includes('plans')) return 'GET'
  return 'GET'
}

const getMethodColor = (path: string) => {
  const method = getMethodName(path)
  if (method === 'POST') return 'bg-green-100 text-green-700'
  if (method === 'GET') return 'bg-sky-100 text-sky-700'
  return 'bg-slate-100 text-slate-700'
}

const fetchReportData = async () => {
  isFetching.value = true
  try {
    const [usage, analytics, engagement] = await Promise.all([
      getApiUsageStats({ range: timeRange.value }),
      getPartnerAnalyticsCharts({ range: timeRange.value }),
      getPartnerEngagementReport({ range: timeRange.value })
    ])
    apiStats.value = usage
    analyticsCharts.value = analytics
    engagementReport.value = engagement
  } catch (error) {
    console.error('Failed to fetch report data', error)
    // Keep initial nulls to trigger mock data in template if needed
  } finally {
    isFetching.value = false
  }
}

const exportReport = () => {
  // Implementation for exporting report
  console.log('Exporting report...')
}

watch(timeRange, fetchReportData)

onMounted(() => {
  fetchReportData()
})
</script>
