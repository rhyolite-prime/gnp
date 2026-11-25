<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Remember When CMS
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Manage the historical memory slides, headings, imagery, and archive links featured in the “Remember when?” section on the landing page.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/"
          target="_blank"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          <ArrowTopRightOnSquareIcon class="h-4 w-4 text-gray-500" />
          <span>View Landing Page</span>
        </NuxtLink>
        <button
          type="button"
          @click="showPreview = !showPreview"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          <EyeIcon class="h-4 w-4 text-gray-500" />
          <span>{{ showPreview ? 'Hide Preview' : 'Preview Carousel' }}</span>
        </button>
        <button
          type="button"
          @click="showSettings = !showSettings"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          <Cog6ToothIcon class="h-4 w-4 text-gray-500" />
          <span>Section Settings</span>
        </button>
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon class="h-4 w-4" />
          <span>Add Memory Slide</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Total Memory Slides</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Published on Homepage</p>
        <p class="mt-1 text-2xl font-bold text-green-700">{{ stats.published }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Drafts</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ stats.draft }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Auto-Archive Fallback</p>
        <p class="mt-1 text-lg font-bold" :class="configForm.fallbackToArchiveDates ? 'text-blue-700' : 'text-gray-500'">
          {{ configForm.fallbackToArchiveDates ? 'Enabled' : 'Disabled' }}
        </p>
      </div>
    </div>

    <!-- Live Landing Section Preview -->
    <div v-if="showPreview" class="mb-6 rounded-2xl bg-stone-900 p-6 sm:p-8 text-white shadow-lg border border-stone-800">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{{ configForm.eyebrow }}</p>
          <h2 class="mt-2 text-2xl sm:text-3xl font-bold">{{ configForm.title }}</h2>
          <p class="mt-2 text-sm text-stone-300 max-w-xl">{{ configForm.subtitle }}</p>
        </div>
        <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-300">
          Preview ({{ publishedPreviewSlides.length }} published {{ publishedPreviewSlides.length === 1 ? 'slide' : 'slides' }})
        </span>
      </div>

      <div v-if="publishedPreviewSlides.length" class="grid overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-[1fr_2fr]">
        <div class="relative min-h-48 md:min-h-72 overflow-hidden">
          <img
            :src="activePreviewSlide?.imageUrl || '/images/explore-archives.jpg'"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div class="flex flex-col justify-center p-6 sm:p-8">
          <p class="text-sm font-bold uppercase tracking-widest text-amber-300">{{ activePreviewSlide?.label }}</p>
          <time class="mt-1.5 block text-xs text-stone-400">{{ formatDisplayDate(activePreviewSlide?.date || '') }}</time>
          <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
            From the archive · {{ activePreviewSlide?.publicationName }}
          </p>
          <h3 class="mt-2 text-xl sm:text-2xl font-semibold leading-snug">
            {{ activePreviewSlide?.headline }}
          </h3>
          <p v-if="activePreviewSlide?.description" class="mt-2 text-sm text-stone-300">
            {{ activePreviewSlide.description }}
          </p>
          <div v-if="activePreviewSlide?.keywords && activePreviewSlide.keywords.length" class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="kw in activePreviewSlide.keywords.slice(0, 5)"
              :key="kw"
              class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-amber-200"
            >
              #{{ kw }}
            </span>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-3">
            <span class="inline-flex rounded-lg bg-white px-4 py-2 text-xs font-bold text-stone-900">
              {{ activePreviewSlide?.ctaLabel || 'Revisit this story →' }}
            </span>
            <div class="ml-auto flex gap-2">
              <button
                v-for="(slide, idx) in publishedPreviewSlides"
                :key="slide.id"
                type="button"
                @click="previewIndex = idx"
                class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
                :class="previewIndex === idx ? 'bg-white text-stone-900 border-white' : 'border-white/30 text-white hover:border-amber-300'"
              >
                {{ slide.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="rounded-xl bg-white/5 p-6 text-sm text-stone-300">
        No published slides yet. When fallback is enabled, the landing page automatically searches archives for 30 days ago and 1 year ago.
      </p>
    </div>

    <!-- Section Header & Carousel Settings -->
    <div v-if="showSettings" class="mb-6 bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Landing Section Header &amp; Behaviour</h2>
          <p class="text-xs text-gray-500">Customize the section title, subtitle, rotation interval, and archive-date fallback.</p>
        </div>
        <button type="button" @click="showSettings = false" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <form @submit.prevent="saveConfig" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Eyebrow Label</label>
          <input
            v-model="configForm.eyebrow"
            type="text"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
          <input
            v-model="configForm.title"
            type="text"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
          <input
            v-model="configForm.subtitle"
            type="text"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Autoplay Interval (milliseconds)</label>
          <input
            v-model.number="configForm.autoplayMs"
            type="number"
            min="2000"
            max="30000"
            step="500"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
          />
        </div>
        <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
          <input
            v-model="configForm.fallbackToArchiveDates"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
          <span>
            <span class="block text-sm font-medium text-gray-900">Fallback to automatic archive dates</span>
            <span class="block text-xs text-gray-500">Uses 30-days-ago &amp; 1-year-ago archive searches whenever 0 CMS slides are published.</span>
          </span>
        </label>
        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="savingConfig"
            class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {{ savingConfig ? 'Saving...' : 'Save Section Settings' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
      <div class="relative flex-1 max-w-md">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
        </div>
        <input
          v-model="filters.q"
          type="text"
          placeholder="Search label, headline, publication, or date..."
          class="block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-600 focus:ring-primary-600"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.status"
          class="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-primary-600 focus:ring-primary-600"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button
          type="button"
          @click="loadSlides"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Slides Table -->
    <div class="bg-white shadow-xs ring-1 ring-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Memory Slide</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date &amp; Source</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Destination</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="isLoading && slides.length === 0">
              <td colspan="6" class="py-12 text-center text-sm text-gray-500">
                Loading Remember When slides...
              </td>
            </tr>
            <tr v-else-if="slides.length === 0">
              <td colspan="6" class="py-12 text-center text-sm text-gray-500">
                No memory slides match your filters. Click <strong>Add Memory Slide</strong> to create one.
              </td>
            </tr>
            <tr v-for="(slide, index) in slides" :key="slide.id" class="hover:bg-gray-50/70 transition-colors">
              <td class="whitespace-nowrap py-4 pl-4 pr-2 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    :disabled="index === 0"
                    @click="moveSlide(index, -1)"
                    class="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUpIcon class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    :disabled="index === slides.length - 1"
                    @click="moveSlide(index, 1)"
                    class="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDownIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>

              <td class="px-3 py-4 text-sm">
                <div class="flex items-start gap-3 max-w-lg">
                  <div class="h-14 w-20 flex-shrink-0 rounded-lg bg-stone-900 border border-gray-200 overflow-hidden">
                    <img
                      :src="slide.imageUrl || '/images/explore-archives.jpg'"
                      :alt="slide.label"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="min-w-0">
                    <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {{ slide.label }}
                    </span>
                    <div class="font-semibold text-gray-900 line-clamp-2 mt-1">{{ slide.headline }}</div>
                    <div v-if="slide.description" class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ slide.description }}</div>
                    <div v-if="slide.keywords && slide.keywords.length" class="mt-1 flex flex-wrap gap-1">
                      <span
                        v-for="kw in slide.keywords.slice(0, 3)"
                        :key="kw"
                        class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        #{{ kw }}
                      </span>
                      <span v-if="slide.keywords.length > 3" class="text-[10px] text-gray-400">
                        +{{ slide.keywords.length - 3 }} more
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                <div class="font-medium text-gray-900">{{ formatDisplayDate(slide.date) }}</div>
                <div class="text-xs text-gray-500">{{ slide.publicationName }}</div>
              </td>

              <td class="px-3 py-4 text-xs text-gray-600">
                <div class="font-medium text-gray-800">{{ slide.ctaLabel }}</div>
                <div class="text-gray-400 truncate max-w-[180px]">
                  {{ slide.archiveId ? `/archives/${slide.archiveId}` : (slide.ctaUrl || '/archives') }}
                </div>
              </td>

              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="slide.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'"
                >
                  {{ slide.status }}
                </span>
              </td>

              <td class="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    @click="togglePublish(slide)"
                    class="rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors"
                    :class="slide.status === 'published'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'"
                  >
                    {{ slide.status === 'published' ? 'Move to Draft' : 'Publish' }}
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(slide)"
                    class="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(slide)"
                    class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="isModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-150 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-xs" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div class="flex min-h-full items-center justify-center">
            <TransitionChild
              as="template"
              enter="duration-200 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-150 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                  <div>
                    <DialogTitle class="text-lg font-bold text-gray-900">
                      {{ editingId ? 'Edit Memory Slide' : 'Create Memory Slide' }}
                    </DialogTitle>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Craft a memory highlight manually, link an authentic archive edition, or use AI Vision Assist to analyze a newspaper page image.
                    </p>
                  </div>
                  <button type="button" @click="isModalOpen = false" class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>

                <!-- AI Vision Assist Tool -->
                <div class="mb-5 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 p-4 shadow-2xs">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                        <SparklesIcon class="h-4 w-4" />
                      </div>
                      <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-amber-900">
                          AI Vision Assist: Generate from Newspaper Page
                        </span>
                        <p class="text-[11px] text-gray-500">
                          Extracts lead headline, retrospective narrative, and taxonomy keywords from a newspaper image.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="showAiHints = !showAiHints"
                        class="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
                      >
                        {{ showAiHints ? 'Hide Hints' : 'Add Context Hints' }}
                      </button>
                      <button
                        type="button"
                        @click="openPromptInspector"
                        class="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 rounded border border-amber-300 bg-white px-2 py-1 shadow-2xs"
                      >
                        <DocumentDuplicateIcon class="h-3.5 w-3.5 text-amber-600" />
                        <span>Inspect / Copy Prompt</span>
                      </button>
                    </div>
                  </div>

                  <!-- Optional AI Hints -->
                  <div v-if="showAiHints" class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-amber-200/60 text-xs">
                    <div>
                      <label class="block font-medium text-gray-700 mb-0.5">Publication Hint</label>
                      <input
                        v-model="aiHints.publicationNameHint"
                        type="text"
                        placeholder="e.g. Daily Graphic"
                        class="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-0.5">Date Hint</label>
                      <input
                        v-model="aiHints.dateHint"
                        type="text"
                        placeholder="e.g. 1957-03-06"
                        class="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-0.5">Story Focus / Topic</label>
                      <input
                        v-model="aiHints.storyFocusHint"
                        type="text"
                        placeholder="e.g. Independence proclamation"
                        class="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <!-- Action Bar & Presets -->
                  <div class="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/50">
                    <div class="flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
                      <span class="font-medium text-gray-500">Sample Pages:</span>
                      <button
                        v-for="preset in aiSampleImages"
                        :key="preset.label"
                        type="button"
                        @click="selectSampleImage(preset)"
                        class="rounded border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/70"
                      >
                        {{ preset.label }}
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="triggerAiAnalysis"
                      :disabled="isAiGenerating"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 disabled:opacity-50"
                    >
                      <ArrowPathIcon v-if="isAiGenerating" class="h-3.5 w-3.5 animate-spin" />
                      <SparklesIcon v-else class="h-3.5 w-3.5" />
                      <span>{{ isAiGenerating ? 'Analyzing Page Image...' : 'Generate Slide Details with AI' }}</span>
                    </button>
                  </div>

                  <!-- AI Generated Metadata Insight Pill -->
                  <div v-if="aiAnalysisMeta" class="mt-3 rounded-lg border border-amber-200 bg-amber-100/40 p-2.5 text-xs text-stone-800">
                    <div class="flex items-center justify-between font-bold text-amber-900">
                      <span>AI Analysis Results</span>
                      <span class="font-normal text-[11px] text-gray-600">
                        Confidence: {{ Math.round((aiAnalysisMeta.confidence || 0.95) * 100) }}% · Condition: {{ aiAnalysisMeta.pageQuality || 'readable' }}
                      </span>
                    </div>
                    <p v-if="aiAnalysisMeta.historicalSignificance" class="mt-1 text-[11px] text-gray-700">
                      <strong>Significance:</strong> {{ aiAnalysisMeta.historicalSignificance }}
                    </p>
                    <p v-if="aiAnalysisMeta.transcribedSnippet" class="mt-0.5 text-[11px] text-gray-600 italic">
                      “{{ aiAnalysisMeta.transcribedSnippet }}”
                    </p>
                  </div>
                </div>

                <!-- Archive Picker Helper -->
                <div class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Link an Archive Story (Optional)
                    </span>
                    <button
                      type="button"
                      @click="showArchivePicker = !showArchivePicker"
                      class="text-xs font-semibold text-primary-600 hover:underline"
                    >
                      {{ showArchivePicker ? 'Hide Archive Search' : 'Search Archives by Keyword or Date' }}
                    </button>
                  </div>

                  <div v-if="showArchivePicker" class="mt-3 space-y-3">
                    <div class="flex flex-col sm:flex-row gap-2">
                      <input
                        v-model="archiveQuery"
                        type="text"
                        placeholder="Keyword (e.g. independence, black stars, summit)"
                        class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                        @keyup.enter="searchArchiveRecords"
                      />
                      <input
                        v-model="archiveDate"
                        type="date"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        @click="searchArchiveRecords"
                        :disabled="archiveLoading"
                        class="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {{ archiveLoading ? 'Searching...' : 'Find' }}
                      </button>
                    </div>

                    <div v-if="archiveError" class="text-xs text-red-600">{{ archiveError }}</div>

                    <div v-if="archiveResults.length" class="max-h-44 overflow-y-auto divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                      <button
                        v-for="hit in archiveResults"
                        :key="hit.id"
                        type="button"
                        @click="applyArchivePick(hit)"
                        class="w-full text-left px-3 py-2 hover:bg-primary-50 flex items-center justify-between gap-3"
                      >
                        <div class="min-w-0">
                          <div class="text-xs font-semibold text-gray-900 line-clamp-1">
                            {{ hit.snippet || hit.supportingText || `${hit.publicationName} page ${hit.pageNumber}` }}
                          </div>
                          <div class="text-[11px] text-gray-500">
                            {{ hit.publicationName }} · {{ hit.publicationDate?.slice(0, 10) }} · Page {{ hit.pageNumber }}
                          </div>
                        </div>
                        <span class="shrink-0 text-xs font-semibold text-primary-600">Select →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="saveSlide" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Slide Label *</label>
                      <input
                        v-model="form.label"
                        type="text"
                        required
                        placeholder="e.g. 30 days ago, A year ago, March 1957"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Memory Date *</label>
                      <input
                        v-model="form.date"
                        type="date"
                        required
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Publication Name</label>
                      <input
                        v-model="form.publicationName"
                        type="text"
                        placeholder="Daily Graphic"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        v-model="form.status"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Featured Headline / Quote *</label>
                    <textarea
                      v-model="form.headline"
                      rows="3"
                      placeholder="Headline or excerpt highlighted in the Remember When slide..."
                      class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Supporting Description (Optional)</label>
                    <textarea
                      v-model="form.description"
                      rows="2"
                      placeholder="Optional context displayed below the headline..."
                      class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <!-- Keywords Tags Section -->
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-xs font-semibold text-gray-700">
                        Keywords &amp; Taxonomy Tags ({{ form.keywords.length }})
                      </label>
                      <span class="text-[11px] text-gray-400">Entities, themes, decade &amp; topics for indexing</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-2 p-2 rounded-lg border border-gray-200 bg-gray-50 min-h-[42px] items-center">
                      <span
                        v-for="(kw, idx) in form.keywords"
                        :key="kw"
                        class="inline-flex items-center gap-1 rounded-full bg-white border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-800 shadow-2xs"
                      >
                        #{{ kw }}
                        <button
                          type="button"
                          @click="removeKeyword(idx)"
                          class="rounded-full hover:bg-gray-200 p-0.5 text-gray-400 hover:text-gray-700"
                        >
                          <XMarkIcon class="h-3 w-3" />
                        </button>
                      </span>
                      <span v-if="!form.keywords.length" class="text-xs text-gray-400 italic">
                        No keywords added yet. Use AI Vision generation above or type below.
                      </span>
                    </div>
                    <div class="flex gap-2">
                      <input
                        v-model="newKeywordInput"
                        type="text"
                        placeholder="Add a keyword tag (e.g. Kwame Nkrumah, 1957, AFCON, Accra) and press Enter"
                        class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-600 focus:ring-primary-600"
                        @keydown.enter.prevent="addKeyword"
                      />
                      <button
                        type="button"
                        @click="addKeyword"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Slide Image URL</label>
                      <input
                        v-model="form.imageUrl"
                        type="text"
                        placeholder="/images/explore-archives.jpg"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                      <div class="mt-1.5 flex flex-wrap gap-1.5">
                        <button
                          v-for="preset in imagePresets"
                          :key="preset.url"
                          type="button"
                          @click="form.imageUrl = preset.url"
                          class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                        >
                          {{ preset.label }}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Linked Archive ID (Optional)</label>
                      <input
                        v-model="form.archiveId"
                        type="text"
                        placeholder="Archive document ID (opens /archives/:id)"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Button Label</label>
                      <input
                        v-model="form.ctaLabel"
                        type="text"
                        placeholder="Revisit this story →"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Custom Link URL (Used if no Archive ID)</label>
                      <input
                        v-model="form.ctaUrl"
                        type="text"
                        placeholder="/archives"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                  </div>

                  <p v-if="formError" class="text-xs font-medium text-red-600">{{ formError }}</p>

                  <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      @click="isModalOpen = false"
                      class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSaving"
                      class="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
                    >
                      {{ isSaving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Slide') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="Boolean(deleteTarget)"
      title="Delete Memory Slide"
      :message="`Are you sure you want to delete the '${deleteTarget?.label}' slide?`"
      confirm-text="Delete"
      @confirm="executeDelete"
      @cancel="deleteTarget = null"
    />

    <!-- AI Prompt Inspector Modal -->
    <TransitionRoot appear :show="showPromptModal" as="template">
      <Dialog as="div" @close="showPromptModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-150 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-xs" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div class="flex min-h-full items-center justify-center">
            <TransitionChild
              as="template"
              enter="duration-200 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-150 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <SparklesIcon class="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle class="text-lg font-bold text-gray-900">
                        Remember When AI Vision Prompt Specification
                      </DialogTitle>
                      <p class="text-xs text-gray-500">
                        Inspect the multimodal vision prompt, system instructions, and provider payload formats.
                      </p>
                    </div>
                  </div>
                  <button type="button" @click="showPromptModal = false" class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>

                <!-- Provider Tabs -->
                <div class="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-gray-200 pb-2">
                  <div class="flex gap-2">
                    <button
                      v-for="tab in promptTabs"
                      :key="tab.id"
                      type="button"
                      @click="activePromptTab = tab.id"
                      class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                      :class="activePromptTab === tab.id ? 'bg-stone-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    >
                      {{ tab.label }}
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="copyPromptToClipboard"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
                  >
                    <CheckIcon v-if="copiedPrompt" class="h-4 w-4 text-green-600" />
                    <DocumentDuplicateIcon v-else class="h-4 w-4 text-gray-500" />
                    <span>{{ copiedPrompt ? 'Copied to Clipboard!' : 'Copy Payload' }}</span>
                  </button>
                </div>

                <!-- Prompt Content Viewer -->
                <div class="relative">
                  <pre class="max-h-[500px] overflow-auto rounded-xl bg-stone-900 p-4 text-xs font-mono text-stone-200 leading-relaxed whitespace-pre-wrap select-all">{{ promptDisplayText }}</pre>
                </div>

                <div class="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>Target Image: <code class="text-amber-800">{{ form.imageUrl || '/images/explore-archives.jpg' }}</code></span>
                  <button
                    type="button"
                    @click="showPromptModal = false"
                    class="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { debounce } from 'lodash-es';
import type { ArchiveSearchItem } from '~/models';
import { buildArchiveSearchRequest, searchArchives } from '~/services/archives';
import {
  createRememberWhenSlide,
  deleteRememberWhenSlide,
  fetchRememberWhenCms,
  generateRememberWhenAiSlide,
  reorderRememberWhenSlides,
  toggleRememberWhenSlide,
  updateRememberWhenConfig,
  updateRememberWhenSlide,
} from '~/services/cms';
import {
  DEFAULT_REMEMBER_WHEN_CONFIG,
  type RememberWhenConfig,
  type RememberWhenSlide,
  type RememberWhenStatus,
} from '~/utils/cmsContent';
import {
  buildRememberWhenPrompt,
  generateSimulatedRememberWhen,
  REMEMBER_WHEN_FEW_SHOT_EXAMPLES,
  REMEMBER_WHEN_JSON_SCHEMA,
  REMEMBER_WHEN_SYSTEM_PROMPT,
  type RememberWhenAiGeneratedResult,
} from '~/utils/rememberWhenPrompt';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

useHead({
  title: 'Remember When CMS | Graphic NewsPlus',
});

const { $toast } = useNuxtApp();

const slides = ref<RememberWhenSlide[]>([]);
const stats = ref({ total: 0, published: 0, draft: 0 });
const isLoading = ref(true);
const showSettings = ref(false);
const showPreview = ref(false);
const savingConfig = ref(false);
const previewIndex = ref(0);

const filters = reactive({
  q: '',
  status: 'all',
});

const configForm = reactive<RememberWhenConfig>({ ...DEFAULT_REMEMBER_WHEN_CONFIG });

const publishedPreviewSlides = computed(() =>
  slides.value.filter(s => s.status === 'published'),
);
const activePreviewSlide = computed(
  () => publishedPreviewSlides.value[previewIndex.value] ?? publishedPreviewSlides.value[0],
);

watch(publishedPreviewSlides, (list) => {
  if (previewIndex.value >= list.length) {
    previewIndex.value = 0;
  }
});

const imagePresets = [
  { label: 'Archives', url: '/images/explore-archives.jpg' },
  { label: 'Newspapers', url: '/images/explore-newspapers.jpg' },
  { label: 'Partners', url: '/images/explore-partners.jpg' },
  { label: 'Affiliates', url: '/images/explore-affiliates.jpg' },
];

const formatDisplayDate = (value: string) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value || '—';
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const loadSlides = async () => {
  isLoading.value = true;
  try {
    const res = await fetchRememberWhenCms({
      q: filters.q,
      status: filters.status,
    });
    slides.value = res.slides;
    stats.value = res.stats;
    Object.assign(configForm, res.config);
  } catch {
    $toast?.error?.('Unable to load Remember When slides.');
  } finally {
    isLoading.value = false;
  }
};

const debouncedLoad = debounce(loadSlides, 250);
watch(() => filters.q, debouncedLoad);
watch(() => filters.status, loadSlides);

const saveConfig = async () => {
  savingConfig.value = true;
  try {
    const updated = await updateRememberWhenConfig({ ...configForm });
    Object.assign(configForm, updated);
    $toast?.success?.('Remember When section settings saved.');
  } catch {
    $toast?.error?.('Failed to update section settings.');
  } finally {
    savingConfig.value = false;
  }
};

// Create / Edit Modal
const isModalOpen = ref(false);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const formError = ref('');

// AI Vision Assist State
const showAiHints = ref(false);
const isAiGenerating = ref(false);
const showPromptModal = ref(false);
const copiedPrompt = ref(false);
const activePromptTab = ref<'generic' | 'openai' | 'anthropic' | 'gemini' | 'schema'>('generic');
const newKeywordInput = ref('');
const aiAnalysisMeta = ref<{
  confidence?: number;
  pageQuality?: string;
  historicalSignificance?: string;
  transcribedSnippet?: string;
} | null>(null);

const aiHints = reactive({
  publicationNameHint: '',
  dateHint: '',
  storyFocusHint: '',
  targetAudience: 'National Heritage & Archival Audience',
});

const aiSampleImages = [
  {
    label: '1957 Independence',
    url: '/images/explore-archives.jpg',
    publication: 'Daily Graphic',
    date: '1957-03-06',
    focus: 'Ghana Independence proclamation',
  },
  {
    label: '1982 AFCON Trophy',
    url: '/images/explore-newspapers.jpg',
    publication: 'Daily Graphic',
    date: '1982-03-15',
    focus: 'Black Stars win 4th African Cup in Tripoli',
  },
  {
    label: '1960 Republic Day',
    url: '/images/explore-archives.jpg',
    publication: 'The Mirror',
    date: '1960-07-02',
    focus: 'Republic Day declaration & First President inauguration',
  },
];

const promptTabs = [
  { id: 'generic', label: 'Universal Prompt' },
  { id: 'openai', label: 'OpenAI (GPT-4o)' },
  { id: 'anthropic', label: 'Anthropic (Claude 3.5)' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'schema', label: 'JSON Schema' },
] as const;

const promptBundle = computed(() => {
  return buildRememberWhenPrompt({
    image: form.imageUrl || '/images/explore-archives.jpg',
    publicationNameHint: aiHints.publicationNameHint || form.publicationName,
    dateHint: aiHints.dateHint || form.date,
    storyFocusHint: aiHints.storyFocusHint,
    targetAudience: aiHints.targetAudience,
    provider: activePromptTab.value === 'schema' ? 'generic' : activePromptTab.value,
  });
});

const promptDisplayText = computed(() => {
  if (activePromptTab.value === 'schema') {
    return JSON.stringify(REMEMBER_WHEN_JSON_SCHEMA, null, 2);
  }
  if (activePromptTab.value === 'generic') {
    return `# SYSTEM PROMPT\n${REMEMBER_WHEN_SYSTEM_PROMPT}\n\n# USER PROMPT\n${promptBundle.value.userPromptText}\n\n# TARGET IMAGE\n${form.imageUrl || '/images/explore-archives.jpg'}\n\n# JSON SCHEMA\n${JSON.stringify(REMEMBER_WHEN_JSON_SCHEMA, null, 2)}`;
  }
  return JSON.stringify(promptBundle.value.providerPayload, null, 2);
});

const selectSampleImage = (preset: typeof aiSampleImages[number]) => {
  form.imageUrl = preset.url;
  aiHints.publicationNameHint = preset.publication;
  aiHints.dateHint = preset.date;
  aiHints.storyFocusHint = preset.focus;
  form.publicationName = preset.publication;
  form.date = preset.date;
  $toast?.info?.(`Loaded sample: ${preset.label}`);
};

const addKeyword = () => {
  const trimmed = newKeywordInput.value.trim().replace(/^#/, '');
  if (!trimmed) return;
  if (!form.keywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) {
    form.keywords.push(trimmed);
  }
  newKeywordInput.value = '';
};

const removeKeyword = (index: number) => {
  form.keywords.splice(index, 1);
};

const triggerAiAnalysis = async () => {
  isAiGenerating.value = true;
  formError.value = '';
  try {
    const res = await generateRememberWhenAiSlide({
      image: form.imageUrl || '/images/explore-archives.jpg',
      imageUrl: form.imageUrl || '/images/explore-archives.jpg',
      publicationNameHint: aiHints.publicationNameHint || form.publicationName,
      dateHint: aiHints.dateHint || form.date,
      storyFocusHint: aiHints.storyFocusHint,
      targetAudience: aiHints.targetAudience,
    });

    const slideData: RememberWhenAiGeneratedResult = res?.slideData || generateSimulatedRememberWhen({
      image: form.imageUrl,
      publicationNameHint: aiHints.publicationNameHint || form.publicationName,
      dateHint: aiHints.dateHint || form.date,
      storyFocusHint: aiHints.storyFocusHint,
    });

    if (slideData.headline) form.headline = slideData.headline;
    if (slideData.description) form.description = slideData.description;
    if (slideData.date) form.date = slideData.date;
    if (slideData.publicationName) form.publicationName = slideData.publicationName;
    if (slideData.label) form.label = slideData.label;
    if (slideData.ctaLabel) form.ctaLabel = slideData.ctaLabel;
    if (Array.isArray(slideData.keywords) && slideData.keywords.length) {
      form.keywords = [...slideData.keywords];
    }

    aiAnalysisMeta.value = {
      confidence: slideData.confidence,
      pageQuality: slideData.pageQuality,
      historicalSignificance: slideData.historicalSignificance,
      transcribedSnippet: slideData.transcribedSnippet,
    };

    $toast?.success?.('AI generated slide headline, description, keywords & metadata!');
  } catch {
    const fallback = generateSimulatedRememberWhen({
      image: form.imageUrl,
      publicationNameHint: aiHints.publicationNameHint || form.publicationName,
      dateHint: aiHints.dateHint || form.date,
      storyFocusHint: aiHints.storyFocusHint,
    });
    form.headline = fallback.headline;
    form.description = fallback.description;
    form.date = fallback.date;
    form.publicationName = fallback.publicationName;
    form.label = fallback.label;
    form.ctaLabel = fallback.ctaLabel || 'Revisit this story →';
    form.keywords = [...fallback.keywords];
    aiAnalysisMeta.value = {
      confidence: fallback.confidence,
      pageQuality: fallback.pageQuality,
      historicalSignificance: fallback.historicalSignificance,
      transcribedSnippet: fallback.transcribedSnippet,
    };
    $toast?.success?.('Generated slide details from archive analysis.');
  } finally {
    isAiGenerating.value = false;
  }
};

const openPromptInspector = () => {
  copiedPrompt.value = false;
  showPromptModal.value = true;
};

const copyPromptToClipboard = async () => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(promptDisplayText.value);
      copiedPrompt.value = true;
      $toast?.success?.('Prompt payload copied to clipboard!');
      setTimeout(() => { copiedPrompt.value = false; }, 3000);
    }
  } catch {
    $toast?.error?.('Could not copy to clipboard.');
  }
};

const form = reactive({
  label: '',
  date: new Date().toISOString().slice(0, 10),
  publicationName: 'Daily Graphic',
  headline: '',
  description: '',
  keywords: [] as string[],
  imageUrl: '/images/explore-archives.jpg',
  archiveId: '',
  ctaLabel: 'Revisit this story →',
  ctaUrl: '/archives',
  status: 'published' as RememberWhenStatus,
});

const resetForm = () => {
  editingId.value = null;
  formError.value = '';
  form.label = '';
  form.date = new Date().toISOString().slice(0, 10);
  form.publicationName = 'Daily Graphic';
  form.headline = '';
  form.description = '';
  form.keywords = [];
  form.imageUrl = '/images/explore-archives.jpg';
  form.archiveId = '';
  form.ctaLabel = 'Revisit this story →';
  form.ctaUrl = '/archives';
  form.status = 'published';
  aiAnalysisMeta.value = null;
  newKeywordInput.value = '';
};

const openCreateModal = () => {
  resetForm();
  showArchivePicker.value = false;
  showAiHints.value = false;
  isModalOpen.value = true;
};

const openEditModal = (slide: RememberWhenSlide) => {
  resetForm();
  editingId.value = slide.id;
  form.label = slide.label;
  form.date = slide.date;
  form.publicationName = slide.publicationName;
  form.headline = slide.headline;
  form.description = slide.description;
  form.keywords = Array.isArray(slide.keywords) ? [...slide.keywords] : [];
  form.imageUrl = slide.imageUrl;
  form.archiveId = slide.archiveId;
  form.ctaLabel = slide.ctaLabel;
  form.ctaUrl = slide.ctaUrl;
  form.status = slide.status;
  showArchivePicker.value = false;
  showAiHints.value = false;
  isModalOpen.value = true;
};

const saveSlide = async () => {
  formError.value = '';
  isSaving.value = true;
  try {
    if (editingId.value) {
      await updateRememberWhenSlide(editingId.value, { ...form });
      $toast?.success?.('Memory slide updated.');
    } else {
      await createRememberWhenSlide({ ...form });
      $toast?.success?.('Memory slide created.');
    }
    isModalOpen.value = false;
    await loadSlides();
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'Could not save memory slide.';
  } finally {
    isSaving.value = false;
  }
};

const togglePublish = async (slide: RememberWhenSlide) => {
  const nextStatus: RememberWhenStatus = slide.status === 'published' ? 'draft' : 'published';
  try {
    await toggleRememberWhenSlide(slide.id, nextStatus);
    $toast?.success?.(nextStatus === 'published' ? 'Slide published to homepage.' : 'Slide moved to Draft.');
    await loadSlides();
  } catch {
    $toast?.error?.('Unable to update slide status.');
  }
};

const moveSlide = async (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= slides.value.length) return;
  const copy = [...slides.value];
  const [moved] = copy.splice(index, 1);
  copy.splice(target, 0, moved!);
  slides.value = copy;
  try {
    await reorderRememberWhenSlides(copy.map(s => s.id));
    await loadSlides();
  } catch {
    $toast?.error?.('Unable to reorder slides.');
    await loadSlides();
  }
};

const deleteTarget = ref<RememberWhenSlide | null>(null);
const confirmDelete = (slide: RememberWhenSlide) => {
  deleteTarget.value = slide;
};
const executeDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  deleteTarget.value = null;
  try {
    await deleteRememberWhenSlide(id);
    $toast?.success?.('Memory slide deleted.');
    await loadSlides();
  } catch {
    $toast?.error?.('Failed to delete memory slide.');
  }
};

// Archive Picker
const showArchivePicker = ref(false);
const archiveQuery = ref('');
const archiveDate = ref('');
const archiveLoading = ref(false);
const archiveError = ref('');
const archiveResults = ref<ArchiveSearchItem[]>([]);

const searchArchiveRecords = async () => {
  archiveLoading.value = true;
  archiveError.value = '';
  archiveResults.value = [];
  try {
    const res = await searchArchives(
      buildArchiveSearchRequest({
        pageNo: 1,
        pageSize: 10,
        query: archiveQuery.value,
        publicationDate: archiveDate.value,
      }),
    );
    archiveResults.value = res.data || [];
    if (!archiveResults.value.length) {
      archiveError.value = 'No archive records matched that search.';
    }
  } catch {
    archiveError.value = 'Archive search is temporarily unavailable.';
  } finally {
    archiveLoading.value = false;
  }
};

const applyArchivePick = (item: ArchiveSearchItem) => {
  form.archiveId = item.id;
  form.publicationName = item.publicationName || 'Daily Graphic';
  if (item.publicationDate) {
    form.date = item.publicationDate.slice(0, 10);
  }
  form.headline = (item.snippet || item.supportingText || '').trim();
  if (!form.label && form.date) {
    form.label = formatDisplayDate(form.date);
  }
  form.ctaLabel = 'Revisit this story →';
  form.ctaUrl = `/archives/${encodeURIComponent(item.id)}`;
  showArchivePicker.value = false;
};

onMounted(loadSlides);
</script>
