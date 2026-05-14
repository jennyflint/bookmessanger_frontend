export interface BookPaginationProps {
  offset: number | undefined | null
  limit: number | undefined | null
  total: number | undefined | null
  pending?: boolean
}