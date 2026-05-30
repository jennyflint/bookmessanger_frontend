<template>
  <div class="w-full h-full min-h-[500px] flex flex-col bg-white rounded-b-2xl overflow-hidden">
    <div 
      v-if="templateStore.isLoading" 
      class="flex items-center justify-center h-full p-12 text-slate-500 animate-pulse bg-slate-50 dark:bg-slate-900"
    >
      <div class="flex flex-col items-center gap-3">
        <svg
          class="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"/>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span>{{ $t('template.generating_preview')}}</span>
      </div>
    </div>
    
    <iframe 
      v-else-if="templateStore.currentTemplateCode"
      :srcdoc="processedTemplateCode" 
      class="w-full h-full min-h-[550px] border-0"
      title="Template Preview"
      sandbox="allow-scripts allow-same-origin"
    />

    <div v-else class="flex items-center justify-center h-full p-12 text-slate-400 font-mono bg-slate-50 dark:bg-slate-900">
      {{ $t('template.select_to_preview') }}
    </div>
  </div>
</template>

<script setup lang="ts">

const templateStore = useTemplateStore()
const bookStore = useBookStore()
const processedTemplateCode = computed(() => {
  const code = templateStore.currentTemplateCode
  if (!code) return ''

  const jsonDataString = bookStore.book ? JSON.stringify(bookStore.book, null, 2) : '{}'

  return code.replace(/\{\{\s*json_data\s*\}\}/g, jsonDataString)
})
</script>

<style scoped>
iframe {
  display: block;
  background-color: white;
}
</style>