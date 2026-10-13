<template>
  <div class="flex flex-col items-center max-w-6xl mx-auto w-full">
    <!-- Active Clue Header Ribbon -->
    <div class="w-full bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div class="flex items-start sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="p-2.5 bg-primary-100 text-primary-700 rounded-xl mt-0.5 sm:mt-0">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-primary-600 text-white font-mono font-bold text-xs rounded uppercase">
                {{ activeClue?.number || 1 }} {{ activeDirection }}
              </span>
              <span class="text-xs text-gray-500">({{ activeClue?.length || 0 }} letters)</span>
            </div>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ activeClue?.clue || 'Select a cell on the grid to view its clue.' }}
            </p>
          </div>
        </div>

        <button
          @click="toggleDirection"
          class="shrink-0 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5"
        >
          <RotateCw class="w-3.5 h-3.5 text-gray-500" />
          <span>Flip ({{ activeDirection === 'across' ? 'Down' : 'Across' }})</span>
        </button>
      </div>
    </div>

    <!-- Main Grid + Clues Panel -->
    <div class="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 w-full">
      <!-- Crossword Grid Board -->
      <div
        class="relative bg-gray-900 p-2 sm:p-3 rounded-2xl shadow-xl select-none focus:outline-none"
        tabindex="0"
        @keydown="handleKeyDown"
        ref="gridContainerRef"
      >
        <div
          class="grid gap-[1px] sm:gap-[2px] bg-gray-400 p-[1px] sm:p-[2px] rounded-xl overflow-hidden border-2 border-gray-800"
          :style="{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }"
        >
          <template v-for="(row, r) in grid" :key="`row-${r}`">
            <template v-for="(val, c) in row" :key="`cell-${r}-${c}`">
              <!-- Black Block Cell -->
              <div
                v-if="val === '#'"
                class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-900"
              ></div>

              <!-- White Playable Cell -->
              <div
                v-else
                @click="handleCellClick(r, c)"
                :class="getCellClasses(r, c)"
                class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg font-mono cursor-pointer transition-colors relative"
              >
                <!-- Clue Number Badge in Corner -->
                <span
                  v-if="puzzle.numbers?.[r]?.[c] > 0"
                  class="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-sans font-bold leading-none select-none"
                  :class="isSelected(r, c) ? 'text-white/80' : 'text-gray-500'"
                >
                  {{ puzzle.numbers[r][c] }}
                </span>

                <!-- Entered Letter -->
                <span :class="isSelected(r, c) ? 'text-white' : 'text-gray-900'">
                  {{ val }}
                </span>

                <!-- Revealed hint badge -->
                <span
                  v-if="isRevealedHint(r, c)"
                  class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full"
                  title="Hint revealed"
                ></span>

                <!-- Wrong cell flag -->
                <span
                  v-if="isWrongCell(r, c)"
                  class="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full"
                  title="Incorrect letter"
                ></span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Across & Down Clues Sidebar -->
      <div class="flex flex-col gap-4 w-full max-w-lg">
        <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <!-- Clue Type Tabs -->
          <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
            <button
              @click="activeDirection = 'across'"
              :class="activeDirection === 'across' ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              Across ({{ puzzle.clues.across.length }})
            </button>
            <button
              @click="activeDirection = 'down'"
              :class="activeDirection === 'down' ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              Down ({{ puzzle.clues.down.length }})
            </button>
          </div>

          <!-- Clues Scrollable List -->
          <div class="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            <div
              v-for="clue in currentClues"
              :key="`${activeDirection}-${clue.number}`"
              :id="`clue-${activeDirection}-${clue.number}`"
              @click="selectClue(clue)"
              :class="isCurrentClue(clue) ? 'bg-primary-50 border-primary-300 ring-1 ring-primary-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
              class="border rounded-xl p-3 cursor-pointer transition-all"
            >
              <div class="flex items-start gap-2.5">
                <span
                  :class="isCurrentClue(clue) ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'"
                  class="shrink-0 w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center"
                >
                  {{ clue.number }}
                </span>
                <div class="flex-1">
                  <p class="text-xs sm:text-sm text-gray-800 leading-snug">
                    {{ clue.clue }}
                  </p>
                  <span class="text-[10px] text-gray-400 mt-1 inline-block">
                    {{ clue.length }} letters
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Helpful Keyboard Shortcuts -->
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 space-y-1">
          <div class="font-bold text-gray-700 flex items-center gap-1">
            <HelpCircle class="w-3.5 h-3.5 text-primary-600" /> Controls & Shortcuts
          </div>
          <div>• <strong>Spacebar</strong>: Toggle between Across & Down</div>
          <div>• <strong>Arrow keys</strong>: Navigate cells</div>
          <div>• <strong>Backspace</strong>: Delete and move back</div>
          <div>• Click any clue to jump directly to its first cell on the grid.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CrosswordPuzzle, CrosswordClue } from '~/models';
import { FileText, RotateCw, HelpCircle } from 'lucide-vue-next';

const props = defineProps<{
  puzzle: CrosswordPuzzle;
  initialGrid?: string[][];
  reveals?: any[];
  wrongCells?: Array<{ row: number; col: number }>;
}>();

const emit = defineEmits<{
  (e: 'update:grid', grid: string[][]): void;
}>();

const gridContainerRef = ref<HTMLElement | null>(null);

// Initialize grid
const grid = ref<string[][]>(
  props.initialGrid
    ? props.initialGrid.map(row => [...row])
    : props.puzzle.grid.map(row => [...row])
);

// Selection state
const selectedRow = ref<number>(1);
const selectedCol = ref<number>(1);
const activeDirection = ref<'across' | 'down'>('across');

// Find initial valid playable cell
for (let r = 0; r < props.puzzle.size; r++) {
  let found = false;
  for (let c = 0; c < props.puzzle.size; c++) {
    if (grid.value[r][c] !== '#') {
      selectedRow.value = r;
      selectedCol.value = c;
      found = true;
      break;
    }
  }
  if (found) break;
}

const currentClues = computed(() => {
  return activeDirection.value === 'across'
    ? props.puzzle.clues.across
    : props.puzzle.clues.down;
});

// Find the clue that corresponds to the active cell and direction
const activeClue = computed<CrosswordClue | null>(() => {
  const r = selectedRow.value;
  const c = selectedCol.value;
  const clues = currentClues.value;

  for (const clue of clues) {
    if (activeDirection.value === 'across') {
      if (clue.row === r && c >= clue.col && c < clue.col + clue.length) {
        return clue;
      }
    } else {
      if (clue.col === c && r >= clue.row && r < clue.row + clue.length) {
        return clue;
      }
    }
  }
  return null;
});

function isCurrentClue(clue: CrosswordClue): boolean {
  return activeClue.value?.number === clue.number && activeClue.value?.direction === clue.direction;
}

function isSelected(r: number, c: number): boolean {
  return selectedRow.value === r && selectedCol.value === c;
}

function isPartOfActiveWord(r: number, c: number): boolean {
  if (!activeClue.value) return false;
  const clue = activeClue.value;
  if (activeDirection.value === 'across') {
    return r === clue.row && c >= clue.col && c < clue.col + clue.length;
  } else {
    return c === clue.col && r >= clue.row && r < clue.row + clue.length;
  }
}

function isRevealedHint(r: number, c: number): boolean {
  if (!props.reveals) return false;
  return props.reveals.some(h => h.row === r && h.col === c);
}

function isWrongCell(r: number, c: number): boolean {
  if (!props.wrongCells) return false;
  return props.wrongCells.some(w => w.row === r && w.col === c);
}

function handleCellClick(r: number, c: number) {
  if (grid.value[r][c] === '#') return;

  if (selectedRow.value === r && selectedCol.value === c) {
    // Toggle direction on second click of active cell
    toggleDirection();
  } else {
    selectedRow.value = r;
    selectedCol.value = c;
  }
}

function toggleDirection() {
  activeDirection.value = activeDirection.value === 'across' ? 'down' : 'across';
}

function selectClue(clue: CrosswordClue) {
  activeDirection.value = clue.direction;
  selectedRow.value = clue.row;
  selectedCol.value = clue.col;
  gridContainerRef.value?.focus();
}

// Move to next cell in active word
function moveToNextCell() {
  const size = props.puzzle.size;
  if (activeDirection.value === 'across') {
    let nc = selectedCol.value + 1;
    if (nc < size && grid.value[selectedRow.value][nc] !== '#') {
      selectedCol.value = nc;
    }
  } else {
    let nr = selectedRow.value + 1;
    if (nr < size && grid.value[nr][selectedCol.value] !== '#') {
      selectedRow.value = nr;
    }
  }
}

// Move to previous cell in active word
function moveToPrevCell() {
  if (activeDirection.value === 'across') {
    let nc = selectedCol.value - 1;
    if (nc >= 0 && grid.value[selectedRow.value][nc] !== '#') {
      selectedCol.value = nc;
    }
  } else {
    let nr = selectedRow.value - 1;
    if (nr >= 0 && grid.value[nr][selectedCol.value] !== '#') {
      selectedRow.value = nr;
    }
  }
}

// Keyboard input handling
function handleKeyDown(e: KeyboardEvent) {
  const r = selectedRow.value;
  const c = selectedCol.value;

  if (e.key === ' ') {
    e.preventDefault();
    toggleDirection();
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (r > 0 && grid.value[r - 1][c] !== '#') selectedRow.value = r - 1;
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (r < props.puzzle.size - 1 && grid.value[r + 1][c] !== '#') selectedRow.value = r + 1;
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (c > 0 && grid.value[r][c - 1] !== '#') selectedCol.value = c - 1;
    return;
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (c < props.puzzle.size - 1 && grid.value[r][c + 1] !== '#') selectedCol.value = c + 1;
    return;
  }

  if (e.key === 'Backspace') {
    e.preventDefault();
    if (grid.value[r][c] !== '') {
      grid.value[r][c] = '';
    } else {
      moveToPrevCell();
      grid.value[selectedRow.value][selectedCol.value] = '';
    }
    emit('update:grid', grid.value);
    return;
  }

  // Letter input
  if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
    e.preventDefault();
    grid.value[r][c] = e.key.toUpperCase();
    emit('update:grid', grid.value);
    moveToNextCell();
  }
}

function getCellClasses(r: number, c: number) {
  if (isSelected(r, c)) {
    return 'bg-primary-600 text-white ring-2 ring-primary-300 z-10 shadow-md';
  }
  if (isWrongCell(r, c)) {
    return 'bg-rose-100 text-rose-800 border border-rose-400';
  }
  if (isPartOfActiveWord(r, c)) {
    return 'bg-primary-50 text-gray-900 border border-primary-200';
  }
  return 'bg-white text-gray-900 hover:bg-gray-50';
}

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
  gridContainerRef.value?.focus();
});
</script>
