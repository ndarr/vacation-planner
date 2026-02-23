import { DayCell } from './DayCell'
import type { CalendarMonth } from '../utils/calendar'

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface Props {
  month: CalendarMonth
  onToggleDay: (date: string) => void
}

export function MonthCalendar({ month, onToggleDay }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{month.label}</h3>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map(label => (
          <div key={label} className="text-xs text-center text-gray-400 font-medium">
            {label}
          </div>
        ))}
      </div>
      {month.weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, di) =>
            day ? <DayCell key={day.date} day={day} onToggle={onToggleDay} /> : <div key={di} />
          )}
        </div>
      ))}
    </div>
  )
}
