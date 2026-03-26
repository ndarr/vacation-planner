import Holidays from 'date-holidays'

export interface Region {
  code: string
  name: string
}

export function getRegions(country: string): Region[] {
  const hd = new Holidays()
  const states = hd.getStates(country)
  if (!states) return []
  return Object.entries(states as Record<string, string>)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
