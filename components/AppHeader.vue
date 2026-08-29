<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20 gap-8">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center group">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/favicon-mag.png" 
                alt="Graphic NewsPlus Logo" 
                class="w-full h-full object-contain"
              />
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-bold text-gray-900">Graphic NewsPlus</h1>
              <p class="text-xs text-gray-500">Digital News Platform</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/newspapers" class="nav-link">Newspapers</NuxtLink>
          <!-- <a href="#magazines" class="nav-link">Magazines</a> -->
          <NuxtLink to="/archives" class="nav-link">Archives</NuxtLink>
          <NuxtLink to="/research-ai" class="nav-link flex items-center gap-1.5 !text-primary-600 font-semibold group">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
            </span>
            <span>AI Research</span>
          </NuxtLink>
          
          <!-- Originals Dropdown -->
           <!-- <div class="relative group flex items-center h-full">
            <NuxtLink to="/originals" class="nav-link !text-primary-600 hover:!text-primary-700 flex items-center gap-1">
              <PlayIcon class="w-5 h-5" />
              <span>Media Hub</span>
              <ChevronDownIcon class="w-4 h-4 ml-0.5 transition-transform group-hover:rotate-180" />
            </NuxtLink>

            
            <div class="absolute left-1/2 -translate-x-1/2 top-[80%] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-56">
              <div class="bg-white rounded-xl shadow-xl border border-gray-100 p-2 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               
                 <NuxtLink to="/originals/movies" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors group/item">
                  <FilmIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-500" />
                  <span class="font-semibold text-sm">Weekly Digest</span>
                </NuxtLink>

                <NuxtLink to="/originals/interviews" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors group/item">
                  <MicrophoneIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-500" />
                  <span class="font-semibold text-sm">Interviews</span>
                </NuxtLink>
 
                <div class="border-t border-gray-100 my-1"></div>
                <NuxtLink to="/originals/books" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors group/item">
                  <BookOpenIcon class="w-5 h-5 text-primary-400 group-hover/item:text-primary-600" />
                  <span class="font-semibold text-sm">GN+ Books</span>
                </NuxtLink>
              </div>
            </div>
            
          </div> -->

           
          <NuxtLink to="/pricing" class="nav-link">Pricing</NuxtLink>
          <NuxtLink :to="authStore.isAuthenticated ? '/affiliates/dashboard' : '/affiliates'" class="nav-link">Affiliates</NuxtLink>
          <NuxtLink :to="authStore.isAuthenticated ? '/partners/dashboard' : '/partners'" class="nav-link">Partners</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
          <NuxtLink to="/games" class="nav-link">Games</NuxtLink>
        </nav>

        <!-- Search and Sign In -->
        <div class="flex items-center space-x-4">
          <button 
            @click="isSearchOpen = true"
            class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg border border-primary-400 transition-colors"
          >
            <MagnifyingGlassIcon class="h-6 w-6" />
          </button>
          
          <!-- user auth button here-->
           <div class="hidden md:flex items-center space-x-4">
              <UserAuthButton :showSignInModal="() => showSignInModal = true" />
           </div>

           <!-- Mobile Menu Button -->
           <div class="md:hidden flex items-center">
             <button 
               @click="isMobileMenuOpen = true"
               class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <Bars3Icon class="h-6 w-6" />
             </button>
           </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Search Overlay -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div v-if="isSearchOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" @click.self="closeSearch">
      <div class="bg-white w-full p-4 shadow-lg">
        <div class="max-w-3xl mx-auto relative">
          <div class="flex items-center gap-4">
            <MagnifyingGlassIcon class="h-6 w-6 text-gray-400" />
            <input 
              ref="searchInput"
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              type="text" 
              placeholder="Search for news, topics, or authors..." 
              class="flex-1 text-lg border-none focus:ring-0 placeholder-gray-400 py-4"
              autofocus>
            <button 
              @click="closeSearch"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Mobile Menu Drawer -->
  <Transition
    enter-active-class="transition duration-300 ease-in-out transform"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-300 ease-in-out transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 bg-white md:hidden">
      <div class="p-4 flex justify-between items-center border-b border-gray-200">
         <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-2 overflow-hidden">
              <img  src="/favicon-mag.png"  alt="Graphic NewsPlus Logo"   class="w-full h-full object-contain" />
            </div>
            <span class="text-lg font-bold text-gray-900">Menu</span>
         </div>
        <button 
          @click="closeMobileMenu"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      <div class="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <nav class="flex flex-col space-y-4">
          <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Home</NuxtLink>
          <NuxtLink to="/newspapers" class="mobile-nav-link" @click="closeMobileMenu">Newspapers</NuxtLink>
          <!-- <a href="#magazines" class="mobile-nav-link" @click="closeMobileMenu">Magazines</a> -->
          <NuxtLink to="/archives" class="mobile-nav-link" @click="closeMobileMenu">Archives</NuxtLink>
          <NuxtLink to="/research-ai" class="mobile-nav-link !text-primary-600 font-bold flex items-center justify-between" @click="closeMobileMenu">
            <div class="flex items-center gap-2">
              <SparklesIcon class="w-5 h-5 text-primary-600" />
              <span>AI Research Studio</span>
            </div>
            <span class="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-bold">RAG</span>
          </NuxtLink>
          
          <!-- Mobile Originals Accordion -->
           <!-- <div>
            <button @click="isOriginalsOpen = !isOriginalsOpen" class="w-full flex items-center justify-between mobile-nav-link !text-primary-600">
              <div class="flex items-center gap-2">
                <PlayIcon class="w-6 h-6" />
                <span>Media Hub</span>
              </div>
              <ChevronDownIcon :class="['w-5 h-5 transition-transform duration-200', isOriginalsOpen ? 'rotate-180' : '']" />
            </button>
            
            <div v-show="isOriginalsOpen" class="pl-6 flex flex-col space-y-1 mt-2 mb-2 border-l-2 border-primary-100 ml-3">
               
               <NuxtLink to="/originals/movies" class="py-2.5 px-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg text-sm font-medium flex items-center gap-3" @click="closeMobileMenu">
                <FilmIcon class="w-5 h-5 text-gray-400" /> Weekly Digest
              </NuxtLink> 

              <NuxtLink to="/originals/interviews" class="py-2.5 px-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg text-sm font-medium flex items-center gap-3" @click="closeMobileMenu">
                <MicrophoneIcon class="w-5 h-5 text-gray-400" /> Interviews
              </NuxtLink>

              <NuxtLink to="/originals/podcasts" class="py-2.5 px-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg text-sm font-medium flex items-center gap-3" @click="closeMobileMenu">
                <RadioIcon class="w-5 h-5 text-gray-400" /> Podcasts
              </NuxtLink>
              
              <NuxtLink to="/originals/books" class="py-2.5 px-3 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold text-sm flex items-center gap-3" @click="closeMobileMenu">
                <BookOpenIcon class="w-5 h-5 text-primary-500" /> GN Books
              </NuxtLink>
            </div>
          </div> -->

          <NuxtLink to="/pricing" class="mobile-nav-link" @click="closeMobileMenu">Pricing</NuxtLink>
          
          <NuxtLink :to="authStore.isAuthenticated ? '/affiliates/dashboard' : '/affiliates'" class="mobile-nav-link" @click="closeMobileMenu">Affiliates</NuxtLink>
          <NuxtLink :to="authStore.isAuthenticated ? '/partners/dashboard' : '/partners'" class="mobile-nav-link" @click="closeMobileMenu">Partners</NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">About</NuxtLink>
          <NuxtLink to="/games" class="mobile-nav-link" @click="closeMobileMenu">Games</NuxtLink>

          <div class="pt-4 border-t border-gray-100">
             <UserAuthButton :showSignInModal="() => { showSignInModal = true; closeMobileMenu(); }" />
          </div>
        </nav>
      </div>
    </div>
  </Transition>

  <!-- Sign In Modal -->
    <SignInModal 
      v-if="showSignInModal" 
      @close="showSignInModal = false"
    />
</template>

<script setup>

import { 
  MagnifyingGlassIcon, 
  Bars3Icon,
  XMarkIcon,
  PlayIcon,
  ChevronDownIcon,
  SignalIcon,
  TrophyIcon,
  MicrophoneIcon,
  RadioIcon,
  FilmIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { useBasicAuthStore } from '~/stores/basic-user-auth'

const route = useRoute()
const router = useRouter()
const authStore = useBasicAuthStore()
const searchQuery = ref('')
const showSignInModal = useState('showSignInModal', () => false);
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isOriginalsOpen = ref(false)
const searchInput = ref(null)

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
    closeSearch()
  }
}

// Focus input when opened
watch(isSearchOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// Watch for login query param globally
watch(() => route.query.al, (newVal) => {
  if (newVal === 't') {
    showSignInModal.value = true
  }
}, { immediate: true })
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary-600 transition-colors font-medium;
}

.nav-link.router-link-active {
  @apply text-primary-600;
}

.mobile-nav-link {
  @apply text-lg font-medium text-gray-700 py-2 border-b border-gray-50 hover:text-primary-600 transition-colors;
}

.mobile-nav-link.router-link-active {
  @apply text-primary-600;
}
</style>