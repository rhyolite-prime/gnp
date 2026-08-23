<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top Dashboard Header with Horizontal Menu -->
    <div class="bg-slate-900 pt-8 relative overflow-hidden shrink-0">
      <!-- Decorative backgrounds -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      <div class="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
           <div>
             <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary-600/20 text-primary-400 text-xs font-bold mb-3 border border-primary-500/20 shadow-inner">
                Institutional Partner Portal
             </div>
             <h1 class="text-3xl font-bold text-white tracking-tight">Partner Operations</h1>
             <p class="text-slate-400 mt-1">Manage bulk subscriptions, generate reports, and configure integrations.</p>
           </div>
           <div class="flex items-center gap-3">
              <NuxtLink
                to="/partners/dashboard/docs"
                class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all transform hover:scale-[1.02] shadow-sm cursor-pointer whitespace-nowrap font-bold text-sm">
                <QuestionMarkCircleIcon class="w-5 h-5 mr-2 text-slate-300" />
                Help & Docs
              </NuxtLink>
             <button v-if="false" class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all transform hover:scale-[1.02] shadow-md shadow-primary-500/20 cursor-pointer whitespace-nowrap text-sm">
               <UserPlusIcon class="w-5 h-5 mr-2" />
               Invite Team Member
             </button>
             <button @click="handleLogout" class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 font-bold hover:bg-red-600/20 transition-all transform hover:scale-[1.02] shadow-md cursor-pointer whitespace-nowrap text-sm">
               <ArrowRightOnRectangleIcon class="w-5 h-5 mr-2" />
               Logout
             </button>
           </div>
         </div>

         <!-- Horizontal Navigation Menu -->
         <nav class="flex space-x-8 overflow-x-auto custom-scrollbar">
            <NuxtLink 
               to="/partners/dashboard" 
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center"
            >
              <ChartPieIcon class="w-5 h-5 mr-2" />
              Overview
            </NuxtLink>
            
            <NuxtLink 
               to="/partners/dashboard/api-keys" 
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center"
            >
              <KeyIcon class="w-5 h-5 mr-2" />
              API Settings
            </NuxtLink>
            
            <NuxtLink 
               to="/partners/dashboard/reports"
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center">
              <DocumentChartBarIcon class="w-5 h-5 mr-2" />
              Reports
            </NuxtLink>
            
            <NuxtLink
               to="/partners/dashboard/users" 
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center"
            >
              <UsersIcon class="w-5 h-5 mr-2" />
              User Management
            </NuxtLink>
            
            <NuxtLink 
               to="/partners/dashboard/settings" 
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center"
            >
              <Cog6ToothIcon class="w-5 h-5 mr-2" />
              Account Settings
            </NuxtLink>
            <NuxtLink 
               to="/partners/dashboard/docs" 
               exact-active-class="border-primary-500 text-white" 
               class="border-b-2 border-transparent pb-4 px-1 text-sm font-bold text-slate-400 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors flex items-center"
            >
              <BookOpenIcon class="w-5 h-5 mr-2" />
              API Docs
            </NuxtLink>
         </nav>
      </div>
    </div>

    <!-- Page Content Slot -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  ChartPieIcon,
  KeyIcon,
  DocumentChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

import { usePartnerAuthStore } from '~/stores/partnerAuth'

definePageMeta({
  layout: 'default',
  middleware: 'partner-auth'
})

useHead({
  title: 'Partner Operations - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Institutional partner dashboard for managing corporate subscriptions and integrations.' }
  ]
})

const partnerAuthStore = usePartnerAuthStore()
const router = useRouter()

const handleLogout = () => {
  partnerAuthStore.clearPartner()
  router.push('/partners/account/login')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
