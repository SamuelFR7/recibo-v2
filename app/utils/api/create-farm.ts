import { api } from '../axios'

type CreateFarmRequest = {
  name: string
  payerName: string
  payerAddress?: string | null
  payerDocument?: string | null
  originFarmId?: number | null
  receiptsDate?: string | null
  copyReceipts: boolean
}

export async function createFarm({
  name,
  payerAddress,
  payerDocument,
  payerName,
  originFarmId,
  receiptsDate,
  copyReceipts,
}: CreateFarmRequest) {
  await api.post(
    '/api/fazenda',
    {
      id: 0,
      nome: name,
      pagadorNome: payerName,
      pagadorEndereco: payerAddress,
      pagadorDocumento: payerDocument,
    },
    {
      params: {
        fazendaOrigemId: copyReceipts ? originFarmId : null,
        dataRecibos: copyReceipts ? receiptsDate : null,
      },
    }
  )
}
