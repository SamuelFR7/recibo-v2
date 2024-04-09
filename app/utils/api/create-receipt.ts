import { api } from '../axios'

type CreateReceiptRequest = {
  farmId: number
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

export async function createReceipt({
  date,
  farmId,
  payerName,
  recipientName,
  value,
  historic,
  payerAddress,
  payerDocument,
  recipientAddress,
  recipientDocument,
}: CreateReceiptRequest) {
  const response = await api.post('/api/recibo', {
    Id: '0',
    fazenda: {
      Id: farmId,
      Nome: '.',
      PagadorNome: '',
      PagadorEndereco: '',
      PagadorDocumento: '',
    },
    Numero: '0',
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
