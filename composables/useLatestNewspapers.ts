import { computed } from 'vue';
import { getLatestNewsPapers } from '~/services/newsPapers';
import type { NewsPaper } from '~/models';

/**
 * Shared client-side feed for the homepage hero and “Latest Newspapers” section.
 * A single useAsyncData key keeps both components on one request/payload.
 */
export function useLatestNewspapers() {
  const request = useAsyncData<NewsPaper[]>(
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
