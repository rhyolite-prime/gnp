<template>
  <div class="flex flex-col h-full bg-gray-900 text-white border-r border-gray-800">
    <!-- Top Action: New Chat -->
    <div class="p-4 border-b border-gray-800 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white shadow-md">
            GN+
          </div>
          <div>
            <h3 class="text-xs font-bold text-white">AI Research Threads</h3>
            <p class="text-[10px] text-gray-400">Archival Knowledge Hub</p>
          </div>
        </div>

        <button
          v-if="isMobileDrawer"
          type="button"
          @click="$emit('close')"
          class="text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <button
        type="button"
        @click="handleNewChat"
        class="w-full py-2.5 px-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <PlusIcon class="w-4 h-4" />
        <span>New Research Session</span>
      </button>

      <!-- Search in Threads -->
      <div class="relative">
        <MagnifyingGlassIcon class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter research threads..."
          class="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
        />
      </div>
    </div>

    <!-- Sessions List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-1.5">
      <div v-if="filteredSessions.length === 0" class="text-center py-10 px-4 text-gray-500 text-xs">
        No matching research sessions found.
      </div>

      <div
        v-for="session in filteredSessions"
        :key="session.id"
        @click="selectSession(session.id)"
        :class="[
          'p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group',
          activeSessionId === session.id
            ? 'bg-gray-800 text-white border border-gray-700 shadow-sm'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
        ]"
      >
        <div class="flex items-start gap-2.5 min-w-0 flex-1">
          <!-- Mode Icon -->
          <div
            :class="[
              'w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold',
              session.mode === 'qa'
                ? 'bg-primary-900/60 text-primary-300 border border-primary-700/50'
                : 'bg-primary-900/60 text-primary-300 border border-primary-700/50'
            ]"
          >
            {{ session.mode === 'qa' ? 'QA' : 'RAG' }}
          </div>

          <div class="min-w-0 flex-1">
            <!-- Inline rename or title -->
            <div v-if="editingId === session.id" class="flex items-center gap-1" @click.stop>
              <input
                v-model="editingTitle"
                @keyup.enter="saveRename(session.id)"
                type="text"
                class="w-full text-xs bg-gray-950 px-2 py-1 rounded border border-primary-500 text-white outline-none"
                autofocus
              />
              <button @click="saveRename(session.id)" class="text-emerald-400 p-1 hover:text-emerald-300">
                <CheckIcon class="w-3.5 h-3.5" />
              </button>
            </div>

            <div v-else>
              <p class="text-xs font-semibold truncate leading-tight">
                {{ session.title }}
              </p>
              <p class="text-[10px] text-gray-500 mt-1 flex items-center gap-1.5">
                <span>{{ formatDate(session.updatedAt) }}</span>
                <span>• {{ session.messages.length }} msgs</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Hover Actions -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2" @click.stop>
          <button
            type="button"
            @click="startRename(session)"
            class="p-1 hover:text-primary-400 text-gray-400 rounded transition-colors"
            title="Rename session"
          >
            <PencilIcon class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            @click="deleteSession(session.id)"
            class="p-1 hover:text-primary-400 text-gray-400 rounded transition-colors"
            title="Delete session"
          >
            <TrashIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Wallet & Credit Status -->
    <div class="p-4 border-t border-gray-800 bg-gray-950/60">
      <div class="flex items-center justify-between text-xs">
        <span class="text-gray-400">Research Wallet:</span>
        <span class="font-bold text-primary-400">GHS {{ userCredits.toFixed(2) }}</span>
      </div>
      <div class="mt-2 text-[10px] text-gray-500 text-center">
        Powered by Graphic NewsPlus RAG v2.4
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  TrashIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import type { ChatSession } from '~/models/rag';

const props = withDefaults(
  defineProps<{
    isMobileDrawer?: boolean;
  }>(),
  {
    isMobileDrawer: false
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { 
  sessions, 
  activeSessionId, 
  userCredits, 
  createNewSession, 
  switchSession, 
  deleteSession, 
  renameSession 
} = useRagChat();

const searchQuery = ref('');
const editingId = ref<string | null>(null);
const editingTitle = ref('');

const filteredSessions = computed(() => {
  if (!searchQuery.value.trim()) return sessions.value;
  return sessions.value.filter(s =>
    s.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleNewChat = () => {
  createNewSession();
  if (props.isMobileDrawer) {
    emit('close');
  }
};

const selectSession = (id: string) => {
  switchSession(id);
  if (props.isMobileDrawer) {
    emit('close');
  }
};

const startRename = (session: ChatSession) => {
  editingId.value = session.id;
  editingTitle.value = session.title;
};

const saveRename = (id: string) => {
  if (editingTitle.value.trim()) {
    renameSession(id, editingTitle.value.trim());
  }
  editingId.value = null;
};

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
};
</script>
