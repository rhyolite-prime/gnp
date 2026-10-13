<template>
  <div class="space-y-6">
    <!-- Top Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Points -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between text-gray-500 mb-2">
          <span class="text-xs uppercase font-bold tracking-wider">Total Points</span>
          <Trophy class="w-5 h-5 text-amber-500" />
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-gray-900">
          {{ stats?.totalPoints?.toLocaleString() || 0 }}
        </div>
        <div class="text-[11px] text-gray-400 mt-1">
          {{ stats?.pointsToNextRank ? `${stats.pointsToNextRank} pts to next rank` : 'Keep playing to climb!' }}
        </div>
      </div>

      <!-- Current Rank -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between text-gray-500 mb-2">
          <span class="text-xs uppercase font-bold tracking-wider">Global Standing</span>
          <Medal class="w-5 h-5 text-primary-600" />
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-gray-900">
          #{{ stats?.rank || 1 }}
        </div>
        <div class="text-[11px] text-gray-400 mt-1">
          Against all readers
        </div>
      </div>

      <!-- Win Rate -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between text-gray-500 mb-2">
          <span class="text-xs uppercase font-bold tracking-wider">Win Rate</span>
          <Target class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-gray-900">
          {{ Math.round((stats?.winRate || 0) * 100) }}%
        </div>
        <div class="text-[11px] text-gray-400 mt-1">
          {{ stats?.gamesWon || 0 }} won / {{ stats?.gamesPlayed || 0 }} played
        </div>
      </div>

      <!-- Daily Streak -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between text-gray-500 mb-2">
          <span class="text-xs uppercase font-bold tracking-wider">Win Streak</span>
          <Flame class="w-5 h-5 text-orange-500" />
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-gray-900 flex items-center gap-1.5">
          <span>{{ stats?.currentStreak || 0 }}</span>
          <span class="text-xs font-normal text-gray-500">days</span>
        </div>
        <div class="text-[11px] text-gray-400 mt-1">
          Best: {{ stats?.longestStreak || 0 }} days
        </div>
      </div>
    </div>

    <!-- Breakdown by Game Type -->
    <div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <h3 class="font-bold text-gray-900 text-base mb-4">Performance by Game Type</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="type in gameTypes"
          :key="type.key"
          class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-white rounded-xl text-gray-700 shadow-sm border border-gray-100">
              <component :is="type.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-gray-900 text-sm">{{ type.title }}</div>
              <div class="text-xs text-gray-500">
                {{ stats?.byGameType?.[type.key]?.played || 0 }} solved
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-gray-900 text-sm">
              {{ stats?.byGameType?.[type.key]?.points || 0 }}
            </div>
            <div class="text-[10px] text-gray-400">pts</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent History Table -->
    <div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-gray-900 text-base">Recent Game History</h3>
          <p class="text-xs text-gray-500">Your solved newspaper puzzles and scores</p>
        </div>

        <button
          @click="showResetConfirm = true"
          class="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-xs font-semibold text-gray-500 hover:text-red-600 transition-all flex items-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      <div v-if="history && history.length" class="overflow-x-auto rounded-2xl border border-gray-100">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider border-b border-gray-100">
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
          <tbody class="divide-y divide-gray-100">
            <tr v-for="h in history" :key="h.sessionId" class="hover:bg-gray-50/70">
              <td class="py-3 px-4 font-bold capitalize text-gray-900">
                {{ formatGameType(h.gameType) }}
              </td>
              <td class="py-3 px-4 text-gray-600">
                {{ h.publication?.publicationName || 'Daily Graphic' }}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getDifficultyClass(h.difficulty)">
                  {{ h.difficulty }}
                </span>
              </td>
              <td class="py-3 px-4 text-center font-mono text-gray-600">
                {{ formatSeconds(h.completionTimeSeconds) }}
              </td>
              <td class="py-3 px-4 text-center font-mono text-gray-600">
                {{ h.mistakes || 0 }}
              </td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                +{{ h.totalPoints || 0 }} pts
              </td>
              <td class="py-3 px-4 text-right text-gray-400">
                {{ formatDate(h.startedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <Clock class="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p class="text-sm font-semibold text-gray-600">No game history yet</p>
        <p class="text-xs text-gray-400 mt-0.5">Solve your first puzzle to start recording your personal records!</p>
      </div>
    </div>

    <!-- Reset Progress Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
          <RotateCcw class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">Reset Game Progress?</h3>
        <p class="text-xs text-gray-600 mt-1 mb-6">
          This will reset your points, streaks, achievements, and completed daily challenges back to initial state.
        </p>
        <div class="flex items-center gap-3">
          <button
            @click="showResetConfirm = false"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmReset"
            class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
          >
            Reset All
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
