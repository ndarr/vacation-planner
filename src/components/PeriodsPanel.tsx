import { format } from 'date-fns'
import type { Period } from '../types'

interface Props {
  periods: Period[]
  onDeletePeriod: (period: Period) => void
}

function formatDate(date: Date): string {
  return format(date, 'MMM d')
}

function PeriodRow({ period, onDelete }: { period: Period; onDelete: () => void }) {
  const isSingleDay = period.start.getTime() === period.end.getTime()
  const dateLabel = isSingleDay
    ? formatDate(period.start)
    : `${formatDate(period.start)} – ${formatDate(period.end)}`

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{dateLabel}</p>
        <p className="text-xs text-gray-400">{period.calendarDays} calendar days</p>
      </div>
      <button
        onClick={onDelete}
        className="group w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
        title="Delete this trip"
      >
        <span className="text-sm font-semibold text-blue-600 group-hover:hidden">
          {period.workingDays}d
        </span>
        <span className="hidden text-red-400 text-xs group-hover:block">✕</span>
      </button>
    </div>
  )
}

export function PeriodsPanel({ periods, onDeletePeriod }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Planned Trips
      </h2>
      {periods.length === 0 ? (
        <p className="text-sm text-gray-400">No vacation days planned yet.</p>
      ) : (
        periods.map(period => (
          <PeriodRow
            key={period.start.toISOString()}
            period={period}
            onDelete={() => onDeletePeriod(period)}
          />
        ))
      )}
    </div>
  )
}
