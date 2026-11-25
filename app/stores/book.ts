import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookDetailResponse } from '@/types/book'
import type { ActionStatus } from '@/types/action'
import type { RequestParams } from '~/types/api'
import { useBookService } from '~/services/bookService' 
import { getLatestAction } from '~/utils/bookActions'

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

  /**
   * Update the newest action of the given type. After a re-parse a book has
   * several parsing actions, and only the newest one belongs to the running job.
   */
  const updateBookActionStatus = (
    bookId: number,
    actionType: string,
    newStatus: ActionStatus,
    errorMessage?: string | null
  ): void => {
    const book = books.value.find((b) => b.id === bookId)
    if (book) {
      if (!book.actions) {
        book.actions = []
      }

      const action = getLatestAction(book.actions, actionType)
      const nextErrorMessage = newStatus === 'failed' ? (errorMessage ?? action?.error_message ?? null) : null
      
      if (action) {
        action.status = newStatus
        action.updated_at = new Date().toISOString()
        action.error_message = nextErrorMessage
      } else {
        book.actions.unshift({
          id: Date.now(),
          type: actionType,
          status: newStatus,
          updated_at: new Date().toISOString(),
          error_message: nextErrorMessage
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