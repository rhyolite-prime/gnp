<template>
  <div class="space-y-6">
    <!-- Top Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Points -->
      <div class="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
        <div class="flex items-center justify-between text-stone-500 mb-3">
          <span class="text-[11px] font-medium uppercase tracking-[0.22em]">Total Points</span>
          <Trophy class="w-4 h-4 text-stone-300" />
        </div>
        <div class="font-display text-3xl text-stone-900 leading-none">
          {{ stats?.totalPoints?.toLocaleString() || 0 }}
        </div>
        <div class="text-[11px] text-stone-400 mt-2.5">
          {{ stats?.pointsToNextRank ? `${stats.pointsToNextRank} points to the next rank` : 'Keep playing to climb.' }}
        </div>
      </div>

      <!-- Current Rank -->
      <div class="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
        <div class="flex items-center justify-between text-stone-500 mb-3">
          <span class="text-[11px] font-medium uppercase tracking-[0.22em]">Rank</span>
          <Medal class="w-4 h-4 text-stone-300" />
        </div>
        <div class="font-display text-3xl text-stone-900 leading-none">
          #{{ stats?.rank || 1 }}
        </div>
        <div class="text-[11px] text-stone-400 mt-2.5">
          Against all readers
        </div>
      </div>

      <!-- Win Rate -->
      <div class="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
        <div class="flex items-center justify-between text-stone-500 mb-3">
          <span class="text-[11px] font-medium uppercase tracking-[0.22em]">Win Rate</span>
          <Target class="w-4 h-4 text-stone-300" />
        </div>
        <div class="font-display text-3xl text-stone-900 leading-none">
          {{ Math.round((stats?.winRate || 0) * 100) }}%
        </div>
        <div class="text-[11px] text-stone-400 mt-2.5">
          {{ stats?.gamesWon || 0 }} won / {{ stats?.gamesPlayed || 0 }} played
        </div>
      </div>

      <!-- Daily Streak -->
      <div class="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
        <div class="flex items-center justify-between text-stone-500 mb-3">
          <span class="text-[11px] font-medium uppercase tracking-[0.22em]">Streak</span>
          <Flame class="w-4 h-4 text-stone-300" />
        </div>
        <div class="font-display text-3xl text-stone-900 leading-none flex items-center gap-2">
          <span>{{ stats?.currentStreak || 0 }}</span>
          <span class="text-xs font-normal text-gray-500">days</span>
        </div>
        <div class="text-[11px] text-stone-400 mt-2.5">
          Best: {{ stats?.longestStreak || 0 }} days
        </div>
      </div>
    </div>

    <!-- Breakdown by Game Type -->
    <div class="bg-white rounded-2xl border border-stone-200/80 p-7 sm:p-8 shadow-sm">
      <h3 class="font-display text-2xl text-stone-900 mb-5">By game</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="type in gameTypes"
          :key="type.key"
          class="bg-stone-50 border border-stone-100 rounded-xl p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full border border-stone-200 text-stone-600 flex items-center justify-center shrink-0">
              <component :is="type.icon" class="w-4 h-4" />
            </div>
            <div>
              <div class="text-stone-900 text-sm">{{ type.title }}</div>
              <div class="text-xs text-stone-500">
                {{ stats?.byGameType?.[type.key]?.played || 0 }} solved
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-display text-lg text-stone-900 leading-none">
              {{ stats?.byGameType?.[type.key]?.points || 0 }}
            </div>
            <div class="text-[10px] text-stone-400 mt-1">pts</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent History Table -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div class="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 class="font-display text-2xl text-stone-900">Recent games</h3>
          <p class="text-sm text-stone-500 mt-1">Every solve, with its score and source.</p>
        </div>

        <button
          @click="showResetConfirm = true"
          class="text-xs text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset progress</span>
        </button>
      </div>

      <div v-if="history && history.length" class="overflow-x-auto rounded-xl border border-stone-200/80">
        <table class="w-full text-left text-xs">
          <thead class="bg-stone-50 text-stone-500 text-[11px] font-medium uppercase tracking-[0.14em] border-b border-stone-200">
            <tr>
              <th class="py-3 px-4">Game</th>
              <th class="py-3 px-4">Publication</th>
              <th class="py-3 px-4 text-center">Difficulty</th>
              <th class="py-3 px-4 text-center">Time</th>
              <th class="py-3 px-4 text-center">Mistakes</th>
              <th class="py-3 px-4 text-right">Points</th>
              <th class="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr v-for="h in history" :key="h.sessionId" class="hover:bg-stone-50/70">
              <td class="py-3.5 px-4 text-stone-900">
                {{ formatGameType(h.gameType) }}
              </td>
              <td class="py-3.5 px-4 text-stone-600 font-serif italic">
                {{ h.publication?.publicationName || 'Daily Graphic' }}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize border border-stone-200 text-stone-500">
                  {{ h.difficulty }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center text-stone-600 tabular-nums">
                {{ formatSeconds(h.completionTimeSeconds) }}
              </td>
              <td class="py-3.5 px-4 text-center text-stone-600 tabular-nums">
                {{ h.mistakes || 0 }}
              </td>
              <td class="py-3.5 px-4 text-right font-display text-base text-stone-900">
                +{{ h.totalPoints || 0 }} pts
              </td>
              <td class="py-3.5 px-4 text-right text-stone-400">
                {{ formatDate(h.startedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
        <Clock class="w-7 h-7 text-stone-300 mx-auto mb-3" />
        <p class="font-display text-xl text-stone-900">No games yet</p>
        <p class="text-sm text-stone-500 mt-1.5">Solve your first puzzle and it’ll show up here.</p>
      </div>
    </div>

    <!-- Reset Progress Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <h3 class="font-display text-2xl text-stone-900">Reset your progress?</h3>
        <p class="text-sm text-stone-600 mt-2.5 mb-7 leading-relaxed">
          This will reset your points, streaks, achievements, and completed daily challenges back to initial state.
        </p>
        <div class="flex items-center gap-3">
          <button
            @click="showResetConfirm = false"
            class="flex-1 py-3 rounded-full border border-stone-200 text-sm text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            @click="confirmReset"
            class="flex-1 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserGameStats, GameSession } from '~/models';
import {
  Trophy,
  Medal,
  Target,
  Flame,
  Grid,
  Search,
  FileText,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-vue-next';

const props = defineProps<{
  stats?: UserGameStats | null;
  history?: GameSession[];
}>();

const emit = defineEmits<{
  (e: 'reset-progress'): void;
}>();

const showResetConfirm = ref(false);

const gameTypes = [
  { key: 'sudoku', title: 'Sudoku', icon: Grid },
  { key: 'word_search', title: 'Word Search', icon: Search },
  { key: 'crossword', title: 'Crossword', icon: FileText },
  { key: 'riddle', title: 'Riddles', icon: HelpCircle },
];

function confirmReset() {
  showResetConfirm.value = false;
  emit('reset-progress');
}

function formatGameType(t: string): string {
  if (t === 'sudoku') return 'Letter Sudoku';
  if (t === 'word_search') return 'Word Search';
  if (t === 'crossword') return 'Crossword';
  if (t === 'riddle') return 'Riddles';
  return t;
}

function getDifficultyClass(d: string): string {
  if (d === 'easy') return 'bg-emerald-100 text-emerald-800';
  if (d === 'hard') return 'bg-orange-100 text-orange-800';
  if (d === 'expert') return 'bg-rose-100 text-rose-800';
  return 'bg-blue-100 text-blue-800';
}

function formatSeconds(sec: number = 0): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso?: string): string {
  if (!iso) return 'Today';
  try {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}
</script>
