
import type { ApiComposable, ApiOptions } from '@/types/api'
/**
 * 
 * Example request for ssr
 * const { data, pending, error } = await useAsyncData('users-list', () => 
 * api.get('/users')
 *  )
 */

export const useApi = (): ApiComposable => {
  const config = useRuntimeConfig()

  const apiBase = config.public.apiBase as string
  const apiVersion = config.public.defaultApiVersion as string
  const baseURL = `${apiBase}/api/${apiVersion}`

  const request = async <T>(
    url: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<T>(url, {
        baseURL,
        ...options,
      })

      return response
    } catch (error: unknown) {
      console.error('[API ERROR]', error)
      throw error
    }
  }

  return {
    get: <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
      request<T>(url, { method: 'GET', params }),

    post: <T>(url: string, body?: unknown): Promise<T> =>
      request<T>(url, { method: 'POST', body }),

    put: <T>(url: string, body?: unknown): Promise<T> =>
      request<T>(url, { method: 'PUT', body }),

    delete: <T>(url: string): Promise<T> =>
      request<T>(url, { method: 'DELETE' }),
  }
}
