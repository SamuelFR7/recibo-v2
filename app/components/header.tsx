import { Link } from '@remix-run/react'
import { Menu, Receipt } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="top-0 flex h-16 items-center gap-4 border-b bg-primary px-4 text-primary-foreground md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          prefetch="intent"
        >
          <Receipt className="h-6 w-6" />
          <span className="sr-only">Recibo</span>
        </Link>
        <Link
          to="/"
          className="text-primary-foreground transition-colors hover:text-primary-foreground/50"
          prefetch="intent"
        >
          Inicio
        </Link>
        <Link
          to="/fazendas"
          className="text-primary-foreground transition-colors hover:text-primary-foreground/50"
          prefetch="intent"
        >
          Fazendas
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5 text-primary-foreground" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Receipt className="h-6 w-6" />
              <span className="sr-only">Recibo</span>
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Inicio
            </Link>
            <Link
              to="/fazendas"
              className="text-muted-foreground hover:text-foreground"
            >
              Fazendas
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
