<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Top Podcasts</h1>
          <p class="text-gray-400 max-w-2xl">Dive deep into conversations that matter. Stream our exclusive audio and video podcasts.</p>
        </div>
        <div class="flex gap-2">
          <select class="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>All Topics</option>
            <option>News & Politics</option>
            <option>Business</option>
            <option>Technology</option>
          </select>
        </div>
      </div>
      
      <!-- Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="item in mockPodcasts" 
          :key="item.id"
          to="#"
          class="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 w-full rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-gray-800 hover:border-red-500/50"
        >
          <div class="aspect-square w-full relative">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full transform translate-y-4 group-hover:translate-y-0">
               <h3 class="font-bold text-white text-sm mb-1 leading-snug drop-shadow-md">{{ item.title }}</h3>
               <p class="text-[10px] text-gray-300 font-medium">{{ item.episodes }} Episodes</p>
            </div>
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
               <div class="bg-red-600 rounded-full p-3 shadow-xl hover:bg-red-700 transition-colors border border-red-400/30">
                 <PlayIcon class="w-8 h-8 text-white fill-current" />
               </div>
            </div>
            
            <div v-if="item.isNew" class="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg uppercase">
               NEW EP
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { PlayIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const mockPodcasts = [
  { id: 12, title: 'The Daily Chronicle', image: 'https://images.unsplash.com/photo-1590602847861-f35f18d4ecbf?q=80&w=600&auto=format&fit=crop', isNew: true, episodes: 124 },
  { id: 13, title: 'Economy Watch', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop', episodes: 56 },
  { id: 14, title: 'True Crime: Cold Cases', image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=600&auto=format&fit=crop', episodes: 12 },
  { id: 15, title: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', isNew: true, episodes: 89 },
  { id: 16, title: 'The Tech Update', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop', episodes: 210 },
  { id: 17, title: 'Sports Talk Radio', image: 'https://images.unsplash.com/photo-1478737270239-2f08b3db8155?q=80&w=600&auto=format&fit=crop', episodes: 45 },
]
</script>
