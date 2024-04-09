import { api } from '../axios'

type UpdateFarmRequest = {
  id: number
  name: string
  payerName: string
  payerAddress?: string | null
  payerDocument?: string | null
}

export async function updateFarm({
  id,
  name,
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
