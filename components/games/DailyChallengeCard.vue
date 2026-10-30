<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
      <div>
        <p class="text-xs text-gray-500">Daily challenge · {{ dailyBoard?.date || todayDate }}</p>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">
          Today&rsquo;s puzzles
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          Everyone gets the same four, built from today&rsquo;s editions. Worth 200 bonus points each.
        </p>
      </div>

      <div class="text-sm text-gray-600 self-start md:self-auto">
        <p><span class="font-semibold text-gray-900">{{ dailyBoard?.completedCount || 0 }}</span> of {{ dailyBoard?.challenges?.length || 4 }} done</p>
      </div>
    </div>

    <!-- Challenges -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="item in dailyBoard?.challenges"
        :key="item.id"
        class="border border-gray-200 rounded-lg p-5 flex flex-col justify-between group hover:border-gray-300 transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900">{{ getTypeName(item.gameType) }}</span>
            <span class="text-xs text-gray-500">{{ item.difficulty }}</span>
          </div>

          <h3 class="text-sm text-gray-600 leading-snug">
            {{ item.summary }}
          </h3>

          <p class="text-xs text-gray-400 mt-2">
            {{ item.publication?.publicationName }}<template v-if="item.publication?.pageNumber"> · p.{{ item.publication.pageNumber }}</template>
          </p>
        </div>

        <div class="mt-5">
          <div v-if="item.completed" class="w-full py-2 px-3 text-emerald-700 text-sm text-center">
            Done — +{{ item.bonusEarned ?? 200 }} points earned
          </div>
          <button
            v-else
            @click="$emit('start-challenge', item.id, item.gameType)"
            class="w-full py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyBoard, GameType } from '~/models';

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
</script>
