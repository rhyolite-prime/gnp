<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <CampaignsSubNav
      title="Broadcast History"
      subtitle="Audit sent broadcasts, manage scheduled dispatches, and resume saved drafts across all channels."
    />

    <!-- Filter Bar -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-4 mb-6 space-y-4">
      <!-- Status Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex flex-wrap rounded-lg bg-gray-100 p-1 gap-1">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            type="button"
            @click="filters.status = tab.id"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
            :class="
              filters.status === tab.id
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <span class="text-xs text-gray-500">
          Showing <strong>{{ items.length }}</strong> broadcast(s)
        </span>
      </div>

      <!-- Search + Channel + Audience Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div class="sm:col-span-2 relative">
          <MagnifyingGlassIcon class="h-4 w-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by campaign name, headline, recipient, or group..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <select
          v-model="filters.channel"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Channels</option>
          <option value="push">Browser & In-App</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>

        <select
          v-model="filters.audienceType"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Audience Types</option>
          <option value="all_users_only">All Subscribers</option>
          <option value="groups">Targeted User Groups</option>
          <option value="users">Specific Users</option>
        </select>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div v-if="loading" class="p-16 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
        <p class="mt-3 text-sm text-gray-500">Loading broadcast history...</p>
      </div>

      <div v-else-if="displayedItems.length === 0" class="p-16 text-center">
        <p class="text-base font-medium text-gray-900">No broadcasts found</p>
        <p class="mt-1 text-sm text-gray-500">Adjust your filters or create a new broadcast.</p>
        <NuxtLink
          to="/admin/campaigns/new"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700"
        >
          Create Broadcast
        </NuxtLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Timing</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in displayedItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                  {{ item.pushTitle || item.subject || item.smsBody }}
                </p>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="ch in item.channels"
                    :key="ch"
                    class="px-2 py-0.5 text-xs font-medium rounded-md border"
                    :class="channelBadgeClass(ch)"
                  >
                    {{ formatChannel(ch) }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4">
                <p class="text-xs font-medium text-gray-900">{{ item.audienceLabel }}</p>
                <p class="text-[11px] text-gray-500">{{ item.audienceCount.toLocaleString() }} recipient(s)</p>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize"
                  :class="statusBadgeClass(item.status)"
                >
                  {{ item.status }}
                </span>
                <p class="text-[11px] text-gray-500 mt-1">
                  {{ formatTimestamp(item) }}
                </p>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <template v-if="item.status === 'sent'">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ item.metrics.delivered.toLocaleString() }} delivered
                  </p>
                  <p class="text-xs text-gray-500">
                    Open {{ item.metrics.openRate }}% · CTR {{ item.metrics.ctr }}%
                  </p>
                </template>
                <span v-else class="text-xs text-gray-400">Pending dispatch</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                <button
                  type="button"
                  @click="previewItem = item"
                  class="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Preview
                </button>

                <button
                  v-if="item.status === 'draft' || item.status === 'scheduled'"
                  type="button"
                  @click="handleAction(item.id, 'publish')"
                  class="text-green-600 hover:text-green-800 font-semibold cursor-pointer"
                >
                  Send Now
                </button>

                <NuxtLink
                  v-if="item.status === 'draft' || item.status === 'scheduled'"
                  :to="`/admin/campaigns/new?edit=${item.id}`"
                  class="text-primary-600 hover:text-primary-800"
                >
                  Edit
                </NuxtLink>

                <NuxtLink
                  :to="`/admin/campaigns/new?duplicate=${item.id}`"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Duplicate
                </NuxtLink>

                <button
                  v-if="item.status === 'scheduled'"
                  type="button"
                  @click="handleAction(item.id, 'cancel')"
                  class="text-amber-600 hover:text-amber-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  @click="handleAction(item.id, 'delete')"
                  class="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Broadcast Detail & Multi-Channel Preview Modal -->
    <div
      v-if="previewItem"
      class="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="previewItem = null"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ previewItem.name }}</h3>
            <p class="text-xs text-gray-500">
              {{ previewItem.audienceLabel }} · {{ previewItem.audienceCount.toLocaleString() }} recipient(s)
            </p>
          </div>
          <button
            type="button"
            @click="previewItem = null"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div v-if="previewItem.status === 'sent'" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-500">Delivered</p>
              <p class="text-lg font-bold text-gray-900">{{ previewItem.metrics.delivered.toLocaleString() }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-500">Opened / Read</p>
              <p class="text-lg font-bold text-gray-900">
                {{ previewItem.metrics.opened.toLocaleString() }} ({{ previewItem.metrics.openRate }}%)
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-500">Clicks</p>
              <p class="text-lg font-bold text-gray-900">
                {{ previewItem.metrics.clicked.toLocaleString() }} ({{ previewItem.metrics.ctr }}%)
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-xs text-gray-500">Attributed Revenue</p>
              <p class="text-lg font-bold text-gray-900">
                GH₵ {{ previewItem.metrics.revenueGhs.toLocaleString() }}
              </p>
            </div>
          </div>

          <CampaignMessagePreview
            :channels="previewItem.channels"
            :category="previewItem.category"
            :subject="previewItem.subject"
            :preheader="previewItem.preheader"
            :push-title="previewItem.pushTitle"
            :push-body="previewItem.pushBody"
            :email-body="previewItem.emailBody"
            :sms-body="previewItem.smsBody"
            :cta-label="previewItem.ctaLabel"
            :cta-url="previewItem.ctaUrl"
            :image-url="previewItem.imageUrl"
            :sample-user="previewItem.selectedUsers?.[0] || null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import CampaignsSubNav from '~/components/campaigns/CampaignsSubNav.vue';
import CampaignMessagePreview from '~/components/campaigns/CampaignMessagePreview.vue';
import {
  fetchCampaignHistory,
  performCampaignLifecycleAction,
  type CampaignBroadcastRecord,
  type MessagingChannel,
  type BroadcastStatus,
} from '~/services/campaigns';

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
});

const { $toast } = useNuxtApp();

const statusTabs = [
  { id: 'all', label: 'All Broadcasts' },
  { id: 'sent', label: 'Sent' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'draft', label: 'Drafts' },
  { id: 'cancelled', label: 'Cancelled' },
];

const loading = ref(true);
const items = ref<CampaignBroadcastRecord[]>([]);
const previewItem = ref<CampaignBroadcastRecord | null>(null);

const filters = reactive({
  status: 'all',
  channel: 'all',
  audienceType: 'all',
  search: '',
});

const displayedItems = computed(() => {
  if (filters.audienceType === 'all_users_only') {
    return items.value.filter((c) => c.audienceType === 'all');
  }
  return items.value;
});

async function loadHistory() {
  loading.value = true;
  try {
    const res = await fetchCampaignHistory({
      status: filters.status,
      channel: filters.channel,
      audienceType:
        filters.audienceType === 'all' || filters.audienceType === 'all_users_only'
          ? 'all'
          : filters.audienceType,
      search: filters.search,
    });
    items.value = res.items;
  } finally {
    loading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  filters,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadHistory, 180);
  },
  { deep: true }
);

async function handleAction(id: string, action: 'publish' | 'cancel' | 'delete') {
  if (action === 'delete' && !confirm('Delete this broadcast record?')) return;
  await performCampaignLifecycleAction(id, action);
  const label =
    action === 'publish'
      ? 'Broadcast dispatched now!'
      : action === 'cancel'
        ? 'Scheduled broadcast cancelled.'
        : 'Broadcast deleted.';
  $toast?.success?.(label);
  await loadHistory();
}

function formatChannel(ch: MessagingChannel): string {
  if (ch === 'push') return 'Browser & In-App';
  if (ch === 'email') return 'Email';
  return 'SMS';
}

function channelBadgeClass(ch: MessagingChannel): string {
  if (ch === 'push') return 'bg-red-50 text-red-700 border-red-200';
  if (ch === 'email') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

function statusBadgeClass(status: BroadcastStatus): string {
  if (status === 'sent') return 'bg-green-100 text-green-800';
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-800';
}

function formatTimestamp(item: CampaignBroadcastRecord): string {
  if (item.status === 'sent' && item.sentAt) {
    return `Sent ${new Date(item.sentAt).toLocaleString()}`;
  }
  if (item.status === 'scheduled' && item.scheduledAt) {
    return `Scheduled ${new Date(item.scheduledAt).toLocaleString()}`;
  }
  return `Saved ${new Date(item.createdAt).toLocaleDateString()}`;
}

onMounted(loadHistory);
</script>
