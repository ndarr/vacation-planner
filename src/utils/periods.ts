import { eachDayOfInterval, parseISO, differenceInCalendarDays, addDays, subDays } from 'date-fns'
import { format } from 'date-fns'
import type { Period } from '../types'

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

function buildPeriod(vacationDays: string[], start: number, end: number, holidays: Set<string>): Period {
  const displayStart = extendedStart(vacationDays[start], holidays)
  const displayEnd = extendedEnd(vacationDays[end], holidays)
  const dates = vacationDays.slice(start, end + 1).map(d => parseISO(d))

  return {
    start: displayStart,
    end: displayEnd,
    dates,
    workingDays: end - start + 1,
    calendarDays: differenceInCalendarDays(displayEnd, displayStart) + 1,
  }
}

export function computePeriods(vacationDays: string[], holidays: Set<string>): Period[] {
  if (vacationDays.length === 0) return []

  const sorted = [...vacationDays].sort()
  const periods: Period[] = []
  let periodStart = 0

  for (let i = 1; i < sorted.length; i++) {
    const belongsToSamePeriod = gapIsNonWorking(sorted[i - 1], sorted[i], holidays)
    if (!belongsToSamePeriod) {
      periods.push(buildPeriod(sorted, periodStart, i - 1, holidays))
      periodStart = i
    }
  }

  periods.push(buildPeriod(sorted, periodStart, sorted.length - 1, holidays))
  return periods
}
