export type DayType = 'workday' | 'vacation' | 'holiday' | 'weekend'

export interface Settings {
  year: number
  country: string
  region?: string
}

export interface YearStore {
  allowance: number
  vacationDays: string[] // ISO dates "YYYY-MM-DD"
}

export interface Holiday {
  date: string // ISO date "YYYY-MM-DD"
  name: string
}

export interface Period {
  start: Date
  end: Date
  dates: Date[]  // actual vacation days within this period
  workingDays: number
  calendarDays: number
}
