<template>
  <header class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Left: Title, Badges, Publication attribution -->
      <div class="flex items-start sm:items-center gap-3">
        <div class="p-2.5 rounded-xl bg-primary-50 text-primary-600">
          <component :is="gameIcon" class="w-6 h-6" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-bold text-gray-900 capitalize">{{ displayTitle }}</h1>
            <span
              :class="difficultyBadgeClass"
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              {{ session.difficulty }}
            </span>
            <span
              v-if="session.daily"
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1"
            >
              <Sparkles class="w-3 h-3 text-amber-600" /> Daily (+200 pts)
            </span>
            <span
              v-if="session.isMultiplayer"
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1"
            >
              <Swords class="w-3 h-3 text-purple-600" /> Rival Match
            </span>
          </div>

          <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1 flex-wrap">
            <Newspaper class="w-3.5 h-3.5 text-gray-400" />
            <span class="font-medium text-gray-700">{{ session.publication?.publicationName || 'Daily Graphic' }}</span>
            <span v-if="session.publication?.pageNumber" class="text-gray-400">• Page {{ session.publication.pageNumber }}</span>
            <span v-if="session.publication?.publicationDate" class="text-gray-400">• {{ session.publication.publicationDate }}</span>
          </p>
        </div>
      </div>

      <!-- Center: Metrics (Timer, Mistakes, Hints) -->
      <div class="flex items-center justify-between sm:justify-center gap-4 sm:gap-6 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
        <!-- Live Timer -->
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4 text-gray-500" />
          <div>
            <div class="text-base font-bold font-mono text-gray-800 leading-tight">
              {{ formattedTime }}
            </div>
            <div class="text-[10px] text-gray-500">
              Target: {{ formattedTarget }}
            </div>
          </div>
        </div>

        <div class="h-6 w-px bg-gray-200"></div>

        <!-- Mistakes Counter -->
        <div class="flex items-center gap-2" title="-3 points per mistake">
          <AlertCircle class="w-4 h-4 text-rose-500" />
          <div>
            <div class="text-base font-bold text-gray-800 leading-tight">
              {{ session.mistakes }}
            </div>
            <div class="text-[10px] text-gray-500">Mistakes (-3pts)</div>
          </div>
        </div>

        <div class="h-6 w-px bg-gray-200"></div>

        <!-- Hints Counter -->
        <div class="flex items-center gap-2" title="-5 points per hint">
          <HelpCircle class="w-4 h-4 text-amber-500" />
          <div>
            <div class="text-base font-bold text-gray-800 leading-tight">
              {{ session.hintsRemaining }}
            </div>
            <div class="text-[10px] text-gray-500">Hints Left</div>
          </div>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Hint Button -->
        <button
          @click="$emit('hint')"
          :disabled="hinting || session.hintsRemaining <= 0 || session.isComplete"
          class="px-3 py-2 text-xs font-semibold rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          title="Get a hint (-5 points penalty)"
        >
          <Sparkles class="w-3.5 h-3.5" :class="{ 'animate-spin': hinting }" />
          <span>Hint (-5pts)</span>
        </button>

        <!-- Check Answers (Non-finalizing) -->
        <button
          @click="$emit('check')"
          :disabled="checking || session.isComplete"
          class="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          title="Check your current answers without finalizing"
        >
          <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
          <span>{{ checking ? 'Checking...' : 'Check' }}</span>
        </button>

        <!-- Save & Exit -->
        <button
          @click="$emit('save')"
          class="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5"
          title="Save your progress and return to the game catalog"
        >
          <Bookmark class="w-3.5 h-3.5 text-gray-500" />
          <span>Save & Exit</span>
        </button>

        <!-- Submit Solution -->
        <button
          @click="$emit('submit')"
          :disabled="submitting || session.isComplete"
          class="px-4 py-2 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <Target class="w-3.5 h-3.5" />
          <span>{{ submitting ? 'Scoring...' : 'Submit Puzzle' }}</span>
        </button>

        <!-- Abandon / Delete -->
        <button
          @click="$emit('abandon')"
          class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
          title="Abandon this puzzle"
        >
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { GameSession } from '~/models';
import {
  Grid,
  Search,
  FileText,
  HelpCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Swords,
  Newspaper,
  CheckCircle2,
  Bookmark,
  Target,
  RotateCcw
} from 'lucide-vue-next';

const props = defineProps<{
  session: GameSession;
  elapsedSeconds: number;
  targetSeconds?: number;
  checking?: boolean;
  submitting?: boolean;
  hinting?: boolean;
}>();

defineEmits<{
  (e: 'hint'): void;
  (e: 'check'): void;
  (e: 'submit'): void;
  (e: 'save'): void;
  (e: 'abandon'): void;
}>();

const displayTitle = computed(() => {
  if (props.session.gameType === 'sudoku') return 'Letter Sudoku';
  if (props.session.gameType === 'word_search') return 'Word Search';
  if (props.session.gameType === 'crossword') return 'Daily Crossword';
  if (props.session.gameType === 'riddle') return 'Newsroom Riddles';
  return 'Puzzle';
});

const gameIcon = computed(() => {
  if (props.session.gameType === 'sudoku') return Grid;
  if (props.session.gameType === 'word_search') return Search;
  if (props.session.gameType === 'crossword') return FileText;
  return HelpCircle;
});

const difficultyBadgeClass = computed(() => {
  switch (props.session.difficulty) {
    case 'easy':
      return 'bg-emerald-100 text-emerald-800';
    case 'hard':
      return 'bg-orange-100 text-orange-800';
    case 'expert':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
});

const formattedTime = computed(() => {
  const m = Math.floor(props.elapsedSeconds / 60);
  const s = props.elapsedSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const formattedTarget = computed(() => {
  const t = props.targetSeconds || 480;
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});
</script>
