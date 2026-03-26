import { useMemo } from 'react'
import { MonthCalendar } from './MonthCalendar'
import { buildCalendarYear } from '../utils/calendar'

interface Props {
  year: number
  holidays: Set<string>
  halfHolidays: Set<string>
  vacationDays: Set<string>
  halfDays: Set<string>
  onToggleDay: (date: string) => void
}

export function CalendarGrid({ year, holidays, halfHolidays, vacationDays, halfDays, onToggleDay }: Props) {
  const months = useMemo(
    () => buildCalendarYear(year, holidays, halfHolidays, vacationDays, halfDays),
    [year, holidays, halfHolidays, vacationDays, halfDays]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {months.map(month => (
        <MonthCalendar key={month.month} month={month} onToggleDay={onToggleDay} />
      ))}
    </div>
  )
}
