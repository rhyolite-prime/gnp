<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Sports Highlights</h1>
          <p class="text-gray-400 max-w-2xl">Catch up on all the action and most memorable moments in the world of sports.</p>
        </div>
      </div>
      
      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink 
          v-for="item in mockSports" 
          :key="item.id"
          to="#"
          class="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:z-20 w-full rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-gray-800 hover:border-red-500/50"
        >
          <div class="aspect-video w-full relative">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-0 left-0 p-4 w-full">
               <h3 class="font-bold text-white text-sm sm:text-base leading-snug drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300">{{ item.title }}</h3>
            </div>
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
               <div class="bg-red-600 rounded-full p-3 shadow-xl hover:bg-red-700 transition-colors border border-red-400/30">
                 <PlayIcon class="w-6 h-6 text-white fill-current" />
               </div>
            </div>
            
            <div class="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
               {{ item.duration }}
            </div>
            <div v-if="item.isNew" class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
               NEW
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

const mockSports = [
  { id: 4, title: 'Premier League: Weekend Top Goals', image: 'https://images.unsplash.com/photo-1551280857-ae8690940dc6?q=80&w=800&auto=format&fit=crop', duration: '12:05', genre: 'Football', isNew: true },
  { id: 5, title: 'NBA Finals Game 7 Highlights', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop', duration: '15:20', genre: 'Basketball' },
  { id: 6, title: 'Formula 1: Monaco GP Highlights', image: 'https://images.unsplash.com/photo-1532906626884-baedfbaf835a?q=80&w=800&auto=format&fit=crop', duration: '10:45', isNew: true, genre: 'Racing' },
  { id: 7, title: 'Tennis Grand Slam Finals Summary', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop', duration: '22:15', genre: 'Tennis' },
  { id: 8, title: '100m Dash World Record Retrospective', image: 'https://images.unsplash.com/photo-1552674605-171ff5ea5d71?q=80&w=800&auto=format&fit=crop', duration: '08:30', genre: 'Athletics' },
  { id: 9, title: 'Champions League Final Recap', image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=800&auto=format&fit=crop', duration: '14:10', genre: 'Football' },
]
</script>
