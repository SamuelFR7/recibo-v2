import { api } from '../axios'
import { Receipt } from '../types'

export type GetReceiptsResponse = {
  pageNumber: number
  pageSize: number
  firstPage: string
  lastPage: string
  totalPages: number
  totalRecords: number
  nextPage: string | null
  previousPage: string | null
  data: Receipt[]
}

export async function getReceipts({
  search,
  page,
}: {
  search?: string
  page: number
}) {
  const response = await api.get<GetReceiptsResponse>('/api/recibo', {
    params: {
      nome: search,
      PageNumber: page,
    },
  })

  return response.data
}
