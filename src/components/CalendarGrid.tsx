import { useMemo } from 'react'
import { MonthCalendar } from './MonthCalendar'
import { buildCalendarYear } from '../utils/calendar'

interface Props {
  year: number
  holidays: Set<string>
  vacationDays: Set<string>
  onToggleDay: (date: string) => void
}

export function CalendarGrid({ year, holidays, vacationDays, onToggleDay }: Props) {
  const months = useMemo(
    () => buildCalendarYear(year, holidays, vacationDays),
    [year, holidays, vacationDays]
  )

  return (
    <div className="grid grid-cols-3 gap-8">
      {months.map(month => (
        <MonthCalendar key={month.month} month={month} onToggleDay={onToggleDay} />
      ))}
    </div>
  )
}
