import { useState } from 'react'
import { Container } from '~/components/Container'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'phosphor-react'
import { CreateFazendaDialog } from '~/components/Dialogs/Fazendas/CreateFazenda'
import { EditFazendaDialog } from '~/components/Dialogs/Fazendas/EditFazenda'
import { getFarms } from '~/utils/api/get-farms'
import { deleteFarm } from '~/utils/api/delete-farm'

export default function Fazendas() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const { data: result, isLoading: isLoadingFarms } = useQuery({
    queryKey: ['fazendas', search],
    queryFn: () => getFarms({ search }),
  })

  const { mutate: deleteFarmFn } = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fazendas'],
      })
    },
  })

  return (
    <Container classNames="mt-12">
      <div className="rounded-md border border-slate-200 px-3 py-4 shadow-md">
        <div className="flex justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
            className="w-[85%] rounded-md border border-slate-200 bg-transparent px-3 py-2 hover:bg-slate-50"
          />
          <CreateFazendaDialog />
        </div>

        <>
          <table className="mt-4 w-full">
            <thead>
              <tr className="border-b border-slate-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-sm [&_th]:font-medium [&_th]:text-slate-500">
                <th className="text-left">NOME</th>
                <th className="text-left">NOME PAGADOR</th>
                <th className="text-left">ENDERECO PAGADOR</th>
                <th className="text-center">EDITAR</th>
                <th className="text-center">EXCLUIR</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingFarms && !result && <h1>Skeleton</h1>}

              {result &&
                result.map((fazenda) => {
                  return (
                    <tr
                      key={fazenda.id}
                      className="[&_td]:text-md border-b border-slate-200 [&_td]:p-3 [&_td]:font-normal"
                    >
                      <td className="text-left">{fazenda.nome}</td>
                      <td className="text-left">{fazenda.pagadorNome}</td>
                      <td className="text-left">{fazenda.pagadorEndereco}</td>
                      <td className="text-center">
                        <EditFazendaDialog fazendaData={fazenda} />
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() =>
                            window.confirm(
                              'Certeza que deseja deletar esse item?'
                            ) &&
                            deleteFarmFn({
                              id: fazenda.id,
                            })
                          }
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
        </>
      </div>
    </Container>
  )
}
