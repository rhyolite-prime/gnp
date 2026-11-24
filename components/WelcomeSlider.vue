<template>
  <div
    class="relative aspect-[4/5] w-full bg-stone-100"
    role="region"
    aria-roledescription="carousel"
    aria-label="Welcome to Graphic NewsPlus"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = !$event.currentTarget.contains($event.relatedTarget)"
    @keydown.left.prevent="move(-1)"
    @keydown.right.prevent="move(1)"
  >
    <img
      v-for="(slide, index) in slides"
      :key="slide"
      :src="slide"
      :alt="`Graphic NewsPlus welcome image ${index + 1}`"
      :aria-hidden="index !== active"
      :fetchpriority="index === 0 ? 'high' : 'auto'"
      :loading="index === 0 ? 'eager' : 'lazy'"
      class="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-opacity duration-1000 motion-reduce:transition-none"
      :class="index === active ? 'opacity-100' : 'opacity-0'"
      width="682"
      height="761"
    />
    <div class="absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2 rounded-full bg-stone-950/70 p-1.5 text-white backdrop-blur">
      <button type="button" aria-label="Previous welcome slide" class="slider-control" @click="move(-1)">←</button>
      <div class="flex items-center gap-1">
        <button v-for="(_, index) in slides" :key="index" type="button" :aria-label="`Show welcome slide ${index + 1}`" :aria-current="index === active ? 'true' : undefined" class="flex h-10 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2" @click="active = index">
          <span class="h-2 rounded-full transition-all motion-reduce:transition-none" :class="index === active ? 'w-6 bg-white' : 'w-2 bg-white/50'" />
        </button>
      </div>
      <button type="button" class="slider-control text-xs" :aria-label="paused ? 'Play slideshow' : 'Pause slideshow'" @click="paused = !paused">{{ paused ? 'Play' : 'Pause' }}</button>
      <button type="button" aria-label="Next welcome slide" class="slider-control" @click="move(1)">→</button>
    </div>
    <span class="sr-only" aria-live="off">Slide {{ active + 1 }} of {{ slides.length }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
const slides = ['/welcome-1.png', '/welcome-2.jpeg', '/welcome-3.jpeg', '/welcome-4.jpeg'];
const active = ref(0);
const paused = ref(false);
const hovered = ref(false);
const focused = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
let motion: MediaQueryList | undefined;
const syncMotion = () => { paused.value = motion?.matches ?? false; };
const move = (direction: number) => { active.value = (active.value + direction + slides.length) % slides.length; };
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotion();
  motion.addEventListener('change', syncMotion);
  timer = setInterval(() => {
    if (!paused.value && !hovered.value && !focused.value && !document.hidden) move(1);
  }, 6000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
  motion?.removeEventListener('change', syncMotion);
});
</script>

<style scoped>
.slider-control { @apply flex h-10 min-w-[40px] items-center justify-center rounded-full px-2 font-semibold hover:bg-white/20 focus-visible:outline focus-visible:outline-2; }
</style>
