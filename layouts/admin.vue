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
        <div v-for="item in navigation" :key="item.name" class="space-y-1">
          <!-- Single menu item -->
          <NuxtLink
            v-if="!item.children || !item.children.length"
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
              class="mr-3 h-5 w-5"
              :class="route.path === item.href ? 'text-primary-600' : 'text-gray-400'"
            />
            {{ item.name }}
          </NuxtLink>

          <!-- Grouped menu -->
          <div v-else>
            <button
              type="button"
              class="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              @click="expandedMenus[item.name] = !expandedMenus[item.name]"
            >
              <component
                :is="item.icon"
                class="mr-3 h-5 w-5 text-gray-400"
              />
              <span class="flex-1 text-left">
                {{ item.name }}
              </span>

              <svg
                class="h-4 w-4 text-gray-400 transition-transform"
                :class="expandedMenus[item.name] ? 'rotate-90' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <transition name="slide-fade">
              <div
                v-show="expandedMenus[item.name]"
                class="ml-8 space-y-1"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.href"
                  class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="[
                    route.path === child.href
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                >
                  {{ child.name }}
                </NuxtLink>
              </div>
            </transition>
          </div>
        </div>
      </nav>

      <!-- User Profile (Bottom Sidebar) -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center p-2 rounded-xl">
          <img 
            class="h-9 w-9 rounded-full object-cover border border-gray-200" 
            :src="authStore.userPhotoUrl || `https://ui-avatars.com/api/?name=${authStore.user?.displayName || 'User'}&background=random`" 
            :alt="authStore.user?.displayName || 'User'" 
          />
          <div class="ml-3 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.displayName || 'Admin User' }}</p>
            <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || 'admin@graphic.com.gh' }}</p>
          </div>
          <button 
            @click="handleLogout" 
            class="ml-auto p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
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
  CreditCardIcon,
  BanknotesIcon,
  MegaphoneIcon,
  RectangleGroupIcon,
  BuildingOfficeIcon,
  Bars3Icon,
  BellIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)

const expandedMenus = ref<Record<string, boolean>>({
  Content: true,
})

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },

  {
    name: 'Content',
    icon: DocumentTextIcon,
    children: [
      { name: 'Newspapers', href: '/admin/content-management/newspapers' },
      { name: 'Ingestion', href: '/admin/content-management/ingestion' },
      { name: 'Ingestion Jobs', href: '/admin/content-management/ingestion-jobs' },
    ],
  },

  {
    name: 'Commercial Partners',
    icon: BuildingOfficeIcon,
    children: [
      { name: 'Partners', href: '/admin/partners/' },
      { name: 'Invoices & Payments', href: '/admin/partners/invoices' },
    ],
  },
  {
    name: 'Affiliate Marketing',
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Overview', href: '/admin/affiliates/dashboard' },
      { name: 'Affiliates', href: '/admin/affiliates/' },
      { name: 'Applications', href: '/admin/affiliates/applications' },
      { name: 'Commissions', href: '/admin/affiliates/commissions' },
      { name: 'Payouts', href: '/admin/affiliates/payouts' },
      { name: 'Settings', href: '/admin/affiliates/settings' },
    ],
  },


  { name: 'Subscription Plans', href: '/admin/subscription-plans', icon: CreditCardIcon },
  { name: 'Payments', href: '/admin/payments', icon: BanknotesIcon },
  { name: 'Campaigns', href: '/admin/campaigns', icon: MegaphoneIcon },
  { name: 'Coupons', href: '/admin/coupons', icon: TicketIcon },
  {
    name: 'Advert Management',
    icon: RectangleGroupIcon,
    children: [
      { name: 'Advert Categories', href: '/admin/categories/' },
      { name: 'Advert Sizes', href: '/admin/users/sizes' },
      { name: 'Publication Slots', href: '/admin/publication-slots' },
      { name: 'Ad Requests', href: '/admin/ad-requests' },
    ],
  },
  {
    name: 'User Management',
    icon: UsersIcon,
    children: [
      { name: 'Users', href: '/admin/users/' },
      { name: 'Subscribers', href: '/admin/users/subscribers' },
      { name: 'Roles', href: '/admin/users/roles' },
    ],
  },
  { name: 'Reports', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

const pageTitle = computed(() => {
  for (const item of navigation) {
    if (item.href === route.path) return item.name
    if (item.children?.length) {
      const child = item.children.find(c => c.href === route.path)
      if (child) return child.name
    }
  }
  return 'Dashboard'
})

navigation.forEach(item => {
  if (item.children?.some(c => c.href === route.path)) {
    expandedMenus.value[item.name] = true
  }
})

const handleLogout = () => {
  authStore.clearUser()
  const cookie = useCookie('gnp-user-identity')
  cookie.value = null
  router.push('/admin/account/login')
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
