<template>
  <div class="min-h-screen bg-gray-50/60 pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p class="text-sm text-gray-500">Graphic NewsPlus · Puzzles</p>
            <h1 class="text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">The puzzle page</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Crosswords, sudoku, word searches and riddles &mdash; all built from stories we&rsquo;ve
              published. Solve today&rsquo;s set, keep your streak going, and see where you land on the table.
            </p>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <p><span class="font-semibold text-gray-900">{{ userStats?.totalPoints || 0 }}</span> points</p>
            <p><span class="font-semibold text-gray-900">#{{ userStats?.rank || '—' }}</span> on the all-time table</p>
            <p><span class="font-semibold text-gray-900">{{ userStats?.currentStreak || 0 }} days</span> in a row</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active In-Progress Puzzle Banner (if not actively in play arena) -->
    <div
      v-if="activeSession && !isPlaying"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-6 pt-6"
    >
      <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p class="text-xs text-gray-500">Puzzle in progress</p>
          <h2 class="text-base font-semibold text-gray-900 mt-0.5">
            {{ activeSession.summary || 'Unfinished puzzle session' }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            {{ activeSession.difficulty }} · {{ activeSession.mistakes }} {{ activeSession.mistakes === 1 ? 'mistake' : 'mistakes' }} · {{ activeSession.hintsRemaining }} hints left
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="resumePuzzle"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Resume
          </button>
          <button
            @click="handleAbandonPuzzle"
            class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
          >
            Abandon
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
        <nav aria-label="Game Sections" class="flex items-center gap-6 overflow-x-auto border-b border-gray-200 mb-8">
          <button
            v-for="tab in navTabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="currentTab === tab.id ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'"
            class="pt-1 pb-2.5 text-sm border-b-2 -mb-px whitespace-nowrap cursor-pointer"
          >
            {{ tab.label }}
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
            <div class="mb-5">
              <h2 class="text-xl font-semibold text-gray-900">Pick a puzzle</h2>
              <p class="text-sm text-gray-500 mt-1">Each one is built from a real edition — the board names the page it came from.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                v-for="cat in playableCategories"
                :key="cat.gameType"
                class="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-5 flex flex-col justify-between group transition-colors"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-base text-gray-900">{{ cat.title }}</h3>
                    <span class="text-xs text-gray-500">{{ cat.basePoints }} points</span>
                  </div>

                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ cat.description }}
                  </p>

                  <p class="text-xs text-gray-400 leading-relaxed mt-2">
                    {{ cat.content }}
                  </p>
                </div>

                <button
                  @click="openGameLauncher(cat.gameType)"
                  class="mt-5 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Play {{ cat.title }}
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
          <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Duels</h2>
                <p class="text-sm text-gray-500 mt-1">
                  Challenge another reader to the same puzzle. Best score wins.
                </p>
              </div>

              <button
                @click="showMultiplayerModal = true"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
              >
                Challenge someone
              </button>
            </div>

            <!-- List of Challenges -->
            <div class="divide-y divide-gray-100">
              <div
                v-for="c in challengesList"
                :key="c.challengeId"
                class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ c.challengerName }} vs {{ c.opponentName }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatGameType(c.gameType) }} · {{ c.difficulty }} · {{ c.summary }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ c.publication?.publicationName }}<template v-if="c.publication?.pageNumber"> · p.{{ c.publication?.pageNumber }}</template>
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <template v-if="!c.youAreChallenger && c.status === 'active'">
                    <button
                      @click="handleAcceptChallenge(c.challengeId)"
                      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      @click="handleDeclineChallenge(c.challengeId)"
                      class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </template>

                  <template v-else-if="c.youAreChallenger && c.status === 'active'">
                    <span class="text-sm text-gray-500">
                      Waiting on {{ c.opponentName.split(' ')[0] }}
                    </span>
                  </template>

                  <template v-else>
                    <span class="text-sm text-gray-500">
                      {{ c.status }}
                    </span>
                  </template>
                </div>
              </div>

              <div v-if="!challengesList.length" class="py-12 text-center text-sm text-gray-500">
                No duels yet. Challenge a reader from the leaderboard to get one going.
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
        <section v-else-if="currentTab === 'rules'" class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 animate-fade-in">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">How scoring works</h2>
            <p class="text-sm text-gray-500 mt-1">
              Points reward accuracy first, then speed and staying power. A rough run can still score well; a fast wrong one won&rsquo;t.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Difficulty</h3>
              <ul class="text-sm text-gray-600 space-y-1.5">
                <li>Easy &mdash; 1&times; multiplier, 5 hints</li>
                <li>Medium &mdash; 2&times; multiplier, 3 hints</li>
                <li>Hard &mdash; 3&times; multiplier, 2 hints</li>
                <li>Expert &mdash; 4&times; multiplier, 1 hint</li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Bonuses</h3>
              <ul class="text-sm text-gray-600 space-y-1.5">
                <li>Perfect solve &mdash; up to 100 pts &times; multiplier</li>
                <li>Daily challenge &mdash; +200 pts</li>
                <li>Speed &mdash; up to 50% extra under the target time</li>
                <li>Streak &mdash; +10 pts per consecutive day</li>
                <li>Winning a duel &mdash; +25 pts</li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Penalties</h3>
              <ul class="text-sm text-gray-600 space-y-1.5">
                <li>Wrong cell or answer &mdash; &minus;3 pts each</li>
                <li>Revealed hint &mdash; &minus;5 pts each</li>
                <li>Scores never drop below zero.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- GAME LAUNCHER MODAL (Configurator for Difficulty & Publication Source) -->
    <div v-if="showLauncherModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 overflow-y-auto">
      <div class="relative bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8">
        <button
          @click="showLauncherModal = false"
          class="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <h2 class="text-xl font-semibold text-gray-900">Play {{ formatGameType(launcherGameType) }}</h2>
        <p class="text-sm text-gray-500 mt-1 mb-6">Pick a difficulty and the edition to build the puzzle from.</p>

        <div class="space-y-5">
          <!-- Difficulty Choice -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">
              Difficulty
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="d in difficulties"
                :key="d"
                @click="launcherDifficulty = d"
                :class="launcherDifficulty === d ? 'border-primary-600 text-primary-700 bg-primary-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                class="py-2 px-2 rounded-lg border text-sm capitalize transition-colors text-center"
              >
                {{ d }}
              </button>
            </div>
          </div>

          <!-- Publication Source Choice -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">
              Edition
            </label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <button
                v-for="source in publicationSources"
                :key="source.publicationId"
                @click="launcherPublicationId = source.publicationId"
                :class="launcherPublicationId === source.publicationId ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
                class="w-full p-3 rounded-lg border text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div class="font-medium text-gray-900 text-sm">{{ source.publicationName }}</div>
                  <div class="text-xs text-gray-500">{{ source.newspaperTitle }}</div>
                </div>
                <Check v-if="launcherPublicationId === source.publicationId" class="w-4 h-4 text-primary-600" />
              </button>
            </div>
          </div>

          <!-- Start Button -->
          <button
            @click="handleStartGame"
            :disabled="startingGame"
            class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-40"
          >
            {{ startingGame ? 'Preparing your puzzle…' : 'Start game' }}
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
  X,
  Check
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
  { id: 'catalog', label: 'Puzzles' },
  { id: 'daily', label: 'Daily challenge' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'challenges', label: 'Duels' },
  { id: 'achievements', label: 'Your stats' },
  { id: 'rules', label: 'Scoring' },
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
    description: 'Fill the grid with the nine letters of a word from the paper — one letter per row, column and box.',
    content: 'The letters and the quote on the board come from the edition the puzzle was built from.'
  },
  {
    gameType: 'word_search',
    title: 'Word Search',
    isActive: true,
    basePoints: 50,
    gameTypeCode: 2,
    description: 'Find the hidden words in the grid. They run across, down and diagonally — some even backwards.',
    content: 'Every word is lifted from the same day’s stories, with a clue to help you along.'
  },
  {
    gameType: 'crossword',
    title: 'Crossword',
    isActive: true,
    basePoints: 70,
    gameTypeCode: 3,
    description: 'Classic clues written from sentences that appeared in the paper that week.',
    content: 'Each clue names the page it came from — the answers are all words we published.'
  },
  {
    gameType: 'riddle',
    title: 'Newsroom Riddles',
    isActive: true,
    basePoints: 40,
    gameTypeCode: 4,
    description: 'Fill in the blank from a real sentence, or unscramble the letters of a newsroom word.',
    content: 'Each question quotes the newspaper and page it was taken from.'
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

function formatGameType(type: string) {
  const map: Record<string, string> = {
    sudoku: 'Letter Sudoku',
    word_search: 'Word Search',
    crossword: 'Crossword',
    riddle: 'Newsroom Riddles',
    daily: 'Daily Challenge',
  };
  return map[type] || type;
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
