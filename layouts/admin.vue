<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
            G
          </div>
          <span class="text-lg font-bold text-gray-900 tracking-tight">NewsPlus<span class="text-primary-600">.</span></span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <NuxtLink 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.href"
          class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
          :class="[
            route.path === item.href 
              ? 'bg-primary-50 text-primary-700 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component 
            :is="item.icon" 
            class="mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200"
            :class="[
              route.path === item.href 
                ? 'text-primary-600' 
                : 'text-gray-400 group-hover:text-gray-500'
            ]" 
            aria-hidden="true" 
          />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- User Profile (Bottom Sidebar) -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <img 
            class="h-9 w-9 rounded-full object-cover border border-gray-200" 
            src="https://ui-avatars.com/api/?name=Admin+User&background=random" 
            alt="Admin User" 
          />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Admin User</p>
            <p class="text-xs text-gray-500">admin@graphic.com.gh</p>
          </div>
          <button @click="handleLogout" class="ml-auto text-gray-400 hover:text-red-600 transition-colors">
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <button 
            @click="isSidebarOpen = true" 
            class="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-md"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <!-- Breadcrumbs (Simple) -->
          <h1 class="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors relative">
            <span class="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            <BellIcon class="h-6 w-6" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Content', href: '/admin/content-management', icon: DocumentTextIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

const pageTitle = computed(() => {
  const current = navigation.find(item => item.href === route.path)
  return current ? current.name : 'Dashboard'
})

const handleLogout = () => {
  authStore.clearUser()
  const cookie = useCookie('gnp-user-identity')
  cookie.value = null
  router.push('/admin/account/login')
}
</script>
