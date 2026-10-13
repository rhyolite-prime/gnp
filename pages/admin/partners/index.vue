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
          <ArrowUpTrayIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          Import Excel/CSV
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in commercialPartnerStat" :key="stat.name" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
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
            v-model="filters.query"
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
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-visible min-h-[450px]">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name/ID</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact Person</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subscriber Quota</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Default Plan</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sub Account Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Account Type</th>
            
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(partner, index) in partnerList" :key="partner.id" class="hover:bg-gray-50">

             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ longDateAndTimeFormat(partner.createdAt) }}
            </td>

            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ partner.name }}</div>
              <div class="text-gray-500">{{ partner.partnerIdentifier }}</div>
            </td>
            
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="text-gray-900">{{ partner.contactName }}</div>
              <div class="text-gray-500">{{ partner.contactPhone }}</div>
              <div class="text-gray-500">{{ partner.contactEmail }}</div>
            </td>
             
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ partner.subscriberQuota }}
            </td>

             <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
              {{ partner.defaultSubscriptionPlanName }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span 
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="{
                  'bg-green-50 text-green-700 ring-green-600/20': partner.subAccountEnabled,
                  'bg-gray-50 text-gray-700 ring-gray-600/20': !partner.subAccountEnabled
                }"
              >
                {{ partner.subAccountEnabled ? 'Enabled' : 'Disabled' }}
              </span>
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
              {{ partner.accountType === "rcp" ? "Corporate" : "Enterprise" }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span 
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="{
                  'bg-green-50 text-green-700 ring-green-600/20': partner.status === 'Active' || partner.status === 'active',
                  'bg-yellow-50 text-yellow-700 ring-yellow-600/20': partner.status === 'Suspended',
                  'bg-red-50 text-red-700 ring-red-600/20': partner.status === 'Terminated'
                }">

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
                    class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                    :class="index > 3 && index > partnerList.length - 4 ? 'bottom-full mb-2' : 'top-full mt-2'"
                >
                    <div class="py-1">

                        <a v-if="!partner.defaultSubscriptionPlanId" 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="initAssignSubscription(partner)">
                            Assign Subscription
                        </a>

                        <a v-if="partner.defaultSubscriptionPlanId" 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="initModifySubscription(partner)">
                            Modify Subscription
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="viewAdminUsers(partner)">
                            View Admin Users
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="viewSubscribers(partner)">
                            View Subscribers
                        </a>

                        <a 
                          href="#" 
                          class="block px-4 py-2 text-sm text-left transition-colors duration-200"
                          :class="partner.subAccountEnabled ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'"
                          @click.prevent="handleSubaccountToggle(partner)">
                          {{ partner.subAccountEnabled ? 'Disable Subaccount' : 'Enable Subaccount' }}
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="editCommercialPartnerStatus(partner.id)">
                            Update Partner
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="updateQuota(partner.id)">
                            Update Quota
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="editCommercialPartnerStatus(partner.id)"
                        >
                            Update Status
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="openApiKeysModal(partner)">
                            Manage API Keys
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="openApiLogsModal(partner)">
                            API Logs
                        </a>

                        <a 
                            href="#" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            @click.prevent="delCommercialPartner(partner.id)"
                        >
                            Delete Partner
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

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="relative z-50 animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <ExclamationCircleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                        </div>
                        <div class="mt-3 text-center sm:mt-5">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Update Partner Status</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Select the new status for this commercial partner.</p>
                                <select v-model="newStatus" class="mt-4 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="button" 
                            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50"
                            @click="handleUpdateStatus"
                            :disabled="isUpdatingStatus"
                        >
                            {{ isUpdatingStatus ? 'Updating...' : 'Update Status' }}
                        </button>
                        <button 
                            type="button" 
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" 
                            @click="closeStatusModal"
                            :disabled="isUpdatingStatus"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quota Update Modal -->
    <div v-if="showQuotaModal" class="relative z-50 animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <BanknotesIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                        </div>
                        <div class="mt-3 text-center sm:mt-5">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Update Subscriber Quota</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Enter the new subscriber quota for this commercial partner.</p>
                                <input type="number" v-model="newQuota" class="mt-4 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" placeholder="Quota amount" min="0" />
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="button" 
                            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50"
                            @click="handleUpdateQuota"
                            :disabled="isUpdatingQuota"
                        >
                            {{ isUpdatingQuota ? 'Updating...' : 'Update Quota' }}
                        </button>
                        <button 
                            type="button" 
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" 
                            @click="closeQuotaModal"
                            :disabled="isUpdatingQuota"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal 
      :show="showDeleteConfirmModal"
      title="Delete Commercial Partner"
      message="Are you sure you want to delete this commercial partner? This action cannot be undone and will remove all associated data."
      confirm-text="Delete Partner"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeletingPartner"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteConfirmModal = false"
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
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { CommercialPartner, CommercialPartnerStat, CommercialPartnerApiKey } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
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

const iconMap = {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
};

type IconName = keyof typeof iconMap;

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
        console.log(error)
    } finally {
        isShimmerLoading.value = false;
    }

 }

 const getPartnerStats = async () => {

    isPartnerStatsLoading.value = true;

    try {

        let result = await getCommercialPartnerStats();

      commercialPartnerStat.value = result.map(stat => ({
      ...stat,
      // Map the string to the component, fallback to Exclamation icon if missing
      icon: iconMap[stat.icon as IconName] || ExclamationCircleIcon
    }));

    } catch (error) {
        $toast.error('Unable to fetch commercial partner stats !');
        isPartnerStatsLoading.value = false;
    } finally {
        isPartnerStatsLoading.value = false;
    }

 }


 const handleSubaccountToggle = async (partner: CommercialPartner) => {
  if (partner.subAccountEnabled) {
    // Logic for Disabling
    await disablePartnerSubaccount({ partnerId: partner.id });
    $toast.success('Subaccount disabled successfully');
  } else {
    // Logic for Enabling
    await enablePartnerSubaccount({ partnerId: partner.id });
    $toast.success('Subaccount enabled successfully');
  }
  
  // Refresh the partner data or toggle the local state
  partner.subAccountEnabled = !partner.subAccountEnabled;
};

const statusFilter = ref('all')

const showDeleteConfirmModal = ref(false);
const partnerToDeleteId = ref<string | null>(null);
const isDeletingPartner = ref(false);

const delCommercialPartner = (id: string) => {
    partnerToDeleteId.value = id;
    showDeleteConfirmModal.value = true;
    closeDropdown();
};

const handleConfirmDelete = async () => {
    if (!partnerToDeleteId.value) return;

    isDeletingPartner.value = true;
    try {
        const isSuccessful = await deleteCommercialPartner(partnerToDeleteId.value);

        if (isSuccessful) {
            $toast.success('Commercial Partner deleted successfully');
            await getPaginatedPartners();
            showDeleteConfirmModal.value = false;
        }
    } catch (error) {
        $toast.error('Unable to delete commercial partner!');
    } finally {
        isDeletingPartner.value = false;
        partnerToDeleteId.value = null;
    }
};

// Status Update Logic
const showStatusModal = ref(false);
const isUpdatingStatus = ref(false);
const selectedPartnerId = ref<string>('');
const selectedPartner = ref<CommercialPartner | null>(null);
const newStatus = ref<string>('');

const editCommercialPartnerStatus = (id: string) => {
    selectedPartnerId.value = id;
    // Find current status if needed, or default to ''
    const partner = partnerList.value.find(p => p.id === id);
    newStatus.value = partner?.status || 'Active';
    showStatusModal.value = true;
    closeDropdown();
};

const closeStatusModal = () => {
    showStatusModal.value = false;
    selectedPartnerId.value = '';
    newStatus.value = '';
};


const initAssignSubscription = (partner: CommercialPartner) => {

  selectedPartner.value = partner;
  
};

const initModifySubscription = (partner: CommercialPartner) => {

  selectedPartner.value = partner;
  
};



const handleUpdateStatus = async () => {
    if (!selectedPartnerId.value || !newStatus.value) return;

    isUpdatingStatus.value = true;
    try {
        const payload = {
            partnerId: selectedPartnerId.value,
            status: newStatus.value
        };
        
        const success = await updateCommercialPartnerStatus(payload);
        
        if (success) {
            $toast.success('Partner status updated successfully');
            closeStatusModal();
            await getPaginatedPartners();
        } else {
             $toast.error('Failed to update status');
        }
    } catch (error) {
        console.error('Update status error:', error);
        $toast.error('An error occurred while updating status');
    } finally {
        isUpdatingStatus.value = false;
    }
};

// Quota Update Logic
const showQuotaModal = ref(false);
const isUpdatingQuota = ref(false);
const newQuota = ref<number>(0);

const updateQuota = (id: string) => {
    selectedPartnerId.value = id;
    const partner = partnerList.value.find(p => p.id === id);
    newQuota.value = partner?.subscriberQuota || 0;
    showQuotaModal.value = true;
    closeDropdown();
};

const closeQuotaModal = () => {
    showQuotaModal.value = false;
    selectedPartnerId.value = '';
    newQuota.value = 0;
};

const handleUpdateQuota = async () => {
    if (!selectedPartnerId.value || newQuota.value < 0) return;

    isUpdatingQuota.value = true;
    try {
        const payload = {
            quota: newQuota.value
        };
        
        const success = await updateCommercialPartnerQuota(payload, selectedPartnerId.value);
        
        if (success) {
            $toast.success('Partner quota updated successfully');
            closeQuotaModal();
            await getPaginatedPartners();
        } else {
             $toast.error('Failed to update quota');
        }
    } catch (error) {
        console.error('Update quota error:', error);
        $toast.error('An error occurred while updating quota');
    } finally {
        isUpdatingQuota.value = false;
    }
};

const openApiKeysModal = (partner: CommercialPartner) => {
    closeDropdown();
    router.push({
        path: `/admin/partners/${partner.id}/api-keys`
    });
};

const openApiLogsModal = (partner: CommercialPartner) => {
    closeDropdown();
    router.push({
        path: `/admin/partners/${partner.id}/api-logs`
    });
};


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
      closeDropdown();
      router.push({
        path: `/admin/partners/${partner.id}/subscribers`
      });
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
        
        let isSuccessful = await createCommercialPartner(partnerData);
       
       if (isSuccessful) {

          $toast.success(`Partner created successfully. An invitation email has been sent to ${partnerData.billingEmail}.`);
       
          closeCreateModal();
          // Refresh list
          await getPaginatedPartners();

        }
        
    } catch (error) {
        console.error('Error creating partner:', error);
        $toast.error('Failed to create partner');
    } finally {
        isCreating.value = false;
    }
  };
 
</script>

 