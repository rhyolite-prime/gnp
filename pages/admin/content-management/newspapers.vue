<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Newspapers</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all newspapers and publications including their title, date, price, and status.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink 
          to="/admin/content-management/ingestion"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Ingest New
        </NuxtLink>
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
    <div v-show="showFilters" class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
      <!-- Search -->
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input 
          type="text" 
          v-model="filters.query" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
          placeholder="Search publications..." 
        />
      </div>

      <!-- Date Range Filter -->
      <div class="flex items-center space-x-2 bg-white rounded-md ring-1 ring-inset ring-gray-300 px-2 py-1 shadow-sm">
        <input 
          type="date" 
          v-model="filters.startDate" 
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Start Date"
        />
        <span class="text-gray-400 text-sm">to</span>
        <input 
          type="date" 
          v-model="filters.endDate" 
          class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="End Date"
        />
      </div>
      
      <!-- Status Filter -->
      <select v-model="filters.status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
        <option value="">All Statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
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

    <!-- Table -->
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Publication</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stats</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ingested On</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="paper in newspaperList" :key="paper.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <div class="flex items-center">
                      <div class="h-15 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3 border border-gray-200">
                        <img
                          v-if="thumbnailUrls[paper.thumbnailId]"
                          :src="thumbnailUrls[paper.thumbnailId]"
                          alt="Thumbnail"
                          class="h-full w-full object-cover"
                        />
                        <div
                          v-else
                          class="h-full w-full flex items-center justify-center text-xs text-cool-gray-400"
                        >
                          IMG
                        </div>
                      </div>
                      <div>
                        {{ paper.title }}
                        <div class="text-xs font-normal text-gray-500 truncate max-w-[200px]">{{ paper.fullDescription}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ paper.publicationName }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ standardDateFormat(paper.publicationDate) }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span v-if="paper.isFree" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Free</span>
                    <span v-else>₵{{ paper.price }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                      :class="paper.isPublished
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'"
                    >
                      {{ paper.isPublished ? 'Published' : 'Draft' }}
                    </span> 
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex flex-col text-xs">
                       <span class="flex items-center"><EyeIcon class="h-3 w-3 mr-1"/> {{ paper.views }}</span>
                       <span class="flex items-center mt-0.5"><shopping-cart-icon class="h-3 w-3 mr-1"/> {{ paper.sales }}</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longDateAndTimeFormat(paper.createdAt) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Menu as="div" class="relative inline-block text-left">
                      <div>
                        <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          <span class="sr-only">Open options</span>
                          <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                        </MenuButton>
                      </div>

                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <button :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Edit</button>
                            </MenuItem>
                            <MenuItem v-if="!paper.isPublished" v-slot="{ active }">
                              <button @click="publishPaper(paper.id)" :class="[active ? 'bg-gray-100 text-green-700' : 'text-green-700', 'block w-full px-4 py-2 text-left text-sm']">Publish</button>
                            </MenuItem>
                             <MenuItem v-if="!paper.isFree" v-slot="{ active }">
                              <button :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Make Free</button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                              <button :class="[active ? 'bg-gray-100 text-red-900' : 'text-red-700', 'block w-full px-4 py-2 text-left text-sm']">Delete</button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </td>
                </tr>
                <tr v-if="newspaperList.length === 0">
                  <td colspan="7" class="py-8 text-center text-sm text-gray-500">
                    No publications found matching your filters.
                  </td>
                </tr>
              </tbody>
            </table>
 
            <!-- Simple Pagination -->
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

import { MagnifyingGlassIcon, EyeIcon, ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { NewsPaper, Payment } from "~/models";
const { $toast } = useNuxtApp();

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
  status: '',
  startDate: '',
  endDate: ''
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const newspaperList = ref<NewsPaper[]>([]);
const thumbnailUrls = reactive<Record<string, string>>({});

const isShimmerLoading = ref(true);

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Newspapers | Graphic News Plus'
})


const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
   await getPaginatedNewsPapers()
}

const getPaginatedNewsPapers = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getNewsPaperPublications(filters);

        newspaperList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch newspapers !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

 watch(
    newspaperList,
    (papers) => {
      papers.forEach(paper => {
        if (paper.thumbnailId) {
          loadImageAsBlob(paper.thumbnailId);
        }
      });
    },
    { immediate: true }
  );

 const loadImageAsBlob = async (fileId: string) => {
    if (!fileId || thumbnailUrls[fileId]) return;

    try {
      const response = await getSecureThumbnail(fileId);
      const blob = await fetch(response).then(r => r.blob());
      const objectUrl = URL.createObjectURL(blob);
      thumbnailUrls[fileId] = objectUrl;
    } catch (error) {
      console.error('Failed to load thumbnail', error);
    }
  };

const publishPaper = async (paperId: string ) => {
  try {
    let isPublished = await publishNewspaperPublication({id: paperId});
    if (!isPublished) {
      $toast.error('Failed to publish publication');
      return;
    }

    $toast.success('Publication published successfully');

    const paper = newspaperList.value.find(p => p.id === paperId);
    if (paper) {
      paper.isPublished = true;
    }
  } catch (error) {
    $toast.error('Failed to publish publication.');
  }
};

// Filters
const showFilters = ref(false)


const applyFilters = () => {
  filters.pageNo = 1
  const filteredQuery = filterQueryParams({ ...route.query, ...filters });
  router.replace({ name: route.name ?? '', query: filteredQuery });

  getPaginatedNewsPapers()
}

const resetFilters = () => {
  filters.query = ''
  filters.status = ''
  filters.startDate = ''
  filters.endDate = ''
  applyFilters()
}

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedNewsPapers();
  }, 300);


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string) || 1;
      filters.query = (route.query.query as string) || '';
      filters.status = (route.query.status as string) || '';
      filters.startDate = (route.query.startDate as string) || '';
      filters.endDate = (route.query.endDate as string) || '';
      
      tempSearchQuery.value = filters.query;
      tempSelectedStatus.value = filters.status;
      tempStartDate.value = filters.startDate;
      tempEndDate.value = filters.endDate;
    }
    
    await getPaginatedNewsPapers();

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