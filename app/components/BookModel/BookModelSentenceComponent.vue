<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-3 px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 rounded-t-2xl">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
          {{book?.name}}
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        
        <div class="flex items-center space-x-2">
          <label for="template-select" class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {{ $t('template.label') }}:
          </label>
          
          <div class="relative">
            <select 
              id="template-select"
              v-model="selectedTemplate"
              class="appearance-none outline-none text-xs font-medium text-black bg-white px-3 py-1.5 pr-8 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:text-indigo-600 transition-colors"
              @change="handleTemplateChange"
            >
              <option value="json">JSON</option>
              
              <option 
                v-for="template in templateStore.templates" 
                :key="template.value" 
                :value="template.value"
              >
                {{ template.label }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button 
          v-if="book?.lines?.length"
          class="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          @click="copyToClipboard"
        >
          <svg
            v-if="!isCopied"
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <svg
            v-else
            class="w-3.5 h-3.5 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ isCopied ? $t('buttons.copied') : $t('buttons.copy')  }}</span>
        </button>
      </div>
    </div>

    <div class="relative rounded-b-2xl shadow-xl border border-slate-800 max-h-[550px] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-800 min-h-[200px]">
      
      <book-model-preview-json v-if="selectedTemplate === 'json'" />
      
      <book-model-preview-html v-else />

    </div>
  </div>
</template>

<script setup lang="ts">

const bookStore = useBookStore()
const templateStore = useTemplateStore()
const { book } = storeToRefs(bookStore)
const selectedTemplate = ref('json')
const isCopied = ref(false)

onMounted(() => {
  templateStore.fetchTemplates()
})

const copyToClipboard = async (): Promise<void> => {
  if (!book.value?.lines) return
  
  try {
    let contentToCopy = '';
    
    if (selectedTemplate.value === 'json') {
      contentToCopy = JSON.stringify(book.value.lines, null, 2)
    } else {
      contentToCopy = templateStore.currentTemplateCode || ''
    }
    
    if (contentToCopy) {
      await navigator.clipboard.writeText(contentToCopy)
      isCopied.value = true
      setTimeout(() => { isCopied.value = false }, 2000)
    }
  } catch (err) {
    console.error('Error copying to clipboard:', err)
  }
}

const handleTemplateChange = async (): Promise<void> => {
  if (selectedTemplate.value === 'json') {
   
    templateStore.clearCurrentTemplate()
  } else if (selectedTemplate.value) {
    await templateStore.fetchTemplateByValue(selectedTemplate.value)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #dfe0e9; 
  border-radius: 0 0 2rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>