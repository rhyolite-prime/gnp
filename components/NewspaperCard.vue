<template>
  <div class="group cursor-pointer">
    <div class="bg-white rounded-sm shadow-md card-hover overflow-hidden">
      <div class="aspect-[3/4] overflow-hidden rounded-t-sm bg-gray-100">
        <div v-if="imageLoading" class="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
           <span class="text-gray-400 text-xs text-center px-4">Loading...</span>
        </div>
        <img 
          v-else
          :src="blobUrl" 
          :alt="newspaper.title" 
          :class="['w-full h-full group-hover:scale-105 transition-transform duration-300', containMode ? 'object-contain' : 'object-cover']"
          loading="lazy"
        >
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">{{ newspaper.title }}</h3>
        <!-- <p v-if="newspaper.date" class="text-xs text-gray-500">{{ newspaper.date }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  newspaper: {
    type: Object,
    required: true
  },
  containMode: {
    type: Boolean,
    default: false
  }
})

const imageLoading = ref(true)
const blobUrl = ref<string>()

const loadImage = async (newspaperId: string) => {
  imageLoading.value = true
  try {
    const url = await getSecureThumbnail(newspaperId)
    blobUrl.value = url
  } catch (error) {
    console.error("Failed to load thumbnail:", error)
  } finally {
    imageLoading.value = false
  }
}

onMounted(() => {
  if (props.newspaper?.id) {
    loadImage(props.newspaper.id)
  } else if (props.newspaper?.image) {
    blobUrl.value = props.newspaper.image
    imageLoading.value = false
  }
})
</script>