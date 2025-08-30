<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Suggested For You</h2>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">Based on your reading history</span>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
    </div>
    
    <div v-else-if="suggestedArticles.length === 0" class="py-8 text-center">
      <p class="text-gray-500">No suggested articles available.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SuggestedArticleCard
        v-for="article in suggestedArticles"
        :key="article.id"
        :article="article"
        @click="viewArticle(article)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  source: string;
  relevanceScore: number;
}

// Props
defineProps({
  currentNewspaperId: {
    type: Number,
    default: 0
  }
});

// State
const isLoading = ref(true);
const suggestedArticles = ref<Article[]>([]);

// Simulated API call to recommendation engine
onMounted(async () => {
  try {
    // In a real application, this would be an API call to a recommendation engine
    // The API would likely take parameters like user ID, current article/newspaper ID, etc.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    
    // Simulated response from recommendation engine
    suggestedArticles.value = [
      {
        id: 101,
        title: "Ghana's Economic Recovery: Experts Predict Growth in Q4",
        excerpt: "Financial analysts are predicting strong economic recovery in the fourth quarter as key indicators show positive trends.",
        image: "https://placehold.co/400x300/3498db/ffffff?text=Economy",
        date: "August 26, 2025",
        source: "Daily Graphic",
        relevanceScore: 0.92
      },
      {
        id: 102,
        title: "New Infrastructure Projects to Create 5,000 Jobs",
        excerpt: "Government announces major infrastructure development initiative expected to create thousands of jobs across the country.",
        image: "https://placehold.co/400x300/2ecc71/ffffff?text=Jobs",
        date: "August 25, 2025",
        source: "Graphic Business",
        relevanceScore: 0.87
      },
      {
        id: 103,
        title: "Tech Hub Expansion in Accra Attracts Foreign Investment",
        excerpt: "Accra's growing technology sector continues to attract significant foreign direct investment, positioning Ghana as a tech leader.",
        image: "https://placehold.co/400x300/9b59b6/ffffff?text=Tech",
        date: "August 24, 2025",
        source: "Graphic Business",
        relevanceScore: 0.85
      }
    ];
  } catch (error) {
    console.error("Error fetching suggested articles:", error);
    suggestedArticles.value = [];
  } finally {
    isLoading.value = false;
  }
});

function viewArticle(article: Article) {
  // In a real application, navigate to the article detail page
  console.log('Viewing article:', article.title);
}
</script>
