import { useState } from 'react'
import { format } from 'date-fns'
import { TripDialog } from './TripDialog'
import type { Period } from '../types'

interface Props {
  periods: Period[]
  tripNames: Record<string, string>
  onDeletePeriod: (period: Period) => void
  onSetTripName: (key: string, name: string) => void
  onExport: () => void
}

function formatDate(date: Date): string {
  return format(date, 'MMM d')
}

function tripKey(period: Period): string {
  return format(period.dates[0], 'yyyy-MM-dd')
}

function PeriodRow({ period, name, onClick }: { period: Period; name: string; onClick: () => void }) {
  const isSingleDay = period.start.getTime() === period.end.getTime()
  const dateLabel = isSingleDay
    ? formatDate(period.start)
    : `${formatDate(period.start)} – ${formatDate(period.end)}`
  const days = period.workingDays
  const daysLabel = (days % 1 === 0 ? String(days) : days.toFixed(1)) + 'd'

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {name || dateLabel}
        </p>
        {name && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{dateLabel}</p>
        )}
      </div>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
        {daysLabel}
      </span>
    </button>
  )
}

export function PeriodsPanel({ periods, tripNames, onDeletePeriod, onSetTripName, onExport }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)

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
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors h-11 sm:h-auto px-1"
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
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {periods.map(period => (
            <PeriodRow
              key={period.start.toISOString()}
              period={period}
              name={tripNames[tripKey(period)] ?? ''}
              onClick={() => setSelectedPeriod(period)}
            />
          ))}
        </div>
      )}

      {selectedPeriod && (
        <TripDialog
          period={selectedPeriod}
          name={tripNames[tripKey(selectedPeriod)] ?? ''}
          onSave={name => onSetTripName(tripKey(selectedPeriod), name)}
          onDelete={() => onDeletePeriod(selectedPeriod)}
          onClose={() => setSelectedPeriod(null)}
        />
      )}
    </div>
  )
}
