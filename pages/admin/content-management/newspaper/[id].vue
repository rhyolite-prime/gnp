<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header & Back Button -->
    <div class="mb-8">
      <NuxtLink 
        to="/admin/content-management/newspapers"
        class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeftIcon class="h-4 w-4 mr-1" aria-hidden="true" />
        Back to Newspapers
      </NuxtLink>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Newspaper Details</h1>
          <p class="mt-2 text-sm text-gray-500">View and update the publication's metadata and settings.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="saveChanges" 
            :disabled="isSaving"
            class="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="paper" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      <!-- Left Column: Thumbnail Display (Premium Glassmorphism-style Card) -->
      <div class="lg:col-span-4 sticky top-8">
        <div class="relative rounded-2xl bg-white/70 backdrop-blur-xl p-4 shadow-xl ring-1 ring-gray-900/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none"></div>
          
          <div class="aspect-[2/3] w-full rounded-xl bg-gray-100 overflow-hidden relative shadow-inner ring-1 ring-gray-200">
            <img 
              v-if="thumbnailUrl" 
              :src="thumbnailUrl" 
              alt="Newspaper Cover" 
              class="absolute inset-0 h-full w-full object-contain transition-transform duration-700 hover:scale-105"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
              <PhotoIcon class="h-16 w-16 opacity-50" />
            </div>
            
            <!-- Badges Overlay -->
            <div class="absolute top-4 left-4 flex flex-col gap-2">
               <span 
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm"
                :class="form.isPublished ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-white'"
              >
                {{ form.isPublished ? 'Published' : 'Draft' }}
              </span>
              <span 
                v-if="form.isFree"
                class="inline-flex items-center rounded-full bg-blue-500/80 text-white px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm"
              >
                Free
              </span>
            </div>
          </div>
          
          <div class="mt-4 text-center">
            <h3 class="text-lg font-bold text-gray-900 truncate px-2" :title="form.title">{{ form.title || 'Untitled' }}</h3>
            <p class="text-sm font-medium text-primary-600 mt-1">{{ form.editionNumber ? `Edition #${form.editionNumber}` : 'No Edition' }}</p>
          </div>
        </div>
        
        <!-- Stats Card -->
        <div class="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 flex justify-around">
          <div class="text-center">
            <div class="flex items-center justify-center text-gray-500 mb-1">
              <EyeIcon class="h-5 w-5 mr-1" /> <span class="text-xs uppercase tracking-wider font-semibold">Views</span>
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ paper.views || 0 }}</div>
          </div>
          <div class="w-px bg-gray-200"></div>
          <div class="text-center">
            <div class="flex items-center justify-center text-gray-500 mb-1">
              <ShoppingCartIcon class="h-5 w-5 mr-1" /> <span class="text-xs uppercase tracking-wider font-semibold">Sales</span>
            </div>
            <div class="text-2xl font-bold text-gray-900">{{ paper.sales || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Edit Form -->
      <div class="lg:col-span-8 space-y-6">

        <!-- File Upload Section -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Replace Publication File</h3>
            <p class="mt-1 text-sm text-gray-500">Upload a new PDF to replace the current publication.</p>
          </div>
          <div class="px-6 py-6">
            <div class="max-w-2xl mx-auto">
              <div 
                class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
                @click="fileInput?.click()"
              >
                <div class="text-center">
                  <DocumentIcon v-if="form.file" class="mx-auto h-12 w-12 text-primary-600" aria-hidden="true" />
                  <CloudArrowUpIcon v-else class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <span class="font-semibold text-primary-600 hover:text-primary-500">Click to upload</span>
                    <span class="pl-1">or drag and drop</span>
                  </div>
                  <p v-if="form.file" class="text-xs leading-5 text-gray-900 font-medium mt-2">{{ form.file.name }}</p>
                  <p v-else class="text-xs leading-5 text-gray-600">PDF up to 50MB</p>
                  <input ref="fileInput" type="file" class="hidden" accept=".pdf" @change="handleFileSelect" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Basic Information -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-visible">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Basic Information</h3>
            <p class="mt-1 text-sm text-gray-500">Update the core details of the newspaper.</p>
          </div>
          <div class="px-6 py-6 space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Publication</label>
                <Listbox as="div" v-model="form.publicationId" class="mt-2">
                  <div class="relative">
                    <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                      <span class="block truncate">{{ form.publicationName || 'Select a publication' }}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                      <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ListboxOption as="template" v-for="publication in publicationList" :key="publication.id" :value="publication.id" v-slot="{ active, selected }">
                          <li :class="[active ? 'bg-primary-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ publication.name }} (GHS {{ publication.price }})</span>
                            <span v-if="selected" :class="[active ? 'text-white' : 'text-primary-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

              <div>
                <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title <span class="text-red-500">*</span></label>
                <div class="mt-2">
                  <input type="text" id="title" v-model="form.title" disabled class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all" />
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="editionNumber" class="block text-sm font-medium leading-6 text-gray-900">Edition Number</label>
                <div class="mt-2">
                  <input type="text" id="editionNumber" v-model="form.editionNumber" class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all" />
                </div>
              </div>
              
              <div>
                <label for="publicationDate" class="block text-sm font-medium leading-6 text-gray-900">Publication Date</label>
                <div class="mt-2">
                  <input type="date" id="publicationDate" v-model="form.publicationDate" class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Pricing & Access -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Pricing & Access</h3>
            <p class="mt-1 text-sm text-gray-500">Configure how users can access this publication.</p>
          </div>
          <div class="px-6 py-6 space-y-6">
            
            <!-- Pricing Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium leading-6 text-gray-900">Free Publication</h4>
                <p class="text-sm text-gray-500">Allow users to read this publication without a subscription or payment.</p>
              </div>
              <Switch v-model="form.isFree" :class="[form.isFree ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2']">
                <span class="sr-only">Toggle free publication</span>
                <span :class="[form.isFree ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[form.isFree ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12"><path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </span>
                  <span :class="[form.isFree ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" /></svg>
                  </span>
                </span>
              </Switch>
            </div>

            <!-- Price Input -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2"
            >
              <div v-if="!form.isFree">
                <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price (₵)</label>
                <div class="relative mt-2 rounded-md shadow-sm">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span class="text-gray-500 sm:text-sm">₵</span>
                  </div>
                  <input type="number" step="0.01" id="price" v-model="form.price" class="block w-full rounded-md border-0 py-2 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all" placeholder="0.00" />
                </div>
              </div>
            </transition>

            <div class="h-px bg-gray-100 my-4"></div>

            <!-- Publish Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium leading-6 text-gray-900">Publish Status</h4>
                <p class="text-sm text-gray-500">Make this publication visible to users.</p>
              </div>
              <Switch v-model="form.isPublished" :class="[form.isPublished ? 'bg-green-500' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2']">
                <span class="sr-only">Toggle publish status</span>
                <span :class="[form.isPublished ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"></span>
              </Switch>
            </div>

          </div>
        </div>
        
        <!-- Featured Stories -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold leading-6 text-gray-900">Featured Stories</h3>
              <p class="mt-1 text-sm text-gray-500">Highlight up to 2 key stories.</p>
            </div>
            <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{{ form.featuredStories.length }}/2 Maximum</span>
          </div>
          <div class="px-6 py-6 space-y-6">
            <div v-for="(story, index) in form.featuredStories" :key="index" class="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
              <button @click="removeFeaturedStory(index)" type="button" class="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <XMarkIcon class="h-5 w-5" />
              </button>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div class="sm:col-span-6">
                  <label class="block text-sm font-medium leading-6 text-gray-900">Story Title</label>
                  <input type="text" v-model="story.title" class="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                </div>
                <div class="sm:col-span-6">
                  <label class="block text-sm font-medium leading-6 text-gray-900">Short Description</label>
                  <textarea v-model="story.description" rows="2" class="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
            </div>

            <button 
              v-if="form.featuredStories.length < 2"
              @click="addFeaturedStory" 
              type="button" 
              class="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-primary-500 hover:bg-gray-50 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-1.5" />
              Add Featured Story
            </button>
          </div>
        </div>

        <!-- News Headlines -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-base font-semibold leading-6 text-gray-900">News Headlines</h3>
          </div>
          <div class="px-6 py-6">
            <div class="space-y-3">
              <div v-for="(headline, index) in form.headlines" :key="index" class="flex gap-2">
                <div class="flex-grow">
                  <input 
                  type="text" 
                  v-model="headline.text"
                  placeholder="Enter headline text"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                </div>
                <button @click="removeHeadline(index)" type="button" class="text-gray-400 hover:text-red-500 p-1.5">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
              
              <button 
              @click="addHeadline" 
              type="button" 
              class="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 mt-2"
              >
              <PlusIcon class="h-4 w-4 mr-1" />
              Add Another Headline
              </button>
            </div>
          </div>
        </div>

        <!-- Tags and Categories -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Tags &amp; Categories</h3>
          </div>
          <div class="px-6 py-6 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Tags</label>
                <div v-if="form.tags.length" class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(tag, i) in form.tags" :key="i" class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20">
                    {{ tag }}
                    <button type="button" @click="removeTag(i)" class="flex-shrink-0 rounded-full p-0.5 text-primary-500 hover:text-primary-700 hover:bg-primary-100 transition-colors" :aria-label="`Remove tag ${tag}`">
                      <XMarkIcon class="h-3 w-3" />
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input type="text" v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.,="addTag" placeholder="Type and press Enter" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                  <button type="button" @click="addTag" class="flex-shrink-0 inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">
                    <PlusIcon class="h-4 w-4" />
                  </button>
                </div>
                <p class="mt-1.5 text-xs text-gray-400">Press Enter or comma to add a tag</p>
              </div>

              <!-- Categories -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Categories</label>
                <div v-if="form.categories.length" class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(cat, i) in form.categories" :key="i" class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                    {{ cat }}
                    <button type="button" @click="removeCategory(i)" class="flex-shrink-0 rounded-full p-0.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 transition-colors" :aria-label="`Remove category ${cat}`">
                      <XMarkIcon class="h-3 w-3" />
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input type="text" v-model="categoryInput" @keydown.enter.prevent="addCategory" @keydown.,="addCategory" placeholder="Type and press Enter" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                  <button type="button" @click="addCategory" class="flex-shrink-0 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                    <PlusIcon class="h-4 w-4" />
                  </button>
                </div>
                <p class="mt-1.5 text-xs text-gray-400">Press Enter or comma to add a category</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Content -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-visible">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Related Content</h3>
          </div>
          <div class="px-6 py-6">
            <VueMultiselect
              v-model="form.relatedContent"
              :options="relatedOptions"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select related publications"
              label="name"
              track-by="id"
              class="multiselect-custom"
            >
            </VueMultiselect>
          </div>
        </div>
        
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h3 class="text-lg font-medium text-gray-900">Newspaper not found</h3>
      <p class="mt-1 text-sm text-gray-500">The publication you are looking for does not exist or has been removed.</p>
      <NuxtLink to="/admin/content-management/newspapers" class="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500 font-medium">
        Return to list
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ArrowLeftIcon, PhotoIcon, EyeIcon, ShoppingCartIcon, XMarkIcon, PlusIcon, TrashIcon, ChevronUpDownIcon, CheckIcon, DocumentIcon, CloudArrowUpIcon } from '@heroicons/vue/24/outline';
import { Switch, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import { getAdminNewsPaperDetails, updateNewsPaper, getNewsPaperThumbnail, uploadFileAsset, deleteFileAsset } from '~/services/admin';
import { getPublications } from '~/services/publications';
import type { NewsPaper, Publication } from '~/models';

interface FeaturedStory {
  title: string;
  description: string;
}

interface Headline {
  text: string;
}

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const paperId = route.params.id as string;
const isLoading = ref(true);
const isSaving = ref(false);
const paper = ref<NewsPaper | null>(null);
const thumbnailUrl = ref('');

const publicationList = ref<Publication[]>([]);
const selectedPublication = ref<Publication | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Form state that tracks user edits
const form = reactive({
  id: '',
  title: '',
  fullDescription: '',
  editionNumber: '',
  publicationDate: '',
  price: '',
  isFree: false,
  isPublished: false,
  publicationId: '',
  publicationName: '',
  file: null as File | null,
  headlines: [] as Headline[],
  featuredStories: [] as FeaturedStory[],
  tags: [] as string[],
  categories: [] as string[],
  relatedContent: [] as any[]
});

watch(
  () => form.publicationId,
  (publicationId) => {
    if (!publicationId) {
      form.publicationName = '';
      selectedPublication.value = null;
      return;
    }

    const publication = publicationList.value.find(
      (p) => p.id === publicationId
    );

    if (publication) {
      form.publicationName = publication.name;
      selectedPublication.value = publication;
      form.price = publication.price?.toString() || '0';
    }
  }
);

watch(
  () => [form.publicationDate, selectedPublication.value],
  ([date, pub]) => {
    if (date && pub) {
      const publicationName = (pub as Publication).name;
      const abbreviation = publicationName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();

      const dateObj = new Date(date as string);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      form.title = `${abbreviation} ${formattedDate}`;
    }
  },
  { deep: true }
);

const relatedOptions = [
  { id: 101, name: 'Daily Graphic - Dec 14' },
  { id: 102, name: 'The Mirror - Dec 13' },
  { id: 103, name: 'Graphic Sports - Dec 12' },
  { id: 104, name: 'Junior Graphic - Dec 10' },
];

const tagInput = ref('');
const categoryInput = ref('');

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    form.file = input.files[0];
  }
};

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    if (file.type === 'application/pdf') {
      form.file = file;
    } else {
      $toast.error('Please upload a PDF file.');
    }
  }
};

const addFeaturedStory = () => {
  if (form.featuredStories.length < 2) {
    form.featuredStories.push({ title: '', description: '' });
  }
};
const removeFeaturedStory = (index: number) => {
  form.featuredStories.splice(index, 1);
};

const addHeadline = () => {
  form.headlines.push({ text: '' });
};
const removeHeadline = (index: number) => {
  form.headlines.splice(index, 1);
};

const addTag = () => {
  const val = tagInput.value.replace(/,/g, '').trim();
  if (val && !form.tags.includes(val)) {
    form.tags.push(val);
  }
  tagInput.value = '';
};
const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

const addCategory = () => {
  const val = categoryInput.value.replace(/,/g, '').trim();
  if (val && !form.categories.includes(val)) {
    form.categories.push(val);
  }
  categoryInput.value = '';
};
const removeCategory = (index: number) => {
  form.categories.splice(index, 1);
};

useHead({
  title: computed(() => paper.value ? `Edit ${paper.value.title} | Graphic News Plus` : 'Edit Newspaper')
});

onMounted(async () => {
  let result = await getPublications({pageNo: 1, pageSize: 100});
  publicationList.value = result.data;

  if (!paperId) {
    isLoading.value = false;
    return;
  }
  await fetchPaperDetails();
});

const fetchPaperDetails = async () => {
  isLoading.value = true;
  try {
    const result = await getAdminNewsPaperDetails(paperId);
    if (result) {
      paper.value = result;
      // Pre-fill form
      form.id = result.id;
      form.title = result.title || '';
      
      const descriptionText = result.fullDescription || (result as any).description || '';
      if (descriptionText) {
        form.headlines = descriptionText
          .split(';')
          .filter((h: string) => h.trim().length > 0)
          .map((h: string) => ({ text: h.trim() }));
      } else {
        form.headlines = [];
      }

      form.editionNumber = result.editionNumber || '';
      form.publicationId = result.publicationId || '';
      form.publicationName = result.publicationName || '';
      form.featuredStories = (result as any).featuredStories || [];
      form.tags = (result as any).tags || [];
      form.categories = (result as any).categories || [];
      form.relatedContent = (result as any).relatedContent || [];
      // Format date for input[type="date"]
      if (result.publicationDate) {
        form.publicationDate = result.publicationDate.split('T')[0];
      }
      form.price = result.price?.toString() || '0';
      form.isFree = result.isFree;
      form.isPublished = result.isPublished;
      

      // Load thumbnail
      if (result.id) {
        loadThumbnail(result.id);
      }
    }
  } catch (error) {
    $toast.error('Failed to load newspaper details.');
  } finally {
    isLoading.value = false;
  }
};

const loadThumbnail = async (id: string, forceReload: boolean = false) => {
  try {
    const url = await getNewsPaperThumbnail(id, forceReload);
    thumbnailUrl.value = url;
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
  }
};

const saveChanges = async () => {
  if (!form.title) {
    $toast.error('Title is required.');
    return;
  }

  isSaving.value = true;
  try {
    const { file, ...formWithoutFile } = form;

    const payload = {
      ...formWithoutFile,
      fullDescription: form.headlines.map(h => h.text.trim()).filter(Boolean).join('; '),
      description: form.headlines.map(h => h.text.trim()).filter(Boolean).join('; '),
      price: form.isFree ? 0 : parseFloat(form.price || '0')
    };

    const success = await updateNewsPaper(payload, paperId);
    
    let uploadSuccess = true;
    if (success && file) {
      try {
        
        const uploadResult = await uploadFileAsset(file, paperId);
        if (!uploadResult) {
          uploadSuccess = false;
        }
      } catch (err) {
        uploadSuccess = false;
        console.error('File upload error', err);
      }
    }

    if (success) { 
      if (uploadSuccess && file) {
        $toast.success('Newspaper details and file updated successfully!');
        // Reload thumbnail with forced cache bypass
        await loadThumbnail(paperId, true);
      } else if (success && !uploadSuccess) {
        $toast.error('Details updated, but failed to replace publication file.');
      } else {
        $toast.success('Newspaper updated successfully!');
      }

      // Update local paper state with saved data
      if (paper.value) {
        Object.assign(paper.value, payload);
      }
      form.file = null; // Clear selection
    } else {
      $toast.error('Failed to update newspaper.');
    }
  } catch (error) {
    $toast.error('An error occurred while saving.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Customizing Vue Multiselect to match Tailwind/Project theme better if needed */
:deep(.multiselect-custom .multiselect__tags) {
  @apply min-h-[42px] border-gray-300 rounded-md pt-2;
}
:deep(.multiselect-custom .multiselect__option--highlight) {
  @apply bg-primary-600;
}
:deep(.multiselect-custom .multiselect__option--highlight::after) {
  @apply bg-primary-600;
}
</style>
