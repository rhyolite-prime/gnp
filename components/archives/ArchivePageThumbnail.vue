<template>
  <!-- Faux newspaper front-page thumbnail (styled placeholder that mirrors the real thumbnailId contract) -->
  <div
    class="relative w-full aspect-[3/4] overflow-hidden border border-gray-200 bg-[#fdfbf7] flex flex-col select-none"
    :class="variant === 'mini' ? 'rounded-md' : 'rounded-lg'"
  >
    <!-- Masthead -->
    <div class="border-b-2 px-1.5 pt-1.5 pb-1" :style="{ borderColor: accent }">
      <p
        class="font-serif font-bold uppercase tracking-wide text-center leading-tight truncate"
        :class="variant === 'mini' ? 'text-[6px]' : 'text-[9px]'"
        :style="{ color: accent }"
      >
        {{ publicationName }}
      </p>
      <p class="text-center text-gray-400 leading-tight" :class="variant === 'mini' ? 'text-[5px]' : 'text-[7px]'">
        {{ dateLabel }}
      </p>
    </div>

    <!-- Faux headline + body lines -->
    <div class="flex-1 px-1.5 pt-1.5 space-y-1">
      <div class="rounded-sm bg-gray-800/80" :class="variant === 'mini' ? 'h-1 w-5/6' : 'h-1.5 w-5/6'"></div>
      <div class="rounded-sm bg-gray-800/60" :class="variant === 'mini' ? 'h-1 w-3/5' : 'h-1.5 w-3/5'"></div>
      <div class="space-y-0.5 pt-0.5">
        <div class="rounded-sm bg-gray-300 w-full" :class="variant === 'mini' ? 'h-0.5' : 'h-1'"></div>
        <div class="rounded-sm bg-gray-300 w-11/12" :class="variant === 'mini' ? 'h-0.5' : 'h-1'"></div>
        <div class="rounded-sm bg-gray-300 w-full" :class="variant === 'mini' ? 'h-0.5' : 'h-1'"></div>
        <div class="rounded-sm bg-gray-300 w-4/5" :class="variant === 'mini' ? 'h-0.5' : 'h-1'"></div>
      </div>
    </div>

    <!-- Faux photo block -->
    <div class="px-1.5 pb-1.5">
      <div
        class="w-full rounded-sm opacity-80"
        :class="variant === 'mini' ? 'h-4' : 'h-8'"
        :style="{ background: `linear-gradient(135deg, ${accent}44, ${accent}99)` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    publicationName: string;
    dateLabel: string;
    accent: string;
    variant?: 'full' | 'mini';
  }>(),
  { variant: 'full' }
);
</script>
