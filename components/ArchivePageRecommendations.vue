<template>
  <div class="mt-10 space-y-10">
    <!-- Keep reading: pages returned by news-papers/get-related-archived-content -->
    <section aria-labelledby="keep-reading-title" :aria-busy="keepReadingLoading" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-red-600">Keep reading</p>
          <h2 id="keep-reading-title" class="mt-2 text-xl font-bold text-gray-900">{{ keepReadingTitle }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ metadata.publicationName }} · {{ formatArchivePublicationDate(metadata.publicationDate) }}</p>
        </div>
        <span v-if="keepReadingItems.length" class="text-xs font-medium text-gray-500">{{ keepReadingItems.length }} {{ keepReadingItems.length === 1 ? 'page' : 'pages' }}</span>
      </div>

      <div v-if="keepReadingLoading" role="status" class="mt-5 flex gap-4 overflow-hidden pb-3">
        <span class="sr-only">Loading more pages…</span>
        <div v-for="n in 6" :key="n" class="w-32 shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-2 sm:w-40" aria-hidden="true">
          <div class="aspect-[3/4] rounded-lg bg-gray-200"></div>
          <div class="mx-auto mt-3 h-4 w-16 rounded bg-gray-200"></div>
        </div>
      </div>

      <div v-else-if="keepReadingItems.length" class="mt-5 flex snap-x gap-4 overflow-x-auto pb-3" aria-label="More archive pages to read" tabindex="0">
        <NuxtLink v-for="item in keepReadingItems" :key="item.id" :to="`/archives/${encodeURIComponent(item.id)}`" class="group w-32 shrink-0 snap-start rounded-xl border border-gray-200 bg-gray-50 p-2 transition-colors hover:border-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:w-40" :aria-label="keepReadingLabel(item)">
          <div class="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-white">
            <img v-if="thumbnail(item)" :src="thumbnail(item)" :alt="`Page ${item.pageNumber || '—'} thumbnail`" loading="lazy" decoding="async" class="h-full w-full object-contain" @error="failedThumbnails.add(item.id)" />
            <div v-else class="p-3 text-center text-gray-400"><span class="text-4xl" aria-hidden="true">▤</span><p class="mt-2 text-xs">Preview unavailable</p></div>
          </div>
          <p class="mt-3 text-center text-sm font-bold text-gray-800 group-hover:text-red-600">Page {{ item.pageNumber || '—' }}</p>
          <p v-if="!item.sameEdition" class="mt-1 line-clamp-2 text-center text-xs text-gray-500">{{ editionLabel(item) }}</p>
        </NuxtLink>
      </div>

      <p v-else-if="keepReadingRestricted" class="mt-5 text-sm text-gray-500">Sign in with an active subscription to see more pages to read.</p>
      <div v-else-if="keepReadingError" role="status" class="mt-5 text-sm text-red-700">
        <p>{{ keepReadingError }}</p>
        <button type="button" class="recommendation-button mt-4" @click="loadKeepReading">Try again</button>
      </div>
      <p v-else class="mt-5 text-sm text-gray-500">No other pages from this edition are available.</p>
    </section>

    <section aria-labelledby="related-archive-title">
      <h2 id="related-archive-title" class="text-xl font-bold text-gray-900">Related High-Ranking Results</h2>
      <p class="mt-2 text-sm text-gray-600">{{ relatedQuery ? `Archive relevance matches for “${relatedQuery}”.` : 'Explore more pages from the archive collection.' }}</p>
      <p v-if="relatedLoading" role="status" class="mt-5 text-sm text-gray-500">Finding related results…</p>
      <div v-if="relatedItems.length" class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="item in relatedItems" :key="item.id" :to="`/archives/${encodeURIComponent(item.id)}`" class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
          <div class="flex h-44 items-center justify-center overflow-hidden bg-gray-100">
            <img v-if="thumbnail(item)" :src="thumbnail(item)" :alt="`${item.publicationName} page ${item.pageNumber || '—'}`" loading="lazy" decoding="async" class="h-full w-full object-contain" @error="failedThumbnails.add(item.id)" />
            <p v-else class="line-clamp-4 px-6 text-center font-serif text-sm text-gray-600">{{ item.snippet || item.supportingText || 'Archive page preview unavailable' }}</p>
          </div>
          <div class="p-5">
            <h3 class="font-bold text-gray-900 group-hover:text-red-600">{{ item.publicationName }} · Page {{ item.pageNumber || '—' }}</h3>
            <p class="mt-2 text-xs text-gray-500">{{ formatArchivePublicationDate(item.publicationDate) }}</p>
            <p class="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{{ item.snippet || item.supportingText || 'Open this page to read more.' }}</p>
            <span class="mt-4 inline-block text-sm font-semibold text-red-600">View page →</span>
          </div>
        </NuxtLink>
      </div>
      <p v-if="!relatedLoading && !relatedItems.length && !relatedError" class="mt-5 text-sm text-gray-500">No related results were found. Try a different keyword in the archives.</p>
      <div v-if="relatedError" role="status" class="mt-4 text-sm text-red-700">{{ relatedError }} <button type="button" class="recommendation-button ml-2" :disabled="relatedLoading" @click="loadRelated">Try again</button></div>
      <NuxtLink to="/archives" class="recommendation-button mt-5">Explore all archives</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue';
import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';
import { searchArchives, buildArchiveSearchRequest } from '~/services/archives';
import { getRelatedArchivedContent } from '~/services/newsPapers';
import type { KeepReadingPage } from '~/utils/archiveRecommendations';
import { buildRelatedArchivePayload, keepReadingPages, rankRelatedArchives, archiveThumbnail } from '~/utils/archiveRecommendations';
import { formatArchivePublicationDate } from '~/utils/archiveAccess';
const props = defineProps<{ currentId: string; metadata: ArchiveAccessMetadata; cachedItems: ArchiveSearchItem[]; query: string }>();
const relatedQuery = computed(() => props.query.trim() || props.metadata.tags?.[0] || props.metadata.publicationName);
const keepReadingItems = ref<KeepReadingPage[]>([]);
const remoteRelated = ref<ArchiveSearchItem[]>([]);
// The API may suggest pages from other editions; only then does the heading widen.
const keepReadingTitle = computed(() => keepReadingItems.value.every(item => item.sameEdition) ? 'More pages from this edition' : 'More pages from the archives');
const relatedItems = computed(() => rankRelatedArchives([...props.cachedItems, ...remoteRelated.value], props.currentId));
const failedThumbnails = reactive(new Set<string>());
const keepReadingLoading = ref(false);
const relatedLoading = ref(false);
const keepReadingError = ref('');
const keepReadingRestricted = ref(false);
const relatedError = ref('');
let generation = 0;
let relatedRequest = 0;
let ready = false;
function thumbnail(item: { id: string; thumbnailId: string }) { return failedThumbnails.has(item.id) ? '' : archiveThumbnail(item.thumbnailId); }
function editionLabel(item: KeepReadingPage) { return [item.publicationName, formatArchivePublicationDate(item.publicationDate)].filter(Boolean).join(' · '); }
function keepReadingLabel(item: KeepReadingPage) { return `${item.publicationName || props.metadata.publicationName}, page ${item.pageNumber || 'unknown'}${item.sameEdition ? '' : `, ${formatArchivePublicationDate(item.publicationDate)}`}`; }
async function loadKeepReading() {
  const request = generation;
  keepReadingLoading.value = true;
  keepReadingError.value = '';
  keepReadingRestricted.value = false;
  try {
    const result = await getRelatedArchivedContent(buildRelatedArchivePayload(props.currentId, props.metadata));
    if (request === generation) keepReadingItems.value = keepReadingPages(result, props.metadata, props.currentId);
  } catch (error: any) {
    if (request !== generation) return;
    // Retrying cannot fix a 401/403, so readers without access get a hint instead of an error.
    const status = error?.statusCode ?? error?.status ?? error?.response?.status;
    if (status === 401 || status === 403) keepReadingRestricted.value = true;
    else keepReadingError.value = 'We could not load more pages to read. Please try again.';
  } finally { if (request === generation) keepReadingLoading.value = false; }
}
async function loadRelated() {
  const request = ++relatedRequest;
  const context = generation;
  relatedLoading.value = true;
  relatedError.value = '';
  try {
    const result = await searchArchives(buildArchiveSearchRequest({ pageNo: 1, pageSize: 12, query: relatedQuery.value }));
    if (context === generation && request === relatedRequest) remoteRelated.value = result.data || [];
  } catch { if (context === generation && request === relatedRequest) relatedError.value = 'We could not refresh related results. Available search results are still shown.'; }
  finally { if (context === generation && request === relatedRequest) relatedLoading.value = false; }
}
function initialise() {
  generation++;
  relatedRequest++;
  keepReadingItems.value = [];
  remoteRelated.value = [];
  failedThumbnails.clear();
  relatedLoading.value = false;
  relatedError.value = '';
  loadKeepReading();
  // Cached search hits are ranked immediately. Deep links fetch their own results.
  if (rankRelatedArchives(props.cachedItems, props.currentId).length < 3) loadRelated();
}
watch(() => [props.currentId, props.metadata.newspaperId, props.metadata.publicationName, props.metadata.publicationDate, relatedQuery.value], () => { if (ready) initialise(); });
onMounted(() => { ready = true; initialise(); });
onBeforeUnmount(() => { generation++; relatedRequest++; });
</script>

<style scoped>
.recommendation-button { @apply inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50; }
</style>
