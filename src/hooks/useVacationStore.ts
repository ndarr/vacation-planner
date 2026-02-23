import { useState, useEffect } from 'react'
import type { YearStore } from '../types'

const DEFAULT_ALLOWANCE = 25

function storageKey(year: number): string {
  return `vp-year-${year}`
}

function readFromStorage(year: number): YearStore | null {
  const raw = localStorage.getItem(storageKey(year))
  return raw ? JSON.parse(raw) : null
}

function writeToStorage(year: number, store: YearStore): void {
  localStorage.setItem(storageKey(year), JSON.stringify(store))
}

function defaultStore(): YearStore {
  return { allowance: DEFAULT_ALLOWANCE, vacationDays: [] }
}

function toggledDays(days: string[], date: string): string[] {
  return days.includes(date)
    ? days.filter(d => d !== date)
    : [...days, date]
}

export function useVacationStore(year: number) {
  const [store, setStore] = useState<YearStore>(
    () => readFromStorage(year) ?? defaultStore()
  )

  useEffect(() => {
    setStore(readFromStorage(year) ?? defaultStore())
  }, [year])

  function persist(next: YearStore) {
    writeToStorage(year, next)
    setStore(next)
  }

  function toggleDay(date: string) {
    persist({ ...store, vacationDays: toggledDays(store.vacationDays, date) })
  }

  function setAllowance(allowance: number) {
    persist({ ...store, allowance })
  }

  return { store, toggleDay, setAllowance }
}
