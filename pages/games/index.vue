<template>
  <div class="min-h-screen bg-gray-50/60 pb-20">
    <!-- Top Hero Header -->
    <div class="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-600/30 text-primary-400 border border-primary-500/40">
                Publication-Backed Puzzles
              </span>
              <span class="text-xs text-gray-400">• Graphic NewsPlus</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Newsroom Games & Puzzles
            </h1>
            <p class="text-sm sm:text-base text-gray-300 mt-2 max-w-2xl leading-relaxed">
              Every clue, word, and theme is crafted directly from Daily Graphic, Showbiz, The Mirror, and Sports archives.
              Solve puzzles, compete on leaderboards, and duel your fellow readers!
            </p>
          </div>

          <!-- Quick Stats Pill (Points, Rank, Streak) -->
          <div class="flex items-center gap-3 bg-gray-800/80 border border-gray-700/60 p-4 rounded-3xl shadow-xl backdrop-blur-md self-start lg:self-auto">
            <div class="px-3 text-center">
              <div class="text-[10px] uppercase font-bold text-gray-400">Total Points</div>
              <div class="text-xl sm:text-2xl font-black font-mono text-amber-400">
                {{ userStats?.totalPoints || 0 }}
              </div>
            </div>
            <div class="h-8 w-px bg-gray-700"></div>
            <div class="px-3 text-center">
              <div class="text-[10px] uppercase font-bold text-gray-400">Rank</div>
              <div class="text-xl sm:text-2xl font-black font-mono text-white">
                #{{ userStats?.rank || 1 }}
              </div>
            </div>
            <div class="h-8 w-px bg-gray-700"></div>
            <div class="px-3 text-center">
              <div class="text-[10px] uppercase font-bold text-gray-400">Streak</div>
              <div class="text-xl sm:text-2xl font-black font-mono text-orange-400 flex items-center justify-center gap-1">
                <Flame class="w-4 h-4 text-orange-500" />
                <span>{{ userStats?.currentStreak || 0 }}d</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active In-Progress Puzzle Banner (if not actively in play arena) -->
    <div
      v-if="activeSession && !isPlaying"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6"
    >
      <div class="bg-gradient-to-r from-amber-500 via-primary-600 to-red-600 text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-white/20 rounded-xl text-white">
            <Play class="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div class="text-xs uppercase font-extrabold tracking-wider text-amber-200">
              Puzzle In Progress
            </div>
            <h2 class="text-lg font-bold">
              {{ activeSession.summary || 'Unfinished puzzle session' }}
            </h2>
            <p class="text-xs text-white/80">
              {{ activeSession.difficulty }} difficulty • {{ activeSession.mistakes }} mistakes • {{ activeSession.hintsRemaining }} hints left
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="resumePuzzle"
            class="px-5 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all shadow-md active:scale-95"
          >
            Resume Puzzle
          </button>
          <button
            @click="handleAbandonPuzzle"
            class="p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-xl text-xs transition-all"
            title="Abandon puzzle"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <!-- MAIN PLAY ARENA (when playing an active puzzle) -->
      <section v-if="isPlaying && activeSession" class="animate-fade-in mb-12">
        <GameHud
          :session="activeSession"
          :elapsed-seconds="timerSeconds"
          :target-seconds="targetSeconds"
          :checking="checkingProgress"
          :submitting="submittingPuzzle"
          :hinting="usingHint"
          @hint="handleUseHint"
          @check="handleCheckProgress"
          @submit="handleSubmitPuzzle"
          @save="handleSaveAndExit"
          @abandon="handleAbandonPuzzle"
        />

        <!-- Active Puzzle Game Component -->
        <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <!-- Sudoku -->
          <SudokuGame
            v-if="activeSession.gameType === 'sudoku'"
            :puzzle="activeSession.puzzle"
            :initial-grid="activeSession.player?.grid"
            :reveals="activeSession.player?.reveals"
            :wrong-cells="checkResults?.wrongCells"
            @update:grid="updatePlayerGrid"
          />

          <!-- Word Search -->
          <WordSearchGame
            v-else-if="activeSession.gameType === 'word_search'"
            :puzzle="activeSession.puzzle"
            :initial-found="activeSession.player?.found"
            :reveals="activeSession.player?.reveals"
            @update:found="updatePlayerFound"
          />

          <!-- Crossword -->
          <CrosswordGame
            v-else-if="activeSession.gameType === 'crossword'"
            :puzzle="activeSession.puzzle"
            :initial-grid="activeSession.player?.grid"
            :reveals="activeSession.player?.reveals"
            :wrong-cells="checkResults?.wrongCells"
            @update:grid="updatePlayerGrid"
          />

          <!-- Riddles -->
          <RiddleGame
            v-else-if="activeSession.gameType === 'riddle'"
            :puzzle="activeSession.puzzle"
            :initial-answers="activeSession.player?.answers"
            :reveals="activeSession.player?.reveals"
            @update:answers="updatePlayerAnswers"
          />
        </div>
      </section>

      <!-- NAVIGATION TABS & DASHBOARD (when not in play arena) -->
      <div v-else>
        <!-- Nav Tabs -->
        <nav aria-label="Game Sections" class="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-4 mb-8">
          <button
            v-for="tab in navTabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="currentTab === tab.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>

        <!-- TAB 1: CATALOG OF PUZZLES -->
        <section v-if="currentTab === 'catalog'" class="space-y-8 animate-fade-in">
          <!-- Daily Challenge Highlight Banner -->
          <DailyChallengeCard
            :daily-board="dailyBoard"
            @start-challenge="handleStartDaily"
          />

          <!-- Catalog Grid -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Choose a Game to Play</h2>
                <p class="text-xs text-gray-500">All puzzles generated dynamically from stored newspaper pages.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="cat in playableCategories"
                :key="cat.gameType"
                class="bg-white border border-gray-200 hover:border-primary-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div class="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <component :is="getGameIcon(cat.gameType)" class="w-6 h-6" />
                  </div>

                  <div class="flex items-center justify-between mb-1">
                    <h3 class="font-bold text-lg text-gray-900">{{ cat.title }}</h3>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                      Base: {{ cat.basePoints }} pts
                    </span>
                  </div>

                  <p class="text-xs text-gray-600 leading-relaxed mb-4">
                    {{ cat.description }}
                  </p>

                  <div class="text-[11px] text-gray-400 bg-gray-50 rounded-xl p-3 mb-6">
                    {{ cat.content }}
                  </div>
                </div>

                <button
                  @click="openGameLauncher(cat.gameType)"
                  class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play class="w-4 h-4" />
                  <span>Play {{ cat.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 2: DAILY CHALLENGE -->
        <section v-else-if="currentTab === 'daily'" class="space-y-6 animate-fade-in">
          <DailyChallengeCard
            :daily-board="dailyBoard"
            @start-challenge="handleStartDaily"
          />

          <!-- Daily Board Leaderboard -->
          <LeaderboardTable
            :daily-data="dailyLeaderboardData"
            :current-user-id="userStats?.userId"
            @challenge-user="openMultiplayerWith"
          />
        </section>

        <!-- TAB 3: LEADERBOARDS -->
        <section v-else-if="currentTab === 'leaderboard'" class="space-y-6 animate-fade-in">
          <LeaderboardTable
            :global-data="globalLeaderboardData"
            :daily-data="dailyLeaderboardData"
            :rivals-data="rivalsData"
            :current-user-id="userStats?.userId"
            @change-filter="handleFilterChange"
            @challenge-user="openMultiplayerWith"
          />
        </section>

        <!-- TAB 4: MULTIPLAYER CHALLENGES -->
        <section v-else-if="currentTab === 'challenges'" class="space-y-6 animate-fade-in">
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div class="flex items-center gap-3.5">
                <div class="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                  <Swords class="w-6 h-6" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Multiplayer Rivalry Duels</h2>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Challenge other readers to solve identical publication-backed puzzles. Fastest accurate score wins!
                  </p>
                </div>
              </div>

              <button
                @click="showMultiplayerModal = true"
                class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <Swords class="w-4 h-4" />
                <span>Create New Duel</span>
              </button>
            </div>

            <!-- List of Challenges -->
            <div class="space-y-4">
              <div
                v-for="c in challengesList"
                :key="c.challengeId"
                class="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-900 text-sm">
                      {{ c.challengerName }} vs {{ c.opponentName }}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                      {{ c.gameType }}
                    </span>
                    <span class="text-[10px] font-bold uppercase text-gray-400">
                      {{ c.difficulty }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ c.summary }}
                  </p>
                  <div class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Newspaper class="w-3 h-3 text-gray-400" />
                    <span>{{ c.publication?.publicationName }}</span>
                    <span>• p.{{ c.publication?.pageNumber }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <template v-if="!c.youAreChallenger && c.status === 'active'">
                    <button
                      @click="handleAcceptChallenge(c.challengeId)"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      Accept Match
                    </button>
                    <button
                      @click="handleDeclineChallenge(c.challengeId)"
                      class="px-3 py-2 border border-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold rounded-xl transition-all"
                    >
                      Decline
                    </button>
                  </template>

                  <template v-else-if="c.youAreChallenger && c.status === 'active'">
                    <span class="text-xs text-purple-700 font-semibold px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-200">
                      Waiting for Opponent...
                    </span>
                  </template>

                  <template v-else>
                    <span class="text-xs text-gray-500 font-medium capitalize">
                      {{ c.status }}
                    </span>
                  </template>
                </div>
              </div>

              <div v-if="!challengesList.length" class="text-center py-12 text-gray-400 text-xs">
                No active duels found. Click "Create New Duel" to challenge a reader!
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 5: ACHIEVEMENTS & STATS -->
        <section v-else-if="currentTab === 'achievements'" class="space-y-8 animate-fade-in">
          <AchievementsGrid
            :achievements="achievementsList"
            :unlocked-count="unlockedBadgesCount"
            :checking="checkingBadges"
            @check-achievements="handleCheckAchievements"
          />

          <UserStatsCard
            :stats="userStats"
            :history="gameHistory"
            @reset-progress="handleResetUserProgress"
          />
        </section>

        <!-- TAB 6: SCORING RULES & GUIDE -->
        <section v-else-if="currentTab === 'rules'" class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 class="text-xl font-bold text-gray-900">How Scoring & Points Work</h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Graphic News Plus rewards puzzle precision, speed, consecutive play, and publication knowledge.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div class="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1">Difficulty Multipliers</div>
              <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
                <li>• <strong>Easy</strong>: 1× Multiplier (5 hints cap)</li>
                <li>• <strong>Medium</strong>: 2× Multiplier (3 hints cap)</li>
                <li>• <strong>Hard</strong>: 3× Multiplier (2 hints cap)</li>
                <li>• <strong>Expert</strong>: 4× Multiplier (1 hint cap)</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Bonus Rewards</div>
              <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
                <li>• <strong>Perfect Solve</strong>: +100 pts × Multiplier (0 hints, 0 mistakes)</li>
                <li>• <strong>Daily Challenge</strong>: +200 pts bonus for accurate solves</li>
                <li>• <strong>Speed Bonus</strong>: Up to 50% extra for solves under target time</li>
                <li>• <strong>Win Streak</strong>: +10 pts per consecutive day</li>
                <li>• <strong>Rivalry Duel</strong>: +25 pts for winning a match</li>
              </ul>
            </div>

            <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div class="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Penalties</div>
              <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
                <li>• <strong>Mistake Penalty</strong>: -3 pts per wrong cell or answer</li>
                <li>• <strong>Hint Penalty</strong>: -5 pts per revealed hint</li>
                <li>• Scores never drop below zero.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- GAME LAUNCHER MODAL (Configurator for Difficulty & Publication Source) -->
    <div v-if="showLauncherModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 border border-gray-100 animate-scale-in">
        <button
          @click="showLauncherModal = false"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3.5 mb-6">
          <div class="p-3 bg-primary-100 text-primary-700 rounded-2xl">
            <component :is="getGameIcon(launcherGameType)" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 capitalize">Play {{ launcherGameType }}</h2>
            <p class="text-xs text-gray-500">Configure your difficulty and source newspaper edition.</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Difficulty Choice -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Difficulty
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="d in difficulties"
                :key="d"
                @click="launcherDifficulty = d"
                :class="launcherDifficulty === d ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'"
                class="py-2.5 px-2 rounded-xl border text-xs font-bold capitalize transition-all text-center"
              >
                {{ d }}
              </button>
            </div>
          </div>

          <!-- Publication Source Choice -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Source Publication
            </label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <button
                v-for="source in publicationSources"
                :key="source.publicationId"
                @click="launcherPublicationId = source.publicationId"
                :class="launcherPublicationId === source.publicationId ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
                class="w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between"
              >
                <div>
                  <div class="font-bold text-gray-900 text-xs">{{ source.publicationName }}</div>
                  <div class="text-[10px] text-gray-500">{{ source.newspaperTitle }}</div>
                </div>
                <Check v-if="launcherPublicationId === source.publicationId" class="w-4 h-4 text-primary-600" />
              </button>
            </div>
          </div>

          <!-- Start Button -->
          <button
            @click="handleStartGame"
            :disabled="startingGame"
            class="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Play class="w-4 h-4" />
            <span>{{ startingGame ? 'Generating Publication Puzzle...' : 'Start Game' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MULTIPLAYER MODAL -->
    <MultiplayerModal
      v-if="showMultiplayerModal"
      :challenges="challengesList"
      :preselected-opponent="selectedDuelOpponent"
      @close="showMultiplayerModal = false"
      @create-challenge="handleCreateChallenge"
      @accept-challenge="handleAcceptChallenge"
      @decline-challenge="handleDeclineChallenge"
    />

    <!-- RESULTS & REWARD MODAL -->
    <GameResultModal
      v-if="showResultModal"
      :reward="lastResultReward"
      :total-points="lastResultPoints"
      :is-solved="lastResultSolved"
      :is-daily="activeSession?.daily"
      :daily-claimed="dailyClaimed"
      :claiming-daily="claimingDaily"
      @close="showResultModal = false; isPlaying = false"
      @claim-daily="handleClaimDailyBonus"
    />
  </div>
</template>

<script setup lang="ts">
import GameHud from '~/components/games/GameHud.vue';
import SudokuGame from '~/components/games/SudokuGame.vue';
import WordSearchGame from '~/components/games/WordSearchGame.vue';
import CrosswordGame from '~/components/games/CrosswordGame.vue';
import RiddleGame from '~/components/games/RiddleGame.vue';
import DailyChallengeCard from '~/components/games/DailyChallengeCard.vue';
import LeaderboardTable from '~/components/games/LeaderboardTable.vue';
import AchievementsGrid from '~/components/games/AchievementsGrid.vue';
import UserStatsCard from '~/components/games/UserStatsCard.vue';
import MultiplayerModal from '~/components/games/MultiplayerModal.vue';
import GameResultModal from '~/components/games/GameResultModal.vue';

import type {
  GameCategory,
  GameSession,
  DailyBoard,
  GameAchievement,
  UserGameStats,
  LeaderboardEntry,
  ChallengeItem,
  PublicationSourceRef,
  GameType,
  Difficulty
} from '~/models';

import {
  Grid,
  Search,
  FileText,
  HelpCircle,
  Trophy,
  Award,
  Flame,
  Swords,
  Calendar,
  Play,
  X,
  Check,
  Newspaper
} from 'lucide-vue-next';

import {
  getGameCategories,
  getPublicationSources,
  getLeaderboard,
  getDailyLeaderboard,
  getAchievements,
  getUserStats,
  getGameHistory,
  getDailyBoard,
  listChallenges,
  getRivals,
  startGame,
  startDaily,
  completeDaily,
  saveProgress,
  submitSession,
  useHint,
  deleteSession,
  checkAchievements,
  createChallenge,
  acceptChallenge,
  declineChallenge,
  resetProgress,
  getCurrentSession
} from '~/services/games';

// Navigation tabs
const navTabs = [
  { id: 'catalog', label: 'Play Puzzles', icon: Grid },
  { id: 'daily', label: 'Daily Challenge', icon: Calendar },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'challenges', label: 'Multiplayer Duels', icon: Swords },
  { id: 'achievements', label: 'Badges & Stats', icon: Award },
  { id: 'rules', label: 'Scoring Rules', icon: HelpCircle },
];

const currentTab = ref('catalog');
const isPlaying = ref(false);

// Active game session & HUD state
const activeSession = ref<GameSession | null>(null);
const timerSeconds = ref(0);
const timerInterval = ref<any>(null);
const targetSeconds = computed(() => {
  if (!activeSession.value) return 480;
  const t = activeSession.value.gameType;
  const d = activeSession.value.difficulty;
  let base = 480;
  if (t === 'crossword') base = 600;
  else if (t === 'sudoku') base = 540;
  else if (t === 'word_search') base = 360;
  else if (t === 'riddle') base = 300;

  if (d === 'easy') return base + 180;
  if (d === 'hard') return Math.max(120, base - 120);
  if (d === 'expert') return Math.max(90, base - 200);
  return base;
});

// Loaders
const checkingProgress = ref(false);
const submittingPuzzle = ref(false);
const usingHint = ref(false);
const startingGame = ref(false);
const checkingBadges = ref(false);
const claimingDaily = ref(false);
const dailyClaimed = ref(false);

// Check & Results Modal State
const checkResults = ref<any>(null);
const showResultModal = ref(false);
const lastResultReward = ref<any>(null);
const lastResultPoints = ref(0);
const lastResultSolved = ref(false);

// Modals
const showLauncherModal = ref(false);
const launcherGameType = ref<GameType>('sudoku');
const launcherDifficulty = ref<Difficulty>('medium');
const launcherPublicationId = ref<string>('pub-01');
const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

const showMultiplayerModal = ref(false);
const selectedDuelOpponent = ref<string>('u-102');

// Initial default categories for instant SSR rendering
const defaultCategories: GameCategory[] = [
  {
    gameType: 'sudoku',
    title: 'Letter Sudoku',
    isActive: true,
    basePoints: 60,
    gameTypeCode: 1,
    description: 'Fill a 9×9 grid with nine letters drawn from a word in a stored newspaper.',
    content: 'Letter symbols and the theme word come directly from publication text.'
  },
  {
    gameType: 'word_search',
    title: 'Word Search',
    isActive: true,
    basePoints: 50,
    gameTypeCode: 2,
    description: 'Find words hidden in a grid. The word list is taken from newspaper pages.',
    content: 'Answers and filler letters are drawn from the same sourced edition.'
  },
  {
    gameType: 'crossword',
    title: 'Crossword',
    isActive: true,
    basePoints: 70,
    gameTypeCode: 3,
    description: 'Solve clues written from sentences in published newspaper pages.',
    content: 'Every answer is a word that appears in the sourced edition.'
  },
  {
    gameType: 'riddle',
    title: 'Newsroom Riddles',
    isActive: true,
    basePoints: 40,
    gameTypeCode: 4,
    description: 'Cloze and anagram questions written from publication sentences.',
    content: 'Each prompt cites the newspaper it was taken from.'
  }
];

// Catalog & Dashboard Data
const categories = ref<GameCategory[]>(defaultCategories);
const publicationSources = ref<PublicationSourceRef[]>([]);
const dailyBoard = ref<DailyBoard | null>(null);
const globalLeaderboardData = ref<LeaderboardEntry[]>([]);
const dailyLeaderboardData = ref<any[]>([]);
const rivalsData = ref<LeaderboardEntry[]>([]);
const achievementsList = ref<GameAchievement[]>([]);
const unlockedBadgesCount = ref(0);
const userStats = ref<UserGameStats | null>(null);
const gameHistory = ref<GameSession[]>([]);
const challengesList = ref<ChallengeItem[]>([]);

const playableCategories = computed(() => {
  return categories.value.filter(c => c.gameType !== 'daily');
});

function getGameIcon(type: string) {
  if (type === 'sudoku') return Grid;
  if (type === 'word_search') return Search;
  if (type === 'crossword') return FileText;
  return HelpCircle;
}

// Timer controls
function startTimer(initialSeconds = 0) {
  stopTimer();
  timerSeconds.value = initialSeconds;
  timerInterval.value = setInterval(() => {
    timerSeconds.value += 1;
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

// Load initial data
async function loadInitialData() {
  try {
    const catRes = await getGameCategories();
    if (catRes?.categories) categories.value = catRes.categories;

    const srcRes = await getPublicationSources();
    if (srcRes?.sources) {
      publicationSources.value = srcRes.sources;
      if (srcRes.sources.length) {
        launcherPublicationId.value = srcRes.sources[0].publicationId;
      }
    }

    const dBoard = await getDailyBoard();
    if (dBoard) dailyBoard.value = dBoard;

    const gBoard = await getLeaderboard();
    if (gBoard?.data) globalLeaderboardData.value = gBoard.data;

    const dLead = await getDailyLeaderboard();
    if (dLead?.data) dailyLeaderboardData.value = dLead.data;

    const rBoard = await getRivals();
    if (rBoard?.data) rivalsData.value = rBoard.data;

    const achRes = await getAchievements();
    if (achRes?.data) {
      achievementsList.value = achRes.data;
      unlockedBadgesCount.value = achRes.unlockedCount || 0;
    }

    const stats = await getUserStats();
    if (stats) userStats.value = stats;

    const hist = await getGameHistory();
    if (hist?.data) gameHistory.value = hist.data;

    const chals = await listChallenges();
    if (chals?.data) challengesList.value = chals.data;

    // Check if there is an active session
    const current = await getCurrentSession();
    if (current && !current.isComplete) {
      activeSession.value = current;
    }
  } catch (err) {
    console.error('Failed to load games data:', err);
  }
}

// Open Game Launcher
function openGameLauncher(type: GameType) {
  launcherGameType.value = type;
  showLauncherModal.value = true;
}

// Start Game
async function handleStartGame() {
  startingGame.value = true;
  try {
    const res = await startGame({
      gameType: launcherGameType.value,
      difficulty: launcherDifficulty.value,
      publicationId: launcherPublicationId.value,
    });
    if (res?.success && res.result) {
      activeSession.value = res.result;
      isPlaying.value = true;
      showLauncherModal.value = false;
      checkResults.value = null;
      startTimer(0);
    }
  } catch (err) {
    console.error('Start game error:', err);
  } finally {
    startingGame.value = false;
  }
}

// Start Daily Challenge
async function handleStartDaily(challengeId: string, gameType: GameType) {
  try {
    const res = await startDaily(challengeId, gameType);
    if (res?.success && res.result) {
      activeSession.value = res.result;
      isPlaying.value = true;
      checkResults.value = null;
      startTimer(0);
    }
  } catch (err) {
    console.error('Start daily challenge error:', err);
  }
}

// Resume in-progress puzzle
function resumePuzzle() {
  if (activeSession.value) {
    isPlaying.value = true;
    startTimer(activeSession.value.completionTimeSeconds || 0);
  }
}

// Player state updates from components
function updatePlayerGrid(grid: string[][]) {
  if (activeSession.value) {
    if (!activeSession.value.player) activeSession.value.player = {};
    activeSession.value.player.grid = grid;
  }
}

function updatePlayerFound(found: any[]) {
  if (activeSession.value) {
    if (!activeSession.value.player) activeSession.value.player = {};
    activeSession.value.player.found = found;
  }
}

function updatePlayerAnswers(answers: any[]) {
  if (activeSession.value) {
    if (!activeSession.value.player) activeSession.value.player = {};
    activeSession.value.player.answers = answers;
  }
}

// Hint Handler
async function handleUseHint() {
  if (!activeSession.value || usingHint.value) return;
  usingHint.value = true;
  try {
    const res = await useHint(activeSession.value.sessionId);
    if (res?.success && res.result) {
      activeSession.value.hintsUsed = res.result.hintsUsed;
      activeSession.value.hintsRemaining = res.result.hintsRemaining;
      activeSession.value.player = res.result.player;
    }
  } catch (err) {
    console.error('Hint error:', err);
  } finally {
    usingHint.value = false;
  }
}

// Check Progress (Non-finalizing)
async function handleCheckProgress() {
  if (!activeSession.value || checkingProgress.value) return;
  checkingProgress.value = true;
  try {
    const payload: any = {
      sessionId: activeSession.value.sessionId,
      finalize: false,
    };
    if (activeSession.value.player?.grid) payload.grid = activeSession.value.player.grid;
    if (activeSession.value.player?.found) payload.found = activeSession.value.player.found;
    if (activeSession.value.player?.answers) payload.answers = activeSession.value.player.answers;

    const res = await submitSession(payload);
    if (res?.success && res.result) {
      activeSession.value.mistakes = res.result.mistakes || 0;
      checkResults.value = res.result.check;
    }
  } catch (err) {
    console.error('Check error:', err);
  } finally {
    checkingProgress.value = false;
  }
}

// Submit Puzzle (Finalizing)
async function handleSubmitPuzzle() {
  if (!activeSession.value || submittingPuzzle.value) return;
  submittingPuzzle.value = true;
  stopTimer();
  try {
    const payload: any = {
      sessionId: activeSession.value.sessionId,
      finalize: true,
    };
    if (activeSession.value.player?.grid) payload.grid = activeSession.value.player.grid;
    if (activeSession.value.player?.found) payload.found = activeSession.value.player.found;
    if (activeSession.value.player?.answers) payload.answers = activeSession.value.player.answers;

    const res = await submitSession(payload);
    if (res?.success && res.result) {
      activeSession.value.isComplete = true;
      lastResultReward.value = res.result.reward;
      lastResultPoints.value = res.result.totalPoints || res.result.reward?.pointsEarned || 0;
      lastResultSolved.value = res.result.correct === res.result.total;
      dailyClaimed.value = false;
      showResultModal.value = true;

      // Refresh stats & leaderboard
      await refreshStatsAndHistory();
    }
  } catch (err) {
    console.error('Submit error:', err);
  } finally {
    submittingPuzzle.value = false;
  }
}

// Save & Exit
async function handleSaveAndExit() {
  if (!activeSession.value) return;
  stopTimer();
  try {
    await saveProgress(activeSession.value.sessionId, {
      player: activeSession.value.player,
    });
  } catch (err) {
    console.error('Save error:', err);
  } finally {
    isPlaying.value = false;
  }
}

// Abandon Puzzle
async function handleAbandonPuzzle() {
  if (!activeSession.value) return;
  stopTimer();
  try {
    await deleteSession(activeSession.value.sessionId);
    activeSession.value = null;
    isPlaying.value = false;
  } catch (err) {
    console.error('Abandon error:', err);
  }
}

// Claim Daily Bonus
async function handleClaimDailyBonus() {
  if (!activeSession.value || claimingDaily.value) return;
  claimingDaily.value = true;
  try {
    const res = await completeDaily(activeSession.value.sessionId);
    if (res?.success) {
      dailyClaimed.value = true;
      const dBoard = await getDailyBoard();
      if (dBoard) dailyBoard.value = dBoard;
      await refreshStatsAndHistory();
    }
  } catch (err) {
    console.error('Claim daily error:', err);
  } finally {
    claimingDaily.value = false;
  }
}

// Filter Leaderboard
async function handleFilterChange(filter: { period: string; gameType: string }) {
  try {
    const res = await getLeaderboard(filter.gameType, filter.period);
    if (res?.data) globalLeaderboardData.value = res.data;
  } catch (err) {
    console.error('Leaderboard filter error:', err);
  }
}

// Multiplayer Actions
function openMultiplayerWith(userId: string) {
  selectedDuelOpponent.value = userId;
  showMultiplayerModal.value = true;
}

async function handleCreateChallenge(payload: { opponentId: string; gameType: GameType; difficulty: Difficulty }) {
  try {
    const res = await createChallenge(payload.opponentId, payload.gameType, payload.difficulty);
    if (res?.success) {
      const chals = await listChallenges();
      if (chals?.data) challengesList.value = chals.data;
    }
  } catch (err) {
    console.error('Create challenge error:', err);
  }
}

async function handleAcceptChallenge(challengeId: string) {
  try {
    const res = await acceptChallenge(challengeId);
    if (res?.success && res.result) {
      activeSession.value = res.result;
      isPlaying.value = true;
      showMultiplayerModal.value = false;
      startTimer(0);
    }
  } catch (err) {
    console.error('Accept challenge error:', err);
  }
}

async function handleDeclineChallenge(challengeId: string) {
  try {
    await declineChallenge(challengeId);
    const chals = await listChallenges();
    if (chals?.data) challengesList.value = chals.data;
  } catch (err) {
    console.error('Decline challenge error:', err);
  }
}

// Check Achievements
async function handleCheckAchievements() {
  checkingBadges.value = true;
  try {
    await checkAchievements();
    const achRes = await getAchievements();
    if (achRes?.data) {
      achievementsList.value = achRes.data;
      unlockedBadgesCount.value = achRes.unlockedCount || 0;
    }
    await refreshStatsAndHistory();
  } catch (err) {
    console.error('Check achievements error:', err);
  } finally {
    checkingBadges.value = false;
  }
}

// Reset User Progress
async function handleResetUserProgress() {
  try {
    await resetProgress();
    await loadInitialData();
  } catch (err) {
    console.error('Reset error:', err);
  }
}

async function refreshStatsAndHistory() {
  const stats = await getUserStats();
  if (stats) userStats.value = stats;

  const hist = await getGameHistory();
  if (hist?.data) gameHistory.value = hist.data;

  const gBoard = await getLeaderboard();
  if (gBoard?.data) globalLeaderboardData.value = gBoard.data;

  const dLead = await getDailyLeaderboard();
  if (dLead?.data) dailyLeaderboardData.value = dLead.data;
}

onMounted(() => {
  loadInitialData();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>
