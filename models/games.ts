export type GameType = 'sudoku' | 'word_search' | 'crossword' | 'riddle' | 'daily';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export enum GameTypeCode {
  Sudoku = 1,
  WordSearch = 2,
  Crossword = 3,
  Riddle = 4
}

export interface ScoringRules {
  mistakePenalty: number;
  hintPenalty: number;
  perfectBonus: number;
  dailyChallengeBonus: number;
  streakBonusPerDay: number;
  maxStreakDays: number;
  rivalryBonus: number;
  achievementBonus: number;
  partialDailyThresholdPercent: number;
  difficultyMultipliers: Record<Difficulty, number>;
  notes: string;
}

export interface GameCategory {
  gameType: GameType;
  title: string;
  isActive: boolean;
  basePoints: number;
  gameTypeCode: number;
  description: string;
  content: string;
}

export interface CategoriesResponse {
  categories: GameCategory[];
  difficulties: Difficulty[];
  scoring: ScoringRules;
}

export interface PublicationSourceRef {
  newspaperId: string;
  publicationId: string;
  publicationName: string;
  newspaperTitle: string;
  publicationDate: string;
  pageNumber: number;
  snippet?: string;
}

export interface PublicationSourcesResponse {
  sources: PublicationSourceRef[];
  note: string;
}

export interface GameStatistics {
  gameType: GameType;
  sessions: number;
  completed: number;
  average_points: number;
  average_seconds: number;
  week_sessions: number;
  [key: string]: any;
}

export interface SudokuPuzzle {
  size: number;
  symbols: string[];
  symbolWord: string;
  anchorQuote: string;
  rules: string;
  grid: string[][];
  given: boolean[][];
  source: PublicationSourceRef;
}

export interface WordSearchWord {
  word: string;
  length: number;
  clue: string;
  source: PublicationSourceRef;
}

export interface WordSearchPlacement {
  word: string;
  row: number;
  col: number;
  dRow: number;
  dCol: number;
  direction?: string;
}

export interface WordSearchPuzzle {
  size: number;
  grid: string[][];
  words: WordSearchWord[];
  directions: string[];
  source: PublicationSourceRef;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  row: number;
  col: number;
  length: number;
  direction: 'across' | 'down';
  source: PublicationSourceRef;
}

export interface CrosswordPuzzle {
  size: number;
  grid: string[][];
  numbers: number[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  wordCount: number;
  source: PublicationSourceRef;
}

export interface RiddleItem {
  id: string;
  type: 'cloze' | 'anagram';
  prompt: string;
  length: number;
  choices?: string[];
  source: PublicationSourceRef;
}

export interface RiddlePuzzle {
  items: RiddleItem[];
  questionCount: number;
  source: PublicationSourceRef;
}

export interface GamePlayerState {
  grid?: string[][];
  found?: Array<string | WordSearchPlacement>;
  answers?: Array<{ id: string; value: string; answer?: string }>;
  reveals?: any[];
  lastCheck?: any;
}

export interface ScoreBreakdown {
  base: number;
  difficultyMultiplier: number;
  accuracy: number;
  accuracyPoints: number;
  timeBonus: number;
  perfectBonus: number;
  streakBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
  elapsedSeconds: number;
}

export interface GameReward {
  pointsEarned: number;
  bonusPoints: number;
  message: string;
  breakdown?: ScoreBreakdown;
  rankBefore?: number;
  rankAfter?: number;
  rankChange?: number;
  newAchievements?: string[];
}

export interface GameSession {
  sessionId: string;
  userId: string;
  gameType: GameType;
  gameTypeCode: number;
  puzzleId: string;
  difficulty: Difficulty;
  isMultiplayer: boolean;
  opponentId?: string;
  isComplete: boolean;
  totalPoints: number;
  currentScore: number;
  mistakes: number;
  hintsUsed: number;
  hintsRemaining: number;
  completionTimeSeconds: number;
  summary: string;
  daily: boolean;
  challengeId?: string;
  status: string;
  publication: PublicationSourceRef;
  sources: PublicationSourceRef[];
  puzzle: any;
  player: GamePlayerState;
  review?: any;
  reward?: GameReward;
  topicsRelaxed?: boolean;
}

export interface StartOptions {
  userId?: string;
  gameType: GameType;
  difficulty?: Difficulty;
  publicationId?: string;
  newspaperId?: string;
  opponentId?: string;
  isMultiplayer?: boolean;
  topics?: string[];
  challengeId?: string;
}

export interface SubmitSessionPayload {
  sessionId?: string;
  challengeId?: string;
  finalize?: boolean;
  grid?: string[][];
  found?: Array<string | WordSearchPlacement>;
  answers?: Array<{ id: string; value: string }>;
}

export interface SubmitSessionResponse extends GameSession {
  check?: {
    solved: boolean;
    wrongCells?: Array<{ row: number; col: number }>;
    summary: string;
  };
  accuracy?: number;
  correct?: number;
  total?: number;
  reward?: GameReward;
}

export interface HintResponse extends GameSession {
  hint: any;
}

export interface DailyChallengeItem {
  id: string;
  gameType: GameType;
  difficulty: Difficulty;
  featured: boolean;
  bonus: number;
  createdAt: string;
  expiresAt: string;
  completed: boolean;
  bonusEarned?: number;
  summary: string;
  publication: PublicationSourceRef;
  wordCount?: number;
  questionCount?: number;
}

export interface DailyBoard {
  date: string;
  challenges: DailyChallengeItem[];
  completedCount: number;
  scoring: ScoringRules;
}

export interface DailyCompletionResult {
  bonusEarned: number;
  completedAt?: string;
  alreadyClaimed?: boolean;
}

export interface GameAchievement {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  gamesRequired: number;
  gameType: string;
  achievementType: string;
  bonusPoints: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserGameStats {
  userId: string;
  username: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  currentStreak: number;
  longestStreak: number;
  winRate: number;
  rank: number;
  pointsToNextRank: number;
  byGameType: Record<string, { played: number; points: number }>;
  achievements: string[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  gamesPlayed: number;
  rank: number;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  pageNo: number;
  pageSize: number;
  period: string;
  gameType: string;
  me?: {
    userId: string;
    totalPoints: number;
    rank: number;
  };
}

export interface DailyLeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  challengesCompleted: number;
  rank: number;
  firstFinish: string;
}

export interface DailyLeaderboardResponse {
  data: DailyLeaderboardEntry[];
  pageNo: number;
  pageSize: number;
}

export interface ChallengeItem {
  challengeId: string;
  gameType: GameType;
  difficulty: Difficulty;
  status: string;
  summary: string;
  youAreChallenger: boolean;
  challengerId: string;
  opponentId: string;
  challengerName: string;
  opponentName: string;
  publication: PublicationSourceRef;
  startedAt: string;
}

export interface RivalsResponse {
  data: LeaderboardEntry[];
  note: string;
}
