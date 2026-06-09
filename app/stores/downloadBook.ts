import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DownloadBook } from '~/types/book'
import type { RequestParams } from '~/types/api'
import { useDownloadService } from '~/services/downloadService'

export const useDownloadStore = defineStore('downloadStore', () => {
  const downloads = ref<DownloadBook[]>([])
  const meta = ref({
    total: 0,
    limit: 10,
    offset: 0
  })
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const fetchDownloadList = async (bookId: number, params?: RequestParams): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const downloadService = useDownloadService()
      const response = await downloadService.getDownloadBookList(bookId, params)

      downloads.value = response.data
      meta.value = response.meta
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Error fetching download list'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  const removeDownload = async (bookId: number, downloadId: number): Promise<void> => {
    try {
      const downloadService = useDownloadService()
      await downloadService.deleteDownloadBook(bookId, downloadId)
      downloads.value = downloads.value.filter((item) => item.id !== downloadId)
      meta.value.total -= 1
    } catch (err: unknown) {
      console.error('Error:', (err as Error)?.message || err)
      throw err
    }
  }

  return {
    downloads,
    meta,
    isLoading,
    error,
    fetchDownloadList,
    removeDownload
  }
})
