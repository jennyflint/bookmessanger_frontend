import type { ApiComposable, ApiOptions, SafeBody, RefreshResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'
import type { FetchError } from 'ofetch'

let refreshPromise: Promise<void> | null = null

/**
 * Example request for ssr
 * const { data, pending, error } = await useAsyncData('users-list', () =>
 *   api.get('/users')
 * )
 */

export const useApi = (): ApiComposable => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const apiBase = import.meta.server ? config.apiBase : config.public.apiBase
  const apiVersion = config.public.defaultApiVersion
  const baseURL = `${apiBase}/${apiVersion}`

  const request = async <T>(url: string, options: ApiOptions = {}, isRetry = false): Promise<T> => {
    const fetchOptions: Parameters<typeof $fetch>[1] = {
      baseURL,
      ...options,
      method: (options.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      onRequest(context) {
        context.options.headers = new Headers(context.options.headers || {})
        if (userStore.accessToken) {
          context.options.headers.set('Authorization', `Bearer ${userStore.accessToken}`)
        }
      }
    }

    try {
      return await $fetch<T>(url, fetchOptions)
    } catch (error: unknown) {
      const fetchError = error as FetchError

      if (fetchError.response?.status === 401 && !isRetry) {
        if (!userStore.refreshToken) {
          userStore.logout()
          navigateTo('/auth/login')
        }


        refreshPromise ??= $fetch<RefreshResponse>('/auth/refresh/token', {
          baseURL,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userStore.refreshToken}`
          }
        })
          .then((res) => {
            userStore.accessToken = res.access_token
            userStore.refreshToken = res.refresh_token
          })
          .catch((refreshError: unknown) => {
            userStore.logout()
            navigateTo('/auth/login')
            throw refreshError
          })
          .finally(() => {
            refreshPromise = null
          })

        await refreshPromise
        return request<T>(url, options, true)
      }

      console.error('[API ERROR]', fetchError)
      throw fetchError
    }
  }

  return {
    get: <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
      request<T>(url, {
        method: 'GET',
        ...(params ? { params } : {})
      }),

    post: <T>(url: string, body?: SafeBody): Promise<T> =>
      request<T>(url, {
        method: 'POST',
        body
      }),

    put: <T>(url: string, body?: SafeBody): Promise<T> =>
      request<T>(url, {
        method: 'PUT',
        body
      }),

    delete: <T>(url: string): Promise<T> => request<T>(url, { method: 'DELETE' })
  }
}
