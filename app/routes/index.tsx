import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Loader } from '~/components/Loader'
import { Printer, Trash } from 'phosphor-react'
import { Pagination } from '~/components/Pagination'
import { Container } from '~/components/Container'
import { CreateReciboDialog } from '~/components/Dialogs/Recibos/CreateRecibo'
import { PrintListagem } from '~/components/Dialogs/Recibos/PrintListagem'
import { PrintRecibos } from '~/components/Dialogs/Recibos/PrintRecibos'
import { EditReciboDialog } from '~/components/Dialogs/Recibos/EditRecibo'
import { getReceipts } from '~/utils/api/get-receipts'
import { getFarms } from '~/utils/api/get-farms'
import { deleteReceipt } from '~/utils/api/delete-receipt'

function Recibos() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['recibos', currentPage, search],
    queryFn: () => getReceipts({ search, page: currentPage }),
  })

  const { data: fazendasData, isLoading: fazendasLoading } = useQuery({
    queryKey: ['fazendas'],
    queryFn: () =>
      getFarms({
        search: undefined,
      }),
  })

  const { mutate: deleteReceiptFn } = useMutation({
    mutationFn: deleteReceipt,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['recibos'],
      })
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
      <div className="rounded-md border border-slate-200 px-3 py-4 shadow-md">
        <div className="flex justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Pesquisar"
            className="w-[60%] rounded-md border border-slate-200 bg-transparent px-3 py-2 hover:bg-slate-50"
          />
          <div className="flex gap-3">
            <CreateReciboDialog fazendas={fazendasData} />
            <PrintListagem fazendas={fazendasData} />
            <PrintRecibos fazendas={fazendasData} />
          </div>
        </div>
        {data && !isLoading ? (
          <>
            <table className="mt-4 w-full">
              <thead>
                <tr className="border-b border-slate-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-sm [&_th]:font-medium [&_th]:text-slate-500">
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
                      className="[&_td]:text-md border-b border-slate-200 [&_td]:p-3 [&_td]:font-normal"
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
                              }/api/relatoriorecibo/unico?id=${recibo.id}`
                            )
                          }
                          className="rounded-md bg-sky-400 px-3 py-2 text-white hover:bg-sky-500"
                        >
                          <Printer size={16} weight="bold" />
                        </button>
                      </td>
                      <td className="text-center">
                        <EditReciboDialog reciboData={recibo} />
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            window.confirm(
                              'Certeza de que deseja deletar este item?'
                            ) && deleteReceiptFn({ id: recibo.id })
                          }}
                          className="rounded-md bg-sky-400 px-3 py-2 text-white hover:bg-sky-500"
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
          <div className="flex h-screen w-full items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </Container>
  )
}

export default Recibos
