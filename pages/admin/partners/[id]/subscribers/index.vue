<template>
  <div class="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
        <button @click="goBack" class="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeftIcon class="h-4 w-4 mr-1"/> Back to Partners
        </button>
        <div class="mt-2 md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {{ parterDetails?.name }} — Subscribers
                </h2>
                 <p class="mt-1 text-sm text-gray-500">
                    Manage and onboard subscribers for this partner.
                </p>
            </div>
             <div class="mt-4 flex md:ml-4 md:mt-0 gap-3">
                 <button
                    @click="openCreateModal"
                    type="button"
                    class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    Add New Subscriber
                </button>

                <button
                  @click="openUploadModal"
                  type="button" 
                  class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <ArrowUpTrayIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Upload Subscribers
                </button>
            </div>
        </div>
    </div>

    <!-- Quota Stats -->
     <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
             <dt class="truncate text-sm font-medium text-gray-500">Total Quota</dt>
             <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ parterDetails?.subscriberQuota || 0 }}</dd>
        </div>
         <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
             <dt class="truncate text-sm font-medium text-gray-500">Subscribers Enrolled</dt>
             <dd class="mt-1 text-3xl font-semibold tracking-tight text-green-600">{{ (parterDetails?.subscriberQuota || 0) - (parterDetails?.remainingQuota || 0) }}</dd>
        </div>
         <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
             <dt class="truncate text-sm font-medium text-gray-500">Remaining Slots</dt>
             <dd class="mt-1 text-3xl font-semibold tracking-tight" :class="(parterDetails?.remainingQuota || 0) > 0 ? 'text-blue-600' : 'text-red-600'">{{ parterDetails?.remainingQuota || 0 }}</dd>
        </div>
    </div>

    <!-- Subscription Summary Section -->
    <div v-if="subscriptionSummary.length" class="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
        <h3 class="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Active Subscriptions Breakdown</h3>
        <div class="flex flex-wrap gap-3">
            <div 
                v-for="summary in subscriptionSummary" 
                :key="summary.subscriptionPlanDescription" 
                class="inline-flex items-center px-4 py-2 rounded-xl bg-primary-50 text-primary-700 text-sm font-semibold border border-primary-100 shadow-sm transition-all hover:bg-primary-100"
            >
                <span class="mr-2 opacity-75">
                    <CheckCircleIcon class="h-4 w-4"/>
                </span>
                {{ summary.subscriptionPlanDescription }} — <span class="ml-2 bg-primary-600 text-white px-2 py-0.5 rounded text-xs">{{ summary.subscriberCount }}</span>
            </div>
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
            placeholder="Search Subsribers..."
          />
        </div>
      </div>
       
    </div>

    <!-- Subscribers List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <div class="border-b border-gray-200 px-4 py-5 sm:px-6 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Enrolled Subscribers</h3>
                <button
                    v-if="selectedSubscriberIds.size > 0"
                    @click="openSubscriptionModal"
                    type="button"
                    class="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
                    Assign Package ({{ selectedSubscriberIds.size }})
                </button>
            </div>
             
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                            <input
                                type="checkbox"
                                :checked="allSelected"
                                :indeterminate="indeterminate"
                                @change="toggleSelectAll"
                                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                         <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> Date Joined</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subscription Plan</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                         <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span class="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                     <tr v-if="isLoading" class="animate-pulse">
                        <td colspan="6" class="px-3 py-10 text-center text-sm text-gray-500">
                            <div class="flex justify-center items-center space-x-2">
                                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                                <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </td>
                     </tr>
                     <tr v-else-if="subscriberList.length === 0">
                        <td colspan="6" class="px-3 py-10 text-center text-gray-500">
                            <p class="text-sm">No subscribers found under this partner.</p>
                            <button @click="openUploadModal" class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">Upload a list to get started</button>
                        </td>
                     </tr>
                     <tr v-else v-for="sub in subscriberList" :key="sub.id" class="hover:bg-gray-50 transition-colors">
                         <td class="relative px-7 sm:w-12 sm:px-6">
                            <input
                                type="checkbox"
                                :checked="selectedSubscriberIds.has(sub.id)"
                                @change="toggleSelection(sub.id)"
                                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                         </td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{{ sub.firstName }} {{ sub.lastName }}</td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.email }}</td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.phoneNumber || 'N/A' }}</td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(sub.createdAt) }}</td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.subscriptionPlanDescription }}</td>
                         <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                             <span 
                                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                :class="{
                                  'bg-green-50 text-green-700 ring-green-600/20': sub.status === 'Active' || sub.status === 'active',
                                  'bg-red-50 text-red-700 ring-red-600/20': sub.status === 'Inactive' || sub.status === 'inactive'
                                }"
                             >
                                {{ sub.status || 'Active' }}
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
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                                >
                                    <div class="py-1">
                                        <button 
                                            class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                            @click.prevent="openDetailModal(sub)"
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                            @click.prevent="handleUpdateSubscriberStatus(sub.id, 'Active')"
                                        >
                                            Activate
                                        </button>
                                        <button 
                                            class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                            @click.prevent="handleUpdateSubscriberStatus(sub.id, 'Inactive')"
                                        >
                                            Deactivate
                                        </button>
                                        <button 
                                            class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                            @click.prevent="confirmRemoveSubscriber(sub.id)"
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
    </div>

    <!-- Partner subscriber Modal -->
    <PartnerSubscriberModal 
      v-if="showCreateModal" 
      @close="closeCreateModal" 
      @save="handleCreatePartnerSubscriber"
      :loading="isCreatingPartnerSubscriber"
    />

    <!-- Partner Subscription Modal -->
    <PartnerSubscriptionModal 
      v-if="showSubscriptionModal" 
      @close="closeSubscriptionModal" 
      @assign="handleBulkAssign"
      :loading="isAssigningPlan"
    />

    <!-- Subscriber Upload Modal -->
    <SubscriberUploadModal 
      v-if="showUploadModal" 
      @close="closeUploadModal" 
      @upload="handleFileUpload"
      :uploading="isUploading"
      :upload-progress="uploadProgress"
      :remaining-quota="parterDetails?.remainingQuota || 0"
    />

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal"
      title="Remove Subscriber"
      message="Are you sure you want to remove this subscriber? This action cannot be undone."
      confirm-text="Remove"
      cancel-text="Cancel"
      type="danger"
      :loading="isRemovingSubscriber"
      @confirm="handleRemoveSubscriber"
      @cancel="showConfirmModal = false"
    />

    <!-- Subscriber Detail Modal -->
    <AdminSubscriberSubscriptionModal
      :show="showDetailModal"
      :subscriber="selectedSubscriber"
      :partner-id="partnerId"
      @close="closeDetailModal"
    />

  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, CheckCircleIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import type { CommercialPartner, Subscriber, SubscriptionSummary } from "~/models";

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const filters = reactive({
  partnerId: route.params.id as string,
  query: '',
  pageNo: 1,
  pageSize: 600,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const partnerId = route.params.id as string;
const isShimmerLoading = ref(true);

const parterDetails = ref<CommercialPartner | null>();
const subscriberList = ref<Subscriber[]>([]);
const subscriptionSummary = ref<SubscriptionSummary[]>([]);

const isLoading = ref(true);
const showCreateModal = ref(false);
const showSubscriptionModal = ref(false);
const showUploadModal = ref(false);
const isCreatingPartnerSubscriber = ref(false);
const isUploading = ref(false);
const isAssigningPlan = ref(false);
const isRemovingSubscriber = ref(false);
const uploadProgress = ref(0);

// Selection state
const selectedSubscriberIds = ref<Set<string>>(new Set());
const subscriberIdToRemove = ref<string | null>(null);
const showConfirmModal = ref(false);
const activeDropdownId = ref<string | null>(null);

const showDetailModal = ref(false);
const selectedSubscriber = ref<Subscriber | null>(null);

const allSelected = computed(() => {
    return subscriberList.value.length > 0 && selectedSubscriberIds.value.size === subscriberList.value.length;
});

const indeterminate = computed(() => {
    return selectedSubscriberIds.value.size > 0 && selectedSubscriberIds.value.size < subscriberList.value.length;
});

const toggleSelectAll = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
        subscriberList.value.forEach(s => selectedSubscriberIds.value.add(s.id));
    } else {
        selectedSubscriberIds.value.clear();
    }
};

const toggleSelection = (id: string) => {
    if (selectedSubscriberIds.value.has(id)) {
        selectedSubscriberIds.value.delete(id);
    } else {
        selectedSubscriberIds.value.add(id);
    }
};

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

const openDetailModal = (subscriber: Subscriber) => {
    selectedSubscriber.value = subscriber;
    showDetailModal.value = true;
    closeDropdown();
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    setTimeout(() => {
        selectedSubscriber.value = null;
    }, 300);
};

const formatDate = (date: string) => {
    return dayjs(date).format('MMM D, YYYY h:mm A');
};

const goBack = () => {
    router.push('/admin/partners');
};

const openUploadModal = () => {
    showUploadModal.value = true;
};

const closeUploadModal = () => {
    showUploadModal.value = false;
    uploadProgress.value = 0;
};

const openCreateModal = () => {
    showCreateModal.value = true;
};
  
const closeCreateModal = () => {
    showCreateModal.value = false;
};

const openSubscriptionModal = () => {
    showSubscriptionModal.value = true;
};

const closeSubscriptionModal = () => {
    showSubscriptionModal.value = false;
};

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await fetchSubscribers()
}

const handleCreatePartnerSubscriber = async (subscriberData: any) => {
    isCreatingPartnerSubscriber.value = true;
    try {
        const payload = {
            ...subscriberData,
            partnerId
        };
        
        const success = await createPartnerSubscriber(payload);
        
        if (success) {
            $toast.success('Subscriber added successfully');
            closeCreateModal();
            await fetchSubscribers();
            await fetchCommercialPartnerDetails();
        } else {
            closeCreateModal();
             $toast.error('Failed to add subscriber');
        }
    } catch (error: any) {
        console.error('Error adding subscriber:', error);
        closeCreateModal();
        if (error.response?.data?.message?.includes('Quota')) {
             $toast.error(error.response.data.message);
        } else {
             $toast.error('Failed to add subscriber');
        }
    } finally {
        isCreatingPartnerSubscriber.value = false;
        closeCreateModal();
    }
};

const handleBulkAssign = async (data: { planId: string; billingCycle: string; planName: string; price: number }) => {
    if (selectedSubscriberIds.value.size === 0) return;

    isAssigningPlan.value = true;
    try {
        const subscriptionPlanDescription = `${data.planName} - ${data.billingCycle} (GHS ${data.price})`;
        
        const payload = {
            partnerId,
            planId: data.planId,
            billingCycle: data.billingCycle,
            subscriptionPlanDescription,
            subscriberIds: Array.from(selectedSubscriberIds.value)
        };

        const success = await assignSubscriptionToCommercialPartnerSubscribers(payload);

        if (success) {
            $toast.success(`Plan assigned to ${selectedSubscriberIds.value.size} subscribers`);
            closeSubscriptionModal();
            selectedSubscriberIds.value.clear();
        } else {
            $toast.error('Failed to assign plan');
        }
    } catch (error) {
        console.error('Error assigning plan:', error);
        $toast.error('An error occurred while assigning plan');
    } finally {
        isAssigningPlan.value = false;
        await fetchCommercialPartnerSubscriptionSummary();
    }
};


  
  


const handleFileUpload = async (file: File) => {
    const fileName = file.name.toLowerCase();
    
    // Check extension
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        $toast.error('Invalid file type. Please upload CSV or Excel.');
        return;
    }

    // CSV Pre-validation for Quota
    if (fileName.endsWith('.csv')) {
         try {
             const text = await file.text();
             // Simple basic CSV parsing: split lines, filter empty. 
             // IMPORTANT: This assumes 1 email per line or standard structure. 
             // We assume the file has a header.
             const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
             const count = rows.length > 0 ? rows.length - 1 : 0; // Exclude header
             
             if (count === 0) {
                 $toast.error('The uploaded file appears to be empty or only contains a header.');
                 return;
             }

             if ((parterDetails.value?.remainingQuota || 0) < count) {
                 $toast.error(`Upload aborted. You have ${parterDetails.value?.remainingQuota || 0} slots remaining but the file contains ${count} subscribers.`);
                 return;
             }
         } catch (e) {
             console.error('Error parsing CSV', e);
         }
    } 
    // Excel validation is skipped client-side due to missing libraries, strictly handled server-side or we rely on user trust/server rejection.
    
    await uploadFile(file);
};

const uploadFile = async (file: File) => {
    isUploading.value = true;
    uploadProgress.value = 0;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('partnerId', partnerId);
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += 10;
            }
        }, 200);
        
        // Call service
        const success = await uploadCommercialPartnerSubscribers(formData);
        
        clearInterval(progressInterval);
        uploadProgress.value = 100;
        
        if (success) {
            $toast.success('Subscribers uploaded successfully');
            await fetchSubscribers();
            await fetchCommercialPartnerDetails();
            closeUploadModal();
        } else {
             $toast.error('Failed to upload subscribers. Please check the file format and try again.');
        }

    } catch (error: any) {
        // If server returns quota error
        if (error.response?.data?.message?.includes('Quota')) {
             $toast.error(error.response.data.message);
        } else {
             $toast.error('An error occurred during upload.');
        }
        console.error(error);
    } finally {
        isUploading.value = false;
        uploadProgress.value = 0;
    }
};

const fetchSubscribers = async () => {
    isLoading.value = true;
    try {

        const result = await getCommercialPartnerSubscribers(partnerId);

        selectedSubscriberIds.value.clear();
         
        subscriberList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        console.error('Error fetching subscribers:', error);
        $toast.error('Unable to load subscribers.');
    } finally {
        isLoading.value = false;
    }
};


const fetchCommercialPartnerDetails = async () => {
    isLoading.value = true;
    try {
        const result = await getCommercialPartnerDetails(partnerId);
        parterDetails.value = result;
        
        
    } catch (error) {
        console.error('Error fetching commercial partner details:', error);
        $toast.error('Unable to load commercial partner details.');
    } finally {
        isLoading.value = false;
    }
};

const fetchCommercialPartnerSubscriptionSummary = async () => {

    isLoading.value = true;
    try {
        const result = await getCommercialPartnerSubscriptionSummary(partnerId);
        
        subscriptionSummary.value = result;  
        
    } catch (error) {
        console.error('Error fetching commercial partner subscription summary:', error);
        $toast.error('Unable to load commercial partner subscription summary.');
    } finally {
        isLoading.value = false;
    }
};



const confirmRemoveSubscriber = (subscriberId: string) => {
    subscriberIdToRemove.value = subscriberId;
    showConfirmModal.value = true;
};

const handleRemoveSubscriber = async () => {
    if (!subscriberIdToRemove.value) return;
    
    isRemovingSubscriber.value = true;
    try {
        const success = await removeCommercialPartnerSubscriber(partnerId, subscriberIdToRemove.value);
        if (success) {
            $toast.success('Subscriber removed successfully');
            await fetchSubscribers();
            if (subscriberIdToRemove.value) {
                selectedSubscriberIds.value.delete(subscriberIdToRemove.value);
            }
            await fetchCommercialPartnerDetails();
            showConfirmModal.value = false;
        } else {
            $toast.error('Failed to remove subscriber');
        }
    } catch (e) {
        $toast.error('Error removing subscriber');
    } finally {
        isRemovingSubscriber.value = false;
        subscriberIdToRemove.value = null;
    }
}

const handleUpdateSubscriberStatus = async (subscriberId: string, status: string) => {
    try {
        const success = await updateCommercialPartnerSubscriberStatus({
            partnerId,
            subscriberId,
            status
        });
        
        if (success) {
            $toast.success(`Subscriber ${status === 'Active' ? 'activated' : 'deactivated'} successfully`);
            await fetchSubscribers();
        } else {
            $toast.error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        $toast.error('An error occurred while updating status');
    } finally {
        closeDropdown();
    }
};

onMounted( async () => {
    if (partnerId) {
       await fetchSubscribers();
        await fetchCommercialPartnerDetails();
        await fetchCommercialPartnerSubscriptionSummary();
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e: any) => {
        if (!e.target.closest('.dropdown-container')) {
            closeDropdown();
        }
    });
});

useHead({
  title: computed(() => `Subscribers | ${parterDetails.value?.name || 'Loading...'}`)
});
</script>
