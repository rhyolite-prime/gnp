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

    <!-- Filters -->
    <div class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4">
      <!-- Search -->
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
          placeholder="Search publications..." 
        />
      </div>

      <!-- Category Filter -->
       <select v-model="selectedCategory" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
        <option value="">All Categories</option>
        <option value="Newspaper">Newspaper</option>
        <option value="Magazine">Magazine</option>
        <option value="Special Edition">Special Edition</option>
      </select>

      <!-- Date Filter -->
      <input 
        type="date" 
        v-model="dateFilter" 
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
      />
      
      <!-- Status Filter -->
      <select v-model="selectedStatus" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
        <option value="">All Statuses</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
        <option value="Archived">Archived</option>
      </select>
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
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Published On</th>
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
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ paper.publishedDate }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₵{{ paper.price }}</td>
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
                    <button
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      v-if="!paper.isPublished"
                      @click="publishPaper(paper.id)"
                      class="text-green-600 hover:text-green-800 mr-4"
                    >
                      Publish
                    </button>

                    <button
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredNewspapers.length === 0">
                  <td colspan="7" class="py-8 text-center text-sm text-gray-500">
                    No publications found matching your filters.
                  </td>
                </tr>
              </tbody>
            </table>
 
          </div>
        </div>
      </div>
    </div>
    
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
</template>

<script setup lang="ts">

import { MagnifyingGlassIcon, EyeIcon, ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

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

// Mock Data
const newspapers = ref([
  {
    id: 1,
    title: 'Daily Graphic',
    date: '2025-12-15',
    category: 'Newspaper',
    price: 5.00,
    status: 'Published',
    views: 1250,
    sales: 450,
    headlines: [{ text: 'New Economic Policy Announced' }]
  },
  {
    id: 2,
    title: 'The Mirror',
    date: '2025-12-14',
    category: 'Newspaper',
    price: 4.50,
    status: 'Published',
    views: 890,
    sales: 320,
    headlines: [{ text: 'Fashion Trends for 2026' }]
  },
  {
    id: 3,
    title: 'Graphic Business',
    date: '2025-12-16',
    category: 'Newspaper',
    price: 6.00,
    status: 'Draft',
    views: 0,
    sales: 0,
    headlines: [{ text: 'Stock Market Rally Continues' }]
  },
  {
    id: 4,
    title: 'Junior Graphic',
    date: '2025-12-10',
    category: 'Newspaper',
    price: 3.00,
    status: 'Archived',
    views: 2100,
    sales: 850,
    headlines: [{ text: 'Kids learn coding at summer camp' }]
  },
  {
    id: 5,
    title: 'Graphic Sports',
    date: '2025-12-13',
    category: 'Newspaper',
    price: 4.00,
    status: 'Published',
    views: 1560,
    sales: 620,
    headlines: [{ text: 'Black Stars qualify for finals' }]
  },
   {
    id: 6,
    title: 'Focus Magazine',
    date: '2025-12-01',
    category: 'Magazine',
    price: 15.00,
    status: 'Published',
    views: 450,
    sales: 120,
    headlines: [{ text: 'The Future of Tech in Africa' }]
  },
])

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const dateFilter = ref('')
const selectedStatus = ref('')

// Computed Filtered List
const filteredNewspapers = computed(() => {
  return newspapers.value.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (paper.headlines[0]?.text || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === '' || paper.category === selectedCategory.value
    const matchesDate = dateFilter.value === '' || paper.date === dateFilter.value
    const matchesStatus = selectedStatus.value === '' || paper.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesDate && matchesStatus
  })
})

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedNewsPapers();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedNewsPapers();

  });

</script>