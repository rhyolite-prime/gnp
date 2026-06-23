<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Roles</h1>
        <p class="mt-2 text-sm text-gray-700">Manage roles and their permissions</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Create Role
        </button>
      </div>
    </div>


    <!-- Filters Toggle -->
    <div class="flex justify-end mb-4">
      <button 
        @click="showFilters = !showFilters" 
        type="button" 
        class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <FunnelIcon class="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Filters
      </button>
    </div>

    <!-- Filters -->
    <div v-show="showFilters" class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
      <!-- Search -->
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input 
          type="text" 
          v-model="filters.query" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
          placeholder="Search roles..." 
        />
      </div>

      <!-- Filter Actions -->
      <div class="flex items-center gap-2">
        <button 
          @click="resetFilters" 
          type="button" 
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-1"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Roles List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Permissions</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="isShimmerLoading">
            <td colspan="5" class="py-10 text-center text-sm text-gray-500">Loading roles...</td>
          </tr>
          <tr v-else-if="roleList.length === 0">
            <td colspan="5" class="py-10 text-center text-sm text-gray-500">No roles found.</td>
          </tr>
          <tr v-for="role in roleList" :key="role.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ role.name }}</div>
            </td>
            <td class="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ role.description || '—' }}
            </td>
            <td class="px-3 py-4 text-sm text-gray-500">
              <div v-if="role.permissions && role.permissions.length" class="flex flex-wrap gap-1">
                <span
                  v-for="perm in role.permissions.slice(0, 3)"
                  :key="perm"
                  class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  {{ perm }}
                </span>
                <span
                  v-if="role.permissions.length > 3"
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  +{{ role.permissions.length - 3 }} more
                </span>
              </div>
              <span v-else class="text-gray-400">No permissions</span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ standardDateFormat(role.createdAt) }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
              <button
                class="text-primary-600 hover:text-primary-800"
                @click="openEditModal(role)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click="delRole(role)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <client-only>
        <SimplePagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo" 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>
 
    </div>

    

    <!-- Create/Edit Role Modal -->
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <!-- Header -->
                <div class="mb-6">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                    {{ isEditMode ? 'Edit Role' : 'Create Role' }}
                  </DialogTitle>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ isEditMode ? 'Update the role name, description, and permissions.' : 'Define a new role with a name, description, and permissions.' }}
                  </p>
                </div>

                <form @submit.prevent="saveRole" class="space-y-5">
                  <!-- Name -->
                  <div>
                    <label for="role-name" class="block text-sm font-medium leading-6 text-gray-900">
                      Role Name <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-2">
                      <input
                        id="role-name"
                        type="text"
                        v-model="form.name"
                        required
                        placeholder="e.g. Content Editor"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="role-description" class="block text-sm font-medium leading-6 text-gray-900">
                      Description
                    </label>
                    <div class="mt-2">
                      <textarea
                        id="role-description"
                        v-model="form.description"
                        rows="3"
                        placeholder="Brief description of this role's responsibilities..."
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none"
                      />
                    </div>
                  </div>

                  <!-- Permissions Configuration -->
                  <div class="mt-8 pt-6 border-t border-gray-200">
                    <div class="sm:flex sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 class="text-lg font-medium leading-6 text-gray-900">Permissions Configuration</h3>
                        <p class="mt-1 text-sm text-gray-500">Toggle granular permissions. Checked cards indicate assigned permissions.</p>
                      </div>
                      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                          type="button"
                          @click="toggleAllPermissions"
                          class="inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          {{ areAllPermissionsSelected ? 'Deselect All' : 'Select All' }}
                        </button>
                      </div>
                    </div>
                    
                    <!-- Search -->
                    <div class="relative rounded-md shadow-sm mb-6">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input 
                        type="text"
                        v-model="permissionSearchQuery" 
                        class="block w-full rounded-md border-0 py-2.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                        placeholder="Search permissions by name or concept (e.g., 'publish')..." 
                      />
                    </div>

                    <!-- Groups List -->
                    <div class="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div v-for="group in filteredPermissionGroups" :key="group.systemName" class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <!-- Group Header -->
                        <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
                          <div class="flex items-center gap-3">
                            <div class="h-2 w-2 rounded-full bg-primary-600"></div>
                            <h4 class="text-base font-bold text-gray-900">{{ group.friendlyName }}</h4>
                            <span class="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10">
                              {{ getActiveCount(group) }} / {{ group.subPermissions.length }} active
                            </span>
                          </div>
                          <button 
                            type="button" 
                            @click="toggleGroup(group)" 
                            class="text-sm font-semibold text-primary-600 hover:text-primary-500"
                          >
                            {{ isGroupFullySelected(group) ? 'Deselect Group' : 'Select Group' }}
                          </button>
                        </div>
                        
                        <!-- Sub Permissions Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
                          <label 
                            v-for="sub in group.subPermissions" 
                            :key="sub.id"
                            class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50 focus:outline-none transition-all"
                            :class="[form.permissions.includes(sub.systemName) ? 'border-primary-600 ring-1 ring-primary-600' : 'border-gray-200']"
                          >
                            <div class="flex w-full items-start">
                              <div class="flex h-6 items-center">
                                <input 
                                  type="checkbox" 
                                  :value="sub.systemName"
                                  v-model="form.permissions"
                                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                                />
                              </div>
                              <div class="ml-3 flex flex-col">
                                <span class="block text-sm font-medium" :class="[form.permissions.includes(sub.systemName) ? 'text-primary-900' : 'text-gray-900']">
                                  {{ sub.friendlyName }}
                                </span>
                                <span class="block text-xs mt-1 text-gray-500">
                                  {{ sub.systemName }}
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <div v-if="filteredPermissionGroups.length === 0" class="text-center py-12">
                        <p class="text-sm text-gray-500">No permissions found matching your search.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Footer actions -->
                  <div class="mt-6 flex items-center justify-end gap-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      @click="closeModal"
                      :disabled="isSaving"
                      class="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSaving || !form.name.trim()"
                      class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es";
import type { Role, Permission } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Roles | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const roleList = ref<Role[]>([]);
const permissionList = ref<Permission[]>([]);

const isShimmerLoading = ref(true);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedRoles()
}

const getPaginatedRoles = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getAdminRoles(filters);

        roleList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch roles !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


 const getPermissions = async () => {

    try {

        permissionList.value = await getAdminPermissions();

    } catch (error) {
        $toast.error('Unable to fetch permissions !');
    }

 }

 

// Filters
const showFilters = ref(false)

const resetFilters = () => {
  filters.query = '';
  filters.pageNo = 1;
  getPaginatedRoles();
}

// Modal state
const isModalOpen = ref(false)
const isSaving = ref(false)
const isEditMode = ref(false)
const editingRoleId = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})

const permissionSearchQuery = ref('');

const filteredPermissionGroups = computed(() => {
  if (!permissionSearchQuery.value) return permissionList.value;
  const lowerQuery = permissionSearchQuery.value.toLowerCase();
  
  return permissionList.value.map(group => {
    const matchingSubs = group.subPermissions.filter(sub => 
      sub.friendlyName.toLowerCase().includes(lowerQuery) || 
      sub.systemName.toLowerCase().includes(lowerQuery)
    );
    
    if (group.friendlyName.toLowerCase().includes(lowerQuery) || group.systemName.toLowerCase().includes(lowerQuery)) {
        return group;
    }
    
    if (matchingSubs.length > 0) {
      return { ...group, subPermissions: matchingSubs };
    }
    return null;
  }).filter(Boolean) as Permission[];
});

const getActiveCount = (group: Permission) => {
  return group.subPermissions.filter(sub => form.value.permissions.includes(sub.systemName)).length;
};

const isGroupFullySelected = (group: Permission) => {
  return group.subPermissions.length > 0 && getActiveCount(group) === group.subPermissions.length;
};

const toggleGroup = (group: Permission) => {
  if (isGroupFullySelected(group)) {
    // Deselect all
    const subNames = group.subPermissions.map(sub => sub.systemName);
    form.value.permissions = form.value.permissions.filter(p => !subNames.includes(p));
  } else {
    // Select all missing
    const subNames = group.subPermissions.map(sub => sub.systemName);
    const newPerms = new Set([...form.value.permissions, ...subNames]);
    form.value.permissions = Array.from(newPerms);
  }
};

const areAllPermissionsSelected = computed(() => {
  const allSubs = permissionList.value.flatMap(g => g.subPermissions);
  if (allSubs.length === 0) return false;
  return allSubs.every(sub => form.value.permissions.includes(sub.systemName));
});

const toggleAllPermissions = () => {
  if (areAllPermissionsSelected.value) {
    form.value.permissions = [];
  } else {
    const allSubs = permissionList.value.flatMap(g => g.subPermissions);
    form.value.permissions = allSubs.map(sub => sub.systemName);
  }
};

const openCreateModal = () => {
  isEditMode.value = false
  editingRoleId.value = null
  form.value = {
    name: '',
    description: '',
    permissions: []
  }
  permissionSearchQuery.value = ''
  isModalOpen.value = true
}

const openEditModal = (role: Role) => {
  isEditMode.value = true
  editingRoleId.value = role.id
  form.value = {
    name: role.name,
    description: role.description ?? '',
    permissions: [...(role.permissions ?? [])]
  }
  permissionSearchQuery.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}



/**
 * Handles both create and update.
 * When isEditMode is true and editingRoleId is set, it calls updateAdminRole;
 * otherwise it calls createAdminRole.
 */
const saveRole = async () => {
   
  isSaving.value = true;

  try {
    if (isEditMode.value && editingRoleId.value) {
      await updateAdminRole(form.value, editingRoleId.value);
      $toast.success('Role updated successfully');
    } else {
      await createAdminRole(form.value);
      $toast.success('Role created successfully');
    }

    isModalOpen.value = false;
    await getPaginatedRoles();
  } catch (error) {
    console.error('Failed to save role', error);
    $toast.error(isEditMode.value ? 'Failed to update role. Please try again.' : 'Failed to create role. Please try again.');
  } finally {
    isSaving.value = false;
  }
}

 
const delRole = async (role: Role) => {

  try {
    await deleteAdminRole(role.id);
    $toast.success('Role deleted successfully');
    await getPaginatedRoles();
  } catch (error) {
    console.error('Failed to delete role', error);
    $toast.error('Failed to delete role');
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedRoles();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string) || 1;
    }
    
    await getPaginatedRoles();
    await getPermissions();
   

  });
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>