<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Ingestion Jobs</h1>
        <p class="mt-2 text-sm text-gray-700">Monitor the status of background publication ingestion processes.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 flex items-center gap-3">
        <button 
          @click="refreshJobs" 
          type="button" 
          class="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        > 
          Refresh
        </button>
        <button
          @click="navigateTo('/admin/content-management/ingestion')"
          type="button"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Ingestion
        </button>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Ingested At</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Publication Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ingested By</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-1/3">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="job in ingestionJobList" :key="job.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                    {{ formatDate(job.createdAt) }}
                    <div class="text-xs text-gray-500">{{ formatTime(job.createdAt) }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ longDateFormat(job.publicationDate) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                        {{ getInitials(job.ingestedBy) }}
                      </div>
                      {{ job.ingestedBy }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 align-middle">
                    <div v-if="job.status === 'Processing'" class="w-full">
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-medium text-blue-600">Processing...</span>
                        <span class="text-gray-500">{{ job.percentageCompletion }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${job.percentageCompletion}%` }"></div>
                      </div>
                    </div>
                    <div v-else-if="job.status === 'Completed'">
                      <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Completed
                      </span>
                    </div>
                    <div v-else-if="job.status === 'Failed'">
                      <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Failed
                      </span>
                      <p class="text-xs text-red-500 mt-1">Upload error</p>
                    </div>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button @click="deleteJob(job.id)" class="text-red-600 hover:text-red-900">Delete</button>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { IngestionJob } from "~/models";
const { $toast } = useNuxtApp();


useHead({
  title: 'Ingestion Jobs| Graphic News Plus'
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

const ingestionJobList = ref<IngestionJob[]>([]);

const isShimmerLoading = ref(true);
const isDeletingJob = ref(false);


const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedIngestionJobs()
}

const getPaginatedIngestionJobs = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getIngestionJobs(filters);

        ingestionJobList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        //$toast.error('Unable to fetch payments !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

definePageMeta({
  layout: 'admin'
})

interface Job {
  id: string;
  ingestedAt: string;
  publicationDate: string;
  ingestedBy: string;
  status: 'Processing' | 'Completed' | 'Failed';
  progress: number;
}

const jobs = ref<Job[]>([
  {
    id: '1',
    ingestedAt: new Date().toISOString(),
    publicationDate: '2025-12-16',
    ingestedBy: 'Admin User',
    status: 'Processing',
    progress: 45
  },
  {
    id: '2',
    ingestedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    publicationDate: '2025-12-15',
    ingestedBy: 'Editor Jane',
    status: 'Completed',
    progress: 100
  },
  {
    id: '3',
    ingestedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    publicationDate: '2025-12-14',
    ingestedBy: 'Admin User',
    status: 'Failed',
    progress: 0
  },
  {
    id: '4',
    ingestedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    publicationDate: '2025-12-13',
    ingestedBy: 'Editor John',
    status: 'Completed',
    progress: 100
  }
])

let progressInterval: number | null = null;

onMounted(() => {
  // Simulate progress for active jobs
  progressInterval = window.setInterval(() => {
    jobs.value.forEach(job => {
      if (job.status === 'Processing') {
        if (job.progress < 100) {
          job.progress += Math.floor(Math.random() * 5) + 1;
        } 
        if (job.progress >= 100) {
          job.progress = 100;
          job.status = 'Completed';
        }
      }
    });
  }, 1000);
});

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
});

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const refreshJobs = async () => {
   await getPaginatedIngestionJobs();
}

const deleteJob = async (id: string) => {

  isDeletingJob.value = true;

  try {

    let isSuccessful = await deleteIngestionJob({ jobId: id });
    if(isSuccessful) {
      $toast.success('Ingestion job deleted successfully !');
      await getPaginatedIngestionJobs();
    }

  } catch (error) {
    $toast.error('Unable to delete ingestion job !');
    isDeletingJob.value = false;
    
  } finally {
    isDeletingJob.value = false;
  }
  
}


const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedIngestionJobs();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedIngestionJobs();

  });
</script>