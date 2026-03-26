import { useState } from 'react'
import { format } from 'date-fns'
import type { Period } from '../types'

interface Props {
  period: Period
  name: string
  onSave: (name: string) => void
  onDelete: () => void
  onClose: () => void
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}

function formatDays(days: number): string {
  return days % 1 === 0 ? String(days) : days.toFixed(1)
}

export function TripDialog({ period, name, onSave, onDelete, onClose }: Props) {
  const [nameInput, setNameInput] = useState(name)
  const isSingleDay = period.start.getTime() === period.end.getTime()
  const dateLabel = isSingleDay
    ? formatDate(period.start)
    : `${formatDate(period.start)} – ${formatDate(period.end)}`

  function handleSave() {
    onSave(nameInput)
    onClose()
  }

  function handleDelete() {
    onDelete()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Trip Details</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{dateLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Name (optional)</span>
            <input
              type="text"
              placeholder="e.g. Summer holiday"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </label>

          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDays(period.workingDays)} working {period.workingDays === 1 ? 'day' : 'days'}</span>
            <span>·</span>
            <span>{period.calendarDays} calendar {period.calendarDays === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleDelete}
            className="flex-1 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded-lg py-3 sm:py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete trip
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 sm:py-1.5 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
