export type SafeBody = Record<string, unknown> | unknown[] | BodyInit | null | undefined
export type ApiMethod =| 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' 
  | 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface ApiOptions {
  method?: ApiMethod
  params?: Record<string, unknown>
  body?: SafeBody
  headers?: HeadersInit | Record<string, string>
  [key: string]: unknown 
}

export interface ApiComposable {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>
  post: <T>(url: string, body?: SafeBody) => Promise<T>
  put: <T>(url: string, body?: SafeBody) => Promise<T>
  delete: <T>(url: string) => Promise<T>
  download: (url: string) => Promise<void>
}

export interface RequestParams {
  limit?: number;
  offset?: number;
  sort_by?: 'id' | 'original_name' | 'created_at';
  sort_desc?: boolean;
  filter_name?: string | null;
}

export interface ApiMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiMeta;
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
}