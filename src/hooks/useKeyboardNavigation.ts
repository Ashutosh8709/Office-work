import { useEffect } from 'react'

type Handlers = {
  onNext: () => void
  onPrevious: () => void
  onReplay: () => void
  onMenu: () => void
  onExit?: () => void
  enabled?: boolean
}

const isTyping = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onReplay,
  onMenu,
  onExit,
  enabled = true,
}: Handlers) {
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return

      switch (event.key) {
        case ' ':
        case 'Spacebar':
        case 'ArrowRight':
        case 'Enter':
          event.preventDefault()
          onNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          onPrevious()
          break
        case 'r':
        case 'R':
          event.preventDefault()
          onReplay()
          break
        case 'Escape':
          event.preventDefault()
          onMenu()
          break
        case 'p':
        case 'P':
          event.preventDefault()
          onExit?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNext, onPrevious, onReplay, onMenu, onExit, enabled])
}
