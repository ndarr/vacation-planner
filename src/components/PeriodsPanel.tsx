import { format } from 'date-fns'
import type { Period } from '../types'

interface Props {
  periods: Period[]
  onDeletePeriod: (period: Period) => void
  onExport: () => void
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
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{dateLabel}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{period.calendarDays} calendar days</p>
      </div>
      <button
        onClick={onDelete}
        className="group w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Delete this trip"
      >
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:hidden">
          {period.workingDays}d
        </span>
        <span className="hidden text-red-400 text-xs group-hover:block">✕</span>
      </button>
    </div>
  )
}

export function PeriodsPanel({ periods, onDeletePeriod, onExport }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Planned Trips
        </h2>
        {periods.length > 0 && (
          <button
            onClick={onExport}
            title="Export to calendar (.ics)"
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            .ics
          </button>
        )}
      </div>
      {periods.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No vacation days planned yet.</p>
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
