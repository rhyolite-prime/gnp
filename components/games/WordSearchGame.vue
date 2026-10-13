<template>
  <div class="flex flex-col items-center max-w-5xl mx-auto w-full">
    <!-- Publication Source Intro Banner -->
    <div class="w-full bg-gradient-to-r from-red-50 via-white to-blue-50 border border-red-200/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-primary-100 text-primary-700 rounded-xl">
            <Search class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-primary-700">Vocabulary Source:</span>
              <span class="font-bold text-gray-900">{{ puzzle.source?.publicationName || 'Daily Graphic' }}</span>
              <span class="text-xs text-gray-500">• {{ puzzle.words.length }} Words</span>
            </div>
            <p class="text-xs text-gray-600 mt-0.5">
              Drag across letters or click start & end letters to select. Words may appear horizontally, vertically, or diagonally.
            </p>
          </div>
        </div>

        <!-- Progress Counter Pill -->
        <div class="flex items-center gap-2 self-start sm:self-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
          <CheckCircle2 class="w-4 h-4 text-emerald-600" />
          <span class="text-xs font-bold text-gray-700">
            {{ foundWords.length }} / {{ puzzle.words.length }} Found
          </span>
        </div>
      </div>
    </div>

    <!-- Main Grid + Words Sidebar -->
    <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full">
      <!-- Grid Board -->
      <div
        class="relative bg-gray-900 p-2 sm:p-3 rounded-2xl shadow-xl select-none"
        @mouseup="handleEndSelection"
        @mouseleave="handleCancelSelection"
      >
        <div
          class="grid gap-1 sm:gap-1.5 bg-gray-800 p-2 rounded-xl"
          :style="{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }"
        >
          <template v-for="(row, r) in puzzle.grid" :key="`r-${r}`">
            <div
              v-for="(letter, c) in row"
              :key="`c-${r}-${c}`"
              @mousedown="handleStartSelection(r, c)"
              @mouseenter="handleHoverCell(r, c)"
              @click="handleClickCell(r, c)"
              :class="getCellClasses(r, c)"
              class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm sm:text-base font-mono cursor-pointer rounded-lg transition-all active:scale-95"
            >
              {{ letter }}
            </div>
          </template>
        </div>
      </div>

      <!-- Target Words List & Clues -->
      <div class="flex flex-col gap-4 w-full max-w-md">
        <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div class="flex items-center gap-1.5">
              <FileText class="w-4 h-4 text-primary-600" />
              <span class="text-xs font-bold uppercase tracking-wider text-gray-700">Words to Discover</span>
            </div>
            <span class="text-xs text-gray-400">{{ foundWords.length }} of {{ puzzle.words.length }} found</span>
          </div>

          <!-- Words List -->
          <div class="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            <div
              v-for="item in puzzle.words"
              :key="item.word"
              :class="isWordFound(item.word) ? 'bg-emerald-50/70 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
              class="border rounded-xl p-3 transition-all"
            >
              <div class="flex items-center justify-between">
                <span
                  :class="isWordFound(item.word) ? 'line-through text-emerald-800 font-bold' : 'text-gray-900 font-bold'"
                  class="font-mono text-sm tracking-wider"
                >
                  {{ item.word }}
                </span>
                <span
                  v-if="isWordFound(item.word)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"
                >
                  <Check class="w-3 h-3" /> Found
                </span>
                <span v-else class="text-[10px] font-mono text-gray-400">
                  {{ item.length }} letters
                </span>
              </div>

              <!-- Publication clue snippet -->
              <p class="text-xs text-gray-500 mt-1 italic">
                {{ item.clue }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WordSearchPuzzle, WordSearchPlacement } from '~/models';
import { Search, FileText, CheckCircle2, Check } from 'lucide-vue-next';

const props = defineProps<{
  puzzle: WordSearchPuzzle;
  initialFound?: Array<string | WordSearchPlacement>;
  reveals?: any[];
}>();

const emit = defineEmits<{
  (e: 'update:found', found: WordSearchPlacement[]): void;
}>();

// Palette of colors for discovered words
const wordColors = [
  'bg-emerald-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-teal-500 text-white',
  'bg-indigo-500 text-white',
  'bg-cyan-500 text-white',
];

// Found words list
const foundWords = ref<WordSearchPlacement[]>([]);

// Selection tracking
const isSelecting = ref(false);
const startCoord = ref<{ r: number; c: number } | null>(null);
const currentCoord = ref<{ r: number; c: number } | null>(null);
const twoClickStart = ref<{ r: number; c: number } | null>(null);

// Initialize found words
function initFound() {
  const list: WordSearchPlacement[] = [];
  if (props.initialFound) {
    for (const item of props.initialFound) {
      if (typeof item === 'string') {
        const foundPlacement = findPlacementInPuzzle(item);
        if (foundPlacement) list.push(foundPlacement);
      } else {
        list.push(item);
      }
    }
  }
  // Also incorporate any reveals
  if (props.reveals) {
    for (const rev of props.reveals) {
      if (rev.word && !list.some(f => f.word.toUpperCase() === rev.word.toUpperCase())) {
        list.push(rev);
      }
    }
  }
  foundWords.value = list;
}

function findPlacementInPuzzle(word: string): WordSearchPlacement | null {
  // Search grid in all 8 directions
  const w = word.toUpperCase();
  const size = props.puzzle.size;
  const dirs = [
    { dr: 0, dc: 1, name: 'E' },
    { dr: 1, dc: 0, name: 'S' },
    { dr: 1, dc: 1, name: 'SE' },
    { dr: 1, dc: -1, name: 'SW' },
    { dr: 0, dc: -1, name: 'W' },
    { dr: -1, dc: 0, name: 'N' },
    { dr: -1, dc: 1, name: 'NE' },
    { dr: -1, dc: -1, name: 'NW' },
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const dir of dirs) {
        let match = true;
        for (let i = 0; i < w.length; i++) {
          const nr = r + dir.dr * i;
          const nc = c + dir.dc * i;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size || props.puzzle.grid[nr][nc].toUpperCase() !== w[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return { word: w, row: r, col: c, dRow: dir.dr, dCol: dir.dc, direction: dir.name };
        }
      }
    }
  }
  return null;
}

function isWordFound(word: string): boolean {
  return foundWords.value.some(f => f.word.toUpperCase() === word.toUpperCase());
}

// Calculate active path between two points
function getPath(p1: { r: number; c: number }, p2: { r: number; c: number }): Array<{ r: number; c: number }> {
  const dr = p2.r - p1.r;
  const dc = p2.c - p1.c;
  const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
  const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

  // Must be straight line: horizontal, vertical, or diagonal (|dr| === |dc|)
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
    return [p1];
  }

  const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const path: Array<{ r: number; c: number }> = [];
  for (let i = 0; i < length; i++) {
    path.push({ r: p1.r + stepR * i, c: p1.c + stepC * i });
  }
  return path;
}

const activeSelectionCells = computed(() => {
  if (!startCoord.value || !currentCoord.value) return [];
  return getPath(startCoord.value, currentCoord.value);
});

// Drag handlers
function handleStartSelection(r: number, c: number) {
  isSelecting.value = true;
  startCoord.value = { r, c };
  currentCoord.value = { r, c };
}

function handleHoverCell(r: number, c: number) {
  if (isSelecting.value) {
    currentCoord.value = { r, c };
  }
}

function handleEndSelection() {
  if (!isSelecting.value) return;
  isSelecting.value = false;
  verifyCurrentSelection();
  startCoord.value = null;
  currentCoord.value = null;
}

function handleCancelSelection() {
  if (isSelecting.value) {
    isSelecting.value = false;
    startCoord.value = null;
    currentCoord.value = null;
  }
}

// Two-click selection handler (useful on touch / mobile)
function handleClickCell(r: number, c: number) {
  if (!twoClickStart.value) {
    twoClickStart.value = { r, c };
  } else {
    startCoord.value = twoClickStart.value;
    currentCoord.value = { r, c };
    verifyCurrentSelection();
    twoClickStart.value = null;
    startCoord.value = null;
    currentCoord.value = null;
  }
}

function verifyCurrentSelection() {
  const cells = activeSelectionCells.value;
  if (cells.length < 2) return;

  // Form string forward and reverse
  let wordForward = '';
  for (const cell of cells) {
    wordForward += props.puzzle.grid[cell.r][cell.c];
  }
  const wordReverse = wordForward.split('').reverse().join('');

  for (const item of props.puzzle.words) {
    const target = item.word.toUpperCase();
    if (wordForward.toUpperCase() === target) {
      const p1 = cells[0];
      const p2 = cells[cells.length - 1];
      const dr = p2.r === p1.r ? 0 : p2.r > p1.r ? 1 : -1;
      const dc = p2.c === p1.c ? 0 : p2.c > p1.c ? 1 : -1;
      addFoundWord({
        word: target,
        row: p1.r,
        col: p1.c,
        dRow: dr,
        dCol: dc,
      });
      return;
    } else if (wordReverse.toUpperCase() === target) {
      const p1 = cells[cells.length - 1];
      const p2 = cells[0];
      const dr = p2.r === p1.r ? 0 : p2.r > p1.r ? 1 : -1;
      const dc = p2.c === p1.c ? 0 : p2.c > p1.c ? 1 : -1;
      addFoundWord({
        word: target,
        row: p1.r,
        col: p1.c,
        dRow: dr,
        dCol: dc,
      });
      return;
    }
  }
}

function addFoundWord(placement: WordSearchPlacement) {
  if (isWordFound(placement.word)) return;
  foundWords.value.push(placement);
  emit('update:found', foundWords.value);
}

// Determine cell styling
function getCellClasses(r: number, c: number) {
  // Check if currently selected
  const inSelection = activeSelectionCells.value.some(p => p.r === r && p.c === c);
  if (inSelection) {
    return 'bg-primary-600 text-white font-extrabold ring-2 ring-primary-300 scale-105';
  }

  // Check if two-click start cell
  if (twoClickStart.value && twoClickStart.value.r === r && twoClickStart.value.c === c) {
    return 'bg-amber-500 text-white font-extrabold ring-2 ring-amber-300 animate-pulse';
  }

  // Check if part of any found word
  for (let idx = 0; idx < foundWords.value.length; idx++) {
    const f = foundWords.value[idx];
    const len = f.word.length;
    for (let i = 0; i < len; i++) {
      if (f.row + f.dRow * i === r && f.col + f.dCol * i === c) {
        const colorClass = wordColors[idx % wordColors.length];
        return `${colorClass} font-extrabold`;
      }
    }
  }

  return 'bg-gray-800 text-gray-200 hover:bg-gray-700';
}

watch(
  () => props.initialFound,
  () => initFound(),
  { deep: true }
);

watch(
  () => props.reveals,
  () => initFound(),
  { deep: true }
);

onMounted(() => {
  initFound();
});
</script>
