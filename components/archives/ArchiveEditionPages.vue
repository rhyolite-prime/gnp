<template>
  <!--
    Page list beside the archive reader, fed by news-papers/get-related-archived-content.
    Vertical and scrollable on large screens, a horizontal strip above the reader on small ones.
    Renders nothing when there is nothing to navigate to, so the reader keeps the full width.
  -->
  <aside
    v-if="loading || pages.length || error"
    :aria-labelledby="titleId"
    :aria-busy="loading"
    class="relative lg:w-44 lg:shrink-0"
  >
    <div class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:absolute lg:inset-0">
      <div class="flex items-end justify-between gap-3 border-b border-gray-100 px-4 py-3 lg:block">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-red-600">Keep reading</p>
          <h2 :id="titleId" class="mt-1 text-sm font-bold text-gray-900">{{ title }}</h2>
        </div>
        <p v-if="pages.length" class="text-xs font-medium text-gray-500 lg:mt-1">{{ pages.length }} {{ pages.length === 1 ? 'page' : 'pages' }}</p>
      </div>

      <div v-if="loading" role="status" class="flex gap-3 overflow-hidden p-3 lg:min-h-0 lg:flex-1 lg:flex-col">
        <span class="sr-only">Loading the pages of this edition…</span>
        <div v-for="n in 4" :key="n" class="w-24 shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-1.5 lg:w-auto" aria-hidden="true">
          <div class="aspect-[3/4] rounded-lg bg-gray-200"></div>
          <div class="mx-auto mt-2 h-3 w-12 rounded bg-gray-200"></div>
        </div>
      </div>

      <ul
        v-else-if="pages.length"
        ref="listEl"
        class="flex gap-3 overflow-x-auto overscroll-contain p-3 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
      >
        <li v-for="page in pages" :key="page.id" class="w-24 shrink-0 lg:w-auto">
          <NuxtLink
            :to="`/archives/${encodeURIComponent(page.id)}`"
            :aria-current="isCurrent(page) ? 'page' : undefined"
            :aria-label="pageLabel(page)"
            class="group block rounded-xl border p-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            :class="isCurrent(page) ? 'border-red-500 bg-red-50 ring-2 ring-red-500/30' : 'border-gray-200 bg-gray-50 hover:border-red-400'"
          >
            <div class="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-white">
              <img v-if="thumbnail(page)" :src="thumbnail(page)" alt="" loading="lazy" decoding="async" class="h-full w-full object-contain" @error="failedThumbnails.add(page.id)" />
              <span v-else class="text-3xl text-gray-300" aria-hidden="true">▤</span>
              <span v-if="isCurrent(page)" class="absolute inset-x-0 bottom-0 bg-red-600 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">Reading</span>
            </div>
            <p class="mt-1.5 text-center text-xs font-bold" :class="isCurrent(page) ? 'text-red-700' : 'text-gray-800 group-hover:text-red-600'">
              {{ page.pageNumber ? `Page ${page.pageNumber}` : isCurrent(page) ? 'This page' : 'Page —' }}
            </p>
            <p v-if="!page.sameEdition" class="mt-0.5 line-clamp-2 text-center text-[11px] leading-tight text-gray-500">{{ editionLabel(page) }}</p>
          </NuxtLink>
        </li>
      </ul>

      <div v-else role="status" class="p-4 text-sm text-red-700">
        <p>{{ error }}</p>
        <button type="button" class="mt-3 inline-flex min-h-[40px] items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600" @click="load">Try again</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue';
import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';
import { getRelatedArchivedContent } from '~/services/newsPapers';
import type { KeepReadingPage } from '~/utils/archiveRecommendations';
import {
  archiveThumbnail,
  buildRelatedArchivePayload,
  currentArchivePage,
  editionPages,
  isCurrentArchivePage,
  keepReadingPages,
  relatedArchivePages,
} from '~/utils/archiveRecommendations';
import { formatArchivePublicationDate } from '~/utils/archiveAccess';

const props = withDefaults(defineProps<{
  /** Archive page shown in the reader (route id). */
  currentId: string;
  /** Access metadata of that page; null while the reader is switching pages. */
  metadata: ArchiveAccessMetadata | null;
  /** Archive search hits already in memory; they can describe the page being read. */
  knownItems?: ArchiveSearchItem[];
}>(), { knownItems: () => [] });

const titleId = useId();
const listEl = ref<HTMLElement | null>(null);
/** Every page offered, including the one being read. */
const pages = ref<KeepReadingPage[]>([]);
const loading = ref(true);
const error = ref('');
const failedThumbnails = reactive(new Set<string>());
/** Records seen so far, by id: lets a page keep its thumbnail and number once it becomes the one being read. */
const known = new Map<string, KeepReadingPage>();
let generation = 0;

const title = computed(() => pages.value.every(page => page.sameEdition) ? 'Pages in this edition' : 'Related archive pages');

function isCurrent(page: KeepReadingPage) { return isCurrentArchivePage(page, props.currentId, props.metadata); }
function thumbnail(page: KeepReadingPage) { return failedThumbnails.has(page.id) ? '' : archiveThumbnail(page.thumbnailId); }
function editionLabel(page: KeepReadingPage) { return [page.publicationName, formatArchivePublicationDate(page.publicationDate)].filter(Boolean).join(' · '); }
function pageLabel(page: KeepReadingPage) {
  const where = page.sameEdition ? '' : `${editionLabel(page)}, `;
  return `${where}${page.pageNumber ? `page ${page.pageNumber}` : 'this page'}${isCurrent(page) ? ', currently open' : ''}`;
}

function knownCurrent(currentId: string, metadata: ArchiveAccessMetadata): KeepReadingPage | undefined {
  const record = known.get(currentId) ?? known.get(metadata.newspaperId);
  if (record) return record;
  const hit = props.knownItems.find(item => item.id === currentId);
  return hit ? relatedArchivePages([hit], metadata)[0] : undefined;
}

async function load() {
  const { currentId, metadata } = props;
  // While the reader switches pages the metadata is briefly unknown; the list stays as it is.
  if (!metadata) return;
  const request = ++generation;
  // Moving to a page that is already listed must not blank the list: refresh it quietly.
  const quiet = pages.value.some(isCurrent);
  if (!quiet) pages.value = [];
  loading.value = !quiet;
  error.value = '';
  try {
    const others = keepReadingPages(await getRelatedArchivedContent(buildRelatedArchivePayload(currentId, metadata)), metadata, currentId);
    if (request !== generation) return;
    for (const page of others) known.set(page.id, page);

    let current = knownCurrent(currentId, metadata);
    const sibling = others.find(page => page.sameEdition);
    if (!current && sibling) {
      // The API never returns the page it was asked about, so on a direct visit its
      // thumbnail and page number are unknown. A sibling's list contains it.
      try {
        const viaSibling = relatedArchivePages(await getRelatedArchivedContent(buildRelatedArchivePayload(sibling.id, metadata)), metadata);
        if (request !== generation) return;
        current = viaSibling.find(page => isCurrentArchivePage(page, currentId, metadata));
        if (current) known.set(current.id, current);
      } catch { /* The list is still usable without the current page's thumbnail. */ }
    }
    pages.value = others.length ? editionPages(others, current ?? currentArchivePage(currentId, metadata)) : [];
  } catch (cause: any) {
    if (request !== generation || quiet) return;
    // Retrying cannot fix a 401/403; the pane steps aside and the paywall explains.
    const status = cause?.statusCode ?? cause?.status ?? cause?.response?.status;
    if (status !== 401 && status !== 403) error.value = 'We could not load the other pages.';
  } finally {
    if (request === generation) loading.value = false;
  }
}

/**
 * Brings the page being read into view by scrolling the list, never the window.
 * A thumbnail that is already fully visible (the one just clicked) stays put;
 * one that is cut off or off-screen is centred so its neighbours show too.
 */
async function revealCurrent() {
  await nextTick();
  const list = listEl.value;
  const item = list?.querySelector<HTMLElement>('[aria-current="page"]');
  if (!list || !item) return;
  const box = list.getBoundingClientRect();
  const rect = item.getBoundingClientRect();
  const centre = (start: number, end: number, boxStart: number, boxEnd: number) =>
    start >= boxStart && end <= boxEnd ? 0 : (start + end) / 2 - (boxStart + boxEnd) / 2;
  const top = centre(rect.top, rect.bottom, box.top, box.bottom);
  const left = centre(rect.left, rect.right, box.left, box.right);
  if (top || left) list.scrollBy({ top, left });
}

let mounted = false;
onMounted(() => { mounted = true; load(); });
watch(() => [props.currentId, props.metadata?.newspaperId, props.metadata?.publicationName, props.metadata?.publicationDate], (now, before) => {
  if (!mounted) return;
  if (now[0] !== before[0]) {
    // Whatever was being fetched described the previous page.
    generation++;
    // A document that is not in the list belongs to an edition not loaded yet.
    if (!pages.value.some(isCurrent)) { pages.value = []; loading.value = true; error.value = ''; }
  }
  load();
});
watch([() => props.currentId, pages], revealCurrent, { flush: 'post' });
onBeforeUnmount(() => { generation++; });
</script>
