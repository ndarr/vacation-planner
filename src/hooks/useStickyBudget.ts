import { useState, useEffect, useRef } from 'react'

export function useStickyBudget() {
  const [isCardVisible, setIsCardVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsCardVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return { cardRef, isCardVisible }
}
