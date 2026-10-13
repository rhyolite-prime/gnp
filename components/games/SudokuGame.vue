<template>
  <div class="flex flex-col items-center max-w-4xl mx-auto">
    <!-- Theme Word & Quote Banner -->
    <div class="w-full bg-gradient-to-r from-red-50 via-white to-amber-50 border border-red-200/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div class="flex items-start gap-3">
        <div class="p-2 bg-primary-100 text-primary-700 rounded-xl mt-0.5">
          <BookOpen class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="text-xs font-bold uppercase tracking-wider text-primary-700">Publication Theme Word:</span>
            <span class="px-2.5 py-0.5 bg-primary-600 text-white font-mono font-bold tracking-widest text-sm rounded-md shadow-sm">
              {{ puzzle.symbolWord }}
            </span>
            <span class="text-xs text-gray-500">({{ symbols.length }} unique letters)</span>
          </div>
          <blockquote class="text-sm italic text-gray-700 border-l-2 border-primary-300 pl-3 py-0.5">
            "{{ puzzle.anchorQuote }}"
          </blockquote>
          <p class="text-xs text-gray-500 mt-1">
            Fill every row, column, and 3×3 box with the letters:
            <strong class="font-mono text-gray-800">{{ symbols.join(', ') }}</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Game Board Container -->
    <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full">
      <!-- 9x9 Grid -->
      <div
        class="relative bg-gray-900 p-2 sm:p-3 rounded-2xl shadow-xl select-none focus:outline-none"
        tabindex="0"
        @keydown="handleKeyDown"
        ref="gridRef"
      >
        <div class="grid grid-cols-9 gap-[1px] sm:gap-[2px] bg-gray-400 p-[1px] sm:p-[2px] rounded-xl overflow-hidden border-2 border-gray-800">
          <template v-for="(row, r) in grid" :key="`row-${r}`">
            <div
              v-for="(val, c) in row"
              :key="`cell-${r}-${c}`"
              @click="selectCell(r, c)"
              :class="getCellClasses(r, c)"
              class="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm sm:text-lg md:text-xl font-mono cursor-pointer transition-colors relative"
            >
              <!-- Cell Letter Value -->
              <span v-if="val" :class="getLetterClasses(r, c)">{{ val }}</span>
              <!-- Notes in cell if any -->
              <div v-else-if="notes[`${r}-${c}`]?.size" class="grid grid-cols-3 gap-0 text-[8px] text-gray-400 leading-none">
                <span v-for="sym in symbols.slice(0, 9)" :key="sym" class="w-2.5 h-2.5 flex items-center justify-center">
                  {{ notes[`${r}-${c}`]?.has(sym) ? sym : '' }}
                </span>
              </div>

              <!-- Hint Indicator Icon -->
              <span v-if="isRevealedHint(r, c)" class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" title="Revealed by hint"></span>

              <!-- Wrong Indicator Badge -->
              <span v-if="isWrongCell(r, c)" class="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full" title="Incorrect letter"></span>
            </div>
          </template>
        </div>
      </div>

      <!-- Controls & Letter Keypad Sidebar -->
      <div class="flex flex-col gap-4 w-full max-w-sm">
        <!-- Mode Toggles (Normal vs Pencil Notes) -->
        <div class="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <div class="text-xs font-semibold text-gray-600 px-2">Input Mode:</div>
          <div class="flex items-center gap-1">
            <button
              @click="pencilMode = false"
              :class="!pencilMode ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <PenLine class="w-3.5 h-3.5" /> Letter
            </button>
            <button
              @click="pencilMode = true"
              :class="pencilMode ? 'bg-amber-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Edit3 class="w-3.5 h-3.5" /> Pencil Notes
            </button>
          </div>
        </div>

        <!-- 9-Symbol Letter Keypad -->
        <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Letter Palette</span>
            <span class="text-xs text-gray-400">Click or type on keyboard</span>
          </div>

          <div class="grid grid-cols-3 gap-2.5">
            <button
              v-for="sym in symbols"
              :key="sym"
              @click="inputSymbol(sym)"
              :disabled="selectedRow === null || isGiven(selectedRow, selectedCol!)"
              class="h-12 rounded-xl border border-gray-200 bg-gray-50 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 font-mono font-bold text-lg text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex flex-col items-center justify-center relative active:scale-95"
            >
              <span>{{ sym }}</span>
              <span class="text-[9px] font-sans font-normal text-gray-400">
                {{ getSymbolCount(sym) }}/9
              </span>
            </button>
          </div>

          <!-- Erase & Quick Actions -->
          <div class="grid grid-cols-2 gap-2 mt-3">
            <button
              @click="clearSelected"
              :disabled="selectedRow === null || isGiven(selectedRow, selectedCol!)"
              class="py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold text-gray-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eraser class="w-4 h-4" /> Erase Cell
            </button>
            <button
              @click="clearAllNotes"
              class="py-2 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 class="w-4 h-4 text-gray-400" /> Clear Notes
            </button>
          </div>
        </div>

        <!-- Legend & Rules -->
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 space-y-1">
          <div class="font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Info class="w-3.5 h-3.5 text-primary-600" /> Sudoku Rules
          </div>
          <div>• Each 3×3 box must contain all 9 publication letters.</div>
          <div>• Each row and column must contain no duplicate letters.</div>
          <div>• Locked cells <span class="font-bold text-gray-900">(dark)</span> are the given clues.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SudokuPuzzle } from '~/models';
import { BookOpen, PenLine, Edit3, Eraser, Trash2, Info } from 'lucide-vue-next';

const props = defineProps<{
  puzzle: SudokuPuzzle;
  initialGrid?: string[][];
  reveals?: any[];
  wrongCells?: Array<{ row: number; col: number }>;
}>();

const emit = defineEmits<{
  (e: 'update:grid', grid: string[][]): void;
}>();

const gridRef = ref<HTMLElement | null>(null);
const symbols = computed(() => props.puzzle.symbols || []);
const selectedRow = ref<number | null>(null);
const selectedCol = ref<number | null>(null);
const pencilMode = ref(false);

// Initialize grid
const grid = ref<string[][]>(
  props.initialGrid
    ? props.initialGrid.map(row => [...row])
    : props.puzzle.grid.map(row => [...row])
);

// Notes storage: map "r-c" -> Set of letters
const notes = reactive<Record<string, Set<string>>>({});

// Helper: check if a cell was given in original puzzle
function isGiven(r: number, c: number): boolean {
  return !!props.puzzle.given?.[r]?.[c];
}

// Helper: check if cell was revealed by hint
function isRevealedHint(r: number, c: number): boolean {
  if (!props.reveals) return false;
  return props.reveals.some(h => h.row === r && h.col === c);
}

// Helper: check if cell was flagged wrong during check
function isWrongCell(r: number, c: number): boolean {
  if (!props.wrongCells) return false;
  return props.wrongCells.some(w => w.row === r && w.col === c);
}

// Count how many times a symbol is placed
function getSymbolCount(sym: string): number {
  let count = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid.value[r]?.[c]?.toUpperCase() === sym.toUpperCase()) {
        count++;
      }
    }
  }
  return count;
}

// Check for conflict (duplicate in row, column, or 3x3 box)
function hasConflict(r: number, c: number): boolean {
  const val = grid.value[r]?.[c];
  if (!val) return false;

  // Check row
  for (let col = 0; col < 9; col++) {
    if (col !== c && grid.value[r]?.[col]?.toUpperCase() === val.toUpperCase()) return true;
  }
  // Check column
  for (let row = 0; row < 9; row++) {
    if (row !== r && grid.value[row]?.[c]?.toUpperCase() === val.toUpperCase()) return true;
  }
  // Check 3x3 box
  const boxR = Math.floor(r / 3) * 3;
  const boxC = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const curR = boxR + i;
      const curC = boxC + j;
      if ((curR !== r || curC !== c) && grid.value[curR]?.[curC]?.toUpperCase() === val.toUpperCase()) {
        return true;
      }
    }
  }
  return false;
}

// Select a cell
function selectCell(r: number, c: number) {
  selectedRow.value = r;
  selectedCol.value = c;
}

// Input a letter into currently selected cell
function inputSymbol(sym: string) {
  if (selectedRow.value === null || selectedCol.value === null) return;
  const r = selectedRow.value;
  const c = selectedCol.value;
  if (isGiven(r, c)) return;

  if (pencilMode.value) {
    const key = `${r}-${c}`;
    if (!notes[key]) notes[key] = new Set();
    if (notes[key].has(sym)) {
      notes[key].delete(sym);
    } else {
      notes[key].add(sym);
    }
  } else {
    grid.value[r][c] = sym;
    delete notes[`${r}-${c}`];
    emit('update:grid', grid.value);
  }
}

// Clear currently selected cell
function clearSelected() {
  if (selectedRow.value === null || selectedCol.value === null) return;
  const r = selectedRow.value;
  const c = selectedCol.value;
  if (isGiven(r, c)) return;

  grid.value[r][c] = '';
  delete notes[`${r}-${c}`];
  emit('update:grid', grid.value);
}

function clearAllNotes() {
  for (const k in notes) {
    delete notes[k];
  }
}

// Dynamic cell classes
function getCellClasses(r: number, c: number) {
  const isSelected = selectedRow.value === r && selectedCol.value === c;
  const isSameRowOrCol = selectedRow.value === r || selectedCol.value === c;
  const isSameBox =
    selectedRow.value !== null &&
    selectedCol.value !== null &&
    Math.floor(selectedRow.value / 3) === Math.floor(r / 3) &&
    Math.floor(selectedCol.value / 3) === Math.floor(c / 3);

  const selectedLetter =
    selectedRow.value !== null && selectedCol.value !== null
      ? grid.value[selectedRow.value]?.[selectedCol.value]
      : null;
  const isMatchingLetter =
    selectedLetter &&
    grid.value[r]?.[c] &&
    grid.value[r][c].toUpperCase() === selectedLetter.toUpperCase();

  const conflict = hasConflict(r, c);
  const given = isGiven(r, c);
  const wrong = isWrongCell(r, c);

  // Borders for 3x3 boxes
  const borderRight = c === 2 || c === 5 ? 'border-r-2 border-r-gray-800' : '';
  const borderBottom = r === 2 || r === 5 ? 'border-b-2 border-b-gray-800' : '';

  if (isSelected) {
    return `bg-primary-500 text-white ring-2 ring-primary-400 z-10 ${borderRight} ${borderBottom}`;
  }
  if (conflict || wrong) {
    return `bg-rose-100 text-rose-800 border border-rose-400 ${borderRight} ${borderBottom}`;
  }
  if (isMatchingLetter) {
    return `bg-amber-100 text-amber-900 ${borderRight} ${borderBottom}`;
  }
  if (isSameRowOrCol || isSameBox) {
    return `bg-blue-50/70 text-gray-800 ${borderRight} ${borderBottom}`;
  }
  if (given) {
    return `bg-gray-100 text-gray-900 ${borderRight} ${borderBottom}`;
  }
  return `bg-white text-primary-700 hover:bg-gray-50 ${borderRight} ${borderBottom}`;
}

function getLetterClasses(r: number, c: number) {
  if (selectedRow.value === r && selectedCol.value === c) {
    return 'text-white font-extrabold';
  }
  if (isGiven(r, c)) {
    return 'text-gray-900 font-extrabold';
  }
  if (isRevealedHint(r, c)) {
    return 'text-amber-600 font-extrabold';
  }
  return 'text-primary-600 font-bold';
}

// Keyboard navigation and letter entry
function handleKeyDown(e: KeyboardEvent) {
  if (selectedRow.value === null || selectedCol.value === null) return;

  const key = e.key.toUpperCase();

  // Navigation
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedRow.value = Math.max(0, selectedRow.value - 1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedRow.value = Math.min(8, selectedRow.value + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    selectedCol.value = Math.max(0, selectedCol.value - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    selectedCol.value = Math.min(8, selectedCol.value + 1);
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault();
    clearSelected();
  } else if (symbols.value.includes(key)) {
    e.preventDefault();
    inputSymbol(key);
  }
}

// Watch initialGrid update from parent (e.g. after hint or check)
watch(
  () => props.initialGrid,
  newGrid => {
    if (newGrid) {
      grid.value = newGrid.map(row => [...row]);
    }
  },
  { deep: true }
);

onMounted(() => {
  // Focus grid on mount for keyboard support
  gridRef.value?.focus();
});
</script>
