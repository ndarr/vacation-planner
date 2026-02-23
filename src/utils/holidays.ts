import Holidays from 'date-holidays'
import type { Holiday } from '../types'

function isPublicHoliday(holiday: { type: string }): boolean {
  return holiday.type === 'public'
}

export function getHolidays(year: number, country: string, region?: string): Holiday[] {
  const hd = new Holidays(country, region ?? '')
  return hd.getHolidays(year)
    .filter(isPublicHoliday)
    .map(h => ({ date: h.date.slice(0, 10), name: h.name }))
}
