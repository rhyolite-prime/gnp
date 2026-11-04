<template>
  <div ref="chartContainer" class="h-72 w-full" role="img" :aria-label="`Earnings overview for the ${periodLabel} period`"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { getAffiliateDashboardChart, type AffiliatePeriod } from '~/mocks/affiliates/portal'

const props = defineProps<{ period: AffiliatePeriod }>()

const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const periodLabel = computed(() =>
  props.period === '7days' ? 'last 7 days' : props.period === '30days' ? 'last 30 days' : 'current month',
)

const renderChart = () => {
  if (!chart) return
  const { data, xAxisData } = getAffiliateDashboardChart(props.period)
  chart.setOption({
    xAxis: { data: xAxisData },
    series: [{ data }],
  })
}

watch(() => props.period, renderChart)

onMounted(() => {
  if (!chartContainer.value) return
  chart = echarts.init(chartContainer.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `<div class="font-sans"><div class="font-bold mb-1">${p.name}</div><div>Earnings: ₵${p.value}</div></div>`
      },
    },
    grid: { left: '0%', right: '0%', bottom: '0%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: [],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280', margin: 16 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLabel: { color: '#6b7280', formatter: '₵{value}' },
    },
    series: [
      {
        name: 'Earnings',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#dc2626' },
        lineStyle: { width: 3, color: '#dc2626' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(220, 38, 38, 0.25)' },
            { offset: 1, color: 'rgba(220, 38, 38, 0)' },
          ]),
        },
        data: [],
      },
    ],
  })
  renderChart()

  resizeObserver = new ResizeObserver(() => chart?.resize())
  resizeObserver.observe(chartContainer.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>
