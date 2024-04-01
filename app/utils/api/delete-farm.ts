import { api } from '../axios'

export async function deleteFarm({ id }: { id: number }) {
  await api.delete(`/api/fazenda/${id}`)
}
