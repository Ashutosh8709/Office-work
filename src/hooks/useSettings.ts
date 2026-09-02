import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'vibrant' | 'dark'

export type Settings = {
  theme: Theme
  dynamicIntros: boolean
  varyTransitions: boolean
  showKeyboardHints: boolean
  showDecorations: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'vibrant',
  dynamicIntros: true,
  varyTransitions: true,
  showKeyboardHints: true,
  showDecorations: true,
}

const STORAGE_KEY = 'office-questions:settings'

export function useSettings() {
  const [stored, setStored, resetStored] = useLocalStorage<Settings>(STORAGE_KEY, DEFAULT_SETTINGS)
  const settings: Settings = { ...DEFAULT_SETTINGS, ...stored }

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setStored((prev) => ({ ...DEFAULT_SETTINGS, ...prev, [key]: value }))
    },
    [setStored],
  )

  const toggle = useCallback(
    (key: 'dynamicIntros' | 'varyTransitions' | 'showKeyboardHints' | 'showDecorations') => {
      setStored((prev) => {
        const merged = { ...DEFAULT_SETTINGS, ...prev }
        return { ...merged, [key]: !merged[key] }
      })
    },
    [setStored],
  )

  return { settings, update, toggle, resetSettings: resetStored }
}

export type SettingsApi = ReturnType<typeof useSettings>
