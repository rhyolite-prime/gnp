<template>
  <div class="bg-stone-900 rounded-2xl p-7 sm:p-10 text-stone-100">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-white/10">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
          {{ formattedDate }}
        </p>
        <h2 class="font-display text-3xl sm:text-4xl text-[#f5f0e8] mt-3 leading-tight">Today&rsquo;s puzzles</h2>
        <p class="text-sm text-stone-400 mt-2.5 leading-relaxed max-w-lg">
          Four puzzles, all from today&rsquo;s papers. Finish them before midnight and bank the streak bonus.
        </p>
      </div>

      <!-- Progress & Potential Bonus -->
      <div class="flex items-center gap-8 self-start lg:self-auto">
        <div>
          <div class="font-display text-3xl text-[#f5f0e8] leading-none">{{ completedCount }} of {{ list.length }}</div>
          <div class="text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400 mt-2">Done</div>
        </div>
        <div>
          <div class="font-display text-3xl text-amber-400 leading-none">+200</div>
          <div class="text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400 mt-2">Bonus points each</div>
        </div>
      </div>
    </div>

    <!-- Challenge Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
      <div
        v-for="challenge in list"
        :key="challenge.id"
        class="border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/25 transition-colors"
      >
        <div>
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display text-lg text-[#f5f0e8] leading-snug">
              {{ challenge.summary }}
            </h3>
            <span
              v-if="challenge.completed"
              class="text-xs text-amber-400 whitespace-nowrap pt-1"
            >
              Done
            </span>
          </div>

          <p class="text-xs text-stone-400 mt-2">
            {{ getTypeName(challenge.gameType) }} &middot; {{ challenge.difficulty }}
          </p>

          <p class="text-xs text-stone-500 mt-2.5 leading-relaxed">
            {{ challenge.publication?.publicationName }}<template v-if="challenge.publication?.pageNumber"> &middot; p.{{ challenge.publication?.pageNumber }}</template>
          </p>
        </div>

        <div class="mt-5">
          <button
            v-if="!challenge.completed"
            @click="$emit('start-challenge', challenge.id, challenge.gameType)"
            class="w-full py-2 bg-white hover:bg-stone-100 text-stone-900 rounded-full text-xs font-medium transition-colors"
          >
            Play
          </button>
          <div v-else class="text-xs text-stone-400 py-2 text-center">
            +{{ challenge.bonusEarned ?? challenge.bonus ?? 200 }} pts banked
          </div>
        </div>
      </div>

      <div v-if="!list.length" class="col-span-full text-center text-sm text-stone-500 py-8">
        Today&rsquo;s set isn&rsquo;t out yet. Check back shortly.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DailyBoard } from '~/models/games';

const props = defineProps<{
  dailyBoard?: DailyBoard | null;
}>();

defineEmits<{
  'start-challenge': [challengeId: string, gameType: string];
}>();

const formattedDate = computed(() => {
  const d = props.dailyBoard?.date ? new Date(props.dailyBoard.date) : new Date();
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
});

const list = computed(() => props.dailyBoard?.challenges || []);
const completedCount = computed(() => list.value.filter(c => c.completed).length);

function getTypeName(type: string) {
  const map: Record<string, string> = {
    sudoku: 'Sudoku',
    word_search: 'Word search',
    crossword: 'Crossword',
    riddle: 'Riddles',
  };
  return map[type] || type;
}
</script>
