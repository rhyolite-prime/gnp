// Auto-authored puzzle bank for the Games module (plain JS data — API blueprint).
// Generated and validated offline; treated as ordinary data by mocks/games/index.js.
//
// Server-only note: each puzzle carries a `solution` object. In a real API the
// solution must NEVER leave the server (it powers scoring, hints and reviews);
// the mock state machine in mocks/games/index.js strips it before returning sessions.

export const PUBLICATION_SOURCES = [
  {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
},
  {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
},
  {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
},
  {
  "newspaperId": "np-1004",
  "publicationId": "pub-04",
  "publicationName": "Graphic Sports",
  "newspaperTitle": "Graphic Sports — Black Stars Qualifier Special",
  "publicationDate": "2026-10-17",
  "pageNumber": 1,
  "snippet": "Black Stars gather in Kumasi ahead of the qualifier"
},
  {
  "newspaperId": "np-1006",
  "publicationId": "pub-06",
  "publicationName": "Junior Graphic",
  "newspaperTitle": "Junior Graphic — Schools & Science",
  "publicationDate": "2026-10-16",
  "pageNumber": 5,
  "snippet": "Young reporters club: how a front page is made"
},
];

export const PUZZLE_BANK = {
  sudoku: [
    {
      puzzleId: 'sud-frontdesk-easy',
      gameType: 'sudoku',
      difficulty: 'easy',
      summary: 'Letter Sudoku from Thursday’s Daily Graphic front desk quote',
      title: 'Front Desk Sudoku',
      size: 9,
      symbols: [
  "F",
  "R",
  "O",
  "N",
  "T",
  "D",
  "E",
  "S",
  "K"
],
      symbolWord: 'FRONTDESK',
      anchorQuote: 'Every edition starts at the front desk — the newsroom’s first stop for tips, leads and late wires.',
      rules: 'Fill every row, column and 3×3 box with the nine letters of FRONTDESK.',
      grid: [
  [
    "K",
    "",
    "E",
    "",
    "",
    "R",
    "",
    "",
    ""
  ],
  [
    "S",
    "",
    "",
    "",
    "",
    "K",
    "N",
    "",
    "E"
  ],
  [
    "R",
    "",
    "",
    "E",
    "F",
    "D",
    "O",
    "K",
    ""
  ],
  [
    "F",
    "",
    "D",
    "K",
    "R",
    "",
    "",
    "T",
    ""
  ],
  [
    "N",
    "",
    "",
    "",
    "O",
    "",
    "R",
    "",
    "D"
  ],
  [
    "",
    "",
    "O",
    "",
    "",
    "",
    "K",
    "",
    ""
  ],
  [
    "",
    "K",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  [
    "O",
    "F",
    "",
    "T",
    "",
    "",
    "",
    "S",
    ""
  ],
  [
    "",
    "N",
    "S",
    "",
    "K",
    "F",
    "E",
    "",
    ""
  ]
],
      given: [
  [
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    false,
    false
  ],
  [
    true,
    false,
    false,
    false,
    false,
    true,
    true,
    false,
    true
  ],
  [
    true,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false
  ],
  [
    true,
    false,
    true,
    true,
    true,
    false,
    false,
    true,
    false
  ],
  [
    true,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true
  ],
  [
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false
  ],
  [
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ],
  [
    true,
    true,
    false,
    true,
    false,
    false,
    false,
    true,
    false
  ],
  [
    false,
    true,
    true,
    false,
    true,
    true,
    true,
    false,
    false
  ]
],
      source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
},
      solution: { grid: [
  [
    "K",
    "O",
    "E",
    "N",
    "S",
    "R",
    "T",
    "D",
    "F"
  ],
  [
    "S",
    "D",
    "F",
    "O",
    "T",
    "K",
    "N",
    "R",
    "E"
  ],
  [
    "R",
    "T",
    "N",
    "E",
    "F",
    "D",
    "O",
    "K",
    "S"
  ],
  [
    "F",
    "E",
    "D",
    "K",
    "R",
    "N",
    "S",
    "T",
    "O"
  ],
  [
    "N",
    "S",
    "K",
    "F",
    "O",
    "T",
    "R",
    "E",
    "D"
  ],
  [
    "T",
    "R",
    "O",
    "D",
    "E",
    "S",
    "K",
    "F",
    "N"
  ],
  [
    "E",
    "K",
    "T",
    "S",
    "D",
    "O",
    "F",
    "N",
    "R"
  ],
  [
    "O",
    "F",
    "R",
    "T",
    "N",
    "E",
    "D",
    "S",
    "K"
  ],
  [
    "D",
    "N",
    "S",
    "R",
    "K",
    "F",
    "E",
    "O",
    "T"
  ]
] },
    },
    {
      puzzleId: 'sud-frontdesk-hard',
      gameType: 'sudoku',
      difficulty: 'hard',
      summary: 'Letter Sudoku — fewer givens, same nine newsroom letters',
      title: 'Late Wire Sudoku',
      size: 9,
      symbols: [
  "F",
  "R",
  "O",
  "N",
  "T",
  "D",
  "E",
  "S",
  "K"
],
      symbolWord: 'FRONTDESK',
      anchorQuote: 'The late wire hums after midnight — one desk, nine letters, one clean edition.',
      rules: 'Fill every row, column and 3×3 box with the nine letters of FRONTDESK.',
      grid: [
  [
    "N",
    "F",
    "",
    "",
    "",
    "D",
    "",
    "",
    ""
  ],
  [
    "",
    "E",
    "",
    "",
    "",
    "N",
    "",
    "",
    "R"
  ],
  [
    "",
    "",
    "",
    "S",
    "K",
    "",
    "F",
    "",
    "E"
  ],
  [
    "T",
    "K",
    "N",
    "R",
    "",
    "",
    "",
    "S",
    ""
  ],
  [
    "",
    "",
    "",
    "D",
    "",
    "",
    "",
    "",
    "N"
  ],
  [
    "O",
    "",
    "",
    "",
    "S",
    "",
    "",
    "E",
    ""
  ],
  [
    "",
    "O",
    "",
    "",
    "",
    "F",
    "",
    "R",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "T",
    "",
    "",
    ""
  ],
  [
    "K",
    "",
    "F",
    "",
    "R",
    "",
    "",
    "",
    ""
  ]
],
      given: [
  [
    true,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false
  ],
  [
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    true
  ],
  [
    false,
    false,
    false,
    true,
    true,
    false,
    true,
    false,
    true
  ],
  [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    true,
    false
  ],
  [
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    true
  ],
  [
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    true,
    false
  ],
  [
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    true,
    false
  ],
  [
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false
  ],
  [
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    false,
    false
  ]
],
      source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
},
      solution: { grid: [
  [
    "N",
    "F",
    "R",
    "T",
    "E",
    "D",
    "S",
    "O",
    "K"
  ],
  [
    "S",
    "E",
    "K",
    "F",
    "O",
    "N",
    "D",
    "T",
    "R"
  ],
  [
    "D",
    "T",
    "O",
    "S",
    "K",
    "R",
    "F",
    "N",
    "E"
  ],
  [
    "T",
    "K",
    "N",
    "R",
    "F",
    "E",
    "O",
    "S",
    "D"
  ],
  [
    "F",
    "S",
    "E",
    "D",
    "T",
    "O",
    "R",
    "K",
    "N"
  ],
  [
    "O",
    "R",
    "D",
    "N",
    "S",
    "K",
    "T",
    "E",
    "F"
  ],
  [
    "E",
    "O",
    "T",
    "K",
    "D",
    "F",
    "N",
    "R",
    "S"
  ],
  [
    "R",
    "D",
    "S",
    "E",
    "N",
    "T",
    "K",
    "F",
    "O"
  ],
  [
    "K",
    "N",
    "F",
    "O",
    "R",
    "S",
    "E",
    "D",
    "T"
  ]
] },
    },
  ],

  word_search: [
    {
      puzzleId: 'ws-newsroom-easy',
      gameType: 'word_search',
      difficulty: 'easy',
      summary: 'Find 8 newsroom words hidden in the grid',
      title: 'Around the Newsroom',
      size: 12,
      grid: [
  [
    "C",
    "I",
    "B",
    "N",
    "K",
    "F",
    "R",
    "I",
    "E",
    "E",
    "R",
    "Q"
  ],
  [
    "W",
    "L",
    "S",
    "P",
    "C",
    "B",
    "R",
    "A",
    "R",
    "Y",
    "U",
    "W"
  ],
  [
    "L",
    "K",
    "N",
    "R",
    "R",
    "O",
    "E",
    "M",
    "C",
    "O",
    "Y",
    "B"
  ],
  [
    "C",
    "Y",
    "A",
    "M",
    "T",
    "E",
    "U",
    "F",
    "T",
    "Y",
    "Y",
    "P"
  ],
  [
    "O",
    "P",
    "W",
    "I",
    "U",
    "W",
    "S",
    "E",
    "P",
    "L",
    "B",
    "M"
  ],
  [
    "H",
    "A",
    "D",
    "W",
    "B",
    "L",
    "S",
    "S",
    "I",
    "L",
    "M",
    "O"
  ],
  [
    "U",
    "E",
    "E",
    "P",
    "F",
    "L",
    "O",
    "N",
    "K",
    "R",
    "D",
    "C"
  ],
  [
    "W",
    "Y",
    "D",
    "S",
    "W",
    "F",
    "E",
    "C",
    "K",
    "E",
    "R",
    "S"
  ],
  [
    "S",
    "F",
    "W",
    "H",
    "E",
    "A",
    "D",
    "L",
    "I",
    "N",
    "E",
    "R"
  ],
  [
    "D",
    "G",
    "H",
    "N",
    "I",
    "L",
    "C",
    "C",
    "K",
    "P",
    "G",
    "B"
  ],
  [
    "E",
    "R",
    "E",
    "T",
    "R",
    "O",
    "P",
    "E",
    "R",
    "I",
    "T",
    "S"
  ],
  [
    "K",
    "U",
    "L",
    "O",
    "A",
    "R",
    "C",
    "H",
    "I",
    "V",
    "E",
    "I"
  ]
],
      directions: [
  "across",
  "down",
  "down-right",
  "backwards",
  "up-right",
  "down-left",
  "up-left"
],
      words: [
        { word: 'HEADLINE', length: 8, clue: 'The top story of the day, set in the biggest type.', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
        { word: 'REPORTER', length: 8, clue: 'The byline you see above the story.', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
        { word: 'EDITOR', length: 6, clue: 'The person who decides what makes the front page.', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
        { word: 'BYLINE', length: 6, clue: 'The writer’s name, printed above the story.', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
        { word: 'COLUMN', length: 6, clue: 'A regular opinion slot on the op-ed page.', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
        { word: 'PRESS', length: 5, clue: 'Another name for the newspapers themselves.', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
        { word: 'QUOTE', length: 5, clue: 'The words a source says, set in quotation marks.', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
        { word: 'ARCHIVE', length: 7, clue: 'Where every back issue lives.', source: {
  "newspaperId": "np-1006",
  "publicationId": "pub-06",
  "publicationName": "Junior Graphic",
  "newspaperTitle": "Junior Graphic — Schools & Science",
  "publicationDate": "2026-10-16",
  "pageNumber": 5,
  "snippet": "Young reporters club: how a front page is made"
} },
      ],
      source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
},
      solution: { placements: [
  {
    "word": "HEADLINE",
    "row": 8,
    "col": 3,
    "dRow": 0,
    "dCol": 1,
    "direction": "across"
  },
  {
    "word": "REPORTER",
    "row": 10,
    "col": 8,
    "dRow": 0,
    "dCol": -1,
    "direction": "backwards"
  },
  {
    "word": "EDITOR",
    "row": 6,
    "col": 1,
    "dRow": -1,
    "dCol": 1,
    "direction": "up-right"
  },
  {
    "word": "BYLINE",
    "row": 2,
    "col": 11,
    "dRow": 1,
    "dCol": -1,
    "direction": "down-left"
  },
  {
    "word": "COLUMN",
    "row": 7,
    "col": 7,
    "dRow": -1,
    "dCol": -1,
    "direction": "up-left"
  },
  {
    "word": "PRESS",
    "row": 1,
    "col": 3,
    "dRow": 1,
    "dCol": 1,
    "direction": "down-right"
  },
  {
    "word": "QUOTE",
    "row": 0,
    "col": 11,
    "dRow": 1,
    "dCol": -1,
    "direction": "down-left"
  },
  {
    "word": "ARCHIVE",
    "row": 11,
    "col": 4,
    "dRow": 0,
    "dCol": 1,
    "direction": "across"
  }
] },
    },
    {
      puzzleId: 'ws-deadline-hard',
      gameType: 'word_search',
      difficulty: 'hard',
      summary: 'Find 8 newsroom words — some run backwards and diagonally',
      title: 'Deadline Dash',
      size: 13,
      grid: [
  [
    "M",
    "T",
    "Y",
    "L",
    "E",
    "C",
    "I",
    "B",
    "H",
    "M",
    "G",
    "C",
    "A"
  ],
  [
    "A",
    "D",
    "L",
    "R",
    "O",
    "N",
    "H",
    "N",
    "E",
    "W",
    "E",
    "Y",
    "B"
  ],
  [
    "O",
    "W",
    "A",
    "S",
    "A",
    "O",
    "I",
    "C",
    "E",
    "A",
    "G",
    "L",
    "P"
  ],
  [
    "S",
    "D",
    "B",
    "U",
    "C",
    "U",
    "N",
    "L",
    "G",
    "C",
    "A",
    "B",
    "T"
  ],
  [
    "L",
    "U",
    "R",
    "W",
    "L",
    "Y",
    "T",
    "H",
    "D",
    "Y",
    "C",
    "E",
    "D"
  ],
  [
    "K",
    "E",
    "O",
    "N",
    "F",
    "W",
    "F",
    "I",
    "O",
    "A",
    "D",
    "L",
    "P"
  ],
  [
    "F",
    "C",
    "A",
    "E",
    "C",
    "F",
    "F",
    "U",
    "B",
    "I",
    "E",
    "R",
    "N"
  ],
  [
    "N",
    "P",
    "D",
    "W",
    "A",
    "H",
    "T",
    "A",
    "T",
    "O",
    "W",
    "D",
    "D"
  ],
  [
    "O",
    "C",
    "S",
    "S",
    "R",
    "H",
    "U",
    "I",
    "H",
    "I",
    "H",
    "D",
    "T"
  ],
  [
    "I",
    "F",
    "H",
    "R",
    "T",
    "L",
    "O",
    "A",
    "P",
    "H",
    "E",
    "W",
    "L"
  ],
  [
    "T",
    "U",
    "E",
    "O",
    "O",
    "N",
    "N",
    "H",
    "H",
    "M",
    "S",
    "E",
    "K"
  ],
  [
    "O",
    "K",
    "E",
    "O",
    "O",
    "C",
    "D",
    "P",
    "T",
    "U",
    "I",
    "K",
    "A"
  ],
  [
    "U",
    "S",
    "T",
    "M",
    "N",
    "R",
    "P",
    "I",
    "C",
    "T",
    "U",
    "R",
    "E"
  ]
],
      directions: [
  "across",
  "down",
  "up-left",
  "down-left"
],
      words: [
        { word: 'BROADSHEET', length: 10, clue: 'The large-format newspaper itself.', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
        { word: 'NEWSROOM', length: 8, clue: 'Where the stories are written and edited.', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
        { word: 'DEADLINE', length: 8, clue: 'The hour a story must be filed.', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
        { word: 'EDITION', length: 7, clue: 'One day’s issue of the paper.', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
        { word: 'OBITUARY', length: 8, clue: 'The notice that marks a life, often on the back pages.', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
        { word: 'CARTOON', length: 7, clue: 'The daily drawing that says in one frame what the column says in 800 words.', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
        { word: 'LAYOUT', length: 6, clue: 'How stories and pictures sit on the page.', source: {
  "newspaperId": "np-1006",
  "publicationId": "pub-06",
  "publicationName": "Junior Graphic",
  "newspaperTitle": "Junior Graphic — Schools & Science",
  "publicationDate": "2026-10-16",
  "pageNumber": 5,
  "snippet": "Young reporters club: how a front page is made"
} },
        { word: 'PICTURE', length: 7, clue: 'What every picture desk swears is worth a thousand words.', source: {
  "newspaperId": "np-1004",
  "publicationId": "pub-04",
  "publicationName": "Graphic Sports",
  "newspaperTitle": "Graphic Sports — Black Stars Qualifier Special",
  "publicationDate": "2026-10-17",
  "pageNumber": 1,
  "snippet": "Black Stars gather in Kumasi ahead of the qualifier"
} },
      ],
      source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
},
      solution: { placements: [
  {
    "word": "BROADSHEET",
    "row": 3,
    "col": 2,
    "dRow": 1,
    "dCol": 0,
    "direction": "down"
  },
  {
    "word": "NEWSROOM",
    "row": 5,
    "col": 3,
    "dRow": 1,
    "dCol": 0,
    "direction": "down"
  },
  {
    "word": "DEADLINE",
    "row": 7,
    "col": 11,
    "dRow": -1,
    "dCol": -1,
    "direction": "up-left"
  },
  {
    "word": "EDITION",
    "row": 4,
    "col": 11,
    "dRow": 1,
    "dCol": -1,
    "direction": "down-left"
  },
  {
    "word": "OBITUARY",
    "row": 7,
    "col": 9,
    "dRow": -1,
    "dCol": -1,
    "direction": "up-left"
  },
  {
    "word": "CARTOON",
    "row": 6,
    "col": 4,
    "dRow": 1,
    "dCol": 0,
    "direction": "down"
  },
  {
    "word": "LAYOUT",
    "row": 2,
    "col": 11,
    "dRow": 1,
    "dCol": -1,
    "direction": "down-left"
  },
  {
    "word": "PICTURE",
    "row": 12,
    "col": 6,
    "dRow": 0,
    "dCol": 1,
    "direction": "across"
  }
] },
    },
  ],

  crossword: [
    {
      puzzleId: 'cw-heart-square',
      gameType: 'crossword',
      difficulty: 'easy',
      summary: 'A 5×5 mini crossword built from this week’s pages',
      title: 'The Mini',
      size: 5,
      grid: [
  [
    "",
    "",
    "",
    "",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    ""
  ]
],
      numbers: [
  [
    1,
    2,
    3,
    4,
    5
  ],
  [
    6,
    0,
    0,
    0,
    0
  ],
  [
    7,
    0,
    0,
    0,
    0
  ],
  [
    8,
    0,
    0,
    0,
    0
  ],
  [
    9,
    0,
    0,
    0,
    0
  ]
],
      clues: {
        across: [
          { number: 1, clue: 'What the cardiologist worries about, in Tuesday’s health feature', length: 5, row: 0, col: 0, direction: 'across', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
          { number: 6, clue: 'Glowing remains after the Ashanti fire report', length: 5, row: 1, col: 0, direction: 'across', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
          { number: 7, clue: 'Mistreatment the labour column says to report', length: 5, row: 2, col: 0, direction: 'across', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
          { number: 8, clue: 'Amber’s sticky origin, per the science page', length: 5, row: 3, col: 0, direction: 'across', source: {
  "newspaperId": "np-1006",
  "publicationId": "pub-06",
  "publicationName": "Junior Graphic",
  "newspaperTitle": "Junior Graphic — Schools & Science",
  "publicationDate": "2026-10-16",
  "pageNumber": 5,
  "snippet": "Young reporters club: how a front page is made"
} },
          { number: 9, clue: 'The direction the cedi took, per the markets wrap', length: 5, row: 4, col: 0, direction: 'across', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
        ],
        down: [
          { number: 1, clue: 'The courage the sports page said the team showed', length: 5, row: 0, col: 0, direction: 'down', source: {
  "newspaperId": "np-1004",
  "publicationId": "pub-04",
  "publicationName": "Graphic Sports",
  "newspaperTitle": "Graphic Sports — Black Stars Qualifier Special",
  "publicationDate": "2026-10-17",
  "pageNumber": 1,
  "snippet": "Black Stars gather in Kumasi ahead of the qualifier"
} },
          { number: 2, clue: 'Fire’s last glow, in the Ashanti fire report', length: 5, row: 0, col: 1, direction: 'down', source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
} },
          { number: 3, clue: 'What the op-ed warned the tribunal must not become', length: 5, row: 0, col: 2, direction: 'down', source: {
  "newspaperId": "np-1003",
  "publicationId": "pub-03",
  "publicationName": "The Mirror",
  "newspaperTitle": "The Mirror — Weekend Life",
  "publicationDate": "2026-10-18",
  "pageNumber": 7,
  "snippet": "Feature: the quiet art of the opinion column"
} },
          { number: 4, clue: 'Pine’s sticky secretion, in the schools science page', length: 5, row: 0, col: 3, direction: 'down', source: {
  "newspaperId": "np-1006",
  "publicationId": "pub-06",
  "publicationName": "Junior Graphic",
  "newspaperTitle": "Junior Graphic — Schools & Science",
  "publicationDate": "2026-10-16",
  "pageNumber": 5,
  "snippet": "Young reporters club: how a front page is made"
} },
          { number: 5, clue: 'The market’s direction of travel this quarter', length: 5, row: 0, col: 4, direction: 'down', source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
} },
        ],
      },
      wordCount: 10,
      source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
},
      solution: { grid: [
  [
    "H",
    "E",
    "A",
    "R",
    "T"
  ],
  [
    "E",
    "M",
    "B",
    "E",
    "R"
  ],
  [
    "A",
    "B",
    "U",
    "S",
    "E"
  ],
  [
    "R",
    "E",
    "S",
    "I",
    "N"
  ],
  [
    "T",
    "R",
    "E",
    "N",
    "D"
  ]
] },
    },
  ],

  riddle: [
    {
      puzzleId: 'rd-morning-easy',
      gameType: 'riddle',
      difficulty: 'easy',
      summary: 'Fill-in-the-blank and anagram questions from recent pages',
      title: 'Morning Desk Riddles',
      questionCount: 4,
      items: [
  {
    "id": "r-e1",
    "type": "cloze",
    "prompt": "From the finance page: “The Bank of Ghana ___ the policy rate at 28 percent.” Fill the blank.",
    "length": 4
  },
  {
    "id": "r-e2",
    "type": "cloze",
    "prompt": "From the back page: “The Black Stars ___ in Kumasi ahead of the qualifier.” Fill the blank.",
    "length": 8
  },
  {
    "id": "r-e3",
    "type": "anagram",
    "prompt": "Unscramble these newsroom letters: EILNBY",
    "length": 6
  },
  {
    "id": "r-e4",
    "type": "anagram",
    "prompt": "Unscramble these newsroom letters: OTQUSE",
    "length": 6
  }
],
      source: {
  "newspaperId": "np-1001",
  "publicationId": "pub-01",
  "publicationName": "Daily Graphic",
  "newspaperTitle": "Daily Graphic — Thursday Front Page",
  "publicationDate": "2026-10-22",
  "pageNumber": 1,
  "snippet": "Bank of Ghana holds policy rate; Parliament resumes"
},
      solution: { answers: [
  {
    "id": "r-e1",
    "answer": "HELD"
  },
  {
    "id": "r-e2",
    "answer": "GATHERED"
  },
  {
    "id": "r-e3",
    "answer": "BYLINE"
  },
  {
    "id": "r-e4",
    "answer": "QUOTES"
  }
] },
    },
    {
      puzzleId: 'rd-latewire-hard',
      gameType: 'riddle',
      difficulty: 'hard',
      summary: 'Harder blanks and anagrams for the desk regulars',
      title: 'Late Wire Riddles',
      questionCount: 6,
      items: [
  {
    "id": "r-h1",
    "type": "cloze",
    "prompt": "From the front page: “___ resumed sitting on Tuesday after the recess.” Fill the blank.",
    "length": 10
  },
  {
    "id": "r-h2",
    "type": "cloze",
    "prompt": "From the markets wrap: “___ eased to 13.2 percent in September, the slowest pace in two years.” Fill the blank.",
    "length": 9
  },
  {
    "id": "r-h3",
    "type": "cloze",
    "prompt": "From the editor’s note: “Every edition goes to ___ at midnight, whether the last story is filed or not.” Fill the blank.",
    "length": 5
  },
  {
    "id": "r-h4",
    "type": "anagram",
    "prompt": "Unscramble these newsroom letters: NTAICPO",
    "length": 7
  },
  {
    "id": "r-h5",
    "type": "anagram",
    "prompt": "Unscramble these newsroom letters: DNEIDALE",
    "length": 8
  },
  {
    "id": "r-h6",
    "type": "anagram",
    "prompt": "Unscramble these newsroom letters: OWRSNOME",
    "length": 8
  }
],
      source: {
  "newspaperId": "np-1002",
  "publicationId": "pub-02",
  "publicationName": "Graphic Business",
  "newspaperTitle": "Graphic Business — Markets & Money",
  "publicationDate": "2026-10-21",
  "pageNumber": 3,
  "snippet": "Inflation eases to 13.2 percent in September"
},
      solution: { answers: [
  {
    "id": "r-h1",
    "answer": "PARLIAMENT"
  },
  {
    "id": "r-h2",
    "answer": "INFLATION"
  },
  {
    "id": "r-h3",
    "answer": "PRESS"
  },
  {
    "id": "r-h4",
    "answer": "CAPTION"
  },
  {
    "id": "r-h5",
    "answer": "DEADLINE"
  },
  {
    "id": "r-h6",
    "answer": "NEWSROOM"
  }
] },
    },
  ],
};
