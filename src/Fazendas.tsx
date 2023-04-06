import { useState } from 'react'
import { Container } from './components/Container'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './services/api'
import { Farm } from './Recibos'
import { Loader } from './components/Loader'
import { Trash } from 'phosphor-react'
import { CreateFazendaDialog } from './components/Dialogs/Fazendas/CreateFazenda'
import { EditFazendaDialog } from './components/Dialogs/Fazendas/EditFazenda'

export default function Fazendas() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['fazendas', search],
    queryFn: async () => {
      return api
        .get<Farm[]>(
          search ? `/api/fazenda?nome=${search.toUpperCase()}` : '/api/fazenda',
        )
        .then((res) => res.data)
    },
  })

  const deleteFarm = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/api/fazenda/${id}`).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fazendas'])
    },
  })

  return (
    <Container classNames="mt-12">
      <div className="py-4 px-3 rounded-md border border-slate-200 shadow-md">
        <div className="flex justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
            className="bg-transparent border hover:bg-slate-50 border-slate-200 rounded-md px-3 w-[85%] py-2"
          />
          <CreateFazendaDialog />
        </div>
        {data && !isLoading ? (
          <>
            <table className="w-full mt-4">
              <thead>
                <tr className="[&_th]:py-2 [&_th]:px-3 [&_th]:text-slate-500 [&_th]:font-medium [&_th]:text-sm border-b border-slate-200">
                  <th className="text-left">NOME</th>
                  <th className="text-left">NOME PAGADOR</th>
                  <th className="text-left">ENDERECO PAGADOR</th>
                  <th className="text-center">EDITAR</th>
                  <th className="text-center">DELETAR</th>
                </tr>
              </thead>
              <tbody>
                {data.map((fazenda) => {
                  return (
                    <tr
                      key={fazenda.id}
                      className="[&_td]:p-3 [&_td]:font-normal [&_td]:text-md border-b border-slate-200"
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
                              'Certeza que deseja deletar esse item?',
                            ) && deleteFarm.mutate(fazenda.id)
                          }
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
