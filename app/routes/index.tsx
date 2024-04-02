import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getReceipts } from '~/utils/api/get-receipts'
import { getFarms } from '~/utils/api/get-farms'
import { deleteReceipt } from '~/utils/api/delete-receipt'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { cn, formatValue } from '~/utils/utils'
import { Pencil, PlusCircle, Printer, Trash } from 'lucide-react'
import { Button, buttonVariants } from '~/components/ui/button'
import { env } from '~/utils/env'
import { PrintListDialog } from '~/components/dialogs/print-list-dialog'
import { PrintReceiptsDialog } from '~/components/dialogs/print-receipts-dialog'
import { z } from 'zod'
import { Pagination } from '~/components/pagination'

export async function clientLoader() {
  const farms = await getFarms({ search: undefined })

  return {
    farms,
  }
}

export default function Recibos() {
  const data = useLoaderData<typeof clientLoader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const search = searchParams.get('q') || undefined
  const page = z.coerce.number().parse(searchParams.get('page') || '1')

  const { data: result, isLoading: isLoadingReceipts } = useQuery({
    queryKey: ['recibos', page, search],
    queryFn: () => getReceipts({ search, page }),
  })

  const { mutate: deleteReceiptFn } = useMutation({
    mutationFn: deleteReceipt,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['recibos'],
      })
    },
  })

  function handleSearch(v: string) {
    setSearchParams((prev) => {
      prev.set('q', v)
      prev.set('page', '1')

      return prev
    })
  }

  function handlePaginate(page: number) {
    setSearchParams((prev) => {
      prev.set('page', page.toString())

      return prev
    })
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Recibos</h1>
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Input
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="Pesquisar..."
        />
        <Link
          to="/recibos/novo"
          className={cn(buttonVariants())}
          prefetch="intent"
        >
          <PlusCircle className="mr-2 h-3.5 w-3.5" />
          Novo recibo
        </Link>
        <PrintListDialog farms={data.farms} />
        <PrintReceiptsDialog farms={data.farms} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Fazenda</TableHead>
              <TableHead className="w-[400px]">Beneficiario</TableHead>
              <TableHead className="w-[120px]">Numero</TableHead>
              <TableHead className="w-[150px] text-right">Valor</TableHead>
              <TableHead className="w-[250px] text-center">Imprimir</TableHead>
              <TableHead className="w-[200px] text-center">Editar</TableHead>
              <TableHead className="w-[200px] text-center">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingReceipts && !result && <h1>Skeleton</h1>}

            {result &&
              result.data.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>{receipt.fazenda.nome}</TableCell>
                  <TableCell>{receipt.beneficiarioNome}</TableCell>
                  <TableCell>{receipt.numero}</TableCell>
                  <TableCell className="text-right">
                    {formatValue(receipt.valor)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() =>
                        window.open(
                          `${env.VITE_API_URL}/api/relatoriorecibo/unico?id=${receipt.id}`
                        )
                      }
                      size="icon"
                      variant="outline"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      to={`/recibos/${receipt.id}`}
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
                      onClick={() => {
                        window.confirm(
                          'Certeza de que deseja deletar este item?'
                        ) && deleteReceiptFn({ id: receipt.id })
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {result && result.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {result && (
        <Pagination
          onPageChange={handlePaginate}
          currentPage={page}
          perPage={result.pageSize}
          totalCount={result.totalRecords}
        />
      )}
    </>
  )
}
