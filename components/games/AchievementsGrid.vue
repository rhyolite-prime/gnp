<template>
  <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
      <div class="flex items-center gap-3.5">
        <div class="p-3 bg-amber-100 text-amber-700 rounded-2xl">
          <Award class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Achievements & Honors</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Earn permanent bonus points and badges as you conquer Graphic News Plus puzzles.
          </p>
        </div>
      </div>

      <!-- Stats Summary + Check Badges Button -->
      <div class="flex items-center gap-3">
        <div class="bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-right">
          <div class="text-[10px] uppercase font-bold text-gray-400">Unlocked</div>
          <div class="text-sm font-black text-gray-900">
            {{ unlockedCount }} / {{ achievements.length }}
          </div>
        </div>

        <button
          @click="$emit('check-achievements')"
          :disabled="checking"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
        >
          <Sparkles class="w-4 h-4" :class="{ 'animate-spin': checking }" />
          <span>{{ checking ? 'Checking...' : 'Check Badges' }}</span>
        </button>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap items-center gap-1.5 mb-6">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="selectedCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Achievements Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ach in filteredAchievements"
        :key="ach.id"
        :class="ach.isUnlocked ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50/80 border-gray-200 opacity-70'"
        class="border rounded-2xl p-4 transition-all flex flex-col justify-between"
      >
        <div class="flex items-start gap-3.5 mb-3">
          <!-- Badge Icon -->
          <div
            :class="ach.isUnlocked ? 'bg-amber-100 text-amber-700 shadow-sm' : 'bg-gray-200 text-gray-400'"
            class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          >
            <component :is="getAchievementIcon(ach)" class="w-6 h-6" />
          </div>

          <!-- Title & Description -->
          <div class="flex-1">
            <div class="flex items-center justify-between gap-1">
              <h3 class="font-bold text-gray-900 text-sm leading-snug">
                {{ ach.name }}
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 shrink-0">
                +{{ ach.bonusPoints }} pts
              </span>
            </div>
            <p class="text-xs text-gray-600 mt-1 leading-relaxed">
              {{ ach.description }}
            </p>
          </div>
        </div>

        <!-- Status Footer -->
        <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
          <span class="capitalize text-gray-400 font-medium">
            {{ ach.gameType === 'any' ? 'All Puzzles' : ach.gameType }}
          </span>

          <span
            v-if="ach.isUnlocked"
            class="font-bold text-emerald-700 flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Unlocked
          </span>
          <span
            v-else
            class="font-medium text-gray-400 flex items-center gap-1"
          >
            <Lock class="w-3.5 h-3.5" /> Locked
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameAchievement } from '~/models';
import {
  Award,
  Sparkles,
  Trophy,
  Flame,
  Grid,
  Search,
  FileText,
  HelpCircle,
  Medal,
  CheckCircle2,
  Lock
} from 'lucide-vue-next';

const props = defineProps<{
  achievements: GameAchievement[];
  unlockedCount: number;
  checking?: boolean;
}>();

defineEmits<{
  (e: 'check-achievements'): void;
}>();

const selectedCategory = ref('all');

const categories = [
  { id: 'all', label: 'All Badges' },
  { id: 'unlocked', label: 'Unlocked' },
  { id: 'sudoku', label: 'Sudoku' },
  { id: 'crossword', label: 'Crossword' },
  { id: 'word_search', label: 'Word Search' },
  { id: 'riddle', label: 'Riddles' },
  { id: 'streak', label: 'Streaks' },
];

const filteredAchievements = computed(() => {
  return props.achievements.filter(ach => {
    if (selectedCategory.value === 'unlocked') return ach.isUnlocked;
    if (selectedCategory.value === 'sudoku') return ach.gameType === 'sudoku';
    if (selectedCategory.value === 'crossword') return ach.gameType === 'crossword';
    if (selectedCategory.value === 'word_search') return ach.gameType === 'word_search';
    if (selectedCategory.value === 'riddle') return ach.gameType === 'riddle';
    if (selectedCategory.value === 'streak') return ach.achievementType === 'streak';
    return true;
  });
});

function getAchievementIcon(ach: GameAchievement) {
  if (ach.achievementType === 'streak') return Flame;
  if (ach.achievementType === 'points') return Trophy;
  if (ach.gameType === 'sudoku') return Grid;
  if (ach.gameType === 'word_search') return Search;
  if (ach.gameType === 'crossword') return FileText;
  if (ach.gameType === 'riddle') return HelpCircle;
  return Medal;
}
</script>
