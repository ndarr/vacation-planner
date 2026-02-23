const ENTRIES = [
  { label: 'Vacation', className: 'bg-blue-500' },
  { label: 'Public holiday', className: 'bg-red-100 border border-red-200' },
  { label: 'Weekend', className: 'bg-gray-100 border border-gray-200' },
  { label: 'Working day', className: 'bg-white border border-gray-200' },
]

export function Legend() {
  return (
    <div className="flex flex-wrap gap-3">
      {ENTRIES.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded ${className}`} />
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  )
}
