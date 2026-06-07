import type { AvatarItems } from '@/types/avatar'
import type { DownloadBookParams, DownloadBook } from '~/types/book'
import type { PaginatedResponse, RequestParams } from '~/types/api'
export const useDownloadService = (): {
  downloadBookStart: (bookId: number, params: DownloadBookParams) => Promise<AvatarItems>
  getDownloadBookList: (bookId: number, params?: RequestParams) => Promise<PaginatedResponse<DownloadBook>>
  downloadCompleteBook: (bookId: number, downloadId: number) => Promise<string>
  deleteDownloadBook: (bookId: number, downloadId: number) => Promise<string>
} => {
  const api = useApi()

  const downloadBookStart = async (
    bookId: number,
    params: DownloadBookParams
  ): Promise<AvatarItems> => {
    const response = await api.post<AvatarItems>(`/book/convert/${bookId}`, params)
    return response || {}
  }

  const getDownloadBookList = async (bookId: number, params?: RequestParams): Promise<PaginatedResponse<DownloadBook>> => {
    const response = await api.get<PaginatedResponse<DownloadBook>>(
      `/book/list/download/${bookId}`,
      params as Record<string, unknown>
    )
    return {
      data: response?.data || [],
      meta: response?.meta || {
        total: 0,
        limit: 10,
        offset: 0
      }
    }
  }

  const downloadCompleteBook = async (bookId: number, downloadId: number): Promise<string> => {
    const response = await api.get<string>(`/book/download/${bookId}/item/${downloadId}`)
    return response || ''
  }
  const deleteDownloadBook = async (bookId: number, downloadId: number): Promise<string> => {
    const response = await api.delete<string>(`/book/delete/${bookId}/item/${downloadId}`)
    return response || ''
  }

  return {
    downloadBookStart,
    getDownloadBookList,
    downloadCompleteBook,
    deleteDownloadBook
  }
}
