import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
} from 'date-fns'
import type { DayType } from '../types'

export interface CalendarDay {
  date: string // "YYYY-MM-DD"
  dayOfMonth: number
  type: DayType
}

export interface CalendarMonth {
  month: number // 0-indexed
  year: number
  label: string
  weeks: (CalendarDay | null)[][]
}

function isWeekend(date: Date): boolean {
  const day = getDay(date)
  return day === 0 || day === 6
}

function resolveDayType(
  date: Date,
  isoDate: string,
  holidays: Set<string>,
  halfHolidays: Set<string>,
  vacationDays: Set<string>,
  halfDays: Set<string>
): DayType {
  if (isWeekend(date)) return 'weekend'
  if (vacationDays.has(isoDate)) return 'vacation'
  if (halfDays.has(isoDate) && halfHolidays.has(isoDate)) return 'half-vacation-half-holiday'
  if (halfDays.has(isoDate)) return 'half-vacation'
  if (halfHolidays.has(isoDate)) return 'half-holiday'
  if (holidays.has(isoDate)) return 'holiday'
  return 'workday'
}

function buildWeeks(days: CalendarDay[], firstDayOfWeek: number): (CalendarDay | null)[][] {
  // Monday = 0 offset; getDay returns 0=Sun, so shift
  const leadingBlanks = (firstDayOfWeek + 6) % 7
  const cells: (CalendarDay | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...days,
  ]

  const weeks: (CalendarDay | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Pad last week to 7 cells
  const last = weeks[weeks.length - 1]
  while (last.length < 7) last.push(null)

  return weeks
}

export function buildCalendarMonth(
  year: number,
  month: number,
  holidays: Set<string>,
  halfHolidays: Set<string>,
  vacationDays: Set<string>,
  halfDays: Set<string>
): CalendarMonth {
  const firstDay = startOfMonth(new Date(year, month))
  const lastDay = endOfMonth(firstDay)
  const dates = eachDayOfInterval({ start: firstDay, end: lastDay })

  const days: CalendarDay[] = dates.map(date => {
    const isoDate = format(date, 'yyyy-MM-dd')
    return {
      date: isoDate,
      dayOfMonth: date.getDate(),
      type: resolveDayType(date, isoDate, holidays, halfHolidays, vacationDays, halfDays),
    }
  })

  return {
    month,
    year,
    label: format(firstDay, 'MMMM yyyy'),
    weeks: buildWeeks(days, getDay(firstDay)),
  }
}

export function buildCalendarYear(
  year: number,
  holidays: Set<string>,
  halfHolidays: Set<string>,
  vacationDays: Set<string>,
  halfDays: Set<string>
): CalendarMonth[] {
  return Array.from({ length: 12 }, (_, month) =>
    buildCalendarMonth(year, month, holidays, halfHolidays, vacationDays, halfDays)
  )
}
