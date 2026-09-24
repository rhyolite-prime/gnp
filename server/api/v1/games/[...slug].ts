import { defineEventHandler, getQuery, readBody, getRouterParam, getMethod, createError } from 'h3';

// Storage for active game sessions, history, daily challenges, and user stats
interface MockSession {
  sessionId: string;
  userId: string;
  gameType: string;
  gameTypeCode: number;
  puzzleId: string;
  difficulty: string;
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
  startTime: number;
  publication: any;
  sources: any[];
  puzzle: any;
  solution: any;
  player: any;
  review?: any;
  reward?: any;
}

const mockSessions = new Map<string, MockSession>();

// In-memory stats, points, achievements, rivals, challenges
const userStatsMap = new Map<string, any>();
const userAchievementsMap = new Map<string, Set<string>>();
const dailyCompletionsMap = new Map<string, Set<string>>();

const defaultAchievements = [
  { id: 'ach-1', name: 'First Edition', description: 'Finish your first publication puzzle.', achievementType: 'games', gameType: 'any', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-2', name: 'Cub Reporter', description: 'Finish 10 publication puzzles.', achievementType: 'games', gameType: 'any', pointsRequired: 0, gamesRequired: 10, bonusPoints: 50 },
  { id: 'ach-3', name: 'Newsroom Veteran', description: 'Finish 50 publication puzzles.', achievementType: 'games', gameType: 'any', pointsRequired: 0, gamesRequired: 50, bonusPoints: 100 },
  { id: 'ach-4', name: 'Sudoku Cadet', description: 'Solve a letter Sudoku from the paper.', achievementType: 'games', gameType: 'sudoku', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-5', name: 'Grid Master', description: 'Solve 25 Sudoku puzzles.', achievementType: 'games', gameType: 'sudoku', pointsRequired: 0, gamesRequired: 25, bonusPoints: 100 },
  { id: 'ach-6', name: 'Word Scout', description: 'Finish a word search from the paper.', achievementType: 'games', gameType: 'word_search', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-7', name: 'Search Captain', description: 'Finish 25 word searches.', achievementType: 'games', gameType: 'word_search', pointsRequired: 0, gamesRequired: 25, bonusPoints: 100 },
  { id: 'ach-8', name: 'Crossword Cub', description: 'Finish a crossword from the paper.', achievementType: 'games', gameType: 'crossword', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-9', name: 'Puzzle Editor', description: 'Finish 25 crosswords.', achievementType: 'games', gameType: 'crossword', pointsRequired: 0, gamesRequired: 25, bonusPoints: 100 },
  { id: 'ach-10', name: 'Riddle Rookie', description: 'Answer a set of news riddles.', achievementType: 'games', gameType: 'riddle', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-11', name: 'Oracle', description: 'Finish 25 riddle sets.', achievementType: 'games', gameType: 'riddle', pointsRequired: 0, gamesRequired: 25, bonusPoints: 100 },
  { id: 'ach-12', name: 'Point Collector', description: 'Earn 100 game points.', achievementType: 'points', gameType: 'any', pointsRequired: 100, gamesRequired: 0, bonusPoints: 50 },
  { id: 'ach-13', name: 'High Scorer', description: 'Earn 500 game points.', achievementType: 'points', gameType: 'any', pointsRequired: 500, gamesRequired: 0, bonusPoints: 75 },
  { id: 'ach-14', name: 'News Scholar', description: 'Earn 1000 game points.', achievementType: 'points', gameType: 'any', pointsRequired: 1000, gamesRequired: 0, bonusPoints: 100 },
  { id: 'ach-15', name: 'Front Page', description: 'Earn 5000 game points.', achievementType: 'points', gameType: 'any', pointsRequired: 5000, gamesRequired: 0, bonusPoints: 200 },
  { id: 'ach-16', name: 'Hat Trick', description: 'Win on three consecutive days.', achievementType: 'streak', gameType: 'any', pointsRequired: 0, gamesRequired: 3, bonusPoints: 50 },
  { id: 'ach-17', name: 'Week of Ink', description: 'Win on seven consecutive days.', achievementType: 'streak', gameType: 'any', pointsRequired: 0, gamesRequired: 7, bonusPoints: 100 },
  { id: 'ach-18', name: 'Clean Copy', description: 'Finish a puzzle with no mistakes and no hints.', achievementType: 'perfect', gameType: 'any', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-19', name: 'Perfectionist', description: 'Record 10 perfect solves.', achievementType: 'perfect', gameType: 'any', pointsRequired: 0, gamesRequired: 10, bonusPoints: 100 },
  { id: 'ach-20', name: 'Daily Reader', description: 'Complete a daily challenge.', achievementType: 'daily', gameType: 'any', pointsRequired: 0, gamesRequired: 1, bonusPoints: 50 },
  { id: 'ach-21', name: 'Daily Streak', description: 'Play the daily challenge on 7 different days.', achievementType: 'daily', gameType: 'any', pointsRequired: 0, gamesRequired: 7, bonusPoints: 150 },
];

const mockGlobalLeaderboard = [
  { userId: 'u-101', username: 'Kwame Asante', totalPoints: 4850, gamesPlayed: 62, rank: 1 },
  { userId: 'u-102', username: 'Ama Osei', totalPoints: 4120, gamesPlayed: 54, rank: 2 },
  { userId: 'u-103', username: 'Kofi Mensah', totalPoints: 3780, gamesPlayed: 48, rank: 3 },
  { userId: 'u-104', username: 'Akosua Darko', totalPoints: 3250, gamesPlayed: 41, rank: 4 },
  { userId: 'u-105', username: 'Yaw Boateng', totalPoints: 2940, gamesPlayed: 38, rank: 5 },
  { userId: 'u-106', username: 'Esi Annan', totalPoints: 2410, gamesPlayed: 31, rank: 6 },
  { userId: 'u-107', username: 'Kojo Frimpong', totalPoints: 1980, gamesPlayed: 25, rank: 7 },
  { userId: 'u-108', username: 'Abena Baah', totalPoints: 1650, gamesPlayed: 20, rank: 8 },
  { userId: 'u-109', username: 'Kwabena Appiah', totalPoints: 1320, gamesPlayed: 18, rank: 9 },
  { userId: 'u-110', username: 'Afia Poku', totalPoints: 980, gamesPlayed: 14, rank: 10 },
];

const mockRivals = [
  { userId: 'u-102', username: 'Ama Osei', totalPoints: 4120, gamesPlayed: 54, rank: 2 },
  { userId: 'u-103', username: 'Kofi Mensah', totalPoints: 3780, gamesPlayed: 48, rank: 3 },
  { userId: 'u-105', username: 'Yaw Boateng', totalPoints: 2940, gamesPlayed: 38, rank: 5 },
  { userId: 'u-106', username: 'Esi Annan', totalPoints: 2410, gamesPlayed: 31, rank: 6 },
];

const mockChallengesList: any[] = [
  {
    challengeId: 'chal-001',
    gameType: 'crossword',
    difficulty: 'medium',
    status: 'active',
    summary: 'Crossword challenge from Daily Graphic',
    youAreChallenger: false,
    challengerId: 'u-102',
    opponentId: 'current-user',
    challengerName: 'Ama Osei',
    opponentName: 'You',
    publication: {
      publicationName: 'Daily Graphic',
      newspaperTitle: 'National Infrastructure Special',
      publicationDate: '2026-09-22',
      pageNumber: 3
    },
    startedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    challengeId: 'chal-002',
    gameType: 'sudoku',
    difficulty: 'hard',
    status: 'active',
    summary: 'Letter Sudoku challenge from Graphic Showbiz',
    youAreChallenger: true,
    challengerId: 'current-user',
    opponentId: 'u-103',
    challengerName: 'You',
    opponentName: 'Kofi Mensah',
    publication: {
      publicationName: 'Graphic Showbiz',
      newspaperTitle: 'Spotlight on Ghana Music Awards',
      publicationDate: '2026-09-23',
      pageNumber: 7
    },
    startedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

function getOrCreateUserStats(userId: string) {
  if (!userStatsMap.has(userId)) {
    userStatsMap.set(userId, {
      userId,
      username: 'Graphic Reader',
      totalPoints: 350,
      gamesPlayed: 5,
      gamesWon: 4,
      gamesLost: 1,
      gamesDraw: 0,
      currentStreak: 2,
      longestStreak: 4,
      winRate: 0.8,
      rank: 12,
      pointsToNextRank: 130,
      byGameType: {
        sudoku: { played: 2, points: 140 },
        word_search: { played: 1, points: 70 },
        crossword: { played: 1, points: 90 },
        riddle: { played: 1, points: 50 },
      },
      achievements: ['First Edition', 'Sudoku Cadet']
    });
    userAchievementsMap.set(userId, new Set(['ach-1', 'ach-4']));
  }
  return userStatsMap.get(userId);
}

// Puzzle generation templates
function createSudokuPuzzle(difficulty: string, publicationSource?: any) {
  const words = [
    { word: 'EDUCATION', quote: 'The Minister highlighted national advances in secondary education and digital literacy.', pub: 'Daily Graphic', page: 4 },
    { word: 'CHAMPIONS', quote: 'Ghana Black Satellites crowned champions after thrilling tournament final in Accra.', pub: 'Graphic Sports', page: 8 },
    { word: 'SPOTLIGHT', quote: 'Graphic Showbiz shines a spotlight on heritage highlife rhythms in the capital.', pub: 'Graphic Showbiz', page: 6 },
    { word: 'EDITORIAL', quote: 'In our morning editorial, we urge swift stakeholder consensus on clean energy.', pub: 'Daily Graphic', page: 2 },
  ];
  const choice = words[Math.floor(Math.random() * words.length)];
  const letters = choice.word.split('');
  
  // 9x9 base solved grid (valid Latin square / Sudoku layout)
  const pattern = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [3, 4, 5, 6, 7, 8, 0, 1, 2],
    [6, 7, 8, 0, 1, 2, 3, 4, 5],
    [1, 2, 0, 4, 5, 3, 7, 8, 6],
    [4, 5, 3, 7, 8, 6, 1, 2, 0],
    [7, 8, 6, 1, 2, 0, 4, 5, 3],
    [2, 0, 1, 5, 3, 4, 8, 6, 7],
    [5, 3, 4, 8, 6, 7, 2, 0, 1],
    [8, 6, 7, 2, 0, 1, 5, 3, 4],
  ];

  const solvedGrid = pattern.map(row => row.map(idx => letters[idx]));

  // Remove cells based on difficulty
  const givensCount = difficulty === 'easy' ? 44 : difficulty === 'medium' ? 36 : difficulty === 'hard' ? 30 : 26;
  const playableGrid = solvedGrid.map(row => [...row]);
  const given = Array.from({ length: 9 }, () => Array(9).fill(false));

  // Determine cells to keep
  const allCoords: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allCoords.push([r, c]);
    }
  }
  // Shuffle coords
  for (let i = allCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
  }

  const keepCoords = new Set(allCoords.slice(0, givensCount).map(([r, c]) => `${r},${c}`));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (keepCoords.has(`${r},${c}`)) {
        given[r][c] = true;
      } else {
        playableGrid[r][c] = '';
      }
    }
  }

  const pub = publicationSource || {
    newspaperId: 'np-01',
    publicationId: 'pub-01',
    publicationName: choice.pub,
    newspaperTitle: 'Graphic National Edition',
    publicationDate: '2026-09-24',
    pageNumber: choice.page,
  };

  return {
    kind: 'sudoku',
    puzzle: {
      size: 9,
      symbols: letters,
      symbolWord: choice.word,
      anchorQuote: choice.quote,
      rules: `Fill every row, column and 3x3 box with the nine letters ${letters.slice(0, 8).join(', ')} and ${letters[8]}. They are taken from "${choice.word}" in ${pub.publicationName}.`,
      grid: playableGrid,
      given,
      source: pub,
    },
    solution: {
      grid: solvedGrid,
      symbols: letters,
    },
    publication: pub,
    summary: `Letter Sudoku on "${choice.word}" from ${pub.publicationName}`,
  };
}

function createWordSearchPuzzle(difficulty: string, publicationSource?: any) {
  const size = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 14;
  const wordSet = [
    { word: 'GRAPHIC', clue: 'Ghana\'s foremost trusted news publishing brand and heritage newspaper.', page: 1 },
    { word: 'ACCRA', clue: 'The vibrant capital city hosting this weekend\'s international diplomatic summit.', page: 2 },
    { word: 'PARLIAMENT', clue: 'The legislature debates new sustainable national energy policies.', page: 3 },
    { word: 'HERITAGE', clue: 'Traditional Ghanaian festivals celebrated with colorful durbar of chiefs.', page: 5 },
    { word: 'STADIUM', clue: 'Packed sports arena where regional football championship matches will take place.', page: 8 },
    { word: 'HARBOUR', clue: 'Tema port handles record cargo volume in latest trade quarterly report.', page: 4 },
    { word: 'INNOVATION', clue: 'Young tech entrepreneurs showcase artificial intelligence startups in Ridge.', page: 7 },
    { word: 'EDITORIAL', clue: 'The leading daily commentary urges fiscal discipline across all sectors.', page: 2 },
  ];

  const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 8;
  const selectedWords = wordSet.slice(0, count);

  const grid = Array.from({ length: size }, () => Array(size).fill('.'));
  const placements: any[] = [];

  const directions = [
    { dr: 0, dc: 1, name: 'E' },
    { dr: 1, dc: 0, name: 'S' },
    { dr: 1, dc: 1, name: 'SE' },
    { dr: 1, dc: -1, name: 'SW' },
  ];

  for (const item of selectedWords) {
    const w = item.word;
    let placed = false;
    for (let attempts = 0; attempts < 100 && !placed; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);

      let fits = true;
      for (let i = 0; i < w.length; i++) {
        const nr = r + dir.dr * i;
        const nc = c + dir.dc * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size || (grid[nr][nc] !== '.' && grid[nr][nc] !== w[i])) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < w.length; i++) {
          grid[r + dir.dr * i][c + dir.dc * i] = w[i];
        }
        placements.push({
          word: w,
          row: r,
          col: c,
          dRow: dir.dr,
          dCol: dir.dc,
          direction: dir.name,
        });
        placed = true;
      }
    }
  }

  // Fill empty with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '.') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  const pub = publicationSource || {
    newspaperId: 'np-02',
    publicationId: 'pub-01',
    publicationName: 'Daily Graphic',
    newspaperTitle: 'National News Digest',
    publicationDate: '2026-09-24',
    pageNumber: 1,
  };

  const wordsWithClues = selectedWords.map(w => ({
    word: w.word,
    length: w.word.length,
    clue: `Daily Graphic p.${w.page}: "${w.clue}"`,
    source: { ...pub, pageNumber: w.page, snippet: w.clue },
  }));

  return {
    kind: 'word_search',
    puzzle: {
      size,
      grid,
      words: wordsWithClues,
      directions: directions.map(d => d.name),
      source: pub,
    },
    solution: {
      placements,
    },
    publication: pub,
    summary: `${wordsWithClues.length}-word search from ${pub.publicationName}`,
  };
}

function createCrosswordPuzzle(difficulty: string, publicationSource?: any) {
  const size = 11;
  const grid = Array.from({ length: size }, () => Array(size).fill('#'));
  const numbers = Array.from({ length: size }, () => Array(size).fill(0));
  const solutionGrid = Array.from({ length: size }, () => Array(size).fill('#'));

  const words = [
    { number: 1, dir: 'across', word: 'ACCRA', row: 1, col: 1, clue: 'Daily Graphic p.2: "The capital city ______ hosted delegates for the regional economic summit."' },
    { number: 2, dir: 'down', word: 'AFRICA', row: 1, col: 1, clue: 'Graphic Sports p.8: "The continental cup showcases football excellence across ______."' },
    { number: 3, dir: 'across', word: 'COCOA', row: 3, col: 1, clue: 'Daily Graphic p.5: "Ghanaian farmers record banner yields in premium quality ______ production."' },
    { number: 4, dir: 'down', word: 'COIN', row: 3, col: 3, clue: 'The Mirror p.4: "Bank of Ghana commemorative gold ______ unveiled for numismatic collectors."' },
    { number: 5, dir: 'across', word: 'INK', row: 5, col: 1, clue: 'Junior Graphic p.7: "Historic printing presses running fresh black ______ each midnight."' },
    { number: 6, dir: 'down', word: 'RIVER', row: 1, col: 4, clue: 'Daily Graphic p.6: "Volta ______ restoration project enters its second community ecological phase."' },
    { number: 7, dir: 'across', word: 'NEWS', row: 7, col: 3, clue: 'Graphic Showbiz p.1: "Breaking entertainment ______ reaches thousands through digital channels."' },
  ];

  for (const item of words) {
    numbers[item.row][item.col] = item.number;
    for (let i = 0; i < item.word.length; i++) {
      const r = item.dir === 'across' ? item.row : item.row + i;
      const c = item.dir === 'across' ? item.col + i : item.col;
      solutionGrid[r][c] = item.word[i];
      grid[r][c] = '';
    }
  }

  const acrossClues = words.filter(w => w.dir === 'across').map(w => ({
    number: w.number,
    clue: w.clue,
    row: w.row,
    col: w.col,
    length: w.word.length,
    direction: 'across',
    source: { publicationName: 'Daily Graphic', newspaperTitle: 'Morning Edition', publicationDate: '2026-09-24', pageNumber: 2 }
  }));

  const downClues = words.filter(w => w.dir === 'down').map(w => ({
    number: w.number,
    clue: w.clue,
    row: w.row,
    col: w.col,
    length: w.word.length,
    direction: 'down',
    source: { publicationName: 'Daily Graphic', newspaperTitle: 'Morning Edition', publicationDate: '2026-09-24', pageNumber: 2 }
  }));

  const pub = publicationSource || {
    newspaperId: 'np-03',
    publicationId: 'pub-01',
    publicationName: 'Daily Graphic',
    newspaperTitle: 'Weekend Edition',
    publicationDate: '2026-09-24',
    pageNumber: 1,
  };

  return {
    kind: 'crossword',
    puzzle: {
      size,
      grid,
      numbers,
      clues: {
        across: acrossClues,
        down: downClues,
      },
      wordCount: words.length,
      source: pub,
    },
    solution: {
      grid: solutionGrid,
      words,
    },
    publication: pub,
    summary: `${words.length}-word crossword from ${pub.publicationName}`,
  };
}

function createRiddlePuzzle(difficulty: string, publicationSource?: any) {
  const items = [
    {
      id: '1',
      type: 'cloze',
      prompt: 'Daily Graphic p.3 — fill the blank: "The Bank of Ghana announced new regulatory frameworks to protect national ______ stability."',
      length: 9,
      answer: 'FINANCIAL',
      choices: ['FINANCIAL', 'POLITICAL', 'COMMERCIAL', 'EDITORIAL'],
      source: { publicationName: 'Daily Graphic', newspaperTitle: 'Business Report', publicationDate: '2026-09-24', pageNumber: 3 },
    },
    {
      id: '2',
      type: 'anagram',
      prompt: 'Unscramble this word from Graphic Sports p.8: "NAMPICOH" (8 letters). Context: "The regional boxing title contender aims to emerge as the undisputed ______."',
      length: 8,
      answer: 'CHAMPION',
      choices: ['CHAMPION', 'COMPLAIN', 'PHANTOMS', 'CAMPIONS'],
      source: { publicationName: 'Graphic Sports', newspaperTitle: 'Ringside Special', publicationDate: '2026-09-24', pageNumber: 8 },
    },
    {
      id: '3',
      type: 'cloze',
      prompt: 'The Mirror p.5 — fill the blank: "Preserving cultural heritage requires active documentation of folk ______ and storytelling across generations."',
      length: 9,
      answer: 'TRADITION',
      choices: ['TRADITION', 'CONDITION', 'NARRATION', 'EDUCATION'],
      source: { publicationName: 'The Mirror', newspaperTitle: 'Heritage & Life', publicationDate: '2026-09-24', pageNumber: 5 },
    },
    {
      id: '4',
      type: 'anagram',
      prompt: 'Unscramble this word from Junior Graphic p.6: "TEACUONDI" (9 letters). Context: "Universal access to high-quality basic ______ remains the foundation of national growth."',
      length: 9,
      answer: 'EDUCATION',
      choices: ['EDUCATION', 'DEDUCTION', 'DIRECTION', 'AUCTIONED'],
      source: { publicationName: 'Junior Graphic', newspaperTitle: 'Young Minds Section', publicationDate: '2026-09-24', pageNumber: 6 },
    },
  ];

  const pub = publicationSource || {
    newspaperId: 'np-04',
    publicationId: 'pub-01',
    publicationName: 'Daily Graphic',
    newspaperTitle: 'National Newsroom Riddles',
    publicationDate: '2026-09-24',
    pageNumber: 1,
  };

  return {
    kind: 'riddle',
    puzzle: {
      items: items.map(({ answer, ...rest }) => rest),
      questionCount: items.length,
      source: pub,
    },
    solution: {
      items: items.map(i => ({ id: i.id, answer: i.answer })),
    },
    publication: pub,
    summary: `${items.length} news riddles from ${pub.publicationName}`,
  };
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const rawPath = event.node.req.url || '';
  const pathname = rawPath.split('?')[0];
  const query = getQuery(event);

  // Normalize slug path after /api/v1/games/
  const match = pathname.match(/\/api\/v1\/games\/?(.*)/);
  const route = match ? match[1].replace(/\/+$/, '') : '';

  // Get user identifier (mock or header)
  const authHeader = event.node.req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const userId = token ? 'user-current' : 'guest-player';

  // 1. GET /api/v1/games/categories
  if (route === 'categories' && method === 'GET') {
    return {
      success: true,
      message: 'Game categories loaded.',
      result: {
        categories: [
          {
            gameType: 'sudoku',
            title: 'Sudoku',
            isActive: true,
            basePoints: 60,
            gameTypeCode: 1,
            description: 'Fill a 9x9 grid with nine letters drawn from a word in a stored newspaper.',
            content: 'Letter symbols and the theme word come from publication text.'
          },
          {
            gameType: 'word_search',
            title: 'Word Search',
            isActive: true,
            basePoints: 50,
            gameTypeCode: 2,
            description: 'Find words hidden in a grid. The word list is taken from newspaper pages.',
            content: 'Answers and filler letters are drawn from the same edition.'
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
            title: 'Riddles',
            isActive: true,
            basePoints: 40,
            gameTypeCode: 4,
            description: 'Cloze and anagram questions written from publication sentences.',
            content: 'Each prompt cites the newspaper it was taken from.'
          },
          {
            gameType: 'daily',
            title: 'Daily Challenge',
            isActive: true,
            basePoints: 200,
            gameTypeCode: 5,
            description: 'A shared set of puzzles and news questions from the latest edition.',
            content: 'One attempt per challenge. The fastest accurate solves lead the daily board.'
          }
        ],
        difficulties: ['easy', 'medium', 'hard', 'expert'],
        scoring: {
          mistakePenalty: 3,
          hintPenalty: 5,
          perfectBonus: 100,
          dailyChallengeBonus: 200,
          streakBonusPerDay: 10,
          maxStreakDays: 50,
          rivalryBonus: 25,
          achievementBonus: 100,
          partialDailyThresholdPercent: 60,
          difficultyMultipliers: { easy: 1, medium: 2, hard: 3, expert: 4 },
          notes: 'Points scale with difficulty and accuracy. Faster perfect solves earn a time bonus. Daily puzzles add a one-time bonus. Streaks count consecutive days with a win.'
        }
      }
    };
  }

  // 2. GET /api/v1/games/publication-sources
  if (route === 'publication-sources' && method === 'GET') {
    return {
      success: true,
      message: 'Publication sources loaded.',
      result: {
        sources: [
          { newspaperId: 'np-01', publicationId: 'pub-01', publicationName: 'Daily Graphic', newspaperTitle: 'Front Page Headlines & National News', publicationDate: '2026-09-24', pageNumber: 1 },
          { newspaperId: 'np-02', publicationId: 'pub-02', publicationName: 'Graphic Showbiz', newspaperTitle: 'Ghana Music, Arts & Film Spotlight', publicationDate: '2026-09-23', pageNumber: 3 },
          { newspaperId: 'np-03', publicationId: 'pub-03', publicationName: 'The Mirror', newspaperTitle: 'Family, Lifestyle & Human Stories', publicationDate: '2026-09-22', pageNumber: 5 },
          { newspaperId: 'np-04', publicationId: 'pub-04', publicationName: 'Graphic Sports', newspaperTitle: 'Ghana Premier League & World Athletics', publicationDate: '2026-09-24', pageNumber: 8 },
          { newspaperId: 'np-05', publicationId: 'pub-05', publicationName: 'Junior Graphic', newspaperTitle: 'Youth Science, History & Literature', publicationDate: '2026-09-21', pageNumber: 6 }
        ],
        note: 'Puzzles use page text already extracted from editions, and fall back to the PDF stored in G3.'
      }
    };
  }

  // 3. GET /api/v1/games/statistics
  if (route === 'statistics' && method === 'GET') {
    const gameType = (query.gameType as string) || 'sudoku';
    return {
      success: true,
      message: 'Game statistics loaded.',
      result: {
        gameType,
        sessions: 1420,
        completed: 1180,
        average_points: 125,
        average_seconds: 340,
        week_sessions: 310
      }
    };
  }

  // 4. GET /api/v1/games/leaderboard
  if (route === 'leaderboard' && method === 'GET') {
    const stats = getOrCreateUserStats(userId);
    return {
      success: true,
      message: 'Leaderboard loaded.',
      result: {
        data: mockGlobalLeaderboard,
        pageNo: 1,
        pageSize: 20,
        period: (query.period as string) || 'all',
        gameType: (query.gameType as string) || '',
        me: {
          userId,
          totalPoints: stats.totalPoints,
          rank: stats.rank
        }
      }
    };
  }

  // 5. GET /api/v1/games/daily-leaderboard
  if (route === 'daily-leaderboard' && method === 'GET') {
    return {
      success: true,
      message: 'Daily leaderboard loaded.',
      result: {
        data: [
          { userId: 'u-101', username: 'Kwame Asante', totalPoints: 480, challengesCompleted: 3, rank: 1, firstFinish: '2026-09-24T06:14:22Z' },
          { userId: 'u-103', username: 'Kofi Mensah', totalPoints: 450, challengesCompleted: 3, rank: 2, firstFinish: '2026-09-24T07:22:10Z' },
          { userId: 'u-102', username: 'Ama Osei', totalPoints: 320, challengesCompleted: 2, rank: 3, firstFinish: '2026-09-24T08:05:44Z' },
          { userId: 'u-105', username: 'Yaw Boateng', totalPoints: 200, challengesCompleted: 1, rank: 4, firstFinish: '2026-09-24T08:42:01Z' },
        ],
        pageNo: 1,
        pageSize: 20
      }
    };
  }

  // 6. GET /api/v1/games/achievements or my-achievements
  if ((route === 'achievements' || route === 'my-achievements') && method === 'GET') {
    const stats = getOrCreateUserStats(userId);
    const unlockedSet = userAchievementsMap.get(userId) || new Set<string>();

    const achievements = defaultAchievements.map(ach => ({
      ...ach,
      isUnlocked: unlockedSet.has(ach.id),
      unlockedAt: unlockedSet.has(ach.id) ? '2026-09-20T10:00:00Z' : undefined
    }));

    const resultAchievements = route === 'my-achievements'
      ? achievements.filter(a => a.isUnlocked)
      : achievements;

    return {
      success: true,
      message: 'Achievements loaded.',
      result: {
        data: resultAchievements,
        unlockedCount: unlockedSet.size
      }
    };
  }

  // 7. POST /api/v1/games/check-achievements
  if (route === 'check-achievements' && method === 'POST') {
    const stats = getOrCreateUserStats(userId);
    const unlockedSet = userAchievementsMap.get(userId) || new Set<string>();
    const newlyAwarded: string[] = [];

    for (const ach of defaultAchievements) {
      if (!unlockedSet.has(ach.id)) {
        if (ach.achievementType === 'points' && stats.totalPoints >= ach.pointsRequired) {
          unlockedSet.add(ach.id);
          newlyAwarded.push(ach.name);
          stats.totalPoints += ach.bonusPoints;
        } else if (ach.achievementType === 'games' && stats.gamesPlayed >= ach.gamesRequired) {
          unlockedSet.add(ach.id);
          newlyAwarded.push(ach.name);
          stats.totalPoints += ach.bonusPoints;
        }
      }
    }

    return {
      success: true,
      message: newlyAwarded.length > 0 ? 'New achievements unlocked!' : 'No new achievements.',
      result: {
        count: newlyAwarded.length,
        achievements: newlyAwarded
      }
    };
  }

  // 8. Start Game or Generate specific game
  if ((route === 'start' || route === 'generate-sudoku' || route === 'generate-word-search' || route === 'generate-crossword' || route === 'generate-riddle') && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    let gameType = body.gameType;
    if (route === 'generate-sudoku') gameType = 'sudoku';
    else if (route === 'generate-word-search') gameType = 'word_search';
    else if (route === 'generate-crossword') gameType = 'crossword';
    else if (route === 'generate-riddle') gameType = 'riddle';
    if (!gameType) gameType = 'sudoku';

    const difficulty = body.difficulty || 'medium';
    let built: any;

    if (gameType === 'sudoku') built = createSudokuPuzzle(difficulty);
    else if (gameType === 'word_search') built = createWordSearchPuzzle(difficulty);
    else if (gameType === 'crossword') built = createCrosswordPuzzle(difficulty);
    else built = createRiddlePuzzle(difficulty);

    const sessionId = 'sess-' + Math.random().toString(36).substring(2, 10);
    const hintsCap = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 2 : difficulty === 'expert' ? 1 : 3;

    const session: MockSession = {
      sessionId,
      userId,
      gameType,
      gameTypeCode: gameType === 'sudoku' ? 1 : gameType === 'word_search' ? 2 : gameType === 'crossword' ? 3 : 4,
      puzzleId: 'puz-' + Math.random().toString(36).substring(2, 8),
      difficulty,
      isMultiplayer: !!body.isMultiplayer || !!body.opponentId,
      opponentId: body.opponentId,
      isComplete: false,
      totalPoints: 0,
      currentScore: 0,
      mistakes: 0,
      hintsUsed: 0,
      hintsRemaining: hintsCap,
      completionTimeSeconds: 0,
      summary: built.summary,
      daily: !!body.challengeId,
      challengeId: body.challengeId || '',
      status: 'active',
      startTime: Date.now(),
      publication: built.publication,
      sources: [built.publication],
      puzzle: built.puzzle,
      solution: built.solution,
      player: {
        grid: built.puzzle.grid,
        found: [],
        answers: [],
        reveals: []
      }
    };

    mockSessions.set(sessionId, session);

    return {
      success: true,
      message: 'Puzzle ready. Words were taken from stored newspaper publications.',
      result: {
        sessionId: session.sessionId,
        userId: session.userId,
        gameType: session.gameType,
        gameTypeCode: session.gameTypeCode,
        puzzleId: session.puzzleId,
        difficulty: session.difficulty,
        isMultiplayer: session.isMultiplayer,
        opponentId: session.opponentId,
        isComplete: session.isComplete,
        totalPoints: session.totalPoints,
        currentScore: session.currentScore,
        mistakes: session.mistakes,
        hintsUsed: session.hintsUsed,
        hintsRemaining: session.hintsRemaining,
        completionTimeSeconds: session.completionTimeSeconds,
        summary: session.summary,
        daily: session.daily,
        challengeId: session.challengeId,
        status: session.status,
        publication: session.publication,
        sources: session.sources,
        puzzle: session.puzzle,
        player: session.player
      }
    };
  }

  // 9. GET /api/v1/games/current-session
  if (route === 'current-session' && method === 'GET') {
    // Find first active incomplete session for this user
    for (const s of mockSessions.values()) {
      if (s.userId === userId && !s.isComplete) {
        return {
          success: true,
          message: 'Active puzzle loaded.',
          result: {
            sessionId: s.sessionId,
            userId: s.userId,
            gameType: s.gameType,
            gameTypeCode: s.gameTypeCode,
            puzzleId: s.puzzleId,
            difficulty: s.difficulty,
            isMultiplayer: s.isMultiplayer,
            opponentId: s.opponentId,
            isComplete: s.isComplete,
            totalPoints: s.totalPoints,
            currentScore: s.currentScore,
            mistakes: s.mistakes,
            hintsUsed: s.hintsUsed,
            hintsRemaining: s.hintsRemaining,
            completionTimeSeconds: Math.floor((Date.now() - s.startTime) / 1000),
            summary: s.summary,
            daily: s.daily,
            challengeId: s.challengeId,
            status: s.status,
            publication: s.publication,
            sources: s.sources,
            puzzle: s.puzzle,
            player: s.player
          }
        };
      }
    }
    return {
      success: false,
      message: 'No active session found.',
      result: null
    };
  }

  // 10. GET /api/v1/games/session
  if (route === 'session' && method === 'GET') {
    const sessionId = (query.sessionId as string) || '';
    const s = mockSessions.get(sessionId);
    if (!s) {
      throw createError({ statusCode: 404, statusMessage: 'Session not found' });
    }
    return {
      success: true,
      message: 'Puzzle session loaded.',
      result: {
        sessionId: s.sessionId,
        userId: s.userId,
        gameType: s.gameType,
        gameTypeCode: s.gameTypeCode,
        puzzleId: s.puzzleId,
        difficulty: s.difficulty,
        isMultiplayer: s.isMultiplayer,
        opponentId: s.opponentId,
        isComplete: s.isComplete,
        totalPoints: s.totalPoints,
        currentScore: s.currentScore,
        mistakes: s.mistakes,
        hintsUsed: s.hintsUsed,
        hintsRemaining: s.hintsRemaining,
        completionTimeSeconds: s.completionTimeSeconds || Math.floor((Date.now() - s.startTime) / 1000),
        summary: s.summary,
        daily: s.daily,
        challengeId: s.challengeId,
        status: s.status,
        publication: s.publication,
        sources: s.sources,
        puzzle: s.puzzle,
        player: s.player,
        review: s.review,
        reward: s.reward
      }
    };
  }

  // 11. POST /api/v1/games/save-progress
  if (route === 'save-progress' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const sessionId = body.sessionId || (query.sessionId as string);
    const s = mockSessions.get(sessionId);
    if (!s) {
      throw createError({ statusCode: 404, statusMessage: 'Session not found' });
    }
    if (body.player) s.player = { ...s.player, ...body.player };
    if (body.grid) s.player.grid = body.grid;
    if (body.found) s.player.found = body.found;
    if (body.answers) s.player.answers = body.answers;

    return {
      success: true,
      message: 'Progress saved.',
      result: {
        sessionId: s.sessionId,
        userId: s.userId,
        gameType: s.gameType,
        player: s.player
      }
    };
  }

  // 12. POST /api/v1/games/hint
  if (route === 'hint' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const sessionId = body.sessionId || (query.sessionId as string);
    const s = mockSessions.get(sessionId);
    if (!s) throw createError({ statusCode: 404, statusMessage: 'Session not found' });
    if (s.isComplete) throw createError({ statusCode: 400, statusMessage: 'Puzzle already complete.' });
    if (s.hintsRemaining <= 0) throw createError({ statusCode: 400, statusMessage: 'No hints left on this puzzle.' });

    let hintData: any = null;

    if (s.gameType === 'sudoku' || s.gameType === 'crossword') {
      const sol = s.solution.grid;
      const cur = s.player.grid || s.puzzle.grid;
      for (let r = 0; r < sol.length; r++) {
        for (let c = 0; c < sol[r].length; c++) {
          if (sol[r][c] && sol[r][c] !== '#' && cur[r][c] !== sol[r][c]) {
            cur[r][c] = sol[r][c];
            hintData = { type: 'letter', row: r, col: c, value: sol[r][c] };
            s.player.reveals.push(hintData);
            break;
          }
        }
        if (hintData) break;
      }
    } else if (s.gameType === 'word_search') {
      const placements = s.solution.placements || [];
      const foundSet = new Set((s.player.found || []).map((f: any) => (typeof f === 'string' ? f : f.word)));
      for (const p of placements) {
        if (!foundSet.has(p.word)) {
          hintData = { type: 'placement', ...p };
          s.player.found.push(p);
          s.player.reveals.push(hintData);
          break;
        }
      }
    } else if (s.gameType === 'riddle') {
      const items = s.solution.items || [];
      const answeredSet = new Set((s.player.answers || []).map((a: any) => a.id));
      for (const item of items) {
        if (!answeredSet.has(item.id)) {
          hintData = { type: 'letters', id: item.id, prefix: item.answer.substring(0, 3) };
          s.player.reveals.push(hintData);
          break;
        }
      }
    }

    s.hintsUsed += 1;
    s.hintsRemaining = Math.max(0, s.hintsRemaining - 1);

    return {
      success: true,
      message: 'Hint revealed. It will reduce your score.',
      result: {
        sessionId: s.sessionId,
        hintsUsed: s.hintsUsed,
        hintsRemaining: s.hintsRemaining,
        hint: hintData,
        player: s.player
      }
    };
  }

  // 13. POST /api/v1/games/submit
  if (route === 'submit' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const sessionId = body.sessionId || (query.sessionId as string);
    const s = mockSessions.get(sessionId);
    if (!s) throw createError({ statusCode: 404, statusMessage: 'Session not found' });

    if (body.grid) s.player.grid = body.grid;
    if (body.found) s.player.found = body.found;
    if (body.answers) s.player.answers = body.answers;

    const finalize = body.finalize !== false;

    // Grade puzzle
    let correct = 0;
    let total = 0;
    let wrong = 0;
    const wrongCells: Array<{ row: number; col: number }> = [];

    if (s.gameType === 'sudoku' || s.gameType === 'crossword') {
      const sol = s.solution.grid;
      const cur = s.player.grid || s.puzzle.grid;
      for (let r = 0; r < sol.length; r++) {
        for (let c = 0; c < sol[r].length; c++) {
          if (sol[r][c] && sol[r][c] !== '#') {
            total++;
            if (cur[r][c] && cur[r][c].toUpperCase() === sol[r][c].toUpperCase()) {
              correct++;
            } else {
              wrong++;
              wrongCells.push({ row: r, col: c });
            }
          }
        }
      }
    } else if (s.gameType === 'word_search') {
      const placements = s.solution.placements || [];
      total = placements.length;
      const foundWords = new Set((s.player.found || []).map((f: any) => (typeof f === 'string' ? f.toUpperCase() : f.word?.toUpperCase())));
      for (const p of placements) {
        if (foundWords.has(p.word.toUpperCase())) {
          correct++;
        } else {
          wrong++;
        }
      }
    } else if (s.gameType === 'riddle') {
      const items = s.solution.items || [];
      total = items.length;
      const answersMap = new Map((s.player.answers || []).map((a: any) => [a.id, (a.value || a.answer || '').toUpperCase().trim()]));
      for (const item of items) {
        if (answersMap.get(item.id) === item.answer.toUpperCase().trim()) {
          correct++;
        } else {
          wrong++;
        }
      }
    }

    const accuracy = total > 0 ? correct / total : 0;
    const solved = total > 0 && correct === total;

    // Intermediate check
    if (!finalize) {
      if (wrong > 0) s.mistakes += 1;
      return {
        success: true,
        message: wrong > 0 ? 'Some answers are still wrong.' : 'Looking good so far.',
        result: {
          sessionId: s.sessionId,
          mistakes: s.mistakes,
          correct,
          total,
          accuracy,
          check: {
            solved,
            wrongCells,
            summary: `${correct}/${total} correct`
          }
        }
      };
    }

    // Finalize submission
    s.isComplete = true;
    s.status = 'complete';
    const elapsed = Math.max(5, Math.floor((Date.now() - s.startTime) / 1000));
    s.completionTimeSeconds = elapsed;

    const multiplier = s.difficulty === 'easy' ? 1 : s.difficulty === 'medium' ? 2 : s.difficulty === 'hard' ? 3 : 4;
    const base = s.gameType === 'crossword' ? 70 : s.gameType === 'sudoku' ? 60 : s.gameType === 'word_search' ? 50 : 40;
    const accuracyPoints = Math.round(base * multiplier * accuracy);

    const targetSeconds = s.gameType === 'crossword' ? 600 : s.gameType === 'sudoku' ? 540 : 360;
    let timeBonus = 0;
    if (solved && elapsed < targetSeconds) {
      timeBonus = Math.round(base * multiplier * 0.5 * ((targetSeconds - elapsed) / targetSeconds));
    }

    const perfectBonus = solved && s.mistakes === 0 && s.hintsUsed === 0 ? 100 * multiplier : 0;
    const streakBonus = solved ? 20 : 0;
    const mistakePenalty = (s.mistakes + wrong) * 3;
    const hintPenalty = s.hintsUsed * 5;

    let pointsEarned = accuracyPoints + timeBonus + perfectBonus + streakBonus - mistakePenalty - hintPenalty;
    if (pointsEarned < 0 || accuracy <= 0) pointsEarned = 0;

    // Daily bonus
    let dailyBonus = 0;
    if (s.daily && solved) {
      dailyBonus = 200;
      pointsEarned += dailyBonus;
    }

    const breakdown = {
      base,
      difficultyMultiplier: multiplier,
      accuracy,
      accuracyPoints,
      timeBonus,
      perfectBonus,
      streakBonus,
      mistakePenalty,
      hintPenalty,
      elapsedSeconds: elapsed
    };

    const stats = getOrCreateUserStats(userId);
    const rankBefore = stats.rank;
    stats.totalPoints += pointsEarned;
    stats.gamesPlayed += 1;
    if (solved) {
      stats.gamesWon += 1;
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) stats.longestStreak = stats.currentStreak;
    } else {
      stats.gamesLost += 1;
      stats.currentStreak = 0;
    }
    stats.winRate = stats.gamesPlayed > 0 ? stats.gamesWon / stats.gamesPlayed : 0;
    stats.rank = Math.max(1, rankBefore - (pointsEarned > 100 ? 2 : 1));
    const rankAfter = stats.rank;

    // Check newly unlocked achievements
    const unlockedSet = userAchievementsMap.get(userId) || new Set<string>();
    const newAchievements: string[] = [];
    for (const ach of defaultAchievements) {
      if (!unlockedSet.has(ach.id)) {
        if (ach.achievementType === 'games' && stats.gamesPlayed >= ach.gamesRequired) {
          unlockedSet.add(ach.id);
          newAchievements.push(ach.name);
        } else if (ach.achievementType === 'points' && stats.totalPoints >= ach.pointsRequired) {
          unlockedSet.add(ach.id);
          newAchievements.push(ach.name);
        } else if (ach.achievementType === 'perfect' && perfectBonus > 0) {
          unlockedSet.add(ach.id);
          newAchievements.push(ach.name);
        }
      }
    }

    const reward = {
      pointsEarned,
      bonusPoints: perfectBonus + streakBonus + dailyBonus,
      message: solved ? 'Congratulations! Puzzle completed!' : 'Good attempt! Keep sharpening your skills.',
      breakdown,
      rankBefore,
      rankAfter,
      rankChange: rankBefore - rankAfter,
      newAchievements
    };

    s.reward = reward;
    s.totalPoints = pointsEarned;
    s.review = s.solution;

    return {
      success: true,
      message: reward.message,
      result: {
        sessionId: s.sessionId,
        userId: s.userId,
        gameType: s.gameType,
        isComplete: true,
        totalPoints: pointsEarned,
        mistakes: s.mistakes + wrong,
        hintsUsed: s.hintsUsed,
        completionTimeSeconds: elapsed,
        accuracy,
        correct,
        total,
        reward,
        review: s.solution,
        puzzle: s.puzzle,
        player: s.player
      }
    };
  }

  // 14. DELETE /api/v1/games/session
  if (route === 'session' && method === 'DELETE') {
    const sessionId = (query.sessionId as string) || '';
    mockSessions.delete(sessionId);
    return {
      success: true,
      message: 'Puzzle session deleted.'
    };
  }

  // 15. GET /api/v1/games/history
  if (route === 'history' && method === 'GET') {
    const historyList: any[] = [];
    for (const s of mockSessions.values()) {
      if (s.userId === userId) {
        historyList.push({
          sessionId: s.sessionId,
          gameType: s.gameType,
          gameTypeCode: s.gameTypeCode,
          difficulty: s.difficulty,
          isComplete: s.isComplete,
          totalPoints: s.totalPoints,
          completionTimeSeconds: s.completionTimeSeconds,
          mistakes: s.mistakes,
          hintsUsed: s.hintsUsed,
          summary: s.summary,
          publication: s.publication,
          startedAt: new Date(s.startTime).toISOString(),
          status: s.status
        });
      }
    }

    return {
      success: true,
      message: 'Game history loaded.',
      result: {
        data: historyList,
        totalCount: historyList.length,
        pageNo: 1,
        pageSize: 10,
        totalPages: 1
      }
    };
  }

  // 16. GET /api/v1/games/stats
  if (route === 'stats' && method === 'GET') {
    const stats = getOrCreateUserStats(userId);
    return {
      success: true,
      message: 'Stats loaded.',
      result: stats
    };
  }

  // 17. GET /api/v1/games/points
  if (route === 'points' && method === 'GET') {
    const stats = getOrCreateUserStats(userId);
    return {
      success: true,
      message: 'Points loaded.',
      result: {
        userId,
        totalPoints: stats.totalPoints,
        rank: stats.rank
      }
    };
  }

  // 18. GET /api/v1/games/daily
  if (route === 'daily' && method === 'GET') {
    const today = new Date().toISOString().split('T')[0];
    const completedSet = dailyCompletionsMap.get(userId) || new Set<string>();

    const challenges = [
      {
        id: 'dc-sudoku',
        gameType: 'sudoku',
        difficulty: 'medium',
        featured: true,
        bonus: 200,
        createdAt: today,
        expiresAt: today + 'T23:59:59Z',
        completed: completedSet.has('dc-sudoku'),
        bonusEarned: completedSet.has('dc-sudoku') ? 200 : undefined,
        summary: 'Letter Sudoku on "EDITORIAL" from Daily Graphic',
        publication: { publicationName: 'Daily Graphic', newspaperTitle: 'National Morning Digest', publicationDate: today, pageNumber: 2 }
      },
      {
        id: 'dc-crossword',
        gameType: 'crossword',
        difficulty: 'medium',
        featured: false,
        bonus: 200,
        createdAt: today,
        expiresAt: today + 'T23:59:59Z',
        completed: completedSet.has('dc-crossword'),
        bonusEarned: completedSet.has('dc-crossword') ? 200 : undefined,
        summary: 'Crossword on today\'s economic and national headlines',
        publication: { publicationName: 'Daily Graphic', newspaperTitle: 'Business & Economy', publicationDate: today, pageNumber: 4 },
        wordCount: 7
      },
      {
        id: 'dc-wordsearch',
        gameType: 'word_search',
        difficulty: 'medium',
        featured: false,
        bonus: 200,
        createdAt: today,
        expiresAt: today + 'T23:59:59Z',
        completed: completedSet.has('dc-wordsearch'),
        bonusEarned: completedSet.has('dc-wordsearch') ? 200 : undefined,
        summary: 'Word Search on Ghanaian sports and arts vocabulary',
        publication: { publicationName: 'Graphic Showbiz', newspaperTitle: 'Arts, Culture & Sports', publicationDate: today, pageNumber: 6 },
        wordCount: 6
      },
      {
        id: 'dc-riddle',
        gameType: 'riddle',
        difficulty: 'medium',
        featured: false,
        bonus: 200,
        createdAt: today,
        expiresAt: today + 'T23:59:59Z',
        completed: completedSet.has('dc-riddle'),
        bonusEarned: completedSet.has('dc-riddle') ? 200 : undefined,
        summary: '4 newsroom riddles from today\'s publication sentences',
        publication: { publicationName: 'The Mirror', newspaperTitle: 'Human Interest Report', publicationDate: today, pageNumber: 5 },
        questionCount: 4
      }
    ];

    return {
      success: true,
      message: "Today's challenges are ready.",
      result: {
        date: today,
        challenges,
        completedCount: challenges.filter(c => c.completed).length,
        scoring: {
          mistakePenalty: 3,
          hintPenalty: 5,
          perfectBonus: 100,
          dailyChallengeBonus: 200,
          streakBonusPerDay: 10,
          maxStreakDays: 50,
          rivalryBonus: 25,
          achievementBonus: 100,
          partialDailyThresholdPercent: 60,
          difficultyMultipliers: { easy: 1, medium: 2, hard: 3, expert: 4 },
          notes: 'Daily puzzles earn an exclusive 200 bonus points upon accurate completion!'
        }
      }
    };
  }

  // 19. POST /api/v1/games/start-daily
  if (route === 'start-daily' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const challengeId = body.challengeId || 'dc-sudoku';
    const gameType = body.gameType || (challengeId.includes('crossword') ? 'crossword' : challengeId.includes('wordsearch') ? 'word_search' : challengeId.includes('riddle') ? 'riddle' : 'sudoku');

    let built: any;
    if (gameType === 'sudoku') built = createSudokuPuzzle('medium');
    else if (gameType === 'word_search') built = createWordSearchPuzzle('medium');
    else if (gameType === 'crossword') built = createCrosswordPuzzle('medium');
    else built = createRiddlePuzzle('medium');

    const sessionId = 'sess-daily-' + Math.random().toString(36).substring(2, 10);
    const session: MockSession = {
      sessionId,
      userId,
      gameType,
      gameTypeCode: gameType === 'sudoku' ? 1 : gameType === 'word_search' ? 2 : gameType === 'crossword' ? 3 : 4,
      puzzleId: 'daily-' + challengeId,
      difficulty: 'medium',
      isMultiplayer: false,
      isComplete: false,
      totalPoints: 0,
      currentScore: 0,
      mistakes: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      completionTimeSeconds: 0,
      summary: built.summary,
      daily: true,
      challengeId,
      status: 'active',
      startTime: Date.now(),
      publication: built.publication,
      sources: [built.publication],
      puzzle: built.puzzle,
      solution: built.solution,
      player: {
        grid: built.puzzle.grid,
        found: [],
        answers: [],
        reveals: []
      }
    };

    mockSessions.set(sessionId, session);

    return {
      success: true,
      message: 'Daily challenge started. Everyone is solving this same publication puzzle.',
      result: {
        sessionId: session.sessionId,
        userId: session.userId,
        gameType: session.gameType,
        gameTypeCode: session.gameTypeCode,
        puzzleId: session.puzzleId,
        difficulty: session.difficulty,
        isMultiplayer: false,
        isComplete: false,
        totalPoints: 0,
        currentScore: 0,
        mistakes: 0,
        hintsUsed: 0,
        hintsRemaining: 3,
        summary: session.summary,
        daily: true,
        challengeId,
        status: 'active',
        publication: session.publication,
        sources: session.sources,
        puzzle: session.puzzle,
        player: session.player
      }
    };
  }

  // 20. POST /api/v1/games/complete-daily
  if (route === 'complete-daily' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const sessionId = body.sessionId || (query.sessionId as string);
    const s = mockSessions.get(sessionId);
    if (!s) throw createError({ statusCode: 404, statusMessage: 'Session not found' });

    let completedSet = dailyCompletionsMap.get(userId);
    if (!completedSet) {
      completedSet = new Set<string>();
      dailyCompletionsMap.set(userId, completedSet);
    }
    completedSet.add(s.challengeId || 'dc-sudoku');

    return {
      success: true,
      message: 'Daily bonus claimed successfully!',
      result: {
        bonusEarned: 200,
        completedAt: new Date().toISOString(),
        alreadyClaimed: false
      }
    };
  }

  // 21. GET /api/v1/games/rivals
  if (route === 'rivals' && method === 'GET') {
    return {
      success: true,
      message: 'Rival board loaded.',
      result: {
        data: mockRivals,
        note: 'Rivals are readers you have challenged, plus your own standing.'
      }
    };
  }

  // 22. Challenges / Multiplayer
  if (route === 'challenges' && method === 'GET') {
    return {
      success: true,
      message: 'Challenges loaded.',
      result: {
        data: mockChallengesList
      }
    };
  }

  if (route === 'challenge' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const newChallenge = {
      challengeId: 'chal-' + Math.random().toString(36).substring(2, 8),
      gameType: body.gameType || 'crossword',
      difficulty: body.difficulty || 'medium',
      status: 'active',
      summary: `${body.gameType || 'Crossword'} challenge with publication-backed words`,
      youAreChallenger: true,
      challengerId: userId,
      opponentId: body.opponentId,
      challengerName: 'You',
      opponentName: body.opponentName || 'Rival Reader',
      publication: {
        publicationName: 'Daily Graphic',
        newspaperTitle: 'National Edition',
        publicationDate: '2026-09-24',
        pageNumber: 3
      },
      startedAt: new Date().toISOString()
    };
    mockChallengesList.unshift(newChallenge);

    return {
      success: true,
      message: 'Challenge sent. You both play the same publication puzzle.',
      result: newChallenge
    };
  }

  if (route === 'accept-challenge' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const challengeId = body.challengeId;
    const item = mockChallengesList.find(c => c.challengeId === challengeId);
    if (item) item.status = 'active';

    // Start session
    const built = createCrosswordPuzzle(item?.difficulty || 'medium');
    const sessionId = 'sess-' + Math.random().toString(36).substring(2, 8);
    const session: MockSession = {
      sessionId,
      userId,
      gameType: item?.gameType || 'crossword',
      gameTypeCode: 3,
      puzzleId: 'puz-multi',
      difficulty: item?.difficulty || 'medium',
      isMultiplayer: true,
      opponentId: item?.challengerId,
      isComplete: false,
      totalPoints: 0,
      currentScore: 0,
      mistakes: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      completionTimeSeconds: 0,
      summary: built.summary,
      daily: false,
      status: 'active',
      startTime: Date.now(),
      publication: built.publication,
      sources: [built.publication],
      puzzle: built.puzzle,
      solution: built.solution,
      player: {
        grid: built.puzzle.grid,
        found: [],
        answers: [],
        reveals: []
      }
    };
    mockSessions.set(sessionId, session);

    return {
      success: true,
      message: 'Challenge accepted. The puzzle is the same one your rival is solving.',
      result: session
    };
  }

  if (route === 'decline-challenge' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const challengeId = body.challengeId;
    const item = mockChallengesList.find(c => c.challengeId === challengeId);
    if (item) item.status = 'declined';

    return {
      success: true,
      message: 'Challenge declined.'
    };
  }

  if (route === 'submit-multiplayer' && method === 'POST') {
    return {
      success: true,
      message: 'Rivalry match scored! Rivalry bonus awarded.',
      result: {
        winnerPoints: 125,
        rivalryBonus: 25
      }
    };
  }

  // 23. POST /api/v1/games/reset-progress
  if (route === 'reset-progress' && method === 'POST') {
    userStatsMap.delete(userId);
    userAchievementsMap.delete(userId);
    dailyCompletionsMap.delete(userId);
    return {
      success: true,
      message: 'User progress reset successfully.'
    };
  }

  return {
    success: false,
    message: `Unknown games endpoint: ${route}`
  };
});
