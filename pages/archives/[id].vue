<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
    <!-- Header Navigation -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/archives" class="p-2 -ml-2 text-gray-400 hover:text-[#e32932] hover:bg-red-50 rounded-full transition-colors">
            <ArrowLeftIcon class="w-6 h-6" />
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Document Details</h1>
        </div>
        
        <!-- Top Actions -->
        <div class="flex items-center gap-4">
          <button @click="isBookmarked = !isBookmarked" class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <BookmarkIcon :class="['w-5 h-5', isBookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-500']" />
            <span class="hidden sm:block">Bookmark</span>
          </button>
          <button class="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ShareIcon class="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
            <span class="hidden sm:block">Share</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Metadata Card -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <!-- Left Column -->
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <BuildingOfficeIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-gray-900">Publisher:</span> 
                <span class="text-gray-700 ml-2">Daily Graphic</span>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <CalendarIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-gray-900">Date Published:</span> 
                <span class="text-gray-700 ml-2">Friday 13 of June, 2025</span>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <TagIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div class="flex items-center flex-wrap gap-2">
                <span class="font-bold text-gray-900 mr-1">Tags:</span>
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">Opinion</span>
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">Politics</span>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div class="flex items-start gap-3 md:justify-end">
              <BriefcaseIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div class="w-48">
                <span class="font-bold text-gray-900">Brand:</span> 
                <span class="text-gray-700 ml-2">Daily Graphic</span>
              </div>
            </div>

            <div class="flex items-start gap-3 md:justify-end">
              <UserIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div class="w-48">
                <span class="font-bold text-gray-900">Creator:</span> 
                <span class="text-gray-700 ml-2">Graphic</span>
              </div>
            </div>

            <div class="flex items-start gap-3 md:justify-end">
              <DocumentIcon class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div class="w-48">
                <span class="font-bold text-gray-900">File Type:</span> 
                <span class="text-gray-700 ml-2 font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Viewer Container -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col" style="min-h: 800px;">
        <!-- Viewer Toolbar -->
        <div class="bg-gray-50 border-b border-gray-200 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-4">
          <!-- Left: Pagination -->
          <div class="flex items-center gap-1 sm:gap-2">
            <button class="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors disabled:opacity-50"><ChevronDoubleLeftIcon class="w-4 h-4" /></button>
            <button class="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors disabled:opacity-50"><ChevronLeftIcon class="w-4 h-4" /></button>
            <div class="flex items-center gap-2 px-2 text-sm text-gray-600">
              <input type="text" value="1" class="w-12 text-center rounded border-gray-300 py-1 px-2 text-sm focus:ring-[#e32932] focus:border-[#e32932]">
              <span>of 1</span>
            </div>
            <button class="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors disabled:opacity-50"><ChevronRightIcon class="w-4 h-4" /></button>
            <button class="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors disabled:opacity-50"><ChevronDoubleRightIcon class="w-4 h-4" /></button>
          </div>

          <!-- Middle: Zoom Controls -->
          <div class="flex items-center gap-2">
            <button class="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"><MinusIcon class="w-4 h-4" /></button>
            <button class="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"><PlusIcon class="w-4 h-4" /></button>
            <select class="text-sm border-transparent bg-transparent font-medium text-gray-600 focus:ring-0 py-1 pl-2 pr-6">
              <option>100%</option>
              <option>75%</option>
              <option>50%</option>
              <option>Fit Page</option>
              <option>Fit Width</option>
            </select>
          </div>

          <!-- Right: Tools -->
          <div class="flex items-center gap-1 sm:gap-2 text-gray-500">
            <button class="p-1.5 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors" title="Select Text"><CursorArrowRaysIcon class="w-4 h-4" /></button>
            <button class="p-1.5 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors" title="Pan Tool"><HandRaisedIcon class="w-4 h-4" /></button>
            <div class="w-px h-5 bg-gray-300 mx-1"></div>
            <button class="p-1.5 hover:bg-gray-200 hover:text-gray-700 rounded transition-colors" title="Search inside document"><MagnifyingGlassIcon class="w-4 h-4" /></button>
          </div>
        </div>

        <!-- Pages in this Edition Strip -->
        <div class="bg-white border-b border-gray-200 p-4 sm:p-6 z-10 relative">
          <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <DocumentDuplicateIcon class="w-5 h-5 text-gray-400" />
            Pages in this Edition ({{ editionPages.length }})
          </h4>
          <div class="flex overflow-x-auto gap-4 pb-2 snap-x">
            <button 
              v-for="page in editionPages" 
              :key="page.id"
              @click="currentPage = page"
              :class="['flex-shrink-0 w-32 relative rounded-lg overflow-hidden border-2 transition-all snap-start text-left', currentPage.id === page.id ? 'border-[#e32932] shadow-md scale-105' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100']"
            >
              <div class="h-40 bg-gray-100">
                <img :src="page.thumbnail" class="w-full h-full object-cover" />
              </div>
              <div class="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-2">
                <span class="text-white text-xs font-bold">{{ page.title }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Viewer Content Area -->
        <div class="flex-1 bg-gray-200 p-4 sm:p-8 overflow-auto flex justify-center">
          <!-- Mock Document Page -->
          <div class="bg-white shadow-2xl w-full max-w-4xl min-h-[1000px] relative">
            <img 
              src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Document Page" 
              class="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            
            <div :class="['absolute inset-0 p-8 sm:p-16 transition-all duration-500 overflow-hidden', { 'blur-md select-none pointer-events-none opacity-40': !isSubscribed }]">
              <div class="border-b-4 border-[#e32932] pb-6 mb-8 flex justify-between items-end">
                <div>
                  <h2 class="text-6xl font-serif text-gray-900 mb-2">{{ currentPage.category }}</h2>
                  <h3 class="text-4xl font-bold text-gray-800 leading-tight" v-html="currentPage.headline.replace('\\n', '<br>')"></h3>
                </div>
                <div class="text-right">
                  <p class="font-serif font-bold text-lg text-[#e32932]">Daily Graphic</p>
                  <p class="text-gray-500 text-sm">Friday, June 13, 2025</p>
                </div>
              </div>

              <div class="columns-1 md:columns-2 lg:columns-3 gap-8 text-justify font-serif text-gray-800 leading-relaxed">
                <p class="mb-4"><span class="float-left text-6xl leading-none font-bold pr-2 text-gray-900">T</span>he last week of May 2025 was not kind! Where my phone rang in the early hours of Tuesday, May 27, 2025, I asked with trepidation, "Why do you make my heart miss a beat with this dawn call?" The grim answer through wailing was, "Kwasi's son Nana is gone!"</p>
                <p class="mb-4">This is how the news of the death in the UK on Monday, May 26, 2025, of distinguished veteran journalist, former Chairman of the National Media Commission and current Board Chair of the Ghana News Agency, Nana Kwasi Gyan-Apenteng, aged 74, was broken to me!</p>
                <p class="mb-4">On May 28, the death also in the UK was reported of 66-year-old Ghanaian medical doctor and international Sickle Cell consultant/icon Professor Felix Konotey-Ahulu.</p>
                <p class="mb-4">On the same day, East Africa's greatest novelist, Ngugi Wa Thiong'o, died at 87! These deaths took me back to my first article published in the Daily Graphic on January 1, 2011, titled "Still Cholera Speaks - Life is short" after my retirement from the Ghana Armed Forces in 2010. It read:</p>
                <p class="mb-4">...The tragic death of the 25-year-old Australian cricketer, Hughes, also reminded me of a regular song often sung during funeral church services, "It is well with my soul." The song, which was composed by Philip Bliss, was based on a tragedy that befell an American family in the early 1870s.</p>
                <p class="mb-4">At the appointed time for departure, he got delayed by business. He, therefore, sent his wife, Anna, and their four daughters ahead. On November 22, 1873, while crossing the Atlantic in their ship, Ville du Havre, they were struck by another ship, the Loc Earn. Two hundred and twenty-six people lost their lives, including all the four daughters of Mr and Mrs Spafford. Anna Spafford miraculously survived.</p>
                <p class="mb-4 font-bold text-xl leading-snug my-6 text-[#e32932]">Where is the patriotism Osagyefo Kwame Nkrumah taught us as proud Ghanaians?</p>
                <p class="mb-4">On arrival in England, she sent her husband a telegram beginning with the words, "Saved alone..." Spafford then set sail for England himself. It is said that it was when their ship got to the point of the accident and subsequent drowning of his daughters that Spafford wrote the words of the popular hymn, "It is well with my soul."</p>
                <p class="mb-4">The year 2014 has not been a kind year. Too many times, I have heard Bernice Offei's 'Life is short' as well as Horatio Spafford's/Philip Bliss' 'It is Well' with my soul at funeral services. Among the many who left us in 2014, my good friend and mate Brig. Gen. Richard Debrah was called to eternity at two 15-year-old youngsters. 'Chief', the son of my mate, Brig. Gen. Emmanuel Okyere was called to eternity.</p>
              </div>
            </div>

            <!-- Paywall Overlay -->
            <div v-if="!isSubscribed" class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-gray-200 via-white/80 to-transparent">
              <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-lg text-center border border-red-100 transform translate-y-12">
                <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LockClosedIcon class="w-10 h-10 text-[#e32932]" />
                </div>
                <h3 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Unlock Full Access</h3>
                <p class="text-gray-600 mb-8 leading-relaxed text-lg">Subscribe to Graphic Archives to read the full edition of this publication and access decades of historical news.</p>
                <button @click="isSubscribeModalOpen = true" class="w-full bg-[#e32932] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-lg">
                  View Subscription Plans
                </button>
                <p class="mt-6 text-sm text-gray-500">Already a subscriber? <a href="#" class="text-[#e32932] font-semibold hover:underline">Sign In</a></p>
              </div>
            </div>
          </div>
        </div>



      </div>

      <!-- Related Results -->
      <div class="mt-12">
        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DocumentTextIcon class="w-6 h-6 text-[#e32932]" />
          Related High-Ranking Results
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink v-for="(item, index) in relatedItems" :key="index" :to="`/archives/${index + 10}`" class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1">
            <div class="h-40 bg-gray-100 relative overflow-hidden">
               <div v-if="item.type === 'text'" class="absolute inset-0 p-4 flex flex-col justify-center items-center bg-[#fdfbf7] border-b border-gray-100">
                  <div class="font-serif font-bold text-center text-lg leading-snug text-gray-800 group-hover:text-[#e32932] transition-colors relative z-10">
                    "{{ item.headlineExcerpt }}"
                  </div>
               </div>
               <div v-else class="absolute inset-0 bg-gray-200">
                  <img :src="item.image" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </div>
               <div class="absolute top-3 left-3">
                 <span class="px-2.5 py-1 bg-white/95 backdrop-blur shadow-sm text-[10px] font-bold uppercase tracking-wider rounded text-gray-800 border border-gray-100">{{ item.category }}</span>
               </div>
            </div>
            
            <div class="p-5 flex-1 flex flex-col relative">
              <h3 class="font-bold text-gray-900 mb-2 text-base leading-tight line-clamp-2 group-hover:text-[#e32932] transition-colors cursor-pointer">
                {{ item.title }}
              </h3>
              
              <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div class="text-xs font-medium text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                  <CalendarIcon class="w-3.5 h-3.5" />
                  {{ item.date }}
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Subscription Modal -->
    <TransitionRoot appear :show="isSubscribeModalOpen" as="template">
      <Dialog as="div" @close="isSubscribeModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95 translate-y-4"
              enter-to="opacity-100 scale-100 translate-y-0"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100 translate-y-0"
              leave-to="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <div class="text-center mb-8">
                  <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIcon class="w-8 h-8 text-[#e32932]" />
                  </div>
                  <DialogTitle as="h3" class="text-2xl font-bold text-gray-900 mb-2">
                    Subscribe to Archives
                  </DialogTitle>
                  <p class="text-gray-500">Get unlimited access to decades of history.</p>
                </div>

                <div class="space-y-4 mb-8">
                  <div class="border-2 border-[#e32932] rounded-2xl p-4 flex items-center justify-between cursor-pointer bg-red-50/30">
                    <div>
                      <h4 class="font-bold text-gray-900">Monthly Plan</h4>
                      <p class="text-sm text-gray-500">Cancel anytime</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xl font-bold text-[#e32932]">GHS 20</span><span class="text-gray-500 text-sm">/mo</span>
                    </div>
                  </div>
                  <div class="border border-gray-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors">
                    <div>
                      <h4 class="font-bold text-gray-900">Annual Plan</h4>
                      <p class="text-sm text-gray-500">Save 20%</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xl font-bold text-gray-900">GHS 200</span><span class="text-gray-500 text-sm">/yr</span>
                    </div>
                  </div>
                </div>

                <button @click="handleSubscribe" class="w-full bg-[#e32932] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all">
                  Subscribe & Unlock Now
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue'
import { 
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon,
  BriefcaseIcon,
  UserIcon,
  DocumentIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MinusIcon,
  PlusIcon,
  CursorArrowRaysIcon,
  HandRaisedIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  DocumentDuplicateIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

const isBookmarked = ref(false)

// Subscription State
const isSubscribed = useState('archive-isSubscribed', () => false)
const isSubscribeModalOpen = ref(false)

const handleSubscribe = () => {
  isSubscribed.value = true
  isSubscribeModalOpen.value = false
}

// Edition Pages Data
const editionPages = [
  {
    id: 1,
    title: 'Page 1',
    category: 'Front Page',
    headline: 'Major Infrastructure Project Announced',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&random=1'
  },
  {
    id: 2,
    title: 'Page 2',
    category: 'National News',
    headline: 'Parliament debates new bill on education',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&random=2'
  },
  {
    id: 10,
    title: 'Page 10',
    category: 'Opinion',
    headline: 'Nana Kwasi Gyan-Apenteng\\njoins ancestors!',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&random=10'
  },
  {
    id: 15,
    title: 'Page 15',
    category: 'Sports',
    headline: 'Black Stars secure vital win in qualifiers',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&random=15'
  }
]

const currentPage = ref(editionPages[2]) // Default to opinion page

const relatedItems = [
  {
    title: "The Legacy of Osagyefo Kwame Nkrumah in modern politics.",
    headlineExcerpt: 'Where is the patriotism Osagyefo Kwame Nkrumah taught us as proud Ghanaians?',
    date: 'June 10, 2025',
    category: 'Politics',
    type: 'text',
    image: ''
  },
  {
    title: "KNUST celebrates 75 years of academic excellence.",
    headlineExcerpt: '',
    date: 'May 14, 2025',
    category: 'Education',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80&random=12'
  },
  {
    title: "Ghana's Economy sees a 4% growth in the second quarter.",
    headlineExcerpt: '',
    date: 'April 22, 2025',
    category: 'Economy',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80&random=13'
  }
]
</script>
