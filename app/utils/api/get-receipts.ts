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
  farmId,
}: {
  search?: string
  page: number
  farmId: number
}) {
  const response = await api.get<GetReceiptsResponse>('/api/recibo', {
    params: {
      nome: search,
      PageNumber: page,
      FazendaId: farmId === 0 ? undefined : farmId,
    },
  })

  return response.data
}
