interface PaginationItemProps {
  isCurrent?: boolean
  number: number
  onPageChange: (page: number) => void
}

export function PaginationItem({
  isCurrent,
  number,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <button className="h-8 w-9 cursor-not-allowed rounded-md bg-sky-500 text-sm font-bold text-white">
        {number}
      </button>
    )
  }

  return (
    <button
      className="h-8 w-9 rounded-md bg-gray-200 text-sm font-bold hover:bg-gray-300"
      onClick={() => onPageChange(number)}
    >
      {number}
    </button>
  )
}
