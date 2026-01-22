<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Users</h1>
        <p class="mt-2 text-sm text-gray-700">Manage users</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Create User
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
        Filters
      </button>
    </div>

    <!-- Filters -->
    <div v-show="showFilters" class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
      <!-- Search -->
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input 
          type="text" 
          v-model="tempSearchQuery" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
          placeholder="Search campaigns..." 
        />
      </div>

      <!-- Status Filter -->
      <select v-model="tempSelectedStatus" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
        <option value="all">All Statuses</option>
        <option value="Sent">Sent</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Draft">Draft</option>
      </select>

       <!-- Channel Filter -->
      <select v-model="tempSelectedChannel" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
        <option value="all">All Channels</option>
        <option value="email">Email</option>
        <option value="app-notification">In-App Notification</option>
      </select>

      <!-- Filter Actions -->
      <div class="flex items-center gap-2">
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

    <!-- Campaigns List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Campaign Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Target Audience</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reach</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Engagement</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="campaign in campaignList" :key="campaign.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ campaign.name }}</div>
              <!-- send action as campaignType -->
              <span
                v-if="campaign.campaignType === 'send_now'"
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-1"
              >
                Instant
              </span>
              <span
                v-else
                class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 mt-1"
              >
                Scheduled @ {{ longDateAndTimeFormat(campaign.scheduledTime) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <span v-if="campaign.channel == 'email'" class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Email</span>
                <span v-if="campaign.channel == 'app-notification'" class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">In-App Notification</span>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="campaign.targetAudience == 'all'"> All Users </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="campaign.targetAudience == 'subscribers'"> Active Subscribers </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="campaign.targetAudience == 'inactive-subscribers'"> Inactive Subscribers </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="campaign.targetAudience == 'new-users'"> New Users </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="campaign.targetAudience == 'churned'"> Churned Users </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ campaign.reach }} users</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="{
                  'bg-green-50 text-green-700 ring-green-600/20': campaign.status === 'Sent',
                  'bg-yellow-50 text-yellow-800 ring-yellow-600/20': campaign.status === 'Scheduled',
                  'bg-gray-50 text-gray-600 ring-gray-500/10': campaign.status === 'Draft',
                }"
              >
                {{ campaign.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
             {{
                campaign.clicks && campaign.reach
                  ? ((campaign.clicks / campaign.reach) * 100).toFixed(1)
                  : '0.0'
              }}%

            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                class="text-green-600 hover:text-green-800 mr-3"
                @click="broadcastCampaign(campaign)"
              >
                Publish
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click="delCampaign(campaign)"
              >
                Delete
              </button>
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

    

    <!-- Create/Edit Modal -->
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-xl bg-gray-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-100">
                   <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                      Create New Campaign
                    </DialogTitle>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-200px)] min-h-[500px]">
                  <!-- Left: Form -->
                  <div class="p-6 overflow-y-auto space-y-6 bg-white border-r border-gray-200">
                    
                    <!-- Basic Info -->
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Campaign Name</label>
                      <input type="text" v-model="form.name" class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" placeholder="e.g. Weekly Newsletter" />
                    </div>

                    <!-- Audience -->
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Target Audience</label>
                      <select v-model="form.targetAudience" class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                        <option value="all">All Users</option>
                        <option value="subscribers">Active Subscribers</option>
                        <option value="inactive-subscribers">Inactive Subscribers</option>
                        <option value="new-users">New Users</option>
                        <option value="churned">Churned Users</option>
                      </select>
                    </div>

                    <!-- Channels -->
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Channels</label>
                      <select v-model="form.channel" class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                        <option disabled value="all">All</option>
                        <option value="app-notification">In-App Notification</option>
                        <option value="email">Email</option>
                      </select>
                    </div>

                    <!-- Campaign Type -->
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Campaign Type</label>
                      <div class="mt-2 space-y-2">
                        <label class="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="radio"
                            value="send_now"
                            v-model="form.campaignType"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
                          />
                          Send Now
                        </label>

                        <label class="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="radio"
                            value="schedule"
                            v-model="form.campaignType"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
                          />
                          Schedule for later
                        </label>
                      </div>
                    </div>

                    <!-- Scheduled Date -->
                    <div v-if="form.campaignType === 'schedule'">
                      <label class="block text-sm font-medium leading-6 text-gray-900">
                        Scheduled Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        v-model="form.scheduledTime"
                        class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>


                    <div v-if="form.channel == 'email'" class="border-t border-gray-200 my-4"></div>

                    <!-- Email Content -->
                    <div v-if="form.channel == 'email'" class="space-y-4 animate-fadeIn">
                       <h4 class="text-sm font-semibold text-gray-900 flex items-center">
                         <EnvelopeIcon class="h-4 w-4 mr-1"/> Email Content
                       </h4>
                       <div>
                        <label class="block text-xs font-medium text-gray-700">Subject Line</label>
                        <input type="text" v-model="form.subject" class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                       </div>
                       <div>
                        <label class="block text-xs font-medium text-gray-700">Body</label>
                        <textarea v-model="form.messageBody" rows="4" class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"></textarea>
                       </div>
                    </div>

                    <div v-if="form.channel == 'app-notification'" class="border-t border-gray-200 my-2"></div>

                    <!-- Notification Content -->
                    <div v-if="form.channel == 'app-notification'" class="space-y-4 animate-fadeIn">
                       <h4 class="text-sm font-semibold text-gray-900 flex items-center">
                         <BellAlertIcon class="h-4 w-4 mr-1"/> Notification Content
                       </h4>
                       <div>
                        <label class="block text-xs font-medium text-gray-700">Title</label>
                        <input type="text" v-model="form.subject" maxlength="50" class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        <p class="mt-1 text-xs text-gray-500 text-right">{{ form.subject.length }}/50</p>
                       </div>
                       <div>
                        <label class="block text-xs font-medium text-gray-700">Message</label>
                        <textarea v-model="form.messageBody" rows="2" maxlength="150" class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"></textarea>
                        <p class="mt-1 text-xs text-gray-500 text-right">{{ form.messageBody.length }}/150</p>
                       </div>
                    </div>

                    <!-- Deep Link -->
                    <div>
                      <label class="block text-sm font-medium leading-6 text-gray-900">Deep Link</label>
                      <input type="text" v-model="form.deepLink" class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" placeholder="e.g. https://dev.graphicnewsplus.com/newspapers" />
                    </div>

                    <p class="text-sm font-bold text-gray-700 mr-auto sm:mr-auto sm:self-center mb-2 sm:mb-0">
                        Note: All campaigns are subject to approval by users with the required permissions before they are sent.
                    </p>

                  </div>

                  <!-- Right: Preview -->
                  <div class="p-6 bg-gray-50 flex flex-col items-center justify-center overflow-y-auto">
                    <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Preview</p>
                    
                    <!-- Notification Preview -->
                    <div v-if="form.channel == 'app-notification'" class="w-[300px] mb-8">
                       <p class="text-xs text-gray-500 mb-2 text-center">Mobile Lock Screen</p>
                        <div class="bg-gray-800 rounded-2xl p-4 text-white shadow-2xl border border-gray-700">
                          <div class="flex items-start gap-3">
                            <div class="h-8 w-8 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
                               <span class="text-xs font-bold">NP</span>
                            </div>
                            <div class="flex-1 min-w-0">
                               <div class="flex justify-between items-baseline mb-0.5">
                                 <h5 class="text-sm font-semibold">News Plus</h5>
                                 <span class="text-xs text-gray-400">now</span>
                               </div>
                               <p class="text-sm font-medium truncate">{{ form.subject || 'Notification Title' }}</p>
                               <p class="text-xs text-gray-300 line-clamp-2">{{ form.messageBody || 'Notification message will appear here...' }}</p>
                            </div>
                          </div>
                        </div>
                    </div>

                    <!-- Email Preview (Simplified) -->
                     <div v-if="form.channel == 'email'" class="w-full max-w-[350px]">
                       <p class="text-xs text-gray-500 mb-2 text-center">Email Client</p>
                       <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                         <div class="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2">
                            <div class="h-2 w-2 rounded-full bg-red-400"></div>
                            <div class="h-2 w-2 rounded-full bg-yellow-400"></div>
                            <div class="h-2 w-2 rounded-full bg-green-400"></div>
                         </div>
                         <div class="p-4">
                           <div class="border-b pb-2 mb-2">
                             <p class="text-xs text-gray-500">Subject: <span class="text-gray-900 font-medium">{{ form.subject || 'Subject Line' }}</span></p>
                           </div>
                           <div class="space-y-2">
                              <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                              <div class="h-2 bg-gray-200 rounded w-full"></div>
                              <div class="h-2 bg-gray-200 rounded w-5/6"></div>
                              <div class="mt-2 text-xs text-gray-600">
                                {{ form.messageBody || 'Your email content will appear here...' }}
                              </div>
                           </div>
                         </div>
                       </div>
                    </div>
                    
                    <div v-if="form.channel == 'all'" class="text-center text-gray-400">
                      <p>Select a channel to see preview</p>
                    </div>

                  </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                  
                  <button
                    type="button"
                    class="inline-flex w-full justify-center items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                    @click="saveCampaign"
                    :disabled="isSaving"
                  >
                   <svg
                      v-if="isSaving"
                      class="h-4 w-4 animate-spin text-white stroke-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75 fill-current"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>


                    <span>{{ isSaving ? 'Saving...' : 'Submit' }}</span>
                  </button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeModal">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { EnvelopeIcon, BellAlertIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es";
import type { Campaign } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Campaigns | Graphic News Plus'
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

const campaignList = ref<Campaign[]>([]);

const isShimmerLoading = ref(true);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedCampaigns()
}

const getPaginatedCampaigns = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getCampaigns(filters);

        campaignList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch campaigns !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

const stats = [
  { name: 'Total Campaigns', stat: '71' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
]


// Filters
const showFilters = ref(false)

// Active filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedChannel = ref('all')

// Temporary filter models (for inputs)
const tempSearchQuery = ref('')
const tempSelectedStatus = ref('all')
const tempSelectedChannel = ref('all')

const applyFilters = () => {
  searchQuery.value = tempSearchQuery.value
  selectedStatus.value = tempSelectedStatus.value
  selectedChannel.value = tempSelectedChannel.value
}

const resetFilters = () => {
  tempSearchQuery.value = ''
  tempSelectedStatus.value = 'all'
  tempSelectedChannel.value = 'all'
  applyFilters()
}

 

const isModalOpen = ref(false)
const isSaving = ref(false)

const form = ref({
  name: '',
  targetAudience: 'all',
  channel: "app-notification",
  subject: "",
  messageBody: "",
  deepLink: "",
  campaignType: 'send_now',
  scheduledTime: '',
})

const openCreateModal = () => {
  form.value = {
    name: "",
    targetAudience: 'all',
    channel: "app-notification",
    subject: "",
    messageBody: "",
    deepLink: "",
    campaignType: 'send_now',
    scheduledTime: '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCampaign = async () => {
   
  isSaving.value = true;

  try {
    await createCampaign(form.value);
    // Optimistic update or refresh needed here ideally, but for now just close
    isModalOpen.value = false;
    await getPaginatedCampaigns();
    $toast.success('Campaign created successfully');
  } catch (error) {
    console.error('Failed to create campaign', error)
    alert('Failed to create campaign. Please try again.')
  }
  finally {
    isSaving.value = false;
  }
}

const broadcastCampaign = async (campaign: Campaign) => {
  try {
    await publishCampaign({campaignId: campaign.id});
    $toast.success('Campaign published successfully');
    await getPaginatedCampaigns();
  } catch (error) {
    console.error('Failed to publish campaign', error);
    $toast.error('Failed to publish campaign');
  }
};

const delCampaign = async (campaign: Campaign) => {

  try {
    await deleteCampaign({campaignId: campaign.id });
    $toast.success('Campaign deleted successfully');
    await getPaginatedCampaigns();
  } catch (error) {
    console.error('Failed to delete campaign', error);
    $toast.error('Failed to delete campaign');
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedCampaigns();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedCampaigns();

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