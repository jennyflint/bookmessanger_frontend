import type {  BookDetailResponse } from '@/types/book'
import type { RequestParams, PaginatedResponse } from '~/types/api'

export const useBookService = (): { getBooks: (params?: RequestParams) => Promise<PaginatedResponse<BookDetailResponse>> } => {
  const api = useApi()

  const getBooks = (params?: RequestParams): Promise<PaginatedResponse<BookDetailResponse>> => {
    return api.get<PaginatedResponse<BookDetailResponse>>('/book/list', params as Record<string, unknown>)
  }

  return {
    getBooks
  }
}