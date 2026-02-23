import { useMemo, useState } from 'react'
import { getSupportedCountries } from '../utils/countries'
import type { Settings } from '../types'

interface Props {
  settings: Settings
  allowance: number
  onUpdateSettings: (patch: Partial<Settings>) => void
  onUpdateAllowance: (allowance: number) => void
  onReset: () => void
}

export function SettingsPanel({ settings, allowance, onUpdateSettings, onUpdateAllowance, onReset }: Props) {
  const [expanded, setExpanded] = useState(false)
  const countries = useMemo(getSupportedCountries, [])

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded(prev => !prev)}
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Settings</h2>
        <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 mt-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Vacation days</span>
            <input
              type="number"
              min={0}
              max={365}
              className="text-sm border border-gray-200 rounded px-2 py-1"
              value={allowance}
              onChange={e => onUpdateAllowance(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Country</span>
            <select
              className="text-sm border border-gray-200 rounded px-2 py-1"
              value={settings.country}
              onChange={e => onUpdateSettings({ country: e.target.value })}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <button
        className="w-full text-sm text-red-500 border border-red-200 rounded px-2 py-1 hover:bg-red-50 mt-3"
        onClick={() => window.confirm('Clear all vacation days for this year?') && onReset()}
      >
        Reset year
      </button>
    </div>
  )
}
