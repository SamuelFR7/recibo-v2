import { api } from '../services/api'
import { Farm } from '../types'

export async function getFarms({ search }: { search?: string }) {
  const response = await api.get<Farm[]>('/api/fazenda', {
    params: {
      nome: search,
    },
  })

  return response.data
}
