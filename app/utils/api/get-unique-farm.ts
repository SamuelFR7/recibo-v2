import { api } from '../axios'
import { Farm } from '../types'

type GetUniqueFarmRequest = {
  id: number
}

export async function getUniqueFarm({ id }: GetUniqueFarmRequest) {
  const response = await api.get<Farm>(`/api/fazenda/${id}`)

  return response.data
}
