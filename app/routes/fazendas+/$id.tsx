import { zodResolver } from '@hookform/resolvers/zod'
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { useMutation } from '@tanstack/react-query'
import { generic } from 'br-docs-validator'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, buttonVariants } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { getUniqueFarm } from '~/utils/api/get-unique-farm'
import { updateFarm } from '~/utils/api/update-farm'
import { cn } from '~/utils/utils'

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const farmId = params.id

  if (!farmId) {
    throw new Response('Not found', { status: 404 })
  }

  const farm = await getUniqueFarm({
    id: parseInt(farmId),
  })

  return {
    farm,
  }
}

const schema = z.object({
  name: z.string().min(1, 'Digite um nome').toUpperCase(),
  payerName: z.string().min(1, 'Digite um nome').toUpperCase(),
  payerAddress: z.string().toUpperCase().optional(),
  payerDocument: z
    .string()
    .refine((v) => generic.isValid(v))
    .optional(),
})

type Input = z.infer<typeof schema>

export default function EditFarmPage() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof clientLoader>()
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.farm.nome,
      payerAddress: data.farm.pagadorEndereco,
      payerDocument: data.farm.pagadorDocumento,
      payerName: data.farm.pagadorNome,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Input) =>
      updateFarm({
        id: data.farm.id,
        ...values,
      }),
    onSuccess() {
      navigate('/fazendas')
    },
  })

  function handleSubmit(data: Input) {
    mutation.mutate(data)
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Editar Fazenda</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={(...args) => void form.handleSubmit(handleSubmit)(...args)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h2 className="font-semibold">Pagador</h2>
            <div className="space-y-2 px-2">
              <FormField
                control={form.control}
                name="payerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="payerAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payerDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ/CPF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link
              to="/fazendas"
              className={cn(
                buttonVariants({
                  variant: 'secondary',
                })
              )}
              prefetch="intent"
            >
              Cancelar
            </Link>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
