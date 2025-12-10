<template>
  <section id="newspapers" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Latest Newspapers</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay informed with Ghana's most trusted newspaper publications
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <NewspaperCard 
          v-for="newspaper in newspapers" 
          :key="newspaper.id"
          :newspaper="newspaper"
          class="animate-slide-up"
        />
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/newspapers" class="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          View All Newspapers
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>

const newspapers = [
  {
    id: 1,
    title: 'Graphic Business',
    date: 'Tuesday, August 25, 2025',
    image: 'https://ext.same-assets.com/111305068/1514599064.jpeg'
  },
  {
    id: 2,
    title: 'Daily Graphic',
    date: 'Tuesday, August 25, 2025',
    image: 'https://ext.same-assets.com/111305068/2864186025.jpeg'
  },
  {
    id: 3,
    title: 'Daily Graphic',
    date: 'Monday, August 25, 2025',
    image: 'https://ext.same-assets.com/111305068/2030528556.jpeg'
  },
  {
    id: 4,
    title: 'Graphic Sports',
    date: 'Monday, August 25, 2025',
    image: 'https://ext.same-assets.com/111305068/3071757749.jpeg'
  },
  {
    id: 5,
    title: 'The Mirror',
    date: 'Saturday, August 23, 2025',
    image: 'https://ext.same-assets.com/111305068/1153830836.jpeg'
  },
  {
    id: 6,
    title: 'Daily Graphic',
    date: 'Saturday, August 23, 2025',
    image: 'https://ext.same-assets.com/111305068/3361168442.jpeg'
  }
]
</script>