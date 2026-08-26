<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Support Tickets</h1>
        <p class="mt-2 text-sm text-gray-700">Manage and respond to user support tickets.</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
      <div class="w-full sm:max-w-xs">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            v-model="filters.query"
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search tickets..."
          />
        </div>
      </div>
       
      <div class="flex gap-4">
        <select v-model="filters.status" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        
        <select v-model="filters.priority" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>

    <!-- Tickets List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Created</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">

          <tr v-if="isShimmerLoading" class="animate-pulse">
            <td colspan="7" class="px-3 py-10 text-center text-sm text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
            </td>
          </tr>

          <tr v-else-if="ticketList.length === 0">
            <td colspan="7" class="px-3 py-10 text-center text-gray-500">
                <p class="text-sm">No support tickets found.</p>
            </td>
          </tr>

          <tr v-else v-for="ticket in ticketList" :key="ticket.id" class="hover:bg-gray-50 transition-colors">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{{ ticket.id.substring(0, 6) }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{{ ticket.subject }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ ticket.userEmail }}</td>
              
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-red-50 text-red-700 ring-red-600/20': ticket.priority === 'High',
                      'bg-yellow-50 text-yellow-700 ring-yellow-600/20': ticket.priority === 'Medium',
                      'bg-green-50 text-green-700 ring-green-600/20': ticket.priority === 'Low'
                    }">
                    {{ ticket.priority }}
                  </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-green-50 text-green-700 ring-green-600/20': ticket.status === 'Open',
                      'bg-blue-50 text-blue-700 ring-blue-600/20': ticket.status === 'In Progress',
                      'bg-gray-50 text-gray-700 ring-gray-600/20': ticket.status === 'Resolved' || ticket.status === 'Closed'
                    }">
                    {{ ticket.status }}
                  </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ longDateAndTimeFormat(ticket.createdAt) }}</td>
              
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="relative dropdown-container flex justify-end">
                    <button 
                        @click.stop="toggleDropdown(ticket.id)" 
                        class="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <EllipsisVerticalIcon class="h-5 w-5" />
                    </button>

                    <!-- Dropdown Menu -->
                    <div 
                        v-if="activeDropdownId === ticket.id" 
                        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                    >
                        <div class="py-1">
                            <button 
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                @click.prevent="viewTicket(ticket)">
                                View Details
                            </button>
                            <button v-if="ticket.status !== 'Closed'"
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                @click.prevent="updateTicketStatus(ticket.id, 'Closed')">
                                Close Ticket
                            </button>
                        </div>
                    </div>
                </div>
              </td>
          </tr>

        </tbody>
      </table>

      <client-only>
        <SimplePagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo " 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es"

const { $toast } = useNuxtApp()

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Support Tickets | Graphic News Plus'
})

const router = useRouter()
const route = useRoute()

// Mock Type for now since it's not in models
interface SupportTicket {
    id: string;
    subject: string;
    userEmail: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    createdAt: string;
}

const filters = reactive({
  query: '',
  status: 'all',
  priority: 'all',
  pageNo: 1,
  pageSize: 30,
})

const paginationParams = reactive({
  totalPages: 1,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
})

const ticketList = ref<SupportTicket[]>([])
const isShimmerLoading = ref(true)
const activeDropdownId = ref<string | null>(null)

const onPageChange = async (pageNumber: number) => {
	filters.pageNo = pageNumber
	const filteredQuery = filterQueryParams({ ...route.query, ...filters })
	router.replace({ name: route.name ?? '', query: filteredQuery })
  await getPaginatedTickets()
}

const closeDropdown = () => {
  activeDropdownId.value = null
}

const toggleDropdown = (id: string) => {
  if (activeDropdownId.value === id) {
      activeDropdownId.value = null
  } else {
      activeDropdownId.value = id
  }
}

const viewTicket = (ticket: SupportTicket) => {
    // Navigate to ticket detail or open modal
    // router.push(`/admin/support-tickets/${ticket.id}`)
    $toast.info('View details functionality coming soon')
    closeDropdown()
}

const updateTicketStatus = (ticketId: string, status: string) => {
    // Mock API call to update status
    $toast.success(`Ticket status updated to ${status}`)
    closeDropdown()
    getPaginatedTickets() // refresh
}

const getPaginatedTickets = async () => {
    isShimmerLoading.value = true
    closeDropdown()
    
    try {
        // Mock data fetching
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock Response
        const mockData: SupportTicket[] = [
            {
                id: 'tkt-1a2b3c',
                subject: 'Cannot access premium content',
                userEmail: 'user@example.com',
                priority: 'High',
                status: 'Open',
                createdAt: new Date().toISOString()
            },
            {
                id: 'tkt-4d5e6f',
                subject: 'Billing issue on last invoice',
                userEmail: 'partner@company.com',
                priority: 'Medium',
                status: 'In Progress',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'tkt-7g8h9i',
                subject: 'App crashes on launch',
                userEmail: 'mobile.user@test.com',
                priority: 'High',
                status: 'Closed',
                createdAt: new Date(Date.now() - 172800000).toISOString()
            }
        ]

        let filteredData = [...mockData]

        if (filters.query) {
            filteredData = filteredData.filter(t => 
                t.subject.toLowerCase().includes(filters.query.toLowerCase()) || 
                t.userEmail.toLowerCase().includes(filters.query.toLowerCase())
            )
        }

        if (filters.status !== 'all') {
            const statusMap: Record<string, string> = {
                'open': 'Open',
                'in_progress': 'In Progress',
                'resolved': 'Resolved',
                'closed': 'Closed'
            }
            filteredData = filteredData.filter(t => t.status === statusMap[filters.status])
        }

        if (filters.priority !== 'all') {
            const priorityMap: Record<string, string> = {
                'high': 'High',
                'medium': 'Medium',
                'low': 'Low'
            }
            filteredData = filteredData.filter(t => t.priority === priorityMap[filters.priority])
        }

        ticketList.value = filteredData
        paginationParams.totalCount = filteredData.length
        paginationParams.totalPages = 1
        paginationParams.lowerBound = 1
        paginationParams.upperBound = filteredData.length

    } catch (error) {
        $toast.error('Unable to fetch support tickets!')
    } finally {
        isShimmerLoading.value = false
    }
}

const debouncedSearch = debounce(() => {
    filters.pageNo = 1 // Reset to first page for new search
    getPaginatedTickets()
}, 300) // 300ms delay

watch(() => filters.query, debouncedSearch)
watch(() => filters.status, () => { filters.pageNo = 1; getPaginatedTickets() })
watch(() => filters.priority, () => { filters.pageNo = 1; getPaginatedTickets() })

onMounted(async () => {
  if (!isEmpty(route.query)) {
    if (route.query.pageNo) filters.pageNo = parseInt(route.query.pageNo as string)
    if (route.query.query) filters.query = route.query.query as string
    if (route.query.status) filters.status = route.query.status as string
    if (route.query.priority) filters.priority = route.query.priority as string
  }
  
  // Click outside to close dropdown
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
        closeDropdown();
    }
  });
  
  await getPaginatedTickets()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
