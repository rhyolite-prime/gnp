<template>
  <section class="py-20 bg-white/50 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Top Stories</h2>
        <p class="text-xl text-gray-600">Breaking news and featured articles</p>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="stories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StoryCard 
          v-for="story in stories" 
          :key="story.id"
          :story="story"
          @click="openStory(story)"
          class="animate-slide-up cursor-pointer"
        />
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        No top stories available at the moment.
      </div>

      <div v-if="stories.length > 0" class="text-center mt-12">
        <button class="btn-primary">Read More Stories</button>
      </div>
    </div>

    <!-- Story Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen && selectedStory" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in relative">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
            <h3 class="text-2xl font-bold text-gray-900 pr-8">{{ selectedStory.title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2 flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="overflow-y-auto p-6 flex-1 min-h-0">
            <img v-if="selectedStory.image" :src="selectedStory.image" :alt="selectedStory.title" class="w-full h-auto max-h-[400px] object-cover rounded-xl mb-6">
            <div class="prose prose-blue max-w-none text-gray-700" v-html="selectedStory.content"></div>
          </div>
          
          <!-- Modal Footer -->
          <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
            <button @click="closeModal" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTopStories } from '~/services/newsPapers'

const stories = ref([])
const isLoading = ref(true)
const selectedStory = ref(null)
const isModalOpen = ref(false)

const openStory = (story) => {
  selectedStory.value = story
  isModalOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedStory.value = null
  }, 300) // Clear after animation
  document.body.style.overflow = ''
}

onMounted(async () => {
  try {
    const response = await getTopStories();

    console.log('data->', response.data);

    if (response && response.data.length > 0) {

      stories.value = response.data.map(article => {
        const plainText = article.attributes.text ? article.attributes.text.replace(/<[^>]*>?/gm, '') : ''
        const excerpt = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
        
        let image = article.attributes.images?.image_intro || article.attributes.images?.image_fulltext || null

        // Try to get category from relationships if possible, fallback to 'News'
        let categoryName = 'News'
        if (article.relationships?.category?.data?.id) {
          categoryName = 'Category ' + article.relationships.category.data.id // Fallback if no mapping is available
        }

        return {
          id: article.id,
          title: article.attributes.title,
          category: 'News', // Or use categoryName if we had actual names
          categoryColor: 'blue',
          excerpt: excerpt,
          image: image,
          content: article.attributes.text,
          isFeatured: article.attributes.featured === 1,
          isVideo: false // Assuming no video field is mapped for now
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch top stories:', error)
  } finally {
    isLoading.value = false
  }
})
</script>