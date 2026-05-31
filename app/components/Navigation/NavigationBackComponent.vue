<template>
  <button 
    class="group p-1.5 -ml-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
    :title="$t('navigation.back')"
    @click="goBack"
  >
    <svg
      class="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const router = useRouter()
const goBack = (): void => {
  router.back()
}
</script>