<template>
  <div class="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
    <!-- Q/A Mode Button -->
    <button
      type="button"
      @click="selectMode('qa')"
      :class="[
        'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
        modelValue === 'qa'
          ? 'bg-white text-primary-700 shadow-sm border border-primary-100 ring-1 ring-primary-500/20'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
      ]"
    >
      <!-- Lightning Icon -->
      <span :class="['w-2 h-2 rounded-full transition-colors', modelValue === 'qa' ? 'bg-primary-600 animate-pulse' : 'bg-gray-400']"></span>
      <span>Q/A Mode</span>
      <span
        v-if="modelValue === 'qa'"
        class="bg-primary-100 text-primary-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
      >
        Fast
      </span>
    </button>

    <!-- Research Mode Button -->
    <button
      type="button"
      @click="selectMode('research')"
      :class="[
        'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
        modelValue === 'research'
          ? 'bg-primary-600 text-white shadow-sm ring-1 ring-primary-500/30'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
      ]"
    >
      <!-- Sparkle/Brain Icon -->
      <span :class="['w-2 h-2 rounded-full transition-colors', modelValue === 'research' ? 'bg-primary-300 animate-pulse' : 'bg-gray-400']"></span>
      <span>Research Mode</span>
      <span
        v-if="modelValue === 'research'"
        class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium"
      >
        Deep RAG
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { RagMode } from '~/models/rag';

const props = defineProps<{
  modelValue: RagMode;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: RagMode): void;
}>();

const selectMode = (mode: RagMode) => {
  emit('update:modelValue', mode);
};
</script>
