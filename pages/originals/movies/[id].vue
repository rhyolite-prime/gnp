<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white pt-20 pb-10 font-sans">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
      
      <!-- Video and Details Section (Left/Main) -->
      <div class="flex-1 lg:max-w-[70%] xl:max-w-[75%]">
        
        <!-- Video Player -->
        <div class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
          <!-- Native Video Player -->
          <video 
            v-if="movie"
            controls 
            controlsList="nodownload"
            class="w-full h-full object-contain"
            :poster="movie.image"
            preload="metadata"
          >
            <!-- 
            We dynamically generate the src URL based on our Drogon endpoint.
            You should ensure the video matches the filename in your ./media/videos folder. 
            -->
            <source :src="videoUrl" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <!-- Movie Details -->
        <div class="mt-4" v-if="movie">
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">{{ movie.title }}</h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
             <!-- Left: Views and Date -->
             <div class="flex items-center gap-4 text-sm text-gray-400 font-medium">
                <div class="flex items-center gap-2">
                  <img src="https://ui-avatars.com/api/?name=Graphic+News&background=dc2626&color=fff" class="w-10 h-10 rounded-full border border-gray-700" />
                  <div>
                    <h3 class="font-bold text-white text-base">Graphic Originals</h3>
                    <p class="text-xs">1.2M subscribers</p>
                  </div>
                </div>
                <button class="ml-2 bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">Subscribe</button>
             </div>
             
             <!-- Right: Actions -->
             <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <div class="flex bg-gray-800 rounded-full items-center">
                  <button class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-l-full transition-colors border-r border-gray-600">
                    <HandThumbUpIcon class="w-5 h-5" />
                    <span class="font-bold text-sm">124K</span>
                  </button>
                  <button class="px-4 py-2 hover:bg-gray-700 rounded-r-full transition-colors">
                    <HandThumbDownIcon class="w-5 h-5" />
                  </button>
                </div>
                
                <button class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors font-bold text-sm whitespace-nowrap">
                  <ShareIcon class="w-5 h-5" />
                  Share
                </button>
                
                <button class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors font-bold text-sm whitespace-nowrap">
                  <ArrowDownTrayIcon class="w-5 h-5" />
                  Download
                </button>
                
                <button class="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <EllipsisHorizontalIcon class="w-5 h-5" />
                </button>
             </div>
          </div>
          
          <!-- Description Box -->
          <div class="mt-4 bg-gray-800/80 rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer group">
             <div class="flex gap-4 text-sm font-bold text-white mb-2">
               <span>1.5M views</span>
               <span>Premiered Oct 12, 2025</span>
               <span class="text-gray-400">#{{ movie.genre?.replace(' ', '') || 'Originals' }} #GraphicNewsPlus #{{ movie.title?.replace(' ', '') }}</span>
             </div>
             <p class="text-sm text-gray-300 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all">
               Experience the thrilling story in "{{ movie.title }}". A breathtaking cinematic masterpiece exclusive to Graphic NewsPlus. Follow the journey of an unexpected hero navigating through a world of suspense, action, and unyielding drama. 
               <br><br>
               Directed by acclaimed filmmaker James Cameron Jr.
               Starring: John Doe, Jane Smith, and Alex Johnson.
               <br><br>
               Don't forget to like, subscribe, and turn on notifications for more exclusive Originals!
             </p>
          </div>
          
          <!-- Comments Section (Placeholder) -->
          <div class="mt-8">
             <div class="flex items-center gap-6 mb-6">
                <h3 class="text-xl font-bold">1,402 Comments</h3>
                <button class="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                  <Bars3BottomLeftIcon class="w-5 h-5" />
                  Sort by
                </button>
             </div>
             
             <div class="flex gap-4 mb-8">
                <img src="https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff" class="w-10 h-10 rounded-full flex-shrink-0" />
                <div class="w-full">
                  <input type="text" placeholder="Add a comment..." class="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none py-1 text-sm font-medium text-white transition-colors pb-2" />
                  <div class="flex justify-end gap-2 mt-3 opacity-0 focus-within:opacity-100 transition-opacity">
                     <button class="px-4 py-2 hover:bg-gray-800 rounded-full text-sm font-bold transition-colors">Cancel</button>
                     <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold text-white transition-colors">Comment</button>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
      
      <!-- Up Next / Recommendations (Right) -->
      <div class="flex-1 lg:max-w-[30%] xl:max-w-[25%] flex flex-col gap-4">
         <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button class="px-3 py-1 bg-white text-black text-sm font-medium rounded-lg whitespace-nowrap">All</button>
            <button class="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-colors">From Graphic Originals</button>
            <button class="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-colors">Related</button>
         </div>
         
         <!-- Recommended Video Items -->
         <NuxtLink 
            v-for="recMovie in recommendedMovies" 
            :key="recMovie.id"
            :to="'/originals/movies/' + recMovie.id"
            class="flex gap-2 group cursor-pointer"
         >
            <div class="w-[168px] sm:w-[168px] aspect-video flex-shrink-0 relative rounded-lg overflow-hidden relative border border-gray-800">
               <img :src="recMovie.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
               <div class="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs font-bold text-white">45:20</div>
            </div>
            
            <div class="flex flex-col flex-1 min-w-0 pr-2">
               <h4 class="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-gray-300 transition-colors mb-1" :title="recMovie.title">{{ recMovie.title }}</h4>
               <p class="text-xs text-gray-400 font-medium tracking-tight">Graphic Originals</p>
               <div class="flex items-center text-xs text-gray-400 gap-1 font-medium tracking-tight">
                  <span>{{ Math.floor(Math.random() * 900) + 100 }}K views</span>
                  <span class="text-[10px]">•</span>
                  <span>2 weeks ago</span>
               </div>
               <span v-if="recMovie.isNew" class="bg-gray-800 text-gray-300 text-[10px] uppercase font-bold px-1 rounded w-fit mt-1">New</span>
            </div>
         </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
  SpeakerWaveIcon,
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  Bars3BottomLeftIcon
} from '@heroicons/vue/24/solid'
import { computed } from 'vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const movieId = Number(route.params.id)

// Local mock data since there's no central store in this code
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

// Find current movie
const movie = computed(() => {
  return mockMovies.find(m => m.id === movieId) || mockMovies[0]
})

// Generate the Drogon Streaming URL from our backend
// In a full application, use config.public.apiBaseUrl to set the base if proxy isn't used.
const videoUrl = computed(() => {
  if (!movie.value) return ''

  return `http://localhost:5034/api/v1/originals/stream?resourceId=${movieId}`
})

// Recommended movies (excluding current)
const recommendedMovies = computed(() => {
  return mockMovies.filter(m => m.id !== movie.value.id).slice(0, 8)
})

useHead({
  title: computed(() => `${movie.value?.title || 'Loading'} - Graphic NewsPlus`),
  meta: [
    { name: 'description', content: computed(() => `Watch ${movie.value?.title || 'Movies'} on Graphic NewsPlus Originals.`) }
  ]
})
</script>

<style scoped>
/* Optional: Hide scrollbar for the tag chips container */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
