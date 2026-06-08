<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="lg:col-span-2">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">G</span>
            </div>
            <div class="ml-3">
              <h3 class="text-xl font-bold text-white">Graphic NewsPlus</h3>
              <p class="text-gray-400 text-sm">Digital News Platform</p>
            </div>
          </div>
          <p class="text-gray-300 mb-6 leading-relaxed max-w-md">
            Graphic NewsPlus provides you with digital versions of Graphic Communications'
            six leading newspaper publications: The Daily Graphic, Graphic Business,
            Graphic Showbiz, The Mirror, Graphic Sports and Junior Graphic.
          </p>
          <div class="flex space-x-4">
            <SocialLink 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.href"
              :label="social.name">
              
            </SocialLink>
          </div>
        </div>

        <!-- Information -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white">Information</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/about" class="footer-link">About Us</NuxtLink></li>
            <li><a href="#magazines" class="footer-link">Magazines</a></li>
            <li><NuxtLink to="/news" class="footer-link">News</NuxtLink></li>
            <li><NuxtLink to="/services" class="footer-link">Graphic Services</NuxtLink></li>
            <li><NuxtLink to="/partners" class="footer-link">Commercial Partners</NuxtLink></li>
            <li><NuxtLink to="/contact" class="footer-link">Contact Us</NuxtLink></li>
          </ul>
        </div>

        <!-- Help -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white">Help</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/faq" class="footer-link">FAQ</NuxtLink></li>
            <li><NuxtLink to="/signin" class="footer-link">Sign In</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="footer-link">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="footer-link">Terms & Conditions</NuxtLink></li>
            <li><NuxtLink to="/support" class="footer-link">Support</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">
          © 2015 - {{ currentYear }} Graphic NewsPlus. All rights reserved.
        </p>
        <p class="text-gray-400 text-sm mt-2 md:mt-0">
          Phone: +233 551484843
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>

import {
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { name: 'Twitter', href: '#', icon: ChatBubbleLeftRightIcon },
  { name: 'Facebook', href: '#', icon: GlobeAltIcon },
  { name: 'Pinterest', href: '#', icon: PhotoIcon },
  { name: 'YouTube', href: '#', icon: PlayIcon }
]
</script>

<style scoped>
.footer-link {
  @apply text-gray-300 hover:text-white transition-colors;
}
</style>