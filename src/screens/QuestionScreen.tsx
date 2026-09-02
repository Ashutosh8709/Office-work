import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, RefreshCw, Sparkles } from 'lucide-react'
import { Backdrop } from '../components/Backdrop'
import { INTRO_LINES, IntroOverlay } from '../components/IntroOverlay'
import {
  QuestionCard,
  TRANSITION_STYLES,
  type TransitionStyle,
} from '../components/QuestionCard'
import {
  EnterPresentationButton,
  ExitPresentationButton,
} from '../components/PresentationMode'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import type { QuestionsApi } from '../hooks/useQuestions'
import type { Settings } from '../hooks/useSettings'

const INTRO_CHANCE = 0.28
const INTRO_DURATION = 2000
const pad = (n: number) => String(n).padStart(2, '0')

type Props = {
  questions: QuestionsApi
  settings: Settings
  presentation: boolean
  keyboardEnabled: boolean
  onOpenMenu: () => void
  onEnterPresentation: () => void
  onExitPresentation: () => void
}

export function QuestionScreen({
  questions,
  settings,
  presentation,
  keyboardEnabled,
  onOpenMenu,
  onEnterPresentation,
  onExitPresentation,
}: Props) {
  const { current, index, total, next, previous } = questions
  const [direction, setDirection] = useState<1 | -1>(1)
  const [transition, setTransition] = useState<TransitionStyle>('slide')
  const [replayToken, setReplayToken] = useState(0)
  const [intro, setIntro] = useState<string | null>(null)
  const introTimer = useRef<number | null>(null)

  const clearIntro = useCallback(() => {
    if (introTimer.current !== null) {
      window.clearTimeout(introTimer.current)
      introTimer.current = null
    }
    setIntro(null)
  }, [])

  useEffect(() => clearIntro, [clearIntro])

  const rollTransition = useCallback(() => {
    if (!settings.varyTransitions) {
      setTransition('slide')
      return
    }
    setTransition(TRANSITION_STYLES[Math.floor(Math.random() * TRANSITION_STYLES.length)])
  }, [settings.varyTransitions])

  const maybeIntro = useCallback(() => {
    clearIntro()
    if (!settings.dynamicIntros) return
    if (Math.random() > INTRO_CHANCE) return
    setIntro(INTRO_LINES[Math.floor(Math.random() * INTRO_LINES.length)])
    introTimer.current = window.setTimeout(() => {
      introTimer.current = null
      setIntro(null)
    }, INTRO_DURATION)
  }, [clearIntro, settings.dynamicIntros])

  const handleNext = useCallback(() => {
    if (index >= total - 1) return
    setDirection(1)
    rollTransition()
    maybeIntro()
    next()
  }, [index, total, rollTransition, maybeIntro, next])

  const handlePrevious = useCallback(() => {
    if (index <= 0) return
    setDirection(-1)
    rollTransition()
    clearIntro()
    previous()
  }, [index, rollTransition, clearIntro, previous])

  const handleReplay = useCallback(() => {
    clearIntro()
    rollTransition()
    setReplayToken((token) => token + 1)
  }, [clearIntro, rollTransition])

  useKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onReplay: handleReplay,
    onMenu: onOpenMenu,
    onExit: presentation ? onExitPresentation : onEnterPresentation,
    enabled: keyboardEnabled,
  })

  if (!current) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <Backdrop category="Random" theme={settings.theme} showDecorations={false} />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <h1 className="font-display text-4xl font-extrabold text-slate-900 md:text-6xl">
            No questions to show
          </h1>
          <p className="max-w-xl font-body text-lg text-slate-900/70">
            Every question is disabled or filtered out. Open the menu to enable categories or add new
            questions.
          </p>
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-full bg-slate-900 px-8 py-4 font-display text-base font-extrabold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
          >
            Open Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Backdrop
        category={current.category}
        theme={settings.theme}
        showDecorations={settings.showDecorations}
      />

      <div className="relative z-10 flex h-full w-full flex-col px-8 py-6 md:px-14 md:py-10 3xl:px-24 3xl:py-16">
        <header className="flex items-start justify-between gap-4">
          {!presentation ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900">
                  <Sparkles className="h-5 w-5 text-white" />
                </span>
                <span className="font-display text-base font-extrabold uppercase tracking-[0.24em] text-slate-900/85 md:text-lg">
                  Department Challenge
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  title="Replay animation (R)"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-900/20 bg-white/70 text-slate-900 backdrop-blur-md transition hover:bg-white"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <EnterPresentationButton onClick={onEnterPresentation} />
                <button
                  type="button"
                  onClick={onOpenMenu}
                  title="Menu (Esc)"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-900/20 bg-white/70 text-slate-900 backdrop-blur-md transition hover:bg-white"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="ml-auto">
              <ExitPresentationButton onClick={onExitPresentation} />
            </div>
          )}
        </header>

        <main className="flex flex-1 items-center justify-center py-6">
          <AnimatePresence mode="wait" initial={false}>
            {intro ? (
              <IntroOverlay key={`intro-${current.id}-${replayToken}`} line={intro} />
            ) : (
              <QuestionCard
                key={`${current.id}-${replayToken}`}
                question={current}
                transition={transition}
                direction={direction}
                theme={settings.theme}
                presentation={presentation}
                roundLabel={`Question ${pad(index + 1)}`}
              />
            )}
          </AnimatePresence>
        </main>

        {/* <footer className="flex flex-col items-center gap-6">
          {presentation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <ProgressIndicator index={index} total={total} compact />
              <p className="font-body text-[11px] uppercase tracking-[0.28em] text-slate-900/40">
                Space / → Next · ← Previous · Esc Menu
              </p>
            </motion.div>
          ) : (
            <>
              <ProgressIndicator index={index} total={total} />
              <div className="w-full max-w-[1500px]">
                <NavigationControls
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  canGoBack={index > 0}
                  canGoForward={index < total - 1}
                />
              </div>
              {settings.showKeyboardHints && <KeyboardHints />}
            </>
          )}
        </footer> */}
      </div>
    </div>
  )
}
