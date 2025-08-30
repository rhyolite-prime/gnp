<template>
  <section id="videos" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Latest Videos</h2>
        <p class="text-xl text-gray-600">Watch the latest news and featured content</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <VideoCard 
          v-for="video in videos" 
          :key="video.id"
          :video="video"
          class="animate-slide-up"
        />
      </div>

      <div class="text-center mt-12">
        <button class="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Watch More Videos
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const videos = [
  {
    id: 1,
    title: 'The Ghanaian Trumpeter at Buckingham Palace',
    description: 'Royal performance highlights Ghanaian musical talent...',
    thumbnail: 'https://ext.same-assets.com/111305068/2385636436.png'
  },
  {
    id: 2,
    title: 'Security chiefs pledge loyalty to President',
    description: 'Military and security leadership affirm commitment...',
    thumbnail: 'https://ext.same-assets.com/111305068/3057553277.png'
  },
  {
    id: 3,
    title: 'Court to rule on NDC\'s objection',
    description: 'Legal proceedings on mandamus application scheduled...',
    thumbnail: 'https://ext.same-assets.com/111305068/1051578448.jpeg'
  },
  {
    id: 4,
    title: 'Democracy and Electoral Process',
    description: 'Discussion on Ghana\'s democratic institutions...',
    thumbnail: 'https://ext.same-assets.com/111305068/895135478.jpeg'
  }
]
</script>