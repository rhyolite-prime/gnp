<template>
  <div class="bg-gray-50 min-h-screen">

    <!-- Hero Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center gap-3 mb-6">
          <NuxtLink
            to="/affiliates"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back to Affiliate Program
          </NuxtLink>
        </div>

        <div class="flex items-start gap-5">
          <div class="h-14 w-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon class="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Affiliate Program Terms &amp; Conditions
            </h1>
            <p class="mt-2 text-gray-500 text-lg">
              Graphic NewsPlus (GNP) Affiliate Partnership Agreement
            </p>
            <div class="flex flex-wrap items-center gap-4 mt-4">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                <CheckCircleIcon class="h-3.5 w-3.5" />
                Last Updated: August 2026
              </span>
              <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                <ClockIcon class="h-3.5 w-3.5" />
                Effective Immediately Upon Registration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- Sticky Table of Contents -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">On This Page</h2>
            <nav class="space-y-1">
              <a
                v-for="section in sections"
                :key="section.id"
                :href="`#${section.id}`"
                :class="[
                  'flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-all',
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
                @click.prevent="scrollToSection(section.id)"
              >
                <span
                  :class="[
                    'h-1.5 w-1.5 rounded-full flex-shrink-0',
                    activeSection === section.id ? 'bg-primary-500' : 'bg-gray-300'
                  ]"
                />
                {{ section.label }}
              </a>
            </nav>

            <div class="mt-6 pt-5 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-3">Quick Actions</p>
              <NuxtLink
                to="/affiliates/register"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                <UserPlusIcon class="h-4 w-4" />
                Join as Affiliate
              </NuxtLink>
             
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-3 space-y-6">

          <!-- Notice Banner -->
          <div class="bg-primary-600 text-white rounded-2xl p-6 shadow-sm">
            <div class="flex gap-4">
              <InformationCircleIcon class="h-6 w-6 flex-shrink-0 mt-0.5 text-primary-200" />
              <div>
                <p class="font-semibold text-base">Important Notice</p>
                <p class="mt-1 text-primary-100 text-sm leading-relaxed">
                  By registering for and participating in the Graphic NewsPlus Affiliate Program, you agree to be legally bound by the following Terms and Conditions. Please read them carefully before proceeding. If you do not agree to these terms, do not register or participate in the program.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 1: Eligibility -->
          <div :id="sections[0].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserGroupIcon class="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 1</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Program Eligibility</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>To participate in the Graphic NewsPlus (GNP) Affiliate Program, you must meet all of the following eligibility requirements:</p>
              <ul class="space-y-3">
                <li v-for="item in eligibilityItems" :key="item" class="flex items-start gap-3">
                  <CheckCircleIcon class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <ExclamationTriangleIcon class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p class="text-amber-800 text-sm">GNP reserves the right to reject any affiliate application or revoke existing affiliate status at any time, at its sole discretion.</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Commission Structure -->
          <div :id="sections[1].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                <CurrencyDollarIcon class="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 2</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Commission Structure &amp; Rates</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-5 text-gray-700 text-sm leading-relaxed">
              <p>Affiliates earn commissions on successful subscription purchases made by referred users via unique affiliate tracking links.</p>
              <div class="rounded-xl border border-gray-200 overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Subscription Plan</th>
                      <th class="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Commission Rate</th>
                      <th class="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="rate in commissionRates" :key="rate.plan" class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 font-medium text-gray-900">{{ rate.plan }}</td>
                      <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">{{ rate.rate }}</span>
                      </td>
                      <td class="px-4 py-3 text-gray-600">{{ rate.type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="space-y-2">
                <p class="font-semibold text-gray-900">Important Commission Rules:</p>
                <ul class="space-y-2">
                  <li v-for="rule in commissionRules" :key="rule" class="flex items-start gap-2.5">
                    <div class="h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                    <span>{{ rule }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Section 3: Tracking & Attribution -->
          <div :id="sections[2].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <CursorArrowRaysIcon class="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 3</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Tracking &amp; Attribution</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>The GNP Affiliate Program uses a cookie-based tracking system to attribute referrals to affiliates accurately.</p>
              <ul class="space-y-3">
                <li v-for="item in trackingItems" :key="item" class="flex items-start gap-3">
                  <CheckCircleIcon class="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <InformationCircleIcon class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p class="text-blue-800 text-sm">GNP is not responsible for lost commissions due to cookie deletion, ad-blockers, browser privacy settings, or any technical failure outside GNP's control.</p>
              </div>
            </div>
          </div>

          <!-- Section 4: Payout Policy -->
          <div :id="sections[3].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BanknotesIcon class="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 4</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Payout Policy</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-5 text-gray-700 text-sm leading-relaxed">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-for="stat in payoutStats" :key="stat.label" class="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <div class="text-2xl font-extrabold text-gray-900">{{ stat.value }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
                </div>
              </div>
              <ul class="space-y-3">
                <li v-for="item in payoutItems" :key="item" class="flex items-start gap-3">
                  <CheckCircleIcon class="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <ExclamationTriangleIcon class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p class="text-amber-800 text-sm">GNP may withhold any payment if fraud, abuse, or a violation of these Terms is suspected until an investigation is complete.</p>
              </div>
            </div>
          </div>

          <!-- Section 5: Affiliate Obligations -->
          <div :id="sections[4].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <ShieldCheckIcon class="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 5</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Affiliate Obligations &amp; Code of Conduct</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-5 text-gray-700 text-sm leading-relaxed">
              <p>As an affiliate, you agree to the following obligations:</p>
              <div class="space-y-3">
                <p class="font-semibold text-gray-900">You MUST:</p>
                <ul class="space-y-2">
                  <li v-for="item in obligationsMust" :key="item" class="flex items-start gap-3">
                    <CheckCircleIcon class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div class="space-y-3">
                <p class="font-semibold text-gray-900">You MUST NOT:</p>
                <ul class="space-y-2">
                  <li v-for="item in obligationsMustNot" :key="item" class="flex items-start gap-3">
                    <XCircleIcon class="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Section 6: Prohibited Activities -->
          <div :id="sections[5].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center">
                <NoSymbolIcon class="h-5 w-5 text-red-500" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 6</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Prohibited Activities</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>The following activities will result in immediate termination of your affiliate account and forfeiture of any pending commissions:</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="item in prohibitedActivities"
                  :key="item.title"
                  class="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3"
                >
                  <XCircleIcon class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p class="font-semibold text-red-900 text-sm">{{ item.title }}</p>
                    <p class="text-red-700 text-xs mt-0.5">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 7: Intellectual Property -->
          <div :id="sections[6].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <SparklesIcon class="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 7</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Intellectual Property &amp; Brand Usage</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>GNP grants you a limited, non-exclusive, non-transferable, revocable license to use approved GNP brand assets solely for the purpose of promoting the Affiliate Program.</p>
              <ul class="space-y-3">
                <li v-for="item in ipItems" :key="item" class="flex items-start gap-3">
                  <CheckCircleIcon class="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 8: Termination -->
          <div :id="sections[7].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center">
                <ExclamationCircleIcon class="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 8</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Termination of Participation</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>Either party may terminate participation in the Affiliate Program at any time.</p>
              <ul class="space-y-3">
                <li v-for="item in terminationItems" :key="item" class="flex items-start gap-3">
                  <div class="h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 9: Disclaimer & Liability -->
          <div :id="sections[8].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <ScaleIcon class="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 9</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Disclaimer &amp; Limitation of Liability</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>The GNP Affiliate Program is provided on an "as is" and "as available" basis. GNP makes no warranties, express or implied, regarding the program.</p>
              <ul class="space-y-3">
                <li v-for="item in disclaimerItems" :key="item" class="flex items-start gap-3">
                  <div class="h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 10: Privacy -->
          <div :id="sections[9].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <LockClosedIcon class="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 10</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Privacy &amp; Data Protection</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>GNP collects and processes your personal data to manage your affiliate account and pay commissions.</p>
              <ul class="space-y-3">
                <li v-for="item in privacyItems" :key="item" class="flex items-start gap-3">
                  <CheckCircleIcon class="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 11: Governing Law -->
          <div :id="sections[10].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <BuildingLibraryIcon class="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 11</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Governing Law &amp; Dispute Resolution</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Ghana.</p>
              <p>Before initiating any legal proceedings, both parties agree to make a good-faith effort to resolve any dispute through direct negotiation. If resolution is not achieved within 30 days, the matter may be referred to mediation.</p>
            </div>
          </div>

          <!-- Section 12: Modifications -->
          <div :id="sections[11].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <PencilSquareIcon class="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 12</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Modifications to These Terms</h2>
              </div>
            </div>
            <div class="px-6 py-5 space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>GNP reserves the right to modify, update, or amend these Terms and Conditions at any time without prior notice. The most current version will always be available on this page with the updated date.</p>
              <p>Your continued participation in the Affiliate Program after any changes constitutes your acceptance of the new Terms. We recommend reviewing this page periodically.</p>
            </div>
          </div>

          <!-- Section 13: Contact -->
          <div :id="sections[12].id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-6">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <EnvelopeIcon class="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Section 13</span>
                <h2 class="text-lg font-bold text-gray-900 leading-tight">Contact Information</h2>
              </div>
            </div>
            <div class="px-6 py-5 text-gray-700 text-sm leading-relaxed">
              <p class="mb-4">For any questions regarding these Terms and Conditions or the Affiliate Program, please contact us:</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="mailto:affiliates@graphicnewsplus.com"
                  class="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                >
                  <EnvelopeIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                  <div>
                    <p class="font-medium text-gray-900 text-xs">Email Us</p>
                    <p class="text-gray-500 text-xs mt-0.5">affiliates@graphicnewsplus.com</p>
                  </div>
                </a>
                <a
                  href="tel:+233302213800"
                  class="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                >
                  <PhoneIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                  <div>
                    <p class="font-medium text-gray-900 text-xs">Call Us</p>
                    <p class="text-gray-500 text-xs mt-0.5">+233 30 221 3800</p>
                  </div>
                </a>
                <div class="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <MapPinIcon class="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p class="font-medium text-gray-900 text-xs">Headquarters</p>
                    <p class="text-gray-500 text-xs mt-0.5">Graphic Road, Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acceptance CTA -->
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
            <div class="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HandRaisedIcon class="h-6 w-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-lg mb-2">Ready to Join?</h3>
            <p class="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              By registering, you confirm you have read, understood, and agree to be bound by these Terms &amp; Conditions.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <NuxtLink
                to="/affiliates/register"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
              >
                <UserPlusIcon class="h-5 w-5" />
                Join as Affiliate
              </NuxtLink>
              <NuxtLink
                to="/affiliates/login"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Already an Affiliate? Sign In
              </NuxtLink>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  SparklesIcon,
  ScaleIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HandRaisedIcon,
  UserPlusIcon,
  PrinterIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Affiliate Terms & Conditions – Graphic NewsPlus',
  description: 'Read the Graphic NewsPlus Affiliate Program Terms and Conditions before joining. Understand commission rates, payout policies, prohibited activities, and your obligations as a GNP affiliate partner.',
})

// --- Table of Contents ---
const sections = [
  { id: 'eligibility', label: 'Program Eligibility' },
  { id: 'commission', label: 'Commission Structure' },
  { id: 'tracking', label: 'Tracking & Attribution' },
  { id: 'payout', label: 'Payout Policy' },
  { id: 'obligations', label: 'Affiliate Obligations' },
  { id: 'prohibited', label: 'Prohibited Activities' },
  { id: 'ip', label: 'Intellectual Property' },
  { id: 'termination', label: 'Termination' },
  { id: 'disclaimer', label: 'Disclaimer & Liability' },
  { id: 'privacy', label: 'Privacy & Data' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'modifications', label: 'Modifications' },
  { id: 'contact', label: 'Contact Information' },
]

const activeSection = ref(sections[0].id)

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
  }
}

const printPage = () => {
  window.print()
}

// Highlight active section in ToC based on scroll position
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  )
  sections.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
  onUnmounted(() => observer.disconnect())
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
