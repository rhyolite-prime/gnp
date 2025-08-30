<template>
  <NuxtLink to="#" class="group">
    <div :class="[
      'bg-gradient-to-r text-white p-6 rounded-xl text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl',
      `${topic.gradient}`
    ]">
      <div class="mb-2">
        <IconStar v-if="topic.icon === 'star'" class="w-8 h-8 mx-auto" />
        <IconDocument v-else-if="topic.icon === 'document'" class="w-8 h-8 mx-auto" />
        <IconCalendar v-else-if="topic.icon === 'calendar'" class="w-8 h-8 mx-auto" />
        <IconMenu v-else-if="topic.icon === 'menu'" class="w-8 h-8 mx-auto" />
        <IconShield v-else-if="topic.icon === 'shield'" class="w-8 h-8 mx-auto" />
      </div>
      <h3 class="font-semibold">{{ topic.name }}</h3>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  topic: {
    type: Object,
    required: true
  }
})
</script>