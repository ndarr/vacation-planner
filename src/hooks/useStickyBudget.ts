import { useState, useEffect, useRef } from 'react'

export function useStickyBudget() {
  const [calendarVisible, setCalendarVisible] = useState(true)
  const [panelVisible, setPanelVisible] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setCalendarVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (calendarRef.current) observer.observe(calendarRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setPanelVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (panelRef.current) observer.observe(panelRef.current)
    return () => observer.disconnect()
  }, [])

  // Show bar only while calendar is visible but budget/periods panel is not yet scrolled into view
  const showBar = calendarVisible && !panelVisible

  return { calendarRef, panelRef, showBar }
}
