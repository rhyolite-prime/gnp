<template>
  <div class="group cursor-pointer">
    <div class="bg-white rounded-sm shadow-md card-hover">
      <div class="aspect-[3/4] overflow-hidden rounded-t-sm">
        <img 
          :src="newspaper.image" 
          :alt="newspaper.title" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        >
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-1">{{ newspaper.title }}</h3>
        <p class="text-sm text-gray-500">{{ newspaper.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  newspaper: {
    type: Object,
    required: true
  }
})
</script>