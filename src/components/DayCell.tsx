import type { CalendarDay } from '../utils/calendar'
import type { DayType } from '../types'

interface Props {
  day: CalendarDay
  onToggle: (date: string) => void
}

const typeStyles: Record<DayType, string> = {
  workday: 'text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer',
  vacation: 'bg-blue-500 text-white font-semibold cursor-pointer',
  'half-vacation': '',
  'half-holiday': '',
  'half-vacation-half-holiday': '',
  holiday: 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 cursor-default',
  weekend: 'text-gray-300 dark:text-gray-600 cursor-default',
}

const isTogglable = (type: DayType) =>
  type === 'workday' || type === 'vacation' || type === 'half-vacation' ||
  type === 'half-holiday' || type === 'half-vacation-half-holiday'

// Each config provides Tailwind class strings for the two triangles
const DIAGONAL_CONFIGS = {
  'half-vacation':              { topLeft: 'bg-blue-500',                        bottomRight: 'bg-white dark:bg-gray-800' },
  'half-holiday':               { topLeft: 'bg-white dark:bg-gray-800',           bottomRight: 'bg-red-100 dark:bg-red-900/30' },
  'half-vacation-half-holiday': { topLeft: 'bg-blue-500',                        bottomRight: 'bg-red-100 dark:bg-red-900/30' },
}

function DiagonalCell({ dayOfMonth, config, onToggle }: {
  dayOfMonth: number
  config: { topLeft: string; bottomRight: string }
  onToggle?: () => void
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded text-sm h-11 w-11 sm:h-8 sm:w-8 font-semibold overflow-hidden ${onToggle ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onToggle}
    >
      <div className={`absolute inset-0 ${config.topLeft}`} style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className={`absolute inset-0 ${config.bottomRight}`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      <span className="relative z-10 text-gray-800 dark:text-gray-200">{dayOfMonth}</span>
    </div>
  )
}

export function DayCell({ day, onToggle }: Props) {
  const diagonalConfig = DIAGONAL_CONFIGS[day.type as keyof typeof DIAGONAL_CONFIGS]
  if (diagonalConfig) {
    return (
      <DiagonalCell
        dayOfMonth={day.dayOfMonth}
        config={diagonalConfig}
        onToggle={isTogglable(day.type) ? () => onToggle(day.date) : undefined}
      />
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded text-sm h-11 w-11 sm:h-8 sm:w-8 ${typeStyles[day.type]}`}
      onClick={() => isTogglable(day.type) && onToggle(day.date)}
    >
      {day.dayOfMonth}
    </div>
  )
}
