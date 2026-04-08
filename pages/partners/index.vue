<template>
  <div class="bg-white min-h-screen">
    <main>
      <!-- Hero Section -->
      <section class="relative py-24 overflow-hidden bg-slate-900 lg:py-32">
        <div class="absolute inset-x-0 bottom-0 top-0 overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/10"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div class="lg:col-span-12 text-center animate-fade-in">
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-primary-600/20 border border-primary-600/30 text-primary-400 text-sm font-semibold mb-6">
                <span class="mr-2">New</span> Corporate Partnerships 
              </div>
              <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6 leading-tight max-w-5xl mx-auto">
                Empower Your <span class="text-primary-500">Organization</span> with Trusted News
              </h1>
              <p class="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Provide your members, employees, or students with premium access to Graphic NewsPlus. Manage bulk subscriptions, renewals, and access through our specialized Institutional Partner Portal.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                   @click="scrollToContact"
                   class="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl shadow-2xl text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Become a Partner
                </button>
                <NuxtLink 
                  to="/partners/account/login" 
                  class="inline-flex items-center justify-center px-10 py-4 border border-slate-700 text-lg font-bold rounded-xl text-white bg-slate-800/50 hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 backdrop-blur-sm"
                >
                  Partner Login
                </NuxtLink>
              </div>
              
              <div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-400">
                <div class="flex items-center">
                   <div class="h-6 w-6 bg-primary-500/10 rounded-full flex items-center justify-center mr-3 border border-primary-500/20">
                     <svg class="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span>Bulk Subscription</span>
                </div>
                <div class="flex items-center">
                   <div class="h-6 w-6 bg-primary-500/10 rounded-full flex items-center justify-center mr-3 border border-primary-500/20">
                     <svg class="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span>API Access</span>
                </div>
                <div class="flex items-center">
                   <div class="h-6 w-6 bg-primary-500/10 rounded-full flex items-center justify-center mr-3 border border-primary-500/20">
                     <svg class="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span>Dedicated Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Partner With Us Section -->
      <section class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Designed for Institutional Excellence
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Strengthen your organization with Ghana's most trusted source of news, business insights, and professional analysis.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <!-- Feature 1 -->
            <div class="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div class="h-16 w-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-600 transition-all duration-500 transform group-hover:rotate-6">
                <BuildingOfficeIcon class="h-8 w-8 text-primary-600 group-hover:text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Bulk Subscription Management</h3>
              <p class="text-gray-600 leading-relaxed text-lg">
                Centralize your organization's digital news access. Manage hundreds or thousands of subscriptions with a single corporate account and flexible billing cycles.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div class="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-600 transition-all duration-500 transform group-hover:rotate-6">
                <UserPlusIcon class="h-8 w-8 text-green-600 group-hover:text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Seamless Member Onboarding</h3>
              <p class="text-gray-600 leading-relaxed text-lg">
                Onboard your members instantly via CSV upload. Members automatically receive their login credentials via SMS, ensuring zero friction and immediate access.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div class="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 transition-all duration-500 transform group-hover:rotate-6">
                <PresentationChartBarIcon class="h-8 w-8 text-purple-600 group-hover:text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Engagement & Insights</h3>
              <p class="text-gray-600 leading-relaxed text-lg">
                Track member engagement through our partner dashboard. Get detailed reports on active users, popular publications, and renewal statuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-24 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div class="flex flex-col lg:flex-row items-center gap-16">
              <div class="lg:w-1/2">
                 <h2 class="text-3xl font-extrabold text-gray-900 sm:text-5xl mb-12">
                   How It Works
                 </h2>
                 <div class="space-y-12">
                    <!-- Step 1 -->
                    <div class="flex gap-8 group">
                       <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform">1</div>
                       <div class="pt-2">
                          <h4 class="text-2xl font-bold text-gray-900 mb-3">Establish Partnership</h4>
                          <p class="text-gray-600 text-lg">Contact our sales team to establish a partnership agreement tailored to your organization's size and needs.</p>
                       </div>
                    </div>
                    <!-- Step 2 -->
                    <div class="flex gap-8 group">
                       <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform">2</div>
                       <div class="pt-2">
                          <h4 class="text-2xl font-bold text-gray-900 mb-3">Onboard via CSV</h4>
                          <p class="text-gray-600 text-lg">Upload your member list directly through the Partner Portal. Our system handles the rest, creating accounts for everyone.</p>
                       </div>
                    </div>
                    <!-- Step 3 -->
                    <div class="flex gap-8 group">
                       <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform">3</div>
                       <div class="pt-2">
                          <h4 class="text-2xl font-bold text-gray-900 mb-3">Automated SMS Credentials</h4>
                          <p class="text-gray-600 text-lg">Onboarded members instantly receive a welcome SMS with their unique login credentials and a direct link to start reading.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div class="lg:w-1/2 relative p-4">
                 <div class="bg-slate-900 rounded-[3rem] p-1 shadow-2xl overflow-hidden animate-float">
                    <div class="bg-white rounded-[2.8rem] h-[500px] p-8 flex flex-col items-center justify-center text-center">
                        <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-8">
                           <ChatBubbleBottomCenterTextIcon class="h-10 w-10 text-primary-600" />
                        </div>
                        <h4 class="text-2xl font-bold text-gray-900 mb-4">Fast SMS Onboarding</h4>
                        <div class="bg-gray-100 rounded-2xl p-6 text-left max-w-sm border border-gray-200 relative">
                           <div class="absolute -top-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-gray-100"></div>
                           <p class="text-gray-700 italic text-base leading-relaxed">
                             "Welcome to Graphic NewsPlus! Your organization [Partner Name] has activated your premium access. 
                             <br><br>
                             Login: <strong>[Username]</strong><br>
                             Pass: <strong>[Password]</strong><br><br>
                             Start reading at: <span class="text-primary-600">graphicnewsplus.com/login</span>"
                           </p>
                        </div>
                        <p class="mt-8 text-gray-500 font-medium">Auto-sent on member creation</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-24 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-16 sm:text-5xl">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
               <button 
                 @click="toggleFaq(index)"
                 class="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                <span class="text-xl font-bold text-gray-900">{{ faq.question }}</span>
                <ChevronDownIcon 
                   class="h-6 w-6 text-gray-400 transition-transform duration-500"
                   :class="{ 'rotate-180': openFaq === index }"
                />
               </button>
               <div v-show="openFaq === index" class="px-8 pb-8 text-gray-600 text-lg leading-relaxed animate-fade-in">
                 {{ faq.answer }}
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact / CTA Section -->
      <section id="contact-sales" class="py-24 bg-primary-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div class="lg:flex items-center gap-20">
              <div class="lg:w-1/2 mb-16 lg:mb-0">
                 <h2 class="text-4xl font-extrabold mb-8 sm:text-6xl leading-tight">Ready to Empower Your Organization?</h2>
                 <p class="text-2xl text-primary-100 mb-12 max-w-lg leading-relaxed">
                    Speak with our corporate partnerships team today to learn about our institutional pricing and custom implementation plans.
                 </p>
                 <div class="space-y-8">
                    <div class="flex items-center space-x-6 group">
                       <div class="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <PhoneIcon class="h-8 w-8 text-white" />
                       </div>
                       <span class="text-2xl font-semibold">+233 (0) 551 484 843</span>
                    </div>

                    <div class="flex items-center space-x-6 group">
                       <div class="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <PhoneIcon class="h-8 w-8 text-white" />
                       </div>
                       <span class="text-2xl font-semibold">+233 (0) 242 573 763</span>
                    </div>

                    <div class="flex items-center space-x-6 group">
                       <div class="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <EnvelopeIcon class="h-8 w-8 text-white" />
                       </div>
                       <span class="text-2xl font-semibold">support@graphicnewsplus.com</span>
                    </div>
                 </div>
              </div>
              <div class="lg:w-1/2 bg-white rounded-[2.5rem] p-10 shadow-2xl">
                 <form @submit.prevent="submitContact" class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Company Name</label>
                          <input type="text" class="w-full rounded-xl border-gray-200 text-gray-900 focus:ring-primary-500 h-12" required placeholder="e.g. Bank of Ghana">
                       </div>
                       <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Member Count</label>
                          <select class="w-full rounded-xl border-gray-200 text-gray-900 focus:ring-primary-500 h-12">
                             <option>1-100</option>
                             <option>101-500</option>
                             <option>501-1000</option>
                             <option>1000+</option>
                          </select>
                       </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Contact Name</label>
                        <input type="text" class="w-full rounded-xl border-gray-200 text-gray-900 focus:ring-primary-500 h-12" required>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Work Email</label>
                        <input type="email" class="w-full rounded-xl border-gray-200 text-gray-900 focus:ring-primary-500 h-12" required>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Message (Optional)</label>
                        <textarea class="w-full rounded-xl border-gray-200 text-gray-900 focus:ring-primary-500" rows="4"></textarea>
                    </div>
                    <button class="w-full bg-primary-600 text-white font-bold py-5 rounded-2xl hover:bg-primary-700 transition-all shadow-xl text-xl transform hover:scale-[1.02] active:scale-95">
                       Submit Interest
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  BuildingOfficeIcon, 
  UserPlusIcon, 
  PresentationChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Corporate Partnerships - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Empower your organization with Graphic NewsPlus. Bulk subscriptions, institutional access, and seamless member onboarding.' }
  ]
})

const openFaq = ref<number | null>(0)

const faqs = [
  {
    question: "How does bulk pricing work?",
    answer: "Our institutional pricing is tiered based on the number of members you wish to onboard. We offer significant discounts for organizations with high member counts compared to individual retail subscriptions."
  },
  {
    question: "Can we manage different groups of members?",
    answer: "Yes, our Partner Portal allows you to organize members into subaccounts or groups, making it easy to manage different departments, branches, or student cohorts."
  },
  {
    question: "How long does onboarding take?",
    answer: "Instantaneous. Once your membership list is uploaded via CSV in the portal, accounts are created and SMS credentials are sent within seconds automatically."
  },
  {
    question: "Do members get access to all publications?",
    answer: "As a partner, you can choose which subscription plans to assign. You can provide access to specific titles like Graphic Business or the entire suite of Daily Graphic publications."
  }
]

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const scrollToContact = () => {
  const element = document.getElementById('contact-sales')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const submitContact = () => {
  alert('Thank you for your interest! A member of our partnerships team will contact you shortly.')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

input, select, textarea {
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
