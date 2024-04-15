import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { useMutation } from '@tanstack/react-query'
import { generic } from 'br-docs-validator'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, buttonVariants } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { createFarm } from '~/utils/api/create-farm'
import { getFarms } from '~/utils/api/get-farms'
import { cn } from '~/utils/utils'

export async function clientLoader() {
  const farms = await getFarms({ search: undefined })

  return {
    farms,
  }
}

const schema = z
  .object({
    name: z
      .string({ required_error: 'Digite um nome' })
      .min(1, 'Digite um nome')
      .toUpperCase(),
    payerName: z
      .string({ required_error: 'Digite um nome' })
      .min(1, 'Digite um nome')
      .toUpperCase(),
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
    copyReceipts: z.boolean().default(false),
    originFarmId: z.coerce.number().optional(),
    receiptsDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.copyReceipts) {
      if (!data.originFarmId) {
        ctx.addIssue({
          message: 'Selecione uma fazenda',
          path: ['originFarmId'],
          code: z.ZodIssueCode.custom,
        })
      }

      if (!data.receiptsDate) {
        ctx.addIssue({
          message: 'Digite uma data',
          path: ['receiptsDate'],
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

type Input = z.infer<typeof schema>

export default function NewFarmPage() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof clientLoader>()
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      copyReceipts: false,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Input) => createFarm(values),
    onSuccess: () => {
      navigate('/fazendas')
    },
  })

  function handleSubmit(data: Input) {
    mutation.mutate(data)
  }

  const copyReceiptsValue = form.watch('copyReceipts')

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Nova Fazenda</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={(...args) => void form.handleSubmit(handleSubmit)(...args)}
          className="space-y-6"
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
          <Separator />
          <FormField
            control={form.control}
            name="copyReceipts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Copiar recibos de outra fazenda</FormLabel>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="originFarmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fazenda Origem</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    disabled={!copyReceiptsValue}
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
              name="receiptsDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data dos Recibos</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!copyReceiptsValue}
                      {...field}
                      type="date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
