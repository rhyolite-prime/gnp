<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Subscribers</h1>
        <p class="mt-2 text-sm text-gray-700">Manage subscribers</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          Create Subscriber
        </button>
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
            placeholder="Search Subscribers..."
          />
        </div>
      </div>
       
    </div>

    <!-- Campaigns List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
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

          <tr v-if="isShimmerLoading" class="animate-pulse">
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
                <p class="text-sm">No subscribers found.</p>
                <button @click="openUploadModal" class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">Upload a list to get started</button>
            </td>
          </tr>

          <tr v-else v-for="sub in subscriberList" :key="sub.id" class="hover:bg-gray-50 transition-colors">
             
              <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{{ sub.firstName }} {{ sub.lastName }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.email }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.phoneNumber || 'N/A' }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longDateAndTimeFormat(sub.createdAt) }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ sub.subscriptionPlanDescription }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-green-50 text-green-700 ring-green-600/20': sub.status === 'Active' || sub.status === 'active',
                      'bg-red-50 text-red-700 ring-red-600/20': sub.status === 'Inactive' || sub.status === 'inactive'
                    }">
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
                                @click.prevent="openDetailModal(sub)">
                                View Details
                            </button>
                            <button 
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                @click.prevent="openDetailModal(sub)">
                                Update
                            </button>
                            <button v-if="!sub.isActive"
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                @click.prevent="handleUpdateSubscriberStatus(sub.id, 'Active')">
                                Activate
                            </button>
                            <button 
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                @click.prevent="resetSubscriberPassword(sub.id)"
                            >
                                Reset Password
                            </button>
                            <button v-if="sub.isActive"
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

    <!-- Partner subscriber Modal -->
    <PartnerSubscriberModal 
      v-if="showCreateModal" 
      @close="closeCreateModal" 
      @save="handleCreateSubscriber"
      :loading="isCreatingSubscriber"
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowLeftIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, CheckCircleIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es";
import type { Subscriber } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Subscribers | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 30,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const subscriberList = ref<Subscriber[]>([]);
const showDetailModal = ref(false);
const selectedSubscriber = ref<Subscriber | null>(null);

const isShimmerLoading = ref(true);
const showCreateModal = ref(false);
const isCreatingSubscriber = ref(false);
const activeDropdownId = ref<string | null>(null);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedSubscribers()
}

  
const closeCreateModal = () => {
    showCreateModal.value = false;
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

const getPaginatedSubscribers = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getSubscribers(filters);

        subscriberList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch subscribers !');
    } finally {
        isShimmerLoading.value = false;
    }

}



const toggleDropdown = (id: string) => {
    if (activeDropdownId.value === id) {
        activeDropdownId.value = null;
    } else {
        activeDropdownId.value = id;
    }
};

// Filters
const showFilters = ref(false)

// Active filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedChannel = ref('all')

const isModalOpen = ref(false)
const isSaving = ref(false)


const openCreateModal = () => {

   showCreateModal.value = true;
}

const closeModal = () => {
  isModalOpen.value = false
}


const handleCreateSubscriber = async (subscriberData: any) => {
    isCreatingSubscriber.value = true;
    try {
        const payload = {
            ...subscriberData,
            
        };
        
        const success = await createSubscriber(payload);
        
        if (success) {
            $toast.success('Subscriber added successfully');
            closeCreateModal();
            await getPaginatedSubscribers();
            
        } else {
            closeCreateModal();
             $toast.error('Failed to add subscriber');
        }
    } catch (error: any) {
        console.error('Error adding subscriber:', error);
      closeCreateModal();
         
    } finally {
        isCreatingSubscriber.value = false;
      closeCreateModal();
        await getPaginatedSubscribers();
    }
};


const resetSubscriberPassword = async (subscriberId: string) => {

    try {
        const success = await resetStandardSubscriberPassword(subscriberId);
        
        if (success) {
            $toast.success('Subscriber Password Reset Successfully.');
            await fetchSubscribers();
        } else {
            $toast.error('Failed to reset subscriber password');
        }
    } catch (error) {
         
        $toast.error('An error occurred while reseting subsriber password');
    } finally {
        closeDropdown();
    }
};


const delSubscriber = async (subscriber: Subscriber) => {

  try {
    await deleteSubscriber(subscriber.id);
    $toast.success('Subscriber deleted successfully');
    await getPaginatedSubscribers();
  } catch (error) {
    console.error('Failed to delete subscriber.', error);
    $toast.error('Failed to delete subscriber.');
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedSubscribers();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedSubscribers();

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
</style>