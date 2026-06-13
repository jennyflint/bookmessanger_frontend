import type { BookDetailResponse } from '@/types/book'
import type { RequestParams, PaginatedResponse } from '~/types/api'

export const useBookService = (): {
  getBooks: (params?: RequestParams) => Promise<PaginatedResponse<BookDetailResponse>>
  uploadBook: (file: File) => Promise<BookDetailResponse>
  deleteBook: (id: number) => Promise<string>
} => {
  const api = useApi()

  const getBooks = async (params?: RequestParams): Promise<PaginatedResponse<BookDetailResponse>> => {
    const response = await api.get<PaginatedResponse<BookDetailResponse>>(
      '/book/list',
    params as Record<string, unknown>
    );
    return {
      data: response?.data || [],
      meta: response?.meta || {
        total: 0,
        limit: 10, 
        offset: 0
      }
    };
  }
  const uploadBook = (file: File): Promise<BookDetailResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<BookDetailResponse>('/book/upload', formData)
  }

  const deleteBook = (id: number): Promise<string> => {
    const response = api.delete<string>(`/book/delete/${id}`)
    return response || ''
  }
  return {
    getBooks,
    uploadBook,
    deleteBook,
  }
}
