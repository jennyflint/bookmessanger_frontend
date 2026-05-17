import { useUserStore } from '@/stores/user'
export const useNotificationSocket = (): {
  connect: (onMessageCallback: (data: unknown) => void) => void
  disconnect: () => void
  isConnected: Ref<boolean>
} => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)

  const connect = (onMessageCallback: (data: unknown) => void): void => {
    if (!import.meta.client) return
    const apiBaseUrl = config.public.apiBase

    let apiHost = config.public.apiBase
    try {
      const parsedUrl = new URL(apiBaseUrl, window.location.origin)
      apiHost = parsedUrl.host
    } catch {
      console.warn('Could not parse apiBase, falling back to ' + apiHost)
    }

    const token = userStore.accessToken
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsUrl = `${protocol}://${apiHost}/ws/notifications?token=${token}`
    console.warn('Connecting to WS:', wsUrl)

    socket.value = new WebSocket(wsUrl)

    socket.value.onopen = (): void => {
      console.warn('WS Connected')
      isConnected.value = true
    }

    socket.value.onmessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data) as unknown
        onMessageCallback(data)
      } catch (e) {
        console.error('WS Parse Error:', e)
      }
    }

    socket.value.onclose = (): void => {
      console.warn('WS Disconnected. Retrying...')
      isConnected.value = false
      setTimeout(() => connect(onMessageCallback), 5000)
    }

    socket.value.onerror = (err: Event): void => {
      console.error('WS Error:', err)
      socket.value?.close()
    }
  }

  const disconnect = (): void => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    isConnected
  }
}