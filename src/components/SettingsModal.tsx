import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { getSupportedCountries } from '../utils/countries'
import { getRegions } from '../utils/regions'
import type { Settings, Theme, CustomHoliday } from '../types'

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
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 sm:py-1.5 text-xs rounded-md transition-colors ${
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

function formatMMDD(mmdd: string): string {
  const [month, day] = mmdd.split('-').map(Number)
  return format(new Date(2000, month - 1, day), 'MMM d')
}

function CustomHolidaysSection({ customHolidays, onChange }: {
  customHolidays: CustomHoliday[]
  onChange: (holidays: CustomHoliday[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newName, setNewName] = useState('')
  const [newHalfDay, setNewHalfDay] = useState(false)

  function add() {
    if (!newDate || !newName.trim()) return
    const [, month, day] = newDate.split('-')
    onChange([...customHolidays, { date: `${month}-${day}`, name: newName.trim(), halfDay: newHalfDay || undefined }])
    setAdding(false)
    setNewDate('')
    setNewName('')
    setNewHalfDay(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Company Holidays</span>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 h-11 sm:h-auto flex items-center"
          >
            + Add
          </button>
        )}
      </div>

      {customHolidays.length === 0 && !adding && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">None added yet.</p>
      )}

      {customHolidays.map((h, i) => (
        <div key={i} className="flex items-center justify-between py-0.5">
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {h.name}{h.halfDay && <span className="ml-1 text-xs text-gray-400">½</span>}
          </span>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatMMDD(h.date)}</span>
            <button
              onClick={() => onChange(customHolidays.filter((_, j) => j !== i))}
              className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center text-red-400 hover:text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {adding && (
        <div className="flex flex-col gap-2 pt-1">
          <input
            type="text"
            placeholder="e.g. Christmas Eve"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newHalfDay}
              onChange={e => setNewHalfDay(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Half day</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={add}
              className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 sm:py-1.5 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setNewDate(''); setNewName('') }}
              className="flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg py-3 sm:py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsModal({ settings, allowance, onUpdateSettings, onUpdateAllowance, onClose }: Props) {
  const countries = useMemo(getSupportedCountries, [])
  const regions = useMemo(() => getRegions(settings.country), [settings.country])
  const [allowanceInput, setAllowanceInput] = useState(String(allowance))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Appearance</span>
            <ThemeToggle theme={settings.theme} onChange={theme => onUpdateSettings({ theme })} />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Vacation days allowance</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={allowanceInput}
              onChange={e => setAllowanceInput(e.target.value)}
              onBlur={() => {
                const parsed = parseInt(allowanceInput, 10)
                const value = isNaN(parsed) ? 0 : Math.min(365, Math.max(0, parsed))
                onUpdateAllowance(value)
                setAllowanceInput(String(value))
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Country</span>
            <select
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={settings.country}
              onChange={e => onUpdateSettings({ country: e.target.value, region: undefined })}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </label>

          {regions.length > 0 && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Region</span>
              <select
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 sm:py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={settings.region ?? ''}
                onChange={e => onUpdateSettings({ region: e.target.value || undefined })}
              >
                <option value="">All regions (national only)</option>
                {regions.map(r => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </label>
          )}

          <hr className="border-gray-100 dark:border-gray-700" />

          <CustomHolidaysSection
            customHolidays={settings.customHolidays}
            onChange={customHolidays => onUpdateSettings({ customHolidays })}
          />
        </div>
      </div>
    </div>
  )
}
