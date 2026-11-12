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
              <NewspaperFilter
                :model-value="appliedFilters"
                :publications="publications"
                :loading-publications="isLoadingPublications"
                @filter="handleFilterApply"
                @reset="resetFilters"
                class="mb-4"
              />
            </div>
            
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 class="text-xl font-semibold text-gray-900">{{ selectedPublicationName || 'All Newspapers' }}</h2>
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
            <span>Showing {{ paginationParams.lowerBound }} to {{ Math.min(paginationParams.upperBound, paginationParams.totalCount) }} of {{ paginationParams.totalCount }} results</span>
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
import type { NewsPaper, Publication } from "~/models";
import { debounce } from "lodash-es";
import { Search } from 'lucide-vue-next'




const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,
  publicationId: '',
  startDate: '',
  endDate: '',
});

// Publications for the filter drop-down (loaded from the API).
const publications = ref<Publication[]>([]);
const isLoadingPublications = ref(false);

const appliedFilters = computed(() => ({
  publicationId: filters.publicationId,
  startDate: filters.startDate,
  endDate: filters.endDate,
}));

const selectedPublicationName = computed(() =>
  publications.value.find(p => p.id === filters.publicationId)?.name ?? '');

const loadPublications = async () => {
  isLoadingPublications.value = true;
  try {
    const list = await getAllPublications();
    publications.value = list
      .filter(p => p.isActive !== false)
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  } catch (error) {
    console.error('Unable to fetch publications', error);
    publications.value = [];
  } finally {
    isLoadingPublications.value = false;
  }
}


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
// The current page lives in `filters.pageNo` (what is sent to the API), so the
// pagination control and the request can never drift apart.
const currentPage = computed({
  get: () => filters.pageNo,
  set: (value: number) => { filters.pageNo = value }
})
const currentSelectedNewspaper = ref<NewsPaper | null>(null)
const activeFilters = reactive({
  category: '',
  publication: '',
  date: ''
})

const newsPaperList = ref<NewsPaper[]>([]);

const parsePageNo = (value: unknown) => {
  const page = parseInt(String(Array.isArray(value) ? value[0] : value ?? ''), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

const syncRouteQuery = () => {
  const filteredQuery = filterQueryParams({ ...route.query, ...filters });
  router.replace({ name: route.name ?? '', query: filteredQuery });
}

const onPageChange = async (pageNumber: number) => {
  const lastPage = paginationParams.totalPages || 1;
  const target = Math.min(Math.max(1, pageNumber), lastPage);

  if (target === filters.pageNo) return;

  filters.pageNo = target;
  syncRouteQuery();
  await getPaginatedNewsPapers();

  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Only the response of the most recent request may update the page, so quick
// successive clicks cannot leave the list showing a different page than the control.
let latestRequestId = 0;

const getPaginatedNewsPapers = async () => {
  const requestId = ++latestRequestId;
  isShimmerLoading.value = true;

  try {
    const result = await getNewsPapers({ ...filters });

    if (requestId !== latestRequestId) return;

    const totalPages = Number(result?.totalPages) || 0;

    // Requested page is past the end (e.g. stale ?pageNo= in the URL): load the last page.
    if (totalPages > 0 && filters.pageNo > totalPages) {
      filters.pageNo = totalPages;
      syncRouteQuery();
      return getPaginatedNewsPapers();
    }

    newsPaperList.value = Array.isArray(result?.data) ? result.data : [];

    paginationParams.totalPages = totalPages;
    paginationParams.totalCount = Number(result?.totalCount) || 0;
    paginationParams.lowerBound = Number(result?.lowerBound) || 0;
    paginationParams.upperBound = Number(result?.upperBound) || 0;
  } catch (error) {
    console.error('Unable to fetch newspapers', error);
  } finally {
    if (requestId === latestRequestId) isShimmerLoading.value = false;
  }
}

function handleFilterApply(selected: { publicationId?: string; startDate?: string; endDate?: string }) {
  filters.publicationId = selected?.publicationId ?? '';
  filters.startDate = selected?.startDate ?? '';
  filters.endDate = selected?.endDate ?? '';

  filters.pageNo = 1;
  syncRouteQuery();
  getPaginatedNewsPapers();
}

function resetFilters() {
  filters.publicationId = '';
  filters.startDate = '';
  filters.endDate = '';
  filters.query = '';

  filters.pageNo = 1;
  syncRouteQuery();
  getPaginatedNewsPapers();
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

  
  // Navigate to newspaper detail page
  navigateTo(`/newspapers/${newspaper.id}`)
}

 

  const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search

  

    getPaginatedNewsPapers();
  }, 300);

  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    const fromQuery = (value: unknown) => String((Array.isArray(value) ? value[0] : value) ?? '');
    const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

    filters.pageNo = parsePageNo(route.query.pageNo);
    filters.publicationId = fromQuery(route.query.publicationId);
    filters.startDate = isIsoDate(fromQuery(route.query.startDate)) ? fromQuery(route.query.startDate) : '';
    filters.endDate = isIsoDate(fromQuery(route.query.endDate)) ? fromQuery(route.query.endDate) : '';

    loadPublications();
    
    await getPaginatedNewsPapers();

     
  });
</script>
