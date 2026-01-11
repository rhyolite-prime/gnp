<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20 gap-8">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center group">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span class="text-white font-bold text-lg">G</span>
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-bold text-gray-900">Graphic NewsPlus</h1>
              <p class="text-xs text-gray-500">Digital News Platform</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/newspapers" class="nav-link">Newspapers</NuxtLink>
          <a href="#magazines" class="nav-link">Magazines</a>
          <NuxtLink to="/pricing" class="nav-link">Pricing</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        </nav>

        <!-- Search and Sign In -->
        <div class="flex items-center space-x-4">
          <button 
            @click="isSearchOpen = true"
            class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
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
              autofocus
            >
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
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-2">
              <span class="text-white font-bold text-sm">G</span>
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
          <a href="#magazines" class="mobile-nav-link" @click="closeMobileMenu">Magazines</a>
          <NuxtLink to="/pricing" class="mobile-nav-link" @click="closeMobileMenu">Pricing</NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">About</NuxtLink>
          
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
  XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const searchQuery = ref('')
const showSignInModal = ref(false);
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)
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