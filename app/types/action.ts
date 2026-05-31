export type ActionStatus = 'new' | 'pending' | 'processing' | 'completed' | 'failed'
export interface ActionResponse {
  id: number
  status: ActionStatus
  type: string
  updated_at: string
}
