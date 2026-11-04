<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Affiliates</h1>
      <p class="mt-2 text-sm text-gray-700">A list of all affiliates in your program.</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        @click="showAddModal = true"
        class="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add Affiliate
      </button>
    </div>
  </div>

  <!-- Filters -->
  <form class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end" @submit.prevent="onPageChange(1)">
    <div class="w-full sm:w-72">
      <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          v-model="filters.query"
          class="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
          placeholder="Search by name, email, or ID"
        />
      </div>
    </div>
    
    <div class="w-full sm:w-48">
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        id="status"
        name="status"
        v-model="filters.status"
        class="block w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
      >
        <option value="-1">All Statuses</option>
        <option value="11">Active</option>
        <option value="20">Pending</option>
        <option value="2">Archived</option>
        <option value="13">Suspended</option>
        <option value="17">Rejected</option>
      </select>
    </div>

    <div class="w-full sm:w-48">
      <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
      <select
        id="sort"
        name="sort"
        v-model="filters.sortBy"
        class="block w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
      >
        <option value="newest">Newest First</option>
        <option value="earnings_high">Earnings: High to Low</option>
        <option value="earnings_low">Earnings: Low to High</option>
      </select>
    </div>

    <button type="submit" class="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
      Search
    </button>
    <button type="button" class="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" @click="resetFilters">
      Reset
    </button>
  </form>

  <!-- Table -->
  <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="[&_th]:bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 sm:rounded-tl-xl">Affiliate</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Joined</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Earnings</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Wallet Balance</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 sm:rounded-tr-xl">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="person in affiliateList" :key="person.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
            <div class="flex items-center">
               
              <div class="ml-4">
                <div class="font-medium text-gray-900">{{ person.firstName }} {{ person.lastName }}</div>
                <div class="text-gray-500">{{ person.email }}</div>
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <span
              class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
              :class="getStatusBadgeClass(person.status)"
            >
              {{ getStatusLabel(person.status) }}
            </span>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longMonthDateFormat(person.dateJoined) }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium"> GHS {{ person.totalEarnings }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium"> GHS {{ person.walletBalance }}</td>
          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                  <span class="sr-only">Open options</span>
                  <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">View Profile</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Edit Details</a>
                    </MenuItem>
                     <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Update Account Status</a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Reset Password</a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <NuxtLink :to="`/admin/affiliates/${person.id}`" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">View Earnings</NuxtLink>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Delete</a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
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

  <AffiliateModal 
    v-if="showAddModal" 
    :loading="loading"
    @close="showAddModal = false" 
    @save="handleCreateAffiliate" 
  />
</template>

<script setup lang="ts">
import type { Affiliate } from "~/models";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  EllipsisVerticalIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import AffiliateModal from '~/components/AffiliateModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const showAddModal = ref(false)
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const filters = reactive({
  sortBy: 'newest',
  query: '',
  status: -1,
  pageNo: 1,
  pageSize: 10,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const affiliateList = ref<Affiliate[]>([]);

const isShimmerLoading = ref(true);
const affiliateToDeleteId = ref('');
const isLoading = ref(false);
const isEditing = ref(false);


const onPageChange = async (pageNumber: number) => {
  if (filters.pageNo === pageNumber) {
    await getPaginatedAffiliates()
  } else {
    filters.pageNo = pageNumber
  }
}

const resetFilters = () => {
  filters.query = ''
  filters.status = -1
  filters.sortBy = 'newest'
  filters.pageNo = 1
}

watch(
  () => [filters.query, filters.status, filters.sortBy, filters.pageNo, filters.pageSize] as const,
  ([query, status, sortBy, , pageSize], [oldQuery, oldStatus, oldSortBy, , oldPageSize]) => {
    if ((query !== oldQuery || status !== oldStatus || sortBy !== oldSortBy || pageSize !== oldPageSize) && filters.pageNo !== 1) {
      filters.pageNo = 1
      return
    }

    const filteredQuery = filterQueryParams({ ...route.query, ...filters })
    router.replace({ name: route.name ?? '', query: filteredQuery })
    getPaginatedAffiliates()
  }
)

let latestRequest = 0

const getPaginatedAffiliates = async () => {
    const requestId = ++latestRequest
    isShimmerLoading.value = true;

    try {

        let result = await getAffiliates({ ...filters });
        if (requestId !== latestRequest) return

        affiliateList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        if (requestId === latestRequest) $toast.error('Unable to fetch affiliate applications!');
    } finally {
        if (requestId === latestRequest) isShimmerLoading.value = false;
    }

}
 

const STATUS = {
  PENDING: 20,
  APPROVED: 11,
  REJECTED: 17,
  ARCHIVED: 2,
  SUSPENDED:13,
} as const

const getStatusLabel = (status: number): string => {
  switch (status) {
    case STATUS.PENDING: return 'Pending'
    case STATUS.APPROVED: return 'Approved'
    case STATUS.REJECTED: return 'Rejected'
    case STATUS.ARCHIVED: return 'Archived'
    case STATUS.SUSPENDED: return 'Suspended'
    default: return 'Unknown'
  }
}

const getStatusBadgeClass = (status: number): string => {
  switch (status) {
    case STATUS.PENDING:  return 'bg-yellow-100 text-yellow-800'
    case STATUS.APPROVED: return 'bg-green-100 text-green-800'
    case STATUS.REJECTED: return 'bg-red-100 text-red-800'
    case STATUS.ARCHIVED: return 'bg-gray-100 text-gray-800'
    default:              return 'bg-gray-100 text-gray-800'
  }
}




const affiliates = ref([
  {
    id: 'aff-1',
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    status: 'Active',
    dateJoined: 'Jan 10, 2026',
    earnings: 2450,
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'aff-2',
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    status: 'Active',
    dateJoined: 'Jan 12, 2026',
    earnings: 1200,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'aff-3',
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    status: 'Pending',
    dateJoined: 'Feb 15, 2026',
    earnings: 0,
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'aff-4',
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    status: 'Active',
    dateJoined: 'Jan 05, 2026',
    earnings: 3500,
    image:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'aff-5',
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    status: 'Suspended',
    dateJoined: 'Dec 10, 2025',
    earnings: 150,
    image:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'aff-6',
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    status: 'Active',
    dateJoined: 'Jan 28, 2026',
    earnings: 980,
    image:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
])

 

const handleCreateAffiliate = async (formData: any) => {

  console.log("formData =>", formData);
  
}

onMounted(async () => {
  
  await getPaginatedAffiliates()
})
</script>
