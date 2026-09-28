<template>
  <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
          <Trophy class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Leaderboard & Rivalries</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Ranked by points earned from publication puzzles. Challenge any player to a duel!
          </p>
        </div>
      </div>

      <!-- Main Board Tabs (Global vs Daily vs Rivals) -->
      <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl self-start md:self-auto">
        <button
          @click="activeBoard = 'global'"
          :class="activeBoard === 'global' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          Global Board
        </button>
        <button
          @click="activeBoard = 'daily'"
          :class="activeBoard === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          Daily Board
        </button>
        <button
          @click="activeBoard = 'rivals'"
          :class="activeBoard === 'rivals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          Rivals
        </button>
      </div>
    </div>

    <!-- Filters for Global Board -->
    <div v-if="activeBoard === 'global'" class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <!-- Period Pills -->
      <div class="flex items-center gap-1.5">
        <span class="text-xs font-semibold text-gray-500 mr-1">Timeframe:</span>
        <button
          v-for="p in periods"
          :key="p.id"
          @click="changePeriod(p.id)"
          :class="selectedPeriod === p.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Game Type Pills -->
      <div class="flex items-center gap-1.5">
        <span class="text-xs font-semibold text-gray-500 mr-1">Game:</span>
        <button
          v-for="g in gameTypes"
          :key="g.id"
          @click="changeGameType(g.id)"
          :class="selectedGameType === g.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto rounded-2xl border border-gray-100">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
          <tr>
            <th class="py-3 px-4 w-16 text-center">Rank</th>
            <th class="py-3 px-4">Reader</th>
            <th class="py-3 px-4 text-right">Points</th>
            <th class="py-3 px-4 text-center">
              {{ activeBoard === 'daily' ? 'Puzzles Done' : 'Games' }}
            </th>
            <th class="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="entry in currentData"
            :key="entry.userId"
            :class="isMe(entry.userId) ? 'bg-primary-50/60 font-semibold' : 'hover:bg-gray-50/70'"
            class="transition-colors"
          >
            <!-- Rank Column with Medals -->
            <td class="py-3.5 px-4 text-center font-bold">
              <span
                v-if="entry.rank === 1"
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 shadow-sm"
                title="1st Place Gold"
              >
                🥇
              </span>
              <span
                v-else-if="entry.rank === 2"
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 shadow-sm"
                title="2nd Place Silver"
              >
                🥈
              </span>
              <span
                v-else-if="entry.rank === 3"
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-800/10 text-amber-900 shadow-sm"
                title="3rd Place Bronze"
              >
                🥉
              </span>
              <span v-else class="font-mono text-gray-500">
                #{{ entry.rank }}
              </span>
            </td>

            <!-- User Info -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center font-bold text-xs text-gray-700 uppercase">
                  {{ entry.username?.substring(0, 2) || 'GR' }}
                </div>
                <div>
                  <div class="font-bold text-gray-900 flex items-center gap-1.5">
                    <span>{{ entry.username }}</span>
                    <span
                      v-if="isMe(entry.userId)"
                      class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800"
                    >
                      You
                    </span>
                  </div>
                  <span v-if="entry.firstFinish" class="text-[10px] text-gray-400">
                    Finished: {{ formatTime(entry.firstFinish) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Points Column -->
            <td class="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
              {{ entry.totalPoints.toLocaleString() }} pts
            </td>

            <!-- Games / Challenges Column -->
            <td class="py-3.5 px-4 text-center font-mono text-gray-600">
              {{ entry.challengesCompleted || entry.gamesPlayed || 0 }}
            </td>

            <!-- Challenge Action Button -->
            <td class="py-3.5 px-4 text-right">
              <button
                v-if="!isMe(entry.userId)"
                @click="$emit('challenge-user', entry.userId, entry.username)"
                class="px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all inline-flex items-center gap-1"
                title="Send a 1-on-1 publication puzzle duel"
              >
                <Swords class="w-3.5 h-3.5" />
                <span>Challenge</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from '~/models';
import { Trophy, Swords } from 'lucide-vue-next';

const props = defineProps<{
  globalData?: LeaderboardEntry[];
  dailyData?: any[];
  rivalsData?: LeaderboardEntry[];
  currentUserId?: string;
}>();

const emit = defineEmits<{
  (e: 'change-filter', filter: { period: string; gameType: string }): void;
  (e: 'challenge-user', userId: string, username: string): void;
}>();

const activeBoard = ref<'global' | 'daily' | 'rivals'>('global');
const selectedPeriod = ref('all');
const selectedGameType = ref('all');

const periods = [
  { id: 'all', label: 'All Time' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

const gameTypes = [
  { id: 'all', label: 'All Games' },
  { id: 'sudoku', label: 'Sudoku' },
  { id: 'crossword', label: 'Crossword' },
  { id: 'word_search', label: 'Word Search' },
  { id: 'riddle', label: 'Riddles' },
];

const currentData = computed(() => {
  if (activeBoard.value === 'daily') {
    return props.dailyData || [];
  }
  if (activeBoard.value === 'rivals') {
    return props.rivalsData || [];
  }
  return props.globalData || [];
});

function isMe(userId: string): boolean {
  if (!props.currentUserId) return userId === 'user-current' || userId === 'current-user';
  return props.currentUserId === userId;
}

function changePeriod(p: string) {
  selectedPeriod.value = p;
  emit('change-filter', { period: selectedPeriod.value, gameType: selectedGameType.value });
}

function changeGameType(g: string) {
  selectedGameType.value = g;
  emit('change-filter', { period: selectedPeriod.value, gameType: selectedGameType.value });
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
</script>
