<template>
  <div>
    <!-- Date Filter -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Archives Dashboard</h1>
        <p class="text-sm text-gray-500">
          Historical newspaper search, digitization coverage, and institutional research usage
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
        <!-- Search & RAG Trend -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Archive Search & AI Research Volume</h2>
            <select v-model="rangeFilter" class="text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
          <div ref="searchChartRef" class="h-72 w-full"></div>
        </div>

        <!-- Institutional Accounts -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Institutional Accounts</h2>
            <NuxtLink to="/admin/content-management/archives" class="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage Archives</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Searches</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Used</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="inst in institutions" :key="inst.name" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ inst.name }}</div>
                    <div class="text-xs text-gray-500">{{ inst.tier }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ inst.searches.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ inst.used }}/{{ inst.quota }}</div>
                    <div class="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div class="bg-primary-600 h-1.5 rounded-full" :style="{ width: `${Math.min((inst.used / inst.quota) * 100, 100)}%` }"></div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column (1/3) -->
      <div class="space-y-8">
        <!-- Digitized Coverage by Decade -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Indexed Pages by Decade</h2>
          <div ref="decadeChartRef" class="h-64 w-full"></div>
        </div>

        <!-- Popular Research Topics -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Research Topics</h2>
          <div class="space-y-4">
            <div v-for="topic in popularTopics" :key="topic.query" class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ topic.query }}</p>
                <p class="text-xs text-gray-500">{{ topic.era }}</p>
              </div>
              <span class="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                {{ topic.count }} queries
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import {
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const dateFrom = ref(oneMonthAgo.toISOString().substring(0, 10));
const dateTo = ref(today.toISOString().substring(0, 10));
const rangeFilter = ref('7days');

const searchChartRef = ref<HTMLElement | null>(null);
const decadeChartRef = ref<HTMLElement | null>(null);
let searchChart: echarts.ECharts | null = null;
let decadeChart: echarts.ECharts | null = null;

const stats = [
  {
    name: 'Indexed Archive Pages',
    value: 482900,
    change: '+6.4%',
    changeType: 'increase',
    icon: ArchiveBoxIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    prefix: '',
    suffix: '',
  },
  {
    name: 'Archive Searches',
    value: 19420,
    change: '+18.5%',
    changeType: 'increase',
    icon: MagnifyingGlassIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    prefix: '',
    suffix: '',
  },
  {
    name: 'AI Citations Served',
    value: 7380,
    change: '+24.1%',
    changeType: 'increase',
    icon: SparklesIcon,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    prefix: '',
    suffix: '',
  },
  {
    name: 'Active Institutions',
    value: 26,
    change: '+3',
    changeType: 'increase',
    icon: BuildingLibraryIcon,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    prefix: '',
    suffix: '',
  },
];

const institutions = [
  { name: 'University of Ghana (Balme Library)', tier: 'Academic Unlimited', searches: 4620, used: 4120, quota: 5000 },
  { name: 'KNUST Library System', tier: 'Academic Research', searches: 3180, used: 2640, quota: 4000 },
  { name: 'Bank of Ghana Research Dept.', tier: 'Enterprise Archive', searches: 2490, used: 1980, quota: 3000 },
  { name: 'Parliament of Ghana Library', tier: 'Government Archive', searches: 1870, used: 1450, quota: 2500 },
];

const popularTopics = [
  { query: 'Akosombo Dam Construction & Financing', era: '1961 – 1966 Editions', count: 642 },
  { query: '1992 Fourth Republic Referendum', era: '1991 – 1993 Editions', count: 518 },
  { query: 'Cedi Redenomination Policy Analysis', era: '2007 Editions', count: 439 },
  { query: 'Black Stars AFCON 1982 Victory', era: '1982 Graphic Sports', count: 387 },
];

const renderSearchChart = () => {
  if (!searchChart) return;
  const labels =
    rangeFilter.value === '7days'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
  const searches =
    rangeFilter.value === '7days'
      ? [540, 620, 690, 740, 710, 460, 510]
      : [480, 520, 560, 610, 590, 430, 470, 550, 640, 695, 730, 715, 490, 535];
  const rag =
    rangeFilter.value === '7days'
      ? [210, 245, 290, 315, 298, 175, 195]
      : [180, 195, 220, 240, 230, 160, 172, 215, 255, 285, 310, 296, 185, 205];

  searchChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: '2%', right: '2%', top: '8%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLabel: { color: '#9ca3af' },
    },
    series: [
      {
        name: 'Keyword Searches',
        type: 'line',
        smooth: true,
        data: searches,
        itemStyle: { color: '#dc2626' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(220, 38, 38, 0.2)' },
            { offset: 1, color: 'rgba(220, 38, 38, 0)' },
          ]),
        },
      },
      {
        name: 'AI RAG Citations',
        type: 'line',
        smooth: true,
        data: rag,
        itemStyle: { color: '#2563eb' },
      },
    ],
  });
};

watch(rangeFilter, renderSearchChart);

onMounted(() => {
  if (searchChartRef.value) {
    searchChart = echarts.init(searchChartRef.value);
    renderSearchChart();
  }
  if (decadeChartRef.value) {
    decadeChart = echarts.init(decadeChartRef.value);
    decadeChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '2%', right: '4%', top: '6%', bottom: '4%', containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#9ca3af', formatter: '{value}k' },
      },
      yAxis: {
        type: 'category',
        data: ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: '#4b5563' },
      },
      series: [
        {
          name: 'Indexed Pages (k)',
          type: 'bar',
          barWidth: 14,
          data: [28, 42, 49, 54, 63, 76, 89, 82],
          itemStyle: { color: '#dc2626', borderRadius: [0, 4, 4, 0] },
        },
      ],
    });
  }

  const onResize = () => {
    searchChart?.resize();
    decadeChart?.resize();
  };
  window.addEventListener('resize', onResize);
  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
    searchChart?.dispose();
    decadeChart?.dispose();
  });
});
</script>
