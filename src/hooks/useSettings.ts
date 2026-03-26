import { useState } from 'react'
import type { Settings } from '../types'

const STORAGE_KEY = 'vp-settings'

const DEFAULT_SETTINGS: Settings = {
  year: new Date().getFullYear(),
  country: 'DE',
  theme: 'system',
  customHolidays: [],
}

function load(): Settings {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
}

function save(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  function update(patch: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      save(next)
      return next
    })
  }

  return { settings, update }
}
