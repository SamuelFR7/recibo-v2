import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../../Form/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'
import { Farm } from '../../../Recibos'
import { Pencil } from 'phosphor-react'

interface EditFazendaProps {
  fazendaData: Farm
}

const editFarmSchema = z.object({
  nome: z.string().nonempty({ message: 'Digite um nome' }).toUpperCase(),
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
})

type EditFarmSchema = z.infer<typeof editFarmSchema>

export function EditFazendaDialog({ fazendaData }: EditFazendaProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EditFarmSchema>({
    resolver: zodResolver(editFarmSchema),
    defaultValues: {
      nome: fazendaData.nome,
      pagadorDocumento: fazendaData.pagadorDocumento,
      pagadorEndereco: fazendaData.pagadorEndereco,
      pagadorNome: fazendaData.pagadorNome,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: EditFarmSchema) => {
      return api.put('/api/fazenda', {
        id: fazendaData.id,
        Nome: values.nome,
        PagadorNome: values.pagadorNome,
        PagadorEndereco: values.pagadorEndereco,
        PagadorDocumento: values.pagadorDocumento,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['fazendas'])
      setOpen(false)
    },
  })

  const handleEditFarm: SubmitHandler<EditFarmSchema> = async (values) => {
    mutation.mutate(values)
  }

  useEffect(() => {
    reset({
      nome: fazendaData.nome,
      pagadorDocumento: fazendaData.pagadorDocumento,
      pagadorEndereco: fazendaData.pagadorEndereco,
      pagadorNome: fazendaData.pagadorNome,
    })
  }, [open, reset, fazendaData])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-sky-400 px-3 py-2 hover:bg-sky-500 text-white rounded-md font-medium">
          <Pencil size={16} weight="bold" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black/30">
          <Dialog.Content className="min-w-[1000px] rounded-md bg-white p-5">
            <Dialog.Title className="text-2xl font-bold mb-2">
              Editar fazenda
            </Dialog.Title>
            <form onSubmit={handleSubmit(handleEditFarm)}>
              <Input
                label="Nome fazenda"
                {...register('nome')}
                error={errors.nome}
                placeholder="Fazenda"
              />
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
              <div className="w-full flex justify-end mt-2 gap-3">
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
