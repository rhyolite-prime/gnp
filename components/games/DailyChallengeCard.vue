<template>
  <div class="bg-gradient-to-br from-amber-500/10 via-white to-red-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
    <!-- Header banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-amber-100">
      <div class="flex items-start sm:items-center gap-3.5">
        <div class="p-3 bg-gradient-to-tr from-amber-500 to-amber-400 text-white rounded-2xl shadow-md shadow-amber-200">
          <Calendar class="w-7 h-7" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-800">
              Daily Edition
            </span>
            <span class="text-xs font-mono font-bold text-gray-500">{{ dailyBoard?.date || todayDate }}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            Today's Publication Challenges
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 mt-0.5">
            Solve puzzles drawn from today's printed news stories. Every reader solves the exact same daily edition!
          </p>
        </div>
      </div>

      <!-- Bonus Badge -->
      <div class="bg-white border border-amber-200 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 self-start md:self-auto">
        <Sparkles class="w-6 h-6 text-amber-500" />
        <div>
          <div class="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Bonus Reward</div>
          <div class="text-lg font-black text-gray-900 leading-tight">+200 Points Each</div>
        </div>
      </div>
    </div>

    <!-- Challenges Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="item in dailyBoard?.challenges"
        :key="item.id"
        class="bg-white border border-gray-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between group"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span
              :class="getTypeBadgeClass(item.gameType)"
              class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <component :is="getTypeIcon(item.gameType)" class="w-3.5 h-3.5" />
              {{ getTypeName(item.gameType) }}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {{ item.difficulty }}
            </span>
          </div>

          <h3 class="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors mb-2">
            {{ item.summary }}
          </h3>

          <div class="text-xs text-gray-500 flex items-center gap-1 mb-4">
            <Newspaper class="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span class="truncate">{{ item.publication?.publicationName }}</span>
            <span v-if="item.publication?.pageNumber" class="text-gray-400">• p.{{ item.publication.pageNumber }}</span>
          </div>
        </div>

        <div>
          <div v-if="item.completed" class="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Completed (+200 earned)</span>
          </div>
          <button
            v-else
            @click="$emit('start-challenge', item.id, item.gameType)"
            class="w-full py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Play class="w-3.5 h-3.5" />
            <span>Play Daily Challenge</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyBoard, GameType } from '~/models';
import { Calendar, Sparkles, Newspaper, Grid, Search, FileText, HelpCircle, CheckCircle2, Play } from 'lucide-vue-next';

defineProps<{
  dailyBoard?: DailyBoard | null;
}>();

defineEmits<{
  (e: 'start-challenge', challengeId: string, gameType: GameType): void;
}>();

const todayDate = computed(() => new Date().toISOString().split('T')[0]);

function getTypeName(type: string): string {
  if (type === 'sudoku') return 'Letter Sudoku';
  if (type === 'word_search') return 'Word Search';
  if (type === 'crossword') return 'Crossword';
  if (type === 'riddle') return 'Riddles';
  return 'Challenge';
}

function getTypeIcon(type: string) {
  if (type === 'sudoku') return Grid;
  if (type === 'word_search') return Search;
  if (type === 'crossword') return FileText;
  return HelpCircle;
}

function getTypeBadgeClass(type: string): string {
  if (type === 'sudoku') return 'bg-blue-50 text-blue-700';
  if (type === 'word_search') return 'bg-emerald-50 text-emerald-700';
  if (type === 'crossword') return 'bg-purple-50 text-purple-700';
  return 'bg-amber-50 text-amber-700';
}
</script>
