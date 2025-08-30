<template>
  <nav class="flex justify-center mt-8">
    <div class="flex items-center space-x-1">
      <!-- Previous page button -->
      <button 
        class="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ‹
      </button>
      
      <!-- First page -->
      <button 
        class="px-3 py-2 rounded-md"
        :class="currentPage === 1 ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        @click="changePage(1)"
      >
        1
      </button>
      
      <!-- Ellipsis if needed -->
      <span v-if="startPage > 2" class="px-3 py-2 text-gray-600">...</span>
      
      <!-- Page numbers -->
      <button 
        v-for="page in displayedPages"
        :key="page"
        class="px-3 py-2 rounded-md"
        :class="currentPage === page ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      
      <!-- Ellipsis if needed -->
      <span v-if="endPage < totalPages - 1" class="px-3 py-2 text-gray-600">...</span>
      
      <!-- Last page -->
      <button 
        v-if="totalPages > 1"
        class="px-3 py-2 rounded-md"
        :class="currentPage === totalPages ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        @click="changePage(totalPages)"
      >
        {{ totalPages }}
      </button>
      
      <!-- Next page button -->
      <button 
        class="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        ›
      </button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisibleButtons: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

// Calculate the range of pages to show
const startPage = computed(() => {
  // Show maxVisibleButtons pages centered around current page
  let start = Math.max(2, props.currentPage - Math.floor(props.maxVisibleButtons / 2))
  
  // Adjust start if we're near the end
  const end = Math.min(props.totalPages - 1, start + props.maxVisibleButtons - 1)
  
  // Adjust start if we don't have enough pages
  start = Math.max(2, Math.min(start, props.totalPages - props.maxVisibleButtons))
  
  return start
})

const endPage = computed(() => {
  return Math.min(props.totalPages - 1, startPage.value + props.maxVisibleButtons - 1)
})

const displayedPages = computed(() => {
  const pages = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
})

function changePage(page) {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>
