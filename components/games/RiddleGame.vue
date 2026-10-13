<template>
  <div class="flex flex-col items-center max-w-3xl mx-auto w-full">
    <!-- Progress & Header -->
    <div class="w-full bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <HelpCircle class="w-5 h-5 text-primary-600" />
          <h2 class="text-base font-bold text-gray-900">
            Question {{ currentIndex + 1 }} of {{ puzzle.items.length }}
          </h2>
          <span
            :class="currentItem?.type === 'anagram' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
            class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
          >
            {{ currentItem?.type === 'anagram' ? 'Anagram' : 'Cloze' }}
          </span>
        </div>

        <div class="text-xs font-semibold text-gray-500">
          {{ answeredCount }} / {{ puzzle.items.length }} Answered
        </div>
      </div>

      <!-- Question Selector Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          v-for="(item, idx) in puzzle.items"
          :key="item.id"
          @click="currentIndex = idx"
          :class="[
            currentIndex === idx
              ? 'bg-primary-600 text-white ring-2 ring-primary-300'
              : isAnswered(item.id)
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          class="w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all shrink-0"
        >
          {{ idx + 1 }}
        </button>
      </div>
    </div>

    <!-- Active Question Card -->
    <div v-if="currentItem" class="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-md mb-6 transition-all">
      <!-- Source Metadata Tag -->
      <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Newspaper class="w-4 h-4 text-primary-600" />
        <span class="font-semibold text-gray-800">{{ currentItem.source?.publicationName || 'Daily Graphic' }}</span>
        <span v-if="currentItem.source?.pageNumber" class="text-gray-400">• Page {{ currentItem.source.pageNumber }}</span>
        <span class="text-gray-400">• Target length: {{ currentItem.length }} letters</span>
      </div>

      <!-- Prompt Text -->
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <p class="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
          {{ currentItem.prompt }}
        </p>
      </div>

      <!-- Revealed Hint Banner (if any for this question) -->
      <div
        v-if="currentHint"
        class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2"
      >
        <Sparkles class="w-4 h-4 text-amber-600" />
        <span>Hint revealed: word begins with <strong>"{{ currentHint.prefix }}"</strong></span>
      </div>

      <!-- Anagram Interactive Tiles (for Anagrams) -->
      <div v-if="currentItem.type === 'anagram' && scrambledLetters.length" class="mb-6">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Available Letters:</div>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="(ch, idx) in scrambledLetters"
            :key="`${ch}-${idx}`"
            class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-mono font-bold text-lg flex items-center justify-center shadow-sm"
          >
            {{ ch }}
          </span>
        </div>
      </div>

      <!-- Multiple Choice Options (if available) -->
      <div v-if="currentItem.choices && currentItem.choices.length" class="space-y-2.5 mb-6">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Select Answer:</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            v-for="choice in currentItem.choices"
            :key="choice"
            @click="selectChoice(choice)"
            :class="[
              getCurrentAnswer(currentItem.id) === choice.toUpperCase()
                ? 'bg-primary-600 text-white border-primary-600 ring-2 ring-primary-300'
                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-300'
            ]"
            class="p-3.5 rounded-xl border text-left font-mono font-bold text-sm sm:text-base transition-all flex items-center justify-between"
          >
            <span>{{ choice }}</span>
            <Check v-if="getCurrentAnswer(currentItem.id) === choice.toUpperCase()" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <!-- Direct Text Input (fallback or hard mode) -->
      <div v-else class="mb-6">
        <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Your Answer ({{ currentItem.length }} letters):
        </label>
        <div class="relative">
          <input
            type="text"
            :value="getCurrentAnswer(currentItem.id)"
            @input="handleInput($event)"
            :maxlength="currentItem.length + 4"
            placeholder="TYPE ANSWER HERE..."
            class="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono font-bold text-lg tracking-widest uppercase focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            v-if="getCurrentAnswer(currentItem.id)"
            @click="clearCurrentAnswer"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          @click="currentIndex = Math.max(0, currentIndex - 1)"
          :disabled="currentIndex === 0"
          class="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <ChevronLeft class="w-4 h-4" /> Previous
        </button>

        <button
          @click="currentIndex = Math.min(puzzle.items.length - 1, currentIndex + 1)"
          :disabled="currentIndex === puzzle.items.length - 1"
          class="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm"
        >
          Next <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RiddlePuzzle, RiddleItem } from '~/models';
import { HelpCircle, Newspaper, Sparkles, Check, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  puzzle: RiddlePuzzle;
  initialAnswers?: Array<{ id: string; value: string }>;
  reveals?: any[];
}>();

const emit = defineEmits<{
  (e: 'update:answers', answers: Array<{ id: string; value: string }>): void;
}>();

const currentIndex = ref(0);
const answersMap = reactive<Record<string, string>>({});

// Initialize answers from prop
if (props.initialAnswers) {
  for (const a of props.initialAnswers) {
    answersMap[a.id] = (a.value || '').toUpperCase();
  }
}

const currentItem = computed<RiddleItem | null>(() => {
  return props.puzzle.items[currentIndex.value] || null;
});

const currentHint = computed(() => {
  if (!props.reveals || !currentItem.value) return null;
  return props.reveals.find(h => h.id === currentItem.value?.id) || null;
});

// Extract scrambled letters for anagram questions
const scrambledLetters = computed<string[]>(() => {
  if (!currentItem.value || currentItem.value.type !== 'anagram') return [];
  const match = currentItem.value.prompt.match(/"([A-Z]+)"/i);
  if (match && match[1]) {
    return match[1].toUpperCase().split('');
  }
  return [];
});

const answeredCount = computed(() => {
  return Object.values(answersMap).filter(v => !!v.trim()).length;
});

function isAnswered(id: string): boolean {
  return !!answersMap[id]?.trim();
}

function getCurrentAnswer(id: string): string {
  return answersMap[id] || '';
}

function selectChoice(choice: string) {
  if (!currentItem.value) return;
  answersMap[currentItem.value.id] = choice.toUpperCase();
  emitAnswers();
}

function handleInput(e: Event) {
  if (!currentItem.value) return;
  const target = e.target as HTMLInputElement;
  answersMap[currentItem.value.id] = target.value.toUpperCase();
  emitAnswers();
}

function clearCurrentAnswer() {
  if (!currentItem.value) return;
  answersMap[currentItem.value.id] = '';
  emitAnswers();
}

function emitAnswers() {
  const list = Object.entries(answersMap).map(([id, value]) => ({ id, value }));
  emit('update:answers', list);
}

watch(
  () => props.initialAnswers,
  newAnswers => {
    if (newAnswers) {
      for (const a of newAnswers) {
        answersMap[a.id] = (a.value || '').toUpperCase();
      }
    }
  },
  { deep: true }
);
</script>
