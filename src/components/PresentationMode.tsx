import { motion } from 'framer-motion'
import { Minimize2, Tv } from 'lucide-react'

export function EnterPresentationButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-3 rounded-full border-2 border-slate-900/20 bg-slate-900 px-7 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/25 md:text-base 3xl:text-lg"
    >
      <Tv className="h-5 w-5" />
      Enter Presentation Mode
    </motion.button>
  )
}

export function ExitPresentationButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 bg-white/80 px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
      title="Exit presentation mode (P)"
    >
      <Minimize2 className="h-3.5 w-3.5" />
      Exit
    </motion.button>
  )
}
