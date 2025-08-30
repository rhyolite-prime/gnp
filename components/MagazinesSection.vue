<template>
  <section id="magazines" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Magazines</h2>
        <p class="text-xl text-gray-600">Special publications and annual editions</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <MagazineCard 
          v-for="magazine in magazines" 
          :key="magazine.id"
          :magazine="magazine"
          class="animate-slide-up"
        />
      </div>

      <div class="text-center mt-12">
        <button class="btn-primary">Browse All Magazines</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const magazines = [
  {
    id: 1,
    title: 'Ghana Year Book',
    edition: '2023 Edition',
    description: 'Comprehensive annual review of Ghana\'s progress and achievements',
    cover: 'https://ext.same-assets.com/111305068/2302760565.png'
  },
  {
    id: 2,
    title: 'Ghana Year Book',
    edition: 'Special Edition',
    description: 'Annual documentation of national development and milestones',
    cover: 'https://ext.same-assets.com/111305068/3247166541.jpeg'
  },
  {
    id: 3,
    title: 'Ghana Year Book',
    edition: '2022 Edition',
    description: 'Annual publication documenting Ghana\'s journey and achievements',
    cover: 'https://ext.same-assets.com/111305068/266935990.png'
  }
]
</script>