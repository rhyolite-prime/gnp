<template>
  <div class="h-[calc(100vh-80px)] bg-gray-100 flex overflow-hidden">
    <!-- Desktop Left Session History Sidebar -->
    <aside class="hidden md:block w-72 lg:w-80 h-full shrink-0 shadow-lg z-10">
      <RagSessionSidebar />
    </aside>

    <!-- Mobile Left Sidebar Drawer -->
    <TransitionRoot as="template" :show="isMobileSidebarOpen">
      <Dialog as="div" class="relative z-50 md:hidden" @close="isMobileSidebarOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-200 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex w-full max-w-xs flex-1">
              <RagSessionSidebar
                :is-mobile-drawer="true"
                @close="isMobileSidebarOpen = false"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Right Main Chatbot Workspace -->
    <main class="flex-1 h-full flex flex-col overflow-hidden bg-white">
      <RagChatbot
        :show-sidebar-toggle="true"
        @toggle-sidebar="isMobileSidebarOpen = true"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

// Page Title and Meta
useHead({
  title: 'AI Research Studio & Archival RAG - Graphic NewsPlus',
  meta: [
    {
      name: 'description',
      content: 'Conduct in-depth archival investigations, Q/A grounding, research notebook management, and executive PDF reports powered by Graphic NewsPlus RAG.'
    }
  ]
});

const isMobileSidebarOpen = ref(false);
</script>
