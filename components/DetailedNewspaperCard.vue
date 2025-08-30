<template>
  <div class="cursor-pointer transition-all hover:scale-105">
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="aspect-[3/4] overflow-hidden">
        <img 
          :src="newspaper.image" 
          :alt="newspaper.title" 
          class="w-full h-full object-cover"
          loading="lazy"
        >
      </div>
      <div class="p-3">
        <p class="text-sm font-medium text-gray-900">{{ newspaper.code }} - {{ newspaper.type }},</p>
        <p class="text-xs text-gray-600">{{ newspaper.date }}</p>
        <div class="flex justify-between items-center mt-2">
          <p class="text-xs font-medium text-gray-900">GHS {{ newspaper.price.toFixed(2) }}</p>
           
        </div>
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
