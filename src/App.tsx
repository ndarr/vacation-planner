import { useMemo } from 'react'
import { CalendarGrid } from './components/CalendarGrid'
import { BudgetTracker } from './components/BudgetTracker'
import { PeriodsPanel } from './components/PeriodsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Legend } from './components/Legend'
import { getHolidays } from './utils/holidays'
import { computePeriods } from './utils/periods'
import { useSettings } from './hooks/useSettings'
import { useVacationStore } from './hooks/useVacationStore'

function App() {
  const { settings, update: updateSettings } = useSettings()
  const { store, toggleDay, setAllowance } = useVacationStore(settings.year)

  const holidays = useMemo(
    () => getHolidays(settings.year, settings.country, settings.region),
    [settings.year, settings.country, settings.region]
  )
  const vacationDays = useMemo(() => new Set(store.vacationDays), [store.vacationDays])
  const periods = useMemo(() => computePeriods(store.vacationDays, holidays), [store.vacationDays, holidays])

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Vacation Planner {settings.year}</h1>
          <Legend />
        </div>
        <CalendarGrid
          year={settings.year}
          holidays={holidays}
          vacationDays={vacationDays}
          onToggleDay={toggleDay}
        />
      </main>
      <aside className="w-72 border-l border-gray-200 p-6 flex flex-col gap-4 bg-white overflow-y-auto">
        <BudgetTracker allowance={store.allowance} usedDays={store.vacationDays.length} />
        <PeriodsPanel periods={periods} />
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
