export interface BookPaginationProps {
  offset: number | undefined | null
  limit: number | undefined | null
  total: number | undefined | null
  pending?: boolean
}

export type NotificationType = "success" | "error" | "default"

export interface NotificationProps {
  title?: string;
  message: string;
  type?: NotificationType;
}