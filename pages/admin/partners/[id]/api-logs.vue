<template>
  <div class="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-6">
      <button @click="goBack" class="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowLeftIcon class="h-4 w-4 mr-1" /> Back to Partners
      </button>
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
        {{ partnerName ? `${partnerName} — API Request Logs` : 'API Request Logs' }}
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        Every API request this partner has made. Select a row to inspect the request and response.
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-4 mb-6">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <!-- Search -->
        <div>
          <label for="log-search" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="log-search"
              v-model="filters.query"
              type="text"
              placeholder="Search requests…"
              class="w-full rounded-lg border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-primary-600 focus:ring-primary-600"
            />
          </div>
        </div>

        <!-- Method -->
        <div>
          <label for="log-method" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Method</label>
          <select id="log-method" v-model="filters.method" class="w-full rounded-lg border-gray-200 bg-white py-2 text-sm focus:border-primary-600 focus:ring-primary-600">
            <option value="">All methods</option>
            <option v-for="m in HTTP_METHODS" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- Outcome -->
        <div>
          <label for="log-outcome" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Outcome</label>
          <select id="log-outcome" v-model="filters.isSuccessful" class="w-full rounded-lg border-gray-200 bg-white py-2 text-sm focus:border-primary-600 focus:ring-primary-600">
            <option value="">All outcomes</option>
            <option value="true">Successful</option>
            <option value="false">Failed</option>
          </select>
        </div>

        <!-- Date from -->
        <div>
          <span class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">From</span>
          <ClientOnly>
            <VueDatePicker
              class="archive-date-picker"
              :model-value="filters.dateFrom || null"
              model-type="yyyy-MM-dd"
              :formats="{ input: 'dd MMM yyyy' }"
              placeholder="Any date"
              :max-date="dateToLimit"
              :time-picker="false"
              auto-apply
              clearable
              @update:model-value="filters.dateFrom = $event ?? ''"
            />
            <template #fallback>
              <div class="h-[38px] w-full rounded-lg border border-gray-200 bg-gray-50"></div>
            </template>
          </ClientOnly>
        </div>

        <!-- Date to -->
        <div>
          <span class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">To</span>
          <ClientOnly>
            <VueDatePicker
              class="archive-date-picker"
              :model-value="filters.dateTo || null"
              model-type="yyyy-MM-dd"
              :formats="{ input: 'dd MMM yyyy' }"
              placeholder="Any date"
              :min-date="dateFromLimit"
              :time-picker="false"
              auto-apply
              clearable
              @update:model-value="filters.dateTo = $event ?? ''"
            />
            <template #fallback>
              <div class="h-[38px] w-full rounded-lg border border-gray-200 bg-gray-50"></div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          <span v-if="!isLoading">{{ paginationParams.totalCount.toLocaleString() }} request{{ paginationParams.totalCount === 1 ? '' : 's' }}</span>
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          type="button"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Logs table -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Method</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Endpoint</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Duration</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">IP Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="isLoading && logs.length === 0">
              <td colspan="6" class="px-3 py-12 text-center text-sm text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                  <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                  <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="6" class="px-3 py-12 text-center">
                <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-semibold text-gray-900">No API requests found</h3>
                <p class="mt-1 text-sm text-gray-500">Try changing or clearing the filters.</p>
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="log in logs"
                :key="log.id"
                role="button"
                tabindex="0"
                class="cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                @click="openDetail(log)"
                @keydown.enter.prevent="openDetail(log)"
              >
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(log.createdAt) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span :class="methodClass(log.method)" class="inline-flex rounded px-2 py-0.5 text-xs font-bold">{{ log.method }}</span>
                </td>
                <td class="max-w-md truncate px-3 py-4 font-mono text-sm text-gray-900" :title="log.endpoint">{{ log.endpoint }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    :class="isLogSuccessful(log) ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'"
                    class="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                  >
                    {{ log.statusCode }} · {{ isLogSuccessful(log) ? 'Success' : 'Failed' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ log.durationMs != null ? `${log.durationMs} ms` : '—' }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ log.ipAddress || '—' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="border-t border-gray-200 px-4 py-3">
        <ClientOnly>
          <SimplePagination
            :lower-bound="paginationParams.lowerBound"
            :upper-bound="paginationParams.upperBound"
            :page-no="filters.pageNo"
            :total-pages="paginationParams.totalPages"
            :total-count="paginationParams.totalCount"
            :disabled="isLoading"
            @on-page-changed="onPageChange"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Request / Response detail -->
    <TransitionRoot appear :show="showDetail" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDetail">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-150"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-200"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-150"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-xl">
                <div class="flex items-start justify-between gap-4 mb-5">
                  <div class="min-w-0">
                    <DialogTitle as="h3" class="text-lg font-semibold text-gray-900">API request details</DialogTitle>
                    <div v-if="selectedLog" class="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span :class="methodClass(selectedLog.method)" class="inline-flex rounded px-2 py-0.5 text-xs font-bold">{{ selectedLog.method }}</span>
                      <span class="font-mono break-all">{{ selectedLog.endpoint }}</span>
                      <span class="text-gray-300">|</span>
                      <span>{{ formatDate(selectedLog.createdAt) }}</span>
                      <span v-if="selectedLog.durationMs != null" class="text-gray-300">|</span>
                      <span v-if="selectedLog.durationMs != null">{{ selectedLog.durationMs }} ms</span>
                      <span v-if="selectedLog.ipAddress" class="text-gray-300">|</span>
                      <span v-if="selectedLog.ipAddress">{{ selectedLog.ipAddress }}</span>
                    </div>
                  </div>
                  <button @click="closeDetail" class="rounded-md p-1 text-gray-400 hover:text-gray-600" aria-label="Close">
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <!-- Request card: blue outline -->
                  <section class="flex min-h-0 flex-col rounded-xl bg-gray-50 p-4 outline outline-2 outline-offset-2 outline-blue-500">
                    <div class="mb-3 flex items-center justify-between">
                      <h4 class="text-sm font-semibold text-gray-900">Request</h4>
                      <span class="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">JSON</span>
                    </div>
                    <pre class="max-h-[60vh] overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-4 font-mono text-xs text-gray-800">{{ requestJson }}</pre>
                  </section>

                  <!-- Response card: green outline on success, red on failure -->
                  <section
                    :class="responseOk ? 'outline-green-500' : 'outline-red-500'"
                    class="flex min-h-0 flex-col rounded-xl bg-gray-50 p-4 outline outline-2 outline-offset-2"
                  >
                    <div class="mb-3 flex items-center justify-between">
                      <h4 class="text-sm font-semibold text-gray-900">Response</h4>
                      <div class="flex items-center gap-2">
                        <span v-if="selectedLog" class="text-xs text-gray-500">HTTP {{ selectedLog.statusCode }}</span>
                        <span
                          :class="responseOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                          class="rounded px-2 py-0.5 text-xs font-medium"
                        >
                          {{ responseOk ? 'Success' : 'Failed' }}
                        </span>
                      </div>
                    </div>
                    <pre class="max-h-[60vh] overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-4 font-mono text-xs text-gray-800">{{ responseJson }}</pre>
                  </section>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import type { PartnerApiRequestLog, PartnerApiRequestLogQuery } from '~/models';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const partnerId = route.params.id as string;

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

type OutcomeFilter = '' | 'true' | 'false';

// Filters are seeded from the URL so a filtered view can be shared or reloaded.
const filters = reactive({
  query: String(route.query.query ?? ''),
  method: String(route.query.method ?? ''),
  isSuccessful: (route.query.isSuccessful === 'true' || route.query.isSuccessful === 'false' ? route.query.isSuccessful : '') as OutcomeFilter,
  dateFrom: String(route.query.dateFrom ?? ''),
  dateTo: String(route.query.dateTo ?? ''),
  pageNo: Math.max(1, Number(route.query.pageNo ?? 1) || 1),
  pageSize: 20,
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0,
});

const partnerName = ref('');
const logs = ref<PartnerApiRequestLog[]>([]);
const isLoading = ref(true);

const showDetail = ref(false);
const selectedLog = ref<PartnerApiRequestLog | null>(null);

const hasActiveFilters = computed(() =>
  !!(filters.query.trim() || filters.method || filters.isSuccessful || filters.dateFrom || filters.dateTo)
);

// Date bounds keep the From/To pickers consistent (From can't exceed To and vice versa).
const parseIsoDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : null);
const dateFromLimit = computed(() => parseIsoDate(filters.dateFrom));
const dateToLimit = computed(() => parseIsoDate(filters.dateTo));

const methodClass = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-50 text-blue-700';
    case 'POST': return 'bg-green-50 text-green-700';
    case 'PUT': return 'bg-amber-50 text-amber-700';
    case 'PATCH': return 'bg-purple-50 text-purple-700';
    case 'DELETE': return 'bg-red-50 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Prefer the explicit flag; fall back to the HTTP status when it's missing.
const isLogSuccessful = (log: PartnerApiRequestLog) =>
  typeof log.isSuccessful === 'boolean' ? log.isSuccessful : log.statusCode >= 200 && log.statusCode < 300;

const formatDate = (date: string) => dayjs(date).format('MMM D, YYYY h:mm:ss A');

const formatJson = (value: unknown): string => {
  if (value === undefined || value === null) return 'No payload';
  if (typeof value === 'string') {
    if (value.trim() === '') return 'No payload';
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
};

const requestJson = computed(() => formatJson(selectedLog.value?.requestBody));
const responseJson = computed(() => formatJson(selectedLog.value?.responseBody));
const responseOk = computed(() => (selectedLog.value ? isLogSuccessful(selectedLog.value) : false));

const buildQuery = (): PartnerApiRequestLogQuery => {
  const query: PartnerApiRequestLogQuery = {
    partnerId,
    pageNo: filters.pageNo,
    pageSize: filters.pageSize,
  };
  const search = filters.query.trim();
  if (search) query.query = search;
  if (filters.method) query.method = filters.method;
  if (filters.isSuccessful) query.isSuccessful = filters.isSuccessful === 'true';
  if (filters.dateFrom) query.dateFrom = filters.dateFrom;
  if (filters.dateTo) query.dateTo = filters.dateTo;
  return query;
};

const syncUrl = () => {
  const urlQuery = filterQueryParams({
    query: filters.query.trim(),
    method: filters.method,
    isSuccessful: filters.isSuccessful,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    pageNo: filters.pageNo > 1 ? filters.pageNo : '',
  });
  router.replace({ query: urlQuery });
};

const fetchLogs = async () => {
  isLoading.value = true;
  try {
    const result = await getPartnerApiRequestLogs(buildQuery());
    logs.value = result?.data ?? [];
    paginationParams.totalPages = result?.totalPages ?? 0;
    paginationParams.totalCount = result?.totalCount ?? 0;
    paginationParams.lowerBound = result?.lowerBound ?? 0;
    paginationParams.upperBound = result?.upperBound ?? 0;
  } catch (error) {
    console.error('Error fetching API request logs:', error);
    logs.value = [];
    $toast.error('Unable to load API request logs.');
  } finally {
    isLoading.value = false;
  }
};

const fetchPartnerName = async () => {
  try {
    const partner = await getCommercialPartnerDetails(partnerId);
    partnerName.value = partner?.name ?? '';
  } catch (error) {
    console.error('Error fetching partner details:', error);
  }
};

// Any filter change restarts from page 1 and refetches.
const applyFilters = () => {
  filters.pageNo = 1;
  syncUrl();
  fetchLogs();
};

const debouncedSearch = debounce(applyFilters, 400);
watch(() => filters.query, debouncedSearch);
watch([() => filters.method, () => filters.isSuccessful, () => filters.dateFrom, () => filters.dateTo], applyFilters);

const clearFilters = () => {
  filters.query = '';
  filters.method = '';
  filters.isSuccessful = '';
  filters.dateFrom = '';
  filters.dateTo = '';
};

const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber;
  syncUrl();
  await fetchLogs();
};

const openDetail = (log: PartnerApiRequestLog) => {
  selectedLog.value = log;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
};

const goBack = () => {
  router.push('/admin/partners');
};

onMounted(async () => {
  await Promise.all([fetchPartnerName(), fetchLogs()]);
});

useHead({
  title: computed(() => `API Logs | ${partnerName.value || 'Partner'}`),
});
</script>

<style scoped>
.archive-date-picker {
  --dp-primary-color: #e32932;
  --dp-primary-text-color: #ffffff;
  --dp-font-family: inherit;
}
</style>
