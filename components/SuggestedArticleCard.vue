<template>
  <div class="cursor-pointer transition-all hover:scale-105" @click="$emit('click')">
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div class="aspect-[16/9] overflow-hidden">
        <img 
          :src="article.image" 
          :alt="article.title" 
          class="w-full h-full object-cover"
          loading="lazy"
        >
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex items-center mb-2">
          <span class="text-xs text-gray-500">{{ article.source }} • {{ article.date }}</span>
        </div>
        <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">{{ article.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">{{ article.excerpt }}</p>
        <div class="flex justify-between items-center mt-auto">
          <div class="flex items-center">
            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{ (article.relevanceScore * 100).toFixed(0) }}% match</span>
          </div>
          <button class="text-red-600 hover:text-red-700 text-xs font-medium flex items-center">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  article: {
    type: Object,
    required: true
  }
});

// Emit click event to parent
defineEmits(['click']);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
