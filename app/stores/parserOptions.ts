import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ParserMode, ParserOption, ParserOptionsResponse } from '@/types/book'
import { useBookService } from '~/services/bookService'

const KNOWN_MODES: ParserMode[] = ['spacy', 'llm']

/** Used for books parsed with a provider that is no longer offered by the backend */
const KNOWN_PROVIDER_LABELS: Record<string, string> = {
  deepseek: 'DeepSeek',
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  groq: 'Groq',
  mistral: 'Mistral',
  openrouter: 'OpenRouter',
  ollama: 'Ollama',
  llamacpp: 'llama.cpp',
}

/**
 * Parser options (GET /book/parser/options), loaded once and cached.
 * If loading fails, only spaCy stays available, so uploads are never blocked.
 */
export const useParserOptionsStore = defineStore('parserOptions', () => {
  const options = ref<ParserOptionsResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let pendingRequest: Promise<void> | null = null

  const fetchOptions = (force = false): Promise<void> => {
    if (options.value && !force) return Promise.resolve()

    pendingRequest ??= (async (): Promise<void> => {
      isLoading.value = true
      error.value = null
      try {
        options.value = await useBookService().getParserOptions()
      } catch (err: unknown) {
        error.value = (err as Error)?.message || 'Cannot fetch parser options'
        console.error(err)
      } finally {
        isLoading.value = false
        pendingRequest = null
      }
    })()

    return pendingRequest
  }

  /** True once a request has finished, successfully or not. */
  const isResolved = computed<boolean>(() => !isLoading.value && (options.value !== null || error.value !== null))

  const llmProviders = computed<ParserOption[]>(() => options.value?.llm_providers ?? [])

  const isLlmAvailable = computed<boolean>(() =>
    !!options.value?.modes?.some((mode) => mode.value === 'llm') && llmProviders.value.length > 0
  )

  const availableModes = computed<ParserMode[]>(() => {
    const fromBackend = (options.value?.modes ?? [])
      .map((mode) => mode.value)
      .filter((mode): mode is ParserMode => KNOWN_MODES.includes(mode))
      .filter((mode) => mode !== 'llm' || isLlmAvailable.value)

    return fromBackend.includes('spacy') ? fromBackend : ['spacy', ...fromBackend]
  })

  const defaultProvider = computed<string | null>(() => {
    const preferred = options.value?.default_llm_provider
    if (preferred && llmProviders.value.some((provider) => provider.value === preferred)) {
      return preferred
    }
    return llmProviders.value[0]?.value ?? null
  })

  const getProviderLabel = (value: string | null | undefined): string | null => {
    if (!value) return null
    return llmProviders.value.find((provider) => provider.value === value)?.label
      ?? KNOWN_PROVIDER_LABELS[value]
      ?? value
  }

  return {
    options,
    isLoading,
    error,
    isResolved,
    llmProviders,
    isLlmAvailable,
    availableModes,
    defaultProvider,
    fetchOptions,
    getProviderLabel,
  }
})
