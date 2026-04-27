<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Manage team members, roles, and access permissions for your portal.</p>
      </div>
      <div>
        <button v-if="activeTab === 'users'" class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <UserPlusIcon class="w-5 h-5 mr-2" />
          Invite User
        </button>
        <button v-if="activeTab === 'roles'" @click="openRoleModal" class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <ShieldCheckIcon class="w-5 h-5 mr-2" />
          Create Role
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex border-b border-slate-200">
      <button 
        @click="activeTab = 'roles'" 
        :class="['px-6 py-3 font-bold text-sm border-b-2 transition-colors', activeTab === 'roles' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']"
      >
        Roles
      </button>
      <button 
        @click="activeTab = 'users'" 
        :class="['px-6 py-3 font-bold text-sm border-b-2 transition-colors', activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']"
      >
        Users
      </button>
    </div>

    <!-- Roles Tab -->
    <div v-if="activeTab === 'roles'" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col mb-8">
       <!-- Roles Header -->
       <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
         <div>
           <h3 class="text-lg font-bold text-slate-900 tracking-tight">Portal Roles</h3>
         </div>
         <div class="relative max-w-xs w-full">
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <MagnifyingGlassIcon class="w-5 h-5 text-slate-400" />
           </div>
           <input type="text" placeholder="Search roles..." class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
         </div>
      </div>
      
      <!-- Roles Table -->
      <div class="overflow-x-auto">
         <table class="w-full text-left border-collapse">
           <thead>
             <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
               <th class="px-6 py-4">Role Name</th>
               <th class="px-6 py-4">Permissions Count</th>
               <th class="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-slate-100">
             <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50 transition-colors group">
               <td class="px-6 py-4">
                 <p class="text-sm font-bold text-slate-900">{{ role.name }}</p>
               </td>
               <td class="px-6 py-4">
                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-700 border-blue-100">
                   {{ role.permissions?.length || 0 }} Permissions
                 </span>
               </td>
               <td class="px-6 py-4 text-right">
                 <div class="flex items-center justify-end space-x-2">
                   <button @click="editRole(role)" class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors" title="Edit Role">
                     <PencilSquareIcon class="w-5 h-5" />
                   </button>
                   <button @click="deleteRole(role)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Role">
                     <TrashIcon class="w-5 h-5" />
                   </button>
                 </div>
               </td>
             </tr>
             <tr v-if="roles.length === 0">
               <td colspan="3" class="px-6 py-8 text-center text-slate-500 text-sm font-medium">No roles found. Create one to get started.</td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col mb-8">
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
                 <div class="flex items-center justify-end space-x-2">
                   <button class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors" title="Edit User">
                     <PencilSquareIcon class="w-5 h-5" />
                   </button>
                   <button @click="deleteUser(user)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete User">
                     <TrashIcon class="w-5 h-5" />
                   </button>
                 </div>
               </td>
             </tr>
             <tr v-if="portalUsers.length === 0">
               <td colspan="4" class="px-6 py-8 text-center text-slate-500 text-sm font-medium">No users found. Invite someone to get started.</td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>

    <!-- Add/Edit Role Modal Overlay -->
    <div v-if="isRoleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden transform transition-all">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">{{ editingRole ? 'Edit Role' : 'Create Role' }}</h3>
          <button @click="closeRoleModal" class="text-slate-400 hover:text-slate-600 transition-colors">
             <span class="sr-only">Close</span>
             <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Role Name <span class="text-red-500">*</span></label>
            <input v-model="roleForm.name" type="text" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="e.g., Support Staff" />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea v-model="roleForm.description" rows="3" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none" placeholder="Briefly describe what this role can do..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Permissions</label>
            <VueMultiselect
              v-model="roleForm.permissions"
              :options="PartnerPermissions"
              :multiple="true"
              group-values="subPermissions"
              group-label="friendlyName"
              :group-select="true"
              placeholder="Select permissions"
              track-by="id"
              label="friendlyName"
              :close-on-select="false"
              class="multiselect-custom"
            >
              <template #selection="{ values, isOpen }">
                <span class="text-sm text-slate-600 font-medium" v-if="values.length" v-show="!isOpen">
                  {{ values.length }} permission(s) selected
                </span>
              </template>
            </VueMultiselect>
          </div>
        </div>

        <div class="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button @click="closeRoleModal" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm">Cancel</button>
          <button @click="saveRole" :disabled="!roleForm.name" class="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{ editingRole ? 'Save Changes' : 'Create Role' }}
          </button>
        </div>
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
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { usePartnerAuthStore } from '~/stores/partnerAuth'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const partnerAuthStore = usePartnerAuthStore();
const { $toast } = useNuxtApp();

const partnerDomain = computed(() => {
  const name = partnerAuthStore.partner?.partnerName || 'Organization'
  return name.toLowerCase().replace(/\s+/g, '') + '.com'
})

// Tab State
const activeTab = ref('roles')
const isSaving = ref(false);

// Permissions Definition
const PartnerPermissions = ref([
  {
      "systemName": "api.manage",
      "friendlyName": "Manage API Keys",
      "subPermissions": [
          { "id": 1, "systemName": "api.keys.create", "friendlyName": "Create API Keys" },
          { "id": 2, "systemName": "api.keys.revoke", "friendlyName": "Revoke API Key" },
          { "id": 3, "systemName": "api.keys.delete", "friendlyName": "Delete API Key" }
      ]
  },
  {
      "systemName": "subscribers.manage",
      "friendlyName": "Manage Subscribers",
      "subPermissions": [
          { "id": 4, "systemName": "subscribers.create", "friendlyName": "Create Subscriber" },
          { "id": 5, "systemName": "subscribers.bulk_upload", "friendlyName": "Upload Bulk Subscribers via Excel/CSV" },
          { "id": 6, "systemName": "subscribers.update", "friendlyName": "Update Subscriber" },
          { "id": 7, "systemName": "subscribers.delete", "friendlyName": "Delete Subscriber" }
      ]
  },
  {
      "systemName": "settings.manage",
      "friendlyName": "Manage Settings",
      "subPermissions": [
          { "id": 8, "systemName": "settings.update", "friendlyName": "Update Settings" }
      ]
  },
  {
      "systemName": "users.manage",
      "friendlyName": "Manage Users",
      "subPermissions": [
          { "id": 9, "systemName": "users.create", "friendlyName": "Create/Invite User" },
          { "id": 10, "systemName": "users.edit", "friendlyName": "Edit User" },
          { "id": 11, "systemName": "users.delete", "friendlyName": "Delete User" }
      ]
  },
  {
      "systemName": "reports.manage",
      "friendlyName": "Manage Reports",
      "subPermissions": [
          { "id": 12, "systemName": "reports.view", "friendlyName": "View Reports" },
          { "id": 13, "systemName": "reports.export", "friendlyName": "Export Report Data" }
      ]
  }
])

// Helper to get permission objects by ID
const allPerms = PartnerPermissions.value.flatMap(p => p.subPermissions)
const getPerms = (ids: number[]) => allPerms.filter(p => ids.includes(p.id))

// Roles State
const roles = ref<any[]>([
  { id: 1, name: 'Owner', permissions: getPerms([1,2,3,4,5,6,7,8,9,10,11,12,13]) },
  { id: 2, name: 'Admin', permissions: getPerms([4,5,6,7,9,10,11,12,13]) },
  { id: 3, name: 'Viewer', permissions: getPerms([12,13]) }
])

// Users State
const portalUsers = ref([
  { id: 1, name: 'Emmanuel Addo', email: `emmanuel@${partnerDomain.value}`, role: 'Owner', status: 'Active', initial: 'E' },
  { id: 2, name: 'Sarah Jenkins', email: `s.jenkins@${partnerDomain.value}`, role: 'Admin', status: 'Active', initial: 'S' },
  { id: 3, name: 'David Smith', email: `d.smith@${partnerDomain.value}`, role: 'Viewer', status: 'Pending Invite', initial: 'D' },
])

const deleteUser = (user: any) => {
  portalUsers.value = portalUsers.value.filter(u => u.id !== user.id)
}

// Role Modal State
const isRoleModalOpen = ref(false)
const editingRole = ref<any>(null)
const roleForm = reactive({
  name: '',
  description: '',
  permissions: [] as any[]
})

const openRoleModal = () => {
  editingRole.value = null
  roleForm.name = ''
  roleForm.description = ''
  roleForm.permissions = []
  isRoleModalOpen.value = true
}

const editRole = (role: any) => {
  editingRole.value = role
  roleForm.name = role.name
  roleForm.description = role.description ?? ''
  roleForm.permissions = [...role.permissions]
  isRoleModalOpen.value = true
}

const closeRoleModal = () => {
  isRoleModalOpen.value = false
}

/** Builds the API-ready payload: permissions as a string list of systemNames */
const buildRolePayload = () => ({
  name: roleForm.name,
  description: roleForm.description,
  permissions: roleForm.permissions.map((p: any) => p.systemName) as string[]
})

const saveRole = async () => {
  const payload = buildRolePayload()

  if (editingRole.value) {
    const idx = roles.value.findIndex(r => r.id === editingRole.value.id)
    if (idx !== -1) {
      roles.value[idx].name = payload.name
      roles.value[idx].description = payload.description
      roles.value[idx].permissions = [...roleForm.permissions]
    }
  } else {
    roles.value.push({
      id: Date.now(),
      name: payload.name,
      description: payload.description,
      permissions: [...roleForm.permissions]
    })
  }

  // TODO: Replace with actual API call, e.g.:
  // await createPartnerRole(payload)  ->  payload = { name, description, permissions: string[] }
  console.log('Role API payload:', payload)
  isSaving.value = true;

  try {

    let isSuccessful = await createPartnerRole(payload);
    if (isSuccessful) {
      $toast.success('Role saved successfully!');
       //await getPaginatedRoles();
    } else {
      $toast.error('Failed to save role');
    }

  } catch (error) {
    $toast.error('An error occurred while saving role');
  }finally {
      isSaving.value = false;
   }

  closeRoleModal()
}

const deleteRole = (role: any) => {
  roles.value = roles.value.filter(r => r.id !== role.id)
}
</script>

<style>
.multiselect-custom .multiselect__tags {
  @apply min-h-[42px] border-gray-300 rounded-md pt-2;
}
.multiselect-custom .multiselect__input,
.multiselect-custom .multiselect__input:focus {
  @apply border-none shadow-none ring-0 focus:ring-0 focus:border-transparent bg-transparent !important;
}
.multiselect-custom .multiselect__option--highlight {
  @apply bg-primary-600 text-white;
}
.multiselect-custom .multiselect__option--highlight::after {
  @apply bg-primary-600 text-white;
}
/* Hierarchy display */
.multiselect-custom .multiselect__option--group {
  @apply font-bold bg-slate-50 text-slate-900 text-xs uppercase tracking-wider py-2.5;
}
.multiselect-custom .multiselect__option:not(.multiselect__option--group) {
  @apply pl-8 text-sm font-medium text-slate-700;
}
</style>
