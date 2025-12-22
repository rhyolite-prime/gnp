<template>
  <div class="cursor-pointer transition-all hover:scale-105">
    <div class="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="aspect-[3/4] overflow-hidden">
        <div v-if="imageLoading" class="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
          <span class="text-gray-400 text-xs">Loading...</span>
        </div>

        <img
          v-else
          :src="blobUrl"
          :alt="newspaper.title"
          class="w-full h-full object-cover"
          loading="lazy"
        >
      </div>
      <div class="p-3">
        <p class="text-sm font-medium text-gray-900 text-center">
          {{ titleParts.main }}
        </p>
        <p class="text-sm font-medium text-gray-900 text-center">
          {{ titleParts.date }}
        </p>

        <div class="mt-2">
          <p class="text-xs font-bold text-gray-900 text-center w-full">
            GHS {{ newspaper?.price }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsPaper } from "~/models";
const imageLoading = ref(false)
const blobUrl = ref<string>()

const props = defineProps({
  newspaper: Object
})

const titleParts = computed(() => {
  if (!props.newspaper?.title) return { main: '', date: '' }

  const title = props.newspaper.title
  const firstCommaIndex = title.indexOf(',')

  if (firstCommaIndex === -1) {
    return { main: title.trim(), date: '' }
  }

  const main = title.substring(0, firstCommaIndex).trim()
  const date = title.substring(firstCommaIndex + 1).trim()

  return { main, date }
})

const loadImageAsBlob = async (fileId: string) => {

    imageLoading.value = true;
    
    try {

      const url = await getSecureThumbnail(fileId);
      blobUrl.value = url;
      imageLoading.value = false;
        
      } catch (error) {

        imageLoading.value = false;
      }    
}


onMounted(() => {
  loadImageAsBlob(props.newspaper?.thumbnailId as string)
})

</script>
