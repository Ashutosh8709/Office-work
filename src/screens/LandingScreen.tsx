import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ListChecks, Pencil, Play, Tv } from 'lucide-react'
import { CATEGORIES, categoryStyle } from '../data/categories'

type Props = {
  questionCount: number
  onPlay: () => void
  onEditQuestions: () => void
  onCategories: () => void
  onPresentation: () => void
}

const FLOATERS = [
  { emoji: '🧊', top: '14%', left: '10%', size: 'text-7xl', delay: 0 },
  { emoji: '🔨', top: '70%', left: '86%', size: 'text-7xl', delay: 1.2 },
  { emoji: '💬', top: '76%', left: '13%', size: 'text-6xl', delay: 0.6 },
  { emoji: '🎉', top: '18%', left: '85%', size: 'text-6xl', delay: 1.8 },
]

export function LandingScreen({
  questionCount,
  onPlay,
  onEditQuestions,
  onCategories,
  onPresentation,
}: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        onPlay()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onPlay])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-8">
      {FLOATERS.map((floater) => (
        <motion.span
          key={floater.emoji}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ delay: 0.2 + floater.delay * 0.2, duration: 0.6 }}
          className={`animate-floaty pointer-events-none absolute select-none ${floater.size}`}
          style={{ top: floater.top, left: floater.left, animationDelay: `${floater.delay}s` }}
          aria-hidden
        >
          {floater.emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <span className="rounded-full border-2 border-slate-900/15 bg-white/80 px-6 py-2 font-display text-xs font-extrabold uppercase tracking-[0.3em] text-slate-900/70 md:text-sm">
          Office Ice-Breaker
        </span>

        <h1 className="text-center font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-slate-900 md:text-8xl xl:text-9xl">
          Department
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(100deg,#ff5f8f,#a537ff 45%,#2a8bff)' }}
          >
            Challenge 
          </span>
        </h1>

        <motion.button
          type="button"
          onClick={onPlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="group relative mt-4 flex items-center gap-5 rounded-full bg-slate-900 px-14 py-7 font-display text-2xl font-extrabold uppercase tracking-[0.25em] text-white shadow-[0_30px_70px_-25px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/25 md:text-3xl"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-slate-900/40"
            animate={{ scale: [1, 1.18], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <Play className="h-8 w-8 fill-current md:h-10 md:w-10" />
          Play
        </motion.button>

        <p className="font-body text-xs uppercase tracking-[0.28em] text-slate-900/40">
          {questionCount} questions ready · Press Space to start
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onEditQuestions}
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900/15 bg-white/70 px-6 py-3 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white md:text-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit Questions
          </button>
          <button
            type="button"
            onClick={onCategories}
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900/15 bg-white/70 px-6 py-3 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white md:text-sm"
          >
            <ListChecks className="h-4 w-4" />
            Categories
          </button>
          <button
            type="button"
            onClick={onPresentation}
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900/15 bg-white/70 px-6 py-3 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white md:text-sm"
          >
            <Tv className="h-4 w-4" />
            Presentation Mode
          </button>
        </div>
      </motion.div>
    </div>
  )
}
