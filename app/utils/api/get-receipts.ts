import { api } from '../services/api'
import { Receipt } from '../types'

type GetReceiptsResponse = {
  pageNumber: number
  pageSize: number
  firstPage: string
  lastPage: string
  totalPages: number
  totalRecords: 5
  nextPage: null
  previousPage: null
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
