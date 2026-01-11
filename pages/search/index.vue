<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Search Results for: <span class="text-primary-600">"{{ route.query.q }}"</span>
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          Found {{ searchResults.length }} results
        </p>
      </div>

      <!-- Results Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="result in searchResults" :key="result.id" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-200 relative">
            <img :src="result.image" :alt="result.title" class="w-full h-full object-cover">
            <div class="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              {{ result.category }}
            </div>
          </div>
          <div class="p-6">
            <div class="text-sm text-gray-500 mb-2">{{ result.date }}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {{ result.title }}
            </h3>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
              {{ result.excerpt }}
            </p>
            <button class="text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm">
              Read More &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="searchResults.length === 0" class="text-center py-12">
        <IconSearch class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// Mock Data
const searchResults = [
  {
    id: 1,
    title: "New Economic Policy Announced by Central Bank",
    excerpt: "The Central Bank has unveiled a comprehensive economic policy aimed at stabilizing inflation and promoting growth in the manufacturing sector.",
    category: "Business",
    date: "Jan 9, 2025",
    image: "https://placehold.co/600x400/1d4ed8/ffffff?text=Business"
  },
  {
    id: 2,
    title: "National Football Team Qualifies for World Cup",
    excerpt: "In a stunning victory against their rivals, the national team has secured a spot in the upcoming World Cup, sparking celebrations across the country.",
    category: "Sports",
    date: "Jan 8, 2025",
    image: "https://placehold.co/600x400/dc2626/ffffff?text=Sports"
  },
  {
    id: 3,
    title: "Tech Summit 2025: Key Takeaways",
    excerpt: "Industry leaders gathered to discuss the future of AI, renewable energy, and digital infrastructure at the annual Tech Summit.",
    category: "Technology",
    date: "Jan 7, 2025",
    image: "https://placehold.co/600x400/059669/ffffff?text=Tech"
  },
  {
    id: 4,
    title: "Local Art Exhibition Draws Record Crowds",
    excerpt: "The 'Colors of Culture' exhibition has become the most visited art event of the decade, featuring works from over 50 local artists.",
    category: "Lifestyle",
    date: "Jan 6, 2025",
    image: "https://placehold.co/600x400/7c3aed/ffffff?text=Art"
  },
  {
    id: 5,
    title: "Climate Change Initiative Launches New Project",
    excerpt: "A new reforestation project aims to plant one million trees over the next five years to combat rising carbon emissions.",
    category: "Environment",
    date: "Jan 5, 2025",
    image: "https://placehold.co/600x400/ea580c/ffffff?text=Nature"
  }
]
</script>
