<template>
  <div class="relative w-full" :style="{ height: `${height}px` }">
    <div ref="chartEl" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type * as EChartsTypes from 'echarts';

const props = withDefaults(
  defineProps<{
    option: Record<string, any>;
    height?: number;
  }>(),
  {
    height: 270,
  }
);

const chartEl = ref<HTMLDivElement | null>(null);
let chartInstance: EChartsTypes.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
let echartsLib: typeof EChartsTypes | null = null;

function buildSafeOption(raw: Record<string, any>): Record<string, any> {
  if (!raw) return {};
  const tooltip = raw.tooltip
    ? {
        appendToBody: true,
        confine: false,
        ...raw.tooltip,
      }
    : undefined;

  return {
    animationDuration: 400,
    animationEasing: 'cubicOut',
    ...raw,
    ...(tooltip ? { tooltip } : {}),
  };
}

async function initChart() {
  if (!import.meta.client || !chartEl.value) return;

  if (!echartsLib) {
    echartsLib = await import('echarts');
  }

  await nextTick();
  if (!chartEl.value) return;

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echartsLib.init(chartEl.value, undefined, { renderer: 'canvas' });
  chartInstance.setOption(buildSafeOption(props.option), true);

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartEl.value);
}

watch(
  () => props.option,
  (newOpt) => {
    if (chartInstance && newOpt) {
      chartInstance.setOption(buildSafeOption(newOpt), true);
    }
  },
  { deep: true }
);

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>
