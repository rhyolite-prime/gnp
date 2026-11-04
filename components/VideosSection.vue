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
        <NuxtLink
          to="/more/videos"
          class="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Watch More Videos
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { latestVideos } from '~/utils/latestVideos'

const videos = latestVideos
</script>