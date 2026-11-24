<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Discover Feed CMS
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Curate, schedule, pin, and manage editorial stories, videos, newspapers, and archive picks shown on the Discover page.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/discover?source=live"
          target="_blank"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          <ArrowTopRightOnSquareIcon class="h-4 w-4 text-gray-500" />
          <span>Preview Live Discover</span>
        </NuxtLink>
        <button
          type="button"
          @click="showSettings = !showSettings"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          <Cog6ToothIcon class="h-4 w-4 text-gray-500" />
          <span>Feed Settings</span>
        </button>
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon class="h-4 w-4" />
          <span>Add Discover Item</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Total Curated Items</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Published on Live Feed</p>
        <p class="mt-1 text-2xl font-bold text-green-700">{{ stats.published }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Pinned Spotlights</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ stats.pinned }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <p class="text-xs font-medium text-gray-500">Drafts &amp; Archived</p>
        <p class="mt-1 text-2xl font-bold text-gray-700">{{ stats.draft + stats.archived }}</p>
      </div>
    </div>

    <!-- Feed Settings Panel -->
    <div v-if="showSettings" class="mb-6 bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Discover Feed Settings</h2>
          <p class="text-xs text-gray-500">Controls the live Discover header copy and how curated CMS items mix with catalogue items.</p>
        </div>
        <button type="button" @click="showSettings = false" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <form @submit.prevent="saveConfig" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Feed Heading</label>
          <input
            v-model="configForm.heading"
            type="text"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
            placeholder="Discover"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Feed Subheading</label>
          <input
            v-model="configForm.subheading"
            type="text"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
            placeholder="For you"
          />
        </div>
        <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
          <input
            v-model="configForm.prioritizePinned"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
          <span>
            <span class="block text-sm font-medium text-gray-900">Pin featured items to top</span>
            <span class="block text-xs text-gray-500">Pinned CMS items appear first in display order before general feed cards.</span>
          </span>
        </label>
        <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
          <input
            v-model="configForm.includeLiveCatalogue"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
          <span>
            <span class="block text-sm font-medium text-gray-900">Include live API catalogue</span>
            <span class="block text-xs text-gray-500">When disabled, the live Discover feed renders only published CMS items.</span>
          </span>
        </label>
        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="savingConfig"
            class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {{ savingConfig ? 'Saving...' : 'Save Feed Settings' }}
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
          placeholder="Search title, excerpt, source, or topic..."
          class="block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-600 focus:ring-primary-600"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select
          v-model="filters.status"
          class="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-primary-600 focus:ring-primary-600"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select
          v-model="filters.kind"
          class="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-primary-600 focus:ring-primary-600"
        >
          <option value="all">All Content Types</option>
          <option value="story">Story</option>
          <option value="newspaper">Newspaper</option>
          <option value="archive">Archive</option>
          <option value="video">Video</option>
        </select>

        <button
          type="button"
          @click="loadItems"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white shadow-xs ring-1 ring-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Content Card</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Topics &amp; Access</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pin</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="isLoading && items.length === 0">
              <td colspan="7" class="py-12 text-center text-sm text-gray-500">
                Loading Discover CMS items...
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="py-12 text-center text-sm text-gray-500">
                No Discover items match your current filters. Click <strong>Add Discover Item</strong> to create one.
              </td>
            </tr>
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50/70 transition-colors">
              <td class="whitespace-nowrap py-4 pl-4 pr-2 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    :disabled="index === 0"
                    @click="moveItem(index, -1)"
                    class="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUpIcon class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    :disabled="index === items.length - 1"
                    @click="moveItem(index, 1)"
                    class="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDownIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>

              <td class="px-3 py-4 text-sm">
                <div class="flex items-start gap-3 max-w-md">
                  <div class="h-14 w-20 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-xs text-gray-400">
                      No Img
                    </div>
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-gray-900 line-clamp-1">{{ item.title }}</div>
                    <div class="text-xs text-gray-500 line-clamp-2 mt-0.5">{{ item.excerpt || 'No summary provided.' }}</div>
                    <div class="text-[11px] text-gray-400 mt-1">{{ item.source }} · {{ item.date }}</div>
                  </div>
                </div>
              </td>

              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize ring-1 ring-inset" :class="kindBadgeClass(item.kind)">
                  {{ item.kind }}
                </span>
              </td>

              <td class="px-3 py-4 text-sm">
                <div class="flex flex-wrap gap-1 mb-1.5">
                  <span
                    v-for="topic in item.topics.slice(0, 3)"
                    :key="topic"
                    class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                  >
                    {{ topic }}
                  </span>
                  <span v-if="item.topics.length > 3" class="text-[11px] text-gray-400">+{{ item.topics.length - 3 }}</span>
                  <span v-if="item.topics.length === 0" class="text-xs text-gray-400">General</span>
                </div>
                <span
                  class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  :class="item.accessTier === 'public' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'"
                >
                  {{ item.accessTier === 'public' ? 'Free / Public' : 'Subscriber' }}
                </span>
              </td>

              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <button
                  type="button"
                  @click="togglePin(item)"
                  class="p-1.5 rounded-lg transition-colors"
                  :class="item.pinned ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'text-gray-300 hover:text-amber-500 hover:bg-gray-100'"
                  :title="item.pinned ? 'Unpin item' : 'Pin item to top'"
                >
                  <StarSolid v-if="item.pinned" class="h-5 w-5" />
                  <StarOutline v-else class="h-5 w-5" />
                </button>
              </td>

              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="statusBadgeClass(item.status)"
                >
                  {{ item.status }}
                </span>
              </td>

              <td class="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    @click="togglePublish(item)"
                    class="rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors"
                    :class="item.status === 'published'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'"
                  >
                    {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(item)"
                    class="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(item)"
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
              <DialogPanel class="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                  <div>
                    <DialogTitle class="text-lg font-bold text-gray-900">
                      {{ editingId ? 'Edit Discover Item' : 'Create Discover Item' }}
                    </DialogTitle>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Author custom editorial content or import directly from your live Archives, Newspapers, or Videos catalogue.
                    </p>
                  </div>
                  <button type="button" @click="isModalOpen = false" class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>

                <!-- Catalogue Picker Helper -->
                <div class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Quick Import from Catalogue (Optional)
                    </span>
                    <button
                      type="button"
                      @click="showCataloguePicker = !showCataloguePicker"
                      class="text-xs font-semibold text-primary-600 hover:underline"
                    >
                      {{ showCataloguePicker ? 'Hide Catalogue Picker' : 'Search Archives / Newspapers / Videos' }}
                    </button>
                  </div>

                  <div v-if="showCataloguePicker" class="mt-3 space-y-3">
                    <div class="flex flex-col sm:flex-row gap-2">
                      <select
                        v-model="catalogueSourceType"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                      >
                        <option value="archive">Archives</option>
                        <option value="newspaper">Newspapers</option>
                        <option value="video">Videos</option>
                      </select>
                      <input
                        v-model="catalogueQuery"
                        type="text"
                        placeholder="Search keyword (e.g. economy, independence, sports)..."
                        class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
                        @keyup.enter="searchCatalogue"
                      />
                      <button
                        type="button"
                        @click="searchCatalogue"
                        :disabled="catalogueLoading"
                        class="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {{ catalogueLoading ? 'Searching...' : 'Search' }}
                      </button>
                    </div>

                    <div v-if="catalogueError" class="text-xs text-red-600">{{ catalogueError }}</div>

                    <div v-if="catalogueResults.length" class="max-h-44 overflow-y-auto divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                      <button
                        v-for="hit in catalogueResults"
                        :key="hit.id"
                        type="button"
                        @click="applyCataloguePick(hit)"
                        class="w-full text-left px-3 py-2 hover:bg-primary-50 flex items-center justify-between gap-3"
                      >
                        <div class="min-w-0">
                          <div class="text-xs font-semibold text-gray-900 truncate">{{ hit.title }}</div>
                          <div class="text-[11px] text-gray-500 truncate">{{ hit.source }} · {{ hit.date }}</div>
                        </div>
                        <span class="shrink-0 text-xs font-semibold text-primary-600">Use →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <!-- Form Column -->
                  <form @submit.prevent="saveItem" class="lg:col-span-3 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Content Type *</label>
                        <select
                          v-model="form.kind"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        >
                          <option value="story">Story</option>
                          <option value="newspaper">Newspaper</option>
                          <option value="archive">Archive</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Access Tier</label>
                        <select
                          v-model="form.accessTier"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        >
                          <option value="public">Public / Free</option>
                          <option value="subscriber">Subscriber Only</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Headline / Title *</label>
                      <input
                        v-model="form.title"
                        type="text"
                        required
                        placeholder="Enter a compelling headline for the Discover card"
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Excerpt / Summary</label>
                      <textarea
                        v-model="form.excerpt"
                        rows="2"
                        placeholder="Short summary shown beneath the headline..."
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>

                    <div v-if="form.kind === 'story'">
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Full Story Body (Public Inline Reader)</label>
                      <textarea
                        v-model="form.body"
                        rows="4"
                        placeholder="Full story text rendered when a reader clicks 'Read this story'..."
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>

                    <div v-if="form.kind === 'video'">
                      <label class="block text-xs font-semibold text-gray-700 mb-1">YouTube Video URL</label>
                      <input
                        v-model="form.videoUrl"
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Source / Publication Label</label>
                        <input
                          v-model="form.source"
                          type="text"
                          placeholder="e.g. Daily Graphic"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        />
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Publication Date</label>
                        <input
                          v-model="form.date"
                          type="date"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Image URL or Asset Path</label>
                        <input
                          v-model="form.image"
                          type="text"
                          placeholder="/images/explore-newspapers.jpg or https://..."
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        />
                        <div class="mt-1.5 flex flex-wrap gap-1.5">
                          <button
                            v-for="preset in imagePresets"
                            :key="preset.url"
                            type="button"
                            @click="form.image = preset.url"
                            class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                          >
                            {{ preset.label }}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Target Link (href)</label>
                        <input
                          v-model="form.href"
                          type="text"
                          placeholder="/archives/123 or /newspapers/..."
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1.5">Interest Topics</label>
                      <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-lg border border-gray-200 bg-gray-50">
                        <button
                          v-for="topic in topicOptions"
                          :key="topic"
                          type="button"
                          @click="toggleTopic(topic)"
                          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors border"
                          :class="form.topics.includes(topic)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'"
                        >
                          {{ topic }}
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                        <select
                          v-model="form.status"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Expires On (Optional)</label>
                        <input
                          v-model="form.expiresAt"
                          type="date"
                          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:ring-primary-600"
                        />
                      </div>

                      <label class="flex items-center gap-2 pt-4 cursor-pointer">
                        <input
                          v-model="form.pinned"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        />
                        <span class="text-sm font-medium text-gray-800">Pin to top</span>
                      </label>
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
                        {{ isSaving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Item') }}
                      </button>
                    </div>
                  </form>

                  <!-- Live Card Preview Column -->
                  <div class="lg:col-span-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Live Discover Card Preview</p>
                    <div class="relative h-[420px] rounded-2xl border border-stone-200 bg-white shadow-md overflow-hidden flex flex-col justify-end">
                      <img
                        v-if="form.image"
                        :src="form.image"
                        alt=""
                        class="absolute inset-0 h-full w-full object-cover"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/15" />

                      <div class="absolute inset-x-4 top-4 flex flex-wrap gap-2">
                        <span class="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-800">
                          {{ kindLabels[form.kind] }}
                        </span>
                        <span v-if="form.pinned" class="rounded-full bg-amber-300 px-3 py-1 text-[11px] font-semibold text-stone-950">
                          Pinned spotlight
                        </span>
                      </div>

                      <div class="relative p-5">
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                          {{ form.source || 'Graphic NewsPlus' }}<span v-if="form.date"> · {{ form.date }}</span>
                        </p>
                        <h3 class="mt-2 text-xl font-bold leading-snug text-stone-900 line-clamp-3">
                          {{ form.title || 'Your Discover headline appears here' }}
                        </h3>
                        <p class="mt-2 text-xs leading-5 text-stone-600 line-clamp-3">
                          {{ form.excerpt || 'Add a concise summary to entice readers on the Discover timeline.' }}
                        </p>
                        <div class="mt-4 flex items-center gap-2">
                          <span class="inline-flex rounded-full bg-primary-600 px-4 py-2 text-xs font-bold text-white">
                            {{ form.kind === 'video' ? 'Open video' : form.accessTier === 'public' ? 'Read now' : 'Read with subscription' }} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="Boolean(deleteTarget)"
      title="Delete Discover Item"
      :message="`Are you sure you want to delete '${deleteTarget?.title}'? This removes it from the Discover feed.`"
      confirm-text="Delete"
      @confirm="executeDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  StarIcon as StarOutline,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { StarIcon as StarSolid } from '@heroicons/vue/24/solid';
import { debounce } from 'lodash-es';
import {
  createDiscoverCmsItem,
  deleteDiscoverCmsItem,
  fetchDiscoverCms,
  reorderDiscoverCmsItems,
  toggleDiscoverCmsItem,
  updateDiscoverCmsConfig,
  updateDiscoverCmsItem,
} from '~/services/cms';
import { buildArchiveSearchRequest, searchArchives } from '~/services/archives';
import { getNewsPapers, getVideos } from '~/services/newsPapers';
import {
  DEFAULT_DISCOVER_CMS_CONFIG,
  getDiscoverTopicOptions,
  type DiscoverCmsConfig,
  type DiscoverCmsItem,
  type DiscoverCmsKind,
  type DiscoverCmsStatus,
} from '~/utils/cmsContent';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

useHead({
  title: 'Discover Feed CMS | Graphic NewsPlus',
});

const { $toast } = useNuxtApp();

const items = ref<DiscoverCmsItem[]>([]);
const stats = ref({ total: 0, published: 0, draft: 0, archived: 0, pinned: 0 });
const isLoading = ref(true);
const showSettings = ref(false);
const savingConfig = ref(false);

const filters = reactive({
  q: '',
  status: 'all',
  kind: 'all',
});

const configForm = reactive<DiscoverCmsConfig>({ ...DEFAULT_DISCOVER_CMS_CONFIG });

const topicOptions = getDiscoverTopicOptions();
const kindLabels: Record<DiscoverCmsKind, string> = {
  archive: 'From the archives',
  newspaper: 'Newspaper',
  video: 'Watch',
  story: 'Top story',
};

const imagePresets = [
  { label: 'Newspapers', url: '/images/explore-newspapers.jpg' },
  { label: 'Archives', url: '/images/explore-archives.jpg' },
  { label: 'Partners', url: '/images/explore-partners.jpg' },
  { label: 'Affiliates', url: '/images/explore-affiliates.jpg' },
];

const loadItems = async () => {
  isLoading.value = true;
  try {
    const res = await fetchDiscoverCms({
      q: filters.q,
      status: filters.status,
      kind: filters.kind,
    });
    items.value = res.items;
    stats.value = res.stats;
    Object.assign(configForm, res.config);
  } catch (err) {
    $toast?.error?.('Unable to load Discover CMS items.');
  } finally {
    isLoading.value = false;
  }
};

const debouncedLoad = debounce(loadItems, 250);
watch(() => filters.q, debouncedLoad);
watch([() => filters.status, () => filters.kind], loadItems);

const saveConfig = async () => {
  savingConfig.value = true;
  try {
    const updated = await updateDiscoverCmsConfig({ ...configForm });
    Object.assign(configForm, updated);
    $toast?.success?.('Discover feed settings saved.');
  } catch (err) {
    $toast?.error?.('Failed to update Discover feed settings.');
  } finally {
    savingConfig.value = false;
  }
};

// Create / Edit Modal
const isModalOpen = ref(false);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const formError = ref('');

const form = reactive({
  kind: 'story' as DiscoverCmsKind,
  title: '',
  excerpt: '',
  body: '',
  image: '/images/explore-newspapers.jpg',
  href: '',
  source: '',
  date: new Date().toISOString().slice(0, 10),
  topics: [] as string[],
  accessTier: 'public' as 'public' | 'subscriber',
  videoUrl: '',
  linkedEntityId: '',
  pinned: false,
  status: 'published' as DiscoverCmsStatus,
  expiresAt: '',
});

const resetForm = () => {
  editingId.value = null;
  formError.value = '';
  form.kind = 'story';
  form.title = '';
  form.excerpt = '';
  form.body = '';
  form.image = '/images/explore-newspapers.jpg';
  form.href = '';
  form.source = '';
  form.date = new Date().toISOString().slice(0, 10);
  form.topics = [];
  form.accessTier = 'public';
  form.videoUrl = '';
  form.linkedEntityId = '';
  form.pinned = false;
  form.status = 'published';
  form.expiresAt = '';
};

const openCreateModal = () => {
  resetForm();
  showCataloguePicker.value = false;
  isModalOpen.value = true;
};

const openEditModal = (item: DiscoverCmsItem) => {
  resetForm();
  editingId.value = item.id;
  form.kind = item.kind;
  form.title = item.title;
  form.excerpt = item.excerpt;
  form.body = item.body;
  form.image = item.image;
  form.href = item.href;
  form.source = item.source;
  form.date = item.date?.slice(0, 10) || '';
  form.topics = [...item.topics];
  form.accessTier = item.accessTier;
  form.videoUrl = item.videoUrl;
  form.linkedEntityId = item.linkedEntityId;
  form.pinned = item.pinned;
  form.status = item.status;
  form.expiresAt = item.expiresAt ? item.expiresAt.slice(0, 10) : '';
  showCataloguePicker.value = false;
  isModalOpen.value = true;
};

const toggleTopic = (topic: string) => {
  if (form.topics.includes(topic)) {
    form.topics = form.topics.filter(t => t !== topic);
  } else {
    form.topics = [...form.topics, topic];
  }
};

const saveItem = async () => {
  formError.value = '';
  isSaving.value = true;
  try {
    const payload = {
      ...form,
      expiresAt: form.expiresAt || null,
    };
    if (editingId.value) {
      await updateDiscoverCmsItem(editingId.value, payload);
      $toast?.success?.('Discover item updated.');
    } else {
      await createDiscoverCmsItem(payload);
      $toast?.success?.('Discover item created.');
    }
    isModalOpen.value = false;
    await loadItems();
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'Could not save Discover item.';
  } finally {
    isSaving.value = false;
  }
};

const togglePublish = async (item: DiscoverCmsItem) => {
  const nextStatus: DiscoverCmsStatus = item.status === 'published' ? 'draft' : 'published';
  try {
    await toggleDiscoverCmsItem(item.id, { status: nextStatus });
    $toast?.success?.(nextStatus === 'published' ? 'Item published to Discover.' : 'Item moved to Draft.');
    await loadItems();
  } catch {
    $toast?.error?.('Unable to update publish status.');
  }
};

const togglePin = async (item: DiscoverCmsItem) => {
  try {
    await toggleDiscoverCmsItem(item.id, { pinned: !item.pinned });
    await loadItems();
  } catch {
    $toast?.error?.('Unable to update pin state.');
  }
};

const moveItem = async (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= items.value.length) return;
  const copy = [...items.value];
  const [moved] = copy.splice(index, 1);
  copy.splice(target, 0, moved!);
  items.value = copy;
  try {
    await reorderDiscoverCmsItems(copy.map(i => i.id));
    await loadItems();
  } catch {
    $toast?.error?.('Unable to reorder Discover items.');
    await loadItems();
  }
};

const deleteTarget = ref<DiscoverCmsItem | null>(null);
const confirmDelete = (item: DiscoverCmsItem) => {
  deleteTarget.value = item;
};
const executeDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  deleteTarget.value = null;
  try {
    await deleteDiscoverCmsItem(id);
    $toast?.success?.('Discover item deleted.');
    await loadItems();
  } catch {
    $toast?.error?.('Failed to delete Discover item.');
  }
};

// Catalogue Picker
interface CatalogueHit {
  id: string;
  kind: DiscoverCmsKind;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  href: string;
  image: string;
  topics: string[];
  accessTier: 'public' | 'subscriber';
  videoUrl?: string;
}

const showCataloguePicker = ref(false);
const catalogueSourceType = ref<'archive' | 'newspaper' | 'video'>('archive');
const catalogueQuery = ref('');
const catalogueLoading = ref(false);
const catalogueError = ref('');
const catalogueResults = ref<CatalogueHit[]>([]);

const searchCatalogue = async () => {
  catalogueLoading.value = true;
  catalogueError.value = '';
  catalogueResults.value = [];
  try {
    if (catalogueSourceType.value === 'archive') {
      const res = await searchArchives(buildArchiveSearchRequest({ pageNo: 1, pageSize: 8, query: catalogueQuery.value }));
      catalogueResults.value = (res.data || []).map(item => ({
        id: item.id,
        kind: 'archive',
        title: (item.snippet || item.supportingText || `${item.publicationName} page ${item.pageNumber}`).slice(0, 180),
        excerpt: (item.supportingText || item.snippet || '').slice(0, 400),
        source: item.publicationName || 'Graphic Archives',
        date: item.publicationDate?.slice(0, 10) || '',
        href: `/archives/${encodeURIComponent(item.id)}`,
        image: '/images/explore-archives.jpg',
        topics: [...(item.categories || []), ...(item.tags || [])],
        accessTier: item.isFree ? 'public' : 'subscriber',
      }));
    } else if (catalogueSourceType.value === 'newspaper') {
      const res = await getNewsPapers({ pageNo: 1, pageSize: 8, query: catalogueQuery.value });
      catalogueResults.value = (res.data || []).map(item => ({
        id: item.id,
        kind: 'newspaper',
        title: item.title || item.publicationName,
        excerpt: (item.fullDescription || '').slice(0, 400),
        source: item.publicationName || 'Daily Graphic',
        date: (item.publicationDate || item.publishedDate || '').slice(0, 10),
        href: `/newspapers/${encodeURIComponent(item.id)}`,
        image: '/images/explore-newspapers.jpg',
        topics: [...(item.categories || []), ...(item.tags || [])],
        accessTier: item.isFree ? 'public' : 'subscriber',
      }));
    } else {
      const res = await getVideos({ pageNo: 1, pageSize: 8, query: catalogueQuery.value });
      catalogueResults.value = (res.data || []).map(item => ({
        id: item.id,
        kind: 'video',
        title: item.title,
        excerpt: (item.description || '').slice(0, 400),
        source: 'Graphic NewsPlus Video',
        date: (item.createdAt || '').slice(0, 10),
        href: `/videos/${encodeURIComponent(item.id)}`,
        image: '/images/explore-partners.jpg',
        topics: Array.isArray(item.tags) ? item.tags : [],
        accessTier: 'public',
        videoUrl: item.filePath || '',
      }));
    }
    if (catalogueResults.value.length === 0) {
      catalogueError.value = 'No matching items found in the live catalogue.';
    }
  } catch {
    catalogueError.value = 'Could not reach the live catalogue service right now.';
  } finally {
    catalogueLoading.value = false;
  }
};

const applyCataloguePick = (hit: CatalogueHit) => {
  form.kind = hit.kind;
  form.title = hit.title;
  form.excerpt = hit.excerpt;
  form.source = hit.source;
  form.date = hit.date || form.date;
  form.href = hit.href;
  form.image = hit.image;
  form.accessTier = hit.accessTier;
  form.linkedEntityId = hit.id;
  if (hit.videoUrl) form.videoUrl = hit.videoUrl;
  const matchedTopics = topicOptions.filter(opt =>
    hit.topics.some(t => t.toLowerCase() === opt.toLowerCase()),
  );
  if (matchedTopics.length) form.topics = matchedTopics;
  showCataloguePicker.value = false;
};

const kindBadgeClass = (kind: DiscoverCmsKind) => {
  switch (kind) {
    case 'story':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
    case 'newspaper':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    case 'archive':
      return 'bg-amber-50 text-amber-800 ring-amber-600/20';
    case 'video':
      return 'bg-rose-50 text-rose-700 ring-rose-600/20';
  }
};

const statusBadgeClass = (status: DiscoverCmsStatus) => {
  switch (status) {
    case 'published':
      return 'bg-green-50 text-green-700';
    case 'draft':
      return 'bg-yellow-50 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-600';
  }
};

onMounted(loadItems);
</script>
