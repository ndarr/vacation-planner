import { useEffect } from 'react'
import type { Theme } from '../types'

export function useTheme(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      return
    }

    if (theme === 'light') {
      root.classList.remove('dark')
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => root.classList.toggle('dark', mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
    }
  }, [theme])
}
