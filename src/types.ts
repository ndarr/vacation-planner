export type DayType = 'workday' | 'vacation' | 'half-vacation' | 'holiday' | 'half-holiday' | 'half-vacation-half-holiday' | 'weekend'

export type Theme = 'light' | 'system' | 'dark'

export interface CustomHoliday {
  date: string  // MM-DD, recurring every year
  name: string
  halfDay?: boolean
}

export interface Settings {
  year: number
  country: string
  region?: string
  theme: Theme
  customHolidays: CustomHoliday[]
}

export interface YearStore {
  allowance: number
  vacationDays: string[] // ISO dates "YYYY-MM-DD" — full days
  halfDays: string[]     // ISO dates "YYYY-MM-DD" — half days (0.5 each)
  tripNames: Record<string, string> // keyed by first vacation date of the period
}

export interface Holiday {
  date: string // ISO date "YYYY-MM-DD"
  name: string
  halfDay?: boolean
}

export interface Period {
  start: Date
  end: Date
  dates: Date[]  // actual vacation days within this period
  workingDays: number  // sum of weights: full=1, half=0.5
  calendarDays: number
}
