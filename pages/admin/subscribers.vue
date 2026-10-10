<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Subscribers</h1>
        <p class="mt-2 text-sm text-gray-700">Manage and monitor all subscribers and their subscription packages</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none" v-if="hasPermission('subscribers.create')">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Add Subscriber
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
        {{ showFilters ? 'Hide filters' : 'Show filters' }}
      </button>
    </div>

    <!-- Filters -->
    <div v-show="showFilters" class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
      <!-- Search -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            v-model="filters.query"
            class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search subscribers..."
          />
        </div>
      </div>

      <!-- Date Joined Date Range Filter -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
        <div class="flex items-center space-x-2 bg-white rounded-md ring-1 ring-inset ring-gray-300 px-2 py-1 shadow-sm">
          <input
            type="date"
            v-model="filters.dateJoinedStartDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Start Date"
          />
          <span class="text-gray-400 text-sm">to</span>
          <input
            type="date"
            v-model="filters.dateJoinedEndDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="End Date"
          />
        </div>
      </div>

      <!-- Last Active Date Range Filter -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
        <div class="flex items-center space-x-2 bg-white rounded-md ring-1 ring-inset ring-gray-300 px-2 py-1 shadow-sm">
          <input
            type="date"
            v-model="filters.lastActiveStartDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Start Date"
          />
          <span class="text-gray-400 text-sm">to</span>
          <input
            type="date"
            v-model="filters.lastActiveEndDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="End Date"
          />
        </div>
      </div>

      <!-- Account Type Filter -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
        <select v-model="filters.accountType" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="">All Accounts</option>
          <option value="partner">Partner Account</option>
          <option value="affiliate">Affiliate Account</option>
          <option value="regular">Regular Account</option>
        </select>
      </div>

      <!-- Filter Actions -->
      <div class="flex items-end gap-2">
        <button
          @click="applyFilters"
          type="button"
          class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex-1"
        >
          Search
        </button>
        <button
          @click="resetFilters"
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-1"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Subscriber List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-visible min-h-[450px]">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Joined</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Active</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Account Type</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="isShimmerLoading" class="animate-pulse">
            <td colspan="8" class="px-3 py-10 text-center text-sm text-gray-500">
              <div class="flex justify-center items-center space-x-2">
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </td>
          </tr>

          <tr v-else-if="subscriberList.length === 0">
            <td colspan="8" class="px-3 py-10 text-center text-gray-500">
              <p class="text-sm">No subscribers found.</p>
              <button @click="openCreateModal" class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">Add a subscriber to get started</button>
            </td>
          </tr>

          <tr v-else v-for="(sub, index) in subscriberList" :key="sub.id" class="hover:bg-gray-50 transition-colors">
            <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{{ sub.firstName }} {{ sub.lastName }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.email }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.phoneNumber || 'N/A' }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longDateAndTimeFormat(sub.createdAt) }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longDateAndTimeFormat(sub.lastActive) }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="badgeClass(sub)"
              >
                {{ badgeLabel(sub) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="{
                  'bg-green-50 text-green-700 ring-green-600/20': sub.isActive,
                  'bg-red-50 text-red-700 ring-red-600/20': !sub.isActive
                }">
                {{ sub.isActive ? 'Active' : 'In Active' }}
              </span>
            </td>

            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="relative dropdown-container flex justify-end">
                <button
                  @click.stop="toggleDropdown(sub.id)"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <EllipsisVerticalIcon class="h-5 w-5" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="activeDropdownId === sub.id"
                  class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                  :class="index > 3 && index > subscriberList.length - 4 ? 'bottom-full mb-2' : 'top-full mt-2'"
                >
                  <div class="py-1">
                    <button
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="openDetailModal(sub)"
                    >
                      View Details
                    </button>

                    <button
                      v-if="!sub.subscriptionPlanId"
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="initAssignSubscription(sub)"
                    >
                      Assign Subscription
                    </button>

                    <button
                      v-if="sub.subscriptionPlanId"
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="initAssignSubscription(sub)"
                    >
                      Modify Subscription
                    </button>

                    <button
                      v-if="!sub.isActive"
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="handleUpdateSubscriberStatus(sub.id, 'active')"
                    >
                      Activate
                    </button>

                    <button
                      v-if="sub.isActive"
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="handleUpdateSubscriberStatus(sub.id, 'inactive')"
                    >
                      Deactivate
                    </button>

                    <button
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      @click.prevent="handleResetPassword(sub.id)"
                    >
                      Reset Password
                    </button>

                    <button
                      class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      @click.prevent="confirmRemoveSubscriber(sub)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <client-only>
        <SimplePagination
          :lower-bound="paginationParams.lowerBound"
          :upper-bound="paginationParams.upperBound"
          @on-page-changed="onPageChange"
          :page-no="filters.pageNo"
          :total-pages="paginationParams.totalPages"
          :total-count="paginationParams.totalCount"
          :disabled="isShimmerLoading"
        />
      </client-only>
    </div>

    <!-- Add Subscriber Modal (2-step wizard) -->
    <AdminSubscriberModal
      v-if="showCreateModal"
      @close="closeCreateModal"
      @save="handleCreateSubscriber"
      :loading="isCreatingSubscriber"
    />

    <!-- Assign / Modify Subscription Modal -->
    <PartnerSubscriptionModal
      v-if="showAssignModal"
      @close="closeAssignModal"
      @assign="handleAssignSubscription"
      :loading="isAssigning"
      :subscriber="selectedSubscriber"
    />

    <!-- Subscriber Detail / Subscription History Modal -->
    <AdminSubscriberSubscriptionModal
      :show="showDetailModal"
      :subscriber="selectedSubscriber"
      @close="closeDetailModal"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteConfirmModal"
      title="Delete Subscriber"
      message="Are you sure you want to delete this subscriber? This action cannot be undone."
      confirm-text="Delete Subscriber"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeletingSubscriber"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, EllipsisVerticalIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from 'lodash-es'
import type { Subscriber } from '~/models'
const { hasPermission } = usePermissions();
const { $toast } = useNuxtApp()

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Subscribers | Graphic News Plus'
})

const router = useRouter()
const route = useRoute()

// ─── Filters ───────────────────────────────────────────────────────────────
const showFilters = ref(false)

const filters = reactive({
  query: '',
  accountType: '',
  dateJoinedStartDate: '',
  dateJoinedEndDate: '',
  lastActiveStartDate: '',
  lastActiveEndDate: '',
  pageNo: 1,
  pageSize: 30,
})

// ─── Pagination ─────────────────────────────────────────────────────────────
const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
})

// ─── List State ─────────────────────────────────────────────────────────────
const subscriberList = ref<Subscriber[]>([])
const isShimmerLoading = ref(true)

// ─── Dropdown ───────────────────────────────────────────────────────────────
const activeDropdownId = ref<string | null>(null)

const toggleDropdown = (id: string) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

const closeDropdown = () => {
  activeDropdownId.value = null
}

onMounted(() => {
  document.addEventListener('click', (e: any) => {
    if (!e.target.closest('.dropdown-container')) {
      closeDropdown()
    }
  })
})

// ─── Fetch Subscribers ───────────────────────────────────────────────────────
const getPaginatedSubscribers = async () => {
  isShimmerLoading.value = true
  try {
    const result = await getSubscribers(filters)
    subscriberList.value = result.data
    paginationParams.totalPages = result.totalPages
    paginationParams.totalCount = result.totalCount
    paginationParams.lowerBound = result.lowerBound
    paginationParams.upperBound = result.upperBound
  } catch (error) {
    $toast.error('Unable to fetch subscribers!')
  } finally {
    isShimmerLoading.value = false
  }
}

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber
  const filteredQuery = filterQueryParams({ ...route.query, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await getPaginatedSubscribers()
}

const applyFilters = async () => {
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await getPaginatedSubscribers()
}

const resetFilters = async () => {
  filters.query = ''
  filters.accountType = ''
  filters.dateJoinedStartDate = ''
  filters.dateJoinedEndDate = ''
  filters.lastActiveStartDate = ''
  filters.lastActiveEndDate = ''
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await getPaginatedSubscribers()
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1
  getPaginatedSubscribers()
}, 300)

watch(() => filters.query, debouncedSearch)

// ─── Badge Helpers ───────────────────────────────────────────────────────────
const badgeClass = (sub: Subscriber) => {
  if (sub.affiliateId) return 'bg-green-50 text-green-700 ring-green-600/20'
  if (sub.partnerId) return 'bg-blue-50 text-blue-700 ring-blue-600/20'
  return 'bg-gray-50 text-gray-700 ring-gray-600/20'
}

const badgeLabel = (sub: Subscriber) => {
  if (sub.affiliateId) return 'Affiliate Account'
  if (sub.partnerId) return 'Partner Account'
  return 'Regular Account'
}

// ─── Create Subscriber (2-step wizard) ──────────────────────────────────────
const showCreateModal = ref(false)
const isCreatingSubscriber = ref(false)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}


const handleCreateSubscriber = async (subscriberData: any) => {
  isCreatingSubscriber.value = true
  console.log('subscriberData->', subscriberData);
  try {
    const success = await createSubscriber(subscriberData)
    if (success) {
      $toast.success(`Subscriber created successfully. A welcome email has been sent to ${subscriberData.email}.`)
      closeCreateModal()
      await getPaginatedSubscribers()
    } else {
      $toast.error('Failed to create subscriber')
    }
  } catch (error: any) {
    console.error('Error creating subscriber:', error)
    $toast.error('An error occurred while creating the subscriber')
  } finally {
    isCreatingSubscriber.value = false
  }
}

// ─── Assign / Modify Subscription ───────────────────────────────────────────
const showAssignModal = ref(false)
const isAssigning = ref(false)
const selectedSubscriber = ref<Subscriber | null>(null)

const initAssignSubscription = (subscriber: Subscriber) => {
  selectedSubscriber.value = subscriber
  showAssignModal.value = true
  closeDropdown()
}

const closeAssignModal = () => {
  showAssignModal.value = false
  setTimeout(() => { selectedSubscriber.value = null }, 300)
}

const handleAssignSubscription = async (planData: any) => {
  if (!selectedSubscriber.value) return

  isAssigning.value = true
  try {
    const payload = {
      subscriberId: selectedSubscriber.value.id,
      planId: planData.planId,
      billingCycle: planData.billingCycle,
      planName: planData.planName,
      price: planData.price,
      // 'replace' | 'extend' | undefined (new assignment when no prior plan)
      action: planData.action || '',
    }

    console.log('payload->', payload);
 

    const success = await assignSubscriptionToSubscriber(payload)
    if (success) {
      const actionLabel =
        planData.action === 'replace' ? 'replaced' :
        planData.action === 'extend'  ? 'extended' : 'assigned'
      $toast.success(`Subscription plan ${actionLabel} successfully for ${selectedSubscriber.value.firstName} ${selectedSubscriber.value.lastName}.`)
      closeAssignModal()
      await getPaginatedSubscribers()
    } else {
      $toast.error('Failed to update subscription plan')
    }
  } catch (error) {
    console.error('Error assigning subscription:', error)
    $toast.error('An error occurred while updating the subscription plan')
  } finally {
    isAssigning.value = false
  }
}

// ─── View Subscription Details ───────────────────────────────────────────────
const showDetailModal = ref(false)

const openDetailModal = (subscriber: Subscriber) => {
  selectedSubscriber.value = subscriber
  showDetailModal.value = true
  closeDropdown()
}

const closeDetailModal = () => {
  showDetailModal.value = false
  setTimeout(() => { selectedSubscriber.value = null }, 300)
}

// ─── Activate / Deactivate Subscriber ────────────────────────────────────────
const handleUpdateSubscriberStatus = async (subscriberId: string, status: string) => {
  closeDropdown()
  try {
    const success = await updateSubscriberStatus({ subscriberId, status })
    if (success) {
      $toast.success(`Subscriber ${status === 'Active' ? 'activated' : 'deactivated'} successfully`)
      await getPaginatedSubscribers()
    } else {
      $toast.error('Failed to update subscriber status')
    }
  } catch (error) {
    $toast.error('An error occurred while updating subscriber status')
  }
}

// ─── Reset Password ──────────────────────────────────────────────────────────
const handleResetPassword = async (subscriberId: string) => {
  closeDropdown()
  try {
    const success = await resetStandardSubscriberPassword(subscriberId)
    if (success) {
      $toast.success('Subscriber password reset successfully')
    } else {
      $toast.error('Failed to reset subscriber password')
    }
  } catch (error) {
    $toast.error('An error occurred while resetting subscriber password')
  }
}

// ─── Delete Subscriber ───────────────────────────────────────────────────────
const showDeleteConfirmModal = ref(false)
const isDeletingSubscriber = ref(false)
const subscriberToDelete = ref<Subscriber | null>(null)

const confirmRemoveSubscriber = (subscriber: Subscriber) => {
  subscriberToDelete.value = subscriber
  showDeleteConfirmModal.value = true
  closeDropdown()
}

const handleConfirmDelete = async () => {
  if (!subscriberToDelete.value) return
  isDeletingSubscriber.value = true
  try {
    const success = await deleteSubscriber(subscriberToDelete.value.id)
    if (success) {
      $toast.success('Subscriber deleted successfully')
      showDeleteConfirmModal.value = false
      await getPaginatedSubscribers()
    } else {
      $toast.error('Failed to delete subscriber')
    }
  } catch (error) {
    $toast.error('An error occurred while deleting the subscriber')
  } finally {
    isDeletingSubscriber.value = false
    subscriberToDelete.value = null
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!isEmpty(route.query)) {
    filters.pageNo = parseInt(route.query.pageNo as string) || 1
  }
  await getPaginatedSubscribers()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>