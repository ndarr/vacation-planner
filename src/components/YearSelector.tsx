interface Props {
  year: number
  onChange: (year: number) => void
}

export function YearSelector({ year, onChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-light leading-none"
        onClick={() => onChange(year - 1)}
      >
        ‹
      </button>
      <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 w-20 text-center">{year}</span>
      <button
        className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-light leading-none"
        onClick={() => onChange(year + 1)}
      >
        ›
      </button>
    </div>
  )
}
