<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">API Settings</h2>
        <p class="text-sm text-slate-500 mt-1">Manage API access, generate keys, and configure IP restrictions.</p>
      </div>
      <div>
        <button
          @click="openGenerateModal"
          class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <KeyIcon class="w-4 h-4 mr-2" />
          Generate New Key
        </button>
      </div>
    </div>

    <!-- API Keys List -->
    <div class="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
      <div v-if="isFetchingKeys" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      <div v-else-if="apiKeys.length === 0" class="text-center py-16 px-4">
        <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <KeyIcon class="h-8 w-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">No API keys created yet</h3>
        <p class="mt-2 text-sm text-slate-500 max-w-sm mx-auto">Get started by generating your first API key to integrate with Graphic NewsPlus.</p>
        <div class="mt-6">
          <button @click="openGenerateModal" class="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition-all">
            Generate First Key
          </button>
        </div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Label</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client ID</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Scopes</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Allowed IPs</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Used</th>
              <th scope="col" class="relative py-4 pl-3 pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-for="key in apiKeys" :key="key.id">
              <tr class="hover:bg-slate-50 transition-colors cursor-pointer group" @click="toggleKeyDetails(key.id)">
                <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                  <div class="flex items-center">
                     <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-colors">
                       <ChevronRightIcon :class="['h-4 w-4 text-slate-500 transition-transform duration-200', expandedKeyIds.has(key.id) ? 'rotate-90' : '']" />
                     </div>
                    {{ key.label }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-mono text-xs">
                  <div class="flex items-center gap-2">
                    <span class="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{{ key.clientId }}</span>
                    <button @click.stop="copyToClipboard(key.clientId)" class="text-slate-400 hover:text-primary-600 transition-colors p-1 hover:bg-primary-50 rounded-md">
                      <ClipboardIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="scope in key.scopes" :key="scope" class="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                      {{ scope }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                  <span v-if="!key.allowedIps?.length" class="text-slate-400 italic text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">No restrictions</span>
                  <div v-else class="flex flex-wrap gap-1.5">
                    <span v-for="ip in key.allowedIps" :key="ip" class="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                      {{ ip }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4">
                 <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border', 
                   key.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200']">
                   {{ key.isActive ? "Active" : "Inactive" }}
                 </span>
               </td>

                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-medium">
                  {{ key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never' }}
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <button v-if="key.isActive" @click.stop="confirmRevoke(key)" class="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Revoke</button>
                  <button v-else @click.stop="confirmActivation(key)" class="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Activate</button>
                  <button @click.stop="confirmDelete(key)" class="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                </td>

                
              </tr>
              <!-- Expanded details -->
              <tr v-if="expandedKeyIds.has(key.id)">
                <td colspan="6" class="px-8 py-6 bg-slate-50 border-t border-slate-100">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Scope Management -->
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                      <h4 class="text-sm font-bold text-slate-900 mb-4 flex items-center"><ShieldCheckIcon class="w-5 h-5 mr-2 text-primary-500"/> Scopes</h4>
                      <div class="flex gap-2 mb-4">
                        <select 
                          v-model="newScope[key.id]" 
                          class="block w-full rounded-xl border-slate-200 py-2 text-slate-900 focus:ring-2 focus:ring-primary-500 sm:text-sm bg-slate-50"
                        >
                          <option value="">Select a scope...</option>
                          <option v-for="scope in availableScopes" :key="scope.value" :value="scope.value">
                            {{ scope.name }} ({{ scope.value }})
                          </option>
                        </select>
                        <button @click="addScope(key)" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors">Add</button>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="scope in key.scopes" :key="scope" class="inline-flex items-center gap-x-1 rounded-lg bg-blue-50 pl-2.5 pr-1 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                          {{ scope }}
                          <button @click="removeScope(key, scope)" type="button" class="group relative h-5 w-5 rounded-md hover:bg-blue-200 flex items-center justify-center transition-colors ml-1">
                            <span class="sr-only">Remove</span>
                            <XMarkIcon class="h-3.5 w-3.5 text-blue-600" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <!-- IP Management -->
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                      <h4 class="text-sm font-bold text-slate-900 mb-4 flex items-center"><GlobeAltIcon class="w-5 h-5 mr-2 text-primary-500"/> Allowed IP Addresses</h4>
                      <div class="flex gap-2 mb-4">
                        <input 
                          v-model="newIp[key.id]" 
                          @keyup.enter="addIp(key)"
                          type="text" 
                          placeholder="e.g. 192.168.1.1" 
                          class="block w-full rounded-xl border-slate-200 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 sm:text-sm bg-slate-50"
                        />
                        <button @click="addIp(key)" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors">Add</button>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="ip in key.allowedIps" :key="ip" class="inline-flex items-center gap-x-1 rounded-lg bg-slate-100 pl-2.5 pr-1 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                          {{ ip }}
                          <button @click="removeIp(key, ip)" type="button" class="group relative h-5 w-5 rounded-md hover:bg-slate-200 flex items-center justify-center transition-colors ml-1">
                            <span class="sr-only">Remove</span>
                            <XMarkIcon class="h-3.5 w-3.5 text-slate-500" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-end">
                    <button 
                      @click="saveKeyChanges(key)" 
                      :disabled="isUpdatingKey === key.id"
                      class="inline-flex items-center rounded-xl bg-primary-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
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
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
            <div class="px-6 pb-6 pt-8 sm:p-8">
              <div class="flex items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 border border-primary-100">
                  <KeyIcon class="h-7 w-7 text-primary-600" aria-hidden="true" />
                </div>
                <div class="mt-1">
                  <h3 class="text-xl font-bold text-slate-900 tracking-tight" id="modal-title">Generate API Key</h3>
                  <p class="text-sm text-slate-500 mt-1">Create a new key to access Graphic NewsPlus APIs.</p>
                </div>
              </div>
              <div class="mt-8">
                <div class="mb-4">
                  <label class="block text-sm font-bold text-slate-700 mb-2">Key Label</label>
                  <input 
                    v-model="newKeyData.label"
                    type="text" 
                    placeholder="e.g. Production Web App"
                    class="block w-full rounded-xl border-slate-200 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 sm:text-sm bg-slate-50 transition-colors"
                  />
                </div>
              </div>
            </div>
            <div class="bg-slate-50 px-6 py-5 sm:flex sm:flex-row-reverse sm:px-8 border-t border-slate-100">
              <button 
                @click="handleGenerateKey"
                :disabled="isGenerating || !newKeyData.label"
                type="button" 
                class="inline-flex w-full justify-center rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition-colors sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                {{ isGenerating ? 'Generating...' : 'Generate Key' }}
              </button>
              <button @click="closeGenerateModal" type="button" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors sm:mt-0 sm:w-auto">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secret Disclosure Modal -->
    <div v-if="revealedSecret" class="relative z-50">
       <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
       <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
             <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-100 p-8">
               <div class="flex items-start gap-4 mb-6 border-b border-slate-100 pb-6">
                 <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100">
                   <ExclamationTriangleIcon class="h-7 w-7 text-amber-600" aria-hidden="true" />
                 </div>
                 <div class="mt-1 text-left">
                   <h3 class="text-xl font-bold text-slate-900 tracking-tight">API Key Generated Successfully</h3>
                   <p class="mt-1 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 inline-block font-medium">
                     Important: Copy your Client Secret now. It will not be shown again.
                   </p>
                 </div>
               </div>

               <div class="space-y-5">
                   <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client ID</label>
                     <div class="bg-slate-50 p-3.5 rounded-xl flex items-center justify-between gap-4 border border-slate-200 shadow-inner">
                       <code class="text-sm font-mono text-slate-900">{{ revealedClientId }}</code>
                       <button @click="copyToClipboard(revealedClientId || '')" class="text-primary-600 hover:text-primary-700 shrink-0 bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-colors hover:scale-105 pointer">
                         <ClipboardIcon class="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                   <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Secret</label>
                     <div class="bg-slate-50 p-3.5 rounded-xl flex items-center justify-between gap-4 border border-slate-200 shadow-inner">
                       <code class="text-sm font-mono text-slate-900">{{ revealedSecret }}</code>
                       <button @click="copyToClipboard(revealedSecret)" class="text-primary-600 hover:text-primary-700 shrink-0 bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-colors hover:scale-105 pointer">
                         <ClipboardIcon class="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                   <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sample Curl Command</label>
                     <div class="relative mt-1">
                       <pre class="bg-slate-900 text-slate-300 p-5 rounded-2xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner"><code>{{ sampleCurl }}</code></pre>
                       <button 
                         @click="copyToClipboard(sampleCurl)" 
                         class="absolute top-3 right-3 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors hover:scale-105 border border-white/10"
                         title="Copy curl command"
                       >
                         <ClipboardIcon class="h-5 w-5" />
                       </button>
                     </div>
                   </div>
               </div>

               <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                 <button @click="revealedSecret = null; revealedClientId = null" type="button" class="inline-flex justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors w-full sm:w-auto">I've Saved It Safely</button>
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

    <!-- Delete Confirmation Modal -->
    <ConfirmModal 
      :show="showConfirmDeleteModal"
      title="Delete API Key"
      message="Are you sure you want to delete this API key? This will permanently remove all integrations using this key."
      confirm-text="Delete Key"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeleting"
      @confirm="handleDeleteKey"
      @cancel="showConfirmDeleteModal = false"
    />

    <!-- Activation Confirmation Modal -->
    <ConfirmModal
      :show="showConfirmActivationModal"
      title="Activate API Key"
      message="Are you sure you want to activate this API key? This will grant access to your account's resources and allow the key to make API calls immediately."
      confirm-text="Activate Key"
      cancel-text="Cancel"
      type="alert"
      :loading="isActivating"
      @confirm="handleActivateKey"
      @cancel="showConfirmActivationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { 
  KeyIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  ClipboardIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import type { CommercialPartnerApiKey } from "~/models";

 
const { $toast } = useNuxtApp();
const partnerId = 'me'; // Use logical 'me' for current partner

const apiKeys = ref<CommercialPartnerApiKey[]>([]);
const isFetchingKeys = ref(false);

const expandedKeyIds = ref<Set<string>>(new Set());
const newScope = reactive<Record<string, string>>({});
const newIp = reactive<Record<string, string>>({});
const isUpdatingKey = ref<string | null>(null);

const availableScopes = [
  { name: 'Read Content', value: 'content:read' },
  { name: 'Read Subscribers', value: 'subscribers:read' },
  { name: 'Create Subscribers', value: 'subscribers:write' },
  { name: 'Manage Subscribers', value: 'subscribers:manage' },
  { name: 'Check Access', value: 'access:check' },
];

const showGenerateModal = ref(false);
const isGenerating = ref(false);
const newKeyData = reactive({ label: '' });
const revealedSecret = ref<string | null>(null);
const revealedClientId = ref<string | null>(null);

const showConfirmModal = ref(false);
const showConfirmDeleteModal = ref(false);
const showConfirmActivationModal = ref(false);
const isActivating = ref(false);
const keyToRevoke = ref<CommercialPartnerApiKey | null>(null);
const isRevoking = ref(false);
const isDeleting = ref(false);

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

const fetchApiKeysData = async () => {
    isFetchingKeys.value = true;
    try {

      apiKeys.value = await getCommercialPartnerApiKeys();
        // Initialize reactive objects for each key
        apiKeys.value.forEach(key => {
            if (!(key.id in newScope)) newScope[key.id] = '';
            if (!(key.id in newIp)) newIp[key.id] = '';
        });
      
    } catch (error) {
        if($toast) $toast.error('Failed to load API keys');
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

        const result = await generateCommercialPartnerApiKey({
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
        if($toast) $toast.error('Failed to generate API key');
    } finally {
        isGenerating.value = false;
    }
};

const confirmRevoke = (key: CommercialPartnerApiKey) => {
    keyToRevoke.value = key;
    showConfirmModal.value = true;
};

const confirmActivation = (key: CommercialPartnerApiKey) => {
    keyToRevoke.value = key;
    showConfirmActivationModal.value = true;
};
 
const handleRevokeKey = async () => {
    if (!keyToRevoke.value) return;
    isRevoking.value = true;
    try {
        const success = await revokeCommercialPartnerApiKey(keyToRevoke.value.id);
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

const handleActivateKey = async () => {
    if (!keyToRevoke.value) return;
    isActivating.value = true;
    try {
        const success = await activateCommercialPartnerApiKey(keyToRevoke.value.id);
        if (success) {
            $toast.success('Key activated successfully');
            await fetchApiKeysData();
            showConfirmActivationModal.value = false;
        }
    } catch (error) {
        $toast.error('Failed to activate key');
    } finally {
        isActivating.value = false;
        keyToRevoke.value = null;
    }
};



const confirmDelete = (key: CommercialPartnerApiKey) => {
    keyToRevoke.value = key;
    showConfirmDeleteModal.value = true;
};


const handleDeleteKey = async () => {
    if (!keyToRevoke.value) return;
    isDeleting.value = true;
    try {
        const success = await deleteCommercialPartnerApiKey(keyToRevoke.value.id);
        if (success) {
            $toast.success('Key deleted successfully');
            await fetchApiKeysData();
            showConfirmDeleteModal.value = false;
        }
    } catch (error) {
        $toast.error('Failed to delete key');
    } finally {
        isDeleting.value = false;
        keyToRevoke.value = null;
    }
};

const addScope = (key: CommercialPartnerApiKey) => {
    const scope = newScope[key.id].trim();
    if (!scope) return;
    if (key.scopes.includes(scope)) {
        if($toast) $toast.error('Scope already exists');
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
    if (key.allowedIps.includes(ip)) {
        if($toast) $toast.error('IP already allowed');
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
        // MOCK update
        const success = await updateCommercialPartnerApiKey({
            id: key.id,
            scopes: key.scopes,
            allowedIps: key.allowedIps
        });
        if (success) {
            $toast.success('Key updated successfully');
        }
         
    } catch (error) {
        if($toast) $toast.error('Failed to update key');
    } finally {
        isUpdatingKey.value = null;
    }
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if($toast) $toast.success('Copied to clipboard');
};

onMounted(() => {
    fetchApiKeysData();
});
</script>
