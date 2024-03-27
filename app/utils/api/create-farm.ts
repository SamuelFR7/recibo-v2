import { api } from '../services/api'

type CreateFarmRequest = {
  name: string
  payerName: string
  payerAddress?: string | null
  payerDocument?: string | null
}

export async function createFarm({
  name,
  payerAddress,
  payerDocument,
  payerName,
}: CreateFarmRequest) {
  await api.post('/api/fazenda', {
    id: 0,
    Nome: name,
    PagadorNome: payerName,
    PagadorEndereco: payerAddress,
    PagadorDocumento: payerDocument,
  })
}
