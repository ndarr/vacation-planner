const ENTRIES = [
  { label: 'Vacation', className: 'bg-blue-500' },
  { label: 'Public holiday', className: 'bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800' },
  { label: 'Weekend', className: 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600' },
  { label: 'Working day', className: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600' },
]

export function Legend() {
  return (
    <div className="flex flex-wrap gap-3">
      {ENTRIES.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded ${className}`} />
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  )
}
