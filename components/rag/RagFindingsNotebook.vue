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

      <div class="fixed inset-0 z-10 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
                <!-- Header -->
                <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white border-b border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center text-primary-400">
                        <BookmarkSquareIcon class="w-6 h-6" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-lg font-bold text-white">
                          Research Notebook
                        </DialogTitle>
                        <p class="text-xs text-gray-400">
                          {{ savedFindings.length }} bookmarked takeaways & analyst annotations
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="closeModal"
                      class="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>

                  <!-- Quick Stats & PDF Export Action Strip -->
                  <div class="mt-5 p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between">
                    <div>
                      <span class="text-xs text-primary-200 font-semibold block">Dossier Export Ready</span>
                      <span class="text-[11px] text-gray-300">Convert notes into certified executive PDF</span>
                    </div>

                    <button
                      type="button"
                      @click="openPdfExport"
                      class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 transform hover:scale-105"
                    >
                      <ArrowDownTrayIcon class="w-4 h-4" />
                      <span>Export as PDF</span>
                    </button>
                  </div>
                </div>

                <!-- Search & Filters -->
                <div class="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <div class="relative flex-1">
                    <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search saved findings..."
                      class="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                    />
                  </div>

                  <select
                    v-model="selectedCategory"
                    class="py-2 px-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-gray-700 font-medium"
                  >
                    <option value="">All Categories</option>
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>

                <!-- Findings List -->
                <div class="flex-1 overflow-y-auto p-6 space-y-4">
                  <!-- Empty State -->
                  <div v-if="filteredFindings.length === 0" class="text-center py-16 px-4">
                    <div class="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3 border border-primary-200">
                      <BookmarkIcon class="w-7 h-7" />
                    </div>
                    <h4 class="text-sm font-bold text-gray-900">No Research Findings Saved</h4>
                    <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                      In Research Mode, click the <strong>"Save to Notebook"</strong> button on any synthesized insight to bookmark it here.
                    </p>
                  </div>

                  <!-- Finding Items -->
                  <div
                    v-for="finding in filteredFindings"
                    :key="finding.id"
                    class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
                  >
                    <!-- Title & Badges -->
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-2">
                        <button
                          type="button"
                          @click="togglePinFinding(finding.id)"
                          :title="finding.isPinned ? 'Unpin' : 'Pin to Top'"
                          class="mt-0.5 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <StarIconSolid v-if="finding.isPinned" class="w-4 h-4 text-primary-500" />
                          <StarIcon v-else class="w-4 h-4" />
                        </button>
                        <div>
                          <h4 class="text-sm font-bold text-gray-900 leading-snug">{{ finding.title }}</h4>
                          <div class="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                            <span class="bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                              {{ finding.category }}
                            </span>
                            <span>• Match: {{ finding.confidenceScore }}%</span>
                            <span>• {{ formatDate(finding.timestamp) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Remove Button -->
                      <button
                        type="button"
                        @click="removeFindingFromNotebook(finding.id)"
                        title="Remove from Notebook"
                        class="text-gray-400 hover:text-primary-600 p-1 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>

                    <!-- Key Takeaway Text -->
                    <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 leading-relaxed font-serif border border-gray-100">
                      "{{ finding.keyTakeaway }}"
                    </div>

                    <!-- Analyst Note Section -->
                    <div class="space-y-1.5 pt-1">
                      <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <PencilSquareIcon class="w-3.5 h-3.5 text-gray-400" />
                        Analyst Personal Annotation
                      </label>
                      <textarea
                        v-model="finding.userNotes"
                        @change="updateFindingNotes(finding.id, finding.userNotes || '')"
                        rows="2"
                        placeholder="Add your research commentary, hypotheses, or cross-checks..."
                        class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none bg-primary-50/30"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Footer Summary Strip -->
                <div class="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
                  <span class="text-xs text-gray-500">
                    Saved in browser LocalStorage • Graphic NewsPlus
                  </span>

                  <button
                    type="button"
                    @click="openPdfExport"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <ArrowDownTrayIcon class="w-4 h-4" />
                    <span>Proceed to PDF Checkout</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { 
  XMarkIcon, 
  BookmarkSquareIcon, 
  BookmarkIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon, 
  TrashIcon, 
  StarIcon, 
  PencilSquareIcon 
} from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open-pdf-modal'): void;
}>();

const { 
  savedFindings, 
  removeFindingFromNotebook, 
  updateFindingNotes, 
  togglePinFinding 
} = useRagChat();

const searchQuery = ref('');
const selectedCategory = ref('');

const uniqueCategories = computed(() => {
  const cats = new Set(savedFindings.value.map(f => f.category));
  return Array.from(cats).filter(Boolean);
});

const filteredFindings = computed(() => {
  return savedFindings.value.filter(f => {
    const matchesSearch = !searchQuery.value || 
      f.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      f.keyTakeaway.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (f.userNotes && f.userNotes.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesCat = !selectedCategory.value || f.category === selectedCategory.value;

    return matchesSearch && matchesCat;
  });
});

const closeModal = () => {
  emit('close');
};

const openPdfExport = () => {
  emit('close');
  emit('open-pdf-modal');
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
};
</script>
