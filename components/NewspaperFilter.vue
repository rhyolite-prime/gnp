<template>
  <form class="bg-white rounded-lg shadow p-4" @submit.prevent="applyFilters">
    <div class="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
      <div class="md:flex-1">
        <label for="newspaper-filter-publication" class="block text-sm font-bold text-gray-700 mb-1">Publication</label>
        <select
          id="newspaper-filter-publication"
          v-model="filters.publicationId"
          :disabled="loadingPublications"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">{{ loadingPublications ? 'Loading publications...' : 'All Publications' }}</option>
          <option v-for="publication in publications" :key="publication.id" :value="publication.id">
            {{ publication.name }}
          </option>
        </select>
      </div>

      <div class="md:flex-1">
        <label for="newspaper-filter-start-date" class="block text-sm font-bold text-gray-700 mb-1">Date From</label>
        <input
          id="newspaper-filter-start-date"
          v-model="filters.startDate"
          type="date"
          :max="filters.endDate || undefined"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div class="md:flex-1">
        <label for="newspaper-filter-end-date" class="block text-sm font-bold text-gray-700 mb-1">Date To</label>
        <input
          id="newspaper-filter-end-date"
          v-model="filters.endDate"
          type="date"
          :min="filters.startDate || undefined"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div class="md:w-auto flex space-x-2">
        <button
          type="submit"
          class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors w-full"
        >
          Search
        </button>
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Publication } from "~/models";

export interface NewspaperFilterValues {
  publicationId: string;
  startDate: string;
  endDate: string;
}

const props = withDefaults(defineProps<{
  /** Currently applied filters (kept in sync with the page / URL). */
  modelValue?: NewspaperFilterValues;
  publications?: Publication[];
  loadingPublications?: boolean;
}>(), {
  modelValue: () => ({ publicationId: '', startDate: '', endDate: '' }),
  publications: () => [],
  loadingPublications: false,
})

const emit = defineEmits<{
  (e: 'filter', value: NewspaperFilterValues): void;
  (e: 'reset'): void;
}>()

// Local draft: nothing is applied until "Search" is pressed.
const filters = reactive<NewspaperFilterValues>({ publicationId: '', startDate: '', endDate: '' })

watch(() => props.modelValue, (value) => {
  filters.publicationId = value?.publicationId ?? ''
  filters.startDate = value?.startDate ?? ''
  filters.endDate = value?.endDate ?? ''
}, { immediate: true, deep: true })

const hasActiveFilters = computed(() =>
  !!(filters.publicationId || filters.startDate || filters.endDate))

function applyFilters() {
  // Tolerate a reversed range instead of returning an empty list.
  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    [filters.startDate, filters.endDate] = [filters.endDate, filters.startDate]
  }
  emit('filter', { ...filters })
}

function clearFilters() {
  filters.publicationId = ''
  filters.startDate = ''
  filters.endDate = ''
  emit('reset')
}
</script>
