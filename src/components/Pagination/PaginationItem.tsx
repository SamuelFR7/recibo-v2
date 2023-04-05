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
      <button className="text-sm h-8 w-9 text-white font-bold rounded-md bg-sky-500 cursor-not-allowed">
        {number}
      </button>
    )
  }

  return (
    <button
      className="text-sm h-8 w-9 bg-gray-200 font-bold rounded-md hover:bg-gray-300"
      onClick={() => onPageChange(number)}
    >
      {number}
    </button>
  )
}
