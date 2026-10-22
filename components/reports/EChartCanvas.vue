<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between transition-shadow hover:shadow-md h-full">
    <div v-if="title || subtitle" class="flex items-start justify-between gap-3 mb-3">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h4 v-if="title" class="text-sm font-bold text-gray-900 leading-snug">
            {{ title }}
          </h4>
          <span
            v-if="chartTypeBadge"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600"
          >
            {{ chartTypeBadge }}
          </span>
        </div>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {{ subtitle }}
        </p>
      </div>
      <button
        type="button"
        title="Download chart as PNG"
        class="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors cursor-pointer"
        @click="downloadChartPng"
      >
        <Icon name="lucide:image-down" class="h-3.5 w-3.5" />
        <span class="hidden sm:inline">PNG</span>
      </button>
    </div>

    <div class="relative w-full" :style="{ height: `${height}px` }">
      <div
        v-if="!isReady"
        class="absolute inset-0 flex items-center justify-center bg-gray-50/70 rounded-lg animate-pulse"
      >
        <span class="text-xs text-gray-400 font-medium">Rendering Apache ECharts...</span>
      </div>
      <div ref="chartEl" class="w-full h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type * as EChartsTypes from 'echarts';

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    chartTypeBadge?: string;
    option: Record<string, any>;
    height?: number;
    exportFilename?: string;
  }>(),
  {
    title: '',
    subtitle: '',
    chartTypeBadge: '',
    height: 310,
    exportFilename: 'gnp-chart',
  }
);

const chartEl = ref<HTMLDivElement | null>(null);
const isReady = ref(false);
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
    animationDuration: 450,
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
  isReady.value = true;

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

function downloadChartPng() {
  if (!chartInstance) return;
  const dataUrl = chartInstance.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#FFFFFF',
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${(props.title || props.exportFilename)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}.png`;
  link.click();
}

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
