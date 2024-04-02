import { api } from '../axios'
import { Farm } from '../types'

type UpdateReceiptRequest = {
  id: number
  number: number
  farm: Farm
  date: string
  value: number
  historic?: string | null
  recipientName: string
  recipientAddress?: string | null
  recipientDocument?: string | null
  payerName: string
  payerAddress?: string | null
  payerDocument?: string | null
}

export async function updateReceipt({
  date,
  farm,
  id,
  number,
  payerName,
  recipientName,
  value,
  historic,
  payerAddress,
  payerDocument,
  recipientAddress,
  recipientDocument,
}: UpdateReceiptRequest) {
  const response = await api.put('/api/recibo', {
    Id: id,
    Numero: number,
    Fazenda: farm,
    Data: new Date(date),
    Valor: value,
    Historico: historic,
    BeneficiarioNome: recipientName,
    BeneficiarioEndereco: recipientAddress,
    BeneficiarioDocumento: recipientDocument,
    PagadorNome: payerName,
    PagadorEndereco: payerAddress,
    PagadorDocumento: payerDocument,
  })

  return response.data
}
