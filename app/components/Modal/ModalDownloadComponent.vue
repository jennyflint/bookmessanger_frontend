<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal()"
      >
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all relative">
          
          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <button 
                v-if="step === 'theme'" 
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -ml-2"
                @click="goBackToFormats"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7" /></svg>
              </button>
              {{ step === 'format' ? $t('download_modal.title') : $t('template.select_to_preview') }}
            </h3>
            <button 
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              @click="closeModal"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div v-if="step === 'format'" class="p-4 flex flex-col h-full">
            <div class="space-y-3">
              <button 
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleFormatSelect('pdf')"
              >
                <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <svg
                    v-if="selectedFormat === 'pdf'"
                    class="w-5 h-5 animate-spin"
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
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.pdf_document') }}</div>
                  <div class="text-xs text-slate-500">{{ $t('download_modal.for_reading_and_printing') }}</div>
                </div>
              </button>

              <button 
                v-if="htmlContent"
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleFormatSelect('html')"
              >
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <svg
                    v-if="selectedFormat === 'html'"
                    class="w-5 h-5 animate-spin"
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
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.html_page') }}</div>
                  <div class="text-xs text-slate-500">{{ $t('download_modal.opens_in_browser') }}</div>
                </div>
              </button>

              <button 
                v-if="jsonContent"
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="downloadJson()"
              >
                <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.raw_data_json') }}</div>
                  <div class="text-xs text-slate-500">{{ $t('download_modal.for_developers_and_api') }}</div>
                </div>
              </button>
            </div>

            <div v-if="!props.templateName" class="mt-5 text-center">
              <NuxtLink 
                :to="`/book/model/${props.bookId}`" 
                class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline transition-all"
                @click="closeModal"
              >
                {{ $t('download_modal.extended_mode') }}
              </NuxtLink>
            </div>
          </div>

          <div v-else-if="step === 'theme'" class="p-4 flex flex-col h-[300px]">
            
            <div v-if="templateStore.isLoading" class="flex-1 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"/>
            </div>
            
            <div v-else-if="templateStore.error" class="flex-1 flex items-center justify-center text-red-500 text-sm text-center">
              {{ templateStore.error }}
            </div>
            
            <div v-else class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              <button
                v-for="template in templateStore.templates"
                :key="template.value"
                class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                :class="selectedTemplate === template.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'"
                @click="selectedTemplate = template.value"
              >
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ template.value }}</span>
                <svg
                  v-if="selectedTemplate === template.value"
                  class="w-5 h-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"><path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"/></svg>
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                @click="executeDownload"
              >
                {{ $t('buttons.download') }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BookModel } from '@/types/bookModel'
import type { DownloadBookParams, ExportBookFormat } from '@/types/book'

const downloadService = useDownloadService()
const bookModelStore = useBookModelStore()
const templateStore = useTemplateStore()

const props = defineProps<{
  modelValue: boolean
  htmlContent?: string
  jsonContent?: BookModel | null
  bookId: number
  fileName?: string
  templateName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
  'advanced': []
}>()

type Step = 'format' | 'theme'
const step = ref<Step>('format')
const selectedFormat = ref<ExportBookFormat | null>(null)
const selectedTemplate = ref<string | null>(null)

if (!props.templateName && templateStore.templates.length === 0) {
  templateStore.fetchTemplates()
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    step.value = 'format'
    selectedFormat.value = null
    selectedTemplate.value = null
  }

  if (!props.templateName && templateStore.templates.length === 0) {
    templateStore.fetchTemplates()
  }
})

const closeModal = (): void => {
  emit('update:modelValue', false)
}

const goBackToFormats = (): void => {
  step.value = 'format'
  selectedFormat.value = null
}

const handleFormatSelect = async (format: ExportBookFormat): Promise<void> => {
  selectedFormat.value = format
  
  if (props.templateName) {
    selectedTemplate.value = props.templateName
    await executeDownload()
  } else {
    step.value = 'theme'
  }
}

const triggerDownload = (blob: Blob, extension: string): void => {
  const name = props.fileName || 'book-export'
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const downloadJson = (): void => {
  const blob = new Blob([JSON.stringify(props.jsonContent, null, 2)], { type: 'application/json' })
  triggerDownload(blob, 'json')
  closeModal()
}

const executeDownload = async (): Promise<void> => {
  if (!selectedTemplate.value || !selectedFormat.value) return
  try {
    if (selectedFormat.value === 'pdf') {
      const params: DownloadBookParams = {
        format: 'pdf',
        characters: bookModelStore.getPreparedCharacters(),
        template: selectedTemplate.value 
      }
      await downloadService.downloadBook(props.bookId, params)
      emit('success')
    } 
    else if (selectedFormat.value === 'html' && props.htmlContent) {
      const blob = new Blob([props.htmlContent], { type: 'text/html;charset=utf-8' })
      triggerDownload(blob, 'html')
      emit('success')
    }
    
    closeModal()
  } catch (error) {
    console.error('Download failed:', error)
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>