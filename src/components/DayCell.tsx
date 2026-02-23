import type { CalendarDay } from '../utils/calendar'
import type { DayType } from '../types'

interface Props {
  day: CalendarDay
  onToggle: (date: string) => void
}

const typeStyles: Record<DayType, string> = {
  workday: 'text-gray-800 hover:bg-blue-50 cursor-pointer',
  vacation: 'bg-blue-500 text-white font-semibold cursor-pointer',
  holiday: 'bg-red-100 text-red-500 cursor-default',
  weekend: 'text-gray-300 cursor-default',
}

const isTogglable = (type: DayType) => type === 'workday' || type === 'vacation'

export function DayCell({ day, onToggle }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded text-sm h-8 w-8 ${typeStyles[day.type]}`}
      onClick={() => isTogglable(day.type) && onToggle(day.date)}
    >
      {day.dayOfMonth}
    </div>
  )
}
