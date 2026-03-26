import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CalendarGrid } from './components/CalendarGrid'
import { BudgetTracker } from './components/BudgetTracker'
import { PeriodsPanel } from './components/PeriodsPanel'
import { HolidaysPanel } from './components/HolidaysPanel'
import { SettingsModal } from './components/SettingsModal'
import { Legend } from './components/Legend'
import { YearSelector } from './components/YearSelector'
import { getHolidays } from './utils/holidays'
import { computePeriods } from './utils/periods'
import { exportToICS } from './utils/export'
import { useSettings } from './hooks/useSettings'
import { useVacationStore } from './hooks/useVacationStore'
import { useStickyBudget } from './hooks/useStickyBudget'
import { useTheme } from './hooks/useTheme'

function GearIcon() {
  return (
    <svg className="w-6 h-6 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function App() {
  const { settings, update: updateSettings } = useSettings()
  const { store, toggleDay, setAllowance, setTripName, removeDays, resetDays } = useVacationStore(settings.year)
  const { calendarRef, panelRef, showBar } = useStickyBudget()
  const [settingsOpen, setSettingsOpen] = useState(false)
  useTheme(settings.theme)

  const holidays = useMemo(() => {
    const publicHolidays = getHolidays(settings.year, settings.country, settings.region)
    const custom = settings.customHolidays.map(h => ({
      date: `${settings.year}-${h.date}`,
      name: h.name,
      halfDay: h.halfDay,
    }))
    return [...publicHolidays, ...custom].sort((a, b) => a.date.localeCompare(b.date))
  }, [settings.year, settings.country, settings.region, settings.customHolidays])
  const holidaySet = useMemo(() => new Set(holidays.map(h => h.date)), [holidays])
  const halfHolidaySet = useMemo(() => new Set(holidays.filter(h => h.halfDay).map(h => h.date)), [holidays])
  const vacationDays = useMemo(() => new Set(store.vacationDays), [store.vacationDays])
  const halfDays = useMemo(() => new Set(store.halfDays), [store.halfDays])
  const periods = useMemo(
    () => computePeriods(store.vacationDays, store.halfDays, holidaySet),
    [store.vacationDays, store.halfDays, holidaySet]
  )

  const usedDays = store.vacationDays.length + store.halfDays.length * 0.5
  const budgetProps = { allowance: store.allowance, usedDays }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>

      {/* Fixed bottom budget bar — mobile only, shown while calendar visible but budget/periods panel not yet in view */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 pt-3 transition-transform duration-300 ${showBar ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <BudgetTracker {...budgetProps} compact />
      </div>

      <main className="flex-1 p-6 lg:p-8 lg:overflow-auto">
        <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Vacation Planner</h1>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Settings"
            >
              <GearIcon />
            </button>
          </div>
          <YearSelector year={settings.year} onChange={year => updateSettings({ year })} />
        </div>
        <div className="mb-4">
          <Legend />
        </div>
        <div ref={calendarRef}>
          <CalendarGrid
            year={settings.year}
            holidays={holidaySet}
            halfHolidays={halfHolidaySet}
            vacationDays={vacationDays}
            halfDays={halfDays}
            onToggleDay={date => toggleDay(date, halfHolidaySet.has(date))}
          />
        </div>
        </div>
      </main>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 bg-white dark:bg-gray-800 lg:overflow-y-auto pb-16 lg:pb-6">
        <div ref={panelRef} className="flex flex-col gap-4">
          <BudgetTracker {...budgetProps} />
          <PeriodsPanel
            periods={periods}
            tripNames={store.tripNames}
            onDeletePeriod={period => removeDays(period.dates, format(period.dates[0], 'yyyy-MM-dd'))}
            onSetTripName={setTripName}
            onExport={() => exportToICS(periods, settings.year)}
          />
        </div>
        <HolidaysPanel holidays={holidays} />
        <button
          className="w-full text-sm text-red-500 border border-red-200 dark:border-red-800 rounded px-2 py-3 sm:py-1 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => window.confirm('Clear all vacation days for this year?') && resetDays()}
        >
          Reset year
        </button>
      </aside>

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          allowance={store.allowance}
          onUpdateSettings={updateSettings}
          onUpdateAllowance={setAllowance}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
