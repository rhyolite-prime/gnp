// Converts plain JavaScript chart data objects from `mocks/reports/*.js`
// into interactive Apache ECharts options (`echarts`).

const PALETTE = ['#DC2626', '#2563EB', '#F97316', '#10B981', '#8B5CF6', '#F59E0B'];

export function buildEChartOptionFromPlainData(chart) {
  if (!chart) return {};

  // 1. Donut / Pie Chart
  if (chart.type === 'donut') {
    return {
      color: PALETTE,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, icon: 'circle', textStyle: { color: '#6B7280', fontSize: 11 } },
      series: [
        {
          name: chart.title,
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: chart.items || [],
        },
      ],
    };
  }

  // 2. Horizontal Bar Chart
  if (chart.type === 'horizontal_bar') {
    const s = (chart.series && chart.series[0]) || { name: 'Value', data: [] };
    return {
      color: PALETTE,
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 12, right: 24, top: 10, bottom: 16, containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
        axisLabel: { color: '#6B7280', fontSize: 11 },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: chart.labels || [],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#374151', fontSize: 11 },
      },
      series: [
        {
          name: s.name,
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: { borderRadius: [0, 4, 4, 0], color: '#DC2626' },
          data: s.data || [],
        },
      ],
    };
  }

  // 3. Funnel Chart
  if (chart.type === 'funnel') {
    return {
      color: PALETTE,
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      series: [
        {
          name: chart.title,
          type: 'funnel',
          left: '8%',
          top: 12,
          bottom: 12,
          width: '84%',
          sort: 'descending',
          gap: 3,
          itemStyle: { borderColor: '#fff', borderWidth: 1 },
          label: { position: 'inside', color: '#fff', fontSize: 11 },
          data: chart.items || [],
        },
      ],
    };
  }

  // 4. Cohort Retention Heatmap
  if (chart.type === 'heatmap') {
    return {
      tooltip: {
        position: 'top',
        formatter: (p) => `${chart.yLabels?.[p.value[1]]} · ${chart.xLabels?.[p.value[0]]}: <b>${p.value[2]}%</b>`,
      },
      grid: { left: 12, right: 20, top: 12, bottom: 28, containLabel: true },
      xAxis: { type: 'category', data: chart.xLabels || [], splitArea: { show: true } },
      yAxis: { type: 'category', data: chart.yLabels || [], splitArea: { show: true } },
      visualMap: {
        min: 60,
        max: 100,
        show: false,
        inRange: { color: ['#FEE2E2', '#F87171', '#DC2626', '#991B1B'] },
      },
      series: [
        {
          name: 'Retention %',
          type: 'heatmap',
          data: chart.matrix || [],
          label: { show: true, formatter: ({ value }) => `${value[2]}%`, fontSize: 11 },
        },
      ],
    };
  }

  // 5. Stacked Bar / Dual-Axis Bar + Line / Smooth Area Line
  const hasSecondaryAxis = Boolean(chart.secondaryYAxisLabel);
  return {
    color: PALETTE,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#6B7280', fontSize: 11 } },
    grid: { left: 12, right: hasSecondaryAxis ? 16 : 12, top: 28, bottom: 34, containLabel: true },
    xAxis: {
      type: 'category',
      data: chart.labels || [],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      axisLabel: { color: '#6B7280', fontSize: 11 },
    },
    yAxis: hasSecondaryAxis
      ? [
          {
            type: 'value',
            name: chart.yAxisLabel || '',
            splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
            axisLabel: { color: '#6B7280', fontSize: 11 },
          },
          {
            type: 'value',
            name: chart.secondaryYAxisLabel,
            splitLine: { show: false },
            axisLabel: { color: '#6B7280', fontSize: 11 },
          },
        ]
      : {
          type: 'value',
          name: chart.yAxisLabel || '',
          splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
          axisLabel: { color: '#6B7280', fontSize: 11 },
        },
    series: (chart.series || []).map((s) => {
      if (chart.type === 'stacked_bar') {
        return {
          name: s.name,
          type: 'bar',
          stack: 'total',
          barMaxWidth: 28,
          data: s.data || [],
        };
      }
      if (chart.type === 'area_line' || s.type === 'line') {
        return {
          name: s.name,
          type: 'line',
          yAxisIndex: s.yAxisIndex || 0,
          smooth: true,
          areaStyle: chart.type === 'area_line' ? { opacity: 0.14 } : undefined,
          data: s.data || [],
        };
      }
      return {
        name: s.name,
        type: s.type || 'bar',
        yAxisIndex: s.yAxisIndex || 0,
        barMaxWidth: 28,
        data: s.data || [],
      };
    }),
  };
}
