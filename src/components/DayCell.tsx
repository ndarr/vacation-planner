import type { CalendarDay } from '../utils/calendar'
import type { DayType } from '../types'

interface Props {
  day: CalendarDay
  onToggle: (date: string) => void
}

const typeStyles: Record<DayType, string> = {
  workday: 'text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer',
  vacation: 'bg-blue-500 text-white font-semibold cursor-pointer',
  holiday: 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 cursor-default',
  weekend: 'text-gray-300 dark:text-gray-600 cursor-default',
}

const isTogglable = (type: DayType) => type === 'workday' || type === 'vacation'

export function DayCell({ day, onToggle }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded text-sm h-9 w-9 sm:h-8 sm:w-8 ${typeStyles[day.type]}`}
      onClick={() => isTogglable(day.type) && onToggle(day.date)}
    >
      {day.dayOfMonth}
    </div>
  )
}
