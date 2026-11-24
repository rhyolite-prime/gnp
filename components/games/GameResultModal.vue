<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 my-8">

      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Headline -->
      <div class="text-center">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-primary-700">
          {{ session.gameTypeCode === 'riddle' ? 'Set complete' : 'Solved.' }}
        </p>

        <h2 class="font-display text-3xl sm:text-4xl text-stone-900 mt-3 leading-tight">
          {{ session.summary || 'That’s it logged.' }}
        </h2>

        <p class="text-sm text-stone-500 mt-3 leading-relaxed max-w-xs mx-auto">
          {{ session.isMultiplayer ? 'The duel result is with your opponent.' : 'Session closed. Here’s how the score adds up.' }}
        </p>
      </div>

      <!-- Points Big Reveal -->
      <div class="text-center mt-8">
        <div class="font-display text-6xl sm:text-7xl text-stone-900 leading-none">
          {{ session.totalPoints }}
        </div>
        <div class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500 mt-3">Points earned</div>
      </div>

      <!-- Score breakdown: receipt -->
      <div class="mt-8 pt-6 border-t border-stone-200 space-y-3">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500 mb-4">How the score adds up</p>

        <div class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Base &times; {{ breakdown?.difficultyMultiplier }} multiplier</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">{{ breakdown?.base }} &times; {{ breakdown?.difficultyMultiplier }}</span>
        </div>

        <div v-if="breakdown?.accuracyPoints" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Accuracy bonus</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">+{{ breakdown?.accuracyPoints }}</span>
        </div>

        <div v-if="breakdown?.timeBonus" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Speed bonus</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">+{{ breakdown?.timeBonus }}</span>
        </div>

        <div v-if="breakdown?.perfectBonus" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Perfect solve</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">+{{ breakdown?.perfectBonus }}</span>
        </div>

        <div v-if="breakdown?.streakBonus" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Streak bonus</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">+{{ breakdown?.streakBonus }}</span>
        </div>

        <div v-if="breakdown?.mistakePenalty" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Mistakes</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">&minus;{{ breakdown?.mistakePenalty }}</span>
        </div>

        <div v-if="breakdown?.hintPenalty" class="flex items-baseline gap-3 text-sm">
          <span class="text-stone-600">Hints used</span>
          <span class="flex-1 border-b border-dotted border-stone-300"></span>
          <span class="font-medium text-stone-900 tabular-nums">&minus;{{ breakdown?.hintPenalty }}</span>
        </div>
      </div>

      <!-- Rank & Achievements -->
      <div v-if="reward?.rankAfter || reward?.newAchievements?.length" class="mt-8 pt-6 border-t border-stone-200">
        <div v-if="reward?.rankAfter" class="flex items-center justify-between text-sm">
          <span class="text-stone-600">Your rank</span>
          <span class="font-display text-xl text-stone-900">
            #{{ reward.rankAfter }}
            <span v-if="reward.rankChange && reward.rankChange > 0" class="text-primary-700 text-sm font-sans">
              &uarr;{{ reward.rankChange }}
            </span>
          </span>
        </div>

        <div v-if="reward?.message" class="font-serif italic text-sm text-stone-500 mt-4 leading-relaxed">
          {{ reward.message }}
        </div>

        <div v-if="reward?.newAchievements?.length" class="mt-5">
          <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500 mb-3">New badges</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ach in reward.newAchievements"
              :key="ach.achievementId"
              class="text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-full px-3.5 py-1.5"
            >
              {{ ach.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-9 flex flex-col gap-3">
        <button
          v-if="!session.isComplete"
          @click="$emit('continue')"
          class="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full text-sm transition-colors"
        >
          Keep going
        </button>

        <button
          v-else
          @click="close"
          class="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full text-sm transition-colors"
        >
          Back to the puzzle desk
        </button>

        <button
          v-if="session.isComplete"
          @click="$emit('play-again')"
          class="w-full py-3 text-stone-500 hover:text-stone-900 text-sm transition-colors"
        >
          Play again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import type { GameSession, SessionBreakdown, SessionReward } from '~/models/games';

const props = defineProps<{
  session: GameSession;
  breakdown?: SessionBreakdown | null;
  reward?: SessionReward | null;
}>();

const emit = defineEmits<{
  'close': [];
  'continue': [];
  'play-again': [];
}>();

function close() {
  if (!props.session.isComplete) {
    const confirmed = window.confirm('Leave without saving? Your progress in this puzzle will be lost.');
    if (!confirmed) return;
  }
  emit('close');
}
</script>
