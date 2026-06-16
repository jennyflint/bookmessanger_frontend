<template>
  <header v-if="userStore.isAuthenticated" class="app-header w-full bg-white border-b border-[#4b2c20]/20 px-6 py-3 sticky top-0 z-50 select-none">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <div class="flex items-center">
        <span class="logo-text font-bold text-[18px] tracking-tight text-[#4b2c20]">
          {{ config.public.appName || 'BookChat' }}
        </span>
      </div>

      <div class="flex items-center gap-4">
        <span v-if="userStore.user" class="user-email text-[14px] text-[#4b2c20]/70 hidden xs:inline-block">
          {{ userStore.user.email }}
        </span>

        <button class="logout-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[14px] font-medium text-[#ff6b6b] hover:bg-[#ff6b6b]/5 transition-colors" @click="handleLogout">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{{ $t('auth.logout') }}</span>
        </button>
      </div>

    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'

const config = useRuntimeConfig()
const userStore = useUserStore()

const handleLogout = (): void => {
  userStore.logout()
  navigateTo('/auth/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

.app-header {
  font-family: 'Fredoka One', cursive;
  -webkit-font-smoothing: antialiased;
}

.logo-text {
  position: relative;
}

.logout-btn {
  border: 1px solid transparent;
}

.logout-btn:hover {
  border-color: #ff6b6b/20;
}
</style>