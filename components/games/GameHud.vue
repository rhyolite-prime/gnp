<template>
  <header class="bg-white border border-stone-200/80 rounded-2xl shadow-sm p-5 mb-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Left: Title, Badges, Publication attribution -->
      <div class="flex items-start sm:items-center gap-3">
        <div class="w-11 h-11 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center shrink-0">
          <component :is="gameIcon" class="w-5 h-5" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="font-display text-xl text-stone-900">{{ displayTitle }}</h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium text-stone-500 border border-stone-200 capitalize">
              {{ session.difficulty }}
            </span>
            <span
              v-if="session.daily"
              class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1"
            >
              <Sparkles class="w-3 h-3 text-amber-600" /> Daily (+200 pts)
            </span>
            <span
              v-if="session.isMultiplayer"
              class="px-2.5 py-0.5 rounded-full text-xs font-medium text-stone-600 border border-stone-200 flex items-center gap-1"
            >
              <Swords class="w-3 h-3 text-stone-500" /> Rival Match
            </span>
          </div>

          <p class="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
            <Newspaper class="w-3.5 h-3.5 text-stone-400" />
            <span class="font-serif italic text-stone-600">{{ session.publication?.publicationName || 'Daily Graphic' }}</span>
            <span v-if="session.publication?.pageNumber" class="text-stone-400">&middot; p.{{ session.publication.pageNumber }}</span>
            <span v-if="session.publication?.publicationDate" class="text-stone-400">&middot; {{ session.publication.publicationDate }}</span>
          </p>
        </div>
      </div>

      <!-- Center: Metrics (Timer, Mistakes, Hints) -->
      <div class="flex items-center justify-between sm:justify-center divide-x divide-stone-200 border-y border-stone-200 px-1 py-2">
        <!-- Live Timer -->
        <div class="flex items-center gap-2.5 px-3">
          <Clock class="w-4 h-4 text-stone-400" />
          <div>
            <div class="font-display text-lg text-stone-900 leading-tight tabular-nums">
              {{ formattedTime }}
            </div>
            <div class="text-[10px] text-stone-500 mt-0.5">
              Target {{ formattedTarget }}
            </div>
          </div>
        </div>

        

        <!-- Mistakes Counter -->
        <div class="flex items-center gap-2.5 px-3" title="3 points off per mistake">
          <AlertCircle class="w-4 h-4 text-stone-400" />
          <div>
            <div class="font-display text-lg text-stone-900 leading-tight tabular-nums">
              {{ session.mistakes }}
            </div>
            <div class="text-[10px] text-stone-500 mt-0.5">Mistakes (−3)</div>
          </div>
        </div>

        

        <!-- Hints Counter -->
        <div class="flex items-center gap-2.5 px-3" title="5 points off per hint">
          <HelpCircle class="w-4 h-4 text-stone-400" />
          <div>
            <div class="font-display text-lg text-stone-900 leading-tight tabular-nums">
              {{ session.hintsRemaining }}
            </div>
            <div class="text-[10px] text-stone-500 mt-0.5">Hints left</div>
          </div>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Hint Button -->
        <button
          @click="$emit('hint')"
          :disabled="hinting || session.hintsRemaining <= 0 || session.isComplete"
          class="px-4 py-2 text-xs font-medium rounded-full border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          title="Get a hint (5 points off)"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Hint (−5)</span>
        </button>

        <!-- Check Answers (Non-finalizing) -->
        <button
          @click="$emit('check')"
          :disabled="checking || session.isComplete"
          class="px-4 py-2 text-xs font-medium rounded-full border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          title="Check your current answers without finalizing"
        >
          <CheckCircle2 class="w-3.5 h-3.5 text-stone-400" />
          <span>{{ checking ? 'Checking…' : 'Check' }}</span>
        </button>

        <!-- Save & Exit -->
        <button
          @click="$emit('save')"
          class="px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1.5"
          title="Save your progress and return to the game catalog"
        >
          <Bookmark class="w-3.5 h-3.5" />
          <span>Save & Exit</span>
        </button>

        <!-- Submit Solution -->
        <button
          @click="$emit('submit')"
          :disabled="submitting || session.isComplete"
          class="px-5 py-2 text-xs font-medium rounded-full bg-stone-900 hover:bg-stone-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          <Target class="w-3.5 h-3.5" />
          <span>{{ submitting ? 'Scoring…' : 'Submit' }}</span>
        </button>

        <!-- Abandon / Delete -->
        <button
          @click="$emit('abandon')"
          class="p-2 text-stone-400 hover:text-red-600 rounded-full transition-colors"
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
