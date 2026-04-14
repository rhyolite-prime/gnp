<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Manage team members, roles, and access permissions for your portal.</p>
      </div>
      <div>
        <button class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <UserPlusIcon class="w-5 h-5 mr-2" />
          Invite User
        </button>
      </div>
    </div>

    <!-- Active Users Table -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col mb-8">
      <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
         <div>
           <h3 class="text-lg font-bold text-slate-900 tracking-tight">Portal Administrators & Staff</h3>
         </div>
         <div class="relative max-w-xs w-full">
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <MagnifyingGlassIcon class="w-5 h-5 text-slate-400" />
           </div>
           <input type="text" placeholder="Search users..." class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
         </div>
      </div>
      
      <div class="overflow-x-auto">
         <table class="w-full text-left border-collapse">
           <thead>
             <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
               <th class="px-6 py-4">User</th>
               <th class="px-6 py-4">Role</th>
               <th class="px-6 py-4">Status</th>
               <th class="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-slate-100">
             <tr v-for="user in portalUsers" :key="user.id" class="hover:bg-slate-50 transition-colors group">
               <td class="px-6 py-4">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                     {{ user.initial }}
                   </div>
                   <div class="ml-4">
                     <p class="text-sm font-bold text-slate-900">{{ user.name }}</p>
                     <p class="text-xs text-slate-500 font-medium">{{ user.email }}</p>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <span :class="['inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border', 
                   user.role === 'Owner' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                   user.role === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                   'bg-slate-100 text-slate-700 border-slate-200']">
                   {{ user.role }}
                 </span>
               </td>
               <td class="px-6 py-4">
                 <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border', 
                   user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200']">
                   {{ user.status }}
                 </span>
               </td>
               <td class="px-6 py-4 text-right">
                 <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                   <EllipsisHorizontalIcon class="w-5 h-5" />
                 </button>
               </td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  EllipsisHorizontalIcon,
} from '@heroicons/vue/24/outline'
import { usePartnerAuthStore } from '~/stores/partnerAuth'

const partnerAuthStore = usePartnerAuthStore()

const partnerDomain = computed(() => {
  const name = partnerAuthStore.partner?.partnerName || 'Organization'
  return name.toLowerCase().replace(/\s+/g, '') + '.com'
})

const portalUsers = computed(() => [
  { id: 1, name: 'Emmanuel Addo', email: `emmanuel@${partnerDomain.value}`, role: 'Owner', status: 'Active', initial: 'E' },
  { id: 2, name: 'Sarah Jenkins', email: `s.jenkins@${partnerDomain.value}`, role: 'Admin', status: 'Active', initial: 'S' },
  { id: 3, name: 'David Smith', email: `d.smith@${partnerDomain.value}`, role: 'Viewer', status: 'Pending Invite', initial: 'D' },
])
</script>
