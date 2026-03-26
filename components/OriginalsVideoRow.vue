<template>
  <div class="group/row">
    <div class="flex items-center justify-between mb-4 pr-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-3">
        {{ title }}
        <NuxtLink :to="`/originals/${category}`" class="text-sm font-semibold text-sky-400 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center">
          Explore All <ChevronRightIcon class="w-4 h-4 ml-1" />
        </NuxtLink>
      </h2>
    </div>
    
    <div class="relative">
      <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x" style="scrollbar-width: none;">
        <NuxtLink 
          v-for="item in items" 
          :key="item.id"
          :to="category === 'live' ? '/originals/live' : `/originals/${category}`"
          class="flex-none snap-start relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 w-[260px] sm:w-[320px] rounded-md overflow-hidden bg-gray-800 shadow-lg"
        >
          <div class="aspect-video w-full relative">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full transform translate-y-4 group-hover:translate-y-0">
               <h3 class="font-bold text-white text-sm sm:text-base mb-1.5 line-clamp-2 leading-tight">{{ item.title }}</h3>
               <div class="flex items-center gap-2 text-[11px] sm:text-xs text-gray-300 font-medium">
                 <span v-if="item.isNew" class="text-green-500 font-bold">New</span>
                 <span v-if="item.duration">{{ item.duration }}</span>
                 <span class="border border-gray-500 px-1 rounded text-[10px] uppercase text-gray-400">{{ item.rating || 'PG' }}</span>
                 <span v-if="item.genre" class="text-gray-400 flex items-center gap-1 before:content-['•'] before:mr-1">{{ item.genre }}</span>
               </div>
            </div>
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
               <div class="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-colors">
                 <PlayIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current" />
               </div>
            </div>
            
            <div v-if="category === 'live'" class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(220,38,38,0.8)]">
               <div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Live
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ChevronRightIcon, PlayIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: String,
  category: String,
  items: Array
})
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
