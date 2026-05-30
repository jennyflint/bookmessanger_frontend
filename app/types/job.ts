export type JobStatus = 'new' | 'pending' | 'processing' | 'completed' | 'failed'
export interface JobResponse {
  id: number
  status: JobStatus
  updated_at: string
}
