<template>
  <div class="embed-wrapper bg-gray-50 min-h-screen">
    <!-- Carousel Mode -->
    <div v-if="widgetType === 'carousel'" class="relative w-full p-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Latest Newspapers</h2>
        <div class="flex gap-2">
          <button @click="scrollLeft" class="p-2 rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button @click="scrollRight" class="p-2 rounded-full bg-white shadow hover:bg-gray-100 border border-gray-200">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      
      <div 
        ref="carouselContainer"
        class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
      >
        <a 
          v-for="newspaper in newspapers" 
          :key="newspaper.id"
          :href="`https://new.graphicnewsplus.com/newspapers/${newspaper.id}?ref=${affiliateId}`"
          target="_blank"
          class="w-full flex-shrink-0 snap-center block no-underline"
        >
          <NewspaperCard :newspaper="newspaper" containMode />
        </a>
      </div>
    </div>

    <!-- Grid Mode -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Latest Newspapers</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <a 
          v-for="newspaper in newspapers" 
          :key="newspaper.id"
          :href="`https://new.graphicnewsplus.com/newspapers/${newspaper.id}?ref=${affiliateId}`"
          target="_blank"
          class="block no-underline"
        >
          <NewspaperCard :newspaper="newspaper" containMode />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from '#app';
import { getLatestNewsPapers } from '~/services/newsPapers';
import type { NewsPaper } from '~/models';

definePageMeta({
  layout: false
})

const route = useRoute();
const affiliateId = computed(() => route.params.id as string);
const widgetType = computed(() => route.query.type as string || 'carousel');

const newspapers = ref<NewsPaper[]>([]);
const carouselContainer = ref<HTMLElement | null>(null);

const scrollLeft = () => {
  if (carouselContainer.value) {
    carouselContainer.value.scrollBy({ left: -carouselContainer.value.clientWidth, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselContainer.value) {
    carouselContainer.value.scrollBy({ left: carouselContainer.value.clientWidth, behavior: 'smooth' });
  }
};

const formatNiceDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    // Fetch a bit more for the carousel to allow good scrolling
    const pageSize = widgetType.value === 'carousel' ? 12 : 12;
    const result = await getLatestNewsPapers({ pageNo: 1, pageSize });
    if (result && result.data) {
      newspapers.value = result.data.map((paper: NewsPaper) => ({
        id: paper.id,
        title: paper.title,
        date: formatNiceDate(paper.publicationDate),
        thumbnailId: paper.thumbnailId
      }));
    }
  } catch (error) {
    console.error("Error fetching latest newspapers for widget:", error);
  }
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
