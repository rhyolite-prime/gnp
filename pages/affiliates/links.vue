<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <div class="mb-8">
      <NuxtLink to="/affiliates/dashboard" class="text-sm font-medium text-primary-700 hover:text-primary-800">← Back to dashboard</NuxtLink>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-900">Affiliate Links</h1>
      <p class="mt-2 text-gray-600">Add the latest newspapers to your website with your affiliate widget.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3 lg:items-start">
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2" aria-labelledby="widget-heading">
        <h2 id="widget-heading" class="text-xl font-bold text-gray-900">Embed Widget</h2>
        <p class="mt-2 text-sm leading-6 text-gray-600">Choose a layout, then copy and paste the code into your website.</p>

        <div class="mt-7">
          <label for="widget-type" class="block text-sm font-semibold text-gray-800">Widget layout</label>
          <select id="widget-type" v-model="widgetType" class="mt-2 block w-full rounded-lg border-gray-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 sm:max-w-sm">
            <option value="carousel">Carousel</option>
            <option value="grid">Grid</option>
          </select>
          <p class="mt-2 text-sm text-gray-500">{{ widgetType === 'carousel' ? 'A compact, horizontal carousel of newspapers.' : 'A full-width grid of the latest newspapers.' }}</p>
        </div>

        <div class="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
          <label for="embed-code" class="block text-sm font-semibold text-gray-800">Your embed code</label>
          <textarea id="embed-code" readonly :value="generatedWidgetCode" rows="4" class="mt-3 w-full resize-none rounded-lg border-gray-300 bg-white p-3 font-mono text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500" />
          <p v-if="!affiliateNo" class="mt-3 text-sm text-amber-700" role="status">Your affiliate number is unavailable. Please sign out and sign in again to generate your code.</p>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" :disabled="!generatedWidgetCode" class="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50" @click="copyWidgetCode">Copy code</button>
            <p v-if="copyMessage" role="status" class="text-sm text-gray-600">{{ copyMessage }}</p>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="tips-heading">
          <h2 id="tips-heading" class="text-lg font-bold text-gray-900">Pro Tips</h2>
          <ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
            <li>Place your widget where readers can easily find it.</li>
            <li>Choose the layout that best fits your website.</li>
            <li>Keep your content fresh to encourage repeat visits.</li>
          </ul>
        </section>

        <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="success-heading">
          <h2 id="success-heading" class="text-lg font-bold text-gray-900">Referral Success Rate</h2>
          <p class="mt-4 text-3xl font-bold text-gray-900">65% <span class="text-sm font-medium text-gray-500">conversion</span></p>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden="true"><div class="h-full w-[65%] rounded-full bg-primary-600"></div></div>
          <dl class="mt-6 space-y-3 text-sm">
            <div class="flex justify-between"><dt class="text-gray-500">Total Referrals</dt><dd class="font-semibold text-gray-900">156</dd></div>
            <div class="flex justify-between"><dt class="text-gray-500">Paid Referrals</dt><dd class="font-semibold text-gray-900">102</dd></div>
          </dl>
          <p class="mt-4 text-xs text-gray-500">Example statistics</p>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

definePageMeta({ layout: 'default', middleware: ['affiliate-auth'] })

const authStore = useAffiliateAuthStore()
const widgetType = ref<'carousel' | 'grid'>('carousel')
const affiliateNo = computed(() => authStore.affiliateNo?.trim() || '')
const generatedWidgetCode = computed(() => {
  if (!affiliateNo.value) return ''
  const height = widgetType.value === 'carousel' ? '500px' : '800px'
  return `<iframe src="https://new.graphicnewsplus.com/affiliates/${encodeURIComponent(affiliateNo.value)}?type=${widgetType.value}" width="100%" height="${height}" frameborder="0" allowfullscreen></iframe>`
})
const copyMessage = ref('')
watch([widgetType, affiliateNo], () => { copyMessage.value = '' })

const copyWidgetCode = async () => {
  if (!generatedWidgetCode.value) return
  try {
    await navigator.clipboard.writeText(generatedWidgetCode.value)
    copyMessage.value = 'Code copied to clipboard.'
  } catch {
    copyMessage.value = 'Could not copy automatically. Select the code above and copy it manually.'
  }
}
</script>
