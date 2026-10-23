<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Accessible Newspapers
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          All the newspaper editions this subscriber has access to, and how that access was granted
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink
          to="/admin/subscribers"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          ← Back to Subscribers
        </NuxtLink>
      </div>
    </div>

    <!-- Subscriber Picker & Profile -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-5 mb-8">
      <div class="grid grid-cols-1 gap-y-5 lg:grid-cols-3 gap-x-6">
        <!-- Searchable subscriber picker -->
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Subscriber</label>
          <div class="relative dropdown-container">
            <div class="relative rounded-md shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                v-model="subscriberQuery"
                class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="Search by name, email or phone..."
                @focus="showSubscriberDropdown = true"
                @input="showSubscriberDropdown = true"
              />
            </div>

            <!-- Dropdown -->
            <div
              v-if="showSubscriberDropdown"
              class="absolute z-40 mt-1 w-full max-h-64 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-100"
            >
              <button
                v-for="sub in subscriberOptions"
                :key="sub.id"
                type="button"
                class="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 cursor-pointer"
                :class="sub.id === selectedSubscriberId ? 'bg-primary-50' : ''"
                @click.prevent="selectSubscriber(sub.id)"
              >
                <div class="font-medium text-gray-900">{{ sub.firstName }} {{ sub.lastName }}</div>
                <div class="text-xs text-gray-500">
                  {{ sub.email }}
                  <span v-if="sub.subscription"> · {{ sub.subscription.planName }}</span>
                  <span v-else> · Pay-as-you-go</span>
                </div>
              </button>

              <div v-if="subscriberOptions.length === 0" class="px-4 py-3 text-sm text-gray-500">
                No subscribers match "{{ subscriberQuery }}".
              </div>
            </div>
          </div>
        </div>

        <!-- Selected subscriber summary -->
        <div v-if="accessProfile" class="lg:col-span-2">
          <div class="h-full rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base font-bold text-gray-900">
                    {{ accessProfile.firstName }} {{ accessProfile.lastName }}
                  </h2>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="
                      accessProfile.isActive
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-red-50 text-red-700 ring-red-600/20'
                    "
                  >
                    {{ accessProfile.isActive ? 'Active' : 'Inactive' }}
                  </span>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="accountTypeBadgeClass(accessProfile)"
                  >
                    {{ accountTypeLabel(accessProfile) }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  {{ accessProfile.email }}
                  <span v-if="accessProfile.phoneNumber"> · {{ accessProfile.phoneNumber }}</span>
                </p>
              </div>

              <NuxtLink
                :to="`/admin/partners/${accessProfile.partnerId}/subscribers`"
                v-if="accessProfile.partnerId"
                class="text-xs font-semibold text-primary-600 hover:text-primary-500"
              >
                View {{ accessProfile.partnerName }} seats →
              </NuxtLink>
            </div>

            <dl class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Plan</dt>
                <dd class="text-sm font-semibold text-gray-900">
                  {{ accessProfile.subscription ? accessProfile.subscription.planName : 'No Plan' }}
                </dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Billing</dt>
                <dd class="text-sm text-gray-900">
                  {{ accessProfile.subscription ? accessProfile.subscription.billingCycle : 'Pay-as-you-go' }}
                </dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Access Window</dt>
                <dd class="text-sm text-gray-900">
                  <template v-if="accessProfile.subscription">
                    {{ longDateFormat(accessProfile.subscription.startDate) }} —
                    {{ longDateFormat(accessProfile.subscription.endDate) }}
                  </template>
                  <template v-else>—</template>
                </dd>
              </div>
              <div>
                <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Subscriber Since</dt>
                <dd class="text-sm text-gray-900">{{ longDateFormat(accessProfile.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Chips -->
    <div v-if="accessSummary" class="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Editions (matching)</p>
        <p class="mt-1 text-xl font-bold text-gray-900">{{ toNumber(accessSummary.total) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Plan Entitlement</p>
        <p class="mt-1 text-xl font-bold text-blue-700">{{ toNumber(accessSummary.planEntitlement) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Single-Copy</p>
        <p class="mt-1 text-xl font-bold text-indigo-700">{{ toNumber(accessSummary.singleCopy) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Promo / Grants</p>
        <p class="mt-1 text-xl font-bold text-amber-700">{{ toNumber(accessSummary.promoGrant) }}</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Expiring / Expired</p>
        <p class="mt-1 text-xl font-bold text-red-700">
          {{ toNumber(accessSummary.expiringSoon + accessSummary.expired) }}
        </p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Active Now</p>
        <p class="mt-1 text-xl font-bold text-green-700">{{ toNumber(accessSummary.active) }}</p>
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
    <div
      v-show="showFilters"
      class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn"
    >
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
            placeholder="Search title, edition..."
          />
        </div>
      </div>

      <!-- Publication -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Publication</label>
        <select
          v-model="filters.publicationId"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Publications</option>
          <option v-for="pub in publicationOptions" :key="pub.id" :value="pub.id">{{ pub.name }}</option>
        </select>
      </div>

      <!-- Access Type -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
        <select
          v-model="filters.accessType"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Access Types</option>
          <option v-for="opt in accessTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <!-- Access Status -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Access Status</label>
        <select
          v-model="filters.accessStatus"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Statuses</option>
          <option v-for="opt in accessStatusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <!-- Publication Date Range -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
        <div class="flex items-center space-x-2 bg-white rounded-md ring-1 ring-inset ring-gray-300 px-2 py-1.5 shadow-sm">
          <input
            type="date"
            v-model="filters.startDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
          <span class="text-gray-400 text-sm">to</span>
          <input
            type="date"
            v-model="filters.endDate"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <!-- Edition Status -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700 mb-1">Edition Status</label>
        <select
          v-model="filters.editionStatus"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Editions</option>
          <option v-for="opt in editionStatusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <!-- Filter Actions -->
      <div class="flex items-end gap-2 sm:col-span-2">
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

    <!-- Access List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-visible min-h-[450px]">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Newspaper</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Publication</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Publication Date</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Access Type</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Granted Via</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Access Window</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="isShimmerLoading" class="animate-pulse">
            <td colspan="9" class="px-3 py-10 text-center text-sm text-gray-500">
              <div class="flex justify-center items-center space-x-2">
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </td>
          </tr>

          <tr v-else-if="accessRows.length === 0">
            <td colspan="9" class="px-3 py-10 text-center text-gray-500">
              <p class="text-sm">
                No newspaper editions match this subscriber &amp; filter combination.
              </p>
              <button
                type="button"
                class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium cursor-pointer"
                @click="resetFilters"
              >
                Reset filters to see everything
              </button>
            </td>
          </tr>

          <tr v-else v-for="row in accessRows" :key="row.id" class="hover:bg-gray-50 transition-colors">
            <!-- Newspaper -->
            <td class="px-3 py-4 text-sm">
              <div class="flex items-center">
                <div
                  class="h-14 w-10 flex-shrink-0 rounded overflow-hidden mr-3 border border-gray-200 flex items-center justify-center text-white text-[10px] font-bold"
                  :style="{ background: publicationColor(row.newspaper.publicationId) }"
                >
                  {{ publicationInitials(row.newspaper.publicationName) }}
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-gray-900 truncate max-w-[220px]" :title="row.newspaper.title">
                    {{ row.newspaper.title }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Edition {{ row.newspaper.editionNumber }}
                    <span
                      v-if="row.newspaper.isPopular"
                      class="ml-1 inline-flex items-center rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20"
                    >
                      Popular
                    </span>
                  </p>
                </div>
              </div>
            </td>

            <!-- Publication -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ row.newspaper.publicationName }}
            </td>

            <!-- Publication Date -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ longDateFormat(row.newspaper.publishedDate) }}
            </td>

            <!-- Price -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span v-if="row.newspaper.isFree" class="text-green-600 font-medium">Free</span>
              <span v-else>GHS {{ _currency(row.newspaper.price) }}</span>
            </td>

            <!-- Access Type -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="accessTypeBadgeClass(row.accessType)"
              >
                {{ row.accessTypeLabel }}
              </span>
            </td>

            <!-- Granted Via -->
            <td class="px-3 py-4 text-sm text-gray-500">
              <p class="font-medium text-gray-800">{{ row.grantedVia }}</p>
              <p class="text-xs text-gray-400">{{ row.sourceReference }}</p>
            </td>

            <!-- Access Window -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <p>{{ shortDateFormat(row.grantedAt) }} →</p>
              <p>{{ row.expiresAt ? shortDateFormat(row.expiresAt) : 'No expiry' }}</p>
            </td>

            <!-- Status -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="accessStatusBadgeClass(row.accessStatus)"
              >
                {{ accessStatusLabel(row.accessStatus) }}
              </span>
            </td>

            <!-- Actions -->
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <NuxtLink
                :to="`/newspapers/${row.newspaper.id}`"
                class="text-primary-600 hover:text-primary-500"
                target="_blank"
              >
                View Edition
              </NuxtLink>
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
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash-es'
import {
  searchSubscriberDirectory,
  fetchSubscriberAccessProfile,
  fetchSubscriberNewspaperAccess,
  MOCK_ACCESS_PUBLICATIONS,
  MOCK_ACCESS_TYPE_OPTIONS,
  MOCK_ACCESS_STATUS_OPTIONS,
  MOCK_EDITION_STATUS_OPTIONS,
} from '~/services/subscriberNewspapers'
import type {
  SubscriberAccessProfile,
  SubscriberAccessSummary,
  SubscriberNewspaperAccessRow,
  SubscriberAccessStatus,
  SubscriberAccessSource,
} from '~/models'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Accessible Newspapers | Graphic News Plus'
})

const router = useRouter()
const route = useRoute()

// ─── Subscriber Picker ───────────────────────────────────────────────────────
const subscriberQuery = ref('')
const showSubscriberDropdown = ref(false)
const selectedSubscriberId = ref('')
const accessProfile = ref<SubscriberAccessProfile | null>(null)
const accessSummary = ref<SubscriberAccessSummary | null>(null)

const subscriberOptions = computed(() => searchSubscriberDirectory(subscriberQuery.value))

const selectSubscriber = async (subscriberId: string) => {
  selectedSubscriberId.value = subscriberId
  showSubscriberDropdown.value = false
  subscriberQuery.value = ''
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, subscriberId, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await loadAccessProfile()
  await fetchAccessRows()
}

const loadAccessProfile = () => {
  const profile = fetchSubscriberAccessProfile(selectedSubscriberId.value)
  accessProfile.value = profile?.subscriber ?? null
}

// Close the picker dropdown on outside click
const handleOutsideDropdownClick = (e: any) => {
  if (!e.target.closest('.dropdown-container')) {
    showSubscriberDropdown.value = false
  }
}

// ─── Filters ─────────────────────────────────────────────────────────────────
const showFilters = ref(false)

const filters = reactive({
  query: '',
  publicationId: '',
  accessType: '',
  accessStatus: '',
  editionStatus: '',
  startDate: '',
  endDate: '',
  pageNo: 1,
  pageSize: 30,
})

const publicationOptions = MOCK_ACCESS_PUBLICATIONS
const accessTypeOptions = MOCK_ACCESS_TYPE_OPTIONS
const accessStatusOptions = MOCK_ACCESS_STATUS_OPTIONS
const editionStatusOptions = MOCK_EDITION_STATUS_OPTIONS

// ─── List State ──────────────────────────────────────────────────────────────
const accessRows = ref<SubscriberNewspaperAccessRow[]>([])
const isShimmerLoading = ref(true)

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
})

const fetchAccessRows = async () => {
  if (!selectedSubscriberId.value) {
    accessRows.value = []
    isShimmerLoading.value = false
    return
  }

  isShimmerLoading.value = true
  try {
    const result = fetchSubscriberNewspaperAccess({
      subscriberId: selectedSubscriberId.value,
      ...filters,
    })
    accessRows.value = result.data
    accessSummary.value = result.summary
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
  const filteredQuery = filterQueryParams({ ...route.query, subscriberId: selectedSubscriberId.value, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await fetchAccessRows()
}

const applyFilters = async () => {
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, subscriberId: selectedSubscriberId.value, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await fetchAccessRows()
}

const resetFilters = async () => {
  filters.query = ''
  filters.publicationId = ''
  filters.accessType = ''
  filters.accessStatus = ''
  filters.editionStatus = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, subscriberId: selectedSubscriberId.value, ...filters })
  router.replace({ name: route.name ?? '', query: filteredQuery })
  await fetchAccessRows()
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1
  fetchAccessRows()
}, 300)

watch(() => filters.query, debouncedSearch)

// ─── Init (restore subscriberId from query string, else first subscriber) ───
onMounted(async () => {
  document.addEventListener('click', handleOutsideDropdownClick)

  const querySubscriberId = String(route.query.subscriberId || '')
  const exists = querySubscriberId && searchSubscriberDirectory('').some((s) => s.id === querySubscriberId)
  selectedSubscriberId.value = exists ? querySubscriberId : (searchSubscriberDirectory('')[0]?.id ?? '')

  if (typeof route.query.query === 'string') filters.query = route.query.query
  if (typeof route.query.publicationId === 'string') filters.publicationId = route.query.publicationId
  if (typeof route.query.accessType === 'string') filters.accessType = route.query.accessType
  if (typeof route.query.accessStatus === 'string') filters.accessStatus = route.query.accessStatus
  if (typeof route.query.editionStatus === 'string') filters.editionStatus = route.query.editionStatus
  if (typeof route.query.startDate === 'string') filters.startDate = route.query.startDate
  if (typeof route.query.endDate === 'string') filters.endDate = route.query.endDate

  loadAccessProfile()
  await fetchAccessRows()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideDropdownClick)
})

// ─── Badge & Format Helpers ──────────────────────────────────────────────────
const accountTypeLabel = (sub: SubscriberAccessProfile) => {
  if (sub.accountType === 'partner') return 'Partner Seat'
  if (sub.accountType === 'affiliate') return 'Affiliate Referral'
  return 'Regular'
}

const accountTypeBadgeClass = (sub: SubscriberAccessProfile) => {
  if (sub.accountType === 'partner') return 'bg-blue-50 text-blue-700 ring-blue-600/20'
  if (sub.accountType === 'affiliate') return 'bg-green-50 text-green-700 ring-green-600/20'
  return 'bg-gray-50 text-gray-700 ring-gray-600/20'
}

const accessTypeBadgeClass = (type: SubscriberAccessSource) => {
  switch (type) {
    case 'plan_entitlement':
      return 'bg-blue-50 text-blue-700 ring-blue-600/20'
    case 'single_copy_purchase':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
    case 'promo_grant':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    default:
      return 'bg-green-50 text-green-700 ring-green-600/20'
  }
}

const accessStatusBadgeClass = (status: SubscriberAccessStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 ring-green-600/20'
    case 'expiring_soon':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'expired':
      return 'bg-red-50 text-red-700 ring-red-600/20'
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-600/20'
  }
}

const accessStatusLabel = (status: SubscriberAccessStatus) => {
  switch (status) {
    case 'expiring_soon':
      return 'Expiring Soon'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

const PUBLICATION_COLORS: Record<string, string> = {
  'pub-daily-graphic': '#b91c1c',
  'pub-graphic-business': '#b45309',
  'pub-the-mirror': '#7c3aed',
  'pub-graphic-sports': '#047857',
  'pub-graphic-showbiz': '#be185d',
  'pub-junior-graphic': '#0369a1',
}

const publicationColor = (publicationId: string) => PUBLICATION_COLORS[publicationId] || '#4b5563'

const publicationInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase()
</script>
