import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateFazendaDialog } from '~/components/dialogs/fazendas/create-fazenda'
import { EditFazendaDialog } from '~/components/dialogs/fazendas/edit-fazenda'
import { getFarms } from '~/utils/api/get-farms'
import { deleteFarm } from '~/utils/api/delete-farm'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Trash } from 'lucide-react'

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
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Fazendas</h1>
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Pesquisar..."
        />
        <CreateFazendaDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[230px]">Nome</TableHead>
              <TableHead className="w-[350px]">Nome Pagador</TableHead>
              <TableHead className="w-[200px]">Endereço Pagador</TableHead>
              <TableHead className="w-[120px] text-center">Editar</TableHead>
              <TableHead className="w-[120px] text-center">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingFarms && !result && <h1>Skeleton</h1>}

            {result &&
              result.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell>{farm.nome}</TableCell>
                  <TableCell>{farm.pagadorNome}</TableCell>
                  <TableCell>{farm.pagadorEndereco}</TableCell>
                  <TableCell className="text-center">
                    <EditFazendaDialog fazendaData={farm} />
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() =>
                        window.confirm(
                          'Certeza que deseja deletar esse item?'
                        ) &&
                        deleteFarmFn({
                          id: farm.id,
                        })
                      }
                      className="rounded-md bg-sky-400 px-3 py-2 text-white hover:bg-sky-500"
                    >
                      <Trash size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}

            {result && result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
