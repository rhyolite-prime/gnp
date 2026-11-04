<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Performance Stats</h1>
        <p class="text-gray-600 mt-1">Deep dive into your traffic and conversion data.</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-3">
        <select class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:ring-primary-500 focus:border-primary-500 shadow-sm">
          <option>Custom Date Range</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>
    </div>

    <!-- Stats Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="item in statsBreakdown" :key="item.label" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{{ item.label }}</div>
        <div class="text-2xl font-black text-gray-900">{{ item.value }}</div>
        <div class="mt-4 flex items-center">
          <span :class="`text-xs font-bold ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`">
            {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
          </span>
          <span class="text-[10px] text-gray-400 ml-2">vs previous period</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Traffic Sources -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-8">Traffic Sources</h2>
        <div class="space-y-6">
          <div v-for="source in trafficSources" :key="source.name">
            <div class="flex justify-between text-sm mb-2 font-bold">
              <span class="text-gray-700">{{ source.name }}</span>
              <span class="text-gray-900">{{ source.percentage }}%</span>
            </div>
            <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div :class="`h-full ${source.barColor} rounded-full`" :style="{ width: `${source.percentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Device Distribution -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-8">Device Distribution</h2>
        <div class="flex items-center justify-around h-full py-4">
           <div v-for="device in devices" :key="device.name" class="flex flex-col items-center">
              <div :class="`h-16 w-16 rounded-2xl ${device.bgColor} flex items-center justify-center mb-4`">
                <component :is="device.icon" :class="`h-8 w-8 ${device.iconColor}`" />
              </div>
              <span class="text-sm font-bold text-gray-900">{{ device.percentage }}%</span>
              <span class="text-xs text-gray-400">{{ device.name }}</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Daily Performance Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">Daily Breakdown</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left font-sans">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Clicks</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Unique Visitors</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Conversions</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Conv. Rate</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Earnings</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="day in dailyStats" :key="day.date" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ day.date }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ day.clicks }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ day.visitors }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ day.conversions }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold px-2 py-1 bg-primary-100 text-primary-700 rounded-lg">{{ day.rate }}%</span>
              </td>
              <td class="px-6 py-4 text-sm font-black text-gray-900">₵{{ day.earnings }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  affiliateStatsBreakdown as statsBreakdown,
  affiliateTrafficSources as trafficSources,
  affiliateDevices as devices,
  affiliateDailyStats as dailyStats,
} from '~/mocks/affiliates/portal'

definePageMeta({
  layout: 'default',
  middleware: ['affiliate-auth']
})
</script>
