export function Header() {
  return (
    <header className="w-full bg-sky-500">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4 text-white">
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
