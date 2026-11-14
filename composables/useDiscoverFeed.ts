import { ref, computed, onBeforeUnmount } from 'vue';
import { CONTENT_CATEGORIES, type ContentCategoryId } from '~/utils/contentCategories';
import { searchArchives, buildArchiveSearchRequest } from '~/services/archives';
import { getNewsPapers, getTopStories, getVideos } from '~/services/newsPapers';
import {
  archiveFeedItem, newspaperFeedItem, storyFeedItem, videoFeedItem,
  personaliseFeedItem, mixDiscoverBatch, shuffleFeed, type DiscoverItem,
} from '~/utils/discoverFeed';
import type { Article } from '~/models';

interface FeedPage { items: DiscoverItem[]; more: boolean }
interface Source { id: string; label: string; page: number; done: boolean; preferred: boolean; fetch: (page: number) => Promise<FeedPage> }

export function useDiscoverFeed() {
  const items = ref<DiscoverItem[]>([]);
  const loading = ref(false);
  const errors = ref<{ id: string; label: string }[]>([]);
  const more = ref(true);
  const selection = ref<ContentCategoryId[]>([]);
  const finished = computed(() => !more.value && !loading.value);
  let sources: Source[] = [];
  let generation = 0;
  let preferredIndex = 0;
  let seen = new Set<string>();
  let disposed = false;
  let sampleQueue: DiscoverItem[] | null = null;

  function buildSources(selected: ContentCategoryId[]): Source[] {
    const source = (id: string, label: string, fetch: Source['fetch'], preferred = false): Source => ({ id, label, fetch, preferred, page: 1, done: false });
    return [
      source('archives', 'Archive pages', async page => {
        const result = await searchArchives(buildArchiveSearchRequest({ pageNo: page, pageSize: 8, sortOrder: 'desc' }));
        return { items: (result.data || []).filter(item => item.id).map(archiveFeedItem), more: !!result.data?.length && page < result.totalPages };
      }),
      source('newspapers', 'Newspaper editions', async page => {
        const result = await getNewsPapers({ pageNo: page, pageSize: 6 });
        if (!result || !Array.isArray(result.data)) throw new Error('Newspaper catalogue unavailable');
        return { items: result.data.filter(item => item.id && item.isPublished !== false).map(newspaperFeedItem), more: !!result.data.length && page < result.totalPages };
      }),
      source('videos', 'Videos', async page => {
        const result = await getVideos({ pageNo: page, pageSize: 6 });
        return { items: result.data.filter(item => item.id).map(videoFeedItem), more: !!result.data.length && page < result.totalPages };
      }),
      source('stories', 'Top stories', async () => {
        // This endpoint is unpaginated and has appeared as both array and { data } envelopes.
        const raw: unknown = await getTopStories();
        const list = Array.isArray(raw) ? raw : (raw as { data?: Article[] } | null)?.data;
        if (!Array.isArray(list)) throw new Error('Top stories unavailable');
        return { items: list.filter((item: Article) => item.id && item.attributes).map(storyFeedItem), more: false };
      }),
      ...shuffleFeed(CONTENT_CATEGORIES.filter(category => selected.includes(category.id))).map(category => source(
        `interest:${category.id}`, category.label, async page => {
          const result = await searchArchives(buildArchiveSearchRequest({ pageNo: page, pageSize: 12, query: category.query, sortOrder: 'desc' }));
          return {
            items: (result.data || []).filter(item => item.id).map(item => ({ ...archiveFeedItem(item), preferred: true, reason: category.label })),
            more: !!result.data?.length && page < result.totalPages,
          };
        }, true,
      )),
    ];
  }

  async function loadMore() {
    if (loading.value || !more.value || disposed) return;
    if (sampleQueue !== null) {
      loading.value = true;
      items.value.push(...sampleQueue.splice(0, 12));
      more.value = sampleQueue.length > 0;
      loading.value = false;
      return;
    }
    const currentGeneration = generation;
    loading.value = true;
    const general = sources.filter(source => !source.preferred && !source.done);
    const preferred = sources.filter(source => source.preferred && !source.done);
    const chosen: Source[] = [...general];
    // Bound category requests: rotate through interests rather than requesting 21 at once.
    for (let i = 0; i < Math.min(2, preferred.length); i++) chosen.push(preferred[(preferredIndex + i) % preferred.length]!);
    if (preferred.length) preferredIndex = (preferredIndex + Math.min(2, preferred.length)) % preferred.length;
    const results = await Promise.allSettled(chosen.map(source => source.fetch(source.page)));
    if (disposed || generation !== currentGeneration) return;
    const batch: DiscoverItem[] = [];
    for (let index = 0; index < results.length; index++) {
      const result = results[index]!;
      const source = chosen[index]!;
      errors.value = errors.value.filter(error => error.id !== source.id);
      if (result.status === 'fulfilled') {
        source.page++;
        source.done = !result.value.more;
        batch.push(...result.value.items.map(item => personaliseFeedItem(item, selection.value)));
      } else errors.value.push({ id: source.id, label: source.label });
    }
    items.value.push(...mixDiscoverBatch(batch, seen));
    more.value = sources.some(source => !source.done);
    loading.value = false;
  }

  async function reset(selected: ContentCategoryId[], samples?: DiscoverItem[]) {
    generation++;
    selection.value = [...selected];
    sampleQueue = samples ? mixDiscoverBatch(samples.map(item => personaliseFeedItem(item, selected)), new Set()) : null;
    sources = samples ? [] : buildSources(selected);
    preferredIndex = 0;
    seen = new Set();
    items.value = [];
    errors.value = [];
    more.value = true;
    loading.value = false;
    await loadMore();
  }
  onBeforeUnmount(() => { disposed = true; generation++; });
  return { items, loading, errors, more, finished, selection, loadMore, reset };
}
