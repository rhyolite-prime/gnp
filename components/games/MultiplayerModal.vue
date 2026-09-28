<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 my-8 border border-gray-100 animate-scale-in">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3.5 mb-6">
        <div class="p-3 bg-purple-100 text-purple-700 rounded-2xl">
          <Swords class="w-7 h-7" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Multiplayer Rivalries</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Duel other readers on identical publication-backed puzzles.
          </p>
        </div>
      </div>

      <!-- Mode Tabs (Send Challenge vs Active Matches) -->
      <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-6">
        <button
          @click="activeTab = 'create'"
          :class="activeTab === 'create' ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          Send New Challenge
        </button>
        <button
          @click="activeTab = 'matches'"
          :class="activeTab === 'matches' ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span>Active Duels</span>
          <span v-if="challenges && challenges.length" class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-purple-800">
            {{ challenges.length }}
          </span>
        </button>
      </div>

      <!-- Tab 1: Create Challenge -->
      <div v-if="activeTab === 'create'" class="space-y-4">
        <!-- Opponent Selection -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Select Opponent
          </label>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <button
              v-for="rival in rivalOptions"
              :key="rival.userId"
              type="button"
              @click="selectedOpponent = rival.userId"
              :class="selectedOpponent === rival.userId ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
              class="p-3 rounded-xl border text-left transition-all"
            >
              <div class="font-bold text-gray-900 text-xs">{{ rival.username }}</div>
              <div class="text-[10px] text-gray-500">Rank #{{ rival.rank }} • {{ rival.totalPoints }} pts</div>
            </button>
          </div>
        </div>

        <!-- Game Type Selection -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Game Type
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="gt in availableGameTypes"
              :key="gt.id"
              type="button"
              @click="selectedGameType = gt.id"
              :class="selectedGameType === gt.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'"
              class="p-2.5 rounded-xl border text-xs font-bold transition-all text-center"
            >
              {{ gt.label }}
            </button>
          </div>
        </div>

        <!-- Difficulty Selection -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Difficulty
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="diff in difficulties"
              :key="diff"
              type="button"
              @click="selectedDifficulty = diff"
              :class="selectedDifficulty === diff ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'"
              class="p-2.5 rounded-xl border text-xs font-bold capitalize transition-all text-center"
            >
              {{ diff }}
            </button>
          </div>
        </div>

        <!-- Rules Info Banner -->
        <div class="bg-purple-50/60 border border-purple-200 rounded-2xl p-3.5 text-xs text-purple-900 space-y-1">
          <div class="font-bold flex items-center gap-1">
            <Sparkles class="w-3.5 h-3.5 text-purple-600" /> Rivalry Rules
          </div>
          <div>• Both players receive the exact same puzzle built from newspaper text.</div>
          <div>• The player with higher accuracy and faster completion time wins.</div>
          <div>• Winner earns a <strong>+25 Rivalry Bonus</strong>!</div>
        </div>

        <!-- Send Challenge Button -->
        <button
          @click="handleSendChallenge"
          :disabled="!selectedOpponent || sending"
          class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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
          class="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex flex-col justify-between gap-3"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-gray-900">
                  {{ c.challengerName }} vs {{ c.opponentName }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                  {{ c.gameType }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ c.summary }}
              </p>
            </div>
            <span class="text-[10px] uppercase font-bold text-gray-400">
              {{ c.difficulty }}
            </span>
          </div>

          <!-- Actions according to status -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-200">
            <template v-if="!c.youAreChallenger && c.status === 'active'">
              <button
                @click="$emit('accept-challenge', c.challengeId)"
                class="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Play class="w-3.5 h-3.5" /> Accept & Play Match
              </button>
              <button
                @click="$emit('decline-challenge', c.challengeId)"
                class="py-2 px-3 border border-gray-200 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold text-gray-600 transition-all"
              >
                Decline
              </button>
            </template>

            <template v-else-if="c.youAreChallenger && c.status === 'active'">
              <div class="text-xs text-purple-700 font-semibold flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-purple-500" />
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
