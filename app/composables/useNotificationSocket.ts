import { useUserStore } from '@/stores/user'

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const listeners = new Set<(data: unknown) => void>()
let isIntentionalDisconnect = false
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

export const useNotificationSocket = (): {
  connect: <T = unknown>(onMessageCallback: (data: T) => void) => () => void
  disconnect: () => void
  isConnected: Ref<boolean>
} => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const establishConnection = (): void => {
    if (!import.meta.client || socket.value) return

    isIntentionalDisconnect = false
    const apiBaseUrl = config.public.apiBase

    let apiHost = apiBaseUrl
    try {
      const parsedUrl = new URL(apiBaseUrl, window.location.origin)
      apiHost = parsedUrl.host
    } catch {
      console.warn('Could not parse apiBase, falling back to ' + apiHost)
    }

    const token = userStore.accessToken
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsUrl = `${protocol}://${apiHost}/ws/notifications?token=${token}`
    socket.value = new WebSocket(wsUrl)

    socket.value.onopen = (): void => {
      isConnected.value = true
    }

    socket.value.onmessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data)
        listeners.forEach(callback => callback(data))
      } catch (e) {
        console.error('WS Parse Error:', e)
      }
    }

    socket.value.onclose = (): void => {
      isConnected.value = false
      socket.value = null

      if (!isIntentionalDisconnect) {
        console.warn('WS Disconnected. Retrying in 5s...')
        reconnectTimeout = setTimeout(() => {
          establishConnection()
        }, 5000)
      }
    }

    socket.value.onerror = (err: Event): void => {
      console.error('WS Error:', err)
      socket.value?.close()
    }
  }

  const connect = <T = unknown>(onMessageCallback: (data: T) => void): (() => void) => {
    if (!import.meta.client) return () => {}

    listeners.add(onMessageCallback as (data: unknown) => void)

    if (!socket.value) {
      establishConnection()
    }

    return () => {
      listeners.delete(onMessageCallback as (data: unknown) => void)
    }
  }

  const disconnect = (): void => {
    isIntentionalDisconnect = true
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    listeners.clear()
    isConnected.value = false
  }

  return {
    connect,
    disconnect,
    isConnected
  }
}