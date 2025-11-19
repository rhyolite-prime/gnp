<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
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
          <div class="relative hidden sm:block">
            <input 
              v-model="searchQuery"
              type="search" 
              placeholder="Search news..." 
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch class="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <!-- user auth button here-->
           <div class="hidden md:flex items-center space-x-4">
              <UserAuthButton :showSignInModal="() => showSignInModal = true" />
          
           </div>


        </div>
      </div>
    </div>
  </header>

  <!-- Sign In Modal -->
    <SignInModal 
      v-if="showSignInModal" 
      @close="showSignInModal = false"
    />
</template>

<script setup>
const searchQuery = ref('')
const showSignInModal = ref(false);

// Handle search functionality
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    // Implement search logic here
    console.log('Searching for:', newQuery)
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
</style>