import { useMutation, useQuery } from '@tanstack/react-query'
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
import { Pencil, PlusCircle, Trash } from 'lucide-react'
import { Link, useSearchParams } from '@remix-run/react'
import { cn } from '~/utils/utils'
import { Button, buttonVariants } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

export default function FarmsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') || undefined

  const { data: result, isLoading: isLoadingFarms } = useQuery({
    queryKey: ['fazendas', search],
    queryFn: () => getFarms({ search }),
  })

  const { mutate: deleteFarmFn } = useMutation({
    mutationFn: deleteFarm,
  })

  function handleSearch(v: string) {
    setSearchParams((prev) => {
      prev.set('q', v)

      return prev
    })
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Fazendas</h1>
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Input
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="Pesquisar..."
        />
        <Link
          to="/fazendas/novo"
          prefetch="intent"
          className={cn(buttonVariants(), 'w-full md:w-[150px]')}
        >
          <PlusCircle className="mr-2 h-3.5 w-3.5" />
          Nova fazenda
        </Link>
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
            {isLoadingFarms && !result && <FarmsTableSkeleton />}

            {result &&
              result.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell>{farm.nome}</TableCell>
                  <TableCell>{farm.pagadorNome}</TableCell>
                  <TableCell>{farm.pagadorEndereco}</TableCell>
                  <TableCell className="text-center">
                    <Link
                      to={`/fazendas/${farm.id}`}
                      className={cn(
                        buttonVariants({
                          size: 'icon',
                          variant: 'outline',
                        })
                      )}
                      prefetch="intent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() =>
                        window.confirm(
                          'Certeza que deseja deletar esse item?'
                        ) &&
                        deleteFarmFn({
                          id: farm.id,
                        })
                      }
                      size="icon"
                      variant="outline"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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

function FarmsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-[220px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[320px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[180px]" />
            </TableCell>
            <TableCell className="text-center">
              <Button disabled variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell className="text-center">
              <Button disabled variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
