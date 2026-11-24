<template>
  <Menu as="div" class="relative">
    <MenuButton class="flex max-w-[14rem] items-center gap-2 rounded-lg p-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Affiliate account menu">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">{{ initials }}</span>
      <span class="hidden min-w-0 sm:block">
        <span class="block truncate text-sm font-semibold text-gray-900">{{ name }}</span>
        <span v-if="email" class="block truncate text-xs text-gray-500">{{ email }}</span>
      </span>
      <ChevronDownIcon class="hidden h-4 w-4 shrink-0 text-gray-500 sm:block" aria-hidden="true" />
    </MenuButton>
    <MenuItems class="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg focus:outline-none">
      <div class="border-b border-gray-100 px-4 py-3">
        <p class="truncate text-sm font-semibold text-gray-900">{{ name }}</p>
        <p v-if="email" class="truncate text-xs text-gray-500">{{ email }}</p>
      </div>
      <MenuItem v-slot="{ active }">
        <NuxtLink to="/affiliates/forgot-password" :class="[active ? 'bg-gray-50 text-primary-700' : 'text-gray-700', 'block px-4 py-3 text-sm']">Change password</NuxtLink>
      </MenuItem>
      <MenuItem v-slot="{ active }">
        <button type="button" :class="[active ? 'bg-gray-50 text-primary-700' : 'text-gray-700', 'block w-full px-4 py-3 text-left text-sm']" @click="signOut">Log out</button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

const authStore = useAffiliateAuthStore()
const name = computed(() => authStore.affiliateUser?.affiliateName || 'Affiliate account')
const email = computed(() => authStore.affiliateUser?.affiliateEmail || '')
const initials = computed(() => name.value.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase())

const signOut = async () => {
  authStore.clearAffiliate()
  await navigateTo('/affiliates/login')
}
</script>
