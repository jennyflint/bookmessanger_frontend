import type { BookModel } from '@/types/bookModel'

export const useBookModelService = (): {
  getBookModel: (bookId: number) => Promise<BookModel>
} => {
  const api = useApi()

  const getBookModel = async (bookId: number, short = 1): Promise<BookModel> => {
    const response = await api.get<BookModel>(
      `/book/model/${bookId}?short=${short}`
    );
    return response || {};
  }

  return {
    getBookModel,
  }
}
