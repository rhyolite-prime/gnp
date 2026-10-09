<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Users</h1>
        <p class="mt-2 text-sm text-gray-700">Manage all administrative users and their access.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all active:scale-[0.98]"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create User
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <!-- Search -->
        <div class="w-full sm:max-w-xs relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input 
            type="text" 
            v-model="filters.query" 
            placeholder="Search users..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-colors"
          />
        </div>

        <!-- Filter Type Toggle + Dropdowns -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <!-- Radio Toggle -->
          <!-- <div class="flex items-center gap-4 shrink-0">
            <span class="text-sm font-medium text-gray-600">Filter by:</span>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                value="groups" 
                v-model="filterType" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
              />
              <span class="text-sm text-gray-700">User Groups</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                value="roles" 
                v-model="filterType" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
              />
              <span class="text-sm text-gray-700">Roles</span>
            </label>
          </div> -->

          <!-- User Groups dropdown -->
          <!-- <div class="flex items-center gap-2" :class="filterType !== 'groups' ? 'opacity-40 pointer-events-none' : ''">
            <label class="text-sm font-medium text-gray-700 shrink-0">Group:</label>
            <select v-model="filters.userGroupId" :disabled="filterType !== 'groups'" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 sm:text-sm rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed">
              <option value="">All Groups</option>
              <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.title }}</option>
            </select>
          </div> -->

          <!-- Roles dropdown -->
          <!-- <div class="flex items-center gap-2" :class="filterType !== 'roles' ? 'opacity-40 pointer-events-none' : ''">
            <label class="text-sm font-medium text-gray-700 shrink-0">Role:</label>
            <select v-model="filters.roleId" :disabled="filterType !== 'roles'" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 sm:text-sm rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed">
              <option value="">All Roles</option>
              <option v-for="r in rolesList" :key="r.id" :value="r.id">{{ r.name || r.title }}</option>
            </select>
          </div> -->

          <!-- Status -->
          <!-- <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 shrink-0">Status:</label>
            <select v-model="statusFilter" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 sm:text-sm rounded-lg">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <div class="overflow-x-auto">  
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12 bg-white">
          <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User Groups/ Roles</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(user, index) in userList" :key="user.id" class="hover:bg-gray-50 transition-colors">
              
               <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ standardDateFormat(user.createdAt) }}
              </td>

              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random`" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-gray-500">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div>{{ user.email }}</div>
                <div class="text-xs">{{ user.phoneNumber || 'N/A' }}</div>
              </td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <div class="flex gap-1 flex-wrap">
                  <span v-for="roleName in getUserRolesDisplay(user)" :key="roleName" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-1">
                    {{ roleName }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="
                    user.isActive
                      ? 'bg-green-50 text-green-700 ring-green-600/20'
                      : 'bg-red-50 text-red-700 ring-red-600/20'
                  "
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
             
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="relative dropdown-container">
                  <button 
                      @click.stop="toggleDropdown(user.id, $event)" 
                      class="flex items-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100 p-1"
                  >
                      <span class="sr-only">Open options</span>
                      <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </button>

                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div 
                        v-if="activeDropdownId === user.id" 
                        class="fixed w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-100 ring-1 ring-black ring-opacity-5"
                        :style="dropdownStyle"
                    >
                        <div class="py-1">
                            <a href="#" @click.prevent="openEditModal(user)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Edit
                            </a>
                            <a href="#" @click.prevent="requestPasswordReset(user)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Reset Password
                            </a>
                            <a href="#" @click.prevent="requestDelete(user.id)" class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                              Delete
                            </a>
                        </div>
                    </div>
                  </transition>
                </div>
              </td>
            </tr>
            <tr v-if="userList.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <UsersIcon class="mx-auto h-12 w-12 text-gray-300" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new user or adjust your filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination component -->
      <client-only>
        <SimplePagination
          :lower-bound="paginationParams.lowerBound" 
          :upper-bound="paginationParams.upperBound"
          @on-page-changed="onPageChange"
          :page-no="filters.pageNo" 
          :total-pages="paginationParams.totalPages"
          :total-count="paginationParams.totalCount" 
          :disabled="isLoading"
        />
      </client-only>
    </div>

    <!-- Create/Edit Modal Form -->
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                
                <div class="bg-gray-50 px-4 py-4 border-b border-gray-200 sm:px-6 flex items-center justify-between">
                   <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      {{ editingUserId ? 'Edit User Details' : 'Create New User' }}
                   </DialogTitle>
                   <button type="button" class="text-gray-400 hover:text-gray-500" @click="closeModal">
                     <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                   </button>
                </div>
                
                <form @submit.prevent="saveUser">
                  <div class="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium leading-6 text-gray-900">First name <span class="text-red-500">*</span></label>
                        <div class="mt-2">
                          <input type="text" v-model="form.firstName" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium leading-6 text-gray-900">Last name <span class="text-red-500">*</span></label>
                        <div class="mt-2">
                          <input type="text" v-model="form.lastName" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Username <span class="text-gray-400 font-normal text-xs">(auto-generated if left blank)</span></label>
                      <div class="mt-2">
                          <input type="text" v-model="form.username" placeholder="e.g. john_doe_123" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Email address <span class="text-red-500">*</span></label>
                      <div class="mt-2">
                        <input type="email" v-model="form.email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                        <div class="mt-2">
                          <input type="tel" v-model="form.phoneNumber" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                      <div v-if="!editingUserId">
                        <label class="block text-sm font-medium leading-6 text-gray-900">Password <span class="text-red-500">*</span></label>
                        <div class="mt-2">
                          <input type="password" v-model="form.password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                    </div>

                    <!-- Access Assignment Type Toggle -->
                    <div class="border-t border-gray-200 pt-6 mt-6">
                      <label class="block text-sm font-bold leading-6 text-gray-900 mb-2">Access Assignment Type</label>
                      <div class="flex items-center space-x-6 mb-4">
                        <div class="flex items-center">
                          <input type="radio" id="assign-groups" value="userGroups" v-model="form.assignmentType" class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300">
                          <label for="assign-groups" class="ml-2 block text-sm font-medium text-gray-700">Assign User Groups</label>
                        </div>
                        <div class="flex items-center">
                          <input type="radio" id="assign-roles" value="roles" v-model="form.assignmentType" class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300">
                          <label for="assign-roles" class="ml-2 block text-sm font-medium text-gray-700">Assign Roles directly</label>
                        </div>
                      </div>

                      <!-- User Groups Checklist -->
                      <div v-show="form.assignmentType === 'userGroups'">
                        <div class="rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden divide-y divide-gray-100 max-h-[250px] overflow-y-auto p-3 space-y-1">
                          <div v-for="group in sortedGroupsTree" 
                            :key="group.id" 
                            class="flex items-center py-2 px-2 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <input
                              type="checkbox" 
                              :id="`group-${group.id}`"
                              :checked="form.selectedGroups.includes(group.id)"
                              @change="toggleGroupSelection(group)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 transition-all cursor-pointer"
                            />
                            
                            <span v-if="group.level && group.level > 0" class="text-gray-400 ml-2.5 mr-1 font-medium tracking-wide select-none flex items-center">
                              <span v-for="i in group.level" :key="i" class="inline-block whitespace-nowrap">
                                {{ i === group.level ? '- ' : '⁝ ' }}
                              </span>
                            </span>
                            <span v-else class="ml-2.5" />

                            <FolderIcon class="h-4 w-4 text-primary-600/70 shrink-0 ml-1 mr-1.5" />

                            <label 
                              :for="`group-${group.id}`" 
                              class="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer select-none"
                            >
                              {{ group.title }}
                            </label>
                          </div>

                          <div v-if="sortedGroupsTree.length === 0" class="text-center py-8 text-sm text-gray-400 italic">
                            No user groups found. Create groups first under user settings.
                          </div>
                        </div>
                      </div>

                      <!-- Roles Checklist -->
                      <div v-show="form.assignmentType === 'roles'">
                        <div class="rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden divide-y divide-gray-100 max-h-[250px] overflow-y-auto p-3 space-y-1">
                          <div v-for="role in rolesList" 
                            :key="role.id" 
                            class="flex items-center py-2 px-2 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <input
                              type="checkbox" 
                              :id="`role-${role.id}`"
                              :checked="form.selectedRoles.includes(role.id)"
                              @change="toggleRoleSelection(role)"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 transition-all cursor-pointer"
                            />
                            <label 
                              :for="`role-${role.id}`" 
                              class="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer select-none ml-3"
                            >
                              {{ role.name || role.title }}
                            </label>
                          </div>

                          <div v-if="rolesList.length === 0" class="text-center py-8 text-sm text-gray-400 italic">
                            No roles found.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                      <div class="mt-2">
                        <select v-model="form.status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                          <option :value="true">Active</option>
                          <option :value="false">Suspended</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                    <button
                      type="submit"
                      class="inline-flex w-full justify-center items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                      :disabled="isSaving"
                    >
                      <svg
                        v-if="isSaving"
                        class="h-4 w-4 animate-spin text-white stroke-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
                        <path class="opacity-75 fill-current" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>{{ isSaving ? 'Saving...' : (editingUserId ? 'Save Changes' : 'Create User') }}</span>
                    </button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeModal">Cancel</button>
                  </div>
                </form>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :show="isConfirmOpen"
      title="Delete User"
      message="Are you sure you want to delete this user? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeleting"
      @confirm="confirmDeleteUser"
      @cancel="isConfirmOpen = false"
    />

    <!-- Reset Password Modal -->
    <TransitionRoot as="template" :show="isResetPasswordOpen">
      <Dialog as="div" class="relative z-50" @close="closeResetPasswordModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                
                <div class="bg-gray-50 px-4 py-4 border-b border-gray-200 sm:px-6 flex items-center justify-between">
                   <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      Reset Password for {{ userToReset?.firstName }}
                   </DialogTitle>
                   <button type="button" class="text-gray-400 hover:text-gray-500" @click="closeResetPasswordModal">
                     <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                   </button>
                </div>
                
                <form @submit.prevent="submitPasswordReset">
                  <div class="px-6 py-6 space-y-6">
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">New Password <span class="text-red-500">*</span></label>
                      <div class="mt-2">
                        <input type="password" v-model="resetPasswordForm.newPassword" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                    <button
                      type="submit"
                      class="inline-flex w-full justify-center items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                      :disabled="isResettingPassword"
                    >
                      <svg
                        v-if="isResettingPassword"
                        class="h-4 w-4 animate-spin text-white stroke-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
                        <path class="opacity-75 fill-current" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>{{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}</span>
                    </button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeResetPasswordModal">Cancel</button>
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
import { PlusIcon, MagnifyingGlassIcon, UsersIcon, XMarkIcon, FolderIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es";
import type { AdminUser } from "~/models";

const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const activeDropdownId = ref<string | null>(null);
const dropdownDirection = ref<'up' | 'down'>('down');
const dropdownStyle = ref<Record<string, string>>({});

const toggleDropdown = (id: string, event: Event) => {
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null;
        return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    const menuHeight = 120; // approximate height of dropdown (3 items)
    const spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceBelow < menuHeight) {
        // pop upwards
        dropdownStyle.value = {
            top: `${rect.top - menuHeight}px`,
            right: `${window.innerWidth - rect.right}px`,
        };
    } else {
        // pop downwards
        dropdownStyle.value = {
            top: `${rect.bottom + 4}px`,
            right: `${window.innerWidth - rect.right}px`,
        };
    }
    
    activeDropdownId.value = id;
};

const closeDropdown = (e: Event) => {
    if (activeDropdownId.value) {
        const target = e.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
            activeDropdownId.value = null;
        }
    }
};

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Users | Newsroom OS'
})

// Filters
const filterType = ref<'groups' | 'roles'>('groups')
const statusFilter = ref('All')

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
  roleId: '',
  userGroupId: ''
});

// Reset inactive filter when switching type
watch(filterType, (type) => {
  if (type === 'groups') {
    filters.roleId = '';
  } else {
    filters.userGroupId = '';
  }
  filters.pageNo = 1;
  getPaginatedUsers();
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const userList = ref<AdminUser[]>([]);
const groups = ref<any[]>([]);
const rolesList = ref<any[]>([]);

const isLoading = ref(true);
const isModalOpen = ref(false);
const isSaving = ref(false);
const editingUserId = ref<string | null>(null);

const isConfirmOpen = ref(false);
const isDeleting = ref(false);
const userIdToDelete = ref<string | null>(null);

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  selectedGroups: [] as string[],
  selectedRoles: [] as string[],
  assignmentType: 'userGroups' as 'userGroups' | 'roles',
  status: true // true = Active, false = Suspended
});

const isResetPasswordOpen = ref(false);
const isResettingPassword = ref(false);
const userToReset = ref<AdminUser | null>(null);
const resetPasswordForm = ref({
  newPassword: ''
});

const requestPasswordReset = (user: AdminUser) => {
  userToReset.value = user;
  resetPasswordForm.value.newPassword = '';
  isResetPasswordOpen.value = true;
};

const closeResetPasswordModal = () => {
  isResetPasswordOpen.value = false;
  userToReset.value = null;
};

const submitPasswordReset = async () => {
  if (!userToReset.value || !resetPasswordForm.value.newPassword) return;

  isResettingPassword.value = true;
  try {
    const payload = {
      password: resetPasswordForm.value.newPassword
    };
    const success = await updateAdminUser(payload, userToReset.value.id);
    if (success) {
      $toast.success('Password reset successfully!');
      closeResetPasswordModal();
    } else {
      $toast.error('Failed to reset password');
    }
  } catch (error) {
    console.error('Failed to reset password:', error);
    $toast.error('An error occurred while resetting the password');
  } finally {
    isResettingPassword.value = false;
  }
};

// Load Groups for Checklist
const getGroupsList = async () => {
  try {
    const result = await getUserGroups({ pageNo: 1, pageSize: 1000 })
    const dataList = Array.isArray(result) 
      ? result 
      : (result?.data && Array.isArray(result.data) 
          ? result.data 
          : (result?.result && Array.isArray(result.result) ? result.result : []))
    
    const normalized = dataList.map((g: any) => {
      const pid = g.parentId !== undefined ? g.parentId : g.parent_id || null
      return {
        id: g.id,
        title: g.title,
        parentId: pid,
        parent_id: pid,
        path: g.path || ''
      }
    })

    // Path-based hierarchy reconstruction fallback:
    normalized.forEach((g: any) => {
      if (!g.parentId && g.path && g.path.includes('.')) {
        const pathParts = g.path.split('.')
        pathParts.pop()
        const parentPath = pathParts.join('.')
        const parent = normalized.find((p: any) => p.path === parentPath)
        if (parent) {
          g.parentId = parent.id
          g.parent_id = parent.id
        }
      }
    })
    groups.value = normalized
  } catch (err) {
    console.error('Failed to load user groups:', err)
  }
}

// Load Roles for Checklist
const getRolesList = async () => {
  try {
    const result = await getAdminRoles({ pageNo: 1, pageSize: 1000 })
    rolesList.value = Array.isArray(result) 
      ? result 
      : (result?.data && Array.isArray(result.data) 
          ? result.data 
          : (result?.result && Array.isArray(result.result) ? result.result : []))
  } catch (err) {
    console.error('Failed to load roles:', err)
  }
}

const sortedGroupsTree = computed(() => {
  const result: (any & { level: number })[] = []
  
  const buildTree = (parentId: string | null, currentLevel: number) => {
    const children = groups.value.filter(g => {
      const pid = g.parentId || g.parent_id
      if (parentId === null) {
        return !pid || pid === ''
      }
      return pid === parentId
    })
    children.sort((a, b) => a.title.localeCompare(b.title))
    
    for (const child of children) {
      result.push({
        ...child,
        level: currentLevel
      })
      buildTree(child.id, currentLevel + 1)
    }
  }
  
  buildTree(null, 0)
  
  const renderedIds = new Set(result.map(g => g.id))
  for (const g of groups.value) {
    if (!renderedIds.has(g.id)) {
      result.push({
        ...g,
        level: 0
      })
    }
  }
  return result
})

const getDescendantIds = (groupId: string): string[] => {
  const descendants: string[] = []
  const findChildren = (parentId: string) => {
    const children = groups.value.filter(g => (g.parentId || g.parent_id) === parentId)
    for (const child of children) {
      descendants.push(child.id)
      findChildren(child.id)
    }
  }
  findChildren(groupId)
  return descendants
}

const toggleGroupSelection = (group: any) => {
  const isCurrentlySelected = form.value.selectedGroups.includes(group.id)
  const descendants = getDescendantIds(group.id)
  
  if (isCurrentlySelected) {
    const idsToRemove = new Set([group.id, ...descendants])
    form.value.selectedGroups = form.value.selectedGroups.filter(id => !idsToRemove.has(id))
  } else {
    const currentRoles = new Set(form.value.selectedGroups)
    currentRoles.add(group.id)
    descendants.forEach(id => currentRoles.add(id))
    form.value.selectedGroups = Array.from(currentRoles)
  }
}

const toggleRoleSelection = (role: any) => {
  const isCurrentlySelected = form.value.selectedRoles.includes(role.id)
  if (isCurrentlySelected) {
    form.value.selectedRoles = form.value.selectedRoles.filter(id => id !== role.id)
  } else {
    form.value.selectedRoles = [...form.value.selectedRoles, role.id]
  }
}

const getUserRolesDisplay = (user: any) => {
  let displayedRoles: string[] = []
  
  if (Array.isArray(user.userGroups) && user.userGroups.length > 0) {
    displayedRoles = user.userGroups.map((id: string) => {
      const match = groups.value.find(g => g.id === id)
      return match ? match.title : id
    })
  }
  
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const rNames = user.roles.map((id: string) => {
      const match = rolesList.value.find(r => r.id === id)
      return match ? (match.name || match.title) : id
    })
    displayedRoles = [...displayedRoles, ...rNames]
  }
  
  return Array.from(new Set(displayedRoles))
}

const generateUsername = (firstName: string, lastName: string): string => {
  const rand = Math.floor(100 + Math.random() * 900)
  return `${firstName}_${lastName}_${rand}`.toLowerCase().replace(/\s+/g, '')
}

const getPaginatedUsers = async () => {
  isLoading.value = true;
  try {
    const queryParams: any = {
      ...filters,
      userGroupId: filterType.value === 'groups' && filters.userGroupId !== '' ? filters.userGroupId : undefined,
      roleId: filterType.value === 'roles' && filters.roleId !== '' ? filters.roleId : undefined,
      status: statusFilter.value !== 'All' ? statusFilter.value : undefined,
    }
    const result = await getAdminUsers(queryParams);
    if (result) {
      userList.value = result.data;
      paginationParams.totalPages = result.totalPages;
      paginationParams.totalCount = result.totalCount;
      paginationParams.lowerBound = result.lowerBound;
      paginationParams.upperBound = result.upperBound;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    $toast.error('Unable to fetch admin users!');
  } finally {
    isLoading.value = false;
  }
}

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber;
  const filteredQuery = filterQueryParams({ 
    ...route.query, 
    ...filters,
    userGroupId: filterType.value === 'groups' && filters.userGroupId !== '' ? filters.userGroupId : undefined,
    roleId: filterType.value === 'roles' && filters.roleId !== '' ? filters.roleId : undefined,
    status: statusFilter.value !== 'All' ? statusFilter.value : undefined,
  });
  router.replace({ name: route.name ?? '', query: filteredQuery });
  await getPaginatedUsers();
}

const openCreateModal = () => {
  editingUserId.value = null;
  form.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    selectedGroups: [],
    selectedRoles: [],
    assignmentType: 'userGroups',
    status: true
  };
  isModalOpen.value = true;
}

const openEditModal = (user: any) => {
  editingUserId.value = user.id;
  
  const existingGroups = Array.isArray(user.userGroups) ? [...user.userGroups] : []
  let determinedGroups = existingGroups
  let determinedRoles: string[] = []
  
  if (Array.isArray(user.roles)) {
    user.roles.forEach((id: string) => {
       if (rolesList.value.some(r => r.id === id)) {
         determinedRoles.push(id)
       } else {
         determinedGroups.push(id)
       }
    })
  }

  determinedGroups = Array.from(new Set(determinedGroups))
  determinedRoles = Array.from(new Set(determinedRoles))

  const assignmentType = determinedRoles.length > 0 ? 'roles' : 'userGroups'

  form.value = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    password: '',
    selectedGroups: determinedGroups,
    selectedRoles: determinedRoles,
    assignmentType,
    status: user.isActive !== undefined ? user.isActive : true
  };
  isModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;
}

const saveUser = async () => {
  if (!form.value.username?.trim()) {
    form.value.username = generateUsername(form.value.firstName, form.value.lastName)
  }

  if (!form.value.firstName || !form.value.lastName || !form.value.email || (!editingUserId.value && !form.value.password)) {
    $toast.error('Please fill in all required fields');
    return;
  }

  isSaving.value = true;
  try {
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      username: form.value.username,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber || undefined,
      password: form.value.password || undefined,
      userGroups: form.value.assignmentType === 'userGroups' ? form.value.selectedGroups : [],
      roles: form.value.assignmentType === 'roles' ? form.value.selectedRoles : [],
      isActive: form.value.status
    };

    if (editingUserId.value) {
      const success = await updateAdminUser(payload, editingUserId.value);
      if (success) {
        $toast.success('User updated successfully!');
        isModalOpen.value = false;
        await getPaginatedUsers();
      } else {
        $toast.error('Failed to update user');
      }
    } else {
      const success = await createAdminUser(payload);
      if (success) {
        $toast.success('User created successfully!');
        isModalOpen.value = false;
        await getPaginatedUsers();
      } else {
        $toast.error('Failed to create user');
      }
    }
  } catch (error) {
    console.error('Failed to save user:', error);
    $toast.error('An error occurred while saving the user');
  } finally {
    isSaving.value = false;
  }
}

const requestDelete = (id: string) => {
  userIdToDelete.value = id;
  isConfirmOpen.value = true;
}

const confirmDeleteUser = async () => {
  if (!userIdToDelete.value) return;
  isDeleting.value = true;
  try {
    const success = await deleteAdminUser(userIdToDelete.value);
    if (success) {
      $toast.success('User deleted successfully!');
      isConfirmOpen.value = false;
      await getPaginatedUsers();
    } else {
      $toast.error('Failed to delete user');
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    $toast.error('An error occurred while deleting the user');
  } finally {
    isDeleting.value = false;
    userIdToDelete.value = null;
  }
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1;
  getPaginatedUsers();
}, 300);

watch(() => filters.query, debouncedSearch);

watch([() => filters.userGroupId, () => filters.roleId, statusFilter], () => {
  filters.pageNo = 1;
  getPaginatedUsers();
});

watch(
  [() => form.value.firstName, () => form.value.lastName],
  ([firstName, lastName]) => {
    if (!form.value.username?.trim() && (firstName || lastName)) {
      form.value.username = generateUsername(firstName || '', lastName || '');
    }
  }
);

onMounted(async () => {
  document.addEventListener('click', closeDropdown);
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string) || 1;
    filters.pageSize = parseInt(route.query.pageSize as string) || 10;
    if (route.query.query) filters.query = route.query.query as string;
    
    if (route.query.userGroupId) {
      filterType.value = 'groups';
      filters.userGroupId = route.query.userGroupId as string;
    } else if (route.query.roleId) {
      filterType.value = 'roles';
      filters.roleId = route.query.roleId as string;
    }
    
    if (route.query.status) {
      statusFilter.value = route.query.status as string;
    }
  }
  
  await Promise.all([
    getGroupsList(),
    getRolesList(),
    getPaginatedUsers()
  ]);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 20px;
}
</style>