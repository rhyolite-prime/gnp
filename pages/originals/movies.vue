<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Premium Movies</h1>
          <p class="text-gray-400 max-w-2xl">Exclusive cinematic experiences brought to you by Graphic NewsPlus. Award-winning documentaries, gripping thrillers, and heartfelt dramas.</p>
        </div>
        <div class="flex gap-2">
          <select class="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>All Genres</option>
            <option>Action</option>
            <option>Drama</option>
            <option>Documentary</option>
          </select>
          <select class="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>Trending</option>
            <option>Newest</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>
      
      <!-- Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="item in mockMovies" 
          :key="item.id"
          to="#"
          class="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 w-full rounded-md overflow-hidden bg-gray-800 shadow-lg border border-gray-800 hover:border-red-500/50"
        >
          <div class="aspect-[2/3] w-full relative">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full transform translate-y-4 group-hover:translate-y-0">
               <h3 class="font-bold text-white text-sm sm:text-base mb-2 leading-tight drop-shadow-md">{{ item.title }}</h3>
               <div class="flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                 <span v-if="item.isNew" class="text-green-500 font-bold">New</span>
                 <span class="border border-gray-500 px-1.5 rounded uppercase min-w-fit font-bold text-gray-400">{{ item.rating || 'PG' }}</span>
                 <span v-if="item.genre" class="text-gray-400 hidden sm:inline">{{ item.genre }}</span>
               </div>
            </div>
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
               <div class="bg-red-600 rounded-full p-3 shadow-xl hover:bg-red-700 transition-colors border border-red-400/30">
                 <PlayIcon class="w-8 h-8 lg:w-10 lg:h-10 text-white fill-current" />
               </div>
            </div>
            
            <div v-if="item.isNew" class="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
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

const mockMovies = [
  { id: 16, title: 'The Last Frontier', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop', isNew: true, rating: 'PG-13', genre: 'Action' },
  { id: 17, title: 'Midnight City', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop', rating: 'R', genre: 'Thriller' },
  { id: 18, title: 'Journey to the Unknown', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop', rating: 'PG', genre: 'Sci-Fi' },
  { id: 19, title: 'Love in Autumn', image: 'https://images.unsplash.com/photo-1481018595507-2a6d47916eb4?q=80&w=600&auto=format&fit=crop', rating: 'PG', genre: 'Romance' },
  { id: 20, title: 'The Great Betrayal', image: 'https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=600&auto=format&fit=crop', rating: 'R', genre: 'Drama' },
  { id: 21, title: 'Operation Alpha', image: 'https://images.unsplash.com/photo-1580205828859-002d2da8a9ed?q=80&w=600&auto=format&fit=crop', rating: 'PG-13', genre: 'Action' },
  { id: 22, title: 'Silent Whispers', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop', rating: 'R', genre: 'Horror', isNew: true },
  { id: 23, title: 'Comedic Genius', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=600&auto=format&fit=crop', rating: 'PG', genre: 'Comedy' },
  { id: 24, title: 'The Lost Kingdom', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop', rating: 'PG', genre: 'Fantasy' },
  { id: 25, title: 'Into the Abyss', image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=600&auto=format&fit=crop', rating: 'R', genre: 'Sci-Fi' },
  { id: 26, title: 'Undercover', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop', rating: 'R', genre: 'Action' },
  { id: 27, title: 'Beyond the Stars', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=600&auto=format&fit=crop', rating: 'PG', genre: 'Sci-Fi' }
]
</script>
