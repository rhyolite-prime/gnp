<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Commercial Partners</h1>
        <p class="mt-2 text-sm text-gray-700"> Manage and monitor all commercial partners, their subscribers and revenue </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          Create New Partner
        </button>

        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ArrowDownTrayIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          Export CSV
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in partnerStats" :key="stat.name" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full" :class="stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-sm font-medium text-gray-500">{{ stat.name }}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="stat.value" :duration="2" :options="{ prefix: stat.prefix, suffix: stat.suffix }" />
        </p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
      <div class="w-full sm:max-w-xs">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search Partners..."
          />
        </div>
      </div>
      <div class="flex gap-2">
        <select v-model="statusFilter" class="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="all">All Statuses</option>
          <option value="success">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact Person</th>
            
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Billing Cycle</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="partner in partnerList" :key="partner.id" class="hover:bg-gray-50">

             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ longDateAndTimeFormat(partner.createdAt) }}
            </td>

            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ partner.identifier }}</div>
              <div class="text-gray-500">{{ partner.name }}</div>
            </td>
            
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="text-gray-900">{{ partner.contactName }}</div>
              <div class="text-gray-500">{{ partner.contactPhone }}</div>
              <div class="text-gray-500">{{ partner.contactEmail }}</div>
            </td>
             
             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ partner.billingCycle  }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span 
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="{
                  'bg-green-50 text-green-700 ring-green-600/20': partner.status === 'Active',
                  'bg-yellow-50 text-yellow-700 ring-yellow-600/20': partner.status === 'Suspended',
                  'bg-red-50 text-red-700 ring-red-600/20': partner.status === 'Terminated'
                }"
              >
                {{ partner.status }}
              </span>
            </td>
           
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="relative dropdown-container">
                <button 
                    @click.stop="toggleDropdown(partner.id)" 
                    class="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <EllipsisVerticalIcon class="h-5 w-5" />
                </button>

                <!-- Dropdown Menu -->
                <div 
                    v-if="activeDropdownId === partner.id" 
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                >
                    <div class="py-1">
                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="viewAdminUsers(partner)"
                        >
                            View Admin Users
                        </a>
                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="viewSubscribers(partner)"
                        >
                            View Subscribers
                        </a>
                    </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <client-only>
        <SimplePagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo " 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>

    </div>
    <!-- Partner Modal -->
    <PartnerModal 
      v-if="showCreateModal" 
      @close="closeCreateModal" 
      @save="handleCreatePartner"
      :loading="isCreating"
    />
  </div>
</template>

<script setup lang="ts">

import { 
  BanknotesIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { CommercialPartner, CommercialPartnerStat } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Commercial Partners | Graphic News Plus'
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

const partnerList = ref<CommercialPartner[]>([]);
const commercialPartnerStat = ref<CommercialPartnerStat[]>([]);


const isShimmerLoading = ref(true);
const isPartnerStatsLoading = ref(true);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedPartners()
}

const getPaginatedPartners = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getCommercialPartners(filters);

        partnerList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch commercial partners !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

 const getPartnerStats = async () => {

    isPartnerStatsLoading.value = true;

    try {

        let result = await getCommercialPartnerStats();
        commercialPartnerStat.value = result;

    } catch (error) {
        $toast.error('Unable to fetch commercial partner stats !');
        isPartnerStatsLoading.value = false;
    } finally {
        isPartnerStatsLoading.value = false;
    }

 }

 

const partnerStats = [
  { 
    name: 'Total Revenue',
    value: 125430, 
    change: '+15%', 
    changeType: 'increase', 
    icon: BanknotesIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    prefix: 'GHS ',
    suffix: ''
  },
  { 
    name: 'Total Partners', 
    value: 1240, 
    change: '+8.2%', 
    changeType: 'increase', 
    icon: CheckCircleIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Active Partners', 
    value: 128, 
    change: '-2.1%', 
    changeType: 'decrease',
    icon: CheckCircleIcon,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Seat Utilization', 
    value: 12, 
    change: '-14%', 
    changeType: 'decrease', 
    icon: ClockIcon,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    prefix: '',
    suffix: ''
  }
]

const searchQuery = ref('')
const statusFilter = ref('all')


const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedPartners();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedPartners();
    await getPartnerStats();

  });
 
  // Modal State and Handlers
  const showCreateModal = ref(false);
  const isCreating = ref(false);
  const activeDropdownId = ref<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null;
    } else {
        activeDropdownId.value = id;
    }
  };

  const closeDropdown = () => {
    activeDropdownId.value = null;
  };

  // Close dropdown when clicking outside
  onMounted(() => {
    document.addEventListener('click', (e: any) => {
        if (!e.target.closest('.dropdown-container')) {
            closeDropdown();
        }
    });
  });

  const viewAdminUsers = (partner: CommercialPartner) => {
      console.log("View Admin Users", partner);
      closeDropdown();
      // Navigate to admin users page
  }

  const viewSubscribers = (partner: CommercialPartner) => {
      console.log("View Subscribers", partner);
      closeDropdown();
      // Navigate to subscribers page
  }

  const openCreateModal = () => {
    showCreateModal.value = true;
  };

  const closeCreateModal = () => {
    showCreateModal.value = false;
  };

  const handleCreatePartner = async (partnerData: any) => {
    isCreating.value = true;
    try {
        console.log('Creating partner:', partnerData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        $toast.success('Partner created successfully');
        closeCreateModal();
        // Refresh list
        await getPaginatedPartners();
    } catch (error) {
        console.error('Error creating partner:', error);
        $toast.error('Failed to create partner');
    } finally {
        isCreating.value = false;
    }
  };
 
</script>

 