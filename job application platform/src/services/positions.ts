import api from './api'

export interface Position {
  id: number
  title: string
  category: string
  workType: string
  location?: string
  description?: string
}

export interface PaginatedPositions {
  data: Position[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getPositions(page = 1, limit = 20, category?: string): Promise<PaginatedPositions> {
  const res = await api.get('/positions', { params: { page, limit, category } })
  return res.data
}

export async function getPosition(id: number): Promise<Position | undefined> {
  const res = await api.get(`/positions/${id}`)
  return res.data
}
