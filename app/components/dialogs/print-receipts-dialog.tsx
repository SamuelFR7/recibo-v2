import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Farm } from '~/utils/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Printer } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { env } from '~/utils/env'
import { useState } from 'react'

interface PrintReceiptsDialogProps {
  farms: Farm[]
}

const schema = z.object({
  farmId: z.coerce.number().default(0),
})

type Input = z.infer<typeof schema>

export function PrintReceiptsDialog({ farms }: PrintReceiptsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      farmId: 0,
    },
  })

  function handleSubmit(data: Input) {
    window.open(
      `${env.VITE_API_URL}/api/relatoriorecibo/fazenda?FazendaId=${data.farmId}`
    )
    form.reset()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Printer className="mr-2 h-3.5 w-3.5" />
          Imprimir Recibos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Imprimir Recibos</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(...args) =>
              void form.handleSubmit(handleSubmit)(...args)
            }
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key={0} value="0">
                        Todas as Fazendas
                      </SelectItem>
                      {farms.map((farm) => (
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

            <Button className="w-full" type="submit">
              Imprimir
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
