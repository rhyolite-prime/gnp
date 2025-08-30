<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
      <div class="md:flex-1">
        <label for="publication" class="block text-sm font-medium text-gray-700 mb-1">Publication</label>
        <select 
          id="publication" 
          v-model="filters.publication"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">All Publications</option>
          <option value="daily-graphic">Daily Graphic</option>
          <option value="graphic-business">Graphic Business</option>
          <option value="graphic-sports">Graphic Sports</option>
          <option value="graphic-showbiz">Graphic Showbiz</option>
          <option value="the-mirror">The Mirror</option>
        </select>
      </div>
      
      <div class="md:flex-1">
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <div class="relative">
          <input 
            id="date"
            v-model="filters.date"
            type="text" 
            placeholder="Search by date (Y/M/D)" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <span class="absolute right-3 top-2.5 text-gray-400">
            <IconCalendar class="w-5 h-5" />
          </span>
        </div>
      </div>

      <div class="md:w-auto">
        <button 
          @click="applyFilters"
          class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors w-full"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const filters = reactive({
  publication: '',
  date: '',
})

const emit = defineEmits(['filter'])

function applyFilters() {
  emit('filter', { ...filters })
}
</script>
