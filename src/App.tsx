import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Backdrop } from './components/Backdrop'
import { IceBreaker } from './components/IceBreaker'
import { Menu, type MenuAction } from './components/Menu'
import { LandingScreen } from './screens/LandingScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { QuestionEditor } from './screens/QuestionEditor'
import { Settings } from './screens/Settings'
import { useFullscreen } from './hooks/useFullscreen'
import { useQuestions } from './hooks/useQuestions'
import { useSettings } from './hooks/useSettings'

type View = 'landing' | 'icebreaker' | 'game' | 'editor' | 'settings' | 'categories'

const SECONDARY_VIEWS: View[] = ['editor', 'settings', 'categories']

export default function App() {
  const questions = useQuestions()
  const settingsApi = useSettings()
  const { settings } = settingsApi
  const fullscreen = useFullscreen()

  const [view, setView] = useState<View>('landing')
  const [menuOpen, setMenuOpen] = useState(false)
  const [presentation, setPresentation] = useState(false)

  const enterPresentation = useCallback(() => {
    setView('game')
    setMenuOpen(false)
    setPresentation(true)
    void fullscreen.enter()
  }, [fullscreen])

  const startWithPresentation = useCallback(() => {
    setPresentation(true)
    void fullscreen.enter()
    setView('icebreaker')
  }, [fullscreen])

  const exitPresentation = useCallback(() => {
    setPresentation(false)
    void fullscreen.exit()
  }, [fullscreen])

  const handleMenuAction = useCallback(
    (action: MenuAction) => {
      switch (action) {
        case 'resume':
          setMenuOpen(false)
          setView('game')
          break
        case 'editor':
          setMenuOpen(false)
          setPresentation(false)
          setView('editor')
          break
        case 'categories':
          setMenuOpen(false)
          setPresentation(false)
          setView('categories')
          break
        case 'settings':
          setMenuOpen(false)
          setPresentation(false)
          setView('settings')
          break
        case 'shuffle':
          questions.shuffleDeck()
          setMenuOpen(false)
          setView('game')
          break
        case 'presentation':
          enterPresentation()
          break
        case 'reset':
          if (window.confirm('Reset all questions, categories and progress to the demo set?')) {
            questions.resetAll()
            settingsApi.resetSettings()
            setMenuOpen(false)
            setView('game')
          }
          break
      }
    },
    [questions, settingsApi, enterPresentation],
  )

  // Escape closes the menu or a secondary screen; the game screen handles Escape itself.
  useEffect(() => {
    const isSecondary = SECONDARY_VIEWS.includes(view)
    if (!isSecondary && !menuOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (menuOpen) setMenuOpen(false)
      else setView('game')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, menuOpen])

  const backgroundCategory = questions.current?.category ?? 'Random'

  return (
    <div className="relative h-full w-full overflow-hidden font-body text-white">
      {SECONDARY_VIEWS.includes(view) ? (
        <Backdrop
          category={backgroundCategory}
          theme={settings.theme}
          showDecorations={false}
          variant="gradient"
        />
      ) : (
        view !== 'game' && (
          <Backdrop category={backgroundCategory} theme={settings.theme} showDecorations={false} />
        )
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 h-full w-full"
        >
          {view === 'landing' && (
            <LandingScreen
              questionCount={questions.total}
              onPlay={startWithPresentation}
              onEditQuestions={() => setView('editor')}
              onCategories={() => setView('categories')}
              onPresentation={startWithPresentation}
            />
          )}

          {view === 'icebreaker' && <IceBreaker onDone={() => setView('game')} />}

          {view === 'game' && (
            <QuestionScreen
              questions={questions}
              settings={settings}
              presentation={presentation}
              keyboardEnabled={!menuOpen}
              onOpenMenu={() => setMenuOpen((open) => !open)}
              onEnterPresentation={enterPresentation}
              onExitPresentation={exitPresentation}
            />
          )}

          {view === 'editor' && (
            <QuestionEditor
              questions={questions}
              theme={settings.theme}
              onClose={() => setView('game')}
            />
          )}

          {(view === 'settings' || view === 'categories') && (
            <Settings
              settingsApi={settingsApi}
              questions={questions}
              focus={view === 'categories' ? 'categories' : 'settings'}
              onClose={() => setView('game')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <Menu
        open={menuOpen}
        theme={settings.theme}
        onClose={() => setMenuOpen(false)}
        onAction={handleMenuAction}
      />
    </div>
  )
}
