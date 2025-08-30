<template>
  <div class="group cursor-pointer">
    <div class="bg-white rounded-xl shadow-lg card-hover">
      <div class="aspect-[3/4] overflow-hidden rounded-t-xl">
        <img 
          :src="magazine.cover" 
          :alt="magazine.title" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        >
      </div>
      <div class="p-6">
        <h3 class="font-bold text-xl text-gray-900 mb-2">{{ magazine.title }}</h3>
        <p class="text-primary-600 font-semibold mb-2">{{ magazine.edition }}</p>
        <p class="text-gray-600 text-sm">{{ magazine.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  magazine: {
    type: Object,
    required: true
  }
})
</script>