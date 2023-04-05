import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Loader } from './components/Loader'
import { Printer, Pencil, Trash } from 'phosphor-react'
import { api } from './services/api'
import { Pagination } from './components/Pagination'
import { Container } from './components/Container'

interface Farm {
  id: number
  nome: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}

interface Receipt {
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

function App() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['recibos', currentPage, search],
    queryFn: async () => {
      return api
        .get<ReceiptsRequest>(
          search
            ? `/api/recibo?nome=${search.toUpperCase()}`
            : `/api/recibo?PageNumber=${currentPage}`,
        )
        .then((res) => res.data)
    },
  })

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
            <button className="bg-sky-400 px-3 py-2 hover:bg-sky-500 text-white rounded-md font-medium">
              Adicionar Recibo
            </button>
            <button className="bg-sky-400 px-3 py-2 hover:bg-sky-500 text-white rounded-md font-medium">
              Imprimir Listagem
            </button>
            <button className="bg-sky-400 px-3 py-2 hover:bg-sky-500 text-white rounded-md font-medium">
              Imprimir Recibos
            </button>
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
                {data.data.map((recibo) => {
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
                        <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
                          <Printer size={16} weight="bold" />
                        </button>
                      </td>
                      <td className="text-center">
                        <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
                          <Pencil size={16} weight="bold" />
                        </button>
                      </td>
                      <td className="text-center">
                        <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
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

export default App
