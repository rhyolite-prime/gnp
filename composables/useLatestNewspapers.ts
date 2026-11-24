import { computed } from 'vue';
import { getLatestNewsPapers } from '~/services/newsPapers';
import type { LatestNewsPaper } from '~/utils/latestNewspapers';

/**
 * Shared client-side feed for the homepage hero and “Latest Newspapers” section.
 * A single useAsyncData key keeps both components on one request/payload.
 */
export function useLatestNewspapers() {
  const request = useAsyncData<LatestNewsPaper[]>(
    'home-latest-newspapers',
    async () => {
      const result = await getLatestNewsPapers({ pageNo: 1, pageSize: 12 });
      if (!Array.isArray(result?.data)) {
        throw new Error('Unable to load the latest newspapers');
      }
      return result.data;
    },
    {
      server: false,
      lazy: true,
      // Both homepage components mount together; share the in-flight request.
      dedupe: 'defer',
      default: () => [],
    },
  );

  const newspapers = computed(() => request.data.value ?? []);
  const isLoading = computed(() => request.status.value === 'idle' || request.status.value === 'pending');

  return {
    newspapers,
    isLoading,
    error: request.error,
    refresh: request.refresh,
  };
}
