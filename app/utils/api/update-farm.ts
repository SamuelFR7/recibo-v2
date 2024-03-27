import { api } from '../services/api'

type UpdateFarmRequest = {
  id: number
  payerName: string
  payerAddress?: string | null
  payerDocument?: string | null
}

export async function updateFarm({
  id,
  payerName,
  payerAddress,
  payerDocument,
}: UpdateFarmRequest) {
  await api.put('/api/fazenda', {
    id: id,
    Nome: name,
    PagadorNome: payerName,
    PagadorEndereco: payerAddress,
    PagadorDocumento: payerDocument,
  })
}
