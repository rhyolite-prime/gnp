import dayjs from 'dayjs';
import type { ReportGranularity, ReportRequestDto } from '~/models/reports';

export const GNP_PALETTE = [
  '#dc2626', // Graphic Crimson
  '#2563eb', // Royal Blue
  '#059669', // Emerald
  '#d97706', // Gold Amber
  '#7c3aed', // Violet
  '#0891b2', // Cyan
  '#e11d48', // Rose
  '#475569', // Slate
];

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function areaGradient(hex: string, topOpacity = 0.28, bottomOpacity = 0.01) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: hexToRgba(hex, topOpacity) },
      { offset: 1, color: hexToRgba(hex, bottomOpacity) },
    ],
  };
}

export function barGradient(hexTop: string, hexBottom?: string) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: hexTop },
      { offset: 1, color: hexBottom || hexToRgba(hexTop, 0.72) },
    ],
  };
}

export const BASE_TOOLTIP = {
  appendToBody: true,
  backgroundColor: 'rgba(15, 23, 42, 0.94)',
  borderColor: 'rgba(148, 163, 184, 0.22)',
  borderWidth: 1,
  padding: [10, 14],
  textStyle: {
    color: '#f8fafc',
    fontSize: 12,
    fontFamily: 'Sora, system-ui, sans-serif',
  },
};

export const BASE_GRID = {
  top: 38,
  left: 14,
  right: 18,
  bottom: 42,
  containLabel: true,
};

export const DUAL_AXIS_GRID = {
  top: 40,
  left: 14,
  right: 16,
  bottom: 42,
  containLabel: true,
};

export const BOTTOM_LEGEND = {
  bottom: 0,
  type: 'scroll',
  icon: 'circle',
  itemWidth: 9,
  itemHeight: 9,
  itemGap: 16,
  textStyle: {
    color: '#475569',
    fontSize: 11.5,
    fontFamily: 'Sora, system-ui, sans-serif',
  },
};

export function categoryXAxis(labels: string[]) {
  return {
    type: 'category',
    data: labels,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: {
      color: '#64748b',
      fontSize: 11,
      margin: 10,
      hideOverlap: true,
    },
  };
}

export function valueYAxis(name = '', prefix = '', suffix = '') {
  return {
    type: 'value',
    name,
    nameTextStyle: {
      color: '#64748b',
      fontSize: 11,
      padding: [0, 0, 4, 0],
    },
    splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
    axisLabel: {
      color: '#64748b',
      fontSize: 11,
      formatter: (val: number) => {
        if (Math.abs(val) >= 1_000_000) return `${prefix}${(val / 1_000_000).toFixed(1)}M${suffix}`;
        if (Math.abs(val) >= 1_000) return `${prefix}${(val / 1_000).toFixed(val % 1000 === 0 ? 0 : 1)}k${suffix}`;
        return `${prefix}${val}${suffix}`;
      },
    },
  };
}

/** Deterministic string hash -> seeded PRNG (Mulberry32) so reports react reproducibly to filters. */
export function createSeededRng(seedKey: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedKey.length; i++) {
    h ^= seedKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface NormalizedReportWindow {
  startDate: string;
  endDate: string;
  totalDays: number;
  granularity: ReportGranularity;
  buckets: { label: string; isoDate: string; daysInBucket: number; index: number }[];
  appliedFilters: Record<string, string>;
  seedKey: string;
}

export function normalizeReportWindow(
  reportId: string,
  dto: ReportRequestDto = {}
): NormalizedReportWindow {
  const defaultEnd = dayjs('2026-10-22');
  const defaultStart = defaultEnd.subtract(29, 'day');

  let start = dto.startDate && dayjs(dto.startDate).isValid() ? dayjs(dto.startDate) : defaultStart;
  let end = dto.endDate && dayjs(dto.endDate).isValid() ? dayjs(dto.endDate) : defaultEnd;

  if (start.isAfter(end)) {
    const tmp = start;
    start = end;
    end = tmp;
  }

  const totalDays = Math.max(1, end.diff(start, 'day') + 1);
  const granularity: ReportGranularity =
    dto.granularity ||
    (totalDays > 120 ? 'month' : totalDays > 42 ? 'week' : 'day');

  const buckets: { label: string; isoDate: string; daysInBucket: number; index: number }[] = [];

  if (granularity === 'month') {
    let cursor = start.startOf('month');
    let idx = 0;
    while (cursor.isBefore(end) || cursor.isSame(end, 'month')) {
      const bStart = cursor.isBefore(start) ? start : cursor;
      const bEnd = cursor.endOf('month').isAfter(end) ? end : cursor.endOf('month');
      buckets.push({
        label: cursor.format('MMM YYYY'),
        isoDate: bStart.format('YYYY-MM-DD'),
        daysInBucket: Math.max(1, bEnd.diff(bStart, 'day') + 1),
        index: idx++,
      });
      cursor = cursor.add(1, 'month');
      if (idx > 36) break;
    }
  } else if (granularity === 'week') {
    let cursor = start;
    let idx = 0;
    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      const bEnd = cursor.add(6, 'day').isAfter(end) ? end : cursor.add(6, 'day');
      buckets.push({
        label: `${cursor.format('DD MMM')}`,
        isoDate: cursor.format('YYYY-MM-DD'),
        daysInBucket: Math.max(1, bEnd.diff(cursor, 'day') + 1),
        index: idx++,
      });
      cursor = cursor.add(7, 'day');
      if (idx > 52) break;
    }
  } else {
    const maxPoints = Math.min(totalDays, 45);
    const step = Math.max(1, Math.floor(totalDays / maxPoints));
    let cursor = start;
    let idx = 0;
    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      buckets.push({
        label: cursor.format('DD MMM'),
        isoDate: cursor.format('YYYY-MM-DD'),
        daysInBucket: step,
        index: idx++,
      });
      cursor = cursor.add(step, 'day');
    }
  }

  const appliedFilters: Record<string, string> = {};
  if (dto.partnerId) appliedFilters.partnerId = dto.partnerId;
  if (dto.publicationId && dto.publicationId !== 'all') appliedFilters.publicationId = dto.publicationId;
  if (dto.plan && dto.plan !== 'all') appliedFilters.plan = dto.plan;
  if (dto.status && dto.status !== 'all') appliedFilters.status = dto.status;
  if (dto.channel && dto.channel !== 'all') appliedFilters.channel = dto.channel;
  appliedFilters.granularity = granularity;

  const seedKey = `${reportId}|${start.format('YYYY-MM-DD')}|${end.format('YYYY-MM-DD')}|${dto.partnerId || 'all'}|${dto.plan || 'all'}|${dto.status || 'all'}|${dto.channel || 'all'}|${dto.publicationId || 'all'}|${granularity}`;

  return {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
    totalDays,
    granularity,
    buckets,
    appliedFilters,
    seedKey,
  };
}

export function fmtGhs(amount: number): string {
  return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtCompactGhs(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `₵${(amount / 1_000_000).toFixed(2)}M`;
  if (Math.abs(amount) >= 100_000) return `₵${(amount / 1_000).toFixed(1)}k`;
  return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export interface CartesianSeriesInput {
  name: string;
  type: 'bar' | 'line';
  data: number[];
  color?: string;
  yAxisIndex?: number;
  stack?: string;
  area?: boolean;
}

export function createCartesianOption(config: {
  categories: string[];
  series: CartesianSeriesInput[];
  yAxisName?: string;
  secondaryYAxisName?: string;
  prefix?: string;
  suffix?: string;
}): Record<string, any> {
  const hasSecondary = config.series.some((s) => s.yAxisIndex === 1) || Boolean(config.secondaryYAxisName);

  const yAxis = hasSecondary
    ? [
        valueYAxis(config.yAxisName || '', config.prefix || '', config.suffix || ''),
        {
          ...valueYAxis(config.secondaryYAxisName || '', '', ''),
          position: 'right',
          splitLine: { show: false },
        },
      ]
    : valueYAxis(config.yAxisName || '', config.prefix || '', config.suffix || '');

  return {
    tooltip: {
      ...BASE_TOOLTIP,
      trigger: 'axis',
    },
    legend: BOTTOM_LEGEND,
    grid: hasSecondary ? DUAL_AXIS_GRID : BASE_GRID,
    xAxis: categoryXAxis(config.categories),
    yAxis,
    series: config.series.map((s, idx) => {
      const color = s.color || GNP_PALETTE[idx % GNP_PALETTE.length];
      if (s.type === 'bar') {
        return {
          name: s.name,
          type: 'bar',
          yAxisIndex: s.yAxisIndex || 0,
          stack: s.stack,
          barMaxWidth: 26,
          data: s.data,
          itemStyle: {
            color: barGradient(color),
            borderRadius: [5, 5, 0, 0],
          },
        };
      }
      return {
        name: s.name,
        type: 'line',
        smooth: true,
        symbolSize: 6,
        yAxisIndex: s.yAxisIndex || 0,
        data: s.data,
        itemStyle: { color },
        lineStyle: { width: 2.5, color },
        areaStyle: s.area ? { color: areaGradient(color) } : undefined,
      };
    }),
  };
}

export function createPieOption(
  items: { name: string; value: number; color?: string }[],
  options: { donut?: boolean; centerLabel?: string } = {}
): Record<string, any> {
  return {
    tooltip: {
      ...BASE_TOOLTIP,
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: BOTTOM_LEGEND,
    series: [
      {
        name: options.centerLabel || 'Breakdown',
        type: 'pie',
        radius: options.donut !== false ? ['50%', '72%'] : '68%',
        center: ['50%', '43%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        data: items.map((item, idx) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color || GNP_PALETTE[idx % GNP_PALETTE.length],
          },
        })),
      },
    ],
  };
}
