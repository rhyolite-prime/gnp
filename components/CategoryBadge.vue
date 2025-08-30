<template>
  <span :class="badgeClasses">{{ category }}</span>
</template>

<script setup>
const props = defineProps({
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'gray'
  }
})

const badgeClasses = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }
  
  return `${colorMap[props.color] || colorMap.gray} text-xs font-medium px-2.5 py-0.5 rounded-full`
})
</script>