<template>
  <a 
    :href="href" 
    :aria-label="label"
    class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
  >
    <IconTwitter v-if="icon === 'twitter'" class="w-5 h-5" />
    <IconFacebook v-else-if="icon === 'facebook'" class="w-5 h-5" />
    <IconPinterest v-else-if="icon === 'pinterest'" class="w-5 h-5" />
    <IconYoutube v-else-if="icon === 'youtube'" class="w-5 h-5" />
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>