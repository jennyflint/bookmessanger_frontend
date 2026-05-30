<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
          
          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
              {{ $t('download_modal.title') }}
            </h3>
            <button 
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              @click="closeModal"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 space-y-3">
            <button 
              class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
              @click="downloadPdf"
            >
              <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="text-left flex-1">
                <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.pdf_document') }}</div>
                <div class="text-xs text-slate-500">{{ $t('download_modal.for_reading_and_printing') }}</div>
              </div>
            </button>

            <button 
              class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
              @click="downloadHtml"
            >
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div class="text-left flex-1">
                <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.html_page') }}</div>
                <div class="text-xs text-slate-500">{{ $t('download_modal.opens_in_browser') }}</div>
              </div>
            </button>

            <button 
              class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
              @click="downloadJson"
            >
              <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div class="text-left flex-1">
                <div class="font-bold text-slate-800 dark:text-slate-200">{{ $t('download_modal.raw_data_json') }}</div>
                <div class="text-xs text-slate-500">{{ $t('download_modal.for_developers_and_api') }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { BookModel } from '@/types/bookModel'
import type { DownloadBookParams } from '@/types/book'

const downloadService = useDownloadService()

const bookStore = useBookStore()
const props = defineProps<{
  modelValue: boolean
  htmlContent: string
  jsonContent: BookModel | null
  bookId: number,
  fileName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'success'): void,
}>()

const closeModal = (): void => emit('update:modelValue', false)

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
  closeModal()
}

const downloadHtml = (): void => {
  const blob = new Blob([props.htmlContent], { type: 'text/html;charset=utf-8' })
  triggerDownload(blob, 'html')
}

const downloadJson = (): void => {
  const blob = new Blob([JSON.stringify(props.jsonContent, null, 2)], { type: 'application/json' })
  triggerDownload(blob, 'json')
}

const downloadPdf = (): void => {
  const params: DownloadBookParams = {
    format: 'pdf',
    characters: bookStore.getPreparedCharacters(),
    template: 'simple-test'
  }

  downloadService.downloadBook(props.bookId, params)
  emit('success')

  closeModal()

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
</style>