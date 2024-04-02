import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { getUniqueReceipt } from '~/utils/api/get-unique-receipt'
import { generic } from 'br-docs-validator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { updateReceipt } from '~/utils/api/update-receipt'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/utils/utils'
import { Button, buttonVariants } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const receiptId = params.id

  if (!receiptId) {
    throw new Response('Not found', {
      status: 404,
    })
  }

  const receipt = await getUniqueReceipt({
    id: parseInt(receiptId),
  })

  return {
    receipt,
  }
}

const schema = z.object({
  date: z.string(),
  value: z
    .number()
    .min(0.01, 'Digite um valor acima de 0')
    .multipleOf(0.01, 'O valor pode ter no máximo duas casas decimais'),
  recipientName: z.string().min(1, 'Digite um nome').toUpperCase(),
  recipientAddress: z.string().toUpperCase().optional(),
  recipientDocument: z
    .string()
    .refine(
      (v) => generic.isValid(v),
      'Digite um CPF ou CNPJ válido ou deixe vazio'
    )
    .optional(),
  payerName: z.string().min(1, 'Digite um nome').toUpperCase(),
  payerAddress: z.string().toUpperCase().optional(),
  payerDocument: z
    .string()
    .refine(
      (v) => generic.isValid(v),
      'Digite um CPF ou CNPJ válido ou deixe vazio'
    )
    .optional(),
  historic: z.string().toUpperCase().optional(),
  alreadyPrint: z.boolean().default(false),
})

type Input = z.infer<typeof schema>

export default function EditReceiptPage() {
  const data = useLoaderData<typeof clientLoader>()
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      alreadyPrint: false,
      date: new Date(data.receipt.data).toISOString().split('T')[0],
      value: data.receipt.valor,
      recipientName: data.receipt.beneficiarioNome,
      recipientAddress: data.receipt.beneficiarioEndereco,
      recipientDocument: data.receipt.beneficiarioDocumento,
      payerName: data.receipt.pagadorNome,
      payerAddress: data.receipt.pagadorEndereco,
      payerDocument: data.receipt.pagadorDocumento,
      historic: data.receipt.historico,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Input) =>
      updateReceipt({
        id: data.receipt.id,
        number: data.receipt.numero,
        farm: data.receipt.fazenda,
        ...values,
      }),
  })

  function handleSubmit(data: Input) {
    mutation.mutate(data)
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
            <FormItem>
              <FormLabel>Fazenda</FormLabel>
              <Input value={data.receipt.fazenda.nome} disabled />
            </FormItem>
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
