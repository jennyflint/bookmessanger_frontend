export interface Character {
  id: number;
  nameKey: string;
  avatar: string | null;
}

export interface RawLine {
  is_dialogue: boolean;
  contentKey: string;
  author_id?: number | null;
  partsKeys?: string[];
}

export interface ChatMessage {
  uid: string;
  type: 'message' | 'system';
  content?: string;
  text?: string;
  name?: string;
  isRight?: boolean;
  color?: string;
  metaText?: string;
  fallbackEmoji?: string;
  avatarUrl?: string | null;
  reactions?: Array<{ emoji: string; count: number }> | null;
}