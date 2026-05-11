
type SafeBody = Record<string, unknown> | unknown[] | BodyInit | null | undefined


export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
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
}