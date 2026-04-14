<template>
  <div class="min-h-screen bg-[#101010] text-white font-sans pb-20 overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative h-[75vh] sm:h-[85vh] w-full">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1540747913346-19e32dca3269?q=80&w=2670&auto=format&fit=crop" alt="Featured Content" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/50 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#101010] via-[#101010]/60 to-transparent"></div>
      </div>
      
      <div class="relative h-full flex items-center px-4 sm:px-12 lg:px-20 max-w-7xl">
        <div class="max-w-2xl mt-20 sm:mt-32">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-red-600 tracking-widest font-black text-xs sm:text-sm bg-black/40 px-3 py-1 rounded-sm border-l-2 border-red-600 backdrop-blur-sm shadow-sm">GN+ ORIGINAL</span>
            <span class="bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded font-medium backdrop-blur-md">LIVE NOW</span>
          </div>
          <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black mb-4 tracking-tight drop-shadow-2xl">The Big <br/>Debate 2026</h1>
          <p class="text-lg sm:text-xl text-gray-200 mb-8 line-clamp-3 md:line-clamp-none font-medium drop-shadow-md">
             Experience unprecedented access to the nation's biggest political event. Exclusive live coverage, deep-dive interviews, and expert analysis.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <NuxtLink to="/originals/live" class="flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-3 rounded hover:bg-gray-200 transition-all active:scale-95 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <PlayIcon class="w-6 h-6 sm:w-7 sm:h-7 fill-current" /> Watch Live
            </NuxtLink>
            <button class="flex items-center gap-2 bg-gray-500/40 hover:bg-gray-500/60 text-white px-6 sm:px-8 py-3 rounded transition-all active:scale-95 font-bold text-lg backdrop-blur-md border border-white/10">
              <InformationCircleIcon class="w-6 h-6" /> More Info
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Rows -->
    <div class="space-y-8 sm:space-y-16 px-4 sm:px-12 lg:px-20 -mt-10 sm:-mt-20 relative z-10">
      <OriginalsVideoRow title="Live Now & Upcoming" category="live" :items="mockLive" />
      <OriginalsVideoRow title="Sports Highlights" category="sports-highlights" :items="mockSports" />
      <OriginalsVideoRow title="Exclusive Interviews" category="interviews" :items="mockInterviews" />
      <OriginalsVideoRow title="Top Podcasts" category="podcasts" :items="mockPodcasts" />
      <OriginalsVideoRow title="Premium Movies" category="movies" :items="mockMovies" />
      <OriginalsVideoRow title="GN Books" category="books" :items="mockBooks" />
    </div>
  </div>
</template>

<script setup>
import { PlayIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default' // Or a specific dark layout if they have one
})

const mockLive = [
  { id: 1, title: 'National Election Coverage: Live from Headquarters', image: 'https://images.unsplash.com/photo-1540747913346-19e32dca3269?q=80&w=800&auto=format&fit=crop', isNew: true, rating: 'PG' },
  { id: 2, title: 'Breaking News: Global Economic Summit', image: 'https://images.unsplash.com/photo-1529651737248-cb5f4fae5728?q=80&w=800&auto=format&fit=crop', rating: 'PG' },
  { id: 3, title: 'City Traffic & Weather Updates', image: 'https://images.unsplash.com/photo-1449824913935-5b43ca5d4291?q=80&w=800&auto=format&fit=crop', rating: 'G' },
]

const mockSports = [
  { id: 4, title: 'Premier League: Weekend Top Goals', image: 'https://images.unsplash.com/photo-1551280857-ae8690940dc6?q=80&w=800&auto=format&fit=crop', duration: '12m', rating: 'PG', genre: 'Football' },
  { id: 5, title: 'NBA Finals Game 7 Highlights', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop', duration: '15m', rating: 'PG', genre: 'Basketball' },
  { id: 6, title: 'Formula 1: Monaco GP Highlights', image: 'https://images.unsplash.com/photo-1532906626884-baedfbaf835a?q=80&w=800&auto=format&fit=crop', duration: '10m', isNew: true, genre: 'Racing' },
  { id: 7, title: 'Tennis Grand Slam Finals', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop', duration: '22m', genre: 'Tennis' },
]

const mockInterviews = [
  { id: 8, title: 'A Conversation with the President', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop', isNew: true, duration: '45m', genre: 'Politics' },
  { id: 9, title: 'Tech Visionaries: Inside AI', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', duration: '30m', genre: 'Technology' },
  { id: 10, title: 'The Making of a Champion', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', duration: '38m', genre: 'Sports' },
  { id: 11, title: 'Voices of Tomorrow: Youth Leaders', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop', duration: '25m', genre: 'Society' },
]

const mockPodcasts = [
  { id: 12, title: 'The Daily Chronicle Podcast', image: 'https://images.unsplash.com/photo-1590602847861-f35f18d4ecbf?q=80&w=800&auto=format&fit=crop', isNew: true, duration: '55m', genre: 'News' },
  { id: 13, title: 'Economy Watch', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', duration: '40m', genre: 'Finance' },
  { id: 14, title: 'True Crime: Cold Cases', image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=800&auto=format&fit=crop', duration: '1h 20m', genre: 'True Crime' },
  { id: 15, title: 'Health & Wellness Weekly', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', duration: '35m', genre: 'Health' },
]

const mockMovies = [
  { id: 16, title: 'The Last Frontier', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop', isNew: true, duration: '2h 15m', rating: 'PG-13', genre: 'Action' },
  { id: 17, title: 'Midnight City', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop', duration: '1h 50m', rating: 'R', genre: 'Thriller' },
  { id: 18, title: 'Journey to the Unknown', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop', duration: '2h 5m', rating: 'PG', genre: 'Sci-Fi' },
  { id: 19, title: 'Love in Autumn', image: 'https://images.unsplash.com/photo-1481018595507-2a6d47916eb4?q=80&w=800&auto=format&fit=crop', duration: '1h 40m', rating: 'PG', genre: 'Romance' },
  { id: 20, title: 'The Great Betrayal', image: 'https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=800&auto=format&fit=crop', duration: '2h', rating: 'R', genre: 'Drama' },
]

const mockBooks = [
  { id: 1, title: 'The Modern Age: A New Dawn', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop', isNew: true, rating: 'Book' },
  { id: 2, title: 'Political Giants of the 21st Century', image: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=600&auto=format&fit=crop', rating: 'Book' },
  { id: 3, title: 'Economics for Tomorrow', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop', isNew: true, rating: 'Book' },
  { id: 4, title: 'Through The Lens: Africa', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop', rating: 'Book' },
]
</script>
