<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="relative bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 border border-gray-100 text-center animate-scale-in">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Trophy / Celebration Icon -->
      <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <Trophy class="w-8 h-8 text-amber-500" />
      </div>

      <!-- Title & Message -->
      <h2 class="text-2xl font-semibold text-gray-900">
        {{ isSolved ? 'Solved.' : 'Submitted.' }}
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        {{ reward?.message || 'That’s it logged — your score is on the board.' }}
      </p>

      <!-- Prominent Points Card -->
      <div class="bg-primary-600 text-white rounded-lg p-5 my-6">
        <div class="text-xs text-primary-100">Total points earned</div>
        <div class="text-4xl sm:text-5xl font-semibold mt-1">
          +{{ totalPoints }}
        </div>
        <div v-if="reward?.bonusPoints" class="text-xs text-primary-100 mt-1">
          Includes {{ reward.bonusPoints }} in bonuses.
        </div>
      </div>

      <!-- Rank Change Alert -->
      <div v-if="reward?.rankAfter" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
        <Medal class="w-4 h-4 text-emerald-600" />
        <span>Leaderboard Standing: <strong>Rank #{{ reward.rankAfter }}</strong></span>
        <span v-if="reward.rankChange > 0" class="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-bold">
          +{{ reward.rankChange }} spots!
        </span>
      </div>

      <!-- Detailed Scoring Breakdown -->
      <div v-if="reward?.breakdown" class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left text-xs mb-6 space-y-2">
        <div class="font-bold text-gray-800 border-b border-gray-200 pb-1.5 flex items-center justify-between">
          <span>How the score adds up</span>
          <span class="text-gray-400">{{ formatSeconds(reward.breakdown.elapsedSeconds) }}</span>
        </div>

        <div class="flex justify-between text-gray-600">
          <span>Base Points & Multiplier:</span>
          <span class="font-bold text-gray-900">
            {{ reward.breakdown.base }} × {{ reward.breakdown.difficultyMultiplier }}
          </span>
        </div>

        <div class="flex justify-between text-gray-600">
          <span>Accuracy ({{ Math.round((reward.breakdown.accuracy || 1) * 100) }}%):</span>
          <span class="font-bold text-emerald-600">
            +{{ reward.breakdown.accuracyPoints }} pts
          </span>
        </div>

        <div v-if="reward.breakdown.timeBonus > 0" class="flex justify-between text-gray-600">
          <span>Speed / Time Bonus:</span>
          <span class="font-bold text-blue-600">
            +{{ reward.breakdown.timeBonus }} pts
          </span>
        </div>

        <div v-if="reward.breakdown.perfectBonus > 0" class="flex justify-between text-gray-600">
          <span>Perfect Solve Bonus:</span>
          <span class="font-bold text-purple-600">
            +{{ reward.breakdown.perfectBonus }} pts
          </span>
        </div>

        <div v-if="reward.breakdown.streakBonus > 0" class="flex justify-between text-gray-600">
          <span>Streak bonus:</span>
          <span class="font-bold text-amber-600">
            +{{ reward.breakdown.streakBonus }} pts
          </span>
        </div>

        <div v-if="reward.breakdown.mistakePenalty > 0" class="flex justify-between text-gray-600">
          <span>Mistake Penalties:</span>
          <span class="font-bold text-rose-600">
            -{{ reward.breakdown.mistakePenalty }} pts
          </span>
        </div>

        <div v-if="reward.breakdown.hintPenalty > 0" class="flex justify-between text-gray-600">
          <span>Hint Penalties:</span>
          <span class="font-bold text-rose-600">
            -{{ reward.breakdown.hintPenalty }} pts
          </span>
        </div>
      </div>

      <!-- Newly Unlocked Achievements Banner -->
      <div v-if="reward?.newAchievements && reward.newAchievements.length" class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-6">
        <div class="flex items-center gap-2 font-bold text-amber-900 text-xs mb-2">
          <Sparkles class="w-4 h-4 text-amber-600" />
          <span>New badges</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="ach in reward.newAchievements"
            :key="ach"
            class="px-3 py-1 bg-white border border-amber-300 text-amber-800 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Award class="w-3.5 h-3.5 text-amber-500" /> {{ ach }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <button
          v-if="isDaily && !dailyClaimed"
          @click="$emit('claim-daily')"
          :disabled="claimingDaily"
          class="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles class="w-4 h-4" />
          <span>{{ claimingDaily ? 'Claiming...' : 'Claim Daily Bonus (+200)' }}</span>
        </button>

        <button
          @click="$emit('close')"
          class="w-full sm:flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Playing</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameReward } from '~/models';
import { Trophy, Medal, Award, Sparkles, ArrowRight, X } from 'lucide-vue-next';

const props = defineProps<{
  reward?: GameReward;
  totalPoints: number;
  isSolved: boolean;
  isDaily?: boolean;
  dailyClaimed?: boolean;
  claimingDaily?: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'claim-daily'): void;
}>();

function formatSeconds(sec: number = 0): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}
</script>
