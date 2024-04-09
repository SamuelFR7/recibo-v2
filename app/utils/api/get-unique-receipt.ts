import { api } from '../axios'
import { Receipt } from '../types'

type GetUniqueReceiptRequest = {
  id: number
}

export async function getUniqueReceipt({ id }: GetUniqueReceiptRequest) {
  const response = await api.get<Receipt>(`/api/recibo/${id}`)

  return response.data
}
