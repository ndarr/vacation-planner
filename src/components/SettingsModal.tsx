import { useMemo } from 'react'
import { getSupportedCountries } from '../utils/countries'
import type { Settings, Theme } from '../types'

interface Props {
  settings: Settings
  allowance: number
  onUpdateSettings: (patch: Partial<Settings>) => void
  onUpdateAllowance: (allowance: number) => void
  onClose: () => void
}

function SunIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

const THEME_OPTIONS: { value: Theme; label: string; Icon: () => JSX.Element }[] = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'System', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
]

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700/60 p-0.5 gap-0.5">
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md transition-colors ${
            theme === value
              ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

export function SettingsModal({ settings, allowance, onUpdateSettings, onUpdateAllowance, onClose }: Props) {
  const countries = useMemo(getSupportedCountries, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Appearance</span>
            <ThemeToggle theme={settings.theme} onChange={theme => onUpdateSettings({ theme })} />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Vacation days allowance</span>
            <input
              type="number"
              min={0}
              max={365}
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={allowance}
              onChange={e => onUpdateAllowance(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Country</span>
            <select
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={settings.country}
              onChange={e => onUpdateSettings({ country: e.target.value })}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
