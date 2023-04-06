import { Dialog } from '@headlessui/react'
import { Farm } from '../../../Recibos'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Select } from '../../Form/Select'

interface PrintRecibosProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  fazendas: Farm[]
}

const printRecibosSchema = z.object({
  fazenda: z
    .string()
    .transform((arg) => Number(arg))
    .refine((arg) => arg >= 0, { message: 'Selecione uma fazenda' }),
})

type PrintRecibosSchema = z.infer<typeof printRecibosSchema>

export function PrintRecibos({
  fazendas,
  isOpen,
  setIsOpen,
}: PrintRecibosProps) {
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

  function handleClose() {
    reset()
    setIsOpen(false)
  }

  const handlePrintRecibos: SubmitHandler<PrintRecibosSchema> = (values) => {
    window.open(
      `${
        import.meta.env.VITE_API_ADDRESS
      }/api/relatoriorecibo/fazenda?FazendaId=${values.fazenda}`,
    )
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleClose()}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-[1000px] rounded bg-white p-6">
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
            <div className="w-full flex justify-end mt-2 gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-5 font-medium bg-gray-400 hover:bg-gray-500 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-3 px-5 font-medium bg-sky-500 hover:bg-sky-600 text-white rounded-md"
              >
                Imprimir
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
