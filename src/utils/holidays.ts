import Holidays from 'date-holidays'

function isPublicHoliday(holiday: { type: string }): boolean {
  return holiday.type === 'public'
}

export function getHolidays(year: number, country: string, region?: string): Set<string> {
  const hd = new Holidays(country, region ?? '')
  const holidays = hd.getHolidays(year)

  return new Set(
    holidays
      .filter(isPublicHoliday)
      .map(h => h.date.slice(0, 10))
  )
}
