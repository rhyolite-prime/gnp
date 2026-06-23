<template>
  <section id="newspapers" class="py-20 bg-gray-50/50 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Latest Newspapers</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay informed with Ghana's most trusted newspaper publications
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <NewspaperCard 
          v-for="newspaper in newspapers" 
          :key="newspaper.id"
          :newspaper="newspaper"
          @click="viewNewspaper(newspaper)"
          class="animate-slide-up"
        />
      </div>

      <div class="text-center mt-12">
        <NuxtLink 
          to="/newspapers" 
          class="inline-flex items-center justify-center px-8 py-3.5 border border-transparent rounded-xl shadow-lg shadow-gray-900/20 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transform transition-all duration-300 hover:-translate-y-0.5"
        >
          View All Newspapers
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getLatestNewsPapers } from '~/services/newsPapers';
import type { NewsPaper } from '~/models';

const newspapers = ref<NewsPaper[]>([]);

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

function viewNewspaper(newspaper: NewsPaper) {
  
  // Navigate to newspaper detail page
  navigateTo(`/newspapers/${newspaper.id}`)
}

onMounted(async () => {
    try {
        const result = await getLatestNewsPapers({  pageNo:1, pageSize: 6 });
        if (result && result.data) {
            newspapers.value = result.data.map((paper: NewsPaper) => ({
                id: paper.id,
                title: paper.title,
                date: formatNiceDate(paper.publicationDate),
                thumbnailId: paper.thumbnailId
            }));
        }
    } catch (error) {
        console.error("Error fetching latest newspapers:", error);
    }
});
</script>