import type {
  BaseApiResponse,
  BasePaginationModel,
  CategoriesResponse,
  PublicationSourcesResponse,
  GameStatistics,
  GameSession,
  StartOptions,
  SubmitSessionPayload,
  SubmitSessionResponse,
  HintResponse,
  DailyBoard,
  DailyCompletionResult,
  GameAchievement,
  UserGameStats,
  LeaderboardResponse,
  DailyLeaderboardResponse,
  ChallengeItem,
  RivalsResponse,
  GameType,
  Difficulty
} from '~/models';

// ---------------------------------------------------------------------------
// Games service — currently backed by the mock API in mocks/games/index.js
// (plain JS objects & functions used as the backend blueprint). Each function
// below documents the endpoint it will call at cutover; swapping the mock call
// for `httpClient(...)` / `gnpUserHttpClient(...)` requires no page changes.
// ---------------------------------------------------------------------------

import {
  mockGetCategories,
  mockGetPublicationSources,
  mockGetStatistics,
  mockGetLeaderboard,
  mockGetDailyLeaderboard,
  mockGetAchievements,
  mockStartGame,
  mockStartDaily,
  mockGetCurrentSession,
  mockGetSession,
  mockSaveProgress,
  mockSubmitSession,
  mockUseHint,
  mockDeleteSession,
  mockGetGameHistory,
  mockGetUserStats,
  mockGetUserPoints,
  mockCheckAchievements,
  mockGetRivals,
  mockCreateChallenge,
  mockAcceptChallenge,
  mockDeclineChallenge,
  mockListChallenges,
  mockSubmitMultiplayer,
  mockGetDailyBoard,
  mockCompleteDaily,
  mockResetProgress,
} from '~/mocks/games/index.js';

/** GET /api/v1/games/categories */
export async function getGameCategories() {
  const response = mockGetCategories() as unknown as BaseApiResponse<CategoriesResponse>;
  return response.result;
}

/** GET /api/v1/games/publication-sources?publicationId= */
export async function getPublicationSources(publicationId?: string) {
  const response = mockGetPublicationSources(publicationId) as unknown as BaseApiResponse<PublicationSourcesResponse>;
  return response.result;
}

/** GET /api/v1/games/statistics?gameType= */
export async function getGameStatistics(gameType: GameType) {
  const response = mockGetStatistics(gameType) as unknown as BaseApiResponse<GameStatistics>;
  return response.result;
}

/** GET /api/v1/games/leaderboard?gameType=&period=&pageNo=&pageSize= */
export async function getLeaderboard(gameType?: string, period?: string, pageNo: number = 1, pageSize: number = 20) {
  const response = mockGetLeaderboard(gameType, period, pageNo, pageSize) as unknown as BaseApiResponse<LeaderboardResponse>;
  return response.result;
}

/** GET /api/v1/games/daily-leaderboard?pageNo=&pageSize= */
export async function getDailyLeaderboard(pageNo: number = 1, pageSize: number = 20) {
  const response = mockGetDailyLeaderboard(pageNo, pageSize) as unknown as BaseApiResponse<DailyLeaderboardResponse>;
  return response.result;
}

/** GET /api/v1/games/achievements */
export async function getAchievements() {
  const response = mockGetAchievements() as unknown as BaseApiResponse<{ data: GameAchievement[]; unlockedCount: number }>;
  return response.result;
}

/**
 * User Authenticated Gameplay Endpoints
 */

/** POST /api/v1/games/start */
export async function startGame(options: StartOptions) {
  const response = mockStartGame(options) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/generate-sudoku */
export async function generateSudoku(options?: Partial<StartOptions>) {
  const response = mockStartGame({ ...options, gameType: 'sudoku' }) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/generate-word-search */
export async function generateWordSearch(options?: Partial<StartOptions>) {
  const response = mockStartGame({ ...options, gameType: 'word_search' }) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/generate-crossword */
export async function generateCrossword(options?: Partial<StartOptions>) {
  const response = mockStartGame({ ...options, gameType: 'crossword' }) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/generate-riddle */
export async function generateRiddle(options?: Partial<StartOptions>) {
  const response = mockStartGame({ ...options, gameType: 'riddle' }) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** GET /api/v1/games/current-session */
export async function getCurrentSession() {
  try {
    const response = mockGetCurrentSession() as unknown as BaseApiResponse<GameSession>;
    return response.success ? response.result : null;
  } catch {
    return null;
  }
}

/** GET /api/v1/games/session?sessionId= */
export async function getSession(sessionId: string) {
  const response = mockGetSession(sessionId) as unknown as BaseApiResponse<GameSession>;
  return response.result;
}

/** POST /api/v1/games/save-progress */
export async function saveProgress(sessionId: string, progress: { grid?: any; found?: any; answers?: any; player?: any }) {
  const response = mockSaveProgress(sessionId, progress) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/submit */
export async function submitSession(payload: SubmitSessionPayload) {
  const response = mockSubmitSession(payload) as unknown as BaseApiResponse<SubmitSessionResponse>;
  return response;
}

/** POST /api/v1/games/hint */
export async function useHint(sessionId: string) {
  const response = mockUseHint(sessionId) as unknown as BaseApiResponse<HintResponse>;
  return response;
}

/** DELETE /api/v1/games/session?sessionId= */
export async function deleteSession(sessionId: string) {
  const response = mockDeleteSession(sessionId) as unknown as BaseApiResponse<any>;
  return response;
}

/** GET /api/v1/games/history?pageNo=&pageSize= */
export async function getGameHistory(pageNo: number = 1, pageSize: number = 10) {
  const response = mockGetGameHistory(pageNo, pageSize) as unknown as BaseApiResponse<BasePaginationModel<GameSession[]>>;
  return response.result;
}

/** GET /api/v1/games/stats?userId= */
export async function getUserStats(userId?: string) {
  const response = mockGetUserStats() as unknown as BaseApiResponse<UserGameStats>;
  return response.result;
}

/** GET /api/v1/games/points */
export async function getUserPoints() {
  const response = mockGetUserPoints() as unknown as BaseApiResponse<{ userId: string; totalPoints: number; rank: number }>;
  return response.result;
}

/** GET /api/v1/games/my-achievements */
export async function getMyAchievements() {
  const response = mockGetAchievements() as unknown as BaseApiResponse<{ data: GameAchievement[]; unlockedCount: number }>;
  return response.result;
}

/** POST /api/v1/games/check-achievements */
export async function checkAchievements() {
  const response = mockCheckAchievements() as unknown as BaseApiResponse<{ count: number; achievements: string[] }>;
  return response;
}

/** GET /api/v1/games/rivals?limit= */
export async function getRivals(limit: number = 20) {
  const response = mockGetRivals(limit) as unknown as BaseApiResponse<RivalsResponse>;
  return response.result;
}

/** POST /api/v1/games/challenge */
export async function createChallenge(opponentId: string, gameType: GameType, difficulty: Difficulty = 'medium') {
  const response = mockCreateChallenge(opponentId, gameType, difficulty) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/accept-challenge */
export async function acceptChallenge(challengeId: string) {
  const response = mockAcceptChallenge(challengeId) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/decline-challenge */
export async function declineChallenge(challengeId: string) {
  const response = mockDeclineChallenge(challengeId) as unknown as BaseApiResponse<any>;
  return response;
}

/** GET /api/v1/games/challenges */
export async function listChallenges() {
  const response = mockListChallenges() as unknown as BaseApiResponse<{ data: ChallengeItem[] }>;
  return response.result;
}

/** POST /api/v1/games/submit-multiplayer */
export async function submitMultiplayer(sessionId: string) {
  const response = mockSubmitMultiplayer(sessionId) as unknown as BaseApiResponse<any>;
  return response;
}

/** GET /api/v1/games/daily */
export async function getDailyBoard() {
  const response = mockGetDailyBoard() as unknown as BaseApiResponse<DailyBoard>;
  return response.result;
}

/** POST /api/v1/games/start-daily */
export async function startDaily(challengeId?: string, gameType?: GameType) {
  const response = mockStartDaily(challengeId, gameType) as unknown as BaseApiResponse<GameSession>;
  return response;
}

/** POST /api/v1/games/complete-daily */
export async function completeDaily(sessionId: string) {
  const response = mockCompleteDaily(sessionId) as unknown as BaseApiResponse<DailyCompletionResult>;
  return response;
}

/** POST /api/v1/games/reset-progress */
export async function resetProgress() {
  const response = mockResetProgress() as unknown as BaseApiResponse<any>;
  return response;
}
