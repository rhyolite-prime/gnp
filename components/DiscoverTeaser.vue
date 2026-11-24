<template>
  <section class="overflow-hidden bg-stone-950 py-12 text-white sm:py-16" aria-labelledby="discover-teaser-title">
    <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Meet your new daily scroll</p>
        <h2 id="discover-teaser-title" class="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Your next great read.<br /><span class="text-amber-300">One swipe away.</span></h2>
        <p class="mt-5 max-w-xl text-base leading-8 text-stone-300">Big headlines. Hidden gems. Stories you didn’t know you needed. Discover a fresh mix of newspapers, videos and archive pages—with more of what matters to you.</p>
        <div class="mt-7 flex flex-wrap items-center gap-4">
          <NuxtLink to="/discover" class="inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-amber-300 px-7 py-3 font-bold text-stone-950 transition-colors hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">Start discovering <span aria-hidden="true">↗</span></NuxtLink>
          <span class="text-xs leading-6 text-stone-400">Explore previews freely.<br />Full editions use your subscription.</span>
        </div>
      </div>
      <NuxtLink to="/discover" aria-label="Try the shuffled Discover feed" class="group relative mx-auto block w-full max-w-lg rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
        <div class="absolute inset-x-8 -inset-y-3 rotate-3 rounded-3xl border border-white/10 bg-white/5 transition-transform group-hover:rotate-6 motion-reduce:transform-none" aria-hidden="true" />
        <div class="relative overflow-hidden rounded-3xl border border-white/20 bg-stone-900">
          <img src="/images/explore-newspapers.jpg" alt="" width="1536" height="1024" loading="lazy" class="aspect-[16/9] w-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
          <div class="absolute left-5 top-5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-stone-950">FOR YOU + SOMETHING NEW</div>
          <div class="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
            <div><p class="text-xs font-semibold uppercase tracking-wider text-stone-300">Read · Watch · Rediscover</p><p class="mt-2 text-xl font-bold sm:text-2xl">A world of stories. In one feed.</p></div>
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl text-stone-950" aria-hidden="true">↓</span>
          </div>
        </div>
        <p class="mt-5 text-center text-xs tracking-wide text-stone-400">Swipe to explore. Follow your curiosity.</p>
      </NuxtLink>
    </div>
  </section>
</template>
