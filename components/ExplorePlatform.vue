<template>
  <section class="bg-[#fbfaf7] py-14 sm:py-20" aria-labelledby="explore-platform-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Discover more</p>
        <h2 id="explore-platform-title" class="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Your world. Connected by stories.</h2>
        <p class="mt-4 leading-7 text-stone-600">Read today's editions, revisit the past, or help shape what comes next.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="item in destinations" :key="item.slug" :to="`/${item.slug}`" class="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">
          <div class="overflow-hidden bg-stone-100">
            <img :src="`/images/explore-${item.slug}.jpg`" alt="" width="1536" height="1024" loading="lazy" decoding="async" class="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
          </div>
          <div class="p-5">
            <h3 class="text-xl font-bold text-stone-900">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-stone-600">{{ item.description }}</p>
            <span class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">{{ item.action }} <span aria-hidden="true">↗</span></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const destinations = [
  { slug: 'newspapers', title: 'Newspapers', description: 'Trusted journalism. Fresh perspectives. Your favourite editions, wherever you are.', action: 'Explore editions' },
  { slug: 'archives', title: 'Archives', description: 'Rediscover the headlines and moments that shaped our shared history.', action: 'Explore the past' },
  { slug: 'affiliates', title: 'Affiliates', description: 'Share the stories that matter and discover our affiliate community.', action: 'Become an affiliate' },
  { slug: 'partners', title: 'Partners', description: 'Build meaningful connections and explore opportunities with Graphic NewsPlus.', action: 'Partner with us' },
];
</script>
