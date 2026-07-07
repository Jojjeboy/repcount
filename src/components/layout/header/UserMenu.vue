<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="overflow-hidden rounded-full h-11 w-11">
        <img :src="user?.photoURL || '/repcount/images/user/owner.jpg'" alt="User" />
      </span>
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
       <div>
         <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
           {{ user?.displayName || $t('user.fallback_name') }}
         </span>
         <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
           {{ user?.email || 'user@example.com' }}
         </span>
       </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
             {{ $t(item.text) }}
          </router-link>
        </li>
      </ul>
         <button
           @click="handleSignOut"
           class="w-full flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
         >
           <LogoutIcon
             class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
           />
           {{ $t('user.sign_out') }}
         </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { LogoutIcon, SettingsIcon } from '@/icons'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const menuItems = [
  { href: '/settings', icon: SettingsIcon, text: 'common.settings' }
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    closeDropdown()
    router.push('/signin')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
