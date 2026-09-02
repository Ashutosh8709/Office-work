import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type Props = {
  onPrevious: () => void
  onNext: () => void
  canGoBack: boolean
  canGoForward: boolean
  compact?: boolean
}

export function NavigationControls({
  onPrevious,
  onNext,
  canGoBack,
  canGoForward,
  compact = false,
}: Props) {
  const base = [
    'group inline-flex items-center gap-4 rounded-full font-display font-extrabold uppercase tracking-[0.2em] text-slate-900',
    'border-2 border-slate-900/20 bg-white/70 backdrop-blur-xl transition',
    'hover:bg-white hover:border-slate-900/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/25',
    'disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-white/70',
    compact ? 'px-6 py-3 text-sm' : 'px-10 py-5 text-lg md:text-xl 3xl:text-2xl',
  ].join(' ')

  return (
    <div className="flex w-full items-center justify-between gap-6">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={onPrevious}
        disabled={!canGoBack}
        className={base}
      >
        <ArrowLeft className={compact ? 'h-4 w-4' : 'h-6 w-6 3xl:h-8 3xl:w-8'} />
        Previous
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onNext}
        disabled={!canGoForward}
        className={`${base} shadow-[0_18px_45px_-22px_rgba(0,0,0,0.45)]`}
      >
        Next
        <ArrowRight
          className={`${compact ? 'h-4 w-4' : 'h-6 w-6 3xl:h-8 3xl:w-8'} transition-transform group-hover:translate-x-1`}
        />
      </motion.button>
    </div>
  )
}
