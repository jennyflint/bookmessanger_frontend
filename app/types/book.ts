import type { ActionResponse } from "./action";

export type ExportBookFormat = 'html' | 'pdf'

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
}

export type DownloadBookParams = {
  format: ExportBookFormat
  characters: object[]
  template: string
}