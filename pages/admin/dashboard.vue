<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.name" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full" :class="stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-sm font-medium text-gray-500">{{ stat.name }}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="stat.value" :duration="2" :options="{ prefix: stat.prefix, suffix: stat.suffix }" />
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column (2/3) -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Financial Health -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="stat in financialStats" :key="stat.name" class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ stat.name }}</p>
            <div class="mt-2 flex items-baseline">
              <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
              <span class="ml-2 text-xs font-medium" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-400">{{ stat.description }}</p>
          </div>
        </div>

        <!-- Active Campaigns -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Active Campaigns</h2>
            <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage</button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vouchers</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="campaign in campaigns" :key="campaign.name">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ campaign.name }}</div>
                    <div class="text-xs text-gray-500">{{ campaign.period }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ campaign.roi }}%</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ campaign.vouchersRedeemed }}/{{ campaign.vouchersTotal }}</div>
                    <div class="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div class="bg-primary-600 h-1.5 rounded-full" :style="{ width: `${(campaign.vouchersRedeemed / campaign.vouchersTotal) * 100}%` }"></div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Signups -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Signups</h2>
            <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in recentUsers" :key="user.email" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" :src="user.avatar" alt="" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-900">Edit</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column (1/3) -->
      <div class="space-y-8">
        
        <!-- Publication Performance -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Publication Performance</h2>
          <div class="space-y-5">
            <div v-for="pub in publicationStats" :key="pub.name">
              <div class="flex justify-between items-center mb-1.5">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700">{{ pub.name }}</span>
                </div>
                <span class="text-xs font-semibold" :class="pub.trend > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ pub.trend > 0 ? '+' : '' }}{{ pub.trend }}%
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  class="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  :class="pub.color"
                  :style="{ width: `${pub.percentage}%` }"
                ></div>
              </div>
              <div class="flex justify-between mt-1 text-xs text-gray-500">
                <span>{{ pub.sales }} Sales</span>
                <span>{{ pub.views }} Views</span>
              </div>
            </div>
          </div>
        </div>

        <!-- User Engagement -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
          
          <!-- Geography -->
          <div class="mb-6">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Top Locations</h3>
            <div class="space-y-3">
              <div v-for="loc in userGeography" :key="loc.country" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ loc.flag }}</span>
                  <span class="text-sm text-gray-700">{{ loc.country }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ loc.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Device Usage -->
          <div>
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Device Usage</h3>
            <div class="flex items-center justify-center space-x-4">
              <!-- Simple CSS Donut Chart Representation -->
               <div class="relative h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                 <svg viewBox="0 0 100 100" class="h-full w-full transform -rotate-90">
                   <!-- Mobile (60%) -->
                   <circle cx="50" cy="50" r="40" fill="transparent" stroke="#dc2626" stroke-width="20" stroke-dasharray="150 251" /> 
                   <!-- Desktop (30%) -->
                   <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" stroke-width="20" stroke-dasharray="75 251" stroke-dashoffset="-150" />
                   <!-- Tablet (10%) -->
                   <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" stroke-width="20" stroke-dasharray="25 251" stroke-dashoffset="-225" />
                 </svg>
               </div>
               <div class="space-y-1 text-xs">
                 <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-primary-600 mr-2"></span>Mobile (60%)</div>
                 <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>Desktop (30%)</div>
                 <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Tablet (10%)</div>
               </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
              <span class="text-sm font-medium text-gray-700 group-hover:text-primary-700">Add New Article</span>
              <PlusIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            </button>
            <button class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
              <span class="text-sm font-medium text-gray-700 group-hover:text-primary-700">Create User</span>
              <UserPlusIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            </button>
            <button class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
              <span class="text-sm font-medium text-gray-700 group-hover:text-primary-700">Create Campaign</span>
              <MegaphoneIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            </button>
            <button class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
              <span class="text-sm font-medium text-gray-700 group-hover:text-primary-700">System Settings</span>
              <CogIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
          <h2 class="text-lg font-semibold mb-4">System Status</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-300">Server Load</span>
                <span class="font-medium">24%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 24%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-300">Database Usage</span>
                <span class="font-medium">58%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 58%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-300">Storage</span>
                <span class="font-medium">85%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  NewspaperIcon, 
  EyeIcon,
  PlusIcon,
  UserPlusIcon,
  CogIcon,
  MegaphoneIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'

definePageMeta({
  layout: 'admin',
  //middleware: 'auth' // Assuming auth middleware exists or will be added
})

const stats = [
  { 
    name: 'Total Users', 
    value: 12450, 
    change: '+12%', 
    changeType: 'increase', 
    icon: UsersIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Revenue', 
    value: 45200, 
    change: '+8.2%', 
    changeType: 'increase', 
    icon: CurrencyDollarIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    prefix: '₵',
    suffix: ''
  },
  { 
    name: 'Active Subscriptions', 
    value: 3840, 
    change: '-2.1%', 
    changeType: 'decrease', 
    icon: NewspaperIcon,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    prefix: '',
    suffix: ''
  },
  { 
    name: 'Today\'s Views', 
    value: 8540, 
    change: '+24%', 
    changeType: 'increase', 
    icon: EyeIcon,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    prefix: '',
    suffix: ''
  },
]

const recentUsers = [
  {
    name: 'Kwame Mensah',
    email: 'kwame.m@example.com',
    status: 'Active',
    date: 'Dec 10, 2025',
    avatar: 'https://ui-avatars.com/api/?name=Kwame+Mensah&background=random'
  },
  {
    name: 'Abena Osei',
    email: 'abena.o@example.com',
    status: 'Pending',
    date: 'Dec 09, 2025',
    avatar: 'https://ui-avatars.com/api/?name=Abena+Osei&background=random'
  },
  {
    name: 'Kofi Boateng',
    email: 'kofi.b@example.com',
    status: 'Active',
    date: 'Dec 09, 2025',
    avatar: 'https://ui-avatars.com/api/?name=Kofi+Boateng&background=random'
  },
  {
    name: 'Ama Serwaa',
    email: 'ama.s@example.com',
    status: 'Active',
    date: 'Dec 08, 2025',
    avatar: 'https://ui-avatars.com/api/?name=Ama+Serwaa&background=random'
  },
  {
    name: 'Yaw Darko',
    email: 'yaw.d@example.com',
    status: 'Inactive',
    date: 'Dec 08, 2025',
    avatar: 'https://ui-avatars.com/api/?name=Yaw+Darko&background=random'
  },
]

const publicationStats = [
  { 
    name: 'Daily Graphic', 
    sales: 1240, 
    views: 5600, 
    percentage: 85, 
    trend: 12.5,
    color: 'bg-red-600'
  },
  { 
    name: 'The Mirror', 
    sales: 850, 
    views: 3200, 
    percentage: 65, 
    trend: 5.2,
    color: 'bg-blue-500'
  },
  { 
    name: 'Graphic Showbiz', 
    sales: 720, 
    views: 4100, 
    percentage: 55, 
    trend: -2.4,
    color: 'bg-purple-500'
  },
  { 
    name: 'Graphic Sports', 
    sales: 680, 
    views: 2900, 
    percentage: 45, 
    trend: 8.1,
    color: 'bg-green-500'
  },
  { 
    name: 'Graphic Business', 
    sales: 540, 
    views: 1800, 
    percentage: 35, 
    trend: 1.2,
    color: 'bg-gray-600'
  },
  { 
    name: 'Junior Graphic', 
    sales: 490, 
    views: 1500, 
    percentage: 30, 
    trend: 4.5,
    color: 'bg-yellow-500'
  }
]

const financialStats = [
  { name: 'Churn Rate', value: '2.4%', trend: -0.5, description: 'Subscribers lost this month' },
  { name: 'ARPU', value: '₵45.20', trend: 1.2, description: 'Avg. Revenue Per User' },
  { name: 'Guest Conversion', value: '18%', trend: 3.5, description: 'Guests becoming subscribers' },
]

const userGeography = [
  { country: 'Ghana', percentage: 65, flag: '🇬🇭' },
  { country: 'United Kingdom', percentage: 15, flag: '🇬🇧' },
  { country: 'United States', percentage: 12, flag: '🇺🇸' },
  { country: 'Germany', percentage: 5, flag: '🇩🇪' },
  { country: 'Others', percentage: 3, flag: '🌍' },
]

const campaigns = [
  { name: 'Independence Day Promo', period: 'Mar 1 - Mar 10', roi: 320, vouchersRedeemed: 450, vouchersTotal: 500 },
  { name: 'Student Discount', period: 'Ongoing', roi: 180, vouchersRedeemed: 120, vouchersTotal: 1000 },
  { name: 'Easter Special', period: 'Apr 1 - Apr 15', roi: 250, vouchersRedeemed: 85, vouchersTotal: 200 },
]
</script>