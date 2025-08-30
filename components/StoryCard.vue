<template>
  <article class="bg-white rounded-xl shadow-lg card-hover overflow-hidden group">
    <div class="aspect-[16/10] overflow-hidden">
      <img 
        v-if="story.image"
        :src="story.image" 
        :alt="story.category" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      >
      <div 
        v-else-if="story.isVideo"
        class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
      >
        <IconPlay class="w-12 h-12 text-white" />
      </div>
      <div 
        v-else-if="story.isFeatured"
        class="w-full h-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center"
      >
        <div class="text-white text-center">
          <IconStar class="w-12 h-12 mx-auto mb-2" />
          <span class="text-sm font-medium">Featured</span>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="flex items-center mb-3">
        <CategoryBadge :category="story.category" :color="story.categoryColor" />
      </div>
      <h3 class="font-bold text-lg text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
        {{ story.title }}
      </h3>
      <p class="text-gray-600 text-sm leading-relaxed">
        {{ story.excerpt }}
      </p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  story: {
    type: Object,
    required: true
  }
})
</script>