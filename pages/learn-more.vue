<template>
  <div class="bg-slate-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden pt-32 pb-40 border-b border-gray-100/50">
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <!-- Dynamic Gradient Orbs -->
        <div class="absolute w-[800px] h-[800px] -top-[200px] -right-[200px] bg-gradient-to-br from-primary-200/40 to-orange-200/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style="animation-duration: 8s;"></div>
        <div class="absolute w-[600px] h-[600px] bottom-[0px] -left-[100px] bg-gradient-to-tr from-orange-200/40 to-red-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style="animation-duration: 10s; animation-delay: 2s;"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
         
        <h1 class="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">
          News Like <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-red-500 to-orange-500">Never Before.</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          The ultimate digital gateway to Ghana's most trusted journalism. Newspapers, magazines, live events, and exclusive content—all in your pocket.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button @click="showSignInModal = true" class="w-full sm:w-auto px-10 py-5 bg-gray-900 hover:bg-black text-white rounded-full text-lg font-bold shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
            Start Reading Now
            <ArrowRightIcon class="w-5 h-5" />
          </button>
          <a href="#ecosystem" class="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 rounded-full text-lg font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
            Explore Features
          </a>
        </div>
      </div>
    </section>

    <!-- App Experience Features -->
    <section class="py-32 bg-slate-50 relative z-20 -mt-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-24">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">An Amazing Reading Experience</h2>
          <p class="text-xl text-gray-500 max-w-2xl mx-auto font-light">Designed for comfort and speed, bringing your favorite publications to life with cutting-edge features.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-100 group hover:-translate-y-2">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-inner">
              <DevicePhoneMobileIcon class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Read Anywhere</h3>
            <p class="text-gray-500 leading-relaxed text-lg">Optimized for mobile, tablet, and desktop. Your news library syncs perfectly across all your devices, seamlessly.</p>
          </div>
          <!-- Feature 2 -->
          <div class="bg-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-100 group hover:-translate-y-2 mt-0 md:mt-12">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-orange-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-inner">
              <BoltIcon class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Instant Access</h3>
            <p class="text-gray-500 leading-relaxed text-lg">Get the latest editions the moment they are published. No more waiting for the morning delivery.</p>
          </div>
          <!-- Feature 3 -->
          <div class="bg-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-100 group hover:-translate-y-2 mt-0 md:mt-24">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-inner">
              <EyeIcon class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Crystal Clear Text</h3>
            <p class="text-gray-500 leading-relaxed text-lg">High-resolution rendering ensures perfect legibility. Zoom in on stories without losing any quality.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- New Updates & Ecosystem (Dark Mode) -->
    <section id="ecosystem" class="py-32 bg-[#0B0F19] text-white relative overflow-hidden">
      <!-- Decorative background grid & glows -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MFYweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" style="mask-image: linear-gradient(to bottom, transparent, black, transparent);"></div>
        <div class="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[120px] mix-blend-screen"></div>
        <div class="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-orange-400 font-bold tracking-widest uppercase text-xs mb-6 backdrop-blur-sm">The Graphic Ecosystem</span>
          <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-lg">More Than Just News.</h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">Explore our newest platforms designed to empower creators, partners, and readers with seamless integration.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          
          <!-- Partners Platform -->
          <div class="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BriefcaseIcon class="w-7 h-7" />
                </div>
                <div class="text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRightIcon class="w-6 h-6" />
                </div>
              </div>
              <h3 class="text-3xl font-bold mb-4 tracking-tight text-white">Partners Platform</h3>
              <p class="text-gray-400 mb-8 leading-relaxed text-lg">
                Are you an independent publisher? Join the network. Publish your magazines or newspapers directly to our massive readership. Monetize with seamless revenue sharing.
              </p>
              <NuxtLink to="/partners" class="inline-flex items-center gap-2 text-white font-semibold hover:text-primary-400 transition-colors">
                Become a Partner
              </NuxtLink>
            </div>
          </div>

          <!-- Affiliates Platform -->
          <div class="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <span class="text-[1.75rem] font-bold">₵</span>
                </div>
                <div class="text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRightIcon class="w-6 h-6" />
                </div>
              </div>
              <h3 class="text-3xl font-bold mb-4 tracking-tight text-white">Affiliate Program</h3>
              <p class="text-gray-400 mb-8 leading-relaxed text-lg">
                Turn your network into income. Earn attractive commissions for every new subscriber you bring to Graphic NewsPlus with real-time tracking and fast payouts.
              </p>
              <NuxtLink to="/affiliates" class="inline-flex items-center gap-2 text-white font-semibold hover:text-orange-400 transition-colors">
                Join Affiliates
              </NuxtLink>
            </div>
          </div>

          <!-- Graphic Archives -->
          <div class="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform duration-300">
                  <ArchiveBoxIcon class="w-7 h-7" />
                </div>
                <div class="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRightIcon class="w-6 h-6" />
                </div>
              </div>
              <h3 class="text-3xl font-bold mb-4 tracking-tight text-white">Graphic Archives</h3>
              <p class="text-gray-400 mb-8 leading-relaxed text-lg">
                Step back in time with exclusive access to decades of Ghanaian history. Our digital archives preserve the nation's heritage for researchers and enthusiasts alike.
              </p>
              <NuxtLink to="/archives" class="inline-flex items-center gap-2 text-white font-semibold hover:text-gray-300 transition-colors">
                Explore Archives
              </NuxtLink>
            </div>
          </div>

          <!-- eBooks -->
          <div class="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BookOpenIcon class="w-7 h-7" />
                </div>
                <div class="text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRightIcon class="w-6 h-6" />
                </div>
              </div>
              <h3 class="text-3xl font-bold mb-4 tracking-tight text-white">GN+ eBooks</h3>
              <p class="text-gray-400 mb-8 leading-relaxed text-lg">
                Dive into a curated selection of premium eBooks. From biographies of influential leaders to deep-dive investigative journalism, expand your library instantly.
              </p>
              <NuxtLink to="/originals/books" class="inline-flex items-center gap-2 text-white font-semibold hover:text-purple-400 transition-colors">
                Discover Books
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Grand Call to Action -->
    <section class="py-32 relative overflow-hidden bg-white">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary-50/50"></div>
      </div>
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex p-5 rounded-3xl bg-primary-50 mb-10 shadow-inner">
          <BoltIcon class="w-12 h-12 text-primary-600" />
        </div>
        <h2 class="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">Ready to Transform Your Habit?</h2>
        <p class="text-2xl text-gray-500 mb-12 font-light max-w-2xl mx-auto">Join thousands of readers who trust Graphic NewsPlus for their daily news consumption.</p>
        <button @click="showSignInModal = true" class="px-12 py-6 bg-gradient-to-r from-primary-600 to-orange-500 text-white rounded-full text-2xl font-bold shadow-[0_20px_40px_-15px_rgba(234,88,12,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.6)] hover:-translate-y-2 transition-all duration-300">
          Get Started Today
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  DevicePhoneMobileIcon, 
  BoltIcon, 
  EyeIcon, 
  BriefcaseIcon, 
  ArchiveBoxIcon, 
  BookOpenIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'Learn More - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Discover the amazing features of Graphic NewsPlus, including our Partners program, Affiliates, Archives, and eBooks.' }
  ]
})

const showSignInModal = useState('showSignInModal', () => false);
</script>
