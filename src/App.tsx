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

function App() {
  const { settings, update: updateSettings } = useSettings()
  const { store, toggleDay, setAllowance, resetDays } = useVacationStore(settings.year)

  const holidays = useMemo(
    () => getHolidays(settings.year, settings.country, settings.region),
    [settings.year, settings.country, settings.region]
  )
  const holidaySet = useMemo(() => new Set(holidays.map(h => h.date)), [holidays])
  const vacationDays = useMemo(() => new Set(store.vacationDays), [store.vacationDays])
  const periods = useMemo(() => computePeriods(store.vacationDays, holidaySet), [store.vacationDays, holidaySet])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      <main className="flex-1 p-6 lg:p-8 lg:overflow-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-500">Vacation Planner</h1>
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
      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-200 p-6 flex flex-col gap-4 bg-white lg:overflow-y-auto">
        <BudgetTracker allowance={store.allowance} usedDays={store.vacationDays.length} />
        <PeriodsPanel periods={periods} />
        <HolidaysPanel holidays={holidays} />
        <SettingsPanel
          settings={settings}
          allowance={store.allowance}
          onUpdateSettings={updateSettings}
          onUpdateAllowance={setAllowance}
          onReset={resetDays}
        />
      </aside>
    </div>
  )
}

export default App
