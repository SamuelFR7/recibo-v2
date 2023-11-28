import * as Dialog from '@radix-ui/react-dialog'
import type { Farm } from '../../../Recibos'
import { z } from 'zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Select } from '../../Form/Select'
import { X } from 'phosphor-react'

interface PrintRecibosProps {
  fazendas: Farm[]
}

const printRecibosSchema = z.object({
  fazenda: z
    .string()
    .transform((arg) => Number(arg))
    .refine((arg) => arg >= 0, { message: 'Selecione uma fazenda' }),
})

type PrintRecibosSchema = z.infer<typeof printRecibosSchema>

export function PrintRecibos({ fazendas }: PrintRecibosProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PrintRecibosSchema>({
    resolver: zodResolver(printRecibosSchema),
    defaultValues: {
      fazenda: 0,
    },
  })

  const handlePrintRecibos: SubmitHandler<PrintRecibosSchema> = (values) => {
    window.open(
      `${
        import.meta.env.VITE_API_ADDRESS
      }/api/relatoriorecibo/fazenda?FazendaId=${values.fazenda}`,
    )
  }

  useEffect(() => {
    reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-md bg-sky-400 px-3 py-2 font-medium text-white hover:bg-sky-500">
          Imprimir Recibos
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6">
          <Dialog.Title className="text-2xl font-bold">
            Imprimir Recibos
          </Dialog.Title>
          <form onSubmit={handleSubmit(handlePrintRecibos)}>
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
          <Dialog.Close>
            <button className="absolute right-[10px] top-[10px] flex h-[25px] w-[25px] items-center justify-center rounded-md bg-slate-100 text-gray-800 hover:bg-slate-200">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
