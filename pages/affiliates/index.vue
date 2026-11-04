<template>
  <div class="affiliate-intro bg-white text-gray-900">
    <!-- A single, clear next step, before the supporting story. -->
    <section class="affiliate-hero relative overflow-hidden border-b border-stone-200/80" aria-labelledby="affiliate-heading">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
        <div class="relative z-10 min-w-0 lg:col-span-7">

          <h1 id="affiliate-heading" class="font-display text-[2.65rem] font-medium leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
            Share the news.<br />
            <span class="text-primary-600">Earn your share.</span>
          </h1>

          <p class="mt-5 max-w-xl text-[16px] leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
            Turn your website, blog, or social channel into a virtual newsstand.
            Share Graphic NewsPlus and earn a commission on new subscriptions.
          </p>

          <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink to="/affiliates/register" class="affiliate-button bg-primary-600 text-white hover:bg-primary-700">
              Become an affiliate
              <ArrowRightIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
            </NuxtLink>
            <a href="#how-it-works" class="affiliate-button border border-stone-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-stone-50">
              See how it works
              <ArrowDownIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>

          <NuxtLink to="/affiliates/login" class="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm text-gray-600 underline-offset-4 hover:text-primary-700 hover:underline">
            Already an affiliate?
            <span class="font-semibold text-gray-900">Log in</span>
            <ArrowUpRightIcon class="h-4 w-4 text-gray-500" aria-hidden="true" />
          </NuxtLink>
        </div>

        <!-- Editorial illustration: no simulated earnings or performance data. -->
        <div class="affiliate-hero-art relative hidden h-[430px] min-w-0 lg:col-span-5 lg:block lg:h-[460px]" aria-hidden="true">
          <div class="absolute inset-5 rounded-full bg-primary-100/65" />
          <div class="affiliate-paper absolute left-[3%] top-[12%] w-[78%] -rotate-6 border border-stone-200 bg-white px-6 pb-7 pt-5 shadow-xl shadow-stone-900/10">
            <div class="flex items-center justify-between border-b-2 border-gray-900 pb-3">
              <span class="text-[10px] font-extrabold tracking-tight">GRAPHIC NEWSPLUS</span>
              <img src="/favicon-mag.png" alt="" class="h-6 w-6 object-contain" width="24" height="24" />
            </div>
            <p class="mb-2 mt-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary-600">Your virtual newsstand</p>
            <p class="font-display text-[2.25rem] font-medium leading-[1.08] tracking-tight">News worth<br />sharing.</p>
            <div class="mt-5 space-y-2">
              <div class="h-1.5 w-full rounded-full bg-stone-200" />
              <div class="h-1.5 w-[92%] rounded-full bg-stone-200" />
              <div class="h-1.5 w-[70%] rounded-full bg-stone-200" />
            </div>
            <div class="mt-6 flex items-center gap-2 border-t border-stone-200 pt-4 text-[10px] font-semibold text-primary-700">
              <GlobeAltIcon class="h-4 w-4" />
              Good journalism. A wider audience.
            </div>
          </div>

          <div class="absolute right-0 top-[4%] flex w-[83%] items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-lg shadow-stone-900/5">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <LinkIcon class="h-5 w-5" />
            </span>
            <div>
              <p class="text-xs font-semibold text-gray-900">One link. Your audience.</p>
              <p class="mt-1 text-[11px] text-gray-500">Share from your website or socials</p>
            </div>
          </div>

          <div class="absolute bottom-[3%] right-0 w-[87%] rounded-xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-900/10">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CheckIcon class="h-5 w-5" />
              </span>
              <div>
                <p class="text-sm font-semibold">A new reader. A new possibility.</p>
                <p class="mt-1 text-xs text-gray-500">Earn on eligible subscription referrals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Real program terms, rather than invented social-proof statistics. -->
    <section class="border-b border-stone-200/80 bg-white" aria-label="Affiliate program at a glance">
      <div class="mx-auto max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
        <dl class="grid grid-cols-3 divide-x divide-stone-200">
          <div v-for="fact in programFacts" :key="fact.label" class="flex min-w-0 flex-col px-2 text-center sm:px-6">
            <dt class="order-2 mt-2 text-[11px] leading-5 text-gray-600 sm:text-sm">{{ fact.label }}</dt>
            <dd class="order-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{{ fact.value }}</dd>
          </div>
        </dl>
        <p class="mt-4 text-center text-xs leading-5 text-gray-500">
          Eligibility and payout conditions apply.
          <NuxtLink to="/affiliates/terms" class="inline-flex min-h-[44px] items-center font-medium text-gray-700 underline underline-offset-4 hover:text-primary-700">
            Read the program terms
          </NuxtLink>
        </p>
      </div>
    </section>

    <section id="how-it-works" class="scroll-mt-24" aria-labelledby="how-it-works-heading">
      <div class="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div class="max-w-2xl">
          <p class="affiliate-eyebrow">From your first link to your first reward</p>
          <h2 id="how-it-works-heading" class="affiliate-heading">Your newsstand, in three steps.</h2>
          <p class="mt-3 text-[16px] leading-7 text-gray-600">You bring your audience. We bring the news and the tools to track your referrals.</p>
        </div>

        <ol class="mt-8 grid gap-6 md:grid-cols-3 md:gap-8 lg:mt-10">
          <li v-for="step in steps" :key="step.number" class="flex gap-4 border-t border-stone-200 pt-5 md:block md:pt-6">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700 md:mb-6" aria-hidden="true">{{ step.number }}</span>
            <div class="min-w-0 pt-1 md:pt-0">
              <h3 class="text-lg font-semibold tracking-tight">{{ step.title }}</h3>
              <p class="mt-2 text-[15px] leading-7 text-gray-600">{{ step.description }}</p>
            </div>
          </li>
        </ol>

        <NuxtLink to="/affiliates/terms#commission" class="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-primary-700 underline-offset-4 hover:underline">
          Explore commission rates
          <ArrowRightIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section id="why-affiliate" class="scroll-mt-24 bg-stone-50" aria-labelledby="why-affiliate-heading">
      <div class="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <span class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary-100 bg-white text-primary-600" aria-hidden="true">
            <NewspaperIcon class="h-6 w-6" />
          </span>
          <p class="affiliate-eyebrow">A familiar tradition. A digital future.</p>
          <h2 id="why-affiliate-heading" class="affiliate-heading">From street corners<br class="hidden sm:block" /> to your online community.</h2>
          <p class="mt-5 text-[16px] leading-7 text-gray-600">
            For decades, Graphic Communications Group has brought trusted journalism to communities through street newsstands.
            Today, your digital platform can carry that tradition forward.
          </p>
          <p class="mt-4 text-[16px] leading-7 text-gray-600">
            Become a virtual newsstand: connect your audience with news they value, and share in the rewards of helping our readership grow.
          </p>
        </div>

        <div class="lg:pt-3">
          <h3 class="mb-2 text-sm font-semibold text-gray-900">Made for the way you share</h3>
          <ul class="divide-y divide-stone-200">
            <li v-for="benefit in benefits" :key="benefit.title" class="flex gap-4 py-5">
              <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-primary-600" aria-hidden="true">
                <component :is="benefit.icon" class="h-5 w-5" />
              </span>
              <div class="min-w-0">
                <h4 class="text-[16px] font-semibold">{{ benefit.title }}</h4>
                <p class="mt-1.5 text-[15px] leading-7 text-gray-600">{{ benefit.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="questions" class="scroll-mt-24" aria-labelledby="questions-heading">
      <div class="mx-auto grid max-w-6xl gap-7 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
        <div class="lg:col-span-4">
          <p class="affiliate-eyebrow">A little more clarity</p>
          <h2 id="questions-heading" class="affiliate-heading">Before you<br class="hidden lg:block" /> get started.</h2>
          <p class="mt-4 text-[16px] leading-7 text-gray-600">The essentials, without the small-print hunt.</p>
          <a href="mailto:affiliates@graphicnewsplus.com" class="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-primary-700 underline-offset-4 hover:underline">
            Ask our affiliate team
            <ArrowUpRightIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <!-- Native details keep every answer usable with touch, keyboards and JavaScript disabled. -->
        <div class="divide-y divide-stone-200 border-y border-stone-200 lg:col-span-8">
          <details v-for="(faq, index) in faqs" :key="faq.question" class="affiliate-faq group" :open="index === 0 ? true : undefined">
            <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 rounded-sm py-5 text-[16px] font-semibold leading-6 transition-colors hover:text-primary-700">
              {{ faq.question }}
              <ChevronDownIcon class="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div class="pb-5 pr-7 text-[15px] leading-7 text-gray-600">
              <p>{{ faq.answer }}</p>
              <NuxtLink v-if="faq.link" :to="faq.link.to" class="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-md font-semibold text-primary-700 underline-offset-4 hover:underline">
                {{ faq.link.label }}
                <ArrowRightIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
              </NuxtLink>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section class="px-5 pb-12 sm:px-6 sm:pb-16 lg:px-8" aria-labelledby="join-heading">
      <div class="affiliate-closing relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gray-900 px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
        <div class="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div class="max-w-xl">
            <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-300">Your audience is your newsstand</p>
            <h2 id="join-heading" class="font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">Good news goes further<br class="hidden sm:block" /> when you share it.</h2>
            <p class="mt-4 text-[15px] leading-7 text-gray-300">Take the first step toward becoming a Graphic NewsPlus affiliate.</p>
          </div>
          <div class="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <NuxtLink to="/affiliates/register" class="affiliate-button bg-white text-gray-900 hover:bg-primary-50">
              Become an affiliate
              <ArrowRightIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink to="/affiliates/login" class="affiliate-button border border-gray-500 text-white hover:border-gray-300 hover:bg-white/10">
              Affiliate login
              <ArrowUpRightIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  LinkIcon,
  NewspaperIcon,
} from '@heroicons/vue/24/outline'
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

definePageMeta({
  layout: 'default',
})

useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Become an Affiliate | Graphic NewsPlus',
  meta: [
    {
      name: 'description',
      content: 'Turn your website, blog, or social channel into a virtual newsstand. Join the Graphic NewsPlus affiliate program and earn commissions on eligible new subscriptions.',
    },
  ],
})

const authStore = useAffiliateAuthStore()
const router = useRouter()

const programFacts = [
  { value: '3–6%', label: 'Commission on eligible referrals' },
  { value: '30 days', label: 'Referral tracking window' },
  { value: 'Monthly', label: 'Payouts for approved earnings' },
]

const steps = [
  {
    number: '01',
    title: 'Join the program',
    description: 'Create your affiliate account and review the program terms. Your website, blog, or social channel can be your newsstand.',
  },
  {
    number: '02',
    title: 'Share your unique link',
    description: 'Find your referral link in the dashboard. Share it with your audience alongside news you think they’ll value.',
  },
  {
    number: '03',
    title: 'Earn your commission',
    description: 'Earn a one-time commission when a referred reader completes an eligible first-time subscription through your link.',
  },
]

const benefits = [
  {
    icon: ChartBarIcon,
    title: 'See the difference you make',
    description: 'Keep track of your link clicks, referrals, and commissions in your own affiliate dashboard.',
  },
  {
    icon: BanknotesIcon,
    title: 'Get paid your way',
    description: 'Receive approved payouts to your bank account or mobile money wallet once you reach the payout threshold.',
  },
  {
    icon: NewspaperIcon,
    title: 'Share something worth reading',
    description: 'Introduce your community to trusted journalism from Graphic Communications Group.',
  },
]

const faqs = [
  {
    question: 'Who can become an affiliate?',
    answer: 'The program is open to adults aged 18 or over who operate a legitimate website, social media account, or digital platform with original content. You’ll need a valid email address and a bank or mobile money account. Employees of Graphic Communications Group and its subsidiaries are not eligible.',
    link: { to: '/affiliates/terms#eligibility', label: 'Read the eligibility requirements' },
  },
  {
    question: 'Do I need my own website?',
    answer: 'No. A blog, social media account, or another legitimate digital platform with original content can qualify. Choose the channel where you already connect with your audience, provided it meets the program’s eligibility requirements.',
  },
  {
    question: 'How much can I earn?',
    answer: 'Commission rates range from 3% to 6%, depending on the subscription plan. Commissions apply to eligible first-time subscriptions and are calculated on the net subscription amount, excluding taxes, processing fees, and discounts. Renewals and upgrades do not normally earn commission.',
    link: { to: '/affiliates/terms#commission', label: 'See the commission rates' },
  },
  {
    question: 'When and how do I get paid?',
    answer: 'Approved payouts are processed monthly, on or before the 15th, to your bank account or mobile money wallet. Commissions have a minimum 30-day hold period, and your approved balance must reach GHS 200. Balances below the threshold carry forward to the next payout cycle.',
    link: { to: '/affiliates/terms#payout', label: 'Read the payout policy' },
  },
  {
    question: 'Where can I track my referrals?',
    answer: 'Your affiliate dashboard brings together your link clicks, referrals, and commission activity. Log in to see your performance and find your referral links.',
    link: { to: '/affiliates/login', label: 'Log in to your affiliate account' },
  },
]

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/affiliates/dashboard')
  }
})
</script>

<style scoped>
.affiliate-hero {
  background-color: #faf9f6;
}

.affiliate-button {
  @apply inline-flex min-h-[52px] items-center justify-center gap-3 rounded-lg px-6 py-3 text-center text-[15px] font-semibold leading-6 transition-colors;
}

.affiliate-eyebrow {
  @apply mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-primary-700 sm:text-xs;
}

.affiliate-heading {
  @apply font-display text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] text-gray-900 sm:text-4xl;
}

.affiliate-hero-art::before {
  position: absolute;
  inset: 0;
  content: '';
  background-image: radial-gradient(#d6d3d1 1px, transparent 1px);
  background-size: 16px 16px;
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.affiliate-paper {
  border-radius: 3px;
}

.affiliate-faq summary::-webkit-details-marker {
  display: none;
}

.affiliate-closing::after {
  position: absolute;
  right: -100px;
  top: -155px;
  width: 400px;
  height: 400px;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 50%;
  box-shadow: 0 0 0 45px rgb(255 255 255 / 3%), 0 0 0 90px rgb(255 255 255 / 2%);
  content: '';
  pointer-events: none;
}

.affiliate-intro :is(a, summary):focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 4px;
}

.affiliate-closing a:focus-visible {
  outline-color: #fca5a5;
}

@media (prefers-reduced-motion: reduce) {
  .affiliate-intro *,
  .affiliate-intro *::before,
  .affiliate-intro *::after {
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
