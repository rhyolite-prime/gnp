<template>
  <div class="bg-white rounded-2xl border border-stone-200/80 p-7 sm:p-10 shadow-sm">
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500">The standings</p>
        <h2 class="font-display text-2xl sm:text-3xl text-stone-900 mt-2">Leaderboard &amp; rivalries</h2>
        <p class="text-sm text-stone-600 mt-1.5">
          Ranked by points earned from publication puzzles. Challenge any reader to a duel.
        </p>
      </div>

      <!-- Main Board Tabs (Global vs Daily vs Rivals) -->
      <div class="flex items-center gap-1 border border-stone-200 p-1 rounded-full self-start md:self-auto">
        <button
          @click="activeBoard = 'global'"
          :class="activeBoard === 'global' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
        >
          Global Board
        </button>
        <button
          @click="activeBoard = 'daily'"
          :class="activeBoard === 'daily' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
        >
          Daily Board
        </button>
        <button
          @click="activeBoard = 'rivals'"
          :class="activeBoard === 'rivals' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
        >
          Rivals
        </button>
      </div>
    </div>

    <!-- Filters for Global Board -->
    <div v-if="activeBoard === 'global'" class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <!-- Period Pills -->
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 mr-2">Timeframe</span>
        <button
          v-for="p in periods"
          :key="p.id"
          @click="changePeriod(p.id)"
          :class="selectedPeriod === p.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Game Type Pills -->
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 mr-2">Game</span>
        <button
          v-for="g in gameTypes"
          :key="g.id"
          @click="changeGameType(g.id)"
          :class="selectedGameType === g.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto rounded-xl border border-stone-200/80">
      <table class="w-full text-left text-sm">
        <thead class="bg-stone-50 text-stone-500 text-[11px] font-medium uppercase tracking-[0.14em] border-b border-stone-200">
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
        <tbody class="divide-y divide-stone-100">
          <tr
            v-for="entry in currentData"
            :key="entry.userId"
            :class="isMe(entry.userId) ? 'bg-[#faf6ee]' : 'hover:bg-stone-50/70'"
            class="transition-colors"
          >
            <!-- Rank Column with Medals -->
            <td class="py-4 px-4 text-center">
              <span class="inline-flex items-center gap-1.5">
                <span
                  v-if="entry.rank <= 3"
                  class="w-1.5 h-1.5 rounded-full"
                  :class="entry.rank === 1 ? 'bg-amber-500' : entry.rank === 2 ? 'bg-stone-400' : 'bg-amber-700'"
                ></span>
                <span class="font-display text-lg text-stone-900">{{ entry.rank }}</span>
              </span>
            </td>

            <!-- User Info -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs text-stone-600">
                  {{ entry.username?.substring(0, 2) || 'GR' }}
                </div>
                <div>
                  <div class="text-stone-900 flex items-center gap-2">
                    <span>{{ entry.username }}</span>
                    <span
                      v-if="isMe(entry.userId)"
                      class="text-[10px] text-primary-700 border border-primary-200 rounded-full px-2 py-px"
                    >
                      You
                    </span>
                  </div>
                  <span v-if="entry.firstFinish" class="text-[11px] text-stone-400">
                    First finish {{ formatTime(entry.firstFinish) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Points Column -->
            <td class="py-4 px-4 text-right font-display text-lg text-stone-900">
              {{ entry.totalPoints.toLocaleString() }}
            </td>

            <!-- Games / Challenges Column -->
            <td class="py-4 px-4 text-center text-stone-500">
              {{ entry.challengesCompleted || entry.gamesPlayed || 0 }}
            </td>

            <!-- Challenge Action Button -->
            <td class="py-3.5 px-4 text-right">
              <button
                v-if="!isMe(entry.userId)"
                @click="$emit('challenge-user', entry.userId, entry.username)"
                class="px-4 py-1.5 rounded-full border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
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
