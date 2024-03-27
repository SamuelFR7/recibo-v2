import { api } from '../services/api'

export async function deleteFarm({ id }: { id: number }) {
  await api.delete(`/api/fazenda/${id}`)
}
