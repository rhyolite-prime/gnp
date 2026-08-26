<template>
  <div class="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBack" class="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowLeftIcon class="h-4 w-4 mr-1"/> Back to Partners
      </button>
      <div class="mt-2 md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {{ partnerDetails?.name }} — API Keys
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Manage API access, scopes, and IP restrictions for this partner.
          </p>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <button
            @click="openGenerateModal"
            type="button"
            class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            Generate New Key
          </button>
        </div>
      </div>
    </div>

    <!-- API Keys List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Label</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client ID</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scopes</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Allowed IPs</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Used</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="isFetchingKeys">
              <td colspan="6" class="px-3 py-12 text-center text-sm text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="apiKeys.length === 0">
              <td colspan="6" class="px-3 py-12 text-center">
                <KeyIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-semibold text-gray-900">No API keys</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by generating a new API key.</p>
                <div class="mt-6">
                  <button @click="openGenerateModal" class="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
                    Generate New Key
                  </button>
                </div>
              </td>
            </tr>
            <template v-else v-for="key in apiKeys" :key="key.id">
              <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleKeyDetails(key.id)">
                <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <ChevronRightIcon :class="['h-4 w-4 mr-2 transition-transform', expandedKeyIds.has(key.id) ? 'rotate-90' : '']" />
                    {{ key.label }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono text-xs">
                  <div class="flex items-center gap-2">
                    {{ key.clientId }}
                    <button @click.stop="copyToClipboard(key.clientId)" class="text-gray-400 hover:text-primary-600 transition-colors">
                      <ClipboardIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4 text-sm text-gray-500">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="scope in key.scopes" :key="scope" class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {{ scope }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-4 text-sm text-gray-500">
                  <span v-if="!key.allowedIps?.length" class="text-gray-400 italic">No restrictions</span>
                  <div v-else class="flex flex-wrap gap-1">
                    <span v-for="ip in key.allowedIps" :key="ip" class="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {{ ip }}
                    </span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never' }}
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button @click.stop="confirmRevoke(key)" class="text-red-600 hover:text-red-900">Revoke</button>
                </td>
              </tr>
              <!-- Expanded details -->
              <tr v-if="expandedKeyIds.has(key.id)">
                <td colspan="6" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Scope Management -->
                    <div>
                      <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Scopes</h4>
                      <div class="flex gap-2 mb-3">
                        <select 
                          v-model="newScope[key.id]" 
                          class="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                        >
                          <option value="">Select a scope...</option>
                          <option v-for="scope in availableScopes" :key="scope.value" :value="scope.value">
                            {{ scope.name }} ({{ scope.value }})
                          </option>
                        </select>
                        <button @click="addScope(key)" class="rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Add</button>
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="scope in key.scopes" :key="scope" class="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {{ scope }}
                          <button @click="removeScope(key, scope)" type="button" class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20">
                            <span class="sr-only">Remove</span>
                            <XMarkIcon class="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <!-- IP Management -->
                    <div>
                      <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Allowed IP Addresses</h4>
                      <div class="flex gap-2 mb-3">
                        <input 
                          v-model="newIp[key.id]" 
                          @keyup.enter="addIp(key)"
                          type="text" 
                          placeholder="e.g. 192.168.1.1" 
                          class="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                        />
                        <button @click="addIp(key)" class="rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Add</button>
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="ip in key.allowedIps" :key="ip" class="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {{ ip }}
                          <button @click="removeIp(key, ip)" type="button" class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-600/20">
                            <span class="sr-only">Remove</span>
                            <XMarkIcon class="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <button 
                      @click="saveKeyChanges(key)" 
                      :disabled="isUpdatingKey === key.id"
                      class="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                    >
                      {{ isUpdatingKey === key.id ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Generate Modal -->
    <div v-if="showGenerateModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <KeyIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Generate New API Key</h3>
                <div class="mt-4 text-left">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input 
                      v-model="newKeyData.label"
                      type="text" 
                      placeholder="e.g. Production Mobile App"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button 
                @click="handleGenerateKey"
                :disabled="isGenerating || !newKeyData.label"
                type="button" 
                class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:col-start-2 disabled:opacity-50"
              >
                {{ isGenerating ? 'Generating...' : 'Generate' }}
              </button>
              <button @click="closeGenerateModal" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secret Disclosure Modal -->
    <div v-if="revealedSecret" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <ExclamationTriangleIcon class="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-base font-semibold leading-6 text-gray-900">API Key Secret</h3>
                <p class="mt-2 text-sm text-gray-500">
                  Copy your Client Secret now. It will <strong>NOT</strong> be shown again.
                </p>
                <div class="mt-4 text-left space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Client ID</label>
                    <div class="bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-4 border border-gray-200">
                      <code class="text-xs font-mono break-all text-gray-900">{{ revealedClientId }}</code>
                      <button @click="copyToClipboard(revealedClientId)" class="text-primary-600 hover:text-primary-700 shrink-0">
                        <ClipboardIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Client Secret</label>
                    <div class="bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-4 border border-gray-200">
                      <code class="text-xs font-mono break-all text-gray-900">{{ revealedSecret }}</code>
                      <button @click="copyToClipboard(revealedSecret)" class="text-primary-600 hover:text-primary-700 shrink-0">
                        <ClipboardIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Onboard Endpoint URL</label>
                    <div class="bg-blue-50 p-3 rounded-lg flex items-center justify-between gap-4 border border-blue-100">
                      <code class="text-xs font-mono break-all text-blue-900">https://api.graphicnewsplus.com/api/v1/partner-api/onboard-subscriber</code>
                      <button @click="copyToClipboard('https://api.graphicnewsplus.com/api/v1/partner-api/onboard-subscriber')" class="text-blue-600 hover:text-blue-700 shrink-0">
                        <ClipboardIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sample Curl Command</label>
                    <div class="relative mt-1">
                      <pre class="bg-gray-900 text-gray-300 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap"><code>{{ sampleCurl }}</code></pre>
                      <button 
                        @click="copyToClipboard(sampleCurl)" 
                        class="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                        title="Copy curl command"
                      >
                        <ClipboardIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button @click="revealedSecret = null; revealedClientId = null" type="button" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revoke Confirmation Modal -->
    <ConfirmModal 
      :show="showConfirmModal"
      title="Revoke API Key"
      message="Are you sure you want to revoke this API key? This will permanently disable all integrations using this key."
      confirm-text="Revoke Key"
      cancel-text="Cancel"
      type="danger"
      :loading="isRevoking"
      @confirm="handleRevokeKey"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeftIcon, 
  KeyIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  ClipboardIcon
} from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import type { CommercialPartner, CommercialPartnerApiKey } from "~/models";
import { 
  getCommercialPartnerDetails, 
  getPartnerApiKeys, 
  generatePartnerApiKey, 
  revokePartnerApiKey,
  updatePartnerApiKey
} from "~/services/admin";

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const partnerId = route.params.id as string;

const partnerDetails = ref<CommercialPartner | null>(null);
const apiKeys = ref<CommercialPartnerApiKey[]>([]);
const isFetchingKeys = ref(true);
const isFetchingPartner = ref(true);

const expandedKeyIds = ref<Set<string>>(new Set());
const newScope = reactive<Record<string, string>>({});
const newIp = reactive<Record<string, string>>({});
const isUpdatingKey = ref<string | null>(null);

const availableScopes = [
  { name: 'Read Content', value: 'content:read' },
  { name: 'Read Subscribers', value: 'subscribers:read' },
  { name: 'Write Subscribers', value: 'subscribers:write' },
  { name: 'Manage Subscribers', value: 'subscribers:manage' },
  { name: 'Check Access (Entitlements)', value: 'access:check' },
  { name: 'Grant Access (Entitlements)', value: 'access:grant' },
  { name: 'Read Payments', value: 'payments:read' }
];

const showGenerateModal = ref(false);
const isGenerating = ref(false);
const newKeyData = reactive({ label: '' });
const revealedSecret = ref<string | null>(null);
const revealedClientId = ref<string | null>(null);

const sampleCurl = computed(() => {
  return `curl --location 'https://api.graphicnewsplus.com/api/v1/partner-api/onboard-subscriber' \\
--header 'ClientId: ${revealedClientId.value || 'YOUR_CLIENT_ID'}' \\
--header 'ClientSecret: ${revealedSecret.value || 'YOUR_CLIENT_SECRET'}' \\
--header 'Content-Type: application/json' \\
--data '{
    "fullName": "Kwabena Imhotep",
    "phoneNumber": "0244256444"
}'`;
});

const showConfirmModal = ref(false);
const keyToRevoke = ref<CommercialPartnerApiKey | null>(null);
const isRevoking = ref(false);

const goBack = () => {
    router.push('/admin/partners');
};

const formatDate = (date: string) => {
    return dayjs(date).format('MMM D, YYYY h:mm A');
};

const toggleKeyDetails = (id: string) => {
    if (expandedKeyIds.value.has(id)) {
        expandedKeyIds.value.delete(id);
    } else {
        expandedKeyIds.value.add(id);
    }
};

const fetchPartnerData = async () => {
    isFetchingPartner.value = true;
    try {
        partnerDetails.value = await getCommercialPartnerDetails(partnerId);
    } catch (error) {
        $toast.error('Failed to load partner details');
    } finally {
        isFetchingPartner.value = false;
    }
};

const fetchApiKeysData = async () => {
    isFetchingKeys.value = true;
    try {
        apiKeys.value = await getPartnerApiKeys(partnerId);
        // Initialize reactive objects for each key
        apiKeys.value.forEach(key => {
            if (!(key.id in newScope)) newScope[key.id] = '';
            if (!(key.id in newIp)) newIp[key.id] = '';
        });
    } catch (error) {
        $toast.error('Failed to load API keys');
    } finally {
        isFetchingKeys.value = false;
    }
};

const openGenerateModal = () => {
    newKeyData.label = '';
    showGenerateModal.value = true;
};

const closeGenerateModal = () => {
    showGenerateModal.value = false;
};

const handleGenerateKey = async () => {
    isGenerating.value = true;
    try {
        const result = await generatePartnerApiKey({
            partnerId,
            partnerName: partnerDetails.value?.name,
            label: newKeyData.label,
            scopes: ['subscribers:read'],
            allowedIps: []
        });
        $toast.success('API key generated');
        revealedSecret.value = result.clientSecret || null;
        revealedClientId.value = result.clientId || null;
        closeGenerateModal();
        await fetchApiKeysData();
    } catch (error) {
        $toast.error('Failed to generate API key');
    } finally {
        isGenerating.value = false;
    }
};

const confirmRevoke = (key: CommercialPartnerApiKey) => {
    keyToRevoke.value = key;
    showConfirmModal.value = true;
};

const handleRevokeKey = async () => {
    if (!keyToRevoke.value) return;
    isRevoking.value = true;
    try {
        const success = await revokePartnerApiKey(keyToRevoke.value.id);
        if (success) {
            $toast.success('Key revoked successfully');
            await fetchApiKeysData();
            showConfirmModal.value = false;
        }
    } catch (error) {
        $toast.error('Failed to revoke key');
    } finally {
        isRevoking.value = false;
        keyToRevoke.value = null;
    }
};

const addScope = (key: CommercialPartnerApiKey) => {
    const scope = newScope[key.id].trim();
    if (!scope) return;
    if (key.scopes.includes(scope)) {
        $toast.error('Scope already exists');
        return;
    }
    key.scopes.push(scope);
    newScope[key.id] = '';
};

const removeScope = (key: CommercialPartnerApiKey, scope: string) => {
    key.scopes = key.scopes.filter(s => s !== scope);
};

const addIp = (key: CommercialPartnerApiKey) => {
    const ip = newIp[key.id].trim();
    if (!ip) return;
    // Basic IP validation regex
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip)) {
        $toast.error('Invalid IP address format');
        return;
    }
    if (key.allowedIps.includes(ip)) {
        $toast.error('IP already allowed');
        return;
    }
    key.allowedIps.push(ip);
    newIp[key.id] = '';
};

const removeIp = (key: CommercialPartnerApiKey, ip: string) => {
    key.allowedIps = key.allowedIps.filter(i => i !== ip);
};

const saveKeyChanges = async (key: CommercialPartnerApiKey) => {
    isUpdatingKey.value = key.id;
    try {
        const success = await updatePartnerApiKey({
            id: key.id,
            scopes: key.scopes,
            allowedIps: key.allowedIps
        });
        if (success) {
            $toast.success('Key updated successfully');
        }
    } catch (error) {
        $toast.error('Failed to update key');
    } finally {
        isUpdatingKey.value = null;
    }
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    $toast.success('Copied to clipboard');
};

onMounted(async () => {
    await Promise.all([
        fetchPartnerData(),
        fetchApiKeysData()
    ]);
});

useHead({
  title: computed(() => `API Keys | ${partnerDetails.value?.name || 'Loading...'}`)
});
</script>
