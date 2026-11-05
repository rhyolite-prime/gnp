<template>
  <section class="border-b border-stone-200 bg-[#fffcfc]" aria-labelledby="home-hero-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Utility / masthead strip — Times of India style -->
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-stone-200 py-2.5 text-[11px] leading-none">
        <div class="flex flex-wrap items-center gap-2.5 font-medium tracking-[0.14em] text-stone-600">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" aria-hidden="true" />
            ACCRA • GHANA
          </span>
          <span class="hidden h-3 w-px bg-stone-200 sm:block" aria-hidden="true" />
          <span class="font-bold tracking-[0.16em] text-stone-900">{{ todayLabel }}</span>
          <span class="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-black tracking-[0.16em] text-stone-700 shadow-sm sm:inline-flex">
            E-PAPER • VOL. 74 • NO. 212
          </span>
          <span class="hidden items-center gap-1 rounded-full bg-stone-900 px-2 py-1 text-[10px] font-bold tracking-widest text-white lg:inline-flex">EST. 1950 • DAILY GRAPHIC</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] font-semibold">
          <span class="hidden items-center gap-1.5 text-stone-500 lg:inline-flex">
            <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5 text-stone-400" aria-hidden="true"><path d="M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 0v1.2M10 15.3V16.5M3.5 10H4.7M15.3 10H16.5M5.4 5.4l.85.85M13.75 13.75l.85.85M14.6 5.4l-.85.85M6.25 13.75l-.85.85M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Ghana’s most trusted newsroom
          </span>
          <NuxtLink to="/newspapers" class="hidden items-center gap-1 text-stone-700 underline decoration-stone-300 underline-offset-4 hover:text-primary-700 sm:inline-flex">Today’s Papers</NuxtLink>
          <span class="hidden h-3 w-px bg-stone-200 sm:block" aria-hidden="true" />
          <span class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-[10px] font-black tracking-[0.14em] text-primary-700 ring-1 ring-primary-200">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-600" /> LIVE
          </span>
        </div>
      </div>

      <!-- Breaking / Just In ribbon — TOI signature red + black -->
      <div class="mt-3 flex items-stretch overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm sm:mt-4">
        <div class="flex shrink-0 items-center gap-2 bg-primary-600 px-3 py-2.5 text-xs font-black tracking-[0.14em] text-white sm:px-4">
          <span class="hidden h-2 w-2 animate-pulse rounded-full bg-white sm:block" aria-hidden="true" />
          BREAKING
        </div>
        <div class="hidden shrink-0 items-center bg-stone-900 px-3 text-xs font-bold tracking-widest text-white sm:flex" aria-hidden="true">
          JUST IN
        </div>
        <div class="flex min-w-0 flex-1 items-center gap-3 bg-stone-50/70 px-3 py-2.5 sm:px-4">
          <p class="min-w-0 flex-1 truncate text-sm font-semibold leading-5 text-stone-800">
            All of Ghana’s front pages in one place — Daily Graphic, Graphic Showbiz, The Mirror & more, before the streets wake up.
          </p>
          <NuxtLink to="/newspapers" class="hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-700 ring-1 ring-stone-200 hover:bg-stone-50 sm:inline-flex">
            Explore
            <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5" aria-hidden="true"><path d="M7 5l6 5-6 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Section nav — TOI horizontal category bar -->
      <nav class="mt-3 flex items-center gap-1 overflow-x-auto border-y border-stone-200 py-2.5 text-xs font-bold tracking-[0.12em] text-stone-700 scrollbar-none" aria-label="Sections">
        <span class="mr-2 shrink-0 rounded-full bg-stone-900 px-3 py-1.5 text-white">TOP STORIES</span>
        <a href="#newspapers" class="shrink-0 rounded-full px-3 py-1.5 hover:bg-stone-100 hover:text-stone-900">FRONT PAGES</a>
        <NuxtLink to="/newspapers" class="shrink-0 rounded-full px-3 py-1.5 hover:bg-stone-100">NATION</NuxtLink>
        <NuxtLink to="/archives" class="shrink-0 rounded-full px-3 py-1.5 hover:bg-stone-100">ARCHIVES</NuxtLink>
        <span class="shrink-0 rounded-full px-3 py-1.5 text-stone-400">BUSINESS</span>
        <span class="shrink-0 rounded-full px-3 py-1.5 text-stone-400">SPORTS</span>
        <span class="shrink-0 rounded-full px-3 py-1.5 text-stone-400">SHOWBIZ</span>
        <span class="hidden shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-primary-700 ring-1 ring-primary-200 sm:inline-flex">E-PAPER • FROM GH₵1/DAY</span>
      </nav>

      <!-- MAIN GRID — Left: lead story + cover strip / Right: inside + promo -->
      <div class="grid gap-8 py-6 sm:py-8 lg:grid-cols-12 lg:gap-10">
        <!-- Lead -->
        <div class="lg:col-span-8">
          <article>
            <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-primary-700">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-600" aria-hidden="true" /> THE FRONT PAGE • TODAY’S EDITION — UPDATED 05:30 GMT
            </div>

            <h1 id="home-hero-title" class="max-w-[18ch] font-serif text-[2.15rem] font-black leading-[0.9] tracking-[-0.05em] text-stone-900 sm:text-[2.85rem] lg:text-[3.65rem]">
              Ghana wakes up<br />
              <span class="font-display italic font-medium text-primary-700">with Graphic</span><br />
              NewsPlus.
            </h1>

            <p class="mt-4 max-w-[52ch] text-[15px] font-medium leading-7 text-stone-600 sm:text-[17px] sm:leading-8">
              The Times of India, made for Ghana. Every trusted front page — <span class="font-semibold text-stone-900">Daily Graphic, Mirror, Showbiz & Junior Graphic</span> — curated in a single, fast, beautifully readable e-paper.
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span class="inline-flex items-center gap-1.5 font-semibold text-stone-700">
                <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-black text-white">G</span>
                By Graphic NewsPlus • Accra
              </span>
              <span class="h-1 w-1 rounded-full bg-stone-300" aria-hidden="true" />
              <span>Updated just now • 12 papers • 7-day archive</span>
              <span class="hidden h-1 w-1 rounded-full bg-stone-300 sm:block" aria-hidden="true" />
              <span class="hidden items-center gap-1 font-semibold text-primary-700 sm:inline-flex">
                <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5" aria-hidden="true"><path d="M10 3.5l1.2 3.7H15l-3 2.2 1.2 3.7L10 10.9 6.8 13.1l1.2-3.7-3-2.2h3.8L10 3.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                Trusted by 2M+ readers
              </span>
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                class="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-black tracking-wide text-white shadow-[0_10px_20px_rgba(220,38,38,0.25)] transition hover:bg-primary-700 hover:shadow-[0_12px_24px_rgba(220,38,38,0.3)] focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                @click="showSignInModal = true"
              >
                Subscribe & Read — GH₵15/mo
                <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4" aria-hidden="true"><path d="M4.5 10h11m0 0L11 5.5M15.5 10 11 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <NuxtLink
                to="/newspapers"
                class="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                Read Today’s Papers
                <span class="hidden rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-black tracking-widest text-white sm:inline">FREE PREVIEW</span>
              </NuxtLink>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600">
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
                <svg viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5" aria-hidden="true"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Cancel anytime
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-stone-700 ring-1 ring-stone-200">7-day archive • Offline reading</span>
              <NuxtLink to="/learn-more" class="inline-flex items-center gap-1 text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-800">How it works →</NuxtLink>
            </div>

            <!-- TOI-style cover strip — fanned front pages, red accent -->
            <div class="relative mt-8 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
              <div class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-stone-900" aria-hidden="true" />
              <div class="flex items-center justify-between gap-3 py-2">
                <p class="text-xs font-black tracking-[0.16em] text-stone-700">TODAY ON THE STANDS</p>
                <p class="hidden text-xs font-semibold text-stone-500 sm:block">Pinch to zoom • Search inside • Clip & share</p>
                <NuxtLink to="/newspapers" class="shrink-0 text-xs font-bold text-primary-700 hover:text-primary-800">View all 12 →</NuxtLink>
              </div>
              <div class="grid grid-cols-3 gap-3 sm:gap-4">
                <!-- Cover 1 — Daily Graphic -->
                <div class="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                  <div class="absolute inset-x-0 top-0 h-1 bg-primary-600" aria-hidden="true" />
                  <div class="aspect-[3/4] p-2.5 sm:p-3">
                    <div class="flex h-full flex-col border border-stone-200 bg-white p-2 shadow-sm sm:p-2.5">
                      <div class="flex items-center justify-between border-b border-primary-600 pb-1.5">
                        <span class="text-[11px] font-black tracking-[0.12em] text-primary-700">DAILY GRAPHIC</span>
                        <span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
                      </div>
                      <div class="mt-2 h-2 w-3/4 bg-stone-900" />
                      <div class="mt-1.5 h-1.5 w-full bg-stone-300" />
                      <div class="mt-1 h-1.5 w-5/6 bg-stone-200" />
                      <div class="mt-3 grid grid-cols-3 gap-1.5">
                        <div class="col-span-2 space-y-1">
                          <div class="h-14 bg-stone-900 sm:h-16" />
                          <div class="h-1 bg-stone-300" />
                          <div class="h-1 w-4/5 bg-stone-200" />
                        </div>
                        <div class="space-y-1">
                          <div class="h-8 bg-primary-600/90" />
                          <div class="h-1 bg-stone-300" />
                          <div class="h-1 bg-stone-200" />
                        </div>
                      </div>
                      <div class="mt-auto flex items-center gap-1 border-t border-stone-100 pt-1.5">
                        <span class="text-[9px] font-bold tracking-widest text-stone-500">GHANA • WED • GH₵ 5.00</span>
                      </div>
                    </div>
                  </div>
                  <div class="absolute bottom-1.5 left-1.5 rounded-full bg-stone-900 px-2 py-1 text-[10px] font-black tracking-widest text-white">TODAY</div>
                </div>

                <!-- Cover 2 — The Mirror -->
                <div class="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                  <div class="absolute inset-x-0 top-0 h-1 bg-stone-900" aria-hidden="true" />
                  <div class="aspect-[3/4] p-2.5 sm:p-3">
                    <div class="flex h-full flex-col border border-stone-200 bg-white p-2 shadow-sm sm:p-2.5">
                      <div class="border-b border-stone-900 pb-1.5">
                        <span class="text-[11px] font-black tracking-[0.12em] text-stone-900">THE MIRROR</span>
                      </div>
                      <div class="mt-2 flex gap-1.5">
                        <div class="h-10 flex-1 rounded bg-primary-600" />
                        <div class="h-10 flex-1 rounded bg-stone-800" />
                      </div>
                      <div class="mt-2 h-1.5 w-full bg-stone-300" />
                      <div class="mt-1 h-1 w-5/6 bg-stone-200" />
                      <div class="mt-3 h-14 bg-stone-100 ring-1 ring-stone-200 sm:h-16">
                        <div class="h-2 bg-stone-900/80" />
                        <div class="p-1.5">
                          <div class="h-1 w-3/4 bg-stone-900" />
                          <div class="mt-1 h-1 w-full bg-stone-200" />
                        </div>
                      </div>
                      <div class="mt-auto border-t border-stone-100 pt-1.5 text-[9px] font-bold tracking-widest text-stone-500">WEEKEND READ • GH₵ 5.00</div>
                    </div>
                  </div>
                  <div class="absolute bottom-1.5 left-1.5 rounded-full bg-primary-600 px-2 py-1 text-[10px] font-black tracking-widest text-white">WEEKEND</div>
                </div>

                <!-- Cover 3 — Graphic Showbiz -->
                <div class="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                  <div class="absolute inset-x-0 top-0 h-1 bg-primary-600" aria-hidden="true" />
                  <div class="aspect-[3/4] p-2.5 sm:p-3">
                    <div class="flex h-full flex-col border border-stone-200 bg-white p-2 shadow-sm sm:p-2.5">
                      <div class="flex items-center justify-between border-b border-primary-600 pb-1.5">
                        <span class="bg-primary-600 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-white">GRAPHIC SHOWBIZ</span>
                        <span class="text-[9px] font-bold text-stone-500">ENTERTAINMENT</span>
                      </div>
                      <div class="mt-2 grid grid-cols-2 gap-1.5">
                        <div class="h-12 bg-gradient-to-br from-primary-600 to-stone-900" />
                        <div class="space-y-1">
                          <div class="h-1.5 w-full bg-stone-900" />
                          <div class="h-1 w-full bg-stone-300" />
                          <div class="h-1 w-4/5 bg-stone-200" />
                        </div>
                      </div>
                      <div class="mt-2 h-1 w-full bg-stone-300" />
                      <div class="mt-1 h-1 w-5/6 bg-stone-200" />
                      <div class="mt-3 flex gap-1.5">
                        <div class="h-10 flex-1 bg-stone-900" />
                        <div class="h-10 flex-1 bg-primary-100 ring-1 ring-primary-200" />
                      </div>
                      <div class="mt-auto border-t border-stone-100 pt-1.5 text-[9px] font-bold tracking-widest text-stone-500">THURSDAY • GH₵ 5.00</div>
                    </div>
                  </div>
                  <div class="absolute bottom-1.5 left-1.5 rounded-full bg-white px-2 py-1 text-[10px] font-black tracking-widest text-stone-900 ring-1 ring-stone-200">SHOWBIZ</div>
                </div>
              </div>
              <p class="mt-3 text-center text-xs font-medium text-stone-500">Tap any cover to open the full e-paper — crisp text, searchable archives.</p>
            </div>
          </article>
        </div>

        <!-- Right rail — TOI style dense list + promo -->
        <aside class="space-y-5 border-t border-stone-200 pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <!-- Inside Today's Papers -->
          <div class="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3">
              <h2 class="text-xs font-black tracking-[0.16em] text-stone-900">INSIDE TODAY’S PAPERS</h2>
              <span class="rounded-full bg-primary-600 px-2 py-1 text-[10px] font-black tracking-widest text-white">6 SECTIONS</span>
            </div>
            <ol class="divide-y divide-stone-100">
              <li class="group flex gap-3 p-4 hover:bg-stone-50">
                <span class="mt-0.5 font-serif text-2xl font-black leading-none text-primary-600">1</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-black tracking-[0.14em] text-primary-700">FRONT PAGE • NATION</p>
                  <h3 class="mt-1 line-clamp-2 text-sm font-bold leading-5 text-stone-900 group-hover:text-primary-700">Budget, roads & energy: What the headlines are tracking today</h3>
                  <p class="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">Lead editorials and front-page explainers, all in one scrollable edition.</p>
                </div>
                <div class="hidden h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200 sm:block">
                  <div class="h-full w-full bg-gradient-to-br from-stone-800 to-stone-600 p-1.5 text-[7px] font-bold leading-tight text-white">DAILY<br />GRAPHIC</div>
                </div>
              </li>
              <li class="group flex gap-3 p-4 hover:bg-stone-50">
                <span class="mt-0.5 font-serif text-2xl font-black leading-none text-stone-400">2</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-black tracking-[0.14em] text-stone-500">BUSINESS • MONEY</p>
                  <h3 class="mt-1 line-clamp-2 text-sm font-bold leading-5 text-stone-900 group-hover:text-primary-700">Markets, cedi & enterprise — business pages without the clutter</h3>
                  <p class="mt-1 text-xs text-stone-500">2 min read • Updated 06:00 GMT</p>
                </div>
                <div class="hidden h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-50 ring-1 ring-primary-200 sm:block">
                  <div class="h-full w-full bg-white p-1.5 text-[7px] font-bold leading-tight text-stone-800 border border-stone-200">BIZ<br /><span class="text-primary-600">TODAY</span></div>
                </div>
              </li>
              <li class="group flex gap-3 p-4 hover:bg-stone-50">
                <span class="mt-0.5 font-serif text-2xl font-black leading-none text-stone-400">3</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-black tracking-[0.14em] text-stone-500">SPORTS • SHOWBIZ</p>
                  <h3 class="mt-1 line-clamp-2 text-sm font-bold leading-5 text-stone-900 group-hover:text-primary-700">Black Stars, GPL & entertainment — weekend starts early</h3>
                  <p class="mt-1 text-xs text-stone-500">Photos, fixtures & gossip in print clarity</p>
                </div>
                <div class="hidden h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-900 ring-1 ring-stone-800 sm:block">
                  <div class="h-full w-full p-1.5 text-[7px] font-black leading-tight text-white">SHOWBIZ<br /><span class="text-white/70">SPORT</span></div>
                </div>
              </li>
              <li class="flex items-center justify-between bg-primary-50/60 px-4 py-3">
                <span class="text-xs font-bold text-stone-700">+ 9 more sections & 7-day archive</span>
                <NuxtLink to="/newspapers" class="text-xs font-black text-primary-700 hover:text-primary-800">Browse all →</NuxtLink>
              </li>
            </ol>
          </div>

          <!-- E-Paper promo — red Times style card -->
          <div class="relative overflow-hidden rounded-2xl bg-stone-900 p-5 text-white shadow-lg">
            <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-600/20 blur-2xl" aria-hidden="true" />
            <div class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary-600" aria-hidden="true" />
            <p class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-black tracking-[0.14em] text-white ring-1 ring-white/15">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-500" /> E-PAPER • LIKE PRINT, ONLY FASTER
            </p>
            <h3 class="mt-3 font-serif text-xl font-bold leading-tight">Read it exactly<br />as it was printed.</h3>
            <p class="mt-2 text-sm leading-6 text-white/70">Crisp pages, offline access, text search & clip sharing. The same papers on the stand, on your phone by 5:30am.</p>
            <ul class="mt-4 space-y-2 text-sm font-medium text-white/90">
              <li class="flex items-center gap-2"><span class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-900">✓</span> Zoom-clear, print-quality pages</li>
              <li class="flex items-center gap-2"><span class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-900">✓</span> Search words inside every page</li>
              <li class="flex items-center gap-2"><span class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-900">✓</span> Keep 7 days offline</li>
            </ul>
            <div class="mt-5 flex gap-2">
              <button class="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-black text-white hover:bg-primary-500" @click="showSignInModal = true">Start reading</button>
              <NuxtLink to="/pricing" class="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-stone-900 hover:bg-stone-100">See pricing</NuxtLink>
            </div>
            <p class="mt-3 text-center text-xs font-medium text-white/50">No commitment • Cancel anytime • GH₵ 15/month</p>
          </div>

          <!-- Trust / TOI masthead footer -->
          <div class="rounded-2xl border border-stone-200 bg-white p-4">
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2" aria-hidden="true">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-[10px] font-black text-white">G</span>
                <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-900 text-[10px] font-black text-white">N</span>
                <span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary-50 text-[10px] font-black text-primary-700 ring-1 ring-primary-200">+</span>
              </div>
              <p class="text-xs font-bold tracking-wide text-stone-700">Built with the Daily Graphic newsroom — independent, verified, Ghana-first.</p>
            </div>
            <div class="mt-3 grid grid-cols-3 divide-x divide-stone-200 border-t border-stone-200 pt-3 text-center">
              <div>
                <p class="font-serif text-lg font-black leading-none text-stone-900">74</p>
                <p class="text-[10px] font-bold tracking-[0.12em] text-stone-500">YEARS</p>
              </div>
              <div>
                <p class="font-serif text-lg font-black leading-none text-stone-900">2M+</p>
                <p class="text-[10px] font-bold tracking-[0.12em] text-stone-500">READERS</p>
              </div>
              <div>
                <p class="font-serif text-lg font-black leading-none text-primary-700">12</p>
                <p class="text-[10px] font-bold tracking-[0.12em] text-stone-500">PAPERS</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const showSignInModal = useState('showSignInModal', () => false)

const todayLabel = computed(() => {
  const d = new Date()
  // e.g. THURSDAY, NOVEMBER 05, 2026
  return d.toLocaleDateString('en-GH', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase()
})
</script>
