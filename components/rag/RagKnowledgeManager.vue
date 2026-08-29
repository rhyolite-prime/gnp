<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-gray-100">
              <!-- Modal Header -->
              <div class="bg-gray-900 px-6 py-4 text-white flex items-center justify-between border-b border-gray-800">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                    <CircleStackIcon class="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle as="h3" class="text-base font-bold text-white">
                      RAG Knowledge Base & Archival Collections
                    </DialogTitle>
                    <p class="text-xs text-gray-400">
                      Manage active ground-truth corpora and ingest custom research dossiers.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="closeModal"
                  class="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Tabs: Collections vs Custom Ingestion -->
              <div class="flex border-b border-gray-200 bg-gray-50 px-6">
                <button
                  type="button"
                  @click="activeTab = 'collections'"
                  :class="[
                    'py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors',
                    activeTab === 'collections'
                      ? 'border-primary-600 text-primary-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <BookOpenIcon class="w-4 h-4" />
                  <span>Archival Collections ({{ sources.length }})</span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'upload'"
                  :class="[
                    'py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors',
                    activeTab === 'upload'
                      ? 'border-primary-600 text-primary-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <DocumentArrowUpIcon class="w-4 h-4" />
                  <span>Ingest Custom Dossier</span>
                  <span class="bg-primary-100 text-primary-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">New</span>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-6 max-h-[60vh] overflow-y-auto">
                <!-- TAB 1: ARCHIVAL COLLECTIONS -->
                <div v-if="activeTab === 'collections'" class="space-y-4">
                  <!-- Stats Strip -->
                  <div class="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <div>
                      <p class="text-[11px] text-gray-500 font-medium">Total Indexed Documents</p>
                      <p class="text-lg font-bold text-gray-900">{{ totalDocuments.toLocaleString() }}+</p>
                    </div>
                    <div>
                      <p class="text-[11px] text-gray-500 font-medium">Vector Knowledge Chunks</p>
                      <p class="text-lg font-bold text-primary-600">{{ totalChunks.toLocaleString() }}+</p>
                    </div>
                    <div>
                      <p class="text-[11px] text-gray-500 font-medium">Active Grounding Corpora</p>
                      <p class="text-lg font-bold text-emerald-600">{{ activeSourcesCount }} / {{ sources.length }}</p>
                    </div>
                  </div>

                  <!-- Source List -->
                  <div class="space-y-3">
                    <div
                      v-for="source in sources"
                      :key="source.id"
                      :class="[
                        'p-4 rounded-xl border transition-all flex items-start justify-between gap-4',
                        source.enabled ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50/70 border-gray-200 opacity-60'
                      ]"
                    >
                      <div class="flex items-start gap-3">
                        <div class="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                          <DocumentTextIcon class="w-5 h-5" />
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <h4 class="text-sm font-bold text-gray-900">{{ source.name }}</h4>
                            <span v-if="source.badge" class="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                              {{ source.badge }}
                            </span>
                          </div>
                          <p class="text-xs text-gray-600 mt-1 leading-relaxed">{{ source.description }}</p>
                          <div class="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
                            <span>📚 {{ source.documentCount.toLocaleString() }} Documents</span>
                            <span>🧩 {{ source.chunkCount.toLocaleString() }} Chunks</span>
                            <span>🔄 Updated {{ source.lastUpdated }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Toggle Switch -->
                      <button
                        type="button"
                        @click="toggleSource(source.id)"
                        :class="[
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                          source.enabled ? 'bg-primary-600' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            source.enabled ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TAB 2: INGEST CUSTOM DOSSIER -->
                <div v-else class="space-y-4">
                  <div class="p-3.5 bg-primary-50 border border-primary-200 rounded-xl text-xs text-primary-900 flex items-start gap-2.5">
                    <SparklesIcon class="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <p>
                      Ingest your proprietary market research, policy briefs, or press releases. Content will be automatically tokenized, chunked, and indexed for immediate RAG retrieval in this session.
                    </p>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Dossier / Document Title
                      </label>
                      <input
                        v-model="customTitle"
                        type="text"
                        placeholder="e.g., 2026 West African Agribusiness Investment Brief"
                        class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Category / Subject
                      </label>
                      <select
                        v-model="customCategory"
                        class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                      >
                        <option value="Economy & Trade">Economy & Trade</option>
                        <option value="Policy & Governance">Policy & Governance</option>
                        <option value="Energy & Infrastructure">Energy & Infrastructure</option>
                        <option value="Technology & Telecoms">Technology & Telecoms</option>
                        <option value="Legal & Regulatory">Legal & Regulatory</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Document Body / Pasted Text
                      </label>
                      <textarea
                        v-model="customContent"
                        rows="6"
                        placeholder="Paste article, report excerpt, or transcription text here..."
                        class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      ></textarea>
                    </div>

                    <div v-if="ingestionMessage" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircleIcon class="w-4 h-4 text-emerald-600" />
                      <span>{{ ingestionMessage }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between">
                <p class="text-xs text-gray-500">
                  Graphic Communications Group • Real-Time RAG Index
                </p>

                <div class="flex items-center gap-3">
                  <button
                    v-if="activeTab === 'upload'"
                    type="button"
                    @click="handleIngest"
                    :disabled="!customTitle.trim() || !customContent.trim() || isIngesting"
                    class="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <ArrowPathIcon v-if="isIngesting" class="w-3.5 h-3.5 animate-spin" />
                    <span>{{ isIngesting ? 'Indexing Chunks...' : 'Ingest & Index Dossier' }}</span>
                  </button>

                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { 
  XMarkIcon, 
  CircleStackIcon, 
  BookOpenIcon, 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  ArrowPathIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { sources, toggleSource, ingestCustomDocument } = useRagEngine();

const activeTab = ref<'collections' | 'upload'>('collections');
const customTitle = ref('');
const customCategory = ref('Economy & Trade');
const customContent = ref('');
const isIngesting = ref(false);
const ingestionMessage = ref('');

const totalDocuments = computed(() => {
  return sources.value.reduce((sum, s) => sum + s.documentCount, 0);
});

const totalChunks = computed(() => {
  return sources.value.reduce((sum, s) => sum + s.chunkCount, 0);
});

const activeSourcesCount = computed(() => {
  return sources.value.filter(s => s.enabled).length;
});

const closeModal = () => {
  emit('close');
};

const handleIngest = async () => {
  if (!customTitle.value.trim() || !customContent.value.trim()) return;

  isIngesting.value = true;
  ingestionMessage.value = '';

  await new Promise(resolve => setTimeout(resolve, 600));

  const chunkCount = ingestCustomDocument(
    customTitle.value.trim(),
    customContent.value.trim(),
    customCategory.value
  );

  isIngesting.value = false;
  ingestionMessage.value = `Successfully indexed "${customTitle.value}" into ${chunkCount} vector RAG chunks!`;

  setTimeout(() => {
    customTitle.value = '';
    customContent.value = '';
    ingestionMessage.value = '';
    activeTab.value = 'collections';
  }, 1800);
};
</script>
