import { eachDayOfInterval, parseISO, differenceInCalendarDays, addDays, subDays, format } from 'date-fns'
import type { Period } from '../types'

interface WeightedDay {
  date: string
  weight: number // 1 for full day, 0.5 for half day
}

function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6
}

function isNonWorkingDay(date: Date, holidays: Set<string>): boolean {
  return isWeekend(date) || holidays.has(format(date, 'yyyy-MM-dd'))
}

function gapIsNonWorking(from: string, to: string, holidays: Set<string>): boolean {
  const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
  const gapDays = days.slice(1, -1)
  return gapDays.every(day => isNonWorkingDay(day, holidays))
}

function extendedStart(vacationStart: string, holidays: Set<string>): Date {
  let date = subDays(parseISO(vacationStart), 1)
  while (isNonWorkingDay(date, holidays)) {
    date = subDays(date, 1)
  }
  return addDays(date, 1)
}

function extendedEnd(vacationEnd: string, holidays: Set<string>): Date {
  let date = addDays(parseISO(vacationEnd), 1)
  while (isNonWorkingDay(date, holidays)) {
    date = addDays(date, 1)
  }
  return subDays(date, 1)
}

function buildPeriod(days: WeightedDay[], start: number, end: number, holidays: Set<string>): Period {
  const slice = days.slice(start, end + 1)
  const displayStart = extendedStart(slice[0].date, holidays)
  const displayEnd = extendedEnd(slice[slice.length - 1].date, holidays)

  return {
    start: displayStart,
    end: displayEnd,
    dates: slice.map(d => parseISO(d.date)),
    workingDays: slice.reduce((sum, d) => sum + d.weight, 0),
    calendarDays: differenceInCalendarDays(displayEnd, displayStart) + 1,
  }
}

export function computePeriods(
  vacationDays: string[],
  halfDays: string[],
  holidays: Set<string>
): Period[] {
  const all: WeightedDay[] = [
    ...vacationDays.map(date => ({ date, weight: 1 })),
    ...halfDays.map(date => ({ date, weight: 0.5 })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  if (all.length === 0) return []

  const periods: Period[] = []
  let periodStart = 0

  for (let i = 1; i < all.length; i++) {
    if (!gapIsNonWorking(all[i - 1].date, all[i].date, holidays)) {
      periods.push(buildPeriod(all, periodStart, i - 1, holidays))
      periodStart = i
    }
  }

  periods.push(buildPeriod(all, periodStart, all.length - 1, holidays))
  return periods
}
