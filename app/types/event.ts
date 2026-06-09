export type SocketConvertStatus = 'processing' | 'completed' | 'failed' | 'removed' | 'new';

export interface BookConvertedEvent {
  type: 'book_converted';
  book_id: number;
  convert_item_id: number;
  status: SocketConvertStatus;
}

export type WebSocketPayload = BookConvertedEvent;