import { useMemo } from 'react'
import { CalendarGrid } from './components/CalendarGrid'
import { getHolidays } from './utils/holidays'
import { useVacationStore } from './hooks/useVacationStore'

function App() {
  const year = 2026
  const { store, toggleDay } = useVacationStore(year)
  const holidays = useMemo(() => getHolidays(year, 'DE'), [year])
  const vacationDays = useMemo(() => new Set(store.vacationDays), [store.vacationDays])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Vacation Planner</h1>
      <CalendarGrid
        year={year}
        holidays={holidays}
        vacationDays={vacationDays}
        onToggleDay={toggleDay}
      />
    </div>
  )
}

export default App
