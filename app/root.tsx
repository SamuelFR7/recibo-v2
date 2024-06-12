import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/header'
import { Loader2 } from 'lucide-react'
import { queryClient } from './utils/query-client'
import stylesheet from './tailwind.css?url'
import { LinksFunction, MetaFunction } from '@remix-run/node'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesheet,
    },
  ]
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Recibo',
    },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export function HydrateFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
    </div>
  )
}
