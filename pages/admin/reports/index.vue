<template>
  <div class="p-6 max-w-8xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between print:hidden">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Reports</h1>
        <p class="text-gray-500 mt-1 text-sm">Generate and download detailed reports for the News Plus platform.</p>
      </div>
      <button
        v-if="selectedGroup"
        @click="selectedGroup = null; selectedReport = null"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Report Groups
      </button>
    </div>

    <!-- Main Groupings Grid -->
    <div v-if="!selectedGroup" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
      <div
        v-for="group in reportGroups"
        :key="group.id"
        @click="selectGroup(group)"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200 group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <component :is="group.icon" class="w-24 h-24" />
        </div>
        <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-200">
          <component :is="group.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ group.title }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ group.description }}</p>
        <div class="text-sm font-medium text-primary-600 flex items-center">
          View Reports
          <ArrowRight class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
        </div>
      </div>
    </div>

    <!-- Detailed Report View -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:bg-transparent">
      <div class="p-6 border-b border-gray-200 bg-gray-50/50 print:hidden">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary-100 text-primary-700 rounded-lg">
            <component :is="selectedGroup.icon" class="w-5 h-5" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">{{ selectedGroup.title }}</h2>
        </div>
        <p class="text-gray-500 text-sm">{{ selectedGroup.description }}</p>
      </div>

      <div class="p-6 print:p-0">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Configuration Sidebar -->
          <div class="lg:col-span-1 space-y-6 print:hidden">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Report Type</label>
              <select
                v-model="selectedReport"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border bg-white"
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

              <!-- Partner Dropdown -->
              <div v-if="selectedReport.parameters.includes('partner')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Select Partner</label>
                <select v-model="params.partnerId" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="" disabled>Choose a partner...</option>
                  <option v-for="partner in partnerList" :key="partner.id" :value="partner.id">
                    {{ partner.name }}
                  </option>
                </select>
              </div>

              <!-- Date Range -->
              <div v-if="selectedReport.parameters.includes('dateRange')" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.startDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.endDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
                  </div>
                </div>
              </div>

              <!-- Status Dropdown -->
              <div v-if="selectedReport.parameters.includes('status')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="params.status" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Statuses</option>
                  <option value="active">Active / Completed</option>
                  <option value="inactive">Inactive / Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <!-- Package / Plan Dropdown -->
              <div v-if="selectedReport.parameters.includes('plan')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select v-model="params.plan" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Plans</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <!-- Channel Dropdown -->
              <div v-if="selectedReport.parameters.includes('channel')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Marketing Channel</label>
                <select v-model="params.channel" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
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

            <!-- Actions -->
            <div class="mt-6 flex flex-col gap-3" v-if="selectedReport">
              <button
                @click="generateReport"
                :disabled="selectedReport.id === 'partner_invoices' && !isValidInvoice"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Activity class="w-4 h-4 mr-2" />
                Run Report
              </button>

              <button
                v-if="selectedReport.id === 'partner_invoices'"
                @click="handleDownloadPDF"
                :disabled="!invoiceGenerated"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DocumentArrowDownIcon class="w-4 h-4 mr-2 text-gray-500" />
                Download PDF
              </button>

              <button
                v-else
                @click="downloadReport"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Download class="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          <!-- Preview & Actions -->
          <div class="lg:col-span-2 flex flex-col h-full min-h-[400px]">

            <!-- Partner Invoice View -->
            <div v-if="selectedReport?.id === 'partner_invoices' && invoiceGenerated && invoiceData" class="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-none shadow-sm">
              <!-- Report Viewer Header (Hidden on Print) -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between print:hidden">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Report Generated
                  </span>
                  <span class="text-sm text-gray-500">Previewing Invoice #{{ generatedInvoiceId }}</span>
                </div>

                <div class="flex space-x-3">
                  <button @click="handlePrint" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PrinterIcon class="h-4 w-4 mr-2 text-gray-500" />
                    Print Viewer
                  </button>
                  <button @click="handleEmail" class="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <EnvelopeIcon v-if="!isSendingInvoice" class="h-4 w-4 mr-2" />
                    <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSendingInvoice ? 'Sending...' : 'Email Partner' }}
                  </button>
                </div>
              </div>

              <!-- Printable Invoice Content -->
              <div class="p-8 sm:p-12 print:p-0">
                <!-- Invoice Header -->
                <div class="flex justify-between items-start mb-12">
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                        G
                      </div>
                      <span class="text-2xl font-bold text-gray-900 tracking-tight">NewsPlus<span class="text-primary-600">.</span></span>
                    </div>
                    <p class="text-sm text-gray-500">Graphic Communications Group Ltd.</p>
                    <p class="text-sm text-gray-500">Graphic Road, Accra, Ghana</p>
                    <p class="text-sm text-gray-500">billing@graphic.com.gh</p>
                  </div>

                  <div class="text-right">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Invoice No:</span> {{ generatedInvoiceId }}</p>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Date:</span> {{ new Date().toLocaleDateString() }}</p>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Due Date:</span> {{ new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString() }}</p>
                  </div>
                </div>

                <!-- Billed To -->
                <div class="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
                    <p class="text-base font-semibold text-gray-900">{{ selectedPartnerDetails?.name || invoiceData.partnerName }}</p>
                    <p class="text-sm text-gray-500 whitespace-pre-line">{{ selectedPartnerDetails?.address || invoiceData.partnerAddress }}</p>
                    <p class="text-sm text-gray-500">{{ selectedPartnerDetails?.email || invoiceData.partnerEmail }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Period</h3>
                    <p class="text-sm font-medium text-gray-900">
                      {{ new Date(params.startDate).toLocaleDateString() }} - {{ new Date(params.endDate).toLocaleDateString() }}
                    </p>
                  </div>
                </div>

                <!-- Invoice Items -->
                <div class="mb-10 overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty / Imps</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (₵)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₵)</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(item, index) in invoiceData.items" :key="index" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ item.description }}</div>
                          <div class="text-xs text-gray-500">{{ item.details }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">{{ Number(item.quantity).toLocaleString() }}</td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">{{ formatMoney(item.unitPrice) }}</td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{{ formatMoney(item.quantity * item.unitPrice) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Totals -->
                <div class="flex justify-end">
                  <div class="w-full max-w-sm space-y-3">
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>Subtotal</span>
                      <span class="font-medium text-gray-900">GHS {{ formatMoney(invoiceData.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>VAT (15%)</span>
                      <span class="font-medium text-gray-900">GHS {{ formatMoney(invoiceData.vat) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>NHIL + GETFL (5%)</span>
                      <span class="font-medium text-gray-900">GHS {{ formatMoney(invoiceData.getflNhil) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>Discount</span>
                      <span class="font-medium text-red-600">GHS {{ formatMoney(invoiceData.discount) }}</span>
                    </div>
                    <div class="pt-3 border-t border-gray-200 flex justify-between px-4">
                      <span class="text-base font-bold text-gray-900">Total Due</span>
                      <span class="text-xl font-bold text-primary-600">GHS {{ formatMoney(invoiceData.totalDue) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Partner Invoice ECharts Overview (Hidden when printing invoice) -->
                <div v-if="invoiceData.charts?.length" class="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
                  <div v-for="chart in invoiceData.charts" :key="chart.id">
                    <h3 class="text-base font-medium text-gray-900 mb-4">{{ chart.title }}</h3>
                    <EChartCanvas :option="buildEChartOptionFromPlainData(chart)" :height="250" />
                  </div>
                </div>

                <!-- Footer Notes -->
                <div class="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-500">
                  <p class="font-medium text-gray-700 mb-1">Payment Instructions:</p>
                  <p>Please make payment to Graphic Communications Group Ltd. via Bank Transfer.</p>
                  <p>Bank: Ghana Commercial Bank (GCB)<br />Account No: 3201001382531<br />Branch: High Street</p>
                  <p class="mt-4 text-xs">If you have any questions concerning this invoice, please contact billing@graphic.com.gh.</p>
                </div>
              </div>
            </div>

            <!-- Standard Generated Report View (All Reports with Apache ECharts + Summary Metrics + Data Table) -->
            <div v-else-if="selectedReport && reportGenerated && activeReportData" class="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-none shadow-sm flex flex-col h-full">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between print:hidden">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Report Generated
                  </span>
                  <span class="text-sm text-gray-500">{{ selectedReport.name }}</span>
                </div>
                <div class="flex space-x-3">
                  <button @click="handlePrint" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <PrinterIcon class="h-4 w-4 mr-2 text-gray-500" />
                    Print
                  </button>
                </div>
              </div>

              <div class="p-6 flex-1 overflow-auto space-y-8">
                <!-- Partner Enrollment Quotas (preserved when present, e.g. Newspaper Engagement) -->
                <div v-if="activeReportData.partners?.length">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Partner Enrollment Quotas</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div v-for="partner in activeReportData.partners" :key="partner.name" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div class="text-sm font-medium text-gray-500 mb-1 truncate" :title="partner.name">{{ partner.name }}</div>
                      <div class="text-2xl font-bold text-gray-900 mb-2">
                        {{ partner.enrolled }} <span class="text-sm font-normal text-gray-500">/ {{ partner.quota }}</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-primary-600 h-2 rounded-full" :style="{ width: Math.min((partner.enrolled / partner.quota) * 100, 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Summary Metrics Grid -->
                <div v-if="activeReportData.summary?.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div v-for="metric in activeReportData.summary" :key="metric.key" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="text-sm font-medium text-gray-500 mb-1 truncate" :title="metric.label">{{ metric.label }}</div>
                    <div class="text-2xl font-bold text-gray-900">{{ formatSummaryValue(metric) }}</div>
                    <div v-if="metric.changePct !== undefined" class="mt-1 text-xs font-medium" :class="metric.changePct >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ metric.changePct > 0 ? '+' : '' }}{{ metric.changePct }}% vs prior period
                    </div>
                  </div>
                </div>

                <!-- Apache ECharts Graphs -->
                <div v-if="activeReportData.charts?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div
                    v-for="chart in activeReportData.charts"
                    :key="chart.id"
                    :class="chart.span === 'full' || activeReportData.charts.length === 1 ? 'lg:col-span-2' : 'lg:col-span-1'"
                  >
                    <h3 class="text-base font-medium text-gray-900 mb-4">{{ chart.title }}</h3>
                    <EChartCanvas :option="buildEChartOptionFromPlainData(chart)" :height="265" />
                  </div>
                </div>

                <!-- Report Data Table -->
                <div v-if="activeReportData.columns?.length">
                  <h3 class="text-base font-medium text-gray-900 mb-4">Report Breakdown</h3>
                  <div class="overflow-x-auto rounded-lg border border-gray-200">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            v-for="col in activeReportData.columns"
                            :key="col.key"
                            scope="col"
                            class="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            :class="col.align === 'right' ? 'text-right' : 'text-left'"
                          >
                            {{ col.label }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(row, rIdx) in activeReportData.rows" :key="rIdx" class="hover:bg-gray-50 transition-colors">
                          <td
                            v-for="col in activeReportData.columns"
                            :key="col.key"
                            class="px-4 py-3.5 whitespace-nowrap text-sm"
                            :class="col.align === 'right' ? 'text-right' : 'text-left'"
                          >
                            <span
                              v-if="col.format === 'badge'"
                              class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full"
                              :class="statusBadgeClass(row[col.key])"
                            >
                              {{ row[col.key] }}
                            </span>
                            <span v-else class="text-gray-700" :class="{ 'font-medium text-gray-900': col.format === 'currency' }">
                              {{ formatTableCell(row[col.key], col.format) }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Generic Empty / Ready State -->
            <div v-else class="flex-1 bg-gray-50 rounded-lg border border-gray-200 border-dashed flex flex-col items-center justify-center text-center p-8 print:hidden">
              <template v-if="!selectedReport">
                <FileBarChart2 class="w-16 h-16 text-gray-300 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-1">No Report Selected</h3>
                <p class="text-gray-500 max-w-sm text-sm">Select a report type from the sidebar to configure its parameters and generate the data.</p>
              </template>
              <template v-else>
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                  <component :is="selectedGroup.icon" class="w-8 h-8" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ selectedReport.name }} Ready</h3>
                <p class="text-gray-500 max-w-md text-sm mb-6">
                  {{ selectedReport.description }}<br />
                  Click "Run Report" to process the data based on your selected parameters.
                </p>
              </template>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Download,
  Calendar,
  FileBarChart2,
  DollarSign,
  Users,
  BookOpen,
  Briefcase,
  Megaphone,
  ShieldCheck,
  Library,
  Gamepad2,
} from 'lucide-vue-next';
import {
  PrinterIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import { MOCK_REPORT_GROUPS, MOCK_PARTNERS_LIST } from '~/mocks/reports';
import { buildEChartOptionFromPlainData } from '~/utils/reportChartOption';

const { $toast } = useNuxtApp();

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

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

const groupIconMap: Record<string, any> = {
  financial: DollarSign,
  users: Users,
  content: BookOpen,
  partners: Briefcase,
  marketing: Megaphone,
  archives: Library,
  games: Gamepad2,
  admin: ShieldCheck,
};

const reportGroups: ReportGroup[] = MOCK_REPORT_GROUPS.map((g: any) => ({
  ...g,
  icon: groupIconMap[g.id] || FileBarChart2,
}));

const params = reactive({
  startDate: '2026-09-23',
  endDate: '2026-10-22',
  status: 'all',
  plan: 'all',
  channel: 'all',
  partnerId: 'p-mtn-001',
});

const selectedGroup = ref<ReportGroup | null>(null);
const selectedReport = ref<ReportParameter | null>(null);
const invoiceGenerated = ref(false);
const generatedInvoiceId = ref('');
const invoiceData = ref<any>(null);
const reportGenerated = ref(false);
const activeReportData = ref<any>(null);
const isSendingInvoice = ref(false);

const partnerList = ref<any[]>([...MOCK_PARTNERS_LIST]);

const getAllPartners = async () => {
  try {
    const result = await getCommercialPartners({ pageNo: 1, pageSize: 100 });
    if (result?.data?.length) {
      partnerList.value = result.data;
    }
  } catch {
    partnerList.value = [...MOCK_PARTNERS_LIST];
  }
};

const selectGroup = (group: ReportGroup) => {
  selectedGroup.value = group;
  selectedReport.value = null;
  resetParams();
};

watch(selectedReport, () => {
  invoiceGenerated.value = false;
  reportGenerated.value = false;
  activeReportData.value = null;
});

const resetParams = () => {
  params.startDate = '2026-09-23';
  params.endDate = '2026-10-22';
  params.status = 'all';
  params.plan = 'all';
  params.channel = 'all';
  params.partnerId = partnerList.value[0]?.id || 'p-mtn-001';
  invoiceGenerated.value = false;
  reportGenerated.value = false;
  activeReportData.value = null;
};

const isValidInvoice = computed(() => {
  return (
    params.partnerId !== '' &&
    params.startDate !== '' &&
    params.endDate !== '' &&
    params.startDate <= params.endDate
  );
});

const selectedPartnerDetails = computed(() => {
  return partnerList.value.find((p) => p.id === params.partnerId);
});

const reportHandlers: Record<string, (p: typeof params) => Promise<any>> = {
  // 1. Revenue & Financial
  sales_revenue: (p) => generateSalesReport({ startDate: p.startDate, endDate: p.endDate, plan: p.plan !== 'all' ? p.plan : undefined }),
  payment_transactions: (p) => generatePaymentTransactionsReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),
  partner_invoices: (p) => generatePartnerInvoice({ partnerId: p.partnerId, startDate: p.startDate, endDate: p.endDate }),
  subscription_renewals: (p) => generateSubscriptionRenewalsReport({ startDate: p.startDate, endDate: p.endDate }),
  single_copy_paywall_funnel: (p) => generateSingleCopyFunnelReport({ startDate: p.startDate, endDate: p.endDate }),

  // 2. User & Subscriber
  subscriber_demographics: (p) => generateSubscriberDemographicsReport({ status: p.status !== 'all' ? p.status : undefined, startDate: p.startDate, endDate: p.endDate }),
  plan_distribution: (p) => generatePlanDistributionReport({ plan: p.plan !== 'all' ? p.plan : undefined }),
  subscriber_retention_cohorts: (p) => generateSubscriberRetentionReport({ startDate: p.startDate, endDate: p.endDate, plan: p.plan !== 'all' ? p.plan : undefined }),

  // 3. Content & Newspaper
  newspaper_engagement: (p) => generateNewspaperEngagementReport({ startDate: p.startDate, endDate: p.endDate }),
  content_inventory: (p) => generateContentInventoryReport({ status: p.status !== 'all' ? p.status : undefined }),
  ingestion_jobs: (p) => generateIngestionJobLogsReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),
  multimedia_originals_performance: (p) => generateMultimediaOriginalsReport({ startDate: p.startDate, endDate: p.endDate }),

  // 4. Commercial Partner (B2B)
  partner_engagement: (p) => generatePartnerEngagementReport({ startDate: p.startDate, endDate: p.endDate }),
  partner_quota: () => generatePartnerQuotaReport(),
  partner_api_usage: (p) => generatePartnerApiUsageReport({ startDate: p.startDate, endDate: p.endDate }),

  // 5. Marketing & Campaigns
  campaign_performance: (p) => generateCampaignPerformanceReport({ startDate: p.startDate, endDate: p.endDate, channel: p.channel !== 'all' ? p.channel : undefined }),
  coupon_usage: (p) => generateCouponUsageReport({ status: p.status !== 'all' ? p.status : undefined, startDate: p.startDate, endDate: p.endDate }),
  affiliate_performance: (p) => generateAffiliatePerformanceReport({ startDate: p.startDate, endDate: p.endDate }),
  affiliate_payout_reconciliation: (p) => generateAffiliatePayoutReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),
  push_notification_analytics: (p) => generatePushNotificationReport({ startDate: p.startDate, endDate: p.endDate }),

  // 6. Historical Archives & AI RAG
  archive_rag_intelligence: (p) => generateArchiveRagReport({ startDate: p.startDate, endDate: p.endDate }),
  institutional_archive_credits: (p) => generateInstitutionalArchiveCreditsReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),

  // 7. Interactive Games & Puzzles
  games_engagement_retention: (p) => generateGamesEngagementReport({ startDate: p.startDate, endDate: p.endDate }),

  // 8. Admin & Security Audits
  admin_roles: () => generateAdminRolesReport(),
  api_key_audit: (p) => generateApiKeyAuditReport({ status: p.status !== 'all' ? p.status : undefined }),
  security_audit_logs: (p) => generateSecurityAuditLogsReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),
  support_tickets_sla: (p) => generateSupportTicketsSlaReport({ startDate: p.startDate, endDate: p.endDate, status: p.status !== 'all' ? p.status : undefined }),
};

const generateReport = async () => {
  if (!selectedReport.value) return;

  const reportId = selectedReport.value.id;
  const handler = reportHandlers[reportId] || ((p: typeof params) => runReportById(reportId, p));

  if (reportId === 'partner_invoices' && !isValidInvoice.value) {
    $toast?.error?.('Please fill out all invoice parameters correctly (Partner, Start Date, End Date).');
    return;
  }

  try {
    const data = await handler(params);
    if (reportId === 'partner_invoices') {
      invoiceData.value = data;
      generatedInvoiceId.value = data?.invoiceNo;
      invoiceGenerated.value = true;
    } else {
      activeReportData.value = data;
      reportGenerated.value = true;
    }
  } catch (error) {
    console.error('Error generating report:', error);
    $toast?.error?.('An error occurred while running report.');
  }
};

function formatMoney(val: number): string {
  return Number(val || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatSummaryValue(metric: any): string {
  const v = Number(metric.value || 0);
  if (metric.format === 'currency') return `GHS ${formatMoney(v)}`;
  if (metric.format === 'percent') return `${v.toFixed(1)}%`;
  return v.toLocaleString('en-GH');
}

function formatTableCell(val: any, format?: string): string {
  if (val === null || val === undefined || val === '') return '—';
  if (format === 'currency') return `GHS ${formatMoney(Number(val))}`;
  if (format === 'number') return Number(val).toLocaleString('en-GH');
  if (format === 'percent') return `${Number(val).toFixed(1)}%`;
  return String(val);
}

function statusBadgeClass(value: any): string {
  const s = String(value || '').toLowerCase();
  if (['active', 'settled', 'published', 'paid'].some((w) => s.includes(w))) {
    return 'bg-green-100 text-green-800';
  }
  if (['pending', 'scheduled'].some((w) => s.includes(w))) {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (['failed', 'inactive', 'expired', 'revoked'].some((w) => s.includes(w))) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
}

const downloadReport = async () => {
  if (!selectedReport.value) return;
  if (!activeReportData.value) {
    await generateReport();
  }
  const cols = activeReportData.value?.columns || [];
  const rows = activeReportData.value?.rows || [];
  if (!cols.length) return;

  const header = cols.map((c: any) => `"${c.label}"`).join(',');
  const lines = rows.map((r: any) =>
    cols.map((c: any) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedReport.value.id}-${params.startDate || 'report'}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  $toast?.success?.(`Exported ${selectedReport.value.name} as CSV.`);
};

const handlePrint = () => {
  window.print();
};

const handleDownloadPDF = async () => {
  if (!invoiceData.value) return;
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`INVOICE #${generatedInvoiceId.value}`, 14, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Billed To: ${selectedPartnerDetails.value?.name || invoiceData.value.partnerName}`, 14, 29);
  doc.text(`Billing Period: ${params.startDate} to ${params.endDate}`, 14, 35);

  let y = 48;
  for (const item of invoiceData.value.items || []) {
    doc.text(`${item.description} (${item.quantity} x GHS ${formatMoney(item.unitPrice)})`, 14, y);
    doc.text(`GHS ${formatMoney(item.quantity * item.unitPrice)}`, 160, y);
    y += 8;
  }
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Due: GHS ${formatMoney(invoiceData.value.totalDue)}`, 14, y);
  doc.save(`${generatedInvoiceId.value}.pdf`);
  $toast?.success?.('PDF downloaded');
};

const handleEmail = async () => {
  isSendingInvoice.value = true;
  try {
    const payload = {
      partnerId: params.partnerId,
      startDate: params.startDate,
      endDate: params.endDate,
    };
    const success = await sendPartnerInvoiceAsEmail(payload);
    if (success) {
      $toast?.success?.('Invoice sent to partner via email.');
    }
  } catch {
    $toast?.error?.('Failed to send partner invoice via email.');
  } finally {
    isSendingInvoice.value = false;
  }
};

onMounted(async () => {
  await getAllPartners();
});
</script>

<style scoped>
/* Print-specific styles to ensure the invoice looks good when printed */
@media print {
  body {
    background-color: white !important;
  }
  .print\:hidden {
    display: none !important;
  }
  .print\:shadow-none {
    box-shadow: none !important;
  }
  .print\:border-none {
    border: none !important;
  }
  .print\:p-0 {
    padding: 0 !important;
  }
  .print\:bg-transparent {
    background-color: transparent !important;
  }
}
</style>
