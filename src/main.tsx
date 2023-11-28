import React from "react"
import ReactDOM from "react-dom/client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { Header } from "./components/Header"
import Fazendas from "./Fazendas"
import Recibos from "./Recibos"
import "./index.css"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Recibos />,
  },
  {
    path: "/fazendas",
    element: <Fazendas />,
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Header />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
