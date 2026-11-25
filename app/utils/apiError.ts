import type { FetchError } from 'ofetch'

interface ValidationErrorItem {
  msg?: string
}

/** HTTP status code of a failed API request, if there is one. */
export const getApiErrorStatus = (error: unknown): number | undefined => {
  const fetchError = error as Partial<FetchError> | null
  return fetchError?.response?.status ?? fetchError?.statusCode
}

/**
 * Human-readable `detail` from a backend error response.
 * Handles both a plain string and a FastAPI validation error list.
 */
export const getApiErrorDetail = (error: unknown): string | null => {
  const data = (error as Partial<FetchError> | null)?.data as { detail?: unknown } | undefined
  const detail = data?.detail

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: ValidationErrorItem | string) => (typeof item === 'string' ? item : item?.msg))
      .filter((msg): msg is string => typeof msg === 'string' && msg.length > 0)
    return messages.length ? messages.join('; ') : null
  }

  return null
}

/**
 * `detail` only when the backend sent a plain string message.
 * FastAPI validation errors (an array) return null, so the caller
 * can show its own generic text instead of technical field paths.
 */
export const getApiErrorMessage = (error: unknown): string | null => {
  const data = (error as Partial<FetchError> | null)?.data as { detail?: unknown } | undefined
  const detail = data?.detail
  return typeof detail === 'string' && detail.trim() ? detail : null
}
