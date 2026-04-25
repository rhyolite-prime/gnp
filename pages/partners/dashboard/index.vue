<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl mb-3 shadow-sm border border-slate-100">
           <div class="w-6 h-6 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-md flex items-center justify-center shadow-sm text-white font-bold text-xs">
             {{ partnerInitials }}
           </div>
           <span class="text-md font-bold text-slate-800 tracking-tight">{{ partnerName }}</span>
           <span class="px-2 py-0.5 ml-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md tracking-wider">Partner</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
        <p class="text-sm text-slate-500 mt-1">High-level insights about your subscriptions and organization usage.</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="openUploadModal"
          class="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap font-bold text-sm">
          <DocumentArrowUpIcon class="w-5 h-5 mr-2 text-slate-400" />
          Upload CSV
        </button>

        <button 
          @click="isSubscriberModalOpen = true"
          class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm"
        >
          <PlusCircleIcon class="w-5 h-5 mr-2" />
          Add Subscriber
        </button>

      </div>
    </div>
       
       <!-- Stats Grid -->
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

         <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <component :is="UsersIcon" class="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
              </div>
              <span
                :class="[
                  'text-sm font-bold flex items-center bg-opacity-10 px-2 py-1 rounded-lg', partnerOverviewStats?.activeMembersChangeType === 'increase'
                    ? 'text-green-600 bg-green-50' : partnerOverviewStats?.activeMembersChangeType === 'decrease'
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 bg-slate-100'
                ]">

                 <span v-if="partnerOverviewStats?.activeMembersChangeType === 'increase'">
                  +{{ partnerOverviewStats?.activeMembersChange }}
                </span>  
                <span v-else-if="partnerOverviewStats?.activeMembersChangeType === 'decrease'">
                  -{{ partnerOverviewStats?.activeMembersChange }}
                </span>  
                <span v-else>
                 No change
                </span>
              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium">Active Members</h3>
            <p class="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{{ partnerOverviewStats?.activeMembers }}</p>
         </div>

         <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <component :is="TicketIcon" class="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
              </div>
              <span class="text-sm font-bold flex items-center bg-opacity-10 px-2 py-1 rounded-lg text-green-600 bg-green-50">
                 {{ toNumber(partnerOverviewStats?.remainingQuota) }} available
              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium">Total Quota</h3>
            <p class="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{{ toNumber(partnerOverviewStats?.totalQuota) }}</p>
         </div>
          
         <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <component :is="ArrowTrendingUpIcon" class="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
              </div>
              <span :class="[
                  'text-sm font-bold flex items-center bg-opacity-10 px-2 py-1 rounded-lg',
                  partnerOverviewStats?.engagementRateChangeType === 'increase'
                    ? 'text-green-600 bg-green-50'
                    : partnerOverviewStats?.engagementRateChangeType === 'decrease'
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 bg-slate-100'
                ]"
              >
                 <span v-if="partnerOverviewStats?.engagementRateChangeType === 'increase'">
                  +{{ partnerOverviewStats?.engagementRateChange }}
                </span>  
                <span v-else-if="partnerOverviewStats?.engagementRateChangeType === 'decrease'">
                  -{{ partnerOverviewStats?.engagementRateChange }}
                </span>  
                <span v-else>
                  No change
                </span>

              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium">Engagement Rate</h3>
            <p class="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{{ partnerOverviewStats?.engagementRate }} %</p>
         </div>

         <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <component :is="ChartBarIcon" class="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
              </div>
              <span :class="[
                  'text-sm font-bold flex items-center bg-opacity-10 px-2 py-1 rounded-lg',
                  partnerOverviewStats?.activeSessionsChangeType === 'increase'
                    ? 'text-green-600 bg-green-50'
                    : partnerOverviewStats?.activeSessionsChangeType === 'decrease'
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 bg-slate-100'
                ]">
                <span v-if="partnerOverviewStats?.activeSessionsChangeType === 'increase'">
                  +{{ partnerOverviewStats?.activeSessionsChange }}
                </span>  
                <span v-else-if="partnerOverviewStats?.activeSessionsChangeType === 'decrease'">
                  -{{ partnerOverviewStats?.activeSessionsChange }}
                </span>  
                <span v-else>
                  No change
                </span>
              
              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium">Active Sessions</h3>
            <p class="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{{ partnerOverviewStats?.activeSessions }} %</p>
         </div>
          

       </div>

       <!-- Main Content Area -->
       <div class="grid lg:grid-cols-3 gap-8">
         
         <!-- Members Table (Spans 2 columns) -->
         <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
               <div>
                 <h2 class="text-xl font-bold text-slate-900 tracking-tight"> Subscriber Directory</h2>
                 <p class="text-sm text-slate-500 mt-1">Viewing all authorized subscribers in your organization.</p>
               </div>
               <div class="relative max-w-xs w-full">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <MagnifyingGlassIcon class="w-5 h-5 text-slate-400" />
                 </div>
                 <input type="text" v-model="filters.query" placeholder="Search name or Phone Number..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner" />
               </div>
            </div>
            
            <div class="overflow-x-auto flex-1">
               <table class="w-full text-left border-collapse">
                 <thead>
                   <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                     <th class="px-6 py-4">Name</th>
                     <th class="px-6 py-4">Phone</th>
                     <th class="px-6 py-4">Last Active</th>
                     <th class="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-100">
                   <tr v-for="subscriber in subscriberList" :key="subscriber.id" class="hover:bg-slate-50 transition-colors group">
                     <td class="px-6 py-4">
                       <div class="flex items-center">
                         <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                           {{ subscriber.firstName.charAt(0) }}
                         </div>
                         <div class="ml-4">
                           <p class="text-sm font-bold text-slate-900">{{ subscriber.firstName }} {{ subscriber.lastName }}</p>
                           <p class="text-xs text-slate-500 font-medium">{{ subscriber.email }}</p>
                         </div>
                       </div>
                     </td>

                      <td class="px-6 py-4 text-sm text-slate-600 font-medium">
                      {{ subscriber.phoneNumber }}
                      </td>
                     
                     <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                       {{ longDateAndTimeFormat(subscriber.lastActive) }}
                     </td>
                     <td class="px-6 py-4 text-right">
                       <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                         <EllipsisVerticalIcon class="w-5 h-5" />
                       </button>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
            
            <div class="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span class="text-sm text-slate-500 font-medium">Showing <span class="font-bold text-slate-900">{{ paginationParams.lowerBound }}</span> to <span class="font-bold text-slate-900">{{ paginationParams.upperBound }}</span> of <span class="font-bold text-slate-900"> {{ paginationParams.totalCount }}</span> members</span>
              <div class="flex space-x-2">
                <button class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 hover:border-slate-300 transition-all shadow-sm" :disabled="paginationParams.lowerBound === 1" @click="onPreviousPage()">Previous</button>
                <button class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm" :disabled="paginationParams.upperBound === paginationParams.totalCount" @click="onNextPage()">Next</button>
              </div>
            </div>
         </div>

         <!-- Side Panel (Quick Info & Insights) -->
         <div class="space-y-8">
           <!-- Subscription Details -->
           <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
             <h3 class="text-lg font-bold text-slate-900 mb-5 tracking-tight">Subscription Plan</h3>
             
             <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
               <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
               <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-primary-600/20 rounded-full blur-2xl"></div>
               <div class="relative z-10">
                 <div class="text-xs font-black uppercase tracking-widest text-primary-400 mb-1">Corporate Premium</div>
                 <div class="text-3xl font-extrabold mb-6 tracking-tight">{{ partnerName }}</div>
                 
                 <div class="space-y-4 mb-8">
                   <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                     <span class="text-slate-400 font-medium">Billing Cycle</span>
                     <span class="font-bold">Annual</span>
                   </div>
                   <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                     <span class="text-slate-400 font-medium">Next Renewal</span>
                     <span class="font-bold">Dec 15, 2026</span>
                   </div>
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-400 font-medium">Licenses Used</span>
                     <span class="font-bold">2,845 <span class="text-slate-500 font-normal">/ 3,000</span></span>
                   </div>
                 </div>
                 
                 <button class="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm">
                   Manage Billing
                 </button>
               </div>
             </div>
           </div>

           <!-- Recent Activity -->
           <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
             <div class="flex items-center justify-between mb-6">
               <h3 class="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
               <button class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
             </div>
             
             <div class="space-y-6">
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
                   <CheckCircleIcon class="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">Batch Import Successful</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">150 new members imported via CSV.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">2 hours ago</span>
                 </div>
               </div>
               
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                   <UserPlusIcon class="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">New Department Added</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">'Engineering' cohort granted access.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">Yesterday</span>
                 </div>
               </div>
               
               <div class="flex items-start gap-4 group">
                 <div class="w-10 h-10 rounded-xl bg-yellow-50 flex-shrink-0 flex items-center justify-center border border-yellow-100 group-hover:bg-yellow-100 transition-colors">
                   <ClockIcon class="w-5 h-5 text-yellow-600" />
                 </div>
                 <div>
                   <p class="text-sm text-slate-900 font-bold">Renewal Reminder</p>
                   <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Corporate plan renews in 30 days.</p>
                   <span class="text-xs text-slate-400 mt-1.5 block font-medium">3 days ago</span>
                 </div>
               </div>
             </div>
           </div>
           
         </div>
       </div>
       
       <!-- Add Subscriber Modal -->
       <PartnerSubscriberModal 
         v-if="isSubscriberModalOpen" 
         @close="closeModal" 
         @save="savePartnerSubscriber"
         :loading="isSaving"
       />

       <!-- Subscriber Upload Modal -->
       <SubscriberUploadModal 
         v-if="showUploadModal" 
         @close="closeUploadModal" 
         @upload="handleFileUpload"
         :uploading="isUploading"
         :upload-progress="uploadProgress"
         :remaining-quota="partnerOverviewStats?.remainingQuota || 0"
       />
  </div>
</template>

<script setup lang="ts">
import { 
  UsersIcon, 
  DocumentArrowUpIcon, 
  UserPlusIcon, 
  PlusCircleIcon,
  ChartBarIcon, 
  TicketIcon, 
  ArrowTrendingUpIcon, 
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'

import { usePartnerAuthStore } from '~/stores/partnerAuth';
import type { PartnerSubscriber, PartnerStats } from "~/models";
import { isEmpty, debounce } from "lodash-es";
const { $toast } = useNuxtApp();

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Partner Dashboard - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Institutional partner dashboard for managing corporate subscriptions and members.' }
  ]
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

const subscriberList = ref<PartnerSubscriber[]>([]);
const isShimmerLoading = ref(true);
const isSubscriberModalOpen = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)
const subscriberToDelete = ref<PartnerSubscriber | null>(null)
const partnerOverviewStats = ref<PartnerStats | null>(null)
const showUploadModal = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedPartnerSubscribers()
}

const onPreviousPage = async () => {
    if (paginationParams.lowerBound === 1) return;

    filters.pageNo -= 1;
    router.replace({ name: route.name ?? '', query: { ...route.query, pageNo: filters.pageNo } });
    await getPaginatedPartnerSubscribers();
  };

  const onNextPage = async () => {
    if (paginationParams.upperBound === paginationParams.totalCount) return;

    filters.pageNo += 1;
    router.replace({ name: route.name ?? '', query: { ...route.query, pageNo: filters.pageNo } });
    await getPaginatedPartnerSubscribers();
  };

const getPaginatedPartnerSubscribers = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getPartnerSubscribers(filters);

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


 const getParterOverviewStats = async () => {

    try {

        partnerOverviewStats.value = await getPartnerStats();
        
 
    } catch (error) {
        $toast.error('Unable to fetch partner stats !');
    } finally {
        isShimmerLoading.value = false;
    }

 }
 const closeModal = () => {
  isSubscriberModalOpen.value = false
}

const savePartnerSubscriber = async (subscriberData: any) => {
   
  isSaving.value = true;

  try {
    await createPartnerSubscriber(subscriberData);
    $toast.success('Subscriber added successfully');
    
    isSubscriberModalOpen.value = false;
    await getPaginatedPartnerSubscribers();
    await getParterOverviewStats();
  } catch (error: any) {
    console.error('Failed to save subscriber', error)
    if (error.response?.data?.message?.includes('Quota')) {
      $toast.error(error.response.data.message);
    } else {
      $toast.error('Failed to add subscriber. Please try again.')
    }
  }
  finally {
    isSaving.value = false;
  }
}

const openUploadModal = () => {
    showUploadModal.value = true;
};

const closeUploadModal = () => {
    showUploadModal.value = false;
    uploadProgress.value = 0;
};

const handleFileUpload = async (file: File) => {
    const fileName = file.name.toLowerCase();
    
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        $toast.error('Invalid file type. Please upload CSV or Excel.');
        return;
    }

    if (fileName.endsWith('.csv')) {
         try {
             const text = await file.text();
             const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
             const count = rows.length > 0 ? rows.length - 1 : 0; 
             
             if (count === 0) {
                 $toast.error('The uploaded file appears to be empty or only contains a header.');
                 return;
             }

             if ((partnerOverviewStats.value?.remainingQuota || 0) < count) {
                 $toast.error(`Upload aborted. You have ${partnerOverviewStats.value?.remainingQuota || 0} slots remaining but the file contains ${count} subscribers.`);
                 return;
             }
         } catch (e) {
             console.error('Error parsing CSV', e);
         }
    } 
    
    await uploadFile(file);
};

const uploadFile = async (file: File) => {
    isUploading.value = true;
    uploadProgress.value = 0;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += 10;
            }
        }, 200);
        
        const success = await bulkUploadSubscriber(formData);
        
        clearInterval(progressInterval);
        uploadProgress.value = 100;
        
        if (success) {
            $toast.success('Subscribers uploaded successfully');
            await getPaginatedPartnerSubscribers();
            await getParterOverviewStats();
            closeUploadModal();
        } else {
             $toast.error('Failed to upload subscribers. Please check the file format and try again.');
        }

    } catch (error: any) {
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

const delPartnerSubscriber = (coupon: PartnerSubscriber) => {
  subscriberToDelete.value = coupon
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  subscriberToDelete.value = null
}

const partnerAuthStore = usePartnerAuthStore();

const partnerName = computed(() => {
  return partnerAuthStore.partner?.partnerName || 'Daily Graphic'
})

const partnerInitials = computed(() => {
  const name = partnerName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
})

const partnerDomain = computed(() => {
  return partnerName.value.toLowerCase().replace(/\s+/g, '') + '.com'
})

const stats = [
  { name: 'Active Members', value: '2,845', change: '+12.5%', isPositive: true, icon: UsersIcon },
  { name: 'Total Quota', value: '3,000', change: '155 available', isPositive: true, icon: TicketIcon },
  { name: 'Engagement Rate', value: '78%', change: '+5.4%', isPositive: true, icon: ArrowTrendingUpIcon },
  { name: 'Active Sessions', value: '432', change: '-2.1%', isPositive: false, icon: ChartBarIcon },
]


const getStatusColor = (status: string) => {
  switch(status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200'
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}


const confirmDelete = async () => {
  if (!subscriberToDelete.value) return;

  try {
    await deleteCoupon({ id: subscriberToDelete.value.id });
    $toast.success('Subscriber deleted successfully.');
    await getPaginatedPartnerSubscribers();
  } catch (error) {
    console.error('Failed to delete subscriber.', error);
    $toast.error('Failed to delete subscriber.');
  } finally {
    closeDeleteModal();
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedPartnerSubscribers();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedPartnerSubscribers();
    await getParterOverviewStats();

  });
</script>

<style scoped>
/* Scoped styles */
</style>
