import type {
  BookDetailResponse,
  BookParseResponse,
  ParserMode,
  ParserOptionsResponse,
  ReparseBookParams,
} from '@/types/book'
import type { RequestParams, PaginatedResponse } from '~/types/api'
import { usesLlm } from '~/utils/parserMode'

export const useBookService = (): {
  getBooks: (params?: RequestParams) => Promise<PaginatedResponse<BookDetailResponse>>
  uploadBook: (file: File, parserMode?: ParserMode, llmProvider?: string | null) => Promise<BookParseResponse>
  reparseBook: (id: number, options?: ReparseBookParams) => Promise<BookParseResponse>
  getParserOptions: () => Promise<ParserOptionsResponse>
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
  const uploadBook = (
    file: File,
    parserMode: ParserMode = 'spacy',
    llmProvider?: string | null
  ): Promise<BookParseResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('parser_mode', parserMode)
    // The backend expects llm_provider only together with an LLM mode
    if (usesLlm(parserMode) && llmProvider) {
      formData.append('llm_provider', llmProvider)
    }

    return api.post<BookParseResponse>('/book/upload', formData)
  }

  /**
   * Start parsing the book again. Without options the backend reuses
   * the mode and provider saved with the book.
   */
  const reparseBook = (id: number, options?: ReparseBookParams): Promise<BookParseResponse> => {
    let body: ReparseBookParams | undefined
    if (options?.parser_mode) {
      body = { parser_mode: options.parser_mode }
      if (usesLlm(options.parser_mode) && options.llm_provider) {
        body.llm_provider = options.llm_provider
      }
    }

    return api.post<BookParseResponse>(`/book/parse/${id}`, body)
  }

  const getParserOptions = (): Promise<ParserOptionsResponse> => {
    return api.get<ParserOptionsResponse>('/book/parser/options')
  }

  const deleteBook = (id: number): Promise<string> => {
    const response = api.delete<string>(`/book/delete/${id}`)
    return response || ''
  }
  return {
    getBooks,
    uploadBook,
    reparseBook,
    getParserOptions,
    deleteBook,
  }
}
