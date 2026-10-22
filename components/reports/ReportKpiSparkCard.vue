<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">
          {{ metric.label }}
        </p>
        <p class="text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
          {{ metric.value }}
        </p>
      </div>
      <span
        class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
        :class="deltaBadgeClass"
      >
        <Icon
          :name="
            metric.changeDirection === 'up'
              ? 'lucide:trending-up'
              : metric.changeDirection === 'down'
              ? 'lucide:trending-down'
              : 'lucide:minus'
          "
          class="h-3 w-3"
        />
        {{ metric.changePercent > 0 ? `+${metric.changePercent}%` : `${metric.changePercent}%` }}
      </span>
    </div>

    <div class="mt-3 flex items-end justify-between gap-3">
      <p v-if="metric.subtitle" class="text-[11px] text-gray-500 leading-tight line-clamp-2">
        {{ metric.subtitle }}
      </p>
      <div
        v-if="metric.sparkline && metric.sparkline.length > 1"
        ref="sparkEl"
        class="w-24 h-9 shrink-0 ml-auto"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { ReportKpiMetric } from '~/models/reports';
import type * as EChartsTypes from 'echarts';

const props = defineProps<{
  metric: ReportKpiMetric;
}>();

const sparkEl = ref<HTMLDivElement | null>(null);
let chart: EChartsTypes.ECharts | null = null;
let observer: ResizeObserver | null = null;

const isPositiveOutcome = computed(() => {
  if (props.metric.changeDirection === 'flat' || props.metric.changePercent === 0) return null;
  const wentUp = props.metric.changeDirection === 'up';
  return props.metric.positiveIsGood ? wentUp : !wentUp;
});

const deltaBadgeClass = computed(() => {
  if (isPositiveOutcome.value === null) return 'bg-gray-100 text-gray-700';
  return isPositiveOutcome.value
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
    : 'bg-rose-50 text-rose-700 border border-rose-200/70';
});

const strokeColor = computed(() => {
  if (isPositiveOutcome.value === false) return '#E11D48';
  if (isPositiveOutcome.value === null) return '#2563EB';
  return '#059669';
});

async function renderSpark() {
  if (!import.meta.client || !sparkEl.value || !props.metric.sparkline?.length) return;
  const echarts = await import('echarts');
  await nextTick();
  if (!sparkEl.value) return;

  if (!chart) {
    chart = echarts.init(sparkEl.value, undefined, { renderer: 'canvas' });
    observer = new ResizeObserver(() => chart?.resize());
    observer.observe(sparkEl.value);
  }

  const color = strokeColor.value;
  chart.setOption(
    {
      animation: true,
      grid: { left: 2, right: 2, top: 3, bottom: 2 },
      xAxis: { type: 'category', show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false, scale: true },
      tooltip: {
        show: true,
        trigger: 'axis',
        appendToBody: true,
        backgroundColor: '#111827',
        textStyle: { color: '#fff', fontSize: 11 },
        padding: [4, 8],
        formatter: (params: any) => `${params?.[0]?.value ?? ''}`,
      },
      series: [
        {
          type: 'line',
          data: props.metric.sparkline,
          smooth: 0.4,
          symbol: 'none',
          lineStyle: { width: 2, color },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${color}40` },
                { offset: 1, color: `${color}05` },
              ],
            },
          },
        },
      ],
    },
    true
  );
}

watch(
  () => props.metric,
  () => {
    renderSpark();
  },
  { deep: true }
);

onMounted(() => {
  renderSpark();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  chart?.dispose();
  chart = null;
});
</script>
