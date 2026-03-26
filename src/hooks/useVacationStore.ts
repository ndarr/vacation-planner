import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { YearStore } from '../types'

const DEFAULT_ALLOWANCE = 25

function storageKey(year: number): string {
  return `vp-year-${year}`
}

function readFromStorage(year: number): YearStore | null {
  const raw = localStorage.getItem(storageKey(year))
  if (!raw) return null
  return { ...defaultStore(), ...JSON.parse(raw) }
}

function writeToStorage(year: number, store: YearStore): void {
  localStorage.setItem(storageKey(year), JSON.stringify(store))
}

function defaultStore(): YearStore {
  return { allowance: DEFAULT_ALLOWANCE, vacationDays: [], halfDays: [], tripNames: {} }
}

function persist(year: number, next: YearStore, setStore: (s: YearStore) => void) {
  writeToStorage(year, next)
  setStore(next)
}

export function useVacationStore(year: number) {
  const [store, setStore] = useState<YearStore>(
    () => readFromStorage(year) ?? defaultStore()
  )

  useEffect(() => {
    setStore(readFromStorage(year) ?? defaultStore())
  }, [year])

  function save(next: YearStore) {
    persist(year, next, setStore)
  }

  function toggleDay(date: string, halfOnly = false) {
    const isFullDay = store.vacationDays.includes(date)
    const isHalfDay = store.halfDays.includes(date)

    if (halfOnly) {
      // half-holiday days: only toggle half-vacation on/off
      if (isHalfDay) {
        save({ ...store, halfDays: store.halfDays.filter(d => d !== date) })
      } else {
        save({
          ...store,
          vacationDays: store.vacationDays.filter(d => d !== date),
          halfDays: [...store.halfDays, date],
        })
      }
      return
    }

    if (isFullDay) {
      // full → half
      save({
        ...store,
        vacationDays: store.vacationDays.filter(d => d !== date),
        halfDays: [...store.halfDays, date],
      })
    } else if (isHalfDay) {
      // half → clear
      save({ ...store, halfDays: store.halfDays.filter(d => d !== date) })
    } else {
      // workday → full
      save({ ...store, vacationDays: [...store.vacationDays, date] })
    }
  }

  function setAllowance(allowance: number) {
    save({ ...store, allowance })
  }

  function setTripName(key: string, name: string) {
    const next = { ...store.tripNames }
    if (name.trim()) {
      next[key] = name.trim()
    } else {
      delete next[key]
    }
    save({ ...store, tripNames: next })
  }

  function removeDays(dates: Date[], tripKey?: string) {
    const toRemove = new Set(dates.map(d => format(d, 'yyyy-MM-dd')))
    const nextNames = { ...store.tripNames }
    if (tripKey) delete nextNames[tripKey]
    save({
      ...store,
      vacationDays: store.vacationDays.filter(d => !toRemove.has(d)),
      halfDays: store.halfDays.filter(d => !toRemove.has(d)),
      tripNames: nextNames,
    })
  }

  function resetDays() {
    save({ ...store, vacationDays: [], halfDays: [] })
  }

  return { store, toggleDay, setAllowance, setTripName, removeDays, resetDays }
}
