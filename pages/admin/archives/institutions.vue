<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Enterprise Subscribers
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Onboard and approve enterprise organizations, onboard their users, and assign subscription packages
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 cursor-pointer"
          @click="openOnboardModal"
        >
          Onboard Enterprise
        </button>
      </div>
    </div>

    <!-- Summary Chips -->
    <div class="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Total Enterprises</p>
        <p class="mt-1 text-xl font-bold text-gray-900">{{ toNumber(totals.all) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Pending Approval</p>
        <p class="mt-1 text-xl font-bold text-amber-700">{{ toNumber(totals.pending) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Active</p>
        <p class="mt-1 text-xl font-bold text-green-700">{{ toNumber(totals.active) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Enrolled Seats</p>
        <p class="mt-1 text-xl font-bold text-primary-700">{{ toNumber(totals.enrolled) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
      <div class="w-full sm:max-w-xs">
        <div class="relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            v-model="filters.query"
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search organization or contact..."
          />
        </div>
      </div>

      <select
        v-model="filters.status"
        class="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:w-auto"
      >
        <option value="">All Statuses</option>
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <select
        v-model="filters.packageId"
        class="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:w-auto"
      >
        <option value="">All Packages</option>
        <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">{{ pkg.name }}</option>
      </select>

      <button
        type="button"
        class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer sm:w-auto"
        @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <!-- Enterprise List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-visible min-h-[420px]">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Organization</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Package</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Users</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Onboarded</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="isShimmerLoading" class="animate-pulse">
            <td colspan="7" class="px-3 py-10 text-center text-sm text-gray-500">
              <div class="flex justify-center items-center space-x-2">
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </td>
          </tr>

          <tr v-else-if="enterpriseList.length === 0">
            <td colspan="7" class="px-3 py-10 text-center text-gray-500">
              <p class="text-sm">No enterprise subscribers match the current filters.</p>
              <button
                type="button"
                class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium cursor-pointer"
                @click="openOnboardModal"
              >
                Onboard an enterprise to get started
              </button>
            </td>
          </tr>

          <tr v-else v-for="(ent, index) in enterpriseList" :key="ent.id" class="hover:bg-gray-50 transition-colors">
            <!-- Organization -->
            <td class="px-3 py-4 text-sm">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3"
                  :style="{ background: accountTypeColor(ent.accountType) }"
                >
                  {{ orgInitials(ent.organizationName) }}
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-gray-900 truncate max-w-[220px]" :title="ent.organizationName">
                    {{ ent.organizationName }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ accountTypeLabel(ent.accountType) }}
                    <span v-if="ent.region"> · {{ ent.region }}</span>
                  </p>
                </div>
              </div>
            </td>

            <!-- Contact -->
            <td class="px-3 py-4 text-sm text-gray-500">
              <p class="font-medium text-gray-800">{{ ent.contactName }}</p>
              <p class="text-xs text-gray-400">{{ ent.contactEmail }}</p>
            </td>

            <!-- Package -->
            <td class="px-3 py-4 text-sm text-gray-500">
              <template v-if="ent.packageName">
                <p class="font-medium text-gray-800">{{ ent.packageName }}</p>
                <p class="text-xs text-gray-400 capitalize">{{ ent.billingCycle }}</p>
              </template>
              <span v-else class="text-xs italic text-gray-400">Not assigned</span>
            </td>

            <!-- Users -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <p class="font-semibold text-gray-800">
                {{ ent.enrolledUsers }}
                <span class="text-gray-400 font-normal">/ {{ ent.subscriberQuota || '—' }}</span>
              </p>
              <div v-if="ent.subscriberQuota" class="mt-1 h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="usagePct(ent) >= 90 ? 'bg-red-500' : 'bg-primary-600'"
                  :style="{ width: Math.min(usagePct(ent), 100) + '%' }"
                />
              </div>
            </td>

            <!-- Status -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="statusBadgeClass(ent.status)"
              >
                {{ statusLabel(ent.status) }}
              </span>
            </td>

            <!-- Onboarded -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ longDateFormat(ent.createdAt) }}
            </td>

            <!-- Actions -->
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="relative dropdown-container flex justify-end">
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  @click.stop="toggleDropdown(ent.id)"
                >
                  <EllipsisVerticalIcon class="h-5 w-5" />
                </button>

                <div
                  v-if="activeDropdownId === ent.id"
                  class="absolute right-0 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                  :class="index > 2 && index > enterpriseList.length - 3 ? 'bottom-full mb-2' : 'top-full mt-2'"
                >
                  <div class="py-1">
                    <button
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                      @click.prevent="openDetailsModal(ent)"
                    >
                      View Details
                    </button>

                    <button
                      v-if="ent.status === 'pending'"
                      class="block w-full px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 text-left cursor-pointer font-medium"
                      @click.prevent="confirmApprove(ent)"
                    >
                      Approve Enterprise
                    </button>

                    <button
                      v-if="ent.status === 'pending'"
                      class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer"
                      @click.prevent="confirmReject(ent)"
                    >
                      Reject Application
                    </button>

                    <template v-if="ent.status === 'active'">
                      <button
                        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                        :disabled="remainingSeats(ent) === 0"
                        :class="remainingSeats(ent) === 0 ? 'opacity-40 cursor-not-allowed' : ''"
                        @click.prevent="openUsersModal(ent, 'manual')"
                      >
                        Onboard Users (Manual)
                      </button>
                      <button
                        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                        :disabled="remainingSeats(ent) === 0"
                        :class="remainingSeats(ent) === 0 ? 'opacity-40 cursor-not-allowed' : ''"
                        @click.prevent="openUsersModal(ent, 'csv')"
                      >
                        Onboard Users (CSV Upload)
                      </button>
                    </template>

                    <button
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                      @click.prevent="openPackageModal(ent)"
                    >
                      Assign Subscription Package
                    </button>

                    <button
                      v-if="ent.status === 'active'"
                      class="block w-full px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 text-left cursor-pointer"
                      @click.prevent="confirmSuspend(ent)"
                    >
                      Suspend
                    </button>

                    <button
                      v-if="ent.status === 'suspended'"
                      class="block w-full px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 text-left cursor-pointer"
                      @click.prevent="handleReinstate(ent)"
                    >
                      Reinstate
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

    <!-- Onboard Enterprise Wizard -->
    <EnterpriseOnboardModal v-if="showOnboardModal" @close="showOnboardModal = false" @save="handleCreateEnterprise" />

    <!-- Onboard Users (Manual / CSV) -->
    <EnterpriseUsersModal
      v-if="showUsersModal"
      :enterprise="selectedEnterprise"
      :mode="usersModalMode"
      @close="showUsersModal = false"
      @done="handleUsersOnboarded"
    />

    <!-- Assign Package -->
    <EnterprisePackageModal
      v-if="showPackageModal"
      :enterprise="selectedEnterprise"
      @close="showPackageModal = false"
      @assign="handleAssignPackage"
    />

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal && selectedEnterprise"
      class="relative z-50"
      aria-labelledby="details-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                @click="showDetailsModal = false"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div class="flex items-center gap-3">
              <div
                class="h-11 w-11 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                :style="{ background: accountTypeColor(selectedEnterprise.accountType) }"
              >
                {{ orgInitials(selectedEnterprise.organizationName) }}
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900" id="details-title">
                  {{ selectedEnterprise.organizationName }}
                </h3>
                <span
                  class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                  :class="statusBadgeClass(selectedEnterprise.status)"
                >
                  {{ statusLabel(selectedEnterprise.status) }}
                </span>
              </div>
            </div>

            <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Contact</dt>
                <dd class="text-sm text-gray-900">{{ selectedEnterprise.contactName }}</dd>
                <dd class="text-xs text-gray-500">{{ selectedEnterprise.contactEmail }}</dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Phone</dt>
                <dd class="text-sm text-gray-900">{{ selectedEnterprise.contactPhone || '—' }}</dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Account Type</dt>
                <dd class="text-sm text-gray-900">{{ accountTypeLabel(selectedEnterprise.accountType) }}</dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Region</dt>
                <dd class="text-sm text-gray-900">{{ selectedEnterprise.region || '—' }}</dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Package</dt>
                <dd class="text-sm text-gray-900">{{ selectedEnterprise.packageName || 'Not assigned' }}</dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Seats</dt>
                <dd class="text-sm text-gray-900">{{ selectedEnterprise.enrolledUsers }} / {{ selectedEnterprise.subscriberQuota || '—' }}</dd>
              </div>
              <div v-if="selectedEnterprise.rejectionReason" class="col-span-2">
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Rejection Reason</dt>
                <dd class="text-sm text-red-700">{{ selectedEnterprise.rejectionReason }}</dd>
              </div>
            </dl>

            <!-- Recent onboarded users -->
            <div v-if="recentUsers.length" class="mt-4">
              <h4 class="text-xs font-semibold uppercase tracking-wide text-gray-500">Recently Onboarded Users</h4>
              <ul class="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200">
                <li v-for="u in recentUsers" :key="u.id" class="flex items-center justify-between px-3 py-2">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ u.firstName }} {{ u.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ u.email }}</p>
                  </div>
                  <span
                    class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset"
                    :class="u.source === 'csv' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/20'"
                  >
                    {{ u.source === 'csv' ? 'CSV' : 'Manual' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal (approve / reject / suspend) -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :type="confirmState.type"
      :loading="isConfirming"
      @confirm="handleConfirmAction"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash-es'
import {
  fetchEnterprises,
  fetchEnterpriseUsers,
  onboardEnterprise,
  approveEnterpriseById,
  rejectEnterpriseById,
  updateEnterpriseStatus,
  onboardEnterpriseUsersManually,
  onboardEnterpriseUsersFromCsv,
  assignPackageToEnterprise,
  MOCK_ENTERPRISE_PACKAGES,
  MOCK_ENTERPRISE_STATUS_OPTIONS,
  MOCK_ENTERPRISE_STATUS_LABELS,
} from '~/services/enterpriseSubscribers'
import type { EnterpriseSubscriber, EnterpriseUserRow } from '~/models'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Enterprise Subscribers | Graphic News Plus'
})

const { $toast } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const packages = MOCK_ENTERPRISE_PACKAGES
const statusOptions = MOCK_ENTERPRISE_STATUS_OPTIONS

// ─── Filters & List State ────────────────────────────────────────────────────
const filters = reactive({
  query: '',
  status: '',
  packageId: '',
  pageNo: 1,
  pageSize: 30,
})

const enterpriseList = ref<EnterpriseSubscriber[]>([])
const isShimmerLoading = ref(true)
const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
})

const totals = computed(() => {
  const all = paginationParams.totalCount
  const visible = enterpriseList.value
  return {
    all,
    pending: visible.filter((e) => e.status === 'pending').length,
    active: visible.filter((e) => e.status === 'active').length,
    enrolled: visible.reduce((sum, e) => sum + (e.enrolledUsers || 0), 0),
  }
})

const fetchList = async () => {
  isShimmerLoading.value = true
  try {
    const result = fetchEnterprises({ ...filters })
    enterpriseList.value = result.data as EnterpriseSubscriber[]
    paginationParams.totalPages = result.totalPages
    paginationParams.totalCount = result.totalCount
    paginationParams.lowerBound = result.lowerBound
    paginationParams.upperBound = result.upperBound
    filters.pageNo = result.pageNo
  } finally {
    isShimmerLoading.value = false
  }
}

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters }) })
  await fetchList()
}

const resetFilters = async () => {
  filters.query = ''
  filters.status = ''
  filters.packageId = ''
  filters.pageNo = 1
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters }) })
  await fetchList()
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1
  fetchList()
}, 300)

watch(() => filters.query, debouncedSearch)
watch(() => [filters.status, filters.packageId], async () => {
  filters.pageNo = 1
  await fetchList()
})

onMounted(async () => {
  if (typeof route.query.query === 'string') filters.query = route.query.query
  if (typeof route.query.status === 'string') filters.status = route.query.status
  if (typeof route.query.packageId === 'string') filters.packageId = route.query.packageId
  await fetchList()
})

// ─── Row Dropdown ────────────────────────────────────────────────────────────
const activeDropdownId = ref<string | null>(null)

const toggleDropdown = (id: string) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

const handleOutsideDropdownClick = (e: any) => {
  if (!e.target.closest('.dropdown-container')) {
    activeDropdownId.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideDropdownClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideDropdownClick)
})

// ─── Modals ──────────────────────────────────────────────────────────────────
const showOnboardModal = ref(false)
const showUsersModal = ref(false)
const showPackageModal = ref(false)
const showDetailsModal = ref(false)
const selectedEnterprise = ref<EnterpriseSubscriber | null>(null)
const usersModalMode = ref<'manual' | 'csv'>('manual')
const recentUsers = ref<EnterpriseUserRow[]>([])

const openOnboardModal = () => {
  activeDropdownId.value = null
  showOnboardModal.value = true
}

const openUsersModal = (ent: EnterpriseSubscriber, mode: 'manual' | 'csv') => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  usersModalMode.value = mode
  showUsersModal.value = true
}

const openPackageModal = (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  showPackageModal.value = true
}

const openDetailsModal = (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  recentUsers.value = fetchEnterpriseUsers(ent.id, 6) as EnterpriseUserRow[]
  showDetailsModal.value = true
}

// ─── Confirm Actions (approve / reject / suspend) ────────────────────────────
const showConfirmModal = ref(false)
const isConfirming = ref(false)
const confirmState = reactive({
  action: '' as 'approve' | 'reject' | 'suspend',
  title: '',
  message: '',
  confirmText: '',
  type: 'info' as 'info' | 'warning' | 'danger',
})

const confirmApprove = (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  Object.assign(confirmState, {
    action: 'approve',
    title: 'Approve Enterprise Subscriber',
    message: `Approve ${ent.organizationName}? Their subscription package and user seats become active immediately.`,
    confirmText: 'Approve Enterprise',
    type: 'info',
  })
  showConfirmModal.value = true
}

const confirmReject = (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  Object.assign(confirmState, {
    action: 'reject',
    title: 'Reject Enterprise Application',
    message: `Reject the application from ${ent.organizationName}? They will not be able to onboard users.`,
    confirmText: 'Reject Application',
    type: 'danger',
  })
  showConfirmModal.value = true
}

const confirmSuspend = (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  selectedEnterprise.value = ent
  Object.assign(confirmState, {
    action: 'suspend',
    title: 'Suspend Enterprise',
    message: `Suspend ${ent.organizationName}? Their users lose access until the enterprise is reinstated.`,
    confirmText: 'Suspend Enterprise',
    type: 'warning',
  })
  showConfirmModal.value = true
}

const handleConfirmAction = async () => {
  const ent = selectedEnterprise.value
  if (!ent) return
  isConfirming.value = true
  try {
    if (confirmState.action === 'approve') {
      approveEnterpriseById(ent.id)
      $toast.success(`${ent.organizationName} approved`)
    } else if (confirmState.action === 'reject') {
      rejectEnterpriseById(ent.id, 'Application did not meet onboarding requirements')
      $toast.info(`${ent.organizationName} application rejected`)
    } else if (confirmState.action === 'suspend') {
      updateEnterpriseStatus(ent.id, 'suspended')
      $toast.warning(`${ent.organizationName} suspended`)
    }
    showConfirmModal.value = false
    await fetchList()
  } finally {
    isConfirming.value = false
  }
}

const handleReinstate = async (ent: EnterpriseSubscriber) => {
  activeDropdownId.value = null
  updateEnterpriseStatus(ent.id, 'active')
  $toast.success(`${ent.organizationName} reinstated`)
  await fetchList()
}

// ─── CRUD Handlers ───────────────────────────────────────────────────────────
const handleCreateEnterprise = async (payload: any) => {
  onboardEnterprise(payload)
  showOnboardModal.value = false
  $toast.success(`${payload.organizationName} onboarded — pending approval`)
  filters.status = ''
  filters.pageNo = 1
  await fetchList()
}

const handleUsersOnboarded = async (payload: { mode: 'manual' | 'csv'; rows: any[] }) => {
  const ent = selectedEnterprise.value
  if (!ent) return

  let result
  if (payload.mode === 'manual') {
    result = onboardEnterpriseUsersManually(ent.id, payload.rows)
  } else {
    result = onboardEnterpriseUsersFromCsv(ent.id, payload.rows)
  }

  showUsersModal.value = false
  const parts = [`${result.created.length} user(s) onboarded`]
  if (result.skipped > 0) parts.push(`${result.skipped} skipped (invalid or duplicate)`)
  $toast.success(`${ent.organizationName}: ${parts.join(' · ')}`)
  await fetchList()
}

const handleAssignPackage = async (payload: { packageId: string; billingCycle: string; subscriberQuota: number }) => {
  const ent = selectedEnterprise.value
  if (!ent) return
  assignPackageToEnterprise(ent.id, payload)
  showPackageModal.value = false
  $toast.success(`Package assigned to ${ent.organizationName}`)
  await fetchList()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusLabel = (status: string) =>
  (MOCK_ENTERPRISE_STATUS_LABELS as Record<string, string>)[status] || status

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 ring-green-600/20'
    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'rejected':
      return 'bg-red-50 text-red-700 ring-red-600/20'
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-600/20'
  }
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  corporate: 'Corporate',
  institution: 'Educational Institution',
  government: 'Government / Public Sector',
  sme: 'SME',
}

const accountTypeLabel = (type: string) => ACCOUNT_TYPE_LABELS[type] || type

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  corporate: '#b45309',
  institution: '#7c3aed',
  government: '#0369a1',
  sme: '#047857',
}

const accountTypeColor = (type: string) => ACCOUNT_TYPE_COLORS[type] || '#4b5563'

const orgInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

const usagePct = (ent: EnterpriseSubscriber) => {
  if (!ent.subscriberQuota) return 0
  return (ent.enrolledUsers / ent.subscriberQuota) * 100
}

const remainingSeats = (ent: EnterpriseSubscriber) =>
  Math.max(0, (ent.subscriberQuota || 0) - (ent.enrolledUsers || 0))
</script>
