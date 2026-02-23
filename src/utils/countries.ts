import Holidays from 'date-holidays'

export interface Country {
  code: string
  name: string
}

export function getSupportedCountries(): Country[] {
  const hd = new Holidays()
  const raw = hd.getCountries()
  return Object.entries(raw)
    .map(([code, name]) => ({ code, name: name as string }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
