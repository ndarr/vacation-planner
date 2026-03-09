import { useMemo } from 'react'
import { CalendarGrid } from './components/CalendarGrid'
import { BudgetTracker } from './components/BudgetTracker'
import { PeriodsPanel } from './components/PeriodsPanel'
import { HolidaysPanel } from './components/HolidaysPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Legend } from './components/Legend'
import { YearSelector } from './components/YearSelector'
import { getHolidays } from './utils/holidays'
import { computePeriods } from './utils/periods'
import { useSettings } from './hooks/useSettings'
import { useVacationStore } from './hooks/useVacationStore'
import { useStickyBudget } from './hooks/useStickyBudget'
import { useTheme } from './hooks/useTheme'

function App() {
  const { settings, update: updateSettings } = useSettings()
  const { store, toggleDay, setAllowance, removeDays, resetDays } = useVacationStore(settings.year)
  const { cardRef, isCardVisible } = useStickyBudget()
  useTheme(settings.theme)

  const holidays = useMemo(
    () => getHolidays(settings.year, settings.country, settings.region),
    [settings.year, settings.country, settings.region]
  )
  const holidaySet = useMemo(() => new Set(holidays.map(h => h.date)), [holidays])
  const vacationDays = useMemo(() => new Set(store.vacationDays), [store.vacationDays])
  const periods = useMemo(() => computePeriods(store.vacationDays, holidaySet), [store.vacationDays, holidaySet])

  const budgetProps = { allowance: store.allowance, usedDays: store.vacationDays.length }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden">

      {/* Fixed bottom budget bar — mobile only, visible while card is out of view */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-transform duration-300 ${isCardVisible ? 'translate-y-full' : 'translate-y-0'}`}>
        <BudgetTracker {...budgetProps} compact />
      </div>

      <main className="flex-1 p-6 lg:p-8 lg:overflow-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Vacation Planner</h1>
            <Legend />
          </div>
          <YearSelector year={settings.year} onChange={year => updateSettings({ year })} />
        </div>
        <CalendarGrid
          year={settings.year}
          holidays={holidaySet}
          vacationDays={vacationDays}
          onToggleDay={toggleDay}
        />
      </main>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 bg-white dark:bg-gray-800 lg:overflow-y-auto pb-16 lg:pb-6">
        <div ref={cardRef}>
          <BudgetTracker {...budgetProps} />
        </div>
        <PeriodsPanel periods={periods} onDeletePeriod={period => removeDays(period.dates)} />
        <HolidaysPanel holidays={holidays} />
        <button
          className="w-full text-sm text-red-500 border border-red-200 dark:border-red-800 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => window.confirm('Clear all vacation days for this year?') && resetDays()}
        >
          Reset year
        </button>
        <SettingsPanel
          settings={settings}
          allowance={store.allowance}
          onUpdateSettings={updateSettings}
          onUpdateAllowance={setAllowance}
        />
      </aside>
    </div>
  )
}

export default App
