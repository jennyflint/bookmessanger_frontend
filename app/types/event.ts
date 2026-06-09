import type { ActionStatus } from '~/types/action'
export type SocketConvertStatus = 'processing' | 'completed' | 'failed' | 'removed' | 'new';

export interface BookConvertedEvent {
  type: 'book_converted'
  book_id: number
  convert_item_id: number
  status: SocketConvertStatus
}

export interface CreateBookModelEvent {
  type: 'create_book_model'
  book_id: number
  status: ActionStatus
}

export type WebSocketPayload = BookConvertedEvent | CreateBookModelEvent
