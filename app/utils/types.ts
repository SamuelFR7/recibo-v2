export type Farm = {
  id: number
  nome: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}

export type Receipt = {
  id: number
  fazenda: Farm
  numero: number
  data: Date
  valor: number
  historico: string
  beneficiarioNome: string
  beneficiarioEndereco: string
  beneficiarioDocumento: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}
