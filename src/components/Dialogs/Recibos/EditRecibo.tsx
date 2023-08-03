import * as Dialog from '@radix-ui/react-dialog'
import React, { ReactNode, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../Form/Input'
import { TextArea } from '../../Form/TextArea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'
import { Receipt } from '../../../Recibos'
import { X } from 'phosphor-react'

interface EditReciboDialogProps {
  reciboData: Receipt
  children: ReactNode
}

const editReciboSchema = z.object({
  data: z.string(),
  valor: z
    .number()
    .min(0.01, { message: 'Digite um valor acima de 0' })
    .multipleOf(0.01, {
      message: 'O valor pode ter no máximo duas casas decimais',
    }),
  beneficiarioNome: z
    .string()
    .nonempty({ message: 'Digite um nome' })
    .toUpperCase(),
  beneficiarioEndereco: z.string().toUpperCase().nullish(),
  beneficiarioDocumento: z
    .string()
    .toUpperCase()
    .nullish()
    .refine(
      (arg) => arg?.length === 0 || arg?.length === 11 || arg?.length === 14,
      { message: 'Digite um CPF ou CNPJ válido ou deixe vazio' },
    ),
  pagadorNome: z.string().nonempty({ message: 'Digite um nome' }).toUpperCase(),
  pagadorEndereco: z.string().toUpperCase().nullish(),
  pagadorDocumento: z
    .string()
    .toUpperCase()
    .nullish()
    .refine(
      (arg) => arg?.length === 0 || arg?.length === 11 || arg?.length === 14,
      { message: 'Digite um CPF ou CNPJ válido ou deixe vazio' },
    ),
  historico: z.string().toUpperCase().nullish(),
  alreadyPrint: z.boolean().default(false)
})

type EditReciboSchema = z.infer<typeof editReciboSchema>

export function EditReciboDialog({
  reciboData,
  children,
}: EditReciboDialogProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EditReciboSchema>({
    resolver: zodResolver(editReciboSchema),
    defaultValues: {
      alreadyPrint: false,
      beneficiarioDocumento: reciboData.beneficiarioDocumento,
      beneficiarioEndereco: reciboData.beneficiarioEndereco,
      beneficiarioNome: reciboData.beneficiarioNome,
      data: new Date(reciboData.data)
        .toISOString()
        .split('T')[0]
        .split('-')
        .join('-'),
      historico: reciboData.historico,
      pagadorDocumento: reciboData.pagadorDocumento,
      pagadorEndereco: reciboData.pagadorEndereco,
      pagadorNome: reciboData.pagadorNome,
      valor: reciboData.valor,
    },
  })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: EditReciboSchema) => {
      return api
        .put('/api/recibo', {
          Id: reciboData.id,
          Numero: reciboData.numero,
          Fazenda: reciboData.fazenda,
          Data: new Date(values.data),
          Valor: values.valor,
          Historico: values.historico,
          BeneficiarioNome: values.beneficiarioNome,
          BeneficiarioEndereco: values.beneficiarioEndereco,
          BeneficiarioDocumento: values.beneficiarioDocumento,
          PagadorNome: values.pagadorNome,
          PagadorEndereco: values.pagadorEndereco,
          PagadorDocumento: values.pagadorDocumento,
        })
        .then((res) => res.data)
    },
    onSuccess: async (data, input) => {
      await queryClient.invalidateQueries(['recibos'])
      setOpen(false)
      if (input.alreadyPrint) {
        window.open(`${import.meta.env.VITE_API_ADDRESS}/api/relatoriorecibo/unico?id=${reciboData.id}`)
      }
    },
  })

  const editRecibo: SubmitHandler<EditReciboSchema> = async (values) => {
    mutation.mutate(values)
  }

  useEffect(() => {
    reset({
      beneficiarioDocumento: reciboData.beneficiarioDocumento,
      beneficiarioEndereco: reciboData.beneficiarioEndereco,
      beneficiarioNome: reciboData.beneficiarioNome,
      data: new Date(reciboData.data)
        .toISOString()
        .split('T')[0]
        .split('-')
        .join('-'),
      historico: reciboData.historico,
      pagadorDocumento: reciboData.pagadorDocumento,
      pagadorEndereco: reciboData.pagadorEndereco,
      pagadorNome: reciboData.pagadorNome,
      valor: reciboData.valor,
    })
  }, [open, reset, reciboData])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black/30">
          <Dialog.Content className="min-w-[1000px] rounded-md bg-white p-5">
            <div className="w-full flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold">
                Novo recibo
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-800 flex items-center justify-center hover:bg-slate-200 bg-slate-100 h-[25px] w-[25px] rounded-md">
                  <X />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={handleSubmit(editRecibo)}>
              <div className="w-full items-center flex gap-3">
                <Input
                  name="fazenda"
                  disabled
                  value={reciboData.fazenda.nome}
                  label="Fazenda"
                />
                <Input
                  type="date"
                  label="Data"
                  {...register('data', { valueAsDate: false })}
                  error={errors.data}
                  placeholder="Data"
                />
                <Input
                  label="Valor"
                  type="number"
                  {...register('valor', { valueAsNumber: true })}
                  step=".01"
                  error={errors.valor}
                  placeholder="Digite um valor"
                />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h2>Beneficiário</h2>
                <div className="flex flex-col gap-2 px-2">
                  <Input
                    label="Nome"
                    {...register('beneficiarioNome')}
                    error={errors.beneficiarioNome}
                    placeholder="Nome"
                  />
                  <div className="flex gap-2">
                    <Input
                      label="Endereço"
                      {...register('beneficiarioEndereco')}
                      error={errors.beneficiarioEndereco}
                      placeholder="Endereço"
                    />
                    <Input
                      label="CNPJ/CPF"
                      {...register('beneficiarioDocumento')}
                      error={errors.beneficiarioDocumento}
                      placeholder="Documento"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h2>Pagador</h2>
                <div className="flex flex-col gap-2 px-2">
                  <Input
                    label="Nome"
                    {...register('pagadorNome')}
                    error={errors.pagadorNome}
                    placeholder="Nome"
                  />
                  <div className="flex gap-2">
                    <Input
                      label="Endereço"
                      {...register('pagadorEndereco')}
                      error={errors.pagadorEndereco}
                      placeholder="Endereço"
                    />
                    <Input
                      label="CNPJ/CPF"
                      {...register('pagadorDocumento')}
                      error={errors.pagadorDocumento}
                      placeholder="Documento"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h2>Histórico</h2>
                <div className="px-2">
                  <TextArea
                    label=""
                    {...register('historico')}
                    placeholder="Histórico"
                    error={errors.historico}
                    className="h-[7rem] resize-none"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end mt-2 gap-3">
                <div className='flex items-center gap-2 font-medium'>
                  <input type='checkbox' onClick={() => setValue('alreadyPrint', !watch('alreadyPrint'))} />
                  <span>Imprimir ao salvar</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-3 px-5 font-medium bg-gray-400 hover:bg-gray-500 text-white rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 px-5 font-medium bg-sky-500 hover:bg-sky-600 text-white rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
