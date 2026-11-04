<template>
  <div class="affiliate-terms min-h-screen bg-white text-gray-900">
    <a href="#terms-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg">
      Skip to the terms
    </a>

    <!-- A compact introduction keeps the agreement, not a long contents list, first on mobile. -->
    <section id="terms-top" class="scroll-mt-[56px] border-b border-stone-200/80 bg-[#faf9f6] sm:scroll-mt-[70px]" aria-labelledby="terms-heading">
      <div class="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div class="flex items-center justify-between gap-4">
          <NuxtLink to="/affiliates" class="terms-no-print inline-flex min-h-[44px] items-center gap-2 rounded-md text-[13px] font-medium text-gray-600 hover:text-primary-700">
            <ArrowLeftIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
            Affiliate program
          </NuxtLink>
          <button type="button" class="terms-no-print inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-[13px] font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-stone-50 sm:px-4" @click="printPage">
            <PrinterIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
            Print terms
          </button>
        </div>

        <div class="mt-5 max-w-3xl sm:mt-7">
          <p class="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-700 sm:text-xs">Graphic NewsPlus affiliate program</p>
          <h1 id="terms-heading" class="font-display text-[2.25rem] font-medium leading-[1.12] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
            Affiliate terms &amp; conditions
          </h1>
          <p class="mt-4 text-[16px] leading-7 text-gray-600">Graphic NewsPlus (GNP) Affiliate Partnership Agreement</p>
          <dl class="mt-6 flex flex-wrap gap-x-7 gap-y-4 text-[13px] leading-5">
            <div>
              <dt class="text-gray-500">Last updated</dt>
              <dd class="mt-1 font-semibold text-gray-800">August 2026</dd>
            </div>
            <div>
              <dt class="text-gray-500">Effective</dt>
              <dd class="mt-1 font-semibold text-gray-800">Immediately upon registration</dd>
            </div>
            <div>
              <dt class="text-gray-500">Agreement</dt>
              <dd class="mt-1 font-semibold text-gray-800">13 sections</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Native details provide a keyboard-accessible contents menu without JavaScript. -->
    <div class="terms-no-print sticky top-[56px] z-30 border-b border-stone-200 bg-white/95 backdrop-blur sm:top-[70px] lg:hidden">
      <div class="mx-auto max-w-6xl px-5 sm:px-6">
        <details ref="mobileContents" class="group relative">
          <summary class="flex min-h-[56px] cursor-pointer list-none items-center gap-3 py-2">
            <ListBulletIcon class="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
            <span class="min-w-0 flex-1">
              <span class="block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">On this page</span>
              <span class="mt-0.5 block truncate text-[13px] font-semibold text-gray-900">{{ activeSectionLabel }}</span>
            </span>
            <span class="shrink-0 text-[11px] tabular-nums text-gray-500">{{ String(activeSectionIndex + 1).padStart(2, '0') }} / 13</span>
            <ChevronDownIcon class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <nav aria-label="Terms sections" class="absolute inset-x-0 top-full grid max-h-[60vh] gap-1 overflow-y-auto rounded-b-xl border border-stone-200 bg-white p-3 shadow-xl shadow-gray-900/10 sm:grid-cols-2">
            <a v-for="(section, index) in sections" :key="section.id" :href="`#${section.id}`" :aria-current="activeSection === section.id ? 'location' : undefined" :class="['flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-[13px] leading-5 transition-colors', activeSection === section.id ? 'bg-primary-50 font-semibold text-primary-700' : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900']" @click="selectSection(section.id)">
              <span class="w-5 shrink-0 text-[11px] tabular-nums text-gray-600" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ section.label }}
            </a>
          </nav>
        </details>
      </div>
    </div>

    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:px-8">
      <!-- Keep desktop navigation within the viewport, even on short laptop screens. -->
      <aside class="terms-no-print hidden lg:col-span-3 lg:block" aria-label="Terms navigation">
        <div ref="desktopContents" class="sticky top-[94px] max-h-[calc(100vh-118px)] overflow-y-auto pb-3 pr-2">
          <h2 class="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">On this page</h2>
          <nav aria-label="Terms sections" class="relative space-y-1">
            <a v-for="(section, index) in sections" :key="section.id" :href="`#${section.id}`" :aria-current="activeSection === section.id ? 'location' : undefined" :class="['flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-[13px] leading-5 transition-colors', activeSection === section.id ? 'bg-primary-50 font-semibold text-primary-700' : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900']" @click="selectSection(section.id)">
              <span class="w-5 shrink-0 text-[11px] tabular-nums text-gray-600" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ section.label }}
            </a>
          </nav>
          <div class="mt-6 border-t border-stone-200 pt-5">
            <p class="mb-3 text-[12px] leading-5 text-gray-500">Ready when you are.</p>
            <NuxtLink to="/affiliates/register" class="terms-button w-full bg-primary-600 text-white hover:bg-primary-700">
              <UserPlusIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
              Join as Affiliate
            </NuxtLink>
          </div>
        </div>
      </aside>

      <article id="terms-content" tabindex="-1" class="min-w-0 lg:col-span-8 lg:col-start-5" aria-label="Affiliate program agreement">
        <aside class="flex gap-3 rounded-xl border border-primary-100 bg-primary-50 p-5 sm:gap-4 sm:p-6" aria-labelledby="agreement-notice">
          <InformationCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
          <div>
            <h2 id="agreement-notice" class="text-[16px] font-semibold text-gray-900">Before you register</h2>
            <p class="mt-2 text-[14px] leading-7 text-gray-700">
              By registering for and participating in the Graphic NewsPlus Affiliate Program, you agree to be legally bound by the following Terms and Conditions. Please read them carefully before proceeding. If you do not agree to these terms, do not register or participate in the program.
            </p>
          </div>
        </aside>

        <section v-for="(section, index) in sections" :id="section.id" :key="section.id" :aria-labelledby="`${section.id}-heading`" tabindex="-1" class="terms-section scroll-mt-[128px] border-b border-stone-200 py-8 sm:scroll-mt-[144px] sm:py-10 lg:scroll-mt-[94px]">
          <div class="mb-5 flex items-start gap-3 sm:gap-4">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[12px] font-semibold tabular-nums text-primary-700" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <h2 :id="`${section.id}-heading`" class="font-display text-[1.65rem] font-medium leading-[1.2] tracking-[-0.015em] text-gray-900 sm:text-3xl">{{ section.title }}</h2>
          </div>

          <div class="terms-copy space-y-5 text-[16px] leading-[1.8] text-gray-700">
            <template v-if="section.id === 'eligibility'">
              <p>To participate in the Graphic NewsPlus (GNP) Affiliate Program, you must meet all of the following eligibility requirements:</p>
              <ul class="terms-list">
                <li v-for="item in eligibilityItems" :key="item">{{ item }}</li>
              </ul>
              <div class="terms-note border-amber-200 bg-amber-50 text-amber-900">
                <ExclamationTriangleIcon class="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                <p>GNP reserves the right to reject any affiliate application or revoke existing affiliate status at any time, at its sole discretion.</p>
              </div>
            </template>

            <template v-else-if="section.id === 'commission'">
              <p>Affiliates earn commissions on successful subscription purchases made by referred users via unique affiliate tracking links.</p>

              <!-- Stacked rates avoid a cramped, sideways-scrolling table on phones. -->
              <ul class="terms-rate-cards divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 sm:hidden" aria-label="Commission rates by subscription plan">
                <li v-for="rate in commissionRates" :key="rate.plan" class="flex items-center justify-between gap-4 p-4">
                  <div class="min-w-0">
                    <p class="text-[15px] font-semibold text-gray-900">{{ rate.plan }}</p>
                    <p class="mt-1 text-[13px] leading-5 text-gray-500">{{ rate.type }}</p>
                  </div>
                  <p class="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[16px] font-semibold text-emerald-800">
                    <span class="sr-only">Commission rate: </span>{{ rate.rate }}
                  </p>
                </li>
              </ul>
              <div class="terms-rate-table hidden overflow-hidden rounded-xl border border-stone-200 sm:block">
                <table class="w-full text-left">
                  <caption class="sr-only">Commission rates by subscription plan</caption>
                  <thead class="border-b border-stone-200 bg-stone-50">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-[12px] font-semibold text-gray-600">Subscription Plan</th>
                      <th scope="col" class="px-4 py-3 text-[12px] font-semibold text-gray-600">Commission Rate</th>
                      <th scope="col" class="px-4 py-3 text-[12px] font-semibold text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    <tr v-for="rate in commissionRates" :key="rate.plan">
                      <th scope="row" class="px-4 py-3 text-[14px] font-semibold text-gray-900">{{ rate.plan }}</th>
                      <td class="px-4 py-3"><span class="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[13px] font-semibold text-emerald-800">{{ rate.rate }}</span></td>
                      <td class="px-4 py-3 text-[13px] leading-6 text-gray-600">{{ rate.type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 class="mb-3 text-[15px] font-semibold text-gray-900">Important Commission Rules:</h3>
                <ul class="terms-list">
                  <li v-for="rule in commissionRules" :key="rule">{{ rule }}</li>
                </ul>
              </div>
            </template>

            <template v-else-if="section.id === 'tracking'">
              <p>The GNP Affiliate Program uses a cookie-based tracking system to attribute referrals to affiliates accurately.</p>
              <ul class="terms-list">
                <li v-for="item in trackingItems" :key="item">{{ item }}</li>
              </ul>
              <div class="terms-note border-blue-200 bg-blue-50 text-blue-900">
                <InformationCircleIcon class="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <p>GNP is not responsible for lost commissions due to cookie deletion, ad-blockers, browser privacy settings, or any technical failure outside GNP's control.</p>
              </div>
            </template>

            <template v-else-if="section.id === 'payout'">
              <dl class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div v-for="stat in payoutStats" :key="stat.label" class="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-col sm:items-start sm:gap-2">
                  <dt class="text-[13px] leading-5 text-gray-600 sm:order-2">{{ stat.label }}</dt>
                  <dd class="shrink-0 text-xl font-semibold tracking-tight text-gray-900 sm:order-1">{{ stat.value }}</dd>
                </div>
              </dl>
              <ul class="terms-list">
                <li v-for="item in payoutItems" :key="item">{{ item }}</li>
              </ul>
              <div class="terms-note border-amber-200 bg-amber-50 text-amber-900">
                <ExclamationTriangleIcon class="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                <p>GNP may withhold any payment if fraud, abuse, or a violation of these Terms is suspected until an investigation is complete.</p>
              </div>
            </template>

            <template v-else-if="section.id === 'obligations'">
              <p>As an affiliate, you agree to the following obligations:</p>
              <div>
                <h3 class="mb-3 text-[15px] font-semibold text-gray-900">You MUST:</h3>
                <ul class="space-y-3">
                  <li v-for="item in obligationsMust" :key="item" class="flex items-start gap-3">
                    <CheckCircleIcon class="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div class="border-t border-stone-200 pt-5">
                <h3 class="mb-3 text-[15px] font-semibold text-gray-900">You MUST NOT:</h3>
                <ul class="space-y-3">
                  <li v-for="item in obligationsMustNot" :key="item" class="flex items-start gap-3">
                    <XCircleIcon class="mt-1 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </template>

            <template v-else-if="section.id === 'prohibited'">
              <p>The following activities will result in immediate termination of your affiliate account and forfeiture of any pending commissions:</p>
              <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <li v-for="item in prohibitedActivities" :key="item.title" class="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
                  <h3 class="text-[15px] font-semibold text-gray-900">{{ item.title }}</h3>
                  <p class="mt-1 text-[14px] leading-6 text-gray-600">{{ item.description }}</p>
                </li>
              </ul>
            </template>

            <template v-else-if="section.id === 'ip'">
              <p>GNP grants you a limited, non-exclusive, non-transferable, revocable license to use approved GNP brand assets solely for the purpose of promoting the Affiliate Program.</p>
              <ul class="terms-list">
                <li v-for="item in ipItems" :key="item">{{ item }}</li>
              </ul>
            </template>

            <template v-else-if="section.id === 'termination'">
              <p>Either party may terminate participation in the Affiliate Program at any time.</p>
              <ul class="terms-list">
                <li v-for="item in terminationItems" :key="item">{{ item }}</li>
              </ul>
            </template>

            <template v-else-if="section.id === 'disclaimer'">
              <p>The GNP Affiliate Program is provided on an "as is" and "as available" basis. GNP makes no warranties, express or implied, regarding the program.</p>
              <ul class="terms-list">
                <li v-for="item in disclaimerItems" :key="item">{{ item }}</li>
              </ul>
            </template>

            <template v-else-if="section.id === 'privacy'">
              <p>GNP collects and processes your personal data to manage your affiliate account and pay commissions.</p>
              <ul class="terms-list">
                <li v-for="item in privacyItems" :key="item">{{ item }}</li>
              </ul>
            </template>

            <template v-else-if="section.id === 'governing-law'">
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Ghana.</p>
              <p>Before initiating any legal proceedings, both parties agree to make a good-faith effort to resolve any dispute through direct negotiation. If resolution is not achieved within 30 days, the matter may be referred to mediation.</p>
            </template>

            <template v-else-if="section.id === 'modifications'">
              <p>GNP reserves the right to modify, update, or amend these Terms and Conditions at any time without prior notice. The most current version will always be available on this page with the updated date.</p>
              <p>Your continued participation in the Affiliate Program after any changes constitutes your acceptance of the new Terms. We recommend reviewing this page periodically.</p>
            </template>

            <template v-else-if="section.id === 'contact'">
              <p>For any questions regarding these Terms and Conditions or the Affiliate Program, please contact us:</p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a href="mailto:affiliates@graphicnewsplus.com" class="terms-contact group sm:col-span-2">
                  <EnvelopeIcon class="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block text-[13px] font-semibold text-gray-900">Email Us</span>
                    <span class="block break-all text-[14px] leading-6 text-gray-600 group-hover:text-primary-700">affiliates@graphicnewsplus.com</span>
                  </span>
                </a>
                <a href="tel:+233302213800" class="terms-contact group">
                  <PhoneIcon class="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block text-[13px] font-semibold text-gray-900">Call Us</span>
                    <span class="block text-[14px] leading-6 text-gray-600 group-hover:text-primary-700">+233 30 221 3800</span>
                  </span>
                </a>
                <div class="terms-contact">
                  <MapPinIcon class="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block text-[13px] font-semibold text-gray-900">Headquarters</span>
                    <span class="block text-[14px] leading-6 text-gray-600">Graphic Road, Accra, Ghana</span>
                  </span>
                </div>
              </div>
            </template>
          </div>
        </section>

        <section class="terms-no-print mt-8 rounded-2xl bg-gray-900 p-6 sm:p-8" aria-labelledby="join-heading">
          <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-300">The next step</p>
          <h2 id="join-heading" class="font-display text-3xl font-medium text-white">Ready to Join?</h2>
          <p class="mt-3 max-w-xl text-[14px] leading-7 text-gray-300">
            By registering, you confirm you have read, understood, and agree to be bound by these Terms &amp; Conditions.
          </p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/affiliates/register" class="terms-button bg-white text-gray-900 hover:bg-primary-50">
              <UserPlusIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
              Join as Affiliate
            </NuxtLink>
            <NuxtLink to="/affiliates/login" class="terms-button border border-gray-500 text-white hover:border-gray-300 hover:bg-white/10">
              Already an Affiliate? Sign In
              <ArrowRightIcon class="h-4 w-4 shrink-0" aria-hidden="true" />
            </NuxtLink>
          </div>
        </section>
        <a href="#terms-top" class="terms-no-print mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-md text-[13px] font-semibold text-gray-600 hover:text-primary-700">
          <ArrowUpIcon class="h-4 w-4" aria-hidden="true" />
          Back to top
        </a>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  UserPlusIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Affiliate Terms & Conditions – Graphic NewsPlus',
  description: 'Read the Graphic NewsPlus Affiliate Program Terms and Conditions before joining. Understand commission rates, payout policies, prohibited activities, and your obligations as a GNP affiliate partner.',
})

const sections = [
  { id: 'eligibility', label: 'Program Eligibility', title: 'Program Eligibility' },
  { id: 'commission', label: 'Commission Structure', title: 'Commission Structure & Rates' },
  { id: 'tracking', label: 'Tracking & Attribution', title: 'Tracking & Attribution' },
  { id: 'payout', label: 'Payout Policy', title: 'Payout Policy' },
  { id: 'obligations', label: 'Affiliate Obligations', title: 'Affiliate Obligations & Code of Conduct' },
  { id: 'prohibited', label: 'Prohibited Activities', title: 'Prohibited Activities' },
  { id: 'ip', label: 'Intellectual Property', title: 'Intellectual Property & Brand Usage' },
  { id: 'termination', label: 'Termination', title: 'Termination of Participation' },
  { id: 'disclaimer', label: 'Disclaimer & Liability', title: 'Disclaimer & Limitation of Liability' },
  { id: 'privacy', label: 'Privacy & Data', title: 'Privacy & Data Protection' },
  { id: 'governing-law', label: 'Governing Law', title: 'Governing Law & Dispute Resolution' },
  { id: 'modifications', label: 'Modifications', title: 'Modifications to These Terms' },
  { id: 'contact', label: 'Contact Information', title: 'Contact Information' },
]

const activeSection = ref(sections[0].id)
const activeSectionIndex = computed(() => sections.findIndex(section => section.id === activeSection.value))
const activeSectionLabel = computed(() => sections[activeSectionIndex.value]?.label ?? sections[0].label)
const mobileContents = ref<HTMLDetailsElement | null>(null)
const desktopContents = ref<HTMLElement | null>(null)
let scrollFrame = 0

const syncActiveSection = () => {
  const readingOffset = window.innerWidth < 1024 ? 150 : 120
  let current = sections[0].id
  for (const section of sections) {
    const element = document.getElementById(section.id)
    if (element && element.getBoundingClientRect().top <= readingOffset) current = section.id
  }
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = sections[sections.length - 1].id
  }
  activeSection.value = current
}

const requestSectionSync = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    syncActiveSection()
  })
}

const closeMobileContents = () => {
  if (mobileContents.value) mobileContents.value.open = false
}

const selectSection = (id: string) => {
  activeSection.value = id
  closeMobileContents()
  // Native anchor navigation preserves the URL, browser history, and no-JS fallback.
}

const printPage = () => {
  closeMobileContents()
  window.print()
}

const handleOutsideClick = (event: PointerEvent) => {
  if (mobileContents.value?.open && !mobileContents.value.contains(event.target as Node)) closeMobileContents()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileContents.value?.open) {
    closeMobileContents()
    mobileContents.value.querySelector('summary')?.focus()
  }
}

// Keep the current desktop contents item visible without scrolling the document.
watch(activeSection, async () => {
  await nextTick()
  const nav = desktopContents.value
  const link = nav?.querySelector<HTMLElement>('nav [aria-current="location"]')
  if (!nav || !link) return
  const navRect = nav.getBoundingClientRect()
  const linkRect = link.getBoundingClientRect()
  if (linkRect.top < navRect.top) nav.scrollTop += linkRect.top - navRect.top - 8
  else if (linkRect.bottom > navRect.bottom) nav.scrollTop += linkRect.bottom - navRect.bottom + 8
})

onMounted(() => {
  syncActiveSection()
  window.addEventListener('scroll', requestSectionSync, { passive: true })
  window.addEventListener('resize', requestSectionSync)
  window.addEventListener('hashchange', requestSectionSync)
  document.addEventListener('pointerdown', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(scrollFrame)
  window.removeEventListener('scroll', requestSectionSync)
  window.removeEventListener('resize', requestSectionSync)
  window.removeEventListener('hashchange', requestSectionSync)
  document.removeEventListener('pointerdown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscape)
})

// --- Page Content Data ---

const eligibilityItems = [
  'You must be at least 18 years of age.',
  'You must have a valid and active email address and bank account or mobile money account for receiving payments.',
  'You must not currently be employed by Graphic Communications Group Limited (GCGL) or its subsidiaries.',
  'You must operate a legitimate website, social media account, or digital platform with original content.',
  'You must comply with all applicable laws and regulations in your jurisdiction.',
  'You must provide accurate and truthful information during and after registration.',
]

const commissionRates = [
  { plan: 'Basic Monthly', rate: '3%', type: 'One-time per referral' },
  { plan: 'Basic Annual', rate: '3.5%', type: 'One-time per referral' },
  { plan: 'Standard Monthly', rate: '4%', type: 'One-time per referral' },
  { plan: 'Standard Annual', rate: '4.5%', type: 'One-time per referral' },
  { plan: 'Premium Monthly', rate: '5%', type: 'One-time per referral' },
  { plan: 'Premium Annual', rate: '6%', type: 'One-time per referral' },
]

const commissionRules = [
  'Commissions are calculated on the net subscription amount, excluding taxes, processing fees, and any discounts applied.',
  'Commissions are only earned on first-time subscriptions. Renewals and upgrades are not commissionable unless otherwise stated.',
  'A referral is only attributed to an affiliate if the referred user completes their subscription within 30 days of clicking the affiliate tracking link.',
  'Self-referrals (subscribing using your own affiliate link) are strictly prohibited and will result in account termination.',
  'GNP reserves the right to alter commission rates with 30 days notice to active affiliates.',
]

const trackingItems = [
  'Each affiliate is assigned a unique tracking link. Referrals are tracked via a 30-day cookie placed on the referred user\'s browser upon clicking the affiliate link.',
  'If a referred user clicks multiple affiliate links, the commission is awarded to the last affiliate link clicked before the subscription (last-click attribution).',
  'Affiliates must not use cookie stuffing, iframe embedding, or any other deceptive techniques to manipulate tracking.',
  'Commissions are only recorded for subscriptions completed through the official GNP website using valid affiliate tracking links.',
  'GNP\'s tracking system records are the authoritative source for determining commission eligibility and amounts.',
]

const payoutStats = [
  { value: 'Monthly', label: 'Payout Frequency' },
  { value: 'GHS 200', label: 'Minimum Payout Threshold' },
  { value: '30 Days', label: 'Commission Hold Period' },
]

const payoutItems = [
  'Commissions are held for a minimum of 30 days to account for refund and chargeback windows before being approved for payout.',
  'Payouts are processed on or before the 15th of each month for approved commissions from the previous month.',
  'Affiliates must provide valid bank account or mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money) details to receive payouts.',
  'GNP is not responsible for failed payments due to incorrect or outdated payment details provided by the affiliate.',
  'All payouts are made in Ghanaian Cedis (GHS). Affiliates outside Ghana are responsible for any foreign exchange or transfer fees.',
  'A minimum payout threshold of ₵200 must be reached before a payout is processed. Unpaid balances carry forward to the next cycle.',
]

const obligationsMust = [
  'Clearly disclose your affiliate relationship with GNP in all promotional content (e.g., "#ad", "#affiliate", or "I earn a commission if you subscribe via this link").',
  'Promote GNP and its products honestly and accurately.',
  'Keep your account information, especially payment details, up to date.',
  'Promptly notify GNP of any suspected fraudulent activity related to your affiliate account.',
  'Comply with all applicable advertising standards, consumer protection laws, and data protection regulations.',
]

const obligationsMustNot = [
  'Make false, misleading, or exaggerated claims about GNP, its products, or the Affiliate Program.',
  'Send unsolicited bulk emails (spam) to promote your affiliate links.',
  'Bid on GNP branded keywords in paid search advertising without prior written consent from GNP.',
  'Use your affiliate link in advertising on adult, gambling, illegal, or otherwise objectionable platforms.',
  'Create fake user accounts or fabricate referrals in any way.',
  'Share or transfer your affiliate account or tracking links to any third party.',
]

const prohibitedActivities = [
  { title: 'Cookie Stuffing', description: 'Dropping affiliate tracking cookies on users\'s browsers without their genuine interaction.' },
  { title: 'Click Fraud', description: 'Artificially inflating click counts through bots, scripts, or manual self-clicking.' },
  { title: 'Self-Referral', description: 'Subscribing to GNP using your own affiliate link or links of persons you control.' },
  { title: 'Spam Marketing', description: 'Sending unsolicited promotional emails or messages containing affiliate links.' },
  { title: 'Brand Bidding', description: 'Running paid ads targeting GNP\'s brand name or trademarks without written approval.' },
  { title: 'Misleading Promotions', description: 'Creating deceptive landing pages that misrepresent GNP products or pricing.' },
  { title: 'Trademark Abuse', description: 'Using GNP trademarks, logos, or content in unauthorized ways.' },
  { title: 'Account Sharing', description: 'Sharing affiliate account access or tracking links with unauthorized third parties.' },
]

const ipItems = [
  'You may use GNP\'s approved logos, banners, and marketing materials solely for promoting the Affiliate Program.',
  'You may not modify, alter, or create derivative works of any GNP brand assets without prior written consent.',
  'You may not register domain names or social media handles that include GNP\'s trademarks or confusingly similar variants.',
  'All intellectual property rights in GNP\'s brand assets, content, and platform remain exclusively with Graphic Communications Group Limited.',
  'This license is automatically revoked upon termination of your participation in the Affiliate Program.',
]

const terminationItems = [
  'You may voluntarily withdraw from the Affiliate Program at any time by notifying GNP in writing. Any approved, unpaid commissions at the time of withdrawal will be paid in the next regular payout cycle.',
  'GNP may terminate your participation immediately and without notice for any violation of these Terms, fraudulent activity, or conduct deemed harmful to GNP\'s reputation.',
  'GNP may also terminate the entire Affiliate Program or modify its structure at any time with 30 days\' written notice to active affiliates.',
  'Upon termination, all affiliate tracking links will be deactivated, and you must cease all use of GNP brand assets immediately.',
  'Any pending commissions under review for fraud at the time of termination may be forfeited.',
]

const disclaimerItems = [
  'GNP does not guarantee any specific level of earnings or commissions from your participation in the Affiliate Program.',
  'GNP shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to the Affiliate Program.',
  'GNP\'s total liability to any affiliate shall not exceed the total commissions paid to that affiliate in the three months preceding the event giving rise to the claim.',
  'GNP does not warrant that the Affiliate Program will be uninterrupted, error-free, or free from technical issues.',
]

const privacyItems = [
  'Your personal data (name, email, phone, payment details, and referral activity) is processed to manage your affiliate account and pay commissions.',
  'GNP will not sell your personal data to third parties.',
  'Your data may be shared with payment processors and financial institutions solely for the purpose of processing your payouts.',
  'You have the right to access, correct, or request deletion of your personal data by contacting GNP\'s Data Protection Officer.',
  'By participating in the Affiliate Program, you consent to GNP processing your data as described in GNP\'s Privacy Policy.',
]
</script>

<style scoped>
.affiliate-terms summary::-webkit-details-marker {
  display: none;
}

.terms-button {
  @apply inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg px-5 py-3 text-center text-[14px] font-semibold leading-6 transition-colors;
}

.terms-list {
  @apply list-disc space-y-3 pl-5 marker:text-primary-500;
}

.terms-note {
  @apply flex items-start gap-3 rounded-xl border p-4 text-[14px] leading-7;
}

.terms-note svg {
  margin-top: 4px;
}

.terms-contact {
  @apply flex min-h-[76px] items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors;
}

a.terms-contact:hover {
  @apply border-primary-200 bg-primary-50;
}

.affiliate-terms :is(a, button, summary):focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 3px;
}

.terms-section:focus,
#terms-content:focus {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  .affiliate-terms *,
  .affiliate-terms *::before,
  .affiliate-terms *::after {
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>

<style>
@media (prefers-reduced-motion: reduce) {
  html:has(.affiliate-terms) {
    scroll-behavior: auto !important;
  }
}

@media print {
  body:has(.affiliate-terms) header,
  body:has(.affiliate-terms) footer,
  body:has(.affiliate-terms) .terms-no-print {
    display: none !important;
  }

  body:has(.affiliate-terms) .fixed {
    display: none !important;
  }

  .affiliate-terms {
    color: #111827;
    background: white;
    font-size: 11pt;
  }

  .affiliate-terms #terms-top {
    background: white;
  }

  .affiliate-terms #terms-top > div,
  .affiliate-terms > .grid {
    max-width: none;
    padding: 0;
  }

  .affiliate-terms > .grid {
    display: block;
  }

  .affiliate-terms .terms-section {
    padding: 18pt 0;
    border-color: #d1d5db;
  }

  .affiliate-terms .terms-copy {
    font-size: 10pt;
    line-height: 1.6;
  }

  .affiliate-terms h2,
  .affiliate-terms h3 {
    break-after: avoid;
  }

  .affiliate-terms li,
  .affiliate-terms tr,
  .affiliate-terms .terms-note {
    break-inside: avoid;
  }

  .affiliate-terms .terms-rate-cards {
    display: none !important;
  }

  .affiliate-terms .terms-rate-table {
    display: block !important;
  }

  .affiliate-terms aside[aria-labelledby="agreement-notice"] {
    margin-bottom: 12pt;
    background: white;
    border-color: #d1d5db;
  }
}
</style>
