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
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <CategoryList 
            title="Newspaper Categories"
            :categories="newspaperCategories"
            @select="handleCategorySelect"
            class="mb-6"
          />
          
          <CategoryList 
            title="Publications"
            :categories="publicationCategories"
            @select="handlePublicationSelect"
            class="mb-6"
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
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
                <span class="text-sm text-gray-500">{{ filteredNewspapers.length }} results</span>
              </div>
            </div>

            <div v-if="isLoading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
            
            <div v-else-if="filteredNewspapers.length === 0" class="py-12 text-center">
              <p class="text-gray-500">No newspapers found matching your criteria.</p>
              <button 
                @click="resetFilters"
                class="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Clear filters
              </button>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <DetailedNewspaperCard 
                v-for="newspaper in paginatedNewspapers" 
                :key="newspaper.id"
                :newspaper="newspaper"
                @click="viewNewspaper(newspaper)"
              />
            </div>
          </div>

          <!-- Pagination -->
          <Pagination 
            v-if="totalPages > 1"
            :current-page="currentPage" 
            :total-pages="totalPages"
            :max-visible-buttons="5"
            @page-change="changePage"
            class="mb-6"
          />
          
          <!-- Pagination info -->
          <div class="flex justify-between items-center text-sm text-gray-500" v-if="filteredNewspapers.length > 0">
            <span>Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredNewspapers.length) }} of {{ filteredNewspapers.length }} results</span>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
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
// Page metadata
useHead({
  title: 'Newspapers - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Browse and purchase Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more.' }
  ]
})

// Types
interface Newspaper {
  id: number;
  title: string;
  code: string;
  type: string;
  date: string;
  price: number;
  image: string;
  category?: string;
  publication?: string;
}

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
const currentPage = ref(1)
const itemsPerPage = 12 // Display 12 items per page (2 rows of 6 on xl screens)
const currentSelectedNewspaper = ref<Newspaper | null>(null)
const activeFilters = reactive({
  category: '',
  publication: '',
  date: ''
})

// Sample data based on the screenshot
const allNewspapers = ref<Newspaper[]>([
  {
    id: 1,
    title: 'Graphic Business',
    code: 'GB',
    type: 'Tuesday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/e74c3c/ffffff?text=GB',
    publication: 'graphic-business',
    category: 'features'
  },
  {
    id: 2,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Tuesday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'dg-paper-stories'
  },
  {
    id: 3,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Monday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'opinions'
  },
  {
    id: 4,
    title: 'Graphic Sports',
    code: 'GS',
    type: 'Monday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/27ae60/ffffff?text=GS',
    publication: 'graphic-sports',
    category: 'features'
  },
  {
    id: 5,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Saturday',
    date: 'August 23, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'graphic-editorials'
  },
  {
    id: 6,
    title: 'Mirror',
    code: 'MR',
    type: 'Saturday',
    date: 'August 23, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/f39c12/ffffff?text=MR',
    publication: 'the-mirror',
    category: 'features'
  },
  {
    id: 7,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Friday',
    date: 'August 22, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'dg-paper-stories'
  },
  {
    id: 8,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Thursday',
    date: 'August 21, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'opinions'
  },
  {
    id: 9,
    title: 'Graphic Showbiz',
    code: 'GSB',
    type: 'Thursday',
    date: 'August 21, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/9b59b6/ffffff?text=GSB',
    publication: 'graphic-showbiz',
    category: 'features'
  },
  {
    id: 10,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'security'
  },
  {
    id: 11,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'ghana-year-book'
  },
  {
    id: 12,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
    },
  {
    id: 13,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
    },
  {
    id: 14,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
    },
  {
    id: 15,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
    },
  {
    id: 16,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
    },
  {
    id: 17,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Wednesday',
    date: 'August 20, 2025',
    price: 1.50,
    image: 'https://placehold.co/300x400/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'features'
  }
])

// Filter newspapers
const filteredNewspapers = computed(() => {
  return allNewspapers.value.filter(newspaper => {
    let matches = true
    
    if (activeFilters.category && activeFilters.category !== 'all') {
      matches = matches && newspaper.category === activeFilters.category
    }
    
    if (activeFilters.publication && activeFilters.publication !== 'all') {
      matches = matches && newspaper.publication === activeFilters.publication
    }
    
    if (activeFilters.date) {
      matches = matches && newspaper.date.toLowerCase().includes(activeFilters.date.toLowerCase())
    }
    
    return matches
  })
})

// Paginate newspapers
const totalPages = computed(() => {
  return Math.ceil(filteredNewspapers.value.length / itemsPerPage)
})

const paginatedNewspapers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNewspapers.value.slice(start, end)
})

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
  
  // Simulate loading
  simulateLoading()
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
  
  // Simulate loading
  simulateLoading()
}

function handleFilterApply(filters: { publication: string, date: string }) {
  if (filters.publication) {
    // Update publication filter and sync with sidebar
    activeFilters.publication = filters.publication
    publicationCategories.value.forEach(p => {
      p.active = p.id === filters.publication
    })
  }
  
  activeFilters.date = filters.date
  currentPage.value = 1
  
  // Simulate loading
  simulateLoading()
}

function changePage(page: number) {
  currentPage.value = page
  // Scroll to the top of the newspapers section with smooth scrolling
  const newspapersSection = document.querySelector('.bg-white.rounded-lg.shadow.p-6')
  if (newspapersSection) {
    newspapersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // Simulate loading state for better UX
  simulateLoading()
}

function resetFilters() {
  // Reset all filters
  activeFilters.category = ''
  activeFilters.publication = ''
  activeFilters.date = ''
  
  // Reset active states
  newspaperCategories.value.forEach(c => c.active = c.id === 'all')
  publicationCategories.value.forEach(p => p.active = p.id === 'all')
  
  currentPage.value = 1
}

function viewNewspaper(newspaper: Newspaper) {
  // Store the selected newspaper
  currentSelectedNewspaper.value = newspaper
  
  // Navigate to newspaper detail page
  navigateTo(`/newspapers/${newspaper.id}`)
}

// Helper function to simulate loading
function simulateLoading() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
</script>
