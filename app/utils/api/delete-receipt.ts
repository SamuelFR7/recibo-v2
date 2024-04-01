import { api } from '../axios'

export async function deleteReceipt({ id }: { id: number }) {
  await api.delete(`/api/recibo/${id}`)
}
