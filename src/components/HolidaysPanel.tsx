import { format, parseISO } from 'date-fns'
import type { Holiday } from '../types'

interface Props {
  holidays: Holiday[]
}

function HolidayRow({ holiday }: { holiday: Holiday }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{holiday.name}</p>
      <span className="text-xs text-red-400 whitespace-nowrap ml-2">
        {format(parseISO(holiday.date), 'MMM d')}
      </span>
    </div>
  )
}

export function HolidaysPanel({ holidays }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        Public Holidays
      </h2>
      {holidays.map(h => <HolidayRow key={h.date} holiday={h} />)}
    </div>
  )
}
