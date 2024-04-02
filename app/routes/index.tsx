import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
import { useLoaderData } from '@remix-run/react'

export async function clientLoader() {
  const farms = await getFarms({ search: undefined })

  return {
    farms,
  }
}

export default function Recibos() {
  const data = useLoaderData<typeof clientLoader>()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: result, isLoading: isLoadingReceipts } = useQuery({
    queryKey: ['recibos', currentPage, search],
    queryFn: () => getReceipts({ search, page: currentPage }),
  })

  const { mutate: deleteReceiptFn } = useMutation({
    mutationFn: deleteReceipt,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['recibos'],
      })
    },
  })

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
            <CreateReciboDialog fazendas={data.farms} />
            <PrintListagem fazendas={data.farms} />
            <PrintRecibos fazendas={data.farms} />
          </div>
        </div>
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
              {isLoadingReceipts && !result && <h1>Skeleton</h1>}

              {result &&
                result.data.map((recibo) => {
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
          {result && (
            <Pagination
              onPageChange={setCurrentPage}
              totalCountOfRegisters={result.totalRecords}
              currentPage={currentPage}
              registersPerPage={result.pageSize}
            />
          )}
        </>
      </div>
    </Container>
  )
}
