import type { BookModel } from '@/types/bookModel'

export const useBookModelService = (): {
  getBookModel: (bookId: number) => Promise<BookModel>
} => {
  const api = useApi()

  const getBookModel = async (bookId: number): Promise<BookModel> => {
    const response = await api.get<BookModel>(
      `/book/model/${bookId}`
    );
    return response || {};
  }

  return {
    getBookModel,
  }
}
