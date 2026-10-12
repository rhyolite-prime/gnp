import type { ArchiveSearchItem, ArchiveSortOrder } from "~/models";

/**
 * Shared state and actions for the Archives search module.
 *
 * - Advanced search (keyword + date range) sends `query`, `dateFrom`, `dateTo`.
 * - "Browse Collections" sends `publicationYear` only (see browseYear()).
 * - Infinite scroll uses `loadMore()`, which requests the next `pageNo`.
 */
export const useArchiveSearch = () => {
  // Filters (state is keyed so it survives navigation between archive pages)
  const query = useState<string>('archive-searchQuery', () => '')
  const dateFrom = useState<string>('archive-dateFrom', () => '')
  const dateTo = useState<string>('archive-dateTo', () => '')
  const publicationYear = useState<number | null>('archive-publicationYear', () => null)
  // null = Most Relevant (backend default), 'desc' = Newest First, 'asc' = Oldest First
  const sortOrder = useState<ArchiveSortOrder | null>('archive-sortOrder', () => null)

  // Results
  const items = useState<ArchiveSearchItem[]>('archive-items', () => [])
  const pageNo = useState<number>('archive-pageNo', () => 0)
  const totalCount = useState<number>('archive-totalCount', () => 0)
  const totalPages = useState<number>('archive-totalPages', () => 0)

  // Status
  const isLoading = useState<boolean>('archive-isLoading', () => false)
  const isLoadingMore = useState<boolean>('archive-isLoadingMore', () => false)
  const errorMessage = useState<string | null>('archive-errorMessage', () => null)

  const hasMore = computed(() => pageNo.value < totalPages.value)

  // Incremented per request so that responses from superseded searches are ignored.
  // Kept inside the composable call (not module scope) so concurrent users don't share it.
  let latestRequestId = 0

  const fetchPage = async (page: number, append: boolean) => {
    const requestId = ++latestRequestId

    const payload = buildArchiveSearchRequest({
      pageNo: page,
      query: query.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      publicationYear: publicationYear.value,
      sortOrder: sortOrder.value,
    })

    errorMessage.value = null
    if (append) {
      isLoadingMore.value = true
    } else {
      isLoading.value = true
      items.value = []
    }

    try {
      const result = await searchArchives(payload)
      if (requestId !== latestRequestId) return

      items.value = append ? [...items.value, ...result.data] : result.data
      pageNo.value = page
      totalCount.value = result.totalCount
      totalPages.value = result.totalPages
    } catch (error: any) {
      if (requestId !== latestRequestId) return
      console.error('Archive search failed:', error)
      errorMessage.value = 'We could not load archive results. Please try again.'
    } finally {
      if (requestId === latestRequestId) {
        isLoading.value = false
        isLoadingMore.value = false
      }
    }
  }

  /** Runs the search with the current filters, starting from page 1. */
  const search = () => fetchPage(1, false)

  /** Loads the next page and appends it to the current results. */
  const loadMore = () => {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return
    return fetchPage(pageNo.value + 1, true)
  }

  /** Advanced search: keyword + date range. Clears any year chosen from Browse Collections. */
  const searchAdvanced = () => {
    publicationYear.value = null
    return search()
  }

  /** Browse Collections: search one publication year. Clears keyword and date range. */
  const browseYear = (year: number) => {
    query.value = ''
    dateFrom.value = ''
    dateTo.value = ''
    publicationYear.value = year
    return search()
  }

  const clearDateRange = () => {
    dateFrom.value = ''
    dateTo.value = ''
    return search()
  }

  /** Changes the sort order and re-runs the search from page 1. */
  const setSortOrder = (value: ArchiveSortOrder | null) => {
    sortOrder.value = value
    return search()
  }

  const clearPublicationYear = () => {
    publicationYear.value = null
    return search()
  }

  /** Clears date range and year, keeps the keyword. */
  const clearAllFilters = () => {
    dateFrom.value = ''
    dateTo.value = ''
    publicationYear.value = null
    return search()
  }

  return {
    query,
    dateFrom,
    dateTo,
    publicationYear,
    sortOrder,
    items,
    pageNo,
    totalCount,
    totalPages,
    hasMore,
    isLoading,
    isLoadingMore,
    errorMessage,
    search,
    loadMore,
    searchAdvanced,
    browseYear,
    clearDateRange,
    clearPublicationYear,
    clearAllFilters,
    setSortOrder,
  }
}
