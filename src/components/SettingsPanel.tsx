import { useMemo, useState } from 'react'
import { getSupportedCountries } from '../utils/countries'
import type { Settings, Theme } from '../types'

interface Props {
  settings: Settings
  allowance: number
  onUpdateSettings: (patch: Partial<Settings>) => void
  onUpdateAllowance: (allowance: number) => void
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
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs transition-colors ${
            theme === value
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

export function SettingsPanel({ settings, allowance, onUpdateSettings, onUpdateAllowance }: Props) {
  const [expanded, setExpanded] = useState(false)
  const countries = useMemo(getSupportedCountries, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded(prev => !prev)}
      >
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Settings</h2>
        <span className="text-gray-400 dark:text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-150 ease-in-out ${expanded ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Appearance</span>
              <ThemeToggle theme={settings.theme} onChange={theme => onUpdateSettings({ theme })} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Vacation days</span>
              <input
                type="number"
                min={0}
                max={365}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={allowance}
                onChange={e => onUpdateAllowance(Number(e.target.value))}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Country</span>
              <select
                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
    </div>
  )
}
