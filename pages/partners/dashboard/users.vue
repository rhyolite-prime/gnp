<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Manage team members, roles, and access permissions for your portal.</p>
      </div>
      <div>
        <button v-if="activeTab === 'users'" @click="openUserModal" class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
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
           <h3 class="text-lg font-bold text-slate-900 tracking-tight">Roles</h3>
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
               <th class="px-6 py-4">Description</th>
               <th class="px-6 py-4">Permissions Count</th>
               <th class="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
            <tbody class="divide-y divide-slate-100">
              <!-- Loading State -->
              <tr v-if="isRoleShimmerLoading" v-for="i in 5" :key="'loader-' + i" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="h-4 bg-slate-100 rounded w-32"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-slate-100 rounded w-48"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-6 bg-slate-50 rounded-full w-24"></div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <div class="w-9 h-9 bg-slate-100 rounded-xl"></div>
                    <div class="w-9 h-9 bg-slate-100 rounded-xl"></div>
                  </div>
                </td>
              </tr>

              <!-- Data State -->
              <template v-else>
                <tr v-for="role in roleList" :key="role.id" class="hover:bg-slate-50 transition-colors group">
                  <td class="px-6 py-4">
                    <p class="text-sm font-bold text-slate-900">{{ role.name }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-slate-600 line-clamp-1">{{ role.description }}</p>
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
                      <button @click="deleteRole(role.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Role">
                        <TrashIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="roleList.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-slate-500 text-sm font-medium">No roles found. Create one to get started.</td>
                </tr>
              </template>
            </tbody>
         </table>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col mb-8">
      <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
         <div>
           <h3 class="text-lg font-bold text-slate-900 tracking-tight">Administrators & Staff</h3>
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
               <th class="px-6 py-4">Username</th>
               <th class="px-6 py-4">Role</th>
               <th class="px-6 py-4">Status</th>
               <th class="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-slate-100">
             <!-- Loading State -->
             <tr v-if="isUserShimmerLoading" v-for="i in 5" :key="'user-loader-' + i" class="animate-pulse">
               <td class="px-6 py-4">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-slate-100"></div>
                   <div class="ml-4 space-y-2">
                     <div class="h-4 bg-slate-100 rounded w-32"></div>
                     <div class="h-3 bg-slate-100 rounded w-48"></div>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4">
                 <div class="h-6 bg-slate-50 rounded-lg w-20"></div>
               </td>
               <td class="px-6 py-4">
                 <div class="h-6 bg-slate-50 rounded-full w-24"></div>
               </td>
               <td class="px-6 py-4 text-right">
                 <div class="flex items-center justify-end space-x-2">
                   <div class="w-9 h-9 bg-slate-100 rounded-xl"></div>
                   <div class="w-9 h-9 bg-slate-100 rounded-xl"></div>
                 </div>
               </td>
             </tr>

             <!-- Data State -->
             <template v-else>
               <tr v-for="user in userList" :key="user.id" class="hover:bg-slate-50 transition-colors group">
                 <td class="px-6 py-4">
                   <div class="flex items-center">
                     <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                       {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                     </div>
                     <div class="ml-4">
                       <p class="text-sm font-bold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                       <p class="text-xs text-slate-500 font-medium">{{ user.email }}</p>
                     </div>
                   </div>
                 </td>
                 <td class="px-6 py-4">
                   <span class="inline-flex items-center px-2.5 py-1 text-xs font-bold">
                     {{ user.username }}
                   </span>
                 </td>
                 <td class="px-6 py-4">
                   <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border bg-slate-100 text-slate-700 border-slate-200">
                     {{ Array.isArray(user.roles) ? user.roles.length : 0 }} Roles
                   </span>
                 </td>  
                 <td class="px-6 py-4">
                   <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
                     Active
                   </span>
                 </td>
                 <td class="px-6 py-4 text-right">
                   <div class="flex items-center justify-end space-x-2">
                     <button @click="editUser(user)" class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors" title="Edit User">
                       <PencilSquareIcon class="w-5 h-5" />
                     </button>
                     <button @click="deleteUser(user.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete User">
                       <TrashIcon class="w-5 h-5" />
                     </button>
                   </div>
                 </td>
               </tr>
               <tr v-if="userList.length === 0">
                 <td colspan="4" class="px-6 py-8 text-center text-slate-500 text-sm font-medium">No users found. Invite someone to get started.</td>
               </tr>
             </template>
           </tbody>
         </table>
      </div>
    </div>

    <!-- Add/Edit User Modal Overlay -->
    <div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden transform transition-all">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">{{ editingUser ? 'Edit User' : 'Invite New User' }}</h3>
          <button @click="closeUserModal" class="text-slate-400 hover:text-slate-600 transition-colors">
             <span class="sr-only">Close</span>
             <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">First Name <span class="text-red-500">*</span></label>
              <input v-model="userForm.firstName" type="text" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="John" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Last Name <span class="text-red-500">*</span></label>
              <input v-model="userForm.lastName" type="text" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Doe" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Username <span class="text-red-500">*</span></label>
              <input v-model="userForm.username" type="text" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="johndoe" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Email Address <span class="text-red-500">*</span></label>
              <input v-model="userForm.email" type="email" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="john@example.com" />
            </div>

            <div v-if="!editingUser">
              <label class="block text-sm font-bold text-slate-700 mb-2">Password <span class="text-red-500">*</span></label>
              <input v-model="userForm.password" type="password" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="••••••••" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input v-model="userForm.phoneNumber" type="tel" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="+233 24 000 0000" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Country <span class="text-red-500">*</span></label>
              <VueMultiselect
                v-model="userForm.country"
                :options="countries"
                :searchable="true"
                placeholder="Select country"
                label="name"
                track-by="name"
                class="multiselect-custom"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Roles <span class="text-red-500">*</span></label>
              <VueMultiselect
                v-model="userForm.roles"
                :options="roleList"
                :multiple="true"
                placeholder="Select roles"
                track-by="id"
                label="name"
                :close-on-select="false"
                class="multiselect-custom"
              >
                <template #selection="{ values, isOpen }">
                  <span class="text-sm text-slate-600 font-medium" v-if="values.length" v-show="!isOpen">
                    {{ values.length }} role(s) selected
                  </span>
                </template>
              </VueMultiselect>
            </div>
          </div>
        </div>

        <div class="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button @click="closeUserModal" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm">Cancel</button>
          <button @click="saveUser" :disabled="isSaving || !userForm.email || !userForm.firstName || !userForm.lastName" class="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <template v-if="isSaving">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </template>
            <template v-else>
              {{ editingUser ? 'Update User' : 'Invite User' }}
            </template>
          </button>
        </div>
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
import type { Role, AdminUser } from "~/models";
import { isEmpty, debounce } from "lodash-es";

const partnerAuthStore = usePartnerAuthStore();
const { $toast } = useNuxtApp();

definePageMeta({
  middleware: ['partner-auth']
})

const partnerDomain = computed(() => {
  const name = partnerAuthStore.partner?.partnerName || 'Organization'
  return name.toLowerCase().replace(/\s+/g, '') + '.com'
})

// Tab State
const activeTab = ref('roles')
const isSaving = ref(false);
const isRoleShimmerLoading = ref(true);
const isUserShimmerLoading = ref(true);

const router = useRouter();
const route = useRoute();

const roleFilters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
});


const userFilters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
});

const rolePaginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const userPaginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const roleList = ref<Role[]>([]);
const userList = ref<AdminUser[]>([]);

const onRolePageChange = async (pageNumber: number) => {
  roleFilters.pageNo = pageNumber;

  const filteredQuery = filterQueryParams({
    ...route.query,
    rolePageNo: roleFilters.pageNo,
    roleQuery: roleFilters.query
  });

  router.replace({ name: route.name ?? '', query: filteredQuery });

  await getPaginatedRoles();
};

const onUserPageChange = async (pageNumber: number) => {
  userFilters.pageNo = pageNumber;

  const filteredQuery = filterQueryParams({
    ...route.query,
    userPageNo: userFilters.pageNo,
    userQuery: userFilters.query
  });

  router.replace({ name: route.name ?? '', query: filteredQuery });

  await getPaginatedUsers();
};

const getPaginatedRoles = async () => {

    isRoleShimmerLoading.value = true;

    try {

        let result = await getPartnerRoles(roleFilters);

        roleList.value = result.data;

        rolePaginationParams.totalPages = result.totalPages;
        rolePaginationParams.totalCount = result.totalCount;
        rolePaginationParams.lowerBound = result.lowerBound;
        rolePaginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch partner roles !');
    } finally {
        isRoleShimmerLoading.value = false;
    }

}

const getPaginatedUsers = async () => {

    isUserShimmerLoading.value = true;

    try {

        let result = await getPartnerAdminUsers(userFilters);

        userList.value = result.data;

        userPaginationParams.totalPages = result.totalPages;
        userPaginationParams.totalCount = result.totalCount;
        userPaginationParams.lowerBound = result.lowerBound;
        userPaginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch partner users !');
    } finally {
        isUserShimmerLoading.value = false;
    }

}



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


 
const deleteUser =  async (id: string) => {

try {

    let isSuccessful = await deletePartnerAdminUser(id);
    
    if (isSuccessful) {
      $toast.success('User deleted successfully!');
       await getPaginatedUsers();
    } else {
      $toast.error('Failed to delete user');
    }

  } catch (error) {
    $toast.error('An error occurred while deleting user');
  }
  
}

// User Modal State
const isUserModalOpen = ref(false)
const editingUser = ref<AdminUser | null>(null)
const userForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
  country: null as any,
  roles: [] as Role[]
})

const countries = [
  { name: 'Ghana', code: 'GH' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Germany', code: 'DE' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Kenya', code: 'KE' }
]

const openUserModal = () => {
  editingUser.value = null
  userForm.firstName = ''
  userForm.lastName = ''
  userForm.username = ''
  userForm.email = ''
  userForm.password = ''
  userForm.phoneNumber = ''
  userForm.country = countries.find(c => c.code === 'GH') || null
  userForm.roles = []
  isUserModalOpen.value = true
}

const editUser = (user: AdminUser) => {
  editingUser.value = user
  userForm.firstName = user.firstName
  userForm.lastName = user.lastName
  userForm.username = user.email.split('@')[0] // Fallback if username not in model
  userForm.email = user.email
  userForm.password = ''
  userForm.phoneNumber = user.phoneNumber ?? ''
  userForm.country = countries.find(c => c.name === 'Ghana') || null // Default or map if exists
  
  // Map roles from strings/IDs to Role objects
  userForm.roles = roleList.value.filter(r => user.roles.some((ur: any) => ur === r.name || ur === r.id))
  
  isUserModalOpen.value = true
}

const closeUserModal = () => {
  isUserModalOpen.value = false
}

const saveUser = async () => {
  isSaving.value = true
  
  const payload = {
    firstName: userForm.firstName,
    lastName: userForm.lastName,
    username: userForm.username,
    email: userForm.email,
    password: userForm.password,
    phoneNumber: userForm.phoneNumber,
    country: userForm.country?.name,
    roles: userForm.roles.map(r => r.name) // Assuming API expects role names
  }

  try {
    let isSuccessful = false
    
    if (editingUser.value) {
      isSuccessful = await updatePartnerAdminUser(payload, editingUser.value.id)
    } else {
      isSuccessful = await createPartnerAdminUser(payload)
    }

    if (isSuccessful) {
      $toast.success(`User ${editingUser.value ? 'updated' : 'invited'} successfully!`)
      await getPaginatedUsers()
      closeUserModal()
    } else {
      $toast.error(`Failed to ${editingUser.value ? 'update' : 'invite'} user`)
    }
  } catch (error) {
    $toast.error('An error occurred while saving user')
  } finally {
    isSaving.value = false
  }
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

const editRole = (role: Role) => {
  editingRole.value = role
  roleForm.name = role.name
  roleForm.description = role.description ?? ''
  
  // Map permission system names (strings) from API to multiselect objects
  const allSubPerms = PartnerPermissions.value.flatMap(p => p.subPermissions)
  roleForm.permissions = allSubPerms.filter(p => role.permissions.includes(p.systemName))
  
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
  const payload: any = buildRolePayload()

  if (editingRole.value) {
    payload.id = editingRole.value.id
  }

  isSaving.value = true

  try {
    let isSuccessful = false
    
    if (editingRole.value) {
      isSuccessful = await updatePartnerRole(payload, editingRole.value.id);
    } else {
      isSuccessful = await createPartnerRole(payload);
    }

    if (isSuccessful) {
      $toast.success(`Role ${editingRole.value ? 'updated' : 'created'} successfully!`)
      await getPaginatedRoles()
      closeRoleModal()
    } else {
      $toast.error(`Failed to ${editingRole.value ? 'update' : 'create'} role`)
    }
  } catch (error) {
    $toast.error('An error occurred while saving role')
  } finally {
    isSaving.value = false
  }
}

const deleteRole = async (id: string) => {

   try {

    let isSuccessful = await deletePartnerRole(id);
    if (isSuccessful) {
      $toast.success('Role deleted successfully!');
       await getPaginatedRoles();
    } else {
      $toast.error('Failed to delete role');
    }

  } catch (error) {
    $toast.error('An error occurred while deleting role');
  } 
  
}

const applyFiltersFromQuery = () => {
  const q = route.query;

  Object.assign(roleFilters, {
    pageNo: q.rolePageNo ? parseInt(q.rolePageNo as string) : 1,
    query: (q.roleQuery as string) || ''
  });

  Object.assign(userFilters, {
    pageNo: q.userPageNo ? parseInt(q.userPageNo as string) : 1,
    query: (q.userQuery as string) || ''
  });
};

 onMounted(async () => {
  applyFiltersFromQuery();

  await Promise.all([
    getPaginatedRoles(),
    getPaginatedUsers()
  ]);
 });

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
