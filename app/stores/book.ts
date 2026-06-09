import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookDetailResponse } from '@/types/book'
import type { ActionStatus } from '@/types/action'
import type { RequestParams } from '~/types/api'
import { useBookService } from '~/services/bookService' 

export const useBookStore = defineStore('bookStore', () => {
  const books = ref<BookDetailResponse[]>([])
  const meta = ref({
    total: 0,
    limit: 10,
    offset: 0
  })
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBooks = async (params?: RequestParams): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const bookService = useBookService()
      const response = await bookService.getBooks(params)
      
      books.value = response.data
      meta.value = response.meta
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Error during fetching books'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  const updateBookActionStatus = (bookId: number, actionType: string, newStatus: ActionStatus): void => {
    const book = books.value.find((b) => b.id === bookId)
    if (book) {
      if (!book.actions) {
        book.actions = []
      }

      const action = book.actions.find((a) => a.type === actionType)
      
      if (action) {
        action.status = newStatus
        action.updated_at = new Date().toISOString()
      } else {
        book.actions.push({
          id: Date.now(),
          type: actionType,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      }
    }
  }

  return {
    books,
    meta,
    isLoading,
    error,
    fetchBooks,
    updateBookActionStatus
  }
})