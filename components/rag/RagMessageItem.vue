<template>
  <div
    :class="[
      'py-6 px-4 sm:px-6 transition-colors',
      message.role === 'user' ? 'bg-transparent' : 'bg-gray-50/80 border-y border-gray-200/70'
    ]"
  >
    <div class="max-w-4xl mx-auto flex items-start gap-4">
      <!-- Avatar -->
      <div
        :class="[
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs',
          message.role === 'user'
            ? 'bg-gray-900 text-white'
            : message.mode === 'research'
              ? 'bg-primary-600 text-white'
              : 'bg-primary-600 text-white'
        ]"
      >
        <span v-if="message.role === 'user'">You</span>
        <SparklesIcon v-else class="w-5 h-5" />
      </div>

      <!-- Message Content Container -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- Header Info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-900">
              {{ message.role === 'user' ? 'You' : 'Graphic NewsPlus AI' }}
            </span>
            <span
              v-if="message.role === 'assistant'"
              :class="[
                'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                message.mode === 'research' ? 'bg-primary-100 text-primary-800' : 'bg-primary-100 text-primary-800'
              ]"
            >
              {{ message.mode === 'research' ? '🔬 Research Synthesis' : '⚡ Q/A Grounding' }}
            </span>
            <span class="text-[10px] text-gray-400">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>

          <!-- Actions (Copy / Audio Read Aloud) -->
          <div v-if="message.role === 'assistant' && message.status !== 'thinking'" class="flex items-center gap-1 text-gray-400">
            <button
              type="button"
              @click="toggleAudio"
              class="p-1.5 hover:text-primary-600 hover:bg-gray-200/60 rounded-lg transition-colors"
              :title="isPlayingAudio ? 'Stop audio' : 'Read aloud'"
            >
              <SpeakerWaveIcon v-if="isPlayingAudio" class="w-4 h-4 text-primary-600 animate-pulse" />
              <SpeakerXMarkIcon v-else class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="copyContent"
              class="p-1.5 hover:text-primary-600 hover:bg-gray-200/60 rounded-lg transition-colors"
              :title="isCopied ? 'Copied!' : 'Copy to clipboard'"
            >
              <CheckIcon v-if="isCopied" class="w-4 h-4 text-emerald-600" />
              <DocumentDuplicateIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Thinking State & Chain-of-Thought Steps -->
        <div
          v-if="message.role === 'assistant' && message.thoughtProcess && message.thoughtProcess.length > 0"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs"
        >
          <!-- Accordion Header -->
          <button
            type="button"
            @click="isThoughtsExpanded = !isThoughtsExpanded"
            class="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100/80 flex items-center justify-between text-xs text-gray-700 font-semibold transition-colors"
          >
            <div class="flex items-center gap-2">
              <CpuChipIcon class="w-4 h-4 text-primary-600" />
              <span>Multi-Step Archival Reasoning & Retrieval</span>
              <span
                v-if="isAnyStepInProgress"
                class="inline-flex items-center gap-1 text-[10px] text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full font-medium"
              >
                <ArrowPathIcon class="w-3 h-3 animate-spin" />
                <span>Processing</span>
              </span>
              <span
                v-else
                class="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium"
              >
                {{ message.thoughtProcess.length }} Steps Verified
              </span>
            </div>

            <ChevronDownIcon
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isThoughtsExpanded ? 'rotate-180' : '']"
            />
          </button>

          <!-- Thought Steps List -->
          <div v-show="isThoughtsExpanded" class="p-4 space-y-3 border-t border-gray-100 text-xs">
            <div
              v-for="step in message.thoughtProcess"
              :key="step.id"
              class="flex items-start gap-3"
            >
              <!-- Step Status Icon -->
              <div class="mt-0.5">
                <CheckCircleIcon v-if="step.status === 'completed'" class="w-4 h-4 text-emerald-600" />
                <ArrowPathIcon v-else-if="step.status === 'in_progress'" class="w-4 h-4 text-primary-600 animate-spin" />
                <div v-else class="w-3.5 h-3.5 rounded-full border-2 border-gray-300 ml-0.5"></div>
              </div>

              <!-- Step Info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900">{{ step.title }}</p>
                <p class="text-gray-600 mt-0.5">{{ step.description }}</p>
                <div v-if="step.sourcesConsulted && step.sourcesConsulted.length > 0" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="src in step.sourcesConsulted"
                    :key="src"
                    class="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded"
                  >
                    📄 {{ src }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rendered Text Content -->
        <div
          v-if="message.content"
          class="prose prose-sm max-w-none text-gray-800 leading-relaxed font-sans"
          v-html="renderedMarkdown"
          @click="handleContentClick"
        ></div>

        <!-- Live Streaming Typing Indicator -->
        <div v-if="message.status === 'streaming'" class="flex items-center gap-1.5 text-xs text-primary-600 font-medium animate-pulse">
          <span class="w-2 h-2 rounded-full bg-primary-600"></span>
          <span>Synthesizing verified archival grounding...</span>
        </div>

        <!-- Extracted Key Findings Cards (Research Mode) -->
        <div
          v-if="message.findings && message.findings.length > 0"
          class="mt-6 pt-5 border-t border-gray-200/80 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <BookmarkSquareIcon class="w-4 h-4 text-primary-600" />
              Extracted Research Takeaways
            </h4>
            <span class="text-[11px] text-gray-500 font-medium">Click to bookmark into your notebook</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="finding in message.findings"
              :key="finding.id"
              class="p-3.5 bg-white rounded-xl border border-gray-200 hover:border-primary-400/80 shadow-xs hover:shadow-sm transition-all space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {{ finding.category }}
                </span>
                <span class="text-[10px] font-semibold text-gray-500">
                  {{ finding.confidenceScore }}% Confidence
                </span>
              </div>

              <h5 class="text-xs font-bold text-gray-900 leading-snug">{{ finding.title }}</h5>
              <p class="text-[11px] text-gray-600 line-clamp-2 font-serif">"{{ finding.keyTakeaway }}"</p>

              <!-- Save to Notebook Button -->
              <div class="pt-1 flex items-center justify-between border-t border-gray-100">
                <span class="text-[10px] text-gray-600">
                  {{ finding.sources[0]?.publication || 'Graphic Archives' }}
                </span>

                <button
                  type="button"
                  @click="handleSaveFinding(finding)"
                  :class="[
                    'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs',
                    isFindingSaved(finding.title)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  ]"
                >
                  <CheckIcon v-if="isFindingSaved(finding.title)" class="w-3.5 h-3.5" />
                  <PlusIcon v-else class="w-3.5 h-3.5" />
                  <span>{{ isFindingSaved(finding.title) ? 'Saved' : 'Save to Notebook' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Archival Citations Pill Bar -->
        <div
          v-if="message.citations && message.citations.length > 0"
          class="mt-4 pt-4 border-t border-gray-200/60 flex items-center flex-wrap gap-2 text-xs"
        >
          <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <DocumentTextIcon class="w-3.5 h-3.5 text-gray-400" />
            Verified Citations:
          </span>

          <button
            v-for="cit in message.citations"
            :key="cit.id"
            type="button"
            @click="$emit('open-citation', cit)"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-colors shadow-2xs font-medium text-[11px]"
          >
            <span class="w-4 h-4 rounded-full bg-primary-100 text-primary-700 font-bold text-[10px] flex items-center justify-center">
              {{ cit.index }}
            </span>
            <span class="truncate max-w-[140px]">{{ cit.title }}</span>
            <span class="text-gray-600">({{ cit.publication }})</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  SparklesIcon, 
  CpuChipIcon, 
  ChevronDownIcon, 
  CheckCircleIcon, 
  ArrowPathIcon, 
  DocumentDuplicateIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon, 
  CheckIcon, 
  BookmarkSquareIcon, 
  DocumentTextIcon, 
  PlusIcon 
} from '@heroicons/vue/24/outline';
import type { ChatMessage, Citation, ResearchFinding } from '~/models/rag';

const props = defineProps<{
  message: ChatMessage;
}>();

const emit = defineEmits<{
  (e: 'open-citation', citation: Citation): void;
}>();

const { savedFindings, saveFindingToNotebook } = useRagChat();

const isThoughtsExpanded = ref(true);
const isCopied = ref(false);
const isPlayingAudio = ref(false);

const isAnyStepInProgress = computed(() => {
  return props.message.thoughtProcess?.some(s => s.status === 'in_progress');
});

const isFindingSaved = (title: string) => {
  return savedFindings.value.some(f => f.title === title);
};

const handleSaveFinding = (finding: ResearchFinding) => {
  saveFindingToNotebook(finding);
};

// Markdown to HTML conversion with rich table, bold, header, and citation link formatting
const renderedMarkdown = computed(() => {
  if (!props.message.content) return '';

  let html = props.message.content;

  // Escape HTML tags to prevent XSS
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim() !== '');
    if (match.includes('---')) {
      return '';
    }
    const isHeader = false;
    const tag = isHeader ? 'th' : 'td';
    return `<div class="overflow-x-auto my-3"><table class="w-full text-xs text-left border-collapse border border-gray-200 rounded-lg"><tr class="border-b bg-gray-50">${cells.map(c => `<${tag} class="p-2.5 border-r border-gray-200">${c.trim()}</${tag}>`).join('')}</tr></table></div>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-gray-900 mt-4 mb-1.5">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-primary-700 mt-5 mb-2 border-b pb-1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-black text-gray-900 mt-2 mb-3">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Inline Citations e.g. [[1]](#citation-1)
  html = html.replace(/\[\[(\d+)\]\]\(#citation-\d+\)/g, (match, p1) => {
    return `<button type="button" data-citation-index="${p1}" class="citation-tag inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold text-[10px] border border-primary-200 transition-colors cursor-pointer" title="View Source Citation [${p1}]">[${p1}]</button>`;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-3 py-1 my-2 bg-primary-50/50 rounded-r text-gray-700 italic text-xs">$1</blockquote>');

  // Bullet points
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-700 my-1">$1</li>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');

  return html;
});

const handleContentClick = (e: MouseEvent) => {
  const target = (e.target as HTMLElement).closest('.citation-tag');
  if (target) {
    const indexStr = target.getAttribute('data-citation-index');
    if (indexStr && props.message.citations) {
      const idx = parseInt(indexStr, 10);
      const matched = props.message.citations.find(c => c.index === idx);
      if (matched) {
        emit('open-citation', matched);
      }
    }
  }
};

const copyContent = () => {
  if (props.message.content) {
    navigator.clipboard.writeText(props.message.content);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
};

const toggleAudio = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  if (isPlayingAudio.value) {
    window.speechSynthesis.cancel();
    isPlayingAudio.value = false;
  } else {
    // Strip markdown formatting for speech
    const cleanText = props.message.content
      .replace(/#+\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[\d+\]\(#citation-\d+\)/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/>\s/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      isPlayingAudio.value = false;
    };
    utterance.onerror = () => {
      isPlayingAudio.value = false;
    };

    isPlayingAudio.value = true;
    window.speechSynthesis.speak(utterance);
  }
};

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

onUnmounted(() => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});
</script>
