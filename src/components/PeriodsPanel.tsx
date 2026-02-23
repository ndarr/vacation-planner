import { format, parseISO } from 'date-fns'
import type { Period } from '../types'

interface Props {
  periods: Period[]
}

function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d')
}

function PeriodRow({ period }: { period: Period }) {
  const isSingleDay = period.start === period.end
  const dateLabel = isSingleDay
    ? formatDate(period.start)
    : `${formatDate(period.start)} – ${formatDate(period.end)}`

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{dateLabel}</p>
        <p className="text-xs text-gray-400">{period.calendarDays} calendar days</p>
      </div>
      <span className="text-sm font-semibold text-blue-600">
        {period.workingDays}d
      </span>
    </div>
  )
}

export function PeriodsPanel({ periods }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Planned Trips
      </h2>
      {periods.length === 0 ? (
        <p className="text-sm text-gray-400">No vacation days planned yet.</p>
      ) : (
        periods.map(period => <PeriodRow key={period.start} period={period} />)
      )}
    </div>
  )
}
