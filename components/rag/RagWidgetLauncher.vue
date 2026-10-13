<template>
  <div class="fixed bottom-6 right-6 z-40">
    <!-- Floating Summon Button -->
    <button
      v-if="!isExpanded && false"
      type="button"
      @click="isExpanded = true"
      class="group relative flex items-center gap-3 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:bg-primary-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105 border border-white/20"
      aria-label="Open AI Research Assistant"
    >
      <div class="relative">
        <SparklesIcon class="w-6 h-6 animate-pulse" />
      </div>
      <div class="hidden sm:block text-left">
        <p class="text-xs font-bold leading-tight">GNP AI</p>
        <p class="text-[10px] text-primary-200 font-medium">Q/A & Research Mode</p>
      </div>
    </button>

    <!-- Floating Glass Chatbot Container -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-95"
    >
      <div
        v-if="isExpanded"
        class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] h-[650px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 ring-1 ring-black/5"
      >
        <!-- Top bar with expand to full page link & close -->
        <div class="bg-gray-900 px-4 py-2 text-white flex items-center justify-between text-xs border-b border-gray-800">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold">Graphic NewsPlus AI Studio</span>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              to="/research-ai"
              @click="isExpanded = false"
              class="text-[11px] text-primary-300 hover:text-primary-200 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>Full Studio</span>
              <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
            </NuxtLink>

            <button
              type="button"
              @click="isExpanded = false"
              class="text-gray-400 hover:text-white p-1 rounded transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Embedded Chatbot -->
        <div class="flex-1 overflow-hidden">
          <RagChatbot
            :is-widget-mode="true"
            @close-widget="isExpanded = false"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  SparklesIcon, 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/vue/24/outline';

const isExpanded = ref(false);
</script>
