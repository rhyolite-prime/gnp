<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">User Groups</h1>
        <p class="mt-2 text-sm text-gray-600">Create functional teams, define hierarchical groupings, and map security roles to automate permission control.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all active:scale-[0.98]">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Group
        </button>
      </div>
    </div>

    <!-- Filters & Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search Input -->
      <div class="md:col-span-2 rounded-xl p-4 flex items-center bg-white shadow-sm ring-1 ring-gray-900/5">
        <div class="w-full relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input 
            type="text" 
            v-model="filters.query" 
            placeholder="Search group by title..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 sm:text-sm transition-all"
          />
        </div>
      </div>

      <!-- Quick Stats Card 1 -->
      <div class="rounded-xl p-4 bg-primary-50 border border-primary-100 flex flex-col justify-center shadow-sm">
        <div class="text-xs font-semibold text-primary-700 uppercase tracking-wider">Total User Groups</div>
        <div class="mt-1 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-gray-900">{{ groups.length }}</span>
          <span class="text-xs text-gray-500">defined structures</span>
        </div>
      </div>

      <!-- Quick Stats Card 2 -->
      <div class="rounded-xl p-4 bg-emerald-50 border border-emerald-200/50 flex flex-col justify-center shadow-sm">
        <div class="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Active Roles</div>
        <div class="mt-1 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-emerald-900">{{ roleList.length }}</span>
          <span class="text-xs text-emerald-600">available roles</span>
        </div>
      </div>
    </div>

    <!-- Groups Hierarchy Table -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:pl-6">
                Group Title
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Assigned Roles
              </th>
              <th scope="col" class="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                Permissions
              </th>
              <th scope="col" class="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                Created At
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="isLoading">
              <td colspan="5" class="py-10 text-center text-sm text-gray-500">Loading groups...</td>
            </tr>
            <tr v-for="group in visibleGroups" :key="group.id" class="hover:bg-gray-50/60 transition-colors">
              <!-- Group Title (Hierarchical display) -->
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <!-- Hierarchical Prefix -->
                  <span v-if="group.level && group.level > 0" class="text-gray-400 mr-1.5 font-medium tracking-wide select-none">
                    <span v-for="i in group.level" :key="i" class="inline-block">
                      {{ i === group.level ? '- ' : '⁝ ' }}
                    </span>
                  </span>
                  
                  <!-- Folder icon, arrow, and title -->
                  <div class="flex items-center gap-1.5">
                    <!-- Expandable toggle arrow -->
                    <button 
                      v-if="hasChildren(group.id)" 
                      type="button"
                      @click.stop="toggleGroupExpanded(group.id)"
                      class="text-gray-400 hover:text-primary-600 focus:outline-none transition-all duration-200 shrink-0 p-0.5 rounded hover:bg-primary-50 active:scale-95"
                    >
                      <ChevronDownIcon v-if="isGroupExpanded(group.id)" class="h-4 w-4" />
                      <ChevronRightIcon v-else class="h-4 w-4" />
                    </button>
                    <!-- Spacer when no children to align FolderIcon -->
                    <div v-else class="w-5 h-5 shrink-0" />

                    <FolderIcon class="h-5 w-5 text-primary-500/75 shrink-0" />
                    <span class="font-semibold text-primary-700">
                      {{ group.title }}
                    </span>
                  </div>
                </div>
              </td>
              
              <!-- Assigned Roles list -->
              <td class="px-3 py-4 text-sm">
                <div class="flex flex-wrap gap-1.5 max-w-sm sm:max-w-md">
                  <span 
                    v-for="role in group.roles" 
                    :key="(role as any).id"
                    class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/20"
                  >
                    {{ (role as any).name }}
                  </span>
                  <span 
                    v-if="!group.roles || group.roles.length === 0"
                    class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/10"
                  >
                    No roles assigned
                  </span>
                </div>
              </td>
              
              <!-- Total Unique Permissions Count -->
              <td class="whitespace-nowrap px-3 py-4 text-sm text-center">
                <span 
                  :class="[
                    'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset min-w-[32px]',
                    getGroupPermissionsCount(group) > 0 
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                      : 'bg-gray-100 text-gray-500 ring-gray-200'
                  ]"
                >
                  {{ getGroupPermissionsCount(group) }}
                </span>
              </td>
              
              <!-- Created At -->
              <td class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">
                {{ group.createdAt ? standardDateFormat(group.createdAt) : 'N/A' }}
              </td>
              
              <!-- Actions -->
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="flex items-center justify-end space-x-3">
                  <button 
                    @click="openEditModal(group)" 
                    title="Edit Group"
                    class="text-gray-400 hover:text-primary-600 transition-all p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <PencilSquareIcon class="h-5 w-5" />
                  </button>
                  <button 
                    @click="deleteGroup(group.id)" 
                    title="Delete Group"
                    class="text-gray-400 hover:text-red-600 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && sortedFilteredGroups.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <ShieldCheckIcon class="mx-auto h-14 w-14 text-gray-300 animate-pulse" />
                <h3 class="mt-4 text-sm font-semibold text-gray-900">No user groups found</h3>
                <p class="mt-1 text-sm text-gray-500">Define your first organizational user group to configure team settings.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

    <!-- Create/Edit Group Modal -->
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
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
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
              <DialogPanel class="relative transform rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl overflow-hidden">
                <!-- Modal Header -->
                <div class="bg-primary-600 px-6 py-5">
                  <div class="flex items-center justify-between">
                    <DialogTitle class="text-lg font-bold leading-6 text-white flex items-center gap-2">
                      <FolderIcon class="h-6 w-6 text-primary-200" />
                      {{ editingGroupId ? 'Edit User Group Details' : 'Create User Group' }}
                    </DialogTitle>
                    <button 
                      type="button" 
                      class="rounded-md text-primary-200 hover:text-white focus:outline-none transition-all p-1"
                      @click="closeModal"
                    >
                      <span class="sr-only">Close</span>
                      <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <p class="mt-1 text-sm text-primary-100">
                    Configure user group metadata, hierarchy structures, and assign core security roles with real-time permissions tracking.
                  </p>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="saveGroup" class="flex flex-col">
                  <div class="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <!-- Basic details grid -->
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <!-- Title input -->
                      <div class="sm:col-span-3">
                        <label class="block text-sm font-semibold leading-6 text-gray-900">Group Title <span class="text-red-500">*</span></label>
                        <div class="mt-1.5">
                          <input 
                            type="text" 
                            v-model="form.title" 
                            required 
                            placeholder="e.g. Editorial Team, Billing Admins"
                            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 sm:text-sm sm:leading-6 transition-all" 
                          />
                        </div>
                      </div>

                      <!-- Parent group selection -->
                      <div class="sm:col-span-3">
                        <label class="block text-sm font-semibold leading-6 text-gray-900">Parent Group (Hierarchy)</label>
                        <div class="mt-1.5">
                          <select 
                            v-model="form.parentId"
                            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 sm:text-sm sm:leading-6 transition-all"
                          >
                            <option value="">None (Top-Level Group)</option>
                            <option v-for="g in eligibleParents" :key="g.id" :value="g.id">
                              {{ getDropdownTitle(g) }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- Description input -->
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-semibold leading-6 text-gray-900">Description</label>
                        <div class="mt-1.5">
                          <textarea 
                            v-model="form.description"
                            rows="2"
                            placeholder="Brief description of this group's purpose..."
                            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 sm:text-sm sm:leading-6 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <!-- Roles Multiselect Dropdown -->
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-semibold leading-6 text-gray-900 mb-1.5">Assign Roles <span class="text-red-500">*</span></label>
                        <VueMultiselect
                          v-model="form.roles"
                          :options="roleList"
                          :multiple="true"
                          :close-on-select="false"
                          :clear-on-select="false"
                          :preserve-search="true"
                          placeholder="Select roles for this group..."
                          label="name"
                          track-by="id"
                          class="multiselect-custom shadow-sm"
                        >
                          <template #noResult>
                            <span class="text-xs text-gray-500">No matching roles found.</span>
                          </template>
                        </VueMultiselect>
                        <p class="mt-1.5 text-xs text-gray-500">You can assign multiple security roles to this group. Their permissions will be aggregated in real-time.</p>
                      </div>
                    </div>

                    <!-- Real-Time Permissions Visualiser -->
                    <div class="border-t border-gray-200 pt-6">
                      <div class="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm space-y-4">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-primary-50 rounded-lg text-primary-600">
                              <KeyIcon class="h-5 w-5" />
                            </div>
                            <div>
                              <h3 class="text-sm font-bold text-gray-900">Live Permissions Visualizer</h3>
                              <p class="text-[11px] text-gray-500">Aggregated real-time preview of security grants for the selected roles.</p>
                            </div>
                          </div>
                          
                          <!-- Summary Pill -->
                          <span 
                            v-if="form.roles.length > 0"
                            class="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700"
                          >
                            {{ totalUniquePermissionsCount }} unique permissions granted
                          </span>
                        </div>

                        <!-- Blank State -->
                        <div v-if="form.roles.length === 0" class="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                          <ShieldCheckIcon class="mx-auto h-10 w-10 text-gray-300" />
                          <p class="mt-2 text-xs text-gray-500 font-medium">Select one or more roles above to view the active permissions tied to them.</p>
                        </div>

                        <div v-else class="space-y-4">
                          <!-- Filters inside visualizer -->
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <!-- Search input -->
                            <div class="relative">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                              </div>
                              <input 
                                type="text" 
                                v-model="visualizerSearchQuery" 
                                placeholder="Search permissions by name..." 
                                class="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 text-xs transition-all"
                              />
                            </div>

                            <!-- Show only active permissions check -->
                            <div class="flex items-center justify-end">
                              <label class="relative flex items-center cursor-pointer select-none">
                                <input 
                                  type="checkbox" 
                                  v-model="showOnlyGranted" 
                                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
                                />
                                <span class="ml-2 text-xs font-medium text-gray-600">Show only granted permissions</span>
                              </label>
                            </div>
                          </div>

                          <!-- Tab Toggle -->
                          <div class="flex border-b border-gray-200">
                            <button 
                              type="button"
                              @click="visualizerTab = 'matrix'"
                              :class="[
                                'py-2 px-4 text-xs font-bold border-b-2 focus:outline-none transition-all',
                                visualizerTab === 'matrix' 
                                  ? 'border-primary-600 text-primary-600' 
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              ]"
                            >
                              Combined Permission Matrix
                            </button>
                            <button 
                              type="button"
                              @click="visualizerTab = 'role'"
                              :class="[
                                'py-2 px-4 text-xs font-bold border-b-2 focus:outline-none transition-all',
                                visualizerTab === 'role' 
                                  ? 'border-primary-600 text-primary-600' 
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              ]"
                            >
                              Permissions by Role
                            </button>
                          </div>

                          <!-- TAB 1: Combined Permission Matrix -->
                          <div v-if="visualizerTab === 'matrix'" class="space-y-4 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                            <div 
                              v-for="group in filteredPermissionGroups" 
                              :key="group.systemName" 
                              class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                            >
                              <!-- Group Header -->
                              <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                <div class="flex items-center gap-1.5">
                                  <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                                  <h4 class="text-xs font-bold text-gray-900">{{ group.friendlyName }}</h4>
                                </div>
                                <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                  {{ getActivePermissionCountInGroup(group) }} / {{ group.subPermissions.length }} active
                                </span>
                              </div>

                              <!-- Permissions Grid -->
                              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div 
                                  v-for="sub in group.subPermissions" 
                                  :key="sub.id"
                                  :class="[
                                    'p-3 rounded-lg border transition-all flex flex-col justify-between gap-1.5',
                                    isPermissionGranted(sub.systemName)
                                      ? 'bg-emerald-50/[0.3] border-emerald-500/25 shadow-sm shadow-emerald-500/5'
                                      : 'bg-gray-50/40 border-gray-200/70 opacity-40'
                                  ]"
                                >
                                  <div class="flex items-start gap-2">
                                    <div class="mt-0.5">
                                      <CheckIcon v-if="isPermissionGranted(sub.systemName)" class="h-3.5 w-3.5 text-emerald-600 font-bold" />
                                      <XMarkIcon v-else class="h-3.5 w-3.5 text-gray-300" />
                                    </div>
                                    <div>
                                      <span :class="['text-xs font-bold', isPermissionGranted(sub.systemName) ? 'text-gray-900' : 'text-gray-500']">
                                        {{ sub.friendlyName }}
                                      </span>
                                      <p class="text-[10px] text-gray-400 font-normal leading-normal mt-0.5">{{ sub.systemName }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Granting roles listing tags -->
                                  <div v-if="isPermissionGranted(sub.systemName)" class="flex flex-wrap items-center gap-1 mt-1 border-t border-dashed border-gray-100 pt-1.5">
                                    <span class="text-[9px] text-gray-400 mr-0.5">Granted by:</span>
                                    <span 
                                      v-for="role in getRolesGrantingPermission(sub.systemName)" 
                                      :key="(role as any).id"
                                      class="inline-flex items-center rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/10"
                                    >
                                      {{ (role as any).name }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-if="filteredPermissionGroups.length === 0" class="text-center py-6 text-xs text-gray-400">
                              No permissions match your search query.
                            </div>
                          </div>

                          <!-- TAB 2: Permissions by Role Cards -->
                          <div v-else class="space-y-4 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                            <div 
                              v-for="role in form.roles" 
                              :key="(role as any).id"
                              class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                            >
                              <!-- Role Info -->
                              <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                <div class="w-2.5 h-2.5 rounded-full bg-primary-500/80"></div>
                                <h4 class="text-xs font-bold text-gray-900">{{ (role as any).name }}</h4>
                              </div>
                              <p class="text-[10px] text-gray-500 italic mb-3">{{ getRoleDescription((role as any).id) }}</p>

                              <!-- Permissions list for this role -->
                              <div class="flex flex-wrap gap-1.5">
                                <span 
                                  v-for="permId in getFilteredPermissionsForRole((role as any).id)" 
                                  :key="permId"
                                  class="inline-flex items-center rounded bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 ring-1 ring-inset ring-primary-700/20"
                                >
                                  {{ getPermissionLabel(permId) }}
                                </span>
                                <span 
                                  v-if="getFilteredPermissionsForRole((role as any).id).length === 0"
                                  class="text-[10px] text-gray-400 italic"
                                >
                                  No matching permissions assigned or matches search query.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Modal Footer -->
                  <div class="flex flex-shrink-0 justify-end px-6 py-4 bg-gray-50 border-t border-gray-200 gap-3">
                    <button 
                      type="button" 
                      class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all active:scale-[0.98]" 
                      @click="closeModal"
                      :disabled="isSaving"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      :disabled="isSaving" 
                      class="inline-flex justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all disabled:opacity-70 active:scale-[0.98]"
                    >
                      <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isSaving ? 'Saving...' : (editingGroupId ? 'Save Changes' : 'Create Group') }}
                    </button>
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
      :show="isConfirmModalOpen"
      title="Delete User Group"
      message="Are you sure you want to delete this user group? Any sub-groups nested underneath it will have their parent link cleared. This action cannot be undone."
      confirm-text="Delete Group"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  XMarkIcon,
  FolderIcon,
  CheckIcon,
  KeyIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { isEmpty, debounce } from 'lodash-es'
import type { UserGroup, Role, Permission } from '~/models'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'User Groups | Graphic News Plus'
})

// ---- Data ----

const roleList = ref<Role[]>([])
const permissionList = ref<Permission[]>([])
const groups = ref<UserGroup[]>([])
const isLoading = ref(false)

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 1000,
})

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0,
})

// ---- Normalizer ----

const normalizeGroup = (g: any): UserGroup => {
  const pid = g.parentId || null
  return {
    id: g.id,
    title: g.title || '',
    parentId: pid,
    roles: g.roles || [],
    activeUsers: g.activeUsers ?? 0,
    blockedUsers: g.blockedUsers ?? 0,
    createdAt: g.created_at || g.createdAt || '',
    // BaseEntityModel fields
    path: g.path || '',
    modifiedAt: g.modified_at || g.modifiedAt || '',
    modifiedBy: g.modifiedBy || null,
  } as any
}

// ---- API Calls ----

const getPaginatedUserGroups = async () => {
  isLoading.value = true
  try {
    const result = await getUserGroups(filters)
    if (result) {
      const dataList = Array.isArray(result) 
        ? result 
        : (result.data && Array.isArray(result.data) 
            ? result.data 
            : (result.result && Array.isArray(result.result) ? result.result : []))
      
      const normalized = dataList.map(normalizeGroup)

      // Path-based hierarchy reconstruction fallback
      normalized.forEach((g: any) => {
        if (!g.parentId && g.path && g.path.includes('.')) {
          const pathParts = g.path.split('.')
          pathParts.pop()
          const parentPath = pathParts.join('.')
          const parent = normalized.find((p: any) => p.path === parentPath)
          if (parent) {
            g.parentId = parent.id
          }
        }
      })

      groups.value = [...normalized]

      if (Array.isArray(result)) {
        const totalCount = normalized.length
        paginationParams.totalCount = totalCount
        paginationParams.totalPages = 1
        paginationParams.lowerBound = totalCount === 0 ? 0 : 1
        paginationParams.upperBound = totalCount
      } else {
        paginationParams.totalPages = (result as any).totalPages || 1
        paginationParams.totalCount = (result as any).totalCount || 0
        paginationParams.lowerBound = (result as any).lowerBound || 0
        paginationParams.upperBound = (result as any).upperBound || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch groups:', error)
    $toast.error('Failed to load user groups')
  } finally {
    isLoading.value = false
  }
}

const getAllRoles = async () => {
  try {
    const data = await getAdminRoles({ pageNo: 1, pageSize: 1000 })
    if (data && data.data && data.data.length > 0) {
      roleList.value = data.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        permissions: r.permissions || []
      }))
    }
  } catch (error) {
    console.warn('Failed to load roles', error)
  }
}

const getPermissions = async () => {
  try {
    permissionList.value = await getAdminPermissions()
  } catch (error) {
    console.warn('Failed to load permissions', error)
  }
}

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber
  const filteredQuery = filterQueryParams({ ...route.query, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await getPaginatedUserGroups()
}

// ---- Debounced search ----

const debouncedSearch = debounce(() => {
  filters.pageNo = 1
  getPaginatedUserGroups()
}, 300)

watch(() => filters.query, debouncedSearch)

// ---- Tree / Hierarchy ----

const sortedFilteredGroups = computed(() => {
  const result: (UserGroup & { level: number })[] = []
  
  const buildTree = (parentId: string | null, currentLevel: number) => {
    const children = groups.value.filter((g: any) => {
      const pid = g.parentId
      if (parentId === null) {
        return !pid || pid === ''
      }
      return pid === parentId
    })
    children.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''))
    
    for (const child of children) {
      result.push({ ...child, level: currentLevel })
      buildTree(child.id, currentLevel + 1)
    }
  }
  
  buildTree(null, 0)
  
  // Safety fallback for orphaned groups
  const renderedIds = new Set(result.map(g => g.id))
  for (const g of groups.value) {
    if (!renderedIds.has(g.id)) {
      result.push({ ...g, level: 0 })
    }
  }

  // Filter by search query
  const query = filters.query.trim().toLowerCase()
  if (!query) return result
  return result.filter(g =>
    (g.title || '').toLowerCase().includes(query) ||
    ((g as any).path && (g as any).path.toLowerCase().includes(query))
  )
})

// ---- Expand/Collapse ----

const expandedGroups = ref<Record<string, boolean>>({})

const toggleGroupExpanded = (groupId: string) => {
  expandedGroups.value[groupId] = !isGroupExpanded(groupId)
}

const hasChildren = (groupId: string) => {
  return groups.value.some((g: any) => g.parentId === groupId)
}

const isGroupExpanded = (groupId: string) => {
  return expandedGroups.value[groupId] !== false // default expanded
}

const isGroupVisible = (group: UserGroup) => {
  if (filters.query.trim()) return true
  
  let currParentId = (group as any).parentId
  const visited = new Set<string>()
  
  while (currParentId && !visited.has(currParentId)) {
    visited.add(currParentId)
    if (expandedGroups.value[currParentId] === false) {
      return false
    }
    const parent = groups.value.find((g: any) => g.id === currParentId) as any
    currParentId = parent ? parent.parentId : null
  }
  
  return true
}

const visibleGroups = computed(() => {
  return sortedFilteredGroups.value.filter(isGroupVisible)
})

// ---- Permissions counting ----

const getGroupPermissionsCount = (group: UserGroup) => {
  const uniquePermissions = new Set<string>()
  for (const groupRole of (group.roles as any[])) {
    const fullRole = roleList.value.find(r => r.id === groupRole.id)
    if (fullRole && fullRole.permissions) {
      fullRole.permissions.forEach(p => uniquePermissions.add(p))
    }
  }
  return uniquePermissions.size
}

// ---- Modal state ----

const isModalOpen = ref(false)
const isSaving = ref(false)
const editingGroupId = ref<string | null>(null)

const form = ref({
  title: '',
  description: '',
  parentId: '',
  roles: [] as { id: string; name: string }[]
})

// ---- Eligible parents (prevent recursive hierarchy) ----

const eligibleParents = computed(() => {
  if (!editingGroupId.value) {
    return groups.value
  }
  
  const descendantIds = new Set<string>()
  const gatherDescendants = (parentId: string) => {
    const children = groups.value.filter((g: any) => g.parentId === parentId)
    children.forEach((child: any) => {
      descendantIds.add(child.id)
      gatherDescendants(child.id)
    })
  }
  
  gatherDescendants(editingGroupId.value)
  return groups.value.filter((g: any) => g.id !== editingGroupId.value && !descendantIds.has(g.id))
})

// ---- Permission Visualiser ----

const visualizerSearchQuery = ref('')
const showOnlyGranted = ref(false)
const visualizerTab = ref<'matrix' | 'role'>('matrix')

const activeSelectedPermissions = computed(() => {
  const unique = new Set<string>()
  form.value.roles.forEach(r => {
    const fullRole = roleList.value.find(x => x.id === r.id)
    if (fullRole && fullRole.permissions) {
      fullRole.permissions.forEach(p => unique.add(p))
    }
  })
  return unique
})

const totalUniquePermissionsCount = computed(() => activeSelectedPermissions.value.size)

const isPermissionGranted = (systemName: string) => activeSelectedPermissions.value.has(systemName)

const getRolesGrantingPermission = (systemName: string) => {
  return form.value.roles.filter(r => {
    const fullRole = roleList.value.find(x => x.id === r.id)
    return fullRole && fullRole.permissions && fullRole.permissions.includes(systemName)
  })
}

const filteredPermissionGroups = computed(() => {
  const searchQueryLower = visualizerSearchQuery.value.trim().toLowerCase()
  
  return permissionList.value.map(group => {
    const matchedPerms = group.subPermissions.filter(sub => {
      const matchesSearch = !searchQueryLower || 
        sub.friendlyName.toLowerCase().includes(searchQueryLower) || 
        sub.systemName.toLowerCase().includes(searchQueryLower)
        
      const matchesGranted = !showOnlyGranted.value || isPermissionGranted(sub.systemName)
      
      return matchesSearch && matchesGranted
    })

    return {
      ...group,
      subPermissions: matchedPerms
    }
  }).filter(group => group.subPermissions.length > 0)
})

const getActivePermissionCountInGroup = (group: Permission) => {
  return group.subPermissions.filter(sub => isPermissionGranted(sub.systemName)).length
}

const getRoleDescription = (roleId: string) => {
  const full = roleList.value.find(r => r.id === roleId)
  return full ? full.description : 'No description available.'
}

const getPermissionLabel = (systemName: string) => {
  for (const group of permissionList.value) {
    if (group.systemName === systemName) return group.friendlyName;
    const matched = group.subPermissions.find(s => s.systemName === systemName)
    if (matched) return matched.friendlyName
  }
  return systemName
}

const getFilteredPermissionsForRole = (roleId: string) => {
  const full = roleList.value.find(r => r.id === roleId)
  if (!full || !full.permissions) return []
  
  const searchQueryLower = visualizerSearchQuery.value.trim().toLowerCase()
  if (!searchQueryLower) return full.permissions

  return full.permissions.filter(permId => {
    const label = getPermissionLabel(permId).toLowerCase()
    return label.includes(searchQueryLower) || permId.includes(searchQueryLower)
  })
}

// ---- Modal actions ----

const openCreateModal = () => {
  editingGroupId.value = null
  form.value = { title: '', description: '', parentId: '', roles: [] }
  visualizerSearchQuery.value = ''
  showOnlyGranted.value = false
  visualizerTab.value = 'matrix'
  isModalOpen.value = true
}

const openEditModal = (group: UserGroup) => {
  editingGroupId.value = group.id
  form.value = {
    title: group.title,
    description: (group as any).description || '',
    parentId: (group as any).parentId || '',
    roles: (group.roles as any[]).map(r => {
      const full = roleList.value.find(x => x.id === r.id)
      return full ? { id: full.id, name: full.name } : { id: r.id, name: r.name }
    })
  }
  visualizerSearchQuery.value = ''
  showOnlyGranted.value = false
  visualizerTab.value = 'matrix'
  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

// ---- Save ----

const saveGroup = async () => {
  if (!form.value.title.trim()) {
    $toast.warning('Group title is required')
    return
  }
  if (form.value.roles.length === 0) {
    $toast.warning('At least one role must be assigned to the group')
    return
  }

  isSaving.value = true

  // Build payload matching UserGroupDto exactly
  const payload = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    parentId: form.value.parentId || null,
    roles: form.value.roles.map(r => ({ id: r.id, name: r.name })),
  }

  try {
    if (editingGroupId.value) {
      await updateUserGroup(payload, editingGroupId.value)
      $toast.success('User group updated successfully')
    } else {
      await createUserGroup(payload)
      $toast.success('User group created successfully')
    }
    isModalOpen.value = false
    await getPaginatedUserGroups()
  } catch (error) {
    console.error('Error saving group:', error)
    $toast.error('An error occurred while saving the group.')
  } finally {
    isSaving.value = false
  }
}

// ---- Delete ----

const isConfirmModalOpen = ref(false)
const isDeleting = ref(false)
const groupIdToDelete = ref<string | null>(null)

const deleteGroup = (id: string) => {
  groupIdToDelete.value = id
  isConfirmModalOpen.value = true
}

const confirmDelete = async () => {
  if (!groupIdToDelete.value) return

  isDeleting.value = true
  try {
    await deleteUserGroup(groupIdToDelete.value)
    $toast.success('User group deleted successfully')
    await getPaginatedUserGroups()
  } catch (error) {
    console.error('Error deleting group:', error)
    $toast.error('An error occurred while deleting the group')
  } finally {
    isDeleting.value = false
    isConfirmModalOpen.value = false
    groupIdToDelete.value = null
  }
}

// ---- Dropdown helpers ----

const getDropdownTitle = (group: UserGroup) => {
  const pid = (group as any).parentId
  if (!pid) {
    return group.title
  }
  
  const parts: string[] = []
  let curr: any = group
  const visited = new Set<string>()
  
  while (curr && !visited.has(curr.id)) {
    visited.add(curr.id)
    parts.unshift(curr.title)
    const nextPid = curr.parentId
    curr = nextPid ? groups.value.find((p: any) => p.id === nextPid) : undefined
  }
  
  return parts.join(' > ')
}

// ---- Lifecycle ----

onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = route.query.pageNo ? parseInt(route.query.pageNo as string) : 1
    filters.query = route.query.query ? (route.query.query as string) : ''
  }
  await getPermissions()
  await getAllRoles()
  await getPaginatedUserGroups()
})
</script>

<style>
/* Vue Multiselect custom styling */
.multiselect-custom .multiselect__tags {
  @apply min-h-[42px] border-gray-300 rounded-lg pt-1.5 focus-within:ring-2 focus-within:ring-primary-600/20 focus-within:border-primary-600 transition-all shadow-sm;
}
.multiselect-custom .multiselect__select {
  @apply h-[40px] pt-1;
}
.multiselect-custom .multiselect__placeholder {
  @apply text-gray-400 text-sm pl-1 pt-0.5;
}
.multiselect-custom .multiselect__single {
  @apply text-gray-900 text-sm pl-1 pt-0.5;
}
.multiselect-custom .multiselect__input {
  @apply text-sm pl-1 pt-0.5 focus:outline-none;
}
.multiselect-custom .multiselect__tag {
  @apply bg-primary-50 text-primary-700 text-xs font-semibold rounded-md pl-2.5 pr-8 py-1 ring-1 ring-primary-700/20 mr-1.5 mb-1.5 relative inline-block;
}
.multiselect-custom .multiselect__tag-icon {
  @apply absolute right-0 top-0 bottom-0 w-6 text-primary-700 hover:bg-primary-100 rounded-r-md transition-colors text-center font-bold flex items-center justify-center cursor-pointer;
  line-height: 22px;
}
.multiselect-custom .multiselect__tag-icon::after {
  @apply text-primary-700 font-bold text-sm;
  content: "×";
}
.multiselect-custom .multiselect__content-wrapper {
  @apply border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto bg-white mt-1 border focus:outline-none z-50;
}
.multiselect-custom .multiselect__option--highlight {
  @apply bg-primary-600 text-white;
}
.multiselect-custom .multiselect__option--highlight::after {
  @apply bg-primary-600 text-white;
}
.multiselect-custom .multiselect__option--selected {
  @apply bg-primary-50 text-primary-700 font-semibold;
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