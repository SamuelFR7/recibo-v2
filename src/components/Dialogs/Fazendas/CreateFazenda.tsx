import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../../Form/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'

const createFarmSchema = z.object({
  nome: z.string().nonempty({ message: 'Digite um nome' }).toUpperCase(),
  pagadorNome: z.string().nonempty({ message: 'Digite um nome' }).toUpperCase(),
  pagadorEndereco: z.string().toUpperCase().nullish(),
  pagadorDocumento: z
    .string()
    .toUpperCase()
    .nullish()
    .refine(
      (arg) => arg?.length === 0 || arg?.length === 11 || arg?.length === 14,
      { message: 'Digite um CPF ou CNPJ válido ou deixe vazio' }
    ),
})

type CreateFarmSchema = z.infer<typeof createFarmSchema>

export function CreateFazendaDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateFarmSchema>({
    resolver: zodResolver(createFarmSchema),
  })

  const mutation = useMutation({
    mutationFn: async (values: CreateFarmSchema) => {
      return api.post('/api/fazenda', {
        id: 0,
        Nome: values.nome,
        PagadorNome: values.pagadorNome,
        PagadorEndereco: values.pagadorEndereco,
        PagadorDocumento: values.pagadorDocumento,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['fazendas'],
      })
      setOpen(false)
    },
  })

  const handleCreateFarm: SubmitHandler<CreateFarmSchema> = async (values) => {
    mutation.mutate(values)
  }

  useEffect(() => {
    reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-md bg-sky-400 px-3 py-2 font-medium text-white hover:bg-sky-500">
          Adicionar Fazenda
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black/30">
          <Dialog.Content className="min-w-[1000px] rounded-md bg-white p-5">
            <Dialog.Title className="mb-2 text-2xl font-bold">
              Nova fazenda
            </Dialog.Title>
            <form onSubmit={handleSubmit(handleCreateFarm)}>
              <Input
                label="Nome fazenda"
                {...register('nome')}
                error={errors.nome}
                placeholder="Fazenda"
              />
              <div className="mt-3 flex flex-col gap-2">
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
