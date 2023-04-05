export function Header() {
  return (
    <header className="bg-sky-500 w-full">
      <div className="mx-auto py-4 text-white max-w-[1280px] flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recibo</h1>
        <nav className="flex gap-4 font-medium [&_a]:cursor-pointer">
          <a className="hover:text-slate-200" href="/">
            Recibos
          </a>
          <a className="hover:text-slate-200" href="/fazendas">
            Fazendas
          </a>
        </nav>
      </div>
    </header>
  )
}
