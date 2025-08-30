<template>
  <div class="group cursor-pointer">
    <div class="bg-white rounded-xl shadow-lg card-hover overflow-hidden">
      <div class="relative aspect-video overflow-hidden">
        <img 
          :src="video.thumbnail" 
          :alt="video.title" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <IconPlay class="w-6 h-6 text-gray-900 ml-1" />
          </div>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-2">{{ video.title }}</h3>
        <p class="text-sm text-gray-600">{{ video.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>