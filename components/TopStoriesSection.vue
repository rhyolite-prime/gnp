<template>
  <section class="py-20 bg-white/50 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Top Stories</h2>
        <p class="text-xl text-gray-600">Breaking news and featured articles</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StoryCard 
          v-for="story in stories" 
          :key="story.id"
          :story="story"
          class="animate-slide-up"
        />
      </div>

      <div class="text-center mt-12">
        <button class="btn-primary">Read More Stories</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const stories = [
  {
    id: 1,
    title: 'Bryan Acheampong said Bawumia was a victim, not cause of conflict',
    category: 'Politics',
    categoryColor: 'blue',
    excerpt: 'Campaign team addresses recent statements regarding tribal conflicts...',
    image: 'https://ext.same-assets.com/111305068/1942877525.jpeg'
  },
  {
    id: 2,
    title: 'Abdul Fatawu Issahaku scores first goal in almost 15 months',
    category: 'Sports',
    categoryColor: 'green',
    excerpt: 'Leicester City midfielder breaks goal drought in spectacular fashion...',
    image: 'https://ext.same-assets.com/111305068/62799629.jpeg'
  },
  {
    id: 3,
    title: 'VIDEO: Bawumia fires back and rejects tribal attacks',
    category: 'Politics',
    categoryColor: 'blue',
    excerpt: 'Vice President addresses recent controversies in NPP race...',
    isVideo: true
  },
  {
    id: 4,
    title: 'Abuja shines: A heartfelt ode to Nigeria\'s capital',
    category: 'Features',
    categoryColor: 'purple',
    excerpt: 'Exploring the beauty and significance of Nigeria\'s federal capital...',
    isFeatured: true
  }
]
</script>