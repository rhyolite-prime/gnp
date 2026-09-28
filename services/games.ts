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

/**
 * Public endpoints - no auth required (or optional auth to attach user focus)
 */
export async function getGameCategories() {
  const response = await httpClient<BaseApiResponse<CategoriesResponse>>('games/categories', '');
  return response.result;
}

export async function getPublicationSources(publicationId?: string) {
  const query = publicationId ? { publicationId } : undefined;
  const response = await httpClient<BaseApiResponse<PublicationSourcesResponse>>('games/publication-sources', '', { query });
  return response.result;
}

export async function getGameStatistics(gameType: GameType) {
  const response = await httpClient<BaseApiResponse<GameStatistics>>('games/statistics', '', { query: { gameType } });
  return response.result;
}

export async function getLeaderboard(gameType?: string, period?: string, pageNo: number = 1, pageSize: number = 20) {
  const query: Record<string, any> = { pageNo, pageSize };
  if (gameType && gameType !== 'all') query.gameType = gameType;
  if (period && period !== 'all') query.period = period;

  const response = await gnpUserHttpClient<BaseApiResponse<LeaderboardResponse>>('games/leaderboard', '', { query });
  return response.result;
}

export async function getDailyLeaderboard(pageNo: number = 1, pageSize: number = 20) {
  const response = await httpClient<BaseApiResponse<DailyLeaderboardResponse>>('games/daily-leaderboard', '', {
    query: { pageNo, pageSize }
  });
  return response.result;
}

export async function getAchievements() {
  const response = await gnpUserHttpClient<BaseApiResponse<{ data: GameAchievement[]; unlockedCount: number }>>('games/achievements', '');
  return response.result;
}

/**
 * User Authenticated Gameplay Endpoints
 */
export async function startGame(options: StartOptions) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/start', '', {
    method: 'post',
    body: options
  });
  return response;
}

export async function generateSudoku(options?: Partial<StartOptions>) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/generate-sudoku', '', {
    method: 'post',
    body: { ...options, gameType: 'sudoku' }
  });
  return response;
}

export async function generateWordSearch(options?: Partial<StartOptions>) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/generate-word-search', '', {
    method: 'post',
    body: { ...options, gameType: 'word_search' }
  });
  return response;
}

export async function generateCrossword(options?: Partial<StartOptions>) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/generate-crossword', '', {
    method: 'post',
    body: { ...options, gameType: 'crossword' }
  });
  return response;
}

export async function generateRiddle(options?: Partial<StartOptions>) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/generate-riddle', '', {
    method: 'post',
    body: { ...options, gameType: 'riddle' }
  });
  return response;
}

export async function getCurrentSession() {
  try {
    const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/current-session', '');
    return response.success ? response.result : null;
  } catch {
    return null;
  }
}

export async function getSession(sessionId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/session', '', {
    query: { sessionId }
  });
  return response.result;
}

export async function saveProgress(sessionId: string, progress: { grid?: any; found?: any; answers?: any; player?: any }) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/save-progress', '', {
    method: 'post',
    body: { sessionId, ...progress }
  });
  return response;
}

export async function submitSession(payload: SubmitSessionPayload) {
  const response = await gnpUserHttpClient<BaseApiResponse<SubmitSessionResponse>>('games/submit', '', {
    method: 'post',
    body: payload
  });
  return response;
}

export async function useHint(sessionId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<HintResponse>>('games/hint', '', {
    method: 'post',
    body: { sessionId }
  });
  return response;
}

export async function deleteSession(sessionId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<any>>('games/session', '', {
    method: 'delete',
    query: { sessionId }
  });
  return response;
}

export async function getGameHistory(pageNo: number = 1, pageSize: number = 10) {
  const response = await gnpUserHttpClient<BaseApiResponse<BasePaginationModel<GameSession[]>>>('games/history', '', {
    query: { pageNo, pageSize }
  });
  return response.result;
}

export async function getUserStats(userId?: string) {
  const query = userId ? { userId } : undefined;
  const response = await gnpUserHttpClient<BaseApiResponse<UserGameStats>>('games/stats', '', { query });
  return response.result;
}

export async function getUserPoints() {
  const response = await gnpUserHttpClient<BaseApiResponse<{ userId: string; totalPoints: number; rank: number }>>('games/points', '');
  return response.result;
}

export async function getMyAchievements() {
  const response = await gnpUserHttpClient<BaseApiResponse<{ data: GameAchievement[]; unlockedCount: number }>>('games/my-achievements', '');
  return response.result;
}

export async function checkAchievements() {
  const response = await gnpUserHttpClient<BaseApiResponse<{ count: number; achievements: string[] }>>('games/check-achievements', '', {
    method: 'post'
  });
  return response;
}

export async function getRivals(limit: number = 20) {
  const response = await gnpUserHttpClient<BaseApiResponse<RivalsResponse>>('games/rivals', '', {
    query: { limit }
  });
  return response.result;
}

export async function createChallenge(opponentId: string, gameType: GameType, difficulty: Difficulty = 'medium') {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/challenge', '', {
    method: 'post',
    body: { opponentId, gameType, difficulty }
  });
  return response;
}

export async function acceptChallenge(challengeId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/accept-challenge', '', {
    method: 'post',
    body: { challengeId }
  });
  return response;
}

export async function declineChallenge(challengeId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<any>>('games/decline-challenge', '', {
    method: 'post',
    body: { challengeId }
  });
  return response;
}

export async function listChallenges() {
  const response = await gnpUserHttpClient<BaseApiResponse<{ data: ChallengeItem[] }>>('games/challenges', '');
  return response.result;
}

export async function submitMultiplayer(sessionId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<any>>('games/submit-multiplayer', '', {
    method: 'post',
    body: { sessionId }
  });
  return response;
}

export async function getDailyBoard() {
  const response = await gnpUserHttpClient<BaseApiResponse<DailyBoard>>('games/daily', '');
  return response.result;
}

export async function startDaily(challengeId?: string, gameType?: GameType) {
  const response = await gnpUserHttpClient<BaseApiResponse<GameSession>>('games/start-daily', '', {
    method: 'post',
    body: { challengeId, gameType }
  });
  return response;
}

export async function completeDaily(sessionId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<DailyCompletionResult>>('games/complete-daily', '', {
    method: 'post',
    body: { sessionId }
  });
  return response;
}

export async function resetProgress() {
  const response = await gnpUserHttpClient<BaseApiResponse<any>>('games/reset-progress', '', {
    method: 'post'
  });
  return response;
}
