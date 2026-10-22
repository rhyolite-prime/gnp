<template>
  <component :is="resolvedIcon" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{
  name: string;
}>();

const ALIAS_MAP: Record<string, string> = {
  'image-down': 'Download',
  'receipt-text': 'Receipt',
  'database-zap': 'Database',
  'table-2': 'Table2',
  'table-properties': 'Table',
  'file-bar-chart-2': 'FileBarChart2',
  'file-code-2': 'FileCode2',
  'server-cog': 'ServerCog',
  'circle-dollar-sign': 'CircleDollarSign',
  'building-2': 'Building2',
  'gamepad-2': 'Gamepad2',
  'shield-check': 'ShieldCheck',
  'check-circle-2': 'CheckCircle2',
  'bar-chart-3': 'BarChart3',
  'code-2': 'Code2',
  'loader-2': 'Loader2',
  'layout-dashboard': 'LayoutDashboard',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'arrow-up-right': 'ArrowUpRight',
  'file-spreadsheet': 'FileSpreadsheet',
  'file-text': 'FileText',
};

const resolvedIcon = computed(() => {
  const clean = (props.name || '').replace(/^lucide:/, '');
  const pascal =
    ALIAS_MAP[clean] ||
    clean
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

  return (LucideIcons as Record<string, any>)[pascal] || LucideIcons.BarChart3;
});
</script>
