import type { BookDetailResponse } from '@/types/book'
import type { RequestParams, PaginatedResponse } from '~/types/api'
import type { JobStatus, JobResponse } from '~/types/job'

export const useBookService = (): {
  getBooks: (params?: RequestParams) => Promise<PaginatedResponse<BookDetailResponse>>
  uploadBook: (file: File) => Promise<BookDetailResponse>
  listenToBookUpdates: (booksRef: Ref<BookDetailResponse[]>) => void
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

  const listenToBookUpdates = (booksRef: Ref<BookDetailResponse[]>): void => {
    const { connect, disconnect } = useNotificationSocket()

    onMounted(() => {
      connect((payload: unknown) => {
        const data = payload as { type?: string; book_id?: number; status?: JobStatus };

        if (data.type === "create_book_model" && data.book_id && data.status) {
          const bookIndex = booksRef.value.findIndex((b) => b.id === data.book_id);

          if (bookIndex !== -1) {
            const book = <BookDetailResponse>booksRef.value[bookIndex];

            const currentJobs = book.jobs || [];

            if (currentJobs.length > 0) {
              const lastJob = currentJobs.at(-1);
              if (lastJob) {
                lastJob.status = data.status;
              }
            } else {
              currentJobs.push({ status: data.status } as JobResponse);
            }

            book.jobs = currentJobs;

            if (data.status !== 'completed' && book.complete_books) {
              book.complete_books = [];
            }
          }
        }
      });
    });

    onUnmounted(() => {
      disconnect();
    });
  }
  return {
    getBooks,
    uploadBook,
    listenToBookUpdates
  }
}
