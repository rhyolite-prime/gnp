<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl mb-3 shadow-sm border border-slate-100">
           <div class="w-6 h-6 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-md flex items-center justify-center shadow-sm text-white font-bold text-xs">
             MT
           </div>
           <span class="text-md font-bold text-slate-800 tracking-tight">MTN Ghana</span>
           <span class="px-2 py-0.5 ml-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md tracking-wider">Partner</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
        <p class="text-sm text-slate-500 mt-1">High-level insights about your subscriptions and organization usage.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap font-bold text-sm">
          <DocumentArrowUpIcon class="w-5 h-5 mr-2 text-slate-400" />
          Upload CSV
        </button>

        <button class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <PlusCircleIcon class="w-5 h-5 mr-2" />
          Add Subscriber
        </button>

      </div>
    </div>
       
       <!-- Stats Grid -->
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div v-for="stat in stats" :key="stat.name" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <component :is="stat.icon" class="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
              </div>
              <span :class="['text-sm font-bold flex items-center bg-opacity-10 px-2 py-1 rounded-lg', stat.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50']">
                 {{ stat.change }}
              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium">{{ stat.name }}</h3>
            <p class="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{{ stat.value }}</p>
         </div>
       </div>

       <!-- Main Content Area -->
       <div class="grid lg:grid-cols-3 gap-8">
         
         <!-- Members Table (Spans 2 columns) -->
         <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
               <div>
                 <h2 class="text-xl font-bold text-slate-900 tracking-tight"> Subscriber Directory</h2>
                 <p class="text-sm text-slate-500 mt-1">Viewing all authorized subscribers in your organization.</p>
               </div>
               <div class="relative max-w-xs w-full">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <MagnifyingGlassIcon class="w-5 h-5 text-slate-400" />
                 </div>
                 <input type="text" placeholder="Search members..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner" />
               </div>
            </div>
            
            <div class="overflow-x-auto flex-1">
               <table class="w-full text-left border-collapse">
                 <thead>
                   <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                     <th class="px-6 py-4">Name</th>
                     <th class="px-6 py-4">Phone</th>
                     <th class="px-6 py-4">Status</th>
                     <th class="px-6 py-4">Last Active</th>
                     <th class="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-100">
                   <tr v-for="member in recentMembers" :key="member.id" class="hover:bg-slate-50 transition-colors group">
                     <td class="px-6 py-4">
                       <div class="flex items-center">
                         <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                           {{ member.name.charAt(0) }}
                         </div>
                         <div class="ml-4">
                           <p class="text-sm font-bold text-slate-900">{{ member.name }}</p>
                           <p class="text-xs text-slate-500 font-medium">{{ member.email }}</p>
                         </div>
                       </div>
                     </td>

                      <td class="px-6 py-4 text-sm text-slate-600 font-medium">
                       0244256445
                      </td>
                    
                     <td class="px-6 py-4">
                       <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border', getStatusColor(member.status)]">
                         <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{'bg-green-500': member.status === 'Active', 'bg-yellow-500': member.status === 'Pending', 'bg-gray-400': member.status === 'Inactive'}"></span>
                         {{ member.status }}
                       </span>
                     </td>


                     <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                       {{ member.lastActive }}
                     </td>
                     <td class="px-6 py-4 text-right">
                       <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                         <EllipsisVerticalIcon class="w-5 h-5" />
                       </button>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
            
            <div class="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span class="text-sm text-slate-500 font-medium">Showing <span class="font-bold text-slate-900">1</span> to <span class="font-bold text-slate-900">5</span> of <span class="font-bold text-slate-900">2,845</span> members</span>
              <div class="flex space-x-2">
                <button class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 hover:border-slate-300 transition-all shadow-sm" disabled>Previous</button>
                <button class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">Next</button>
              </div>
            </div>
         </div>

         <!-- Side Panel (Quick Info & Insights) -->
         <div class="space-y-8">
           <!-- Subscription Details -->
           <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
             <h3 class="text-lg font-bold text-slate-900 mb-5 tracking-tight">Subscription Plan</h3>
             
             <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
               <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
               <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-primary-600/20 rounded-full blur-2xl"></div>
               <div class="relative z-10">
                 <div class="text-xs font-black uppercase tracking-widest text-primary-400 mb-1">Corporate Premium</div>
                 <div class="text-3xl font-extrabold mb-6 tracking-tight">{{ partnerName }}</div>
                 
                 <div class="space-y-4 mb-8">
                   <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                     <span class="text-slate-400 font-medium">Billing Cycle</span>
                     <span class="font-bold">Annual</span>
                   </div>
                   <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                     <span class="text-slate-400 font-medium">Next Renewal</span>
                     <span class="font-bold">Dec 15, 2026</span>
                   </div>
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-400 font-medium">Licenses Used</span>
                     <span class="font-bold">2,845 <span class="text-slate-500 font-normal">/ 3,000</span></span>
                   </div>
                 </div>
                 
                 <button class="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm">
                   Manage Billing
                 </button>
               </div>
             </div>
           </div>

           <!-- Recent Activity -->
           <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
             <div class="flex items-center justify-between mb-6">
               <h3 class="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
               <button class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
             </div>
             
             <div class="space-y-6">
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
                   <CheckCircleIcon class="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">Batch Import Successful</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">150 new members imported via CSV.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">2 hours ago</span>
                 </div>
               </div>
               
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                   <UserPlusIcon class="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">New Department Added</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">'Engineering' cohort granted access.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">Yesterday</span>
                 </div>
               </div>
               
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-yellow-50 flex-shrink-0 flex items-center justify-center border border-yellow-100 group-hover:bg-yellow-100 transition-colors">
                   <ClockIcon class="w-5 h-5 text-yellow-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">Renewal Reminder</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Corporate plan renews in 30 days.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">3 days ago</span>
                 </div>
               </div>
             </div>
           </div>
           
         </div>
       </div>

  </div>
</template>

<script setup lang="ts">
import { 
  UsersIcon, 
  DocumentArrowUpIcon, 
  UserPlusIcon, 
  PlusCircleIcon,
  ChartBarIcon, 
  TicketIcon, 
  ArrowTrendingUpIcon, 
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'

import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Partner Dashboard - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Institutional partner dashboard for managing corporate subscriptions and members.' }
  ]
})

const authStore = useAuthStore()

const partnerName = computed(() => {
  const user = authStore.user
  if (!user) return 'Daily Graphic'
  return user.idTokenClaims?.name || user.displayName || user.name || user.givenName || 'Daily Graphic'
})

const stats = [
  { name: 'Active Members', value: '2,845', change: '+12.5%', isPositive: true, icon: UsersIcon },
  { name: 'Total Quota', value: '3,000', change: '155 available', isPositive: true, icon: TicketIcon },
  { name: 'Engagement Rate', value: '78%', change: '+5.4%', isPositive: true, icon: ArrowTrendingUpIcon },
  { name: 'Active Sessions', value: '432', change: '-2.1%', isPositive: false, icon: ChartBarIcon },
]

const recentMembers = [
  { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@mtngh.com', department: 'Finance', status: 'Active', lastActive: '2 mins ago' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@mtngh.com', department: 'Engineering', status: 'Active', lastActive: '1 hr ago' },
  { id: 3, name: 'Amanda Smith', email: 'a.smith@mtngh.com', department: 'HR', status: 'Pending', lastActive: 'Never' },
  { id: 4, name: 'David Wilson', email: 'd.wilson@mtngh.com', department: 'Marketing', status: 'Inactive', lastActive: '5 days ago' },
  { id: 5, name: 'Emily Davis', email: 'e.davis@mtngh.com', department: 'Operations', status: 'Active', lastActive: 'Active now' },
]

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<style scoped>
/* Scoped styles */
</style>
