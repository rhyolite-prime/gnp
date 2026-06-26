<template>
  <section class="gradient-hero text-white py-20 animate-fade-in">
    <div class="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="animate-slide-up">
          <h1 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ghana's Leading
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
              Digital News
            </span>
            Platform
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            Access digital versions of Ghana's most trusted newspapers including The Daily Graphic,
            Graphic Business, Graphic Sports, and more.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="btn-primary" @click="showSignInModal = true">Get Started</button>
            <NuxtLink to="/learn-more" class="btn-secondary text-center">Learn More</NuxtLink>
          </div>
        </div>
        <!-- <div class="hidden lg:block relative animate-scale-in">
          <div class="relative z-10">
            <img 
              src="/news-plus-mobile.jpg" 
              alt="Mobile App" 
              class="w-80 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              loading="lazy"
            >
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script setup>
const showSignInModal = useState('showSignInModal', () => false);
</script>