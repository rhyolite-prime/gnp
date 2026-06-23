<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Reports</h1>
        <p class="text-gray-500 mt-1 text-sm">Generate and download detailed reports for the News Plus platform.</p>
      </div>
      <button 
        v-if="selectedGroup" 
        @click="selectedGroup = null; selectedReport = null"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Report Groups
      </button>
    </div>

    <!-- Main Groupings Grid -->
    <div v-if="!selectedGroup" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="group in reportGroups" 
        :key="group.id"
        @click="selectGroup(group)"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <component :is="group.icon" class="w-24 h-24" />
        </div>
        <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-200">
          <component :is="group.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ group.title }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ group.description }}</p>
        <div class="text-sm font-medium text-blue-600 flex items-center">
          View Reports
          <ArrowRight class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
        </div>
      </div>
    </div>

    <!-- Detailed Report View -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200 bg-gray-50/50">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <component :is="selectedGroup.icon" class="w-5 h-5" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">{{ selectedGroup.title }}</h2>
        </div>
        <p class="text-gray-500 text-sm">{{ selectedGroup.description }}</p>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Configuration Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Report Type</label>
              <select 
                v-model="selectedReport" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option :value="null" disabled>Choose a report...</option>
                <option v-for="report in selectedGroup.reports" :key="report.id" :value="report">
                  {{ report.name }}
                </option>
              </select>
            </div>

            <!-- Dynamic Parameters -->
            <div v-if="selectedReport" class="space-y-4 pt-4 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Report Parameters</h3>
              
              <!-- Date Range -->
              <div v-if="selectedReport.parameters.includes('dateRange')" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.startDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.endDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                  </div>
                </div>
              </div>

              <!-- Status Dropdown -->
              <div v-if="selectedReport.parameters.includes('status')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="params.status" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Statuses</option>
                  <option value="active">Active / Completed</option>
                  <option value="inactive">Inactive / Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <!-- Package / Plan Dropdown -->
              <div v-if="selectedReport.parameters.includes('plan')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select v-model="params.plan" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Plans</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <!-- Channel Dropdown -->
              <div v-if="selectedReport.parameters.includes('channel')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Marketing Channel</label>
                <select v-model="params.channel" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Channels</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              
            </div>
            
            <div v-else class="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-100">
              Please select a report type to view available parameters.
            </div>
          </div>

          <!-- Preview & Actions -->
          <div class="lg:col-span-2 flex flex-col h-full min-h-[400px]">
            <div class="flex-1 bg-gray-50 rounded-lg border border-gray-200 border-dashed flex flex-col items-center justify-center text-center p-8">
              <template v-if="!selectedReport">
                <FileBarChart2 class="w-16 h-16 text-gray-300 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-1">No Report Selected</h3>
                <p class="text-gray-500 max-w-sm text-sm">Select a report type from the sidebar to configure its parameters and generate the data.</p>
              </template>
              <template v-else>
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <component :is="selectedGroup.icon" class="w-8 h-8" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ selectedReport.name }} Ready</h3>
                <p class="text-gray-500 max-w-md text-sm mb-6">
                  {{ selectedReport.description }}<br/>
                  Click the button below to process the data based on your selected parameters.
                </p>
                
                <div class="flex gap-4">
                  <button @click="generateReport" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Activity class="w-4 h-4 mr-2" />
                    Run Report
                  </button>
                  <button @click="downloadReport" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Download class="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </template>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin'
})

import { ref, reactive } from 'vue'
import { 
  ArrowLeft, ArrowRight, Activity, Download, Calendar, 
  FileBarChart2, DollarSign, Users, BookOpen, Briefcase, 
  Megaphone, ShieldCheck 
} from 'lucide-vue-next'

// Mock notification function
const notify = (msg: string) => alert(msg);

const params = reactive({
  startDate: '',
  endDate: '',
  status: 'all',
  plan: 'all',
  channel: 'all'
})

interface ReportParameter {
  id: string;
  name: string;
  description: string;
  parameters: string[];
}

interface ReportGroup {
  id: string;
  title: string;
  description: string;
  icon: any;
  reports: ReportParameter[];
}

const reportGroups: ReportGroup[] = [
  {
    id: 'financial',
    title: 'Revenue & Financial',
    description: 'Track sales, subscriptions, invoices, and overall platform revenue.',
    icon: DollarSign,
    reports: [
      { id: 'sales_revenue', name: 'Sales & Revenue Overview', description: 'Breakdown of total revenue generated over time.', parameters: ['dateRange', 'plan'] },
      { id: 'payment_transactions', name: 'Payment Transactions Log', description: 'Detailed log of all payments grouped by status.', parameters: ['dateRange', 'status'] },
      { id: 'partner_invoices', name: 'Partner Invoices', description: 'B2B/Commercial Partner financials and outstanding balances.', parameters: ['dateRange', 'status'] },
      { id: 'subscription_renewals', name: 'Subscription Renewals & Churn', description: 'Analysis of active subscriptions and churn rates.', parameters: ['dateRange'] }
    ]
  },
  {
    id: 'users',
    title: 'User & Subscriber',
    description: 'Analyze user demographics, account statuses, and plan distributions.',
    icon: Users,
    reports: [
      { id: 'subscriber_demographics', name: 'Subscriber Demographics & Status', description: 'Summary of all registered users and their account states.', parameters: ['status', 'dateRange'] },
      { id: 'plan_distribution', name: 'Subscription Plan Distribution', description: 'Number of subscribers per plan type.', parameters: ['plan'] }
    ]
  },
  {
    id: 'content',
    title: 'Content & Newspaper',
    description: 'Monitor publication engagement, sales, and catalog inventory.',
    icon: BookOpen,
    reports: [
      { id: 'newspaper_engagement', name: 'Newspaper Engagement & Sales', description: 'Metrics on individual publications views and sales.', parameters: ['dateRange'] },
      { id: 'content_inventory', name: 'Content Inventory Status', description: 'Overview of the newspaper catalog (Archived, Published, etc).', parameters: ['status'] },
      { id: 'ingestion_jobs', name: 'Ingestion Job Logs', description: 'Track the status of daily newspaper uploads.', parameters: ['dateRange', 'status'] }
    ]
  },
  {
    id: 'partners',
    title: 'Commercial Partner (B2B)',
    description: 'Insights into partner engagement, API usage, and member quotas.',
    icon: Briefcase,
    reports: [
      { id: 'partner_engagement', name: 'Partner Sub-account Engagement', description: 'Granular insights into reads and active sessions per partner.', parameters: ['dateRange'] },
      { id: 'partner_quota', name: 'Partner Quota & Usage', description: 'Tracking of assigned quotas vs remaining allocations.', parameters: [] },
      { id: 'partner_api_usage', name: 'Partner API Usage Stats', description: 'Metrics on API requests, latency, and success rates.', parameters: ['dateRange'] }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & Campaigns',
    description: 'Evaluate campaign performance and coupon redemptions.',
    icon: Megaphone,
    reports: [
      { id: 'campaign_performance', name: 'Campaign Performance', description: 'Track reach, clicks, and engagement across marketing channels.', parameters: ['dateRange', 'channel'] },
      { id: 'coupon_usage', name: 'Coupon Usage & Effectiveness', description: 'Track issued coupons and redemption rates.', parameters: ['status', 'dateRange'] }
    ]
  },
  {
    id: 'admin',
    title: 'Admin & Security Audits',
    description: 'Review admin roles, permissions, and partner API key accesses.',
    icon: ShieldCheck,
    reports: [
      { id: 'admin_roles', name: 'Admin Roles & Access', description: 'Audit of current admin users and their assigned permissions.', parameters: [] },
      { id: 'api_key_audit', name: 'Partner API Key Audit', description: 'List of active, expired, and recently used API keys.', parameters: ['status'] }
    ]
  }
]

const selectedGroup = ref<ReportGroup | null>(null)
const selectedReport = ref<ReportParameter | null>(null)

const selectGroup = (group: ReportGroup) => {
  selectedGroup.value = group
  selectedReport.value = null
  
  // Reset params
  params.startDate = ''
  params.endDate = ''
  params.status = 'all'
  params.plan = 'all'
  params.channel = 'all'
}

const generateReport = () => {
  if (!selectedReport.value) return
  console.log('Generating report:', selectedReport.value.id, 'with params:', params)
  notify(`Running ${selectedReport.value.name}...`)
}

const downloadReport = () => {
  if (!selectedReport.value) return
  console.log('Downloading report:', selectedReport.value.id, 'with params:', params)
  notify(`Exporting ${selectedReport.value.name} as CSV...`)
}
</script>

<style scoped>
/* Optional: Custom scrollbar or specific animations can go here */
</style>