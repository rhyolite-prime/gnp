<template>
  <div class="min-h-screen bg-[#101010] text-white pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          <h1 class="text-3xl font-bold tracking-tight">Live Broadcast</h1>
        </div>
        <div class="bg-gray-800/80 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
          <span class="text-red-500 font-bold">124,592</span> watching now
        </div>
      </div>
      
      <!-- Main Player -->
      <div class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/10 group cursor-pointer mb-12">
        <img src="https://images.unsplash.com/photo-1540747913346-19e32dca3269?q=80&w=2670&auto=format&fit=crop" class="w-full h-full object-cover opacity-80" />
        <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div class="bg-red-600/90 rounded-full p-4 md:p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.5)] transform transition-transform group-hover:scale-110">
               <PlayIcon class="w-10 h-10 md:w-14 md:h-14 text-white fill-current" />
            </div>
        </div>
        <div class="absolute top-4 left-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-widest flex items-center">
            GN+ Live
        </div>
        
        <!-- Player controls overlay mock -->
        <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
           <div>
             <h2 class="text-lg md:text-2xl font-bold shadow-sm">National Election Coverage 2026</h2>
             <p class="text-gray-300 text-sm hidden md:block mt-1">Live from the Presidential Debate Headquarters</p>
           </div>
           <div class="flex gap-2">
             <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition">
               <SignalIcon class="w-4 h-4 text-white" />
             </div>
           </div>
        </div>
        
        <!-- Progress bar mock -->
        <div class="absolute bottom-0 left-0 w-full h-1 bg-red-600/30">
          <div class="h-full bg-red-600 w-full"></div>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        Coming Up Next <ChevronRightIcon class="w-5 h-5 text-gray-500" />
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <!-- Schedule Cards -->
         <div v-for="i in 3" :key="i" class="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-red-500/50 hover:bg-gray-750 transition-all shadow-md group">
            <div class="flex justify-between items-start mb-4">
               <span class="text-red-400 font-bold text-xs bg-red-400/10 px-2 py-1 rounded border border-red-400/20">Today, 20:00 GMT</span>
               <button class="text-gray-400 hover:text-white transition-colors">
                 <BellIcon class="w-5 h-5" />
               </button>
            </div>
            <h3 class="font-bold text-lg mb-2 group-hover:text-red-400 transition-colors">Presidential Town Hall {{i}}</h3>
            <p class="text-gray-400 text-sm line-clamp-2">Exclusive sit-down with the leading candidates before the national polls open. Live analysis from our expert panel.</p>
         </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { PlayIcon, ChevronRightIcon, SignalIcon, BellIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default' })
</script>
