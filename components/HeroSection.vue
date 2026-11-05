<template>
  <section class="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8" aria-labelledby="home-hero-title">
    <div class="relative isolate mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#142a2b] text-white shadow-2xl shadow-emerald-950/15 lg:min-h-[540px] lg:grid-cols-[1.02fr_.98fr]">
      <!-- Soft editorial textures and warm light -->
      <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div class="absolute -left-24 -top-36 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div class="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-orange-300/10 blur-3xl" />
        <div class="absolute inset-0 opacity-[0.08]" style="background-image: radial-gradient(#fff 0.7px, transparent 0.7px); background-size: 15px 15px;" />
      </div>

      <div class="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div class="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-emerald-100">
          <span class="h-2 w-2 rounded-full bg-[#f4b65f] shadow-[0_0_12px_rgba(244,182,95,.7)]" />
          THE STORIES THAT SHAPE GHANA
        </div>
        <h1 id="home-hero-title" class="max-w-2xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl xl:text-[4.35rem]">
          Your country.<br>
          <span class="font-display font-medium italic text-[#f4bd72]">Your stories.</span>
          Your morning.
        </h1>
        <p class="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
          Ghana’s trusted journalism, brought together in one thoughtful place. Catch up on the headlines, hear every perspective, and stay close to what matters.
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f4bd72] px-6 py-3 text-sm font-bold text-[#172a29] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffd08d] focus:outline-none focus:ring-2 focus:ring-[#f4bd72] focus:ring-offset-2 focus:ring-offset-[#142a2b]" @click="showSignInModal = true">
            Get started
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4"><path d="M4.5 10h11m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <NuxtLink to="/learn-more" class="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70">
            Get to know us
          </NuxtLink>
        </div>
        <div class="mt-9 flex items-center gap-3 text-xs font-medium text-slate-300 sm:text-sm">
          <div class="flex -space-x-2" aria-hidden="true">
            <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#142a2b] bg-[#e9b17a] text-[10px] font-bold text-[#293a34]">G</span>
            <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#142a2b] bg-[#a9c7a8] text-[10px] font-bold text-[#293a34]">N</span>
            <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#142a2b] bg-[#e4a29a] text-[10px] font-bold text-[#293a34]">+</span>
          </div>
          <span>Independent voices. A more informed Ghana.</span>
        </div>
      </div>

      <!-- A warm, hand-built editorial illustration: a reader and their morning paper -->
      <div class="relative flex min-h-[300px] items-center justify-center px-5 pb-9 sm:min-h-[400px] lg:min-h-full lg:px-8 lg:py-10" aria-hidden="true">
        <div class="absolute right-[8%] top-[13%] h-64 w-64 rounded-full bg-[#f4bd72]/10 blur-2xl sm:h-80 sm:w-80" />
        <div class="absolute right-[8%] top-[12%] h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72" />
        <div class="absolute right-[16%] top-[18%] h-44 w-44 rounded-full border border-dashed border-white/15 sm:h-60 sm:w-60" />
        <div class="relative z-10 w-full max-w-[470px]">
          <svg viewBox="0 0 520 430" class="w-full drop-shadow-[0_28px_35px_rgba(0,0,0,.2)]" role="img" aria-label="Illustration of a reader enjoying the morning news">
            <!-- window / sunrise -->
            <path d="M123 70a137 137 0 0 1 274 0v160H123V70Z" fill="#f2b968" opacity=".16" />
            <path d="M164 130a96 96 0 0 1 192 0v90H164v-90Z" fill="#f4bd72" opacity=".25" />
            <path d="M203 158a57 57 0 0 1 114 0" fill="none" stroke="#f8d19b" stroke-width="3" opacity=".8" />
            <!-- plant -->
            <path d="M419 337v-82m0 36c-29-1-40-18-39-36 24 1 39 14 39 36Zm0-14c1-26 15-39 36-40 0 23-12 38-36 40Z" fill="#9bb88f" stroke="#9bb88f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M397 338h46l-5 32h-36l-5-32Z" fill="#e39b6d" />
            <!-- person torso -->
            <path d="M176 373c5-72 38-116 96-116s93 44 99 116H176Z" fill="#d97f5f" />
            <path d="M214 279c11-17 30-28 57-28 25 0 45 10 58 28l-29 43h-57l-29-43Z" fill="#f1b977" />
            <!-- neck and face -->
            <path d="M237 239h67v47c-9 15-19 22-34 22s-25-7-33-22v-47Z" fill="#9b5c43" />
            <ellipse cx="270" cy="189" rx="66" ry="78" fill="#b96d4f" />
            <!-- hair -->
            <path d="M206 187c-13-50 7-96 61-99 44-3 72 27 67 77-14-6-24-21-29-37-19 20-53 31-99 30v29l-5 0Z" fill="#282b27" />
            <path d="M207 180c-9 2-13 12-9 24 3 8 9 12 16 10m119-33c9 2 13 12 9 24-3 8-9 12-16 10" fill="#b96d4f" />
            <path d="M244 192h1m50 0h1" stroke="#342a25" stroke-width="6" stroke-linecap="round" />
            <path d="M256 222c9 6 20 6 29 0" fill="none" stroke="#713c32" stroke-width="3" stroke-linecap="round" />
            <!-- hands holding paper -->
            <path d="M185 309c-15-13-31-8-35 4-4 12 5 21 20 31l36 28 20-24-41-39Zm171 0c15-13 31-8 35 4 4 12-5 21-20 31l-36 28-20-24 41-39Z" fill="#a96349" />
            <!-- newspaper -->
            <path d="M126 289c0-7 5-12 12-12h264c7 0 12 5 12 12v100c0 7-5 12-12 12H138c-7 0-12-5-12-12V289Z" fill="#fbf5e9" />
            <path d="M126 301h288" stroke="#d9cbb4" stroke-width="2" />
            <text x="145" y="297" fill="#31504a" font-size="11" font-family="Georgia,serif" font-weight="700" letter-spacing="2">THE MORNING EDITION</text>
            <path d="M145 319h98v51h-98z" fill="#e5a36f" />
            <path d="M153 359c17-27 28-27 43-9 9-16 17-18 39-2v22h-82v-11Z" fill="#587a68" />
            <path d="M255 321h135m-135 8h121m-121 8h133m-133 8h116m-116 8h130m-130 8h99" stroke="#8e8b7e" stroke-width="3" stroke-linecap="round" opacity=".65" />
            <path d="M145 379h245" stroke="#d9cbb4" stroke-width="2" />
          </svg>
          <div class="absolute -left-1 bottom-[14%] rounded-2xl border border-white/15 bg-[#fffaf1] px-4 py-3 text-[#263d37] shadow-xl sm:-left-3 sm:bottom-[12%]">
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#8b5e3c]"><span class="h-1.5 w-1.5 rounded-full bg-[#d77b5b]" />Made for curious minds</div>
            <p class="mt-1 font-display text-lg italic">Read beyond the headline.</p>
          </div>
          <div class="absolute -right-1 top-[9%] rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur sm:right-0 sm:top-[8%]">Accra · Ghana</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const showSignInModal = useState('showSignInModal', () => false)
</script>
