<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Exclusive Interviews</h1>
          <p class="text-gray-400 max-w-2xl">Candid conversations with the world's most influential leaders, artists, and visionaries.</p>
        </div>
      </div>
      
      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="item in mockInterviews" 
          :key="item.id"
          to="#"
          class="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:z-20 w-full rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-800 hover:border-red-500/50"
        >
          <div class="aspect-video w-full relative">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-0 left-0 p-5 sm:p-6 w-full">
               <span class="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 block">{{ item.genre }}</span>
               <h3 class="font-bold text-white text-lg sm:text-xl mb-2 leading-tight drop-shadow-md">{{ item.title }}</h3>
               <p class="text-gray-300 text-sm line-clamp-2">{{ item.description }}</p>
               
               <div class="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                 <div class="bg-red-600 rounded-full p-2">
                   <PlayIcon class="w-5 h-5 text-white fill-current" />
                 </div>
                 <span class="text-sm font-bold">Watch Interview ({{ item.duration }})</span>
               </div>
            </div>
            
            <div v-if="item.isNew" class="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-lg uppercase">
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

const mockInterviews = [
  { id: 8, title: 'A Conversation with the President', description: 'The sitting president discusses the state of the economy and upcoming policies.', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop', isNew: true, duration: '45m', genre: 'Politics' },
  { id: 9, title: 'Tech Visionaries: Inside AI', description: 'Leading AI researchers debate the future of artificial intelligence in our daily lives.', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', duration: '30m', genre: 'Technology' },
  { id: 10, title: 'The Making of a Champion', description: 'Olympic gold medalists share their grueling training routines and mental preparation.', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', duration: '38m', genre: 'Sports' },
  { id: 11, title: 'Voices of Tomorrow: Youth Leaders', description: 'Five young activists who are changing the global dialogue on climate change.', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop', duration: '25m', genre: 'Society' },
]
</script>
