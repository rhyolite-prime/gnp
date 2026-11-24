// Games module — mock API state machine (plain JS objects & functions).
//
// This file is the backend blueprint for the Games module. Every function below
// maps 1:1 to an HTTP endpoint; the returned envelopes mirror the standard
// Graphic NewsPlus API envelope (BaseApiResponse). Swap each mock call in
// services/games.ts for a real HTTP call and nothing else changes.
//
// Endpoint contract:
//   GET    /api/v1/games/categories
//   GET    /api/v1/games/publication-sources?publicationId=
//   GET    /api/v1/games/statistics?gameType=
//   GET    /api/v1/games/leaderboard?gameType=&period=&pageNo=&pageSize=
//   GET    /api/v1/games/daily-leaderboard?pageNo=&pageSize=
//   GET    /api/v1/games/achievements
//   POST   /api/v1/games/start               { gameType, difficulty, publicationId, opponentId?, isMultiplayer?, challengeId? }
//   POST   /api/v1/games/generate-sudoku     { difficulty, publicationId }  (alias of start with fixed gameType)
//   POST   /api/v1/games/generate-word-search
//   POST   /api/v1/games/generate-crossword
//   POST   /api/v1/games/generate-riddle
//   GET    /api/v1/games/current-session
//   GET    /api/v1/games/session?sessionId=
//   POST   /api/v1/games/save-progress       { sessionId, player }
//   POST   /api/v1/games/submit              { sessionId, finalize, grid?|found?|answers? }
//   POST   /api/v1/games/hint                { sessionId }
//   DELETE /api/v1/games/session?sessionId=
//   GET    /api/v1/games/history?pageNo=&pageSize=
//   GET    /api/v1/games/stats?userId=
//   GET    /api/v1/games/points
//   GET    /api/v1/games/my-achievements
//   POST   /api/v1/games/check-achievements
//   GET    /api/v1/games/rivals?limit=
//   POST   /api/v1/games/challenge           { opponentId, gameType, difficulty }
//   POST   /api/v1/games/accept-challenge    { challengeId }
//   POST   /api/v1/games/decline-challenge   { challengeId }
//   GET    /api/v1/games/challenges
//   POST   /api/v1/games/submit-multiplayer  { sessionId }
//   GET    /api/v1/games/daily
//   POST   /api/v1/games/start-daily         { challengeId, gameType }
//   POST   /api/v1/games/complete-daily      { sessionId }
//   POST   /api/v1/games/reset-progress
//
// Data tables the API should model:
//   puzzles (per game type, with server-only solution), game_sessions,
//   session_progress (player state), daily_challenges, achievements,
//   user_game_stats, leaderboard_snapshots, duel_challenges.

import { PUBLICATION_SOURCES, PUZZLE_BANK } from './puzzleBank.js';

// ---------------------------------------------------------------- constants

const ME = { userId: 'u-100', username: 'Ama Mensah' };

export const SCORING_RULES = {
  mistakePenalty: 3,
  hintPenalty: 5,
  perfectBonus: 100,
  dailyChallengeBonus: 200,
  streakBonusPerDay: 10,
  maxStreakDays: 30,
  rivalryBonus: 25,
  achievementBonus: 50,
  partialDailyThresholdPercent: 50,
  difficultyMultipliers: { easy: 1, medium: 2, hard: 3, expert: 4 },
  notes: 'Base points x difficulty multiplier x accuracy, plus time and streak bonuses, minus mistake and hint penalties. Scores never drop below zero.',
};

const HINTS_CAP = { easy: 5, medium: 3, hard: 2, expert: 1 };

const CATEGORIES = [
  {
    gameType: 'sudoku',
    title: 'Letter Sudoku',
    isActive: true,
    basePoints: 60,
    gameTypeCode: 1,
    description: 'Fill the grid with the nine letters of a word from the paper — one letter per row, column and box.',
    content: 'The letters and the quote on the board come from the edition the puzzle was built from.',
  },
  {
    gameType: 'word_search',
    title: 'Word Search',
    isActive: true,
    basePoints: 50,
    gameTypeCode: 2,
    description: 'Find the hidden words in the grid. They run across, down and diagonally — some even backwards.',
    content: 'Every word is lifted from the same day’s stories, with a clue to help you along.',
  },
  {
    gameType: 'crossword',
    title: 'Crossword',
    isActive: true,
    basePoints: 70,
    gameTypeCode: 3,
    description: 'Classic clues written from sentences that appeared in the paper that week.',
    content: 'Each clue names the page it came from — the answers are all words we published.',
  },
  {
    gameType: 'riddle',
    title: 'Newsroom Riddles',
    isActive: true,
    basePoints: 40,
    gameTypeCode: 4,
    description: 'Fill in the blank from a real sentence, or unscramble the letters of a newsroom word.',
    content: 'Each question quotes the newspaper and page it was taken from.',
  },
];

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

const GAME_TYPE_CODE = { sudoku: 1, word_search: 2, crossword: 3, riddle: 4 };

// ---------------------------------------------------------------- helpers

function ok(result, message = 'ok') {
  return { success: true, message, unAuthorizedRequest: false, error: null, result };
}

function fail(message, code = 400) {
  return { success: false, message, unAuthorizedRequest: false, error: { code, details: false }, result: null };
}

function clampPage(pageNo, pageSize, total) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, pageNo), pages);
  return {
    pageNo: page,
    totalCount: total,
    totalPages: pages,
    lowerBound: total === 0 ? 0 : (page - 1) * pageSize + 1,
    upperBound: Math.min(total, page * pageSize),
  };
}

function pickPuzzle(gameType, difficulty, publicationId) {
  const bank = PUZZLE_BANK[gameType] || [];
  if (!bank.length) return null;
  let puzzle = bank.find((p) => p.difficulty === difficulty);
  if (!puzzle) puzzle = bank[0];
  if (publicationId) {
    const fromPub = bank.find((p) => p.difficulty === difficulty && p.source && p.source.publicationId === publicationId);
    puzzle = fromPub || puzzle;
  }
  return puzzle;
}

// Client payload = puzzle minus the server-only `solution`.
function clientPuzzle(puzzle) {
  const { solution, ...rest } = puzzle;
  return JSON.parse(JSON.stringify(rest));
}

function freshPlayer(puzzle) {
  if (puzzle.gameType === 'sudoku' || puzzle.gameType === 'crossword') {
    return { grid: puzzle.grid.map((row) => [...row]), reveals: [] };
  }
  if (puzzle.gameType === 'word_search') return { found: [], reveals: [] };
  return { answers: [], reveals: [] };
}

function uniqueSources(puzzle) {
  const byId = {};
  const add = (s) => {
    if (s && s.newspaperId) byId[s.newspaperId] = s;
  };
  add(puzzle.source);
  (puzzle.words || []).forEach((w) => add(w.source));
  (puzzle.items || []).forEach((i) => add(i.source));
  (puzzle.clues ? [...puzzle.clues.across, ...puzzle.clues.down] : []).forEach((c) => add(c.source));
  return Object.values(byId);
}

function targetSeconds(gameType, difficulty) {
  const base = { crossword: 600, sudoku: 540, word_search: 360, riddle: 300 }[gameType] || 480;
  if (difficulty === 'easy') return base + 180;
  if (difficulty === 'hard') return Math.max(120, base - 120);
  if (difficulty === 'expert') return Math.max(90, base - 200);
  return base;
}

// ---------------------------------------------------------------- state

const state = {
  sessionSeq: 100,
  sessions: {}, // sessionId -> session (with server-only fields kept aside)
  history: [],
  stats: null,
  achievements: [],
  dailyBoard: null,
  challenges: [],
  duelSeq: 10,
  dailyCompletedSessions: {},
};

function seedAchievements() {
  return [
    { id: 'ach-first-solve', name: 'First Solve', description: 'Finish your first puzzle of any kind.', pointsRequired: 0, gamesRequired: 1, gameType: 'any', achievementType: 'milestone', bonusPoints: 25, isUnlocked: true, unlockedAt: '2026-09-14T09:12:00Z' },
    { id: 'ach-week-streak', name: 'Seven Straight Days', description: 'Play every day for a week — the streak is the hard part.', pointsRequired: 0, gamesRequired: 7, gameType: 'any', achievementType: 'streak', bonusPoints: 75, isUnlocked: true, unlockedAt: '2026-10-06T07:40:00Z' },
    { id: 'ach-sudoku-10', name: 'Grid Regular', description: 'Complete 10 Letter Sudokus.', pointsRequired: 0, gamesRequired: 10, gameType: 'sudoku', achievementType: 'volume', bonusPoints: 50, isUnlocked: true, unlockedAt: '2026-10-11T18:05:00Z' },
    { id: 'ach-crossword-perfect', name: 'No Lookers', description: 'Solve a crossword without a single hint or mistake.', pointsRequired: 0, gamesRequired: 1, gameType: 'crossword', achievementType: 'perfect', bonusPoints: 100, isUnlocked: true, unlockedAt: '2026-10-15T12:30:00Z' },
    { id: 'ach-points-2500', name: 'Desk Regular', description: 'Earn 2,500 points across all games.', pointsRequired: 2500, gamesRequired: 0, gameType: 'any', achievementType: 'points', bonusPoints: 100, isUnlocked: true, unlockedAt: '2026-10-19T20:15:00Z' },
    { id: 'ach-daily-5', name: 'Morning Ritual', description: 'Finish 5 daily challenges.', pointsRequired: 0, gamesRequired: 5, gameType: 'daily', achievementType: 'volume', bonusPoints: 60, isUnlocked: true, unlockedAt: '2026-10-20T06:55:00Z' },
    { id: 'ach-words-8', name: 'Sharp Eye', description: 'Find every word in a word search without a hint.', pointsRequired: 0, gamesRequired: 1, gameType: 'word_search', achievementType: 'perfect', bonusPoints: 60, isUnlocked: true, unlockedAt: '2026-10-21T16:20:00Z' },
    { id: 'ach-riddles-20', name: 'Late Wire Mind', description: 'Answer 20 newsroom riddles correctly.', pointsRequired: 0, gamesRequired: 20, gameType: 'riddle', achievementType: 'volume', bonusPoints: 50, isUnlocked: true, unlockedAt: '2026-10-21T22:02:00Z' },
    { id: 'ach-duel-win', name: 'Bragging Rights', description: 'Win your first head-to-head duel.', pointsRequired: 0, gamesRequired: 1, gameType: 'any', achievementType: 'duel', bonusPoints: 80, isUnlocked: true, unlockedAt: '2026-10-22T10:45:00Z' },
    { id: 'ach-speed-demon', name: 'Before Deadline', description: 'Beat the target time on a hard puzzle.', pointsRequired: 0, gamesRequired: 1, gameType: 'any', achievementType: 'speed', bonusPoints: 90, isUnlocked: false },
    { id: 'ach-points-5000', name: 'Editor’s Pick', description: 'Earn 5,000 points across all games.', pointsRequired: 5000, gamesRequired: 0, gameType: 'any', achievementType: 'points', bonusPoints: 150, isUnlocked: false },
    { id: 'ach-30-streak', name: 'A Month of Mornings', description: 'Keep a daily streak going for 30 days.', pointsRequired: 0, gamesRequired: 30, gameType: 'any', achievementType: 'streak', bonusPoints: 200, isUnlocked: false },
  ];
}

function seedStats() {
  return {
    userId: ME.userId,
    username: ME.username,
    totalPoints: 2480,
    gamesPlayed: 47,
    gamesWon: 31,
    gamesLost: 9,
    gamesDraw: 7,
    currentStreak: 5,
    longestStreak: 14,
    winRate: 0.66,
    rank: 6,
    pointsToNextRank: 80,
    byGameType: {
      sudoku: { played: 18, points: 1020 },
      word_search: { played: 11, points: 560 },
      crossword: { played: 12, points: 700 },
      riddle: { played: 6, points: 200 },
    },
    achievements: ['ach-first-solve', 'ach-week-streak', 'ach-sudoku-10', 'ach-crossword-perfect', 'ach-points-2500', 'ach-daily-5', 'ach-words-8', 'ach-riddles-20', 'ach-duel-win'],
  };
}

function seedHistory() {
  const mk = (sessionId, gameType, difficulty, minutesAgo, mistakes, secs, points, publication) => ({
    sessionId,
    userId: ME.userId,
    gameType,
    gameTypeCode: GAME_TYPE_CODE[gameType],
    puzzleId: 'bank',
    difficulty,
    isMultiplayer: false,
    isComplete: true,
    totalPoints: points,
    currentScore: points,
    mistakes,
    hintsUsed: 0,
    hintsRemaining: HINTS_CAP[difficulty],
    completionTimeSeconds: secs,
    summary: 'Completed puzzle',
    daily: false,
    status: 'completed',
    publication,
    sources: [publication],
    startedAt: Date.now() - minutesAgo * 60000,
  });
  const P = PUBLICATION_SOURCES;
  return [
    mk('sess-h1', 'crossword', 'medium', 95, 0, 412, 245, P[0]),
    mk('sess-h2', 'sudoku', 'hard', 320, 2, 655, 190, P[1]),
    mk('sess-h3', 'word_search', 'easy', 1490, 0, 178, 155, P[2]),
    mk('sess-h4', 'riddle', 'easy', 2600, 1, 122, 95, P[0]),
    mk('sess-h5', 'sudoku', 'medium', 4300, 3, 720, 150, P[3]),
    mk('sess-h6', 'crossword', 'hard', 5800, 4, 910, 210, P[1]),
  ];
}

function seedChallenges() {
  return [
    {
      challengeId: 'duel-101',
      gameType: 'crossword',
      difficulty: 'medium',
      status: 'active',
      summary: 'Kojo challenged you to Wednesday’s mini crossword.',
      youAreChallenger: false,
      challengerId: 'u-102',
      opponentId: ME.userId,
      challengerName: 'Kojo Asante',
      opponentName: ME.username,
      publication: PUBLICATION_SOURCES[0],
      startedAt: new Date(Date.now() - 42 * 60000).toISOString(),
    },
    {
      challengeId: 'duel-102',
      gameType: 'word_search',
      difficulty: 'easy',
      status: 'active',
      summary: 'Waiting on Efua to accept your word search duel.',
      youAreChallenger: true,
      challengerId: ME.userId,
      opponentId: 'u-103',
      challengerName: ME.username,
      opponentName: 'Efua Nyarko',
      publication: PUBLICATION_SOURCES[2],
      startedAt: new Date(Date.now() - 130 * 60000).toISOString(),
    },
    {
      challengeId: 'duel-103',
      gameType: 'sudoku',
      difficulty: 'hard',
      status: 'active',
      summary: 'Nii invited you to a hard Letter Sudoku showdown.',
      youAreChallenger: false,
      challengerId: 'u-104',
      opponentId: ME.userId,
      challengerName: 'Nii Lante',
      opponentName: ME.username,
      publication: PUBLICATION_SOURCES[1],
      startedAt: new Date(Date.now() - 260 * 60000).toISOString(),
    },
    {
      challengeId: 'duel-104',
      gameType: 'riddle',
      difficulty: 'medium',
      status: 'completed',
      summary: 'You beat Selorm by 18 points on the riddle set.',
      youAreChallenger: true,
      challengerId: ME.userId,
      opponentId: 'u-105',
      challengerName: ME.username,
      opponentName: 'Selorm Agbeko',
      publication: PUBLICATION_SOURCES[4],
      startedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    },
    {
      challengeId: 'duel-105',
      gameType: 'crossword',
      difficulty: 'hard',
      status: 'declined',
      summary: 'Abena declined the crossword duel — maybe next time.',
      youAreChallenger: true,
      challengerId: ME.userId,
      opponentId: 'u-106',
      challengerName: ME.username,
      opponentName: 'Abena Asare',
      publication: PUBLICATION_SOURCES[3],
      startedAt: new Date(Date.now() - 50 * 3600000).toISOString(),
    },
  ];
}

function seedDailyBoard() {
  const P = PUBLICATION_SOURCES;
  return {
    date: new Date().toISOString().split('T')[0],
    completedCount: 1,
    scoring: SCORING_RULES,
    challenges: [
      { id: 'daily-sudoku', gameType: 'sudoku', difficulty: 'easy', featured: true, bonus: 200, createdAt: '05:30', expiresAt: '23:59', completed: true, bonusEarned: 200, summary: 'Front Desk Sudoku from today’s Daily Graphic', publication: P[0], wordCount: 0, questionCount: 0 },
      { id: 'daily-word-search', gameType: 'word_search', difficulty: 'easy', featured: true, bonus: 200, createdAt: '05:30', expiresAt: '23:59', completed: false, summary: 'Today’s word search: eight words from the morning editions', publication: P[2], wordCount: 8 },
      { id: 'daily-crossword', gameType: 'crossword', difficulty: 'easy', featured: false, bonus: 200, createdAt: '05:30', expiresAt: '23:59', completed: false, summary: 'The Mini — five clues from this week’s pages', publication: P[0], wordCount: 10 },
      { id: 'daily-riddle', gameType: 'riddle', difficulty: 'easy', featured: false, bonus: 200, createdAt: '05:30', expiresAt: '23:59', completed: false, summary: 'Morning desk riddles — blanks and anagrams', publication: P[1], questionCount: 4 },
    ],
  };
}

function seedLeaderboard() {
  const rows = [
    ['u-101', 'Kwame Osei', 3120, 61],
    ['u-102', 'Kojo Asante', 2870, 58],
    ['u-103', 'Efua Nyarko', 2740, 55],
    ['u-104', 'Nii Lante', 2615, 49],
    ['u-105', 'Selorm Agbeko', 2560, 52],
    [ME.userId, ME.username, 2480, 47],
    ['u-106', 'Abena Asare', 2390, 44],
    ['u-107', 'Yaw Ofori', 2285, 46],
    ['u-108', 'Akosua Adjei', 2140, 40],
    ['u-109', 'Kofi Ansah', 2075, 38],
    ['u-110', 'Ama Dzidzor', 1980, 37],
    ['u-111', 'Kwesi Boateng', 1890, 35],
    ['u-112', 'Adjoa Sarpong', 1755, 31],
    ['u-113', 'Mensah Tetteh', 1640, 30],
    ['u-114', 'Gifty Awuah', 1520, 28],
    ['u-115', 'Isaac Oduro', 1410, 26],
    ['u-116', 'Naa Adjeley', 1325, 24],
    ['u-117', 'Fiifi Blankson', 1180, 21],
    ['u-118', 'Elikem Agbo', 940, 17],
    ['u-119', 'Yaw Danquah', 610, 11],
  ];
  return rows.map(([userId, username, totalPoints, gamesPlayed], i) => ({
    userId,
    username,
    totalPoints,
    gamesPlayed,
    rank: i + 1,
  }));
}

// ---------------------------------------------------------------- lifecycle

function newSession({ gameType, difficulty = 'medium', publicationId, opponentId, isMultiplayer, challengeId, daily }) {
  const puzzle = pickPuzzle(gameType, difficulty, publicationId);
  if (!puzzle) return fail('No puzzles available for ' + gameType);
  const usedDifficulty = puzzle.difficulty;
  state.sessionSeq += 1;
  const session = {
    sessionId: 'sess-' + state.sessionSeq,
    userId: ME.userId,
    gameType,
    gameTypeCode: GAME_TYPE_CODE[gameType],
    puzzleId: puzzle.puzzleId,
    difficulty: usedDifficulty,
    isMultiplayer: !!isMultiplayer,
    opponentId,
    isComplete: false,
    totalPoints: 0,
    currentScore: 0,
    mistakes: 0,
    hintsUsed: 0,
    hintsRemaining: HINTS_CAP[usedDifficulty],
    completionTimeSeconds: 0,
    summary: puzzle.summary,
    daily: !!daily,
    challengeId,
    status: 'active',
    publication: puzzle.source,
    sources: uniqueSources(puzzle),
    puzzle: clientPuzzle(puzzle),
    player: freshPlayer(puzzle),
    topicsRelaxed: usedDifficulty !== difficulty,
  };
  state.sessions[session.sessionId] = {
    raw: session,
    solution: puzzle.solution,
    gameType,
    startedAt: Date.now(),
  };
  return ok(rawOut(state.sessions[session.sessionId]));
}

// The session copy sent to the client (no server-only fields).
function rawOut(entry) {
  return JSON.parse(JSON.stringify(entry.raw));
}

function getEntry(sessionId) {
  return state.sessions[sessionId] || null;
}

// ---------------------------------------------------------------- scoring

function grade(entry, playerOverride) {
  const { gameType, solution, raw } = entry;
  const player = playerOverride || raw.player;
  if (gameType === 'sudoku' || gameType === 'crossword') {
    const sol = solution.grid;
    const grid = player.grid || [];
    const given = PUZZLE_BANK[gameType].find((p) => p.puzzleId === raw.puzzleId).given || [];
    const wrongCells = [];
    let correct = 0;
    let total = 0;
    for (let r = 0; r < sol.length; r++) {
      for (let c = 0; c < sol.length; c++) {
        const locked = gameType === 'sudoku' && given[r] && given[r][c];
        if (locked) continue;
        total += 1;
        const v = (grid[r] && grid[r][c]) || '';
        if (!v) continue;
        if (v === sol[r][c]) correct += 1;
        else wrongCells.push({ row: r, col: c });
      }
    }
    return { correct, total, wrongCells, solved: correct === total && wrongCells.length === 0 };
  }
  if (gameType === 'word_search') {
    const wanted = PUZZLE_BANK.word_search.find((p) => p.puzzleId === raw.puzzleId).words.map((w) => w.word.toUpperCase());
    const found = (player.found || []).map((f) => (typeof f === 'string' ? f : f.word)).filter(Boolean).map((w) => w.toUpperCase());
    const correct = wanted.filter((w) => found.includes(w)).length;
    return { correct, total: wanted.length, solved: correct === wanted.length, wrongCells: undefined };
  }
  // riddle
  const answers = solution.answers;
  const givenAnswers = {};
  (player.answers || []).forEach((a) => { if (a && a.id) givenAnswers[a.id] = String(a.value || '').trim().toUpperCase(); });
  let correct = 0;
  answers.forEach((a) => { if (givenAnswers[a.id] === a.answer.toUpperCase()) correct += 1; });
  return { correct, total: answers.length, solved: correct === answers.length, wrongCells: undefined };
}

function computeReward(entry, gradeResult, elapsedSeconds) {
  const { raw } = entry;
  const cat = CATEGORIES.find((c) => c.gameType === raw.gameType);
  const base = cat ? cat.basePoints : 50;
  const mult = SCORING_RULES.difficultyMultipliers[raw.difficulty] || 1;
  const accuracy = gradeResult.total ? gradeResult.correct / gradeResult.total : 0;
  const accuracyPoints = Math.round(base * mult * accuracy);
  const target = targetSeconds(raw.gameType, raw.difficulty);
  const timeBonus = gradeResult.solved && elapsedSeconds < target
    ? Math.round(accuracyPoints * 0.5 * (1 - elapsedSeconds / target))
    : 0;
  const clean = gradeResult.solved && (entry.peakMistakes || raw.mistakes) === 0 && raw.hintsUsed === 0;
  const perfectBonus = clean ? SCORING_RULES.perfectBonus * mult : 0;
  const streakBonus = Math.min(state.stats.currentStreak, SCORING_RULES.maxStreakDays) * SCORING_RULES.streakBonusPerDay;
  const mistakePenalty = (entry.peakMistakes || raw.mistakes) * SCORING_RULES.mistakePenalty;
  const hintPenalty = raw.hintsUsed * SCORING_RULES.hintPenalty;
  const pointsEarned = Math.max(0, accuracyPoints + timeBonus + perfectBonus + streakBonus - mistakePenalty - hintPenalty);
  const rankBefore = state.stats.rank;
  const rankAfter = rankBefore; // adjusted below after points land
  const message = clean
    ? 'Clean solve — not a single mark against it.'
    : gradeResult.solved
      ? 'Solved. A few marks, but the grid is complete.'
      : 'Good run — the rest is still open for a second pass.';
  return {
    pointsEarned,
    bonusPoints: timeBonus + perfectBonus + streakBonus,
    message,
    breakdown: {
      base,
      difficultyMultiplier: mult,
      accuracy: Math.round(accuracy * 100) / 100,
      accuracyPoints,
      timeBonus,
      perfectBonus,
      streakBonus,
      mistakePenalty,
      hintPenalty,
      elapsedSeconds,
    },
    rankBefore,
    rankAfter,
    rankChange: 0,
    newAchievements: [],
  };
}

function applyStats(entry, reward) {
  const s = state.stats;
  s.totalPoints += reward.pointsEarned;
  s.gamesPlayed += 1;
  const byType = s.byGameType[entry.raw.gameType] || (s.byGameType[entry.raw.gameType] = { played: 0, points: 0 });
  byType.played += 1;
  byType.points += reward.pointsEarned;
  if (reward.breakdown.accuracy === 1) s.gamesWon += 1;
  else if (reward.breakdown.accuracy >= 0.5) s.gamesDraw += 1;
  else s.gamesLost += 1;
  s.winRate = s.gamesWon / Math.max(1, s.gamesPlayed);
  const meEntry = state.leaderboard.find((e) => e.userId === ME.userId);
  if (meEntry) {
    meEntry.totalPoints = s.totalPoints;
    meEntry.gamesPlayed = s.gamesPlayed;
    state.leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    state.leaderboard.forEach((e, i) => { e.rank = i + 1; });
    const newRank = state.leaderboard.find((e) => e.userId === ME.userId).rank;
    reward.rankChange = reward.rankBefore - newRank;
    reward.rankAfter = newRank;
    s.rank = newRank;
    const nextUp = state.leaderboard[newRank - 2];
    s.pointsToNextRank = nextUp ? Math.max(0, nextUp.totalPoints - s.totalPoints) : 0;
  }
}

// ---------------------------------------------------------------- public api

export function mockGetCategories() {
  return ok({ categories: JSON.parse(JSON.stringify(CATEGORIES)), difficulties: DIFFICULTIES, scoring: SCORING_RULES });
}

export function mockGetPublicationSources(publicationId) {
  const sources = publicationId
    ? PUBLICATION_SOURCES.filter((s) => s.publicationId === publicationId)
    : PUBLICATION_SOURCES;
  return ok({
    sources: JSON.parse(JSON.stringify(sources)),
    note: 'Puzzle clues and letters are generated from these stored editions.',
  });
}

export function mockGetStatistics(gameType) {
  const s = state.stats.byGameType[gameType] || { played: 0, points: 0 };
  return ok({
    gameType,
    sessions: s.played,
    completed: s.played,
    average_points: s.played ? Math.round(s.points / s.played) : 0,
    average_seconds: 420,
    week_sessions: Math.min(s.played, 6),
  });
}

function filteredLeaderboard(gameType, period) {
  // Deterministic demo filters: shrink points a little for narrower windows.
  const factor = (period === 'week' ? 0.35 : period === 'month' ? 0.7 : 1) * (gameType && gameType !== 'all' ? 0.5 : 1);
  return state.leaderboard.map((e) => ({
    ...e,
    totalPoints: Math.round(e.totalPoints * factor),
  })).sort((a, b) => b.totalPoints - a.totalPoints).map((e, i) => ({ ...e, rank: i + 1 }));
}

export function mockGetLeaderboard(gameType, period, pageNo = 1, pageSize = 20) {
  const all = filteredLeaderboard(gameType, period);
  const page = clampPage(pageNo, pageSize, all.length);
  const me = state.leaderboard.find((e) => e.userId === ME.userId);
  return ok({
    data: all.slice((page.pageNo - 1) * pageSize, page.pageNo * pageSize),
    ...page,
    period: period || 'all',
    gameType: gameType || 'all',
    me: { userId: ME.userId, totalPoints: me.totalPoints, rank: me.rank },
  });
}

export function mockGetDailyLeaderboard(pageNo = 1, pageSize = 20) {
  const rows = [
    { userId: 'u-101', username: 'Kojo Asante', totalPoints: 620, challengesCompleted: 4, rank: 1, firstFinish: '05:42' },
    { userId: 'u-104', username: 'Nii Lante', totalPoints: 585, challengesCompleted: 4, rank: 2, firstFinish: '06:05' },
    { userId: ME.userId, username: ME.username, totalPoints: 540, challengesCompleted: 3, rank: 3, firstFinish: '06:18' },
    { userId: 'u-103', username: 'Efua Nyarko', totalPoints: 512, challengesCompleted: 3, rank: 4, firstFinish: '06:44' },
    { userId: 'u-108', username: 'Akosua Adjei', totalPoints: 488, challengesCompleted: 3, rank: 5, firstFinish: '07:02' },
    { userId: 'u-105', username: 'Selorm Agbeko', totalPoints: 455, challengesCompleted: 2, rank: 6, firstFinish: '07:31' },
    { userId: 'u-112', username: 'Adjoa Sarpong', totalPoints: 430, challengesCompleted: 2, rank: 7, firstFinish: '08:12' },
    { userId: 'u-106', username: 'Abena Asare', totalPoints: 390, challengesCompleted: 2, rank: 8, firstFinish: '08:47' },
  ];
  const page = clampPage(pageNo, pageSize, rows.length);
  return ok({ data: rows.slice((page.pageNo - 1) * pageSize, page.pageNo * pageSize), ...page });
}

export function mockGetAchievements() {
  const data = JSON.parse(JSON.stringify(state.achievements));
  return ok({ data, unlockedCount: data.filter((a) => a.isUnlocked).length });
}

export function mockStartGame(options = {}) {
  const gameType = options.gameType || 'sudoku';
  return newSession({
    gameType,
    difficulty: options.difficulty,
    publicationId: options.publicationId,
    opponentId: options.opponentId,
    isMultiplayer: options.isMultiplayer,
    challengeId: options.challengeId,
    daily: false,
  });
}

export function mockStartDaily(challengeId, gameType) {
  const item = (state.dailyBoard.challenges || []).find((c) => c.id === challengeId)
    || state.dailyBoard.challenges.find((c) => c.gameType === gameType)
    || state.dailyBoard.challenges[0];
  return newSession({
    gameType: item.gameType,
    difficulty: item.difficulty,
    publicationId: item.publication.publicationId,
    daily: true,
    challengeId: item.id,
  });
}

export function mockGetCurrentSession() {
  const live = Object.values(state.sessions).find((e) => !e.raw.isComplete);
  return ok(live ? rawOut(live) : null);
}

export function mockGetSession(sessionId) {
  const entry = getEntry(sessionId);
  return entry ? ok(rawOut(entry)) : fail('Session not found', 404);
}

export function mockSaveProgress(sessionId, progress = {}) {
  const entry = getEntry(sessionId);
  if (!entry) return fail('Session not found', 404);
  if (progress.player) entry.raw.player = JSON.parse(JSON.stringify(progress.player));
  if (progress.grid) entry.raw.player.grid = progress.grid;
  if (progress.found) entry.raw.player.found = progress.found;
  if (progress.answers) entry.raw.player.answers = progress.answers;
  entry.raw.completionTimeSeconds = Math.round((Date.now() - entry.startedAt) / 1000);
  return ok(rawOut(entry));
}

export function mockSubmitSession(payload = {}) {
  const entry = getEntry(payload.sessionId);
  if (!entry) return fail('Session not found', 404);
  const player = {
    ...entry.raw.player,
    grid: payload.grid || entry.raw.player.grid,
    found: payload.found || entry.raw.player.found,
    answers: payload.answers || entry.raw.player.answers,
  };
  entry.raw.player = player;
  const gradeResult = grade(entry, player);
  entry.raw.mistakes = gradeResult.wrongCells ? gradeResult.wrongCells.length : entry.raw.mistakes;
  entry.peakMistakes = Math.max(entry.peakMistakes || 0, gradeResult.wrongCells ? gradeResult.wrongCells.length : 0);
  const elapsed = Math.round((Date.now() - entry.startedAt) / 1000);
  entry.raw.completionTimeSeconds = elapsed;

  const out = rawOut(entry);
  out.check = {
    solved: gradeResult.solved,
    wrongCells: gradeResult.wrongCells,
    summary: gradeResult.solved
      ? 'Everything checks out — submit when you’re ready.'
      : `${gradeResult.correct} of ${gradeResult.total} in place.`,
  };
  out.correct = gradeResult.correct;
  out.total = gradeResult.total;
  out.accuracy = gradeResult.total ? Math.round((gradeResult.correct / gradeResult.total) * 100) / 100 : 0;

  if (!payload.finalize) return ok(out);

  // Finalizing
  entry.raw.isComplete = true;
  entry.raw.status = 'completed';
  const reward = computeReward(entry, gradeResult, elapsed);
  applyStats(entry, reward);
  if (gradeResult.solved) {
    state.stats.currentStreak = Math.min(state.stats.currentStreak + (entry.raw.daily ? 1 : 0), SCORING_RULES.maxStreakDays);
  }
  entry.raw.reward = reward;
  entry.raw.totalPoints = reward.pointsEarned;
  entry.raw.currentScore = reward.pointsEarned;
  state.history.unshift(rawOut(entry));
  const finalOut = rawOut(entry);
  finalOut.check = out.check;
  finalOut.correct = out.correct;
  finalOut.total = out.total;
  finalOut.accuracy = out.accuracy;
  finalOut.reward = reward;
  return ok(finalOut);
}

export function mockUseHint(sessionId) {
  const entry = getEntry(sessionId);
  if (!entry) return fail('Session not found', 404);
  if (entry.raw.hintsRemaining <= 0) return fail('No hints left on this difficulty');
  const { gameType, solution, raw } = entry;

  let hint = null;
  if (gameType === 'sudoku' || gameType === 'crossword') {
    const given = gameType === 'sudoku'
      ? PUZZLE_BANK.sudoku.find((p) => p.puzzleId === raw.puzzleId).given
      : null;
    outer: for (let r = 0; r < solution.grid.length; r++) {
      for (let c = 0; c < solution.grid.length; c++) {
        if (given && given[r] && given[r][c]) continue;
        if (!raw.player.grid[r][c]) {
          raw.player.grid[r][c] = solution.grid[r][c];
          raw.player.reveals.push({ row: r, col: c, value: solution.grid[r][c] });
          hint = { row: r, col: c, value: solution.grid[r][c] };
          break outer;
        }
      }
    }
  } else if (gameType === 'word_search') {
    const puzzle = PUZZLE_BANK.word_search.find((p) => p.puzzleId === raw.puzzleId);
    const found = (raw.player.found || []).map((f) => (typeof f === 'string' ? f : f.word)).map((w) => w.toUpperCase());
    const next = puzzle.solution.placements.find((pl) => !found.includes(pl.word.toUpperCase()));
    if (next) {
      raw.player.found.push({ word: next.word, row: next.row, col: next.col, dRow: next.dRow, dCol: next.dCol });
      raw.player.reveals.push({ word: next.word });
      hint = { word: next.word };
    }
  } else {
    const givenIds = (raw.player.answers || []).map((a) => a.id);
    const next = solution.answers.find((a) => !givenIds.includes(a.id));
    if (next) {
      raw.player.answers.push({ id: next.id, value: next.answer, answer: next.answer });
      raw.player.reveals.push({ id: next.id });
      hint = { id: next.id, value: next.answer };
    }
  }

  if (!hint) return fail('Nothing left to reveal');
  raw.hintsUsed += 1;
  raw.hintsRemaining -= 1;
  const out = rawOut(entry);
  out.hint = hint;
  return ok(out);
}

export function mockDeleteSession(sessionId) {
  delete state.sessions[sessionId];
  return ok({ deleted: true });
}

export function mockGetGameHistory(pageNo = 1, pageSize = 10) {
  const page = clampPage(pageNo, pageSize, state.history.length);
  return ok({
    data: JSON.parse(JSON.stringify(state.history.slice((page.pageNo - 1) * pageSize, page.pageNo * pageSize))),
    ...page,
  });
}

export function mockGetUserStats() {
  return ok(JSON.parse(JSON.stringify(state.stats)));
}

export function mockGetUserPoints() {
  return ok({ userId: ME.userId, totalPoints: state.stats.totalPoints, rank: state.stats.rank });
}

export function mockCheckAchievements() {
  const s = state.stats;
  const fresh = [];
  const unlockIf = (id, cond) => {
    const a = state.achievements.find((x) => x.id === id);
    if (a && !a.isUnlocked && cond) {
      a.isUnlocked = true;
      a.unlockedAt = new Date().toISOString();
      fresh.push(id);
      s.totalPoints += a.bonusPoints;
    }
  };
  unlockIf('ach-points-2500', s.totalPoints >= 2500);
  unlockIf('ach-points-5000', s.totalPoints >= 5000);
  unlockIf('ach-speed-demon', s.gamesWon >= 32);
  unlockIf('ach-30-streak', s.currentStreak >= 30);
  s.achievements = state.achievements.filter((a) => a.isUnlocked).map((a) => a.id);
  return ok({ count: fresh.length, achievements: fresh });
}

export function mockGetRivals(limit = 20) {
  const data = filteredLeaderboard('all', 'all').slice(0, limit);
  return ok({ data, note: 'Readers closest to you on the points table — challenge one to a duel.' });
}

export function mockCreateChallenge(opponentId, gameType, difficulty = 'medium') {
  state.duelSeq += 1;
  const opponent = state.leaderboard.find((e) => e.userId === opponentId);
  const puzzle = pickPuzzle(gameType, difficulty);
  const duel = {
    challengeId: 'duel-' + state.duelSeq,
    gameType,
    difficulty,
    status: 'active',
    summary: `You challenged ${opponent ? opponent.username : opponentId} to ${puzzle ? puzzle.title.toLowerCase() : gameType}.`,
    youAreChallenger: true,
    challengerId: ME.userId,
    opponentId,
    challengerName: ME.username,
    opponentName: opponent ? opponent.username : opponentId,
    publication: puzzle ? puzzle.source : PUBLICATION_SOURCES[0],
    startedAt: new Date().toISOString(),
  };
  state.challenges.unshift(duel);
  return ok(duel);
}

export function mockAcceptChallenge(challengeId) {
  const duel = state.challenges.find((c) => c.challengeId === challengeId);
  if (!duel) return fail('Challenge not found', 404);
  duel.status = 'accepted';
  return newSession({
    gameType: duel.gameType,
    difficulty: duel.difficulty,
    publicationId: duel.publication.publicationId,
    opponentId: duel.youAreChallenger ? duel.opponentId : duel.challengerId,
    isMultiplayer: true,
    challengeId,
  });
}

export function mockDeclineChallenge(challengeId) {
  const duel = state.challenges.find((c) => c.challengeId === challengeId);
  if (!duel) return fail('Challenge not found', 404);
  duel.status = 'declined';
  duel.summary = duel.summary.replace(/^(You challenged|.*? invited you)/, 'Declined:');
  return ok({ declined: true });
}

export function mockListChallenges() {
  return ok({ data: JSON.parse(JSON.stringify(state.challenges)) });
}

export function mockSubmitMultiplayer(sessionId) {
  const entry = getEntry(sessionId);
  if (!entry) return fail('Session not found', 404);
  const duel = state.challenges.find((c) => c.challengeId === entry.raw.challengeId);
  if (duel) {
    duel.status = 'completed';
    duel.summary = 'Duel finished — check the leaderboard for the final score.';
  }
  return ok({ winner: ME.userId, rivalryBonus: SCORING_RULES.rivalryBonus });
}

export function mockGetDailyBoard() {
  return ok(JSON.parse(JSON.stringify(state.dailyBoard)));
}

export function mockCompleteDaily(sessionId) {
  const entry = getEntry(sessionId);
  if (!entry) return fail('Session not found', 404);
  const item = state.dailyBoard.challenges.find((c) => c.id === entry.raw.challengeId);
  if (state.dailyCompletedSessions[sessionId]) {
    return ok({ bonusEarned: 0, alreadyClaimed: true });
  }
  state.dailyCompletedSessions[sessionId] = true;
  const bonusEarned = SCORING_RULES.dailyChallengeBonus;
  if (item && !item.completed) {
    item.completed = true;
    item.bonusEarned = bonusEarned;
    state.dailyBoard.completedCount += 1;
    state.stats.totalPoints += bonusEarned;
    state.stats.currentStreak += 1;
  }
  return ok({ bonusEarned, completedAt: new Date().toISOString() });
}

export function mockResetProgress() {
  state.sessions = {};
  state.history = [];
  state.dailyCompletedSessions = {};
  state.stats = seedStats();
  state.stats.totalPoints = 0;
  state.stats.gamesPlayed = 0;
  state.stats.gamesWon = 0;
  state.stats.gamesLost = 0;
  state.stats.gamesDraw = 0;
  state.stats.currentStreak = 0;
  state.stats.longestStreak = 0;
  state.stats.winRate = 0;
  state.stats.rank = state.leaderboard.length;
  state.stats.pointsToNextRank = 0;
  state.stats.byGameType = {};
  state.stats.achievements = [];
  state.achievements = seedAchievements().map((a) => ({ ...a, isUnlocked: false, unlockedAt: undefined }));
  state.leaderboard = seedLeaderboard().map((e) => (e.userId === ME.userId ? { ...e, totalPoints: 0, gamesPlayed: 0 } : e))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((e, i) => ({ ...e, rank: i + 1 }));
  state.dailyBoard = seedDailyBoard();
  state.dailyBoard.completedCount = 0;
  state.dailyBoard.challenges.forEach((c) => { c.completed = false; c.bonusEarned = undefined; });
  return ok({ reset: true });
}

// ---------------------------------------------------------------- bootstrap

state.stats = seedStats();
state.achievements = seedAchievements();
state.history = seedHistory();
state.challenges = seedChallenges();
state.dailyBoard = seedDailyBoard();
state.leaderboard = seedLeaderboard();

// One puzzle already in progress so the "resume" banner has something to show.
(function seedActiveSession() {
  const created = newSession({ gameType: 'sudoku', difficulty: 'easy', publicationId: 'pub-01' });
  const entry = state.sessions[created.result.sessionId];
  const sol = entry.solution.grid;
  // fill a handful of cells (some right, one wrong) for a believable half-played grid
  const hints = [[0, 3], [1, 7], [2, 1], [4, 4], [6, 2], [7, 5]];
  hints.forEach(([r, c], i) => {
    entry.raw.player.grid[r][c] = i === 2 ? 'X' : sol[r][c];
  });
  entry.raw.mistakes = 1;
  entry.peakMistakes = 1;
  entry.raw.hintsUsed = 1;
  entry.raw.hintsRemaining = HINTS_CAP.easy - 1;
  entry.startedAt = Date.now() - 8 * 60000;
  entry.raw.completionTimeSeconds = 480;
  entry.raw.summary = 'Front Desk Sudoku — you stopped about halfway through';
})();
