import { Dialog } from '@headlessui/react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Farm } from '../../../Recibos'
import { Select } from '../../Form/Select'
import { Input } from '../../Form/Input'
import { TextArea } from '../../Form/TextArea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'

interface CreateReciboDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  fazendas: Farm[]
}

const createReciboSchema = z.object({
  fazenda: z
    .string()
    .transform((arg) => Number(arg))
    .refine((arg) => arg > 0, { message: 'Selecione uma fazenda' }),
  data: z.date(),
  valor: z.number().min(0.01, { message: 'Digite um valor acima de 0' }),
  beneficiarioNome: z.string().nonempty({ message: 'Digite um nome' }),
  beneficiarioEndereco: z.string().nullish(),
  beneficiarioDocumento: z.string().nullish(),
  pagadorNome: z.string().nonempty({ message: 'Digite um nome' }),
  pagadorEndereco: z.string().nullish(),
  pagadorDocumento: z.string().nullish(),
  historico: z.string().nullish(),
})

type CreateReciboSchema = z.infer<typeof createReciboSchema>

export function CreateReciboDialog({
  isOpen,
  setIsOpen,
  fazendas,
}: CreateReciboDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateReciboSchema>({
    resolver: zodResolver(createReciboSchema),
  })
  const queryClient = useQueryClient()

  function handleClose() {
    reset()
    setIsOpen(false)
  }

  const mutation = useMutation({
    mutationFn: async (values: CreateReciboSchema) => {
      return api
        .post('/api/recibo', {
          Id: '0',
          fazenda: {
            Id: values.fazenda,
            Nome: '.',
            PagadorNome: '',
            PagadorEndereco: '',
            PagadorDocumento: '',
          },
          Numero: '0',
          Data: values.data,
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
    onSuccess: () => {
      queryClient.invalidateQueries(['recibos'])
      handleClose()
    },
  })

  const createRecibo: SubmitHandler<CreateReciboSchema> = async (values) => {
    mutation.mutate(values)
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
            Novo recibo
          </Dialog.Title>
          <form onSubmit={handleSubmit(createRecibo)}>
            <div className="w-full items-center flex gap-3">
              <Select
                label="Fazenda"
                {...register('fazenda')}
                error={errors.fazenda}
                defaultValue={0}
              >
                <option value={0} disabled>
                  Selecione
                </option>
                {fazendas.map((fazenda) => {
                  return (
                    <option key={fazenda.id} value={fazenda.id}>
                      {fazenda.nome}
                    </option>
                  )
                })}
              </Select>
              <Input
                type="date"
                label="Data"
                {...register('data', { valueAsDate: true })}
                error={errors.data}
                placeholder="Data"
              />
              <Input
                label="Valor"
                type="number"
                {...register('valor', { valueAsNumber: true })}
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
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
