import * as Dialog from '@radix-ui/react-dialog'
import { Farm } from '../../../Recibos'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Select } from '../../Form/Select'
import { X } from 'phosphor-react'

interface PrintListagemProps {
  fazendas: Farm[]
}

const printListagemSchema = z.object({
  fazenda: z
    .string()
    .transform((arg) => Number(arg))
    .refine((arg) => arg >= 0, { message: 'Selecione uma fazenda' }),
})

type PrintListagemSchema = z.infer<typeof printListagemSchema>

export function PrintListagem({ fazendas }: PrintListagemProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PrintListagemSchema>({
    resolver: zodResolver(printListagemSchema),
    defaultValues: {
      fazenda: 0,
    },
  })

  const handlePrintListagem: SubmitHandler<PrintListagemSchema> = (values) => {
    window.open(
      `${import.meta.env.VITE_API_ADDRESS}/api/relatoriolistagem?FazendaId=${
        values.fazenda
      }`
    )
  }

  useEffect(() => {
    reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-md bg-sky-400 px-3 py-2 font-medium text-white hover:bg-sky-500">
          Imprimir Listagem
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6">
          <Dialog.Title className="text-2xl font-bold">
            Imprimir Listagem
          </Dialog.Title>
          <form onSubmit={handleSubmit(handlePrintListagem)}>
            <div className="w-full">
              <Select
                label="Fazenda"
                {...register('fazenda')}
                error={errors.fazenda}
                defaultValue={0}
              >
                <option value={0}>Todas as fazendas</option>
                {fazendas.map((fazenda) => {
                  return (
                    <option key={fazenda.id} value={fazenda.id}>
                      {fazenda.nome}
                    </option>
                  )
                })}
              </Select>
            </div>
            <div className="mt-2 flex w-full justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-gray-400 px-5 py-3 font-medium text-white hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-sky-500 px-5 py-3 font-medium text-white hover:bg-sky-600"
              >
                Imprimir
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute right-[10px] top-[10px] flex h-[25px] w-[25px] items-center justify-center rounded-md bg-slate-100 text-gray-800 hover:bg-slate-200">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
