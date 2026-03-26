<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">GN+ Books</h1>
          <p class="text-gray-400 max-w-2xl">Read exclusive biographies, profound analyses, and engaging literature curated by Graphic NewsPlus.</p>
        </div>
      </div>
      
      <!-- Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 gap-6">
        <NuxtLink 
          v-for="item in mockBooks" 
          :key="item.id"
          to="#"
          class="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 w-full flex flex-col items-center"
        >
          <!-- Book Cover -->
          <div class="w-full aspect-[2/3] relative rounded-r-md rounded-l-sm bg-gray-800 overflow-hidden shadow-[4px_0_15px_rgba(0,0,0,0.5)] border-l-[3px] border-white/20">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
               <div class="bg-red-600 rounded-full p-2.5 shadow-xl hover:bg-red-700 transition-colors border border-red-400/30">
                 <BookOpenIcon class="w-8 h-8 text-white" />
               </div>
            </div>
            
            <div v-if="item.isNew" class="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg uppercase">
               NEW
            </div>
          </div>
          <!-- Title & Author -->
          <div class="mt-3 text-left w-full h-16">
            <h3 class="font-bold text-white text-sm mb-1 leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{{ item.title }}</h3>
            <p class="text-xs text-gray-400">{{ item.author }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { BookOpenIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })

const mockBooks = [
  { id: 1, title: 'The Modern Age: A New Dawn in Politics', author: 'Kwame A. Mensah', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop', isNew: true },
  { id: 2, title: 'Political Giants of the 21st Century', author: 'Sarah K. Osei', image: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Economics for Tomorrow', author: 'Dr. A. Williams', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop', isNew: true },
  { id: 4, title: 'Through The Lens: Africa', author: 'John Doe', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop' },
  { id: 5, title: 'Whispers in the Savannah', author: 'T. R. Acheampong', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop' },
  { id: 6, title: 'Innovation & Chaos', author: 'Tech Insider', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop' },
]
</script>
