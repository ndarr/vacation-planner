import { format, addDays } from 'date-fns'
import type { Period } from '../types'

function icsDate(date: Date): string {
  return format(date, 'yyyyMMdd')
}

function icsNow(): string {
  return format(new Date(), "yyyyMMdd'T'HHmmss'Z'")
}

export function exportToICS(periods: Period[], year: number): void {
  const dtstamp = icsNow()

  const events = periods.map(period => [
    'BEGIN:VEVENT',
    `UID:vacation-${icsDate(period.start)}-${icsDate(period.end)}@vacation-planner`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${icsDate(period.start)}`,
    `DTEND;VALUE=DATE:${icsDate(addDays(period.end, 1))}`,
    `SUMMARY:Vacation (${period.workingDays}d)`,
    'END:VEVENT',
  ].join('\r\n'))

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vacation Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vacation-${year}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
