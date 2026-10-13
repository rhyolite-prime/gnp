<template>
  <div class="flex flex-col h-full bg-white relative overflow-hidden">
    <!-- Top Action Bar -->
    <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 z-20">
      <!-- Left: Mobile Sidebar Trigger & Mode Switcher -->
      <div class="flex items-center gap-3">
        <button
          v-if="showSidebarToggle"
          type="button"
          @click="$emit('toggle-sidebar')"
          class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>

        <RagModeToggle v-model="activeMode" @update:modelValue="setMode" />
      </div>

      <!-- Right Action Tools: Knowledge Base, Notebook, PDF Export -->
      <div class="flex items-center gap-2">
        <!-- Knowledge Base Manager Trigger -->
        <button
          type="button"
          @click="isKnowledgeManagerOpen = true"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-2xs"
          title="Manage RAG Knowledge Base"
        >
          <CircleStackIcon class="w-4 h-4 text-primary-600" />
          <span>Knowledge Corpus ({{ activeSourcesCount }})</span>
        </button>

        <!-- Research Notebook Trigger with Badge -->
        <button
          type="button"
          @click="isNotebookOpen = true"
          class="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-900 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors shadow-2xs"
          title="Open Research Notebook"
        >
          <BookmarkSquareIcon class="w-4 h-4 text-primary-600" />
          <span class="hidden md:inline">Notebook</span>
          <span
            v-if="savedFindings.length > 0"
            class="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center -ml-0.5"
          >
            {{ savedFindings.length }}
          </span>
        </button>

        <!-- PDF Export Button -->
        <button
          type="button"
          @click="isPdfModalOpen = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <ArrowDownTrayIcon class="w-4 h-4" />
          <span>Export PDF</span>
        </button>

        <!-- Drawer Close Button if in widget modal -->
        <button
          v-if="isWidgetMode"
          type="button"
          @click="$emit('close-widget')"
          class="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg ml-1"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Chat Messages Scroll Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto divide-y divide-gray-100/60 pb-4"
    >
      <!-- Message List -->
      <RagMessageItem
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
        @open-citation="handleOpenCitation"
      />

      <!-- Prompt Suggestions Chips (Show if only welcome message) -->
      <div v-if="messages.length <= 1" class="max-w-4xl mx-auto px-6 py-8 space-y-4">
        <div class="text-center space-y-1">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-2 shadow-xs">
            <SparklesIcon class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-gray-900">
            {{ activeMode === 'qa' ? 'Fast Archival Q/A Grounding' : 'Deep Research & Archival Dossier Engine' }}
          </h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto">
            {{ activeMode === 'qa'
              ? 'Ask any factual question to get verified, grounded responses from Graphic NewsPlus archives.'
              : 'Conduct comprehensive multi-step investigations, extract findings to your notebook, and export as PDF.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            v-for="(prompt, idx) in suggestedPrompts"
            :key="idx"
            type="button"
            @click="submitPrompt(prompt)"
            class="p-3.5 bg-gray-50 hover:bg-primary-50/60 border border-gray-200 hover:border-primary-300 rounded-xl text-left text-xs font-medium text-gray-700 hover:text-primary-900 transition-all flex items-start justify-between gap-2 group shadow-2xs"
          >
            <span>"{{ prompt }}"</span>
            <ArrowRightIcon class="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 shrink-0 mt-0.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Input Container -->
    <footer class="bg-white border-t border-gray-200 p-4 sm:p-5">
      <div class="max-w-4xl mx-auto space-y-2">
        <form @submit.prevent="handleSubmit" class="relative">
          <!-- Text Input Area -->
          <div class="relative bg-gray-50 border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 rounded-2xl transition-all shadow-inner">
            <textarea
              ref="inputTextarea"
              v-model="inputQuery"
              @keydown="handleKeydown"
              rows="2"
              :placeholder="activeMode === 'qa' ? 'Ask a question grounded in Graphic archives...' : 'Describe research inquiry for deep multi-step synthesis...'"
              class="w-full bg-transparent px-4 pt-3 pb-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
            ></textarea>

            <!-- Bottom Toolbar inside input -->
            <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
              <!-- Left: Mode Pill & Custom Ingest Shortcut -->
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1',
                    activeMode === 'qa' ? 'bg-primary-100 text-primary-800' : 'bg-primary-100 text-primary-800'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>{{ activeMode === 'qa' ? 'Q/A Mode' : 'Research Mode' }}</span>
                </span>

                <button
                  type="button"
                  @click="isKnowledgeManagerOpen = true"
                  class="text-gray-400 hover:text-primary-600 text-xs p-1 rounded transition-colors hidden sm:flex items-center gap-1"
                  title="Upload / Ingest Document"
                >
                  <PaperClipIcon class="w-3.5 h-3.5" />
                  <span class="text-[11px]">Attach Context</span>
                </button>
              </div>

              <!-- Right: Voice & Submit Button -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="toggleVoiceInput"
                  :class="[
                    'p-2 rounded-xl transition-colors',
                    isListening ? 'bg-primary-600 text-white animate-pulse' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200/60'
                  ]"
                  :title="isListening ? 'Listening...' : 'Voice Input'"
                >
                  <MicrophoneIcon class="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  :disabled="!inputQuery.trim() || isGenerating"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <ArrowPathIcon v-if="isGenerating" class="w-4 h-4 animate-spin" />
                  <PaperAirplaneIcon v-else class="w-4 h-4" />
                  <span>{{ isGenerating ? 'Synthesizing...' : 'Send' }}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <div class="flex items-center justify-between text-[11px] text-gray-600 px-2">
          <span>Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line</span>
          <span>Graphic NewsPlus Grounded RAG Engine</span>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <RagCitationModal
      :is-open="isCitationModalOpen"
      :citation="activeCitation"
      @close="isCitationModalOpen = false"
    />

    <RagKnowledgeManager
      :is-open="isKnowledgeManagerOpen"
      @close="isKnowledgeManagerOpen = false"
    />

    <RagFindingsNotebook
      :is-open="isNotebookOpen"
      @close="isNotebookOpen = false"
      @open-pdf-modal="isPdfModalOpen = true"
    />

    <RagPdfExportModal
      :is-open="isPdfModalOpen"
      @close="isPdfModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  Bars3Icon, 
  CircleStackIcon, 
  BookmarkSquareIcon, 
  ArrowDownTrayIcon, 
  XMarkIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  PaperClipIcon, 
  MicrophoneIcon, 
  PaperAirplaneIcon, 
  ArrowPathIcon 
} from '@heroicons/vue/24/outline';
import type { Citation } from '~/models/rag';

const props = withDefaults(
  defineProps<{
    showSidebarToggle?: boolean;
    isWidgetMode?: boolean;
  }>(),
  {
    showSidebarToggle: false,
    isWidgetMode: false
  }
);

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
  (e: 'close-widget'): void;
}>();

const { 
  activeMode, 
  messages, 
  savedFindings, 
  isGenerating, 
  isNotebookOpen, 
  isKnowledgeManagerOpen, 
  isPdfModalOpen, 
  suggestedPrompts, 
  initChat, 
  setMode, 
  sendMessage 
} = useRagChat();

const { sources } = useRagEngine();

const inputQuery = ref('');
const inputTextarea = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLDivElement | null>(null);

const isCitationModalOpen = ref(false);
const activeCitation = ref<Citation | null>(null);
const isListening = ref(false);

const activeSourcesCount = computed(() => {
  return sources.value.filter(s => s.enabled).length;
});

onMounted(() => {
  initChat();
  scrollToBottom();
});

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  () => messages.value.length,
  () => scrollToBottom()
);

watch(
  () => messages.value[messages.value.length - 1]?.content,
  () => scrollToBottom()
);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

const handleSubmit = async () => {
  if (!inputQuery.value.trim() || isGenerating.value) return;
  const q = inputQuery.value;
  inputQuery.value = '';
  await sendMessage(q);
};

const submitPrompt = async (prompt: string) => {
  if (isGenerating.value) return;
  await sendMessage(prompt);
};

const handleOpenCitation = (citation: Citation) => {
  activeCitation.value = citation;
  isCitationModalOpen.value = true;
};

// Voice input support using Web Speech Recognition
const toggleVoiceInput = () => {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice speech recognition is not supported in this browser.');
    return;
  }

  if (isListening.value) {
    isListening.value = false;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    inputQuery.value = inputQuery.value ? `${inputQuery.value} ${transcript}` : transcript;
    isListening.value = false;
  };

  recognition.onerror = () => {
    isListening.value = false;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  recognition.start();
};
</script>
