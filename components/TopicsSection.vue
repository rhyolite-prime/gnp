<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Topics to Follow</h2>
        <p class="text-xl text-gray-600">Stay updated on subjects that matter to you</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <TopicCard 
          v-for="topic in topics" 
          :key="topic.id"
          :topic="topic"
          class="animate-scale-in"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const topics = [
  { id: 1, name: 'Ghana Year Book', gradient: 'from-pink-500 to-rose-500', icon: 'star' },
  { id: 2, name: 'Features', gradient: 'from-green-500 to-emerald-500', icon: 'document' },
  { id: 3, name: 'Opinions', gradient: 'from-blue-500 to-cyan-500', icon: 'calendar' },
  { id: 4, name: 'Editorials', gradient: 'from-orange-500 to-amber-500', icon: 'menu' },
  { id: 5, name: 'Paper Stories', gradient: 'from-gray-600 to-gray-700', icon: 'document' },
  { id: 6, name: 'Security', gradient: 'from-purple-500 to-indigo-500', icon: 'shield' }
]
</script>