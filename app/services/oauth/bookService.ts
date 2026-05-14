import type { BookDetailResponse } from '@/types/book'
import type { RequestParams, PaginatedResponse } from '~/types/api'

export const useBookService = (): {
  getBooks: (params?: RequestParams) => Promise<PaginatedResponse<BookDetailResponse>>
  uploadBook: (file: File) => Promise<BookDetailResponse>
} => {
  const api = useApi()

  const getBooks = (params?: RequestParams): Promise<PaginatedResponse<BookDetailResponse>> => {
    return api.get<PaginatedResponse<BookDetailResponse>>(
      '/book/list',
      params as Record<string, unknown>
    )
  }

  const uploadBook = (file: File): Promise<BookDetailResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<BookDetailResponse>('/book/upload', formData)
  }

  return {
    getBooks,
    uploadBook
  }
}
