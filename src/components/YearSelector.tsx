interface Props {
  year: number
  onChange: (year: number) => void
}

export function YearSelector({ year, onChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        className="text-gray-400 hover:text-gray-700 text-xl font-light leading-none"
        onClick={() => onChange(year - 1)}
      >
        ‹
      </button>
      <span className="text-3xl font-bold text-gray-800 w-20 text-center">{year}</span>
      <button
        className="text-gray-400 hover:text-gray-700 text-xl font-light leading-none"
        onClick={() => onChange(year + 1)}
      >
        ›
      </button>
    </div>
  )
}
