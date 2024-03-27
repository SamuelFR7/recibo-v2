import { api } from '../services/api'

export async function deleteReceipt({ id }: { id: number }) {
  await api.delete(`/api/recibo/${id}`)
}
