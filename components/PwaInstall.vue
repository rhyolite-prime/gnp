<template>
    <!-- <div v-if="$pwa?.needRefresh" class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
      <span>New content available!</span>
      <button @click="$pwa.updateServiceWorker()" class="bg-white text-blue-600 px-3 py-1 rounded font-bold">
        Reload
      </button>
    </div> -->

  <div v-if="showInstallButton" class="fixed bottom-4 left-4 z-50">
    <button @click="installPwa" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
      Install App
    </button>
  </div>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()
const showInstallButton = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallButton.value = true
  })
})

const installPwa = async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    showInstallButton.value = false
  }
  deferredPrompt = null
}
</script>
