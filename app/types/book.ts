import type { ActionResponse } from "./action";

export type ExportBookFormat = 'html' | 'pdf' | 'epub'
export type DownloadBookStatus = 'new' | 'pending' | 'completed' | 'failed' | 'removed'
export type ParserMode = 'spacy' | 'llm'

export interface ParserOption<T extends string = string> {
  value: T
  label: string
}

/** Response of GET /book/parser/options */
export interface ParserOptionsResponse {
  modes: ParserOption<ParserMode>[]
  llm_providers: ParserOption[]
  default_mode: ParserMode
  default_llm_provider: string | null
}

/** Body of POST /book/parse/{book_id}. Empty means "use the values saved with the book". */
export type ReparseBookParams = {
  parser_mode?: ParserMode
  llm_provider?: string
}

/** Response of POST /book/upload and POST /book/parse/{book_id} */
export interface BookParseResponse {
  id: number
  name: string
  parser_mode: ParserMode
  llm_provider: string | null
}

export interface CompleteBookResponse {
  id: number;
  name: string;
  created_at: string; // ISO 8601 string, e.g., "2023-10-25T14:30:00Z"
  updated_at: string;
}

export interface BookDetailResponse {
  id: number;
  original_name: string;
  created_at: string;
  updated_at: string;
  complete_books: CompleteBookResponse[];
  actions: ActionResponse[];
  parser_mode: ParserMode;
  llm_provider: string | null;
}

export type DownloadBookParams = {
  format: ExportBookFormat
  characters: object[]
  template: string
}

export type DownloadBook = {
  id: number;
  name: string;
  status: DownloadBookStatus;
  format: ExportBookFormat;
  created_at: string;
  updated_at: string;
}