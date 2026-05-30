import type { AvatarItems } from '@/types/avatar'
import type { DownloadBookParams } from '~/types/book'

export const useDownloadService = (): {
  downloadBook: (bookId: number, params: DownloadBookParams) => Promise<AvatarItems>
} => {
  const api = useApi()

  const downloadBook = async (bookId: number, params: DownloadBookParams): Promise<AvatarItems> => {
    const response = await api.post<AvatarItems>(`/book/convert/${bookId}`, params)
    return response || {}
  }

  return {
    downloadBook
  }
}
