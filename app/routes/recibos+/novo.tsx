import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { z } from 'zod'
import { getFarms } from '~/utils/api/get-farms'
import { generic } from 'br-docs-validator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createReceipt } from '~/utils/api/create-receipt'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { cn } from '~/utils/utils'
import { Button, buttonVariants } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Checkbox } from '~/components/ui/checkbox'
import { env } from '~/utils/env'

export async function clientLoader() {
  const farms = await getFarms({ search: undefined })

  return { farms }
}

const schema = z.object({
  farmId: z.coerce.number().min(1, 'Selecione uma fazenda'),
  date: z.string(),
  value: z.coerce
    .number()
    .min(0.01, 'Digite um valor acima de 0')
    .multipleOf(0.01, 'O valor pode ter no máximo duas casas decimais'),
  recipientName: z.string().min(1, 'Digite um nome').toUpperCase(),
  recipientAddress: z.string().toUpperCase().optional(),
  recipientDocument: z
    .string()
    .refine((v) => {
      if (v.length !== 0) {
        return generic.isValid(v)
      }
      return true
    }, 'Digite um CPF ou CNPJ válido ou deixe vazio')
    .optional(),
  payerName: z.string().min(1, 'Digite um nome').toUpperCase(),
  payerAddress: z.string().toUpperCase().optional(),
  payerDocument: z
    .string()
    .refine((v) => {
      if (v.length !== 0) {
        return generic.isValid(v)
      }
      return true
    }, 'Digite um CPF ou CNPJ válido ou deixe vazio')
    .optional(),
  historic: z.string().toUpperCase().optional(),
  alreadyPrint: z.boolean().default(false),
})

type Input = z.infer<typeof schema>

export default function NewReceiptPage() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof clientLoader>()
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(Date.now()).toISOString().slice(0, 10),
      alreadyPrint: false,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Input) => createReceipt(values),
    onSuccess(data, values) {
      if (values.alreadyPrint) {
        window.open(
          `${env.VITE_API_URL}/api/relatoriorecibo/unico?id=${data.id}`
        )
      }

      navigate('/')
    },
  })

  function handleSubmit(data: Input) {
    mutation.mutate(data)
  }

  function changePayer(farmId: number) {
    const farmToSet = data.farms.find((v) => v.id === farmId)

    if (!farmToSet) return

    form.setValue('payerName', farmToSet.pagadorNome)
    form.setValue('payerAddress', farmToSet.pagadorEndereco ?? undefined)
    form.setValue('payerDocument', farmToSet.pagadorDocumento ?? undefined)
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Novo Recibo</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={(...args) => void form.handleSubmit(handleSubmit)(...args)}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fazenda</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v)
                      changePayer(parseInt(v))
                    }}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma fazenda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.farms.map((farm) => (
                        <SelectItem key={farm.id} value={String(farm.id)}>
                          {farm.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" step=".01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <h2 className="font-semibold">Beneficiário</h2>
            <div className="space-y-2 px-2">
              <FormField
                control={form.control}
                name="recipientName"
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
                  name="recipientAddress"
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
                  name="recipientDocument"
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
          <FormField
            control={form.control}
            name="historic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Histórico</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3">
            <FormField
              control={form.control}
              name="alreadyPrint"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Imprimir ao salvar</FormLabel>
                </FormItem>
              )}
            />
            <Link
              to="/"
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
