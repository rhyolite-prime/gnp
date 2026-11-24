<template>
  <div class="min-h-screen bg-stone-50 pb-24">
    <section class="bg-stone-900 py-12 text-white sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Your news, your way</p>
        <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Follow what matters to you.</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-stone-300">From career opportunities to the headlines shaping Ghana. Choose your interests, explore matching newspaper pages, and opt in to category alerts.</p>
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <NuxtLink to="/pricing" class="rounded-xl bg-primary-600 px-5 py-3 font-bold text-white hover:bg-primary-700">View subscription plans</NuxtLink>
          <span class="text-stone-300">Previews are free. Full reading uses your existing subscription access.</span>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid items-start gap-8 lg:grid-cols-[340px_1fr]">
        <aside class="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6" aria-labelledby="interests-heading">
          <h2 id="interests-heading" class="text-xl font-bold text-stone-900">Choose your interests</h2>
          <p class="mt-2 text-sm leading-6 text-stone-500">Selections are saved on this browser, not purchased separately. Alerts are optional and saved separately below.</p>
          <label for="category-search" class="sr-only">Find a category</label>
          <input id="category-search" v-model="categorySearch" type="search" placeholder="Find a category…" class="mt-4 w-full rounded-xl border-stone-300 text-sm focus:border-primary-500 focus:ring-primary-500" />
          <div class="mt-3 flex gap-4 text-sm font-semibold text-primary-700">
            <button type="button" class="min-h-[44px] hover:underline" @click="selected = categories.map(item => item.id)">Select all</button>
            <button type="button" class="min-h-[44px] hover:underline" @click="selected = []">Clear interests</button>
          </div>
          <fieldset v-for="group in groups" :key="group" class="mt-5 border-t border-stone-100 pt-4">
            <legend class="text-xs font-bold uppercase tracking-wider text-stone-500">{{ group }}</legend>
            <label v-for="category in filteredCategories.filter(item => item.group === group)" :key="category.id" class="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-stone-50">
              <input v-model="selected" :value="category.id" type="checkbox" class="rounded border-stone-300 text-primary-600 focus:ring-primary-500" />
              <span>{{ category.label }}</span>
            </label>
          </fieldset>
          <p v-if="!filteredCategories.length" class="mt-4 text-sm text-stone-500">No matching categories.</p>
          <p role="status" class="mt-5 text-xs text-stone-500">{{ storageError || `${selected.length} interests saved on this browser.` }}</p>
        </aside>

        <div class="min-w-0 space-y-8">
          <section class="rounded-2xl border border-primary-100 bg-white p-6" aria-labelledby="alerts-heading">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="alerts-heading" class="text-xl font-bold text-stone-900">Get category notifications</h2>
                <p class="mt-2 max-w-xl text-sm leading-6 text-stone-600">Receive publisher alerts for the categories you choose. Browser permission is required; alerts do not grant paid reading access.</p>
              </div>
              <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{{ isSubscribed ? 'Notifications enabled' : 'Notifications off' }}</span>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <label v-for="category in categories.filter(item => selected.includes(item.id) || alertSelection.includes(item.id))" :key="category.id" class="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm">
                <input v-model="alertSelection" type="checkbox" :value="category.id" class="rounded border-stone-300 text-primary-600 focus:ring-primary-500" />{{ category.label }}
              </label>
            </div>
            <p v-if="!selected.length && !alertSelection.length" class="mt-4 text-sm text-stone-500">Select interests to choose which categories can send you alerts.</p>
            <p v-if="permissionState === 'denied'" class="mt-4 text-sm text-red-700">Notifications are blocked. Allow them in your browser’s site settings, then try again.</p>
            <p v-if="permissionState === 'unsupported'" class="mt-4 text-sm text-stone-600">This browser does not support notifications. You can still save interests and browse content.</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <button type="button" :disabled="savingAlerts || isSubscribing || permissionState === 'unsupported'" class="min-h-[44px] rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50" @click="saveAlerts">{{ savingAlerts ? 'Saving…' : 'Save alert preferences' }}</button>
              <button type="button" class="min-h-[44px] rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold" @click="alertSelection = [...selected]">Use my interests</button>
              <button type="button" class="min-h-[44px] px-3 py-3 text-sm text-stone-600 hover:underline" @click="alertSelection = []">Clear category alerts</button>
            </div>
            <p v-if="alertMessage" role="status" class="mt-4 text-sm" :class="alertFailed ? 'text-red-700' : 'text-emerald-700'">{{ alertMessage }}</p>
            <p class="mt-3 text-xs text-stone-500">Clearing category alerts takes effect after saving. Other notification preferences are preserved. <button type="button" class="underline" @click="isCenterOpen = true">Manage all notifications</button></p>
          </section>

          <section aria-labelledby="browse-heading">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="browse-heading" class="text-2xl font-bold text-stone-900">Browse your interests</h2>
                <p class="mt-2 text-sm text-stone-600">Keyword matches from our newspaper archives. Full pages open in the subscription reader.</p>
              </div>
              <label class="text-sm font-semibold text-stone-700">Category
                <select v-model="activeCategory" class="ml-2 max-w-full rounded-xl border-stone-300 text-sm">
                  <option value="">Choose a category</option>
                  <option v-for="category in categories.filter(item => selected.includes(item.id))" :key="category.id" :value="category.id">{{ category.label }}</option>
                </select>
              </label>
            </div>
            <div v-if="!selected.length" class="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">Choose one or more interests to start exploring.</div>
            <div v-else-if="loading" role="status" class="mt-6 rounded-2xl bg-white p-10 text-stone-500">Finding matching newspaper pages…</div>
            <div v-else-if="browseError" role="alert" class="mt-6 rounded-2xl border border-red-200 bg-white p-8 text-red-700">{{ browseError }} <button type="button" class="ml-2 min-h-[44px] font-bold underline" @click="loadContent">Try again</button></div>
            <div v-else-if="!items.length" class="mt-6 rounded-2xl bg-white p-10 text-stone-500">No matching pages were found. Try another category or check back as new editions are added.</div>
            <div v-else class="mt-6 grid gap-4 sm:grid-cols-2">
              <NuxtLink v-for="item in items" :key="item.id" :to="`/archives/${encodeURIComponent(item.id)}`" class="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">
                <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">{{ currentCategory?.label }}</p>
                <h3 class="mt-3 text-lg font-bold text-stone-900 group-hover:text-primary-700">{{ item.publicationName || 'Newspaper archive' }}</h3>
                <p class="mt-2 text-xs text-stone-500">{{ formatDate(item.publicationDate) }} · Page {{ item.pageNumber }}</p>
                <p class="mt-4 line-clamp-4 text-sm leading-7 text-stone-600">{{ plainText(item.snippet || item.supportingText) || 'Open this page to explore the full edition.' }}</p>
                <span class="mt-auto pt-5 text-sm font-bold text-primary-700">{{ item.isFree ? 'Open page' : 'Read with subscription' }} →</span>
              </NuxtLink>
            </div>
            <nav v-if="totalPages > 1 && !loading && !browseError" class="mt-6 flex items-center justify-between gap-4" aria-label="Content results pagination">
              <button type="button" :disabled="page <= 1" class="min-h-[44px] rounded-xl border border-stone-300 px-4 disabled:opacity-40" @click="page--">Previous</button>
              <span class="text-sm text-stone-600">Page {{ page }} of {{ totalPages }}</span>
              <button type="button" :disabled="page >= totalPages" class="min-h-[44px] rounded-xl border border-stone-300 px-4 disabled:opacity-40" @click="page++">Next</button>
            </nav>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { CONTENT_CATEGORIES, contentTopic, normalizeContentSelection, type ContentCategoryId } from '~/utils/contentCategories';
import { buildArchiveSearchRequest, searchArchives } from '~/services/archives';
import { usePushNotifications } from '~/composables/usePushNotifications';
import type { ArchiveSearchItem } from '~/models';

useHead({ title: 'Content interests | Graphic NewsPlus', meta: [{ name: 'description', content: 'Choose your news interests, browse matching newspaper pages, and opt in to category notifications.' }] });
const categories = CONTENT_CATEGORIES;
const selected = ref<ContentCategoryId[]>([]);
const categorySearch = ref('');
const activeCategory = ref<ContentCategoryId | ''>('');
const alertSelection = ref<ContentCategoryId[]>([]);
const storageError = ref('');
const page = ref(1);
const items = ref<ArchiveSearchItem[]>([]);
const totalPages = ref(0);
const loading = ref(false);
const browseError = ref('');
const savingAlerts = ref(false);
const alertMessage = ref('');
const alertFailed = ref(false);
const { isSubscribed, permissionState, isSubscribing, subscribedTopics, isCenterOpen, enableBrowserPush, setTopicPreferences } = usePushNotifications();
const filteredCategories = computed(() => categories.filter(item => item.label.toLowerCase().includes(categorySearch.value.trim().toLowerCase())));
const groups = computed(() => [...new Set(filteredCategories.value.map(item => item.group))]);
const currentCategory = computed(() => categories.find(item => item.id === activeCategory.value));
let ready = false;
let requestId = 0;
const storageKey = 'gnp-content-interests-v1';
onMounted(() => {
  try { selected.value = normalizeContentSelection(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
  catch { storageError.value = 'Browser storage is unavailable. Selections will last for this visit.'; }
  ready = true;
});
watch(selected, value => {
  if (ready) {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); storageError.value = ''; }
    catch { storageError.value = 'Could not save interests on this browser.'; }
  }
  if (!value.includes(activeCategory.value as ContentCategoryId)) activeCategory.value = value[0] || '';
}, { deep: true });
watch(activeCategory, () => { page.value = 1; }, { flush: 'sync' });
watch([activeCategory, page], () => { loadContent(); });
watch(subscribedTopics, topics => {
  alertSelection.value = categories.filter(item => topics.includes(contentTopic(item.id))).map(item => item.id);
}, { immediate: true, deep: true });
onBeforeUnmount(() => { requestId++; });
function plainText(text: string) { return String(text || '').replace(/<[^>]*>/g, '').trim(); }
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
async function loadContent() {
  const id = ++requestId;
  items.value = [];
  totalPages.value = 0;
  browseError.value = '';
  if (!currentCategory.value) { loading.value = false; return; }
  loading.value = true;
  try {
    const result = await searchArchives(buildArchiveSearchRequest({ pageNo: page.value, query: currentCategory.value.query, sortOrder: 'desc' }));
    if (id !== requestId) return;
    items.value = result.data || [];
    totalPages.value = result.totalPages || 0;
  } catch { if (id === requestId) browseError.value = 'Content could not be loaded. Please try again.'; }
  finally { if (id === requestId) loading.value = false; }
}
async function saveAlerts() {
  const requested = [...alertSelection.value];
  savingAlerts.value = true;
  alertMessage.value = '';
  alertFailed.value = false;
  try {
    if (!isSubscribed.value && requested.length) {
      const result = await enableBrowserPush();
      if (!result.ok) throw new Error(result.message || 'Notifications could not be enabled.');
    }
    if (isSubscribed.value) {
      const otherTopics = subscribedTopics.value.filter(topic => !topic.startsWith('content_'));
      await setTopicPreferences([...otherTopics, ...requested.map(contentTopic)]);
    }
    alertMessage.value = requested.length ? `Alerts saved for ${requested.length} categories on this browser.` : 'Category alerts are off. Other notification settings are unchanged.';
  } catch (error) {
    alertFailed.value = true;
    alertMessage.value = error instanceof Error ? error.message : 'Could not save alert preferences. Please try again.';
  } finally { savingAlerts.value = false; }
}
</script>
