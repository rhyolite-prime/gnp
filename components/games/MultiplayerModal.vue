<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 sm:p-10 my-8 animate-scale-in">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="mb-7">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-primary-700">Head to head</p>
          <h2 class="font-display text-3xl text-stone-900 mt-2 leading-tight">Challenge a reader</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Duel other readers on identical publication-backed puzzles.
          </p>
        </div>
      </div>

      <!-- Mode Tabs (Send Challenge vs Active Matches) -->
      <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-6">
        <button
          @click="activeTab = 'create'"
          :class="activeTab === 'create' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          class="px-4 py-2 rounded-full text-xs font-medium transition-colors"
        >
          Send New Challenge
        </button>
        <button
          @click="activeTab = 'matches'"
          :class="activeTab === 'matches' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          class="px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <span>Active Duels</span>
          <span v-if="challenges && challenges.length" class="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-stone-800">
            {{ challenges.length }}
          </span>
        </button>
      </div>

      <!-- Tab 1: Create Challenge -->
      <div v-if="activeTab === 'create'" class="space-y-4">
        <!-- Opponent Selection -->
        <div>
          <label class="block text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 mb-2.5">
            Select Opponent
          </label>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <button
              v-for="rival in rivalOptions"
              :key="rival.userId"
              type="button"
              @click="selectedOpponent = rival.userId"
              :class="selectedOpponent === rival.userId ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'"
              class="p-3.5 rounded-xl border text-left transition-colors"
            >
              <div class="text-stone-900 text-sm">{{ rival.username }}</div>
              <div class="text-xs text-stone-500 mt-0.5">Rank #{{ rival.rank }} &middot; {{ rival.totalPoints }} pts</div>
            </button>
          </div>
        </div>

        <!-- Game Type Selection -->
        <div>
          <label class="block text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 mb-2.5">
            Game Type
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="gt in availableGameTypes"
              :key="gt.id"
              type="button"
              @click="selectedGameType = gt.id"
              :class="selectedGameType === gt.id ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'"
              class="p-2.5 rounded-full border text-xs font-medium transition-colors text-center"
            >
              {{ gt.label }}
            </button>
          </div>
        </div>

        <!-- Difficulty Selection -->
        <div>
          <label class="block text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 mb-2.5">
            Difficulty
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="diff in difficulties"
              :key="diff"
              type="button"
              @click="selectedDifficulty = diff"
              :class="selectedDifficulty === diff ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'"
              class="p-2.5 rounded-full border text-xs font-medium capitalize transition-colors text-center"
            >
              {{ diff }}
            </button>
          </div>
        </div>

        <!-- Rules Info Banner -->
        <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 space-y-1.5">
          <div class="text-stone-900">
            How duels work
          </div>
          <div>• Both players receive the exact same puzzle built from newspaper text.</div>
          <div>• The player with higher accuracy and faster completion time wins.</div>
          <div>— The winner gets <strong>+25 points</strong>.</div>
        </div>

        <!-- Send Challenge Button -->
        <button
          @click="handleSendChallenge"
          :disabled="!selectedOpponent || sending"
          class="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Swords class="w-4 h-4" />
          <span>{{ sending ? 'Sending Challenge...' : 'Send Challenge Duel' }}</span>
        </button>
      </div>

      <!-- Tab 2: Matches & Invites List -->
      <div v-else class="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        <div
          v-for="c in challenges"
          :key="c.challengeId"
          class="border border-stone-200 rounded-xl p-4 bg-stone-50/70 flex flex-col justify-between gap-3"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-stone-900">
                  {{ c.challengerName }} vs {{ c.opponentName }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] border border-stone-200 text-stone-600">
                  {{ c.gameType }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ c.summary }}
              </p>
            </div>
            <span class="text-[10px] text-stone-400">
              {{ c.difficulty }}
            </span>
          </div>

          <!-- Actions according to status -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-200">
            <template v-if="!c.youAreChallenger && c.status === 'active'">
              <button
                @click="$emit('accept-challenge', c.challengeId)"
                class="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Play class="w-3.5 h-3.5" /> Accept & Play Match
              </button>
              <button
                @click="$emit('decline-challenge', c.challengeId)"
                class="py-2.5 px-4 text-xs text-stone-500 hover:text-red-600 transition-colors"
              >
                Decline
              </button>
            </template>

            <template v-else-if="c.youAreChallenger && c.status === 'active'">
              <div class="text-xs text-stone-500 flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-stone-400" />
                <span>Challenge sent to {{ c.opponentName }}. Waiting for response...</span>
              </div>
            </template>

            <template v-else>
              <span class="text-xs font-semibold text-gray-500 capitalize">
                Status: {{ c.status }}
              </span>
            </template>
          </div>
        </div>

        <div v-if="!challenges || !challenges.length" class="text-center py-8 text-gray-400 text-xs">
          No active challenges. Choose a reader above to initiate your first duel!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChallengeItem, GameType, Difficulty } from '~/models';
import { Swords, Sparkles, Play, Clock, X } from 'lucide-vue-next';

const props = defineProps<{
  challenges?: ChallengeItem[];
  preselectedOpponent?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create-challenge', payload: { opponentId: string; gameType: GameType; difficulty: Difficulty }): void;
  (e: 'accept-challenge', challengeId: string): void;
  (e: 'decline-challenge', challengeId: string): void;
}>();

const activeTab = ref<'create' | 'matches'>('create');
const selectedOpponent = ref<string>(props.preselectedOpponent || 'u-102');
const selectedGameType = ref<GameType>('crossword');
const selectedDifficulty = ref<Difficulty>('medium');
const sending = ref(false);

const rivalOptions = [
  { userId: 'u-102', username: 'Ama Osei', totalPoints: 4120, rank: 2 },
  { userId: 'u-103', username: 'Kofi Mensah', totalPoints: 3780, rank: 3 },
  { userId: 'u-104', username: 'Akosua Darko', totalPoints: 3250, rank: 4 },
  { userId: 'u-105', username: 'Yaw Boateng', totalPoints: 2940, rank: 5 },
];

const availableGameTypes: Array<{ id: GameType; label: string }> = [
  { id: 'sudoku', label: 'Sudoku' },
  { id: 'crossword', label: 'Crossword' },
  { id: 'word_search', label: 'Word Search' },
  { id: 'riddle', label: 'Riddles' },
];

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

function handleSendChallenge() {
  if (!selectedOpponent.value) return;
  sending.value = true;
  emit('create-challenge', {
    opponentId: selectedOpponent.value,
    gameType: selectedGameType.value,
    difficulty: selectedDifficulty.value,
  });
  setTimeout(() => {
    sending.value = false;
    activeTab.value = 'matches';
  }, 400);
}
</script>
