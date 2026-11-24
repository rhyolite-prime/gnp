<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header + Display Mode Toggle -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Archived Newspapers &amp; Pages
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Browse the {{ coverage.dateSpan }} digital archive — by decade collections or by dates with thumbnails
        </p>
      </div>

      <!-- Display mode switch -->
      <div class="mt-4 sm:mt-0 inline-flex rounded-xl p-1 bg-gray-100 shadow-sm">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          :class="viewMode === 'decades' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="switchMode('decades')"
        >
          <Squares2X2Icon class="h-4 w-4" />
          Collections by Years
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          :class="viewMode === 'dates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="switchMode('dates')"
        >
          <CalendarDaysIcon class="h-4 w-4" />
          By Dates
        </button>
      </div>
    </div>

    <!-- Coverage Summary Chips -->
    <div class="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Archive Span</p>
        <p class="mt-1 text-xl font-bold text-gray-900">{{ coverage.dateSpan }}</p>
        <p class="text-[11px] text-gray-400">{{ coverage.decades }} decade collections</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Archived Editions</p>
        <p class="mt-1 text-xl font-bold text-primary-700">{{ toNumber(coverage.editions) }}</p>
        <p class="text-[11px] text-gray-400">{{ coverage.publications }} publications</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">Pages Digitized</p>
        <p class="mt-1 text-xl font-bold text-indigo-700">{{ toNumber(coverage.pages) }}</p>
        <p class="text-[11px] text-gray-400">Scanned &amp; stored in G3</p>
      </div>
      <div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 px-4 py-3">
        <p class="text-xs font-medium text-gray-500">OCR Complete</p>
        <p class="mt-1 text-xl font-bold text-emerald-700">{{ coverage.ocrCompletePct }}%</p>
        <p class="text-[11px] text-gray-400">Full-text searchable pages</p>
      </div>
    </div>

    <!-- ══════════════ MODE 1 · COLLECTIONS BY YEARS ══════════════ -->
    <div v-if="viewMode === 'decades'">
      <div v-if="decades.length === 0" class="rounded-xl bg-white ring-1 ring-gray-900/5 p-12 text-center text-gray-500">
        No decade collections found.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="decade in decades"
          :key="decade.id"
          class="group rounded-2xl bg-white ring-1 ring-gray-900/5 shadow-sm hover:shadow-md hover:ring-primary-200 transition-all overflow-hidden flex flex-col"
        >
          <!-- Decade header -->
          <div class="px-5 pt-5 pb-4 bg-gradient-to-br from-slate-900 to-slate-800 relative">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl font-bold text-white tracking-tight">{{ decade.label }}</h3>
                <p class="text-xs text-white/60 font-medium mt-0.5">
                  {{ decade.startYear }} – {{ decade.endYear }}
                </p>
              </div>
              <!-- Stacked sample thumbnails -->
              <div class="relative w-[52px] h-[68px] shrink-0">
                <div
                  v-for="(cover, cIdx) in decadeCovers[decade.id] || []"
                  :key="cover.id"
                  class="absolute w-[42px] shadow-md rounded-md overflow-hidden border border-white/20"
                  :style="{
                    right: (cIdx * 8) + 'px',
                    top: (cIdx * 3) + 'px',
                    transform: `rotate(${(cIdx - 1) * 5}deg)`,
                    zIndex: 3 - cIdx,
                  }"
                >
                  <ArchivePageThumbnail
                    :publication-name="cover.publicationName"
                    :date-label="''"
                    :accent="accentFor(cover.publicationId)"
                    variant="mini"
                  />
                </div>
              </div>
            </div>

            <p class="mt-3 text-xs text-white/70 leading-relaxed line-clamp-2">{{ decade.description }}</p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div class="px-5 py-3">
              <p class="text-[11px] font-medium uppercase tracking-wider text-gray-400">Editions</p>
              <p class="text-lg font-bold text-gray-900">{{ toNumber(decade.editionCount) }}</p>
            </div>
            <div class="px-5 py-3">
              <p class="text-[11px] font-medium uppercase tracking-wider text-gray-400">Pages</p>
              <p class="text-lg font-bold text-gray-900">{{ toNumber(decade.pageCount) }}</p>
            </div>
          </div>

          <!-- Year chips -->
          <div class="px-5 py-4 flex-1">
            <p class="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Browse by year</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="ys in decade.yearStats"
                :key="ys.year"
                type="button"
                :title="`${ys.year} — ${ys.editionCount} editions`"
                class="px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"
                @click="goToDateMode({ year: ys.year })"
              >
                {{ ys.year }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <button
            type="button"
            class="w-full px-5 py-3 border-t border-gray-100 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center justify-between"
            @click="goToDateMode({ decade: decade.id })"
          >
            <span>Browse editions by date</span>
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════ MODE 2 · BY DATES ══════════════ -->
    <div v-else>
      <!-- Filters -->
      <div class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg">
        <!-- Search -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              v-model="filters.query"
              class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search title, edition..."
            />
          </div>
        </div>

        <!-- Publication -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Publication</label>
          <select
            v-model="filters.publicationId"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Publications</option>
            <option v-for="pub in publicationOptions" :key="pub.id" :value="pub.id">{{ pub.name }}</option>
          </select>
        </div>

        <!-- Year -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            v-model="filters.year"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Years</option>
            <option v-for="y in yearOptions" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>

        <!-- OCR Status -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">OCR Status</label>
          <select
            v-model="filters.ocrStatus"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Statuses</option>
            <option v-for="opt in ocrOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
          <div class="flex items-center space-x-2 bg-white rounded-md ring-1 ring-inset ring-gray-300 px-2 py-1.5 shadow-sm">
            <input
              type="date"
              v-model="filters.dateFrom"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
            <span class="text-gray-400 text-sm">to</span>
            <input
              type="date"
              v-model="filters.dateTo"
              class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <!-- Sort -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort</label>
          <select
            v-model="filters.sort"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <!-- Filter Actions -->
        <div class="flex items-end gap-2 sm:col-span-2">
          <button
            type="button"
            class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 flex-1 cursor-pointer"
            @click="applyFilters"
          >
            Search
          </button>
          <button
            type="button"
            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-1 cursor-pointer"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isShimmerLoading" class="rounded-xl bg-white ring-1 ring-gray-900/5 p-12">
        <div class="flex justify-center items-center space-x-2">
          <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
          <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
          <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="dateGroups.length === 0" class="rounded-xl bg-white ring-1 ring-gray-900/5 p-12 text-center">
        <p class="text-sm text-gray-500">No archived editions match the current filters.</p>
        <button
          type="button"
          class="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium cursor-pointer"
          @click="resetFilters"
        >
          Reset filters to see everything
        </button>
      </div>

      <!-- Date Groups -->
      <div v-else class="space-y-8">
        <div v-for="group in dateGroups" :key="group.date">
          <!-- Date heading -->
          <div class="flex items-center gap-2.5 mb-3">
            <div class="p-2 rounded-lg bg-primary-50">
              <CalendarDaysIcon class="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">{{ group.label }}</h3>
              <p class="text-xs text-gray-500">
                {{ group.editionCount }} {{ group.editionCount === 1 ? 'edition' : 'editions' }} ·
                {{ toNumber(group.pageCount) }} pages
              </p>
            </div>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Edition thumbnails -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="edition in group.editions"
              :key="edition.id"
              class="rounded-xl bg-white ring-1 ring-gray-900/5 shadow-sm hover:shadow-md hover:ring-primary-200 transition-all overflow-hidden flex flex-col"
            >
              <div class="p-2.5 pb-0">
                <ArchivePageThumbnail
                  :publication-name="edition.publicationName"
                  :date-label="longDateFormat(edition.publicationDate)"
                  :accent="accentFor(edition.publicationId)"
                />
              </div>

              <div class="p-3 flex-1 flex flex-col">
                <p class="text-sm font-semibold text-gray-900 truncate" :title="edition.title">
                  {{ edition.publicationName }}
                </p>
                <p class="text-xs text-gray-500">
                  Edition {{ edition.editionNumber }} · {{ edition.pageCount }} pages
                </p>

                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset"
                    :class="ocrBadgeClass(edition.ocrStatus)"
                  >
                    {{ ocrLabel(edition.ocrStatus) }}
                  </span>
                  <span
                    v-if="edition.isFree"
                    class="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                  >
                    Free
                  </span>
                </div>

                <NuxtLink
                  :to="`/archives/${edition.id}`"
                  target="_blank"
                  class="mt-3 inline-flex items-center justify-center rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  View Pages
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination (by date groups) -->
      <client-only v-if="dateGroups.length > 0">
        <SimplePagination
          :lower-bound="paginationParams.lowerBound"
          :upper-bound="paginationParams.upperBound"
          @on-page-changed="onPageChange"
          :page-no="filters.pageNo"
          :total-pages="paginationParams.totalPages"
          :total-count="paginationParams.totalCount"
          :disabled="isShimmerLoading"
        />
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { debounce } from 'lodash-es'
import {
  fetchArchiveCoverageSummary,
  fetchArchiveDecades,
  fetchArchivesByDate,
  fetchDecadeCoverEditions,
  MOCK_ARCHIVE_PUBLICATIONS,
  MOCK_ARCHIVE_OCR_OPTIONS,
} from '~/services/archivedNewspapers'
import type {
  ArchiveDecadeCollection,
  ArchiveDateGroup,
  ArchiveCoverageSummary,
  ArchivedNewspaperEdition,
} from '~/models'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Archived Newspapers & Pages | Graphic News Plus'
})

const router = useRouter()
const route = useRoute()

// ─── Display Mode ────────────────────────────────────────────────────────────
const viewMode = ref<'decades' | 'dates'>('decades')

// ─── Coverage & Decade Collections ───────────────────────────────────────────
const coverage = ref<ArchiveCoverageSummary>({
  decades: 0, editions: 0, pages: 0, publications: 0, ocrCompletePct: 0, dateSpan: '',
})
const decades = ref<ArchiveDecadeCollection[]>([])
const decadeCovers = ref<Record<string, ArchivedNewspaperEdition[]>>({})

// ─── Filters (By Dates mode) ─────────────────────────────────────────────────
const filters = reactive({
  query: '',
  publicationId: '',
  year: '',
  ocrStatus: '',
  dateFrom: '',
  dateTo: '',
  sort: 'desc' as 'asc' | 'desc',
  pageNo: 1,
  pageSize: 20,
})

const publicationOptions = MOCK_ARCHIVE_PUBLICATIONS
const ocrOptions = MOCK_ARCHIVE_OCR_OPTIONS

const yearOptions = computed(() =>
  decades.value
    .flatMap((d) => d.yearStats.map((y) => y.year))
    .sort((a, b) => a - b)
)

// ─── Date Groups List ────────────────────────────────────────────────────────
const dateGroups = ref<ArchiveDateGroup[]>([])
const isShimmerLoading = ref(false)
const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
})

const fetchDateGroups = async () => {
  isShimmerLoading.value = true
  try {
    const result = fetchArchivesByDate({ ...filters })
    dateGroups.value = result.dateGroups
    paginationParams.totalPages = result.totalPages
    paginationParams.totalCount = result.totalCount
    paginationParams.lowerBound = result.lowerBound
    paginationParams.upperBound = result.upperBound
    filters.pageNo = result.pageNo
  } finally {
    isShimmerLoading.value = false
  }
}

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters, viewMode: viewMode.value }) })
  await fetchDateGroups()
}

const applyFilters = async () => {
  filters.pageNo = 1
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters, viewMode: viewMode.value }) })
  await fetchDateGroups()
}

const resetFilters = async () => {
  filters.query = ''
  filters.publicationId = ''
  filters.year = ''
  filters.ocrStatus = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.sort = 'desc'
  filters.pageNo = 1
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters, viewMode: viewMode.value }) })
  await fetchDateGroups()
}

const debouncedSearch = debounce(() => {
  filters.pageNo = 1
  fetchDateGroups()
}, 300)

watch(() => filters.query, debouncedSearch)
watch(() => [filters.publicationId, filters.year, filters.ocrStatus, filters.sort], async () => {
  filters.pageNo = 1
  await fetchDateGroups()
})

// ─── Mode Navigation ─────────────────────────────────────────────────────────
const switchMode = async (mode: 'decades' | 'dates') => {
  if (viewMode.value === mode) return
  viewMode.value = mode
  if (mode === 'dates') {
    await fetchDateGroups()
  }
}

/** Jump from a decade card (or year chip) into the By Dates view. */
const goToDateMode = async (opts: { year?: number; decade?: string }) => {
  filters.pageNo = 1
  if (opts.year) {
    filters.year = String(opts.year)
    filters.dateFrom = ''
    filters.dateTo = ''
  } else if (opts.decade) {
    const decade = decades.value.find((d) => d.id === opts.decade)
    filters.year = ''
    filters.dateFrom = decade ? String(decade.startYear) + '-01-01' : ''
    filters.dateTo = decade ? String(decade.endYear) + '-12-31' : ''
  }
  viewMode.value = 'dates'
  router.replace({ name: route.name ?? '', query: filterQueryParams({ ...route.query, ...filters, viewMode: 'dates' }) })
  await fetchDateGroups()
}

// ─── Init ────────────────────────────────────────────────────────────────────
onMounted(async () => {
  coverage.value = fetchArchiveCoverageSummary()
  decades.value = fetchArchiveDecades()

  // Sample cover thumbnails for the stacked decade cards
  const covers: Record<string, ArchivedNewspaperEdition[]> = {}
  for (const d of decades.value) {
    covers[d.id] = fetchDecadeCoverEditions(d.id, 3)
  }
  decadeCovers.value = covers

  // Restore filters from the URL
  if (typeof route.query.query === 'string') filters.query = route.query.query
  if (typeof route.query.publicationId === 'string') filters.publicationId = route.query.publicationId
  if (typeof route.query.year === 'string') filters.year = route.query.year
  if (typeof route.query.ocrStatus === 'string') filters.ocrStatus = route.query.ocrStatus
  if (typeof route.query.dateFrom === 'string') filters.dateFrom = route.query.dateFrom
  if (typeof route.query.dateTo === 'string') filters.dateTo = route.query.dateTo
  if (route.query.sort === 'asc' || route.query.sort === 'desc') filters.sort = route.query.sort
  if (route.query.viewMode === 'dates') {
    viewMode.value = 'dates'
    await fetchDateGroups()
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PUBLICATION_ACCENTS: Record<string, string> = Object.fromEntries(
  MOCK_ARCHIVE_PUBLICATIONS.map((p) => [p.id, p.accent])
)

const accentFor = (publicationId: string) => PUBLICATION_ACCENTS[publicationId] || '#4b5563'

const ocrLabel = (status: string) =>
  (MOCK_ARCHIVE_OCR_OPTIONS.find((o) => o.value === status)?.label) || status

const ocrBadgeClass = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    case 'partial':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    default:
      return 'bg-gray-50 text-gray-600 ring-gray-500/20'
  }
}
</script>
