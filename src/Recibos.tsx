import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Loader } from './components/Loader'
import { Printer, Pencil, Trash } from 'phosphor-react'
import { api } from './services/api'
import { Pagination } from './components/Pagination'
import { Container } from './components/Container'
import { CreateReciboDialog } from './components/Dialogs/Recibos/CreateRecibo'
import { PrintListagem } from './components/Dialogs/Recibos/PrintListagem'
import { PrintRecibos } from './components/Dialogs/Recibos/PrintRecibos'
import { EditReciboDialog } from './components/Dialogs/Recibos/EditRecibo'

export interface Farm {
  id: number
  nome: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}

export interface Receipt {
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

interface ReceiptsRequest {
  pageNumber: number
  pageSize: number
  firstPage: string
  lastPage: string
  totalPages: number
  totalRecords: 5
  nextPage: null
  previousPage: null
  data: Receipt[]
}

function Recibos() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['recibos', currentPage, search],
    queryFn: async () => {
      return api
        .get<ReceiptsRequest>(
          search
            ? `/api/recibo?nome=${search.toUpperCase()}&PageNumber=${currentPage}`
            : `/api/recibo?PageNumber=${currentPage}`,
        )
        .then((res) => res.data)
    },
  })

  const { data: fazendasData, isLoading: fazendasLoading } = useQuery({
    queryKey: ['fazendas'],
    queryFn: async () => {
      return api.get<Farm[]>('/api/fazenda').then((res) => res.data)
    },
  })

  const deleteRecibo = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/api/recibo/${id}`).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recibos'])
    },
  })

  if (!fazendasData || fazendasLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <Container classNames="mt-12">
      <div className="py-4 px-3 rounded-md border border-slate-200 shadow-md">
        <div className="flex justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Pesquisar"
            className="bg-transparent border hover:bg-slate-50 border-slate-200 rounded-md px-3 w-[60%] py-2"
          />
          <div className="flex gap-3">
            <CreateReciboDialog fazendas={fazendasData} />
            <PrintListagem fazendas={fazendasData} />
            <PrintRecibos fazendas={fazendasData} />
          </div>
        </div>
        {data && !isLoading ? (
          <>
            <table className="w-full mt-4">
              <thead>
                <tr className="[&_th]:py-2 [&_th]:px-3 [&_th]:text-slate-500 [&_th]:font-medium [&_th]:text-sm border-b border-slate-200">
                  <th className="text-left">FAZENDA</th>
                  <th className="text-left">BENEFICIARIO</th>
                  <th className="text-left">NUMERO</th>
                  <th className="text-left">VALOR</th>
                  <th className="text-center">IMPRIMIR</th>
                  <th className="text-center">EDITAR</th>
                  <th className="text-center">EXCLUIR</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((recibo, index) => {
                  return (
                    <tr
                      className="[&_td]:p-3 [&_td]:font-normal [&_td]:text-md border-b border-slate-200"
                      key={recibo.id}
                    >
                      <td className="text-left">{recibo.fazenda.nome}</td>
                      <td className="text-left">{recibo.beneficiarioNome}</td>
                      <td className="text-left">{recibo.numero}</td>
                      <td className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(recibo.valor)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            window.open(
                              `${
                                import.meta.env.VITE_API_ADDRESS
                              }/api/relatoriorecibo/unico?id=${recibo.id}`,
                            )
                          }
                          className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md"
                        >
                          <Printer size={16} weight="bold" />
                        </button>
                      </td>
                      <td className="text-center">
                        <EditReciboDialog reciboData={recibo}>
                          <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
                            <Pencil size={16} weight="bold" />
                          </button>
                        </EditReciboDialog>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            window.confirm(
                              'Certeza de que deseja deletar este item?',
                            ) && deleteRecibo.mutate(recibo.id)
                          }}
                          className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md"
                        >
                          <Trash size={16} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <Pagination
              onPageChange={setCurrentPage}
              totalCountOfRegisters={data.totalRecords}
              currentPage={currentPage}
              registersPerPage={data.pageSize}
            />
          </>
        ) : (
          <div className="h-screen w-full flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </Container>
  )
}

export default Recibos
