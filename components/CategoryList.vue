<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h2>
    <ul class="space-y-2">
      <li v-for="(category, index) in categories" :key="index">
        <a 
          :href="category.link" 
          :class="[
            category.active ? 'text-red-600 font-medium' : 'text-gray-700 hover:text-red-600'
          ]"
          @click.prevent="selectCategory(category)"
        >
          {{ category.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])

function selectCategory(category) {
  emit('select', category)
}
</script>
