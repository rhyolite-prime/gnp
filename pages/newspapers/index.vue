<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">Newspapers</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">NewsPapers</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- Main Content -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <!-- Filter at top of newspapers section -->
            <div class="mb-6">
              <NewspaperFilter @filter="handleFilterApply" class="mb-4" />
            </div>
            
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 class="text-xl font-semibold text-gray-900">{{ 
                activeFilters.category || activeFilters.publication || 'All Newspapers'
              }}</h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">{{ paginationParams.totalCount }} results</span>
              </div>
            </div>

            <div v-if="isShimmerLoading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
            
            <div v-else-if="newsPaperList.length === 0" class="py-12 text-center">
              <p class="text-gray-500">No newspapers found matching your criteria.</p>
              <button 
                @click="resetFilters"
                class="mt-4 text-red-600 hover:text-red-700 font-medium">
                Clear filters
              </button>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <DetailedNewspaperCard 
                v-for="newspaper in newsPaperList" 
                :key="newspaper.id"
                :newspaper="newspaper"
                @click="viewNewspaper(newspaper)"
              />
            </div>
          </div>

          <!-- Pagination -->
          <Pagination 
            v-if="paginationParams.totalPages > 1"
            :current-page="currentPage" 
            :total-pages="paginationParams.totalPages"
            :max-visible-buttons="5"
            @page-change="onPageChange"
            class="mb-6"
          />
          
          <!-- Pagination info -->
          <div class="flex justify-between items-center text-sm text-gray-500" v-if="newsPaperList.length > 0">
            <span>Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, newsPaperList.length) }} of {{ newsPaperList.length }} results</span>
            <span>Page {{ currentPage }} of {{ paginationParams.totalPages }}</span>
          </div>
          
          <!-- Suggested Articles Section -->
          <SuggestedArticlesSection 
            :current-newspaper-id="currentSelectedNewspaper?.id"
            class="mt-8"
          />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsPaper } from "~/models";
import { isEmpty, debounce } from "lodash-es";
import { Search } from 'lucide-vue-next'




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

// Page metadata
useHead({
  title: 'Newspapers - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Browse and purchase Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more.' }
  ]
})

 

interface Category {
  id: string;
  name: string;
  link: string;
  active: boolean;
}

// Category data
const newspaperCategories = ref<Category[]>([
  { id: 'all', name: 'All', link: '#', active: true },
  { id: 'ghana-year-book', name: 'Ghana Year Book', link: '#', active: false },
  { id: 'features', name: 'Features', link: '#', active: false },
  { id: 'opinions', name: 'Opinions', link: '#', active: false },
  { id: 'graphic-editorials', name: 'Graphic Editorials', link: '#', active: false },
  { id: 'dg-paper-stories', name: 'DG Paper Stories', link: '#', active: false },
  { id: 'security', name: 'Security', link: '#', active: false }
])

const publicationCategories = ref<Category[]>([
  { id: 'all', name: 'All', link: '#', active: true },
  { id: 'junior-graphic', name: 'Junior Graphic', link: '#', active: false },
  { id: 'graphic-sports', name: 'Graphic Sports', link: '#', active: false },
  { id: 'graphic-business', name: 'Graphic Business', link: '#', active: false },
  { id: 'graphic-showbiz', name: 'Graphic Showbiz', link: '#', active: false },
  { id: 'daily-graphic', name: 'Daily Graphic', link: '#', active: false },
  { id: 'the-mirror', name: 'The Mirror', link: '#', active: false }
])

// State
const isLoading = ref(false)
const isShimmerLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12 // Display 12 items per page (2 rows of 6 on xl screens)
const currentSelectedNewspaper = ref<NewsPaper | null>(null)
const activeFilters = reactive({
  category: '',
  publication: '',
  date: ''
})

const newsPaperList = ref<NewsPaper[]>([]);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedNewsPapers()
}



 const getPaginatedNewsPapers = async () => {

    isShimmerLoading.value = true;

    try {

      let result = await recordDuration(
        'newspaper.list.load_time_ms',
        () => getNewsPapers(filters),
        { page: String(filters.pageNo), page_size: String(filters.pageSize) },
      );

      newsPaperList.value = result.data;

      paginationParams.totalPages = result.totalPages;
      paginationParams.totalCount = result.totalCount;
      paginationParams.lowerBound = result.lowerBound;
      paginationParams.upperBound = result.upperBound;

      try {
        trackEvent('newspaper.list.loaded', {
          page: filters.pageNo,
          total_count: result.totalCount,
          result_count: result.data?.length ?? 0,
          category: activeFilters.category || 'all',
          publication: activeFilters.publication || 'all',
        })
      } catch { /* ignore */ }

    } catch (error) {
        //$toast.error('Unable to fetch finishing options !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

 

 
 

// Event handlers
function handleCategorySelect(category: Category) {
  // Reset active state
  newspaperCategories.value.forEach(c => c.active = false)
  
  // Set selected category as active
  const selectedCategory = newspaperCategories.value.find(c => c.id === category.id)
  if (selectedCategory) {
    selectedCategory.active = true
  }
  
  // Update filters
  activeFilters.category = category.id
  currentPage.value = 1

  try {
    trackEvent('newspaper.list.filter_applied', {
      filter_type: 'category',
      value: category.id,
    })
  } catch { /* ignore */ }
}

function handlePublicationSelect(publication: Category) {
  // Reset active state
  publicationCategories.value.forEach(p => p.active = false)
  
  // Set selected publication as active
  const selectedPublication = publicationCategories.value.find(p => p.id === publication.id)
  if (selectedPublication) {
    selectedPublication.active = true
  }
  
  // Update filters
  activeFilters.publication = publication.id
  currentPage.value = 1

  try {
    trackEvent('newspaper.list.filter_applied', {
      filter_type: 'publication',
      value: publication.id,
    })
  } catch { /* ignore */ }
}
 

function viewNewspaper(newspaper: NewsPaper) {
  // Store the selected newspaper
  currentSelectedNewspaper.value = newspaper

  try {
    trackEvent('newspaper.card.click', {
      newspaper_id: String(newspaper.id),
      title: newspaper.title || '',
      publication: (newspaper as any).publicationName || '',
      page: currentPage.value,
    })
  } catch { /* ignore */ }
  
  // Navigate to newspaper detail page
  navigateTo(`/newspapers/${newspaper.id}`)
}

 

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search

    try {
      trackEvent('newspaper.list.search', {
        query_length: filters.query?.length ?? 0,
      })
    } catch { /* ignore */ }

    getPaginatedNewsPapers();
  }, 300);

  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedNewsPapers();

    try {
      trackPageView('newspapers.list', { total_count: paginationParams.totalCount })
    } catch { /* ignore */ }
  });
</script>
