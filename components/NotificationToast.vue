<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
    <TransitionGroup 
        enter-active-class="transform ease-out duration-300 transition" 
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" 
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" 
        leave-active-class="transition ease-in duration-100" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
    >
      <div 
        v-for="notification in notifications" 
        :key="notification.notificationId"
        class="bg-gray-800 rounded-2xl p-4 text-white shadow-2xl border border-gray-700 pointer-events-auto cursor-pointer hover:bg-gray-750 transition-colors relative group"
        @click="handleClick(notification)"
      >
        <div class="flex items-start gap-3">
          <div class="h-8 w-8 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
             <span class="text-xs font-bold text-white">NP</span>
          </div>
          <div class="flex-1 min-w-0">
             <div class="flex justify-between items-baseline mb-0.5">
               <h5 class="text-sm font-semibold">GraphicNews Plus</h5>
               <span class="text-xs text-gray-400">{{ formatTime(notification.timestamp) }}</span>
             </div>
             <p class="text-sm font-medium truncate pr-6">{{ notification.subject }}</p>
             <p class="text-xs text-gray-300 line-clamp-2">{{ notification.messageBody }}</p>
          </div>
        </div>
        
        <!-- Subtle close button only visible on hover -->
        <button 
          @click.stop="removeNotification(notification.notificationId)" 
          class="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none p-1"
        >
          <span class="sr-only">Close</span>
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { storeToRefs } from 'pinia'

const store = useNotificationStore()
const { notifications } = storeToRefs(store)
const { removeNotification } = store
const router = useRouter()

const handleClick = (notification: any) => {
    if (notification.deepLink) {
        // Handle internal vs external links casually
        if (notification.deepLink.startsWith('http') && !notification.deepLink.includes(window.location.host)) {
             window.open(notification.deepLink, '_blank')
        } else {
             // Extract path if it's a full URL but internal, or just use it if it's relative
             try {
                const url = new URL(notification.deepLink)
                router.push(url.pathname + url.search)
             } catch {
                router.push(notification.deepLink)
             }
        }
    }
    removeNotification(notification.notificationId)
}

const formatTime = (microTimestamp: number) => {
  // Convert microseconds to milliseconds if necessary, assuming input might be huge
  const ms = microTimestamp > 1e14 ? microTimestamp / 1000 : microTimestamp
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
