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
             <tr class="hover:bg-slate-50 transition-colors group">
               <td class="px-6 py-4">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                     E
                   </div>
                   <div class="ml-4">
                     <p class="text-sm font-bold text-slate-900">Emmanuel Addo</p>
                     <p class="text-xs text-slate-500 font-medium">emmanuel@organization.com</p>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                   Owner
                 </span>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                   Active
                 </span>
               </td>
               <td class="px-6 py-4 text-right">
                 <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                   <EllipsisHorizontalIcon class="w-5 h-5" />
                 </button>
               </td>
             </tr>
             <tr class="hover:bg-slate-50 transition-colors group">
               <td class="px-6 py-4">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shadow-sm border border-slate-300">
                     S
                   </div>
                   <div class="ml-4">
                     <p class="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                     <p class="text-xs text-slate-500 font-medium">s.jenkins@organization.com</p>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                   Admin
                 </span>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                   Active
                 </span>
               </td>
               <td class="px-6 py-4 text-right">
                 <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                   <EllipsisHorizontalIcon class="w-5 h-5" />
                 </button>
               </td>
             </tr>
             <tr class="hover:bg-slate-50 transition-colors group">
               <td class="px-6 py-4">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-200 border-dashed">
                     D
                   </div>
                   <div class="ml-4">
                     <p class="text-sm font-bold text-slate-900">David Smith</p>
                     <p class="text-xs text-slate-500 font-medium">d.smith@organization.com</p>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                   Viewer
                 </span>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                   Pending Invite
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

    <!-- Roles Explaination -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 mb-4">
             <ShieldCheckIcon class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 mb-2">Owner</h4>
          <p class="text-sm text-slate-500 leading-relaxed">Full access to all portal settings, billing, API keys, and user management. Only owners can delete the organization.</p>
       </div>
       <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 mb-4">
             <BriefcaseIcon class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 mb-2">Admin</h4>
          <p class="text-sm text-slate-500 leading-relaxed">Can manage members, add new sub-administrators, edit API keys, and view reports. Cannot modify billing.</p>
       </div>
       <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center border border-slate-200 mb-4">
             <EyeIcon class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 mb-2">Viewer</h4>
          <p class="text-sm text-slate-500 leading-relaxed">Read-only access to subscriber directories and analytics reports. Cannot modify portal settings or API keys.</p>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  EllipsisHorizontalIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// Logic could easily be added here later
</script>
