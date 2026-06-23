<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- LANDING PAGE VIEW -->
    <div v-if="!isSearching" class="relative flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <!-- Background Image -->
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="/welcome-2.jpeg" 
          alt="Archives Background" 
          class="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      <div class="relative z-10 w-full max-w-4xl px-4 text-center mt-[-10vh]">
        <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Explore Graphic <span class="text-[#e32932]">Archives</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-12 font-medium drop-shadow max-w-2xl mx-auto leading-relaxed">
          Uncover decades of history, news, and powerful stories through our comprehensive digital collection.
        </p>
        
        <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto border border-white/20">
          <div class="bg-white rounded-xl p-4 md:p-6 text-left">
            <div class="flex items-center space-x-8 border-b border-gray-100 mb-6 px-2">
              <button class="pb-3 text-[#e32932] border-b-2 border-[#e32932] font-semibold text-sm">
                Advanced Search
              </button>
              <button class="pb-3 text-gray-400 font-medium text-sm hover:text-gray-700 transition-colors">
                Browse Collections
              </button>
            </div>
            
            <form @submit.prevent="handleSearch" class="flex flex-col md:flex-row gap-4 px-2">
              <div class="flex-1 relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 group-focus-within:text-[#e32932] transition-colors" />
                </div>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="What are you looking for?" 
                  class="w-full pl-11 pr-4 py-3.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white shadow-inner focus:border-[#e32932] focus:ring-1 focus:ring-[#e32932] transition-all" 
                />
              </div>
              <div class="w-full md:w-40 relative">
                <label class="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">From</label>
                <input 
                  type="date" 
                  v-model="dateFrom" 
                  class="w-full py-3.5 px-4 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-[#e32932] focus:ring-1 focus:ring-[#e32932] text-sm text-gray-700 transition-all" 
                />
              </div>
              <div class="w-full md:w-40 relative">
                <label class="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">To</label>
                <input 
                  type="date" 
                  v-model="dateTo" 
                  class="w-full py-3.5 px-4 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-[#e32932] focus:ring-1 focus:ring-[#e32932] text-sm text-gray-700 transition-all" 
                />
              </div>
              <button 
                type="submit" 
                class="bg-[#e32932] hover:bg-red-700 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 flex items-center justify-center whitespace-nowrap"
              >
                Search Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- SEARCH RESULTS VIEW -->
    <div v-else class="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <!-- Sleek Top Navigation / Global Search -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <!-- Back/Logo -->
          <div class="flex items-center gap-3">
            <button @click="isSearching = false" class="text-gray-400 hover:text-[#e32932] transition-colors p-2 -ml-2 rounded-full hover:bg-red-50" title="Back to home">
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <span class="font-black text-xl text-gray-900 tracking-tight hidden sm:block">Graphic<span class="text-[#e32932]">Archives</span></span>
          </div>
          
          <!-- Global Search Bar in Header -->
          <div class="flex-1 max-w-2xl">
             <form @submit.prevent="performSearch" class="relative w-full group">
               <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                 <MagnifyingGlassIcon class="h-4 w-4 text-gray-400 group-focus-within:text-[#e32932] transition-colors" />
               </div>
               <input 
                 type="text" 
                 v-model="searchQuery" 
                 class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#e32932]/20 focus:border-[#e32932] sm:text-sm transition-all" 
                 placeholder="Search archives..." 
               />
             </form>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-3">
             <button class="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
               <BookmarkIcon class="w-5 h-5" />
             </button>
             <button class="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:block">
               Save Search
             </button>
          </div>
        </div>
      </header>

      <!-- Main Content Layout -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 w-full flex-1">
        
        <!-- Sidebar Filters -->
        <aside class="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div class="flex items-center justify-between mb-2">
             <h3 class="font-bold text-gray-900 flex items-center gap-2">
               <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-500"/> 
               Filters
             </h3>
             <button class="text-xs font-medium text-[#e32932] hover:underline">Clear All</button>
          </div>
          
          <!-- Date Range Filter -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h4 class="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
               <CalendarIcon class="w-4 h-4 text-gray-400"/> Date Range
             </h4>
             <div class="space-y-4">
               <div>
                 <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">From</label>
                 <input type="date" v-model="dateFrom" class="w-full text-sm rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#e32932] focus:border-[#e32932] transition-colors py-2">
               </div>
               <div>
                 <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">To</label>
                 <input type="date" v-model="dateTo" class="w-full text-sm rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#e32932] focus:border-[#e32932] transition-colors py-2">
               </div>
             </div>
          </div>

          <!-- Categories Filter -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h4 class="font-semibold text-gray-900 mb-4 text-sm">Categories</h4>
             <div class="space-y-3">
               <label v-for="(cat, idx) in categories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" :checked="idx === 0 || idx === 1" class="w-4 h-4 rounded border-gray-300 text-[#e32932] focus:ring-[#e32932]">
                 <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex-1">{{ cat }}</span>
                 <span class="text-xs text-gray-400">{{ Math.floor(Math.random() * 500) + 10 }}</span>
               </label>
             </div>
          </div>
          
          <!-- Tags Filter -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h4 class="font-semibold text-gray-900 mb-4 text-sm">Popular Tags</h4>
             <div class="flex flex-wrap gap-2">
               <button v-for="(tag, idx) in tags" :key="tag" 
                 :class="[
                   'px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border',
                   idx === 0 ? 'bg-red-50 text-[#e32932] border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                 ]"
               >
                 {{ tag }}
               </button>
             </div>
          </div>
        </aside>

        <!-- Results Area -->
        <main class="flex-1 min-w-0 flex flex-col">
          <!-- Results Header -->
          <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
             <div>
               <h2 class="text-2xl font-bold text-gray-900 leading-tight">
                 Results for <span class="text-[#e32932]">"{{ searchQuery }}"</span>
               </h2>
               <p class="text-sm text-gray-500 mt-1.5">{{ totalResults.toLocaleString() }} records found <span class="text-gray-400 font-mono text-xs">(0.093s)</span></p>
             </div>
             
             <!-- Sort & View Toggles -->
             <div class="flex items-center gap-3">
               <div class="relative">
                 <select class="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e32932]/20 focus:border-[#e32932] py-2 pl-3 pr-8 shadow-sm font-medium text-gray-700 appearance-none bg-white">
                   <option>Most Relevant</option>
                   <option>Newest First</option>
                   <option>Oldest First</option>
                 </select>
               </div>
               <div class="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-gray-100 text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'" class="p-1.5 rounded-md transition-colors"><Squares2X2Icon class="w-4 h-4"/></button>
                  <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-gray-100 text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'" class="p-1.5 rounded-md transition-colors"><Bars4Icon class="w-4 h-4"/></button>
               </div>
             </div>
          </div>
          
          <!-- Active Filters Chips -->
          <div class="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
             <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Active Filters:</span>
             <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#e32932] border border-red-100 rounded-full text-sm font-medium">
               Date: {{ dateFrom }} to {{ dateTo }}
               <button class="hover:bg-red-200 hover:text-red-900 rounded-full p-0.5 transition-colors"><XMarkIcon class="w-3 h-3"/></button>
             </span>
             <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-sm font-medium">
               Category: Politics
               <button class="hover:bg-gray-200 hover:text-gray-900 rounded-full p-0.5 transition-colors"><XMarkIcon class="w-3 h-3"/></button>
             </span>
          </div>

          <!-- Results Grid/List -->
          <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'" class="flex-1 relative">
             <NuxtLink :to="`/archives/${index}`" v-for="(item, index) in items" :key="index" :class="viewMode === 'grid' ? 'flex-col h-full' : 'flex-col sm:flex-row h-auto sm:h-56'" class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex group transform hover:-translate-y-1">
                <!-- Card Image/Header -->
                <div :class="viewMode === 'grid' ? 'h-48 w-full' : 'h-48 sm:h-full w-full sm:w-64 flex-shrink-0 border-r border-gray-100'" class="bg-gray-100 relative overflow-hidden">
                  <div v-if="item.type === 'text'" class="absolute inset-0 p-6 flex flex-col justify-center items-center bg-[#fdfbf7] border-b border-gray-100">
                     <div class="font-serif font-bold text-center text-xl leading-snug text-gray-800 group-hover:text-[#e32932] transition-colors relative z-10">
                       "{{ item.headlineExcerpt }}"
                     </div>
                     <DocumentTextIcon class="absolute w-32 h-32 text-gray-900/5 -right-4 -bottom-4 transform -rotate-12" />
                  </div>
                  <div v-else class="absolute inset-0 bg-gray-200">
                     <img :src="item.image" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                     <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 bg-white/95 backdrop-blur shadow-sm text-[10px] font-bold uppercase tracking-wider rounded text-gray-800 border border-gray-100">{{ item.category }}</span>
                  </div>
                </div>
                
                <!-- Card Body -->
                <div class="p-5 flex-1 flex flex-col relative">
                  <h3 class="font-bold text-gray-900 mb-3 text-lg leading-tight line-clamp-2 group-hover:text-[#e32932] transition-colors cursor-pointer">
                    {{ item.title }}
                  </h3>
                  <p class="text-sm text-gray-600 line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {{ item.excerpt }}
                  </p>
                  
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div class="text-xs font-medium text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <CalendarIcon class="w-3.5 h-3.5" />
                      {{ item.date }}
                    </div>
                    <div class="flex items-center gap-1">
                      <button @click.prevent class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Like">
                        <HeartIcon class="w-5 h-5" />
                      </button>
                      <button @click.prevent class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors" title="Bookmark">
                        <BookmarkIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
             </NuxtLink>
          </div>
          
          <!-- Infinite Scroll Trigger / Loader -->
          <div ref="loadMoreTrigger" class="py-16 flex justify-center items-center">
             <div v-if="isLoadingMore" class="flex flex-col items-center gap-3 text-gray-500">
                <ArrowPathIcon class="w-6 h-6 animate-spin text-[#e32932]" />
                <span class="font-medium text-sm">Loading more records...</span>
             </div>
             <div v-else-if="items.length >= totalResults" class="text-gray-400 text-sm font-medium bg-gray-100 px-4 py-2 rounded-full">
                You've reached the end of the results.
             </div>
          </div>
        </main>
      </div>
      
      <!-- Floating Action Button -->
      <!-- <button 
        @click="openModal"
        class="fixed bottom-6 left-6 md:bottom-8 md:left-8 lg:hidden z-40 bg-[#ba363d] hover:bg-[#9e4449] text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(144,11,62,0.8)] hover:scale-105 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#900B3E]/30"
        title="Quick Search"
      >
        <MagnifyingGlassIcon class="w-6 h-6 md:w-7 md:h-7" />
      </button> -->

      <button 
        @click="openModal"
        class="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 bg-[#ba363d] hover:bg-[#9e4449] text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(144,11,62,0.8)] hover:scale-105 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#900B3E]/30"
        title="Quick Search"
      >
        <MagnifyingGlassIcon class="w-6 h-6 md:w-7 md:h-7" />
      </button>
      
      <!-- Quick Search Modal (Headless UI) -->
      <TransitionRoot appear :show="isModalOpen" as="template">
        <Dialog as="div" @close="isModalOpen = false" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95 translate-y-4"
                enter-to="opacity-100 scale-100 translate-y-0"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100 translate-y-0"
                leave-to="opacity-0 scale-95 translate-y-4"
              >
                <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl md:rounded-[2rem] bg-white p-5 md:p-8 text-left align-middle shadow-2xl transition-all">
                  <div class="flex items-center justify-between mb-6 md:mb-8">
                    <DialogTitle as="h3" class="text-xl md:text-2xl font-bold text-black-500 flex items-center gap-2 md:gap-3">
                      <MagnifyingGlassIcon class="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
                      Quick Search
                    </DialogTitle>
                    <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
                      <XMarkIcon class="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <form @submit.prevent="performModalSearch" class="mb-6 md:mb-8">
                    <div class="relative flex items-center w-full bg-white border border-gray-200 rounded-full shadow-sm focus-within:border-[#900B3E] focus-within:ring-1 focus-within:ring-[#900B3E] transition-all p-1 md:p-1.5">
                      <div class="pl-3 pr-1 md:pl-4 md:pr-2 hidden sm:block">
                        <MagnifyingGlassIcon class="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        v-model="modalSearchQuery"
                        class="flex-1 w-full py-2.5 md:py-3 border-none bg-transparent focus:ring-0 text-base md:text-lg placeholder-gray-400 text-gray-800 pl-4 sm:pl-0" 
                        placeholder="Type to search... (e.g. politics)" 
                      />
                      <button 
                        type="submit" 
                        class="bg-[#ba363d] hover:bg-[#9e4449] text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-full font-bold transition-colors ml-1 md:ml-2 text-sm md:text-base"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <div class="mb-8 flex flex-col md:flex-row gap-6">
                     <div class="flex-1">
                       <label class="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Date From</label>
                       <input type="date" v-model="modalDateFrom" class="w-full text-sm rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-[#900B3E] focus:border-[#900B3E] transition-colors py-3 px-4">
                     </div>
                     <div class="flex-1">
                       <label class="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Date To</label>
                       <input type="date" v-model="modalDateTo" class="w-full text-sm rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-[#900B3E] focus:border-[#900B3E] transition-colors py-3 px-4">
                     </div>
                  </div>

                  <div>
                    <h4 class="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Categories</h4>
                    <div class="flex flex-wrap gap-3">
                      <button 
                        type="button"
                        v-for="cat in allTags" 
                        :key="cat"
                        @click="toggleModalCategory(cat)"
                        :class="[
                          'px-5 py-2.5 rounded-full text-sm font-medium transition-colors border',
                          modalCategories.includes(cat) 
                            ? 'bg-[#4A0024] text-white border-[#4A0024] shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        ]"
                      >
                        {{ cat }}
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useIntersectionObserver } from '@vueuse/core'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  MagnifyingGlassIcon, 
  Bars4Icon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CalendarIcon,
  ArrowPathIcon,
  HeartIcon,
  BookmarkIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

// State
const viewMode = useState<'grid' | 'list'>('archive-viewMode', () => 'grid')
const isSearching = useState('archive-isSearching', () => false)
const searchQuery = useState('archive-searchQuery', () => 'nkrumah')
const dateFrom = useState('archive-dateFrom', () => '1970-01-29')
const dateTo = useState('archive-dateTo', () => '2026-05-28')

// Filter Data
const categories = ['Politics', 'Education', 'Sports', 'Economy', 'International', 'Opinion']
const tags = ['KNUST', 'CPP', 'Ghana', 'University', 'Independence', 'History', 'Osagyefo']

// Modal state
const isModalOpen = ref(false)
const modalSearchQuery = ref('')
const modalDateFrom = ref('')
const modalDateTo = ref('')
const modalCategories = ref<string[]>([])

const allTags = computed(() => [...categories, ...tags])

const toggleModalCategory = (cat: string) => {
  if (modalCategories.value.includes(cat)) {
    modalCategories.value = modalCategories.value.filter(c => c !== cat)
  } else {
    modalCategories.value.push(cat)
  }
}

const openModal = () => {
  modalSearchQuery.value = searchQuery.value
  modalDateFrom.value = dateFrom.value
  modalDateTo.value = dateTo.value
  isModalOpen.value = true
}

const performModalSearch = () => {
  searchQuery.value = modalSearchQuery.value
  if(modalDateFrom.value) dateFrom.value = modalDateFrom.value
  if(modalDateTo.value) dateTo.value = modalDateTo.value
  isModalOpen.value = false
  performSearch()
}

const handleSearch = () => {
  isSearching.value = true
  if (items.value.length === 0) loadInitial()
}

const performSearch = () => {
  // Re-trigger search logic
  items.value = []
  loadInitial()
}

// Mock Items Data
const generateMockItem = (index: number) => {
  const isText = index % 4 === 1
  return {
    id: index,
    title: `Nkrumah${index % 2 === 0 ? '-led Convention People\'s Party' : ', for his vision towards establishing the university'} and the future of Ghana.`,
    excerpt: 'The historical journey of Ghana has seen many great leaders, but the foundational impact of early independence movements continues to shape the nation\'s trajectory today. The archives reveal deeply rooted traditions and political discourse.',
    headlineExcerpt: 'Where is the patriotism Osagyefo Kwame Nkrumah taught us as proud Ghanaians?',
    date: 'July 2, 2025',
    category: categories[index % categories.length],
    type: isText ? 'text' : 'image',
    image: `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80&random=${index}`
  }
}

const items = useState<any[]>('archive-items', () => [])
const totalResults = 16176
const isLoadingMore = useState('archive-isLoadingMore', () => false)
const loadMoreTrigger = ref(null)

// Initialize with some items
const loadInitial = () => {
  items.value = Array.from({ length: 9 }, (_, i) => generateMockItem(i))
}

const loadMore = async () => {
  if (isLoadingMore.value || items.value.length >= totalResults) return
  isLoadingMore.value = true
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const currentLength = items.value.length
  const newItems = Array.from({ length: 6 }, (_, i) => generateMockItem(currentLength + i))
  items.value.push(...newItems)
  
  isLoadingMore.value = false
}

// Infinite Scroll Setup
useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting && isSearching.value) {
      loadMore()
    }
  },
  { 
    threshold: 0.1,
    rootMargin: '100px' // Load slightly before reaching the element
  }
)

onMounted(() => {
  // Optionally load initial data if you want to start on results
  // loadInitial()
})
</script>

<style scoped>
/* Optional styling adjustments */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Custom scrollbar for webkit browsers to make the page look cleaner */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f9fafb; 
}
::-webkit-scrollbar-thumb {
  background: #d1d5db; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af; 
}
</style>