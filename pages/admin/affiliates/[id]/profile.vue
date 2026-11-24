<template>
  <div class="mx-auto max-w-[1600px]">
    <!-- Back navigation -->
    <NuxtLink
      to="/admin/affiliates"
      class="mb-4 inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-700"
    >
      <ArrowLeftIcon class="mr-2 h-4 w-4" aria-hidden="true" />
      Back to Affiliates
    </NuxtLink>

    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-6" aria-busy="true" aria-live="polite">
      <div class="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 rounded-full bg-gray-200"></div>
          <div class="flex-1 space-y-3">
            <div class="h-5 w-1/3 rounded bg-gray-200"></div>
            <div class="h-4 w-1/2 rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="h-4 w-1/2 rounded bg-gray-100"></div>
          <div class="mt-4 h-7 w-2/3 rounded bg-gray-200"></div>
        </div>
      </div>
      <p class="text-sm text-gray-500">Loading affiliate profile…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
      <ExclamationTriangleIcon class="mx-auto h-10 w-10 text-red-500" aria-hidden="true" />
      <h1 class="mt-3 text-lg font-semibold text-red-800">Unable to load this affiliate</h1>
      <p class="mt-1 text-sm text-red-700">{{ loadError }}</p>
      <button
        type="button"
        class="mt-5 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        @click="loadAffiliate"
      >
        <ArrowPathIcon class="mr-2 h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    </div>

    <!-- Not found state -->
    <div v-else-if="!affiliate" class="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
      <UserCircleIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
      <h1 class="mt-3 text-lg font-semibold text-gray-900">Affiliate not found</h1>
      <p class="mt-1 text-sm text-gray-500">No affiliate matches the ID <span class="font-mono">{{ affiliateId }}</span>.</p>
      <NuxtLink
        to="/admin/affiliates"
        class="mt-5 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
      >
        Back to Affiliates
      </NuxtLink>
    </div>

    <!-- Profile -->
    <template v-else>
      <!-- Header -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xl font-bold text-primary-700 ring-1 ring-inset ring-primary-100" aria-hidden="true">
              {{ initials }}
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="truncate text-2xl font-bold text-gray-900">{{ fullName }}</h1>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="statusBadgeClass"
                >
                  {{ statusLabel }}
                </span>
              </div>
              <p class="mt-1 truncate text-sm text-gray-500">{{ affiliate.email }}</p>
              <p class="mt-0.5 text-xs text-gray-500">
                Joined {{ affiliate.dateJoined || '—' }}
                <span class="mx-1.5 text-gray-300" aria-hidden="true">•</span>
                ID <span class="font-mono">{{ affiliate.affiliateId || affiliate.id }}</span>
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <NuxtLink
              :to="`/admin/affiliates/${affiliate.id}`"
              class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <ChartBarIcon class="mr-2 h-4 w-4 text-gray-400" aria-hidden="true" />
              View Earnings
            </NuxtLink>
          </div>
        </div>

        <!-- Contact / account details -->
        <dl class="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">First Name</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{{ affiliate.firstName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Last Name</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{{ affiliate.lastName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Email</dt>
            <dd class="mt-1 truncate text-sm font-semibold text-gray-900">
              <a v-if="affiliate.email" :href="`mailto:${affiliate.email}`" class="text-primary-600 hover:text-primary-700">{{ affiliate.email }}</a>
              <span v-else>—</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Phone Number</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">
              <a v-if="affiliate.phoneNo" :href="`tel:${affiliate.phoneNo}`" class="text-primary-600 hover:text-primary-700">{{ affiliate.phoneNo }}</a>
              <span v-else>—</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Total Earnings</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">₵{{ formatMoney(affiliate.totalEarnings) }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Wallet Balance</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">₵{{ formatMoney(affiliate.walletBalance) }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Date Joined</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{{ affiliate.dateJoined || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-gray-500">Account Status</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{{ statusLabel }}</dd>
          </div>
        </dl>
      </div>

      <!-- Member-portal notice -->
      <div class="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <InformationCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-blue-500" aria-hidden="true" />
        <p class="text-sm text-blue-800">
          The tabs below mirror what this affiliate sees in their member portal
          (<span class="font-medium">Dashboard, Commissions, Payouts, Stats and Links</span>).
          Figures are sample portal data until the affiliate reporting endpoints are connected.
        </p>
      </div>

      <!-- Portal tabs -->
      <TabGroup as="div" :selected-index="selectedTab" class="mt-6" @change="selectedTab = $event">
        <TabList class="flex gap-1 overflow-x-auto rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          <Tab
            v-for="(tab, index) in tabs"
            :key="tab.key"
            class="flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="index === selectedTab ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <span class="inline-flex items-center gap-2">
              <component :is="tab.icon" class="h-4 w-4" aria-hidden="true" />
              {{ tab.label }}
            </span>
          </Tab>
        </TabList>

        <TabPanels class="mt-6">
          <!-- Dashboard / Overview -->
          <TabPanel>
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Dashboard</h2>
                <p class="text-sm text-gray-500">Performance at a glance, as the affiliate sees it.</p>
              </div>
              <label class="inline-flex items-center gap-2 text-sm text-gray-600">
                <span class="sr-only">Reporting period</span>
                <select
                  v-model="period"
                  class="rounded-lg border-gray-200 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="month">This Month</option>
                </select>
              </label>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="stat in dashboardStats" :key="stat.label" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                  <div :class="`rounded-xl p-2 ${stat.bgColor}`">
                    <component :is="stat.icon" :class="`h-6 w-6 ${stat.iconColor}`" aria-hidden="true" />
                  </div>
                  <span
                    class="rounded-full px-2 py-1 text-xs font-bold"
                    :class="stat.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ stat.growth >= 0 ? '+' : '' }}{{ stat.growth }}%
                  </span>
                </div>
                <div class="mb-1 text-sm font-medium text-gray-500">{{ stat.label }}</div>
                <div class="text-2xl font-bold text-gray-900">{{ stat.prefix }}{{ stat.value }}</div>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
                <h3 class="mb-6 text-lg font-bold text-gray-900">Earnings Overview</h3>
                <ProfileEarningsChart :period="period" />
              </div>

              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 class="mb-6 text-lg font-bold text-gray-900">Recent Payouts</h3>
                <div class="space-y-4">
                  <div v-for="payout in dashboardPayouts" :key="payout.id" class="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <div class="flex items-center">
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <BanknotesIcon class="h-5 w-5 text-gray-600" aria-hidden="true" />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-bold text-gray-900">₵{{ payout.amount }}</div>
                        <div class="text-xs text-gray-500">{{ payout.date }}</div>
                      </div>
                    </div>
                    <span class="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">{{ payout.status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div class="border-b border-gray-100 p-6">
                <h3 class="text-lg font-bold text-gray-900">Recent Commissions</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Referral</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Plan</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Earnings</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Status</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="comm in dashboardCommissions" :key="comm.id" class="transition hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div class="text-sm font-bold text-gray-900">{{ comm.customer }}</div>
                        <div class="text-xs text-gray-500">{{ comm.email }}</div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">{{ comm.plan }}</td>
                      <td class="px-6 py-4 text-sm font-bold text-gray-900">₵{{ comm.amount }}</td>
                      <td class="px-6 py-4">
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="comm.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                        >
                          {{ comm.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ comm.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>

          <!-- Commissions -->
          <TabPanel>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Commission History</h2>
              <p class="text-sm text-gray-500">All earnings from successful referrals.</p>
            </div>

            <div class="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="min-w-[240px] flex-1">
                <label for="profile-comm-search" class="mb-2 block text-sm font-medium text-gray-700">Search Referrals</label>
                <div class="relative">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="profile-comm-search"
                    v-model="commissionSearch"
                    type="text"
                    placeholder="Search by name or email…"
                    class="block w-full rounded-lg border-gray-200 py-2 pl-10 pr-4 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div class="w-full sm:w-48">
                <label for="profile-comm-status" class="mb-2 block text-sm font-medium text-gray-700">Status</label>
                <select id="profile-comm-status" v-model="commissionStatus" class="block w-full rounded-lg border-gray-200 py-2 focus:border-primary-500 focus:ring-primary-500">
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Referral</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Subscription Plan</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Revenue</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Commission</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Status</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="comm in filteredCommissions" :key="comm.id" class="transition hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div class="text-sm font-bold text-gray-900">{{ comm.customer }}</div>
                        <div class="text-xs text-gray-500">{{ comm.email }}</div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">{{ comm.plan }}</td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">₵{{ comm.revenue }}</td>
                      <td class="px-6 py-4 text-sm font-bold text-primary-600">₵{{ comm.commission }}</td>
                      <td class="px-6 py-4">
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="comm.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                        >
                          {{ comm.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ comm.date }}</td>
                    </tr>
                    <tr v-if="filteredCommissions.length === 0">
                      <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">No commissions match your filters.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="border-t border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                Showing {{ filteredCommissions.length }} of {{ commissions.length }} commissions
              </div>
            </div>
          </TabPanel>

          <!-- Payouts -->
          <TabPanel>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Payouts</h2>
              <p class="text-sm text-gray-500">Withdrawals and payout history.</p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div class="mb-1 text-sm font-medium text-gray-500">Available for Payout</div>
                <div class="text-3xl font-extrabold text-gray-900">₵{{ formatMoney(payoutSummary.available) }}</div>
                <div class="mt-4 text-xs text-gray-500">Minimum payout: ₵{{ formatMoney(payoutSummary.minimum) }}</div>
              </div>
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div class="mb-1 text-sm font-medium text-gray-500">Pending Payouts</div>
                <div class="text-3xl font-extrabold text-orange-600">₵{{ formatMoney(payoutSummary.pending) }}</div>
                <div class="mt-4 text-xs text-gray-500">Processing usually takes 3–5 days</div>
              </div>
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div class="mb-1 text-sm font-medium text-gray-500">Total Payouts to Date</div>
                <div class="text-3xl font-extrabold text-green-600">₵{{ formatMoney(payoutSummary.total) }}</div>
                <div class="mt-4 text-xs text-gray-500">Last payout: {{ payoutSummary.lastPayoutDate }}</div>
              </div>
            </div>

            <div class="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div class="border-b border-gray-100 p-6">
                <h3 class="text-lg font-bold text-gray-900">Payout History</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Payout ID</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Method</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Amount</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Status</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="payout in payouts" :key="payout.id" class="transition hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ payout.id }}</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="mr-3 flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                            <component :is="payoutIcon(payout.method)" class="h-4 w-4 text-gray-600" aria-hidden="true" />
                          </div>
                          <span class="text-sm text-gray-600">{{ payout.method }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-sm font-bold text-gray-900">₵{{ formatMoney(payout.amount) }}</td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-green-800">{{ payout.status }}</span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ payout.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>

          <!-- Stats -->
          <TabPanel>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Performance Stats</h2>
              <p class="text-sm text-gray-500">Traffic and conversion data.</p>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="item in statsBreakdown" :key="item.label" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div class="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">{{ item.label }}</div>
                <div class="text-2xl font-black text-gray-900">{{ item.value }}</div>
                <div class="mt-4 flex items-center">
                  <span class="text-xs font-bold" :class="item.trend > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
                  </span>
                  <span class="ml-2 text-[10px] text-gray-500">vs previous period</span>
                </div>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 class="mb-8 text-lg font-bold text-gray-900">Traffic Sources</h3>
                <div class="space-y-6">
                  <div v-for="source in trafficSources" :key="source.name">
                    <div class="mb-2 flex justify-between text-sm font-bold">
                      <span class="text-gray-700">{{ source.name }}</span>
                      <span class="text-gray-900">{{ source.percentage }}%</span>
                    </div>
                    <div class="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div class="h-full rounded-full" :class="source.barColor" :style="{ width: `${source.percentage}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 class="mb-8 text-lg font-bold text-gray-900">Device Distribution</h3>
                <div class="flex h-full items-center justify-around py-4">
                  <div v-for="device in devices" :key="device.name" class="flex flex-col items-center">
                    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" :class="device.bgColor">
                      <component :is="device.icon" class="h-8 w-8" :class="device.iconColor" aria-hidden="true" />
                    </div>
                    <span class="text-sm font-bold text-gray-900">{{ device.percentage }}%</span>
                    <span class="text-xs text-gray-500">{{ device.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div class="border-b border-gray-100 p-6">
                <h3 class="text-lg font-bold text-gray-900">Daily Breakdown</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Date</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Clicks</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Unique Visitors</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Conversions</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Conv. Rate</th>
                      <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Earnings</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="day in dailyStats" :key="day.date" class="transition hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ day.date }}</td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-600">{{ day.clicks }}</td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-600">{{ day.visitors }}</td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-600">{{ day.conversions }}</td>
                      <td class="px-6 py-4">
                        <span class="rounded-lg bg-primary-100 px-2 py-1 text-xs font-bold text-primary-700">{{ day.rate }}%</span>
                      </td>
                      <td class="px-6 py-4 text-sm font-black text-gray-900">₵{{ day.earnings }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>

          <!-- Links -->
          <TabPanel>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Affiliate Links</h2>
              <p class="text-sm text-gray-500">Tracking links and embed widgets for this affiliate.</p>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div class="space-y-8 lg:col-span-2">
                <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 class="mb-6 text-lg font-bold text-gray-900">Affiliate Link</h3>
                  <label for="profile-aff-link" class="mb-2 block text-xs font-bold uppercase tracking-wider text-primary-700">Referral URL</label>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="profile-aff-link"
                      readonly
                      :value="referralLink"
                      class="flex-1 rounded-lg border-primary-200 bg-primary-50 px-4 py-3 font-medium text-gray-700"
                    />
                    <button
                      type="button"
                      class="rounded-lg border border-primary-200 bg-white px-6 py-3 font-bold text-primary-600 transition hover:bg-primary-100"
                      @click="copyText(referralLink, 'Affiliate link copied')"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 class="mb-6 text-lg font-bold text-gray-900">Embed Widget</h3>
                  <label for="profile-widget-type" class="mb-2 block text-sm font-medium text-gray-700">Widget Type</label>
                  <select id="profile-widget-type" v-model="widgetType" class="block w-full rounded-xl border-gray-200 px-4 py-3 focus:border-primary-500 focus:ring-primary-500">
                    <option value="carousel">Small Card (Carousel)</option>
                    <option value="grid">Banner (Grid)</option>
                  </select>
                  <p class="mt-2 text-xs text-gray-500">
                    <span v-if="widgetType === 'carousel'">Displays a compact, horizontal scrolling carousel with arrows.</span>
                    <span v-else>Displays a full-width grid of the latest newspapers.</span>
                  </p>
                  <label for="profile-widget-code" class="mb-2 mt-6 block text-xs font-bold uppercase tracking-wider text-primary-700">Embed Code</label>
                  <textarea
                    id="profile-widget-code"
                    readonly
                    :value="widgetCode"
                    rows="3"
                    class="w-full resize-none rounded-lg border-primary-200 bg-primary-50 px-4 py-3 font-mono text-sm text-gray-700"
                  ></textarea>
                  <div class="mt-3 flex justify-end">
                    <button
                      type="button"
                      class="rounded-lg border border-primary-200 bg-white px-6 py-3 font-bold text-primary-600 transition hover:bg-primary-100"
                      @click="copyText(widgetCode, 'Widget code copied')"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

                <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div class="border-b border-gray-100 p-6">
                    <h3 class="text-lg font-bold text-gray-900">Tracked Links</h3>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left">
                      <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Target</th>
                          <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Clicks</th>
                          <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Conversions</th>
                          <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Last Used</th>
                          <th scope="col" class="px-6 py-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr v-for="link in trackedLinks" :key="link.id" class="transition hover:bg-gray-50">
                          <td class="px-6 py-4">
                            <div class="text-sm font-bold text-gray-900">{{ link.target }}</div>
                            <div class="max-w-[220px] truncate text-xs text-gray-500">{{ link.url }}</div>
                          </td>
                          <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ link.clicks }}</td>
                          <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ link.conversions }}</td>
                          <td class="px-6 py-4 text-sm text-gray-500">{{ link.lastUsed }}</td>
                          <td class="px-6 py-4">
                            <button type="button" class="text-sm font-bold text-primary-600 hover:text-primary-700" @click="copyText(link.url, 'Link copied')">Copy</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div class="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 class="mb-6 text-center text-lg font-bold text-gray-900">Referral Success Rate</h3>
                  <div class="relative mx-auto h-48 w-48">
                    <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90 transform" aria-hidden="true">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" stroke-width="12" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#dc2626" stroke-width="12" :stroke-dasharray="`${referralSummary.successRate * 2.51} 251`" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <span class="text-3xl font-black text-gray-900">{{ referralSummary.successRate }}%</span>
                      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Conversion</span>
                    </div>
                  </div>
                  <div class="mt-8 space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Total Referrals</span>
                      <span class="font-bold">{{ referralSummary.totalReferrals }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Paid Referrals</span>
                      <span class="font-bold">{{ referralSummary.paidReferrals }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import type { Affiliate } from '~/models'
import {
  affiliateCommissions,
  affiliateDailyStats,
  affiliateDevices,
  affiliatePayouts,
  affiliatePayoutSummary,
  affiliateReferralSummary,
  affiliateStatsBreakdown,
  affiliateTrackedLinks,
  affiliateTrafficSources,
  getAffiliateDashboardCommissions,
  getAffiliateDashboardPayouts,
  getAffiliateDashboardStats,
  getAffiliateWidgetEmbedCode,
  type AffiliatePeriod,
} from '~/mocks/affiliates/portal'
import ProfileEarningsChart from '~/components/affiliates/ProfileEarningsChart.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const { $toast } = useNuxtApp()
const affiliateId = computed(() => String(route.params.id ?? ''))

const affiliate = ref<Affiliate | null>(null)
const isLoading = ref(true)
const loadError = ref('')

const STATUS = {
  PENDING: 20,
  APPROVED: 11,
  REJECTED: 17,
  ARCHIVED: 2,
  SUSPENDED: 13,
} as const

const statusLabel = computed(() => {
  const status = Number(affiliate.value?.status)
  switch (status) {
    case STATUS.PENDING: return 'Pending'
    case STATUS.APPROVED: return 'Active'
    case STATUS.REJECTED: return 'Rejected'
    case STATUS.ARCHIVED: return 'Archived'
    case STATUS.SUSPENDED: return 'Suspended'
    default: return affiliate.value?.status || 'Unknown'
  }
})

const statusBadgeClass = computed(() => {
  const status = Number(affiliate.value?.status)
  switch (status) {
    case STATUS.PENDING: return 'bg-yellow-100 text-yellow-800'
    case STATUS.APPROVED: return 'bg-green-100 text-green-800'
    case STATUS.REJECTED: return 'bg-red-100 text-red-800'
    case STATUS.SUSPENDED: return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
})

const fullName = computed(() =>
  [affiliate.value?.firstName, affiliate.value?.lastName].filter(Boolean).join(' ') || 'Affiliate',
)

const initials = computed(() => {
  const first = affiliate.value?.firstName?.charAt(0) ?? ''
  const last = affiliate.value?.lastName?.charAt(0) ?? ''
  return (first + last).toUpperCase() || 'A'
})

const formatMoney = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0)
  return Number.isFinite(num) ? num.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}

const loadAffiliate = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    affiliate.value = await getAffiliateById(affiliateId.value)
  } catch (error) {
    console.error('Failed to load affiliate profile', error)
    loadError.value = 'Something went wrong while fetching this affiliate. Please try again.'
  } finally {
    isLoading.value = false
  }
}

useHead(() => ({
  title: affiliate.value ? `${fullName.value} | Affiliate Profile | Graphic News Plus` : 'Affiliate Profile | Graphic News Plus',
}))

// --- Portal tab state ---
const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { key: 'commissions', label: 'Commissions', icon: BanknotesIcon },
  { key: 'payouts', label: 'Payouts', icon: CreditCardIcon },
  { key: 'stats', label: 'Stats', icon: CursorArrowRaysIcon },
  { key: 'links', label: 'Links', icon: LinkIcon },
]
const selectedTab = ref(0)

// Dashboard
const period = ref<AffiliatePeriod>('7days')
const dashboardStats = computed(() => getAffiliateDashboardStats(period.value))
const dashboardPayouts = computed(() => getAffiliateDashboardPayouts(period.value))
const dashboardCommissions = computed(() => getAffiliateDashboardCommissions(period.value))

// Commissions
const commissions = ref(affiliateCommissions)
const commissionSearch = ref('')
const commissionStatus = ref('All')
const filteredCommissions = computed(() => {
  const query = commissionSearch.value.trim().toLowerCase()
  return commissions.value.filter((comm) => {
    const matchesQuery = !query || comm.customer.toLowerCase().includes(query) || comm.email.toLowerCase().includes(query)
    const matchesStatus = commissionStatus.value === 'All' || comm.status === commissionStatus.value
    return matchesQuery && matchesStatus
  })
})

// Payouts
const payouts = ref(affiliatePayouts)
const payoutSummary = affiliatePayoutSummary
const payoutIcon = (method: string) => (method.includes('Mobile') ? DevicePhoneMobileIcon : CreditCardIcon)

// Stats
const statsBreakdown = affiliateStatsBreakdown
const trafficSources = affiliateTrafficSources
const devices = affiliateDevices
const dailyStats = affiliateDailyStats

// Links
const trackedLinks = ref(affiliateTrackedLinks)
const referralSummary = affiliateReferralSummary
const widgetType = ref<'carousel' | 'grid'>('carousel')
const referralLink = computed(() => `https://new.graphicnewsplus.com/?ref=${affiliate.value?.affiliateId || affiliate.value?.id || ''}`)
const widgetCode = computed(() => getAffiliateWidgetEmbedCode(affiliate.value?.affiliateId || affiliate.value?.id || '', widgetType.value))

const copyText = async (text: string, message: string) => {
  try {
    await navigator.clipboard.writeText(text)
    $toast.success(message)
  } catch {
    $toast.error('Unable to copy to clipboard')
  }
}

onMounted(loadAffiliate)
</script>
