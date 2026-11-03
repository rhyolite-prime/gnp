<template>
  <div class="bg-white rounded-2xl border border-stone-200/80 p-7 sm:p-10 shadow-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500">The badge cabinet</p>
        <h2 class="font-display text-2xl sm:text-3xl text-stone-900 mt-2">Achievements</h2>
        <p class="text-sm text-stone-600 mt-1.5">
          Permanent bonus points, earned as you work through the puzzles.
        </p>
      </div>

      <!-- Stats Summary + Check Badges Button -->
      <div class="flex items-center gap-3">
        <div class="px-1 text-right">
          <div class="font-display text-2xl text-stone-900 leading-none">
            {{ unlockedCount }} / {{ achievements.length }}
          </div>
          <div class="text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400 mt-1.5">Unlocked</div>
        </div>

        <button
          @click="$emit('check-achievements')"
          :disabled="checking"
          class="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
        >
          <Sparkles class="w-4 h-4" :class="{ 'animate-spin': checking }" />
          <span>{{ checking ? 'Checking…' : 'Check for new badges' }}</span>
        </button>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap items-center gap-1.5 mb-6">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="selectedCategory === cat.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Achievements Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ach in filteredAchievements"
        :key="ach.id"
        :class="ach.isUnlocked ? 'bg-[#fbf7ef] border-stone-200' : 'bg-stone-50/80 border-stone-200 opacity-70'"
        class="border rounded-xl p-5 transition-colors flex flex-col justify-between"
      >
        <div class="flex items-start gap-3.5 mb-3">
          <!-- Badge Icon -->
          <div
            :class="ach.isUnlocked ? 'border-amber-300 text-amber-700' : 'border-stone-200 text-stone-300'"
            class="w-11 h-11 rounded-full border flex items-center justify-center shrink-0"
          >
            <component :is="getAchievementIcon(ach)" class="w-5 h-5" />
          </div>

          <!-- Title & Description -->
          <div class="flex-1">
            <div class="flex items-center justify-between gap-1">
              <h3 class="font-display text-base text-stone-900 leading-snug">
                {{ ach.name }}
              </h3>
              <span class="text-xs text-stone-500 shrink-0">
                +{{ ach.bonusPoints }} pts
              </span>
            </div>
            <p class="text-xs text-stone-500 mt-1.5 leading-relaxed">
              {{ ach.description }}
            </p>
          </div>
        </div>

        <!-- Status Footer -->
        <div class="pt-3 border-t border-stone-200/70 flex items-center justify-between text-[11px]">
          <span class="capitalize text-stone-400">
            {{ ach.gameType === 'any' ? 'All puzzles' : ach.gameType }}
          </span>

          <span
            v-if="ach.isUnlocked"
            class="text-amber-700 flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Unlocked
          </span>
          <span
            v-else
            class="text-stone-400 flex items-center gap-1"
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
  { id: 'all', label: 'All' },
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
