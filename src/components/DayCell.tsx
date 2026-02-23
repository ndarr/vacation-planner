import type { CalendarDay } from '../utils/calendar'

interface Props {
  day: CalendarDay
}

const typeStyles: Record<string, string> = {
  workday: 'text-gray-800 hover:bg-blue-50 cursor-pointer',
  vacation: 'bg-blue-500 text-white font-semibold cursor-pointer',
  holiday: 'bg-red-100 text-red-500 cursor-default',
  weekend: 'text-gray-300 cursor-default',
}

export function DayCell({ day }: Props) {
  return (
    <div className={`flex items-center justify-center rounded text-sm h-8 w-8 ${typeStyles[day.type]}`}>
      {day.dayOfMonth}
    </div>
  )
}
