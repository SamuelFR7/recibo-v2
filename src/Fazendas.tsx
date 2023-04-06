import { useState } from 'react'
import { Container } from './components/Container'
import { useQuery } from '@tanstack/react-query'
import { api } from './services/api'
import { Farm } from './Recibos'
import { Loader } from './components/Loader'
import { Pencil, Trash } from 'phosphor-react'

export default function Fazendas() {
  const [search, setSearch] = useState('')
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
          <button className="bg-sky-400 px-3 py-2 hover:bg-sky-500 text-white rounded-md font-medium">
            Adicionar Fazenda
          </button>
        </div>
        {data && !isLoading ? (
          <>
            <table className="w-full mt-4">
              <thead>
                <tr className="[&_th]:py-2 [&_th]:px-3 [&_th]:text-slate-500 [&_th]:font-medium [&_th]:text-sm border-b border-slate-200">
                  <th className="text-left">NOME</th>
                  <th className="text-left">NOME PAGADOR</th>
                  <th className="text-left">ENDERECO PAGADOR</th>
                  <th className="text-left">OPÇÕES</th>
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
                      <td className="flex gap-2 items-center">
                        <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
                          <Pencil size={16} weight="bold" />
                        </button>
                        <button className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-3 rounded-md">
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
