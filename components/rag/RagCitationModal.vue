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
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
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
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-100">
              <!-- Top Banner with Publication Badge -->
              <div class="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-600 px-6 py-4 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <DocumentTextIcon class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-semibold uppercase tracking-wider text-primary-200">
                        Citation [{{ citation?.index || 1 }}] • {{ citation?.publication || 'Graphic Archives' }}
                      </span>
                      <span class="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                        {{ citation?.relevanceScore || 95 }}% Match
                      </span>
                    </div>
                    <DialogTitle as="h3" class="text-base font-bold text-white leading-tight mt-0.5">
                      {{ citation?.title || 'Archival Reference' }}
                    </DialogTitle>
                  </div>
                </div>

                <button
                  type="button"
                  @click="closeModal"
                  class="rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Content Body -->
              <div class="p-6 space-y-5">
                <!-- Metadata Bar -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <p class="text-gray-500 font-medium">Published Date</p>
                    <p class="font-semibold text-gray-900 mt-0.5">{{ citation?.date || 'Historical Archive' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 font-medium">Author / Byline</p>
                    <p class="font-semibold text-gray-900 mt-0.5">{{ citation?.author || 'Editorial Staff' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 font-medium">Archive Category</p>
                    <p class="font-semibold text-primary-700 mt-0.5">{{ citation?.category || 'National News' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 font-medium">Page Location</p>
                    <p class="font-semibold text-gray-900 mt-0.5">Page {{ citation?.page || 1 }}</p>
                  </div>
                </div>

                <!-- Grounding Excerpt -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                      <BookmarkIcon class="w-3.5 h-3.5 text-primary-600" />
                      Verified Archival Excerpt (Ground Truth)
                    </label>
                    <span class="text-[11px] text-gray-600 font-medium">RAG Document Chunk</span>
                  </div>
                  <div class="p-4 bg-primary-50/60 border border-primary-200/80 rounded-xl text-gray-800 text-sm leading-relaxed font-serif shadow-inner">
                    "{{ citation?.excerpt }}"
                  </div>
                </div>

                <!-- Information Notice -->
                <div class="flex items-start gap-3 p-3 bg-primary-50/80 border border-primary-200 rounded-xl text-xs text-primary-900">
                  <InformationCircleIcon class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                  <p>
                    This snippet was dynamically retrieved and ranked using semantic hybrid scoring from Graphic Communications Group's official verified archive.
                  </p>
                </div>
              </div>

              <!-- Modal Footer Actions -->
              <div class="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  @click="copyExcerpt"
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <DocumentDuplicateIcon class="w-4 h-4 text-gray-500" />
                  <span>{{ copied ? 'Copied to Clipboard!' : 'Copy Excerpt' }}</span>
                </button>

                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                >
                  Done
                </button>
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
  DocumentTextIcon, 
  DocumentDuplicateIcon, 
  InformationCircleIcon, 
  BookmarkIcon 
} from '@heroicons/vue/24/outline';
import type { Citation } from '~/models/rag';

const props = defineProps<{
  isOpen: boolean;
  citation: Citation | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const copied = ref(false);

const closeModal = () => {
  emit('close');
};

const copyExcerpt = () => {
  if (props.citation?.excerpt) {
    navigator.clipboard.writeText(`"${props.citation.excerpt}" - ${props.citation.publication} (${props.citation.date})`);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>
