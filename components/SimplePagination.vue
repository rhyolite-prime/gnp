<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
      <div class="flex flex-1 justify-between sm:hidden">
        <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
        <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium"> {{ lowerBound }}</span>
            to
            <span class="font-medium">{{ upperBound }}</span>
            of
            <span class="font-medium">{{ totalCount }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous Button -->
          <a 
            href="#"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            @click.prevent="onPageChanged(selectedPage - 1)"
            :class="{ 'pointer-events-none opacity-50': selectedPage === 1 }">
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </a>

          <!-- Page Numbers -->
          <a
            v-for="page in pageList"
            :key="page"
            href="#"
            @click.prevent="onPageChanged(page)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="page === selectedPage ? 'bg-primary-600 text-white' : 'text-gray-900'">
            {{ page }}
          </a>

          <!-- Next Button -->
          <a
            href="#"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            @click.prevent="onPageChanged(selectedPage + 1)"
            :class="{ 'pointer-events-none opacity-50': selectedPage === totalPages }"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </a>
        </nav>

        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>

  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'


const props = defineProps({
  pageNo: {
      type: Number,
      required: true,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
  lowerBound: {
    type: Number,
    required: true
  },
  upperBound: {
    type: Number,
    required: true
  },
    disabled: {
      type: Boolean
    }
})

const emit = defineEmits(['onPageChanged'])

const { pageNo, totalPages, totalCount } = toRefs(props)

const selectedPage = ref(pageNo.value ?? 1)

const pageList = computed(() => {


      let counter = 1;
      let initPage = 1;
      const currentPage = pageNo.value;
      const pages = totalPages.value;

      if (currentPage > 9 && pages > 10) {
        initPage = currentPage - 5;
      }

      const pageNumbers = [];

      for (let i = initPage; i <= pages; i++) {
        pageNumbers.push(i);
        counter++;
        if (counter > 10) {
          break;
        }
      }

  return pageNumbers;
      
});

const onPageChanged = (currrentPage: number) => {

  selectedPage.value = currrentPage;
  emit("onPageChanged", selectedPage.value);
}


</script>

