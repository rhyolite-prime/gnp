<template>
  <div class="relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-100/50 blur-3xl opacity-60 animate-pulse"></div>
      <div class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-[80%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-50/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <HeroSection />
      <NewspapersSection />
      <TopStoriesSection />
      <VideosSection />
      <MagazinesSection />
      <TopicsSection />
       
    </div>
  </div>
</template>

<script setup lang="ts">

// Page metadata
useHead({
  title: 'Graphic NewsPlus - Digital News Platform',
  meta: [
    { name: 'description', content: 'Ghana\'s leading digital news platform providing access to trusted newspapers, magazines, and breaking news.' }
  ]
})
</script>