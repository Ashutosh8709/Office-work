import { AnimatePresence, motion } from 'framer-motion'
import {
  ListChecks,
  Pencil,
  Play,
  RotateCcw,
  Settings2,
  Shuffle,
  Sparkles,
  Tv,
} from 'lucide-react'
import type { Theme } from '../hooks/useSettings'

export type MenuAction =
  | 'resume'
  | 'editor'
  | 'categories'
  | 'settings'
  | 'shuffle'
  | 'presentation'
  | 'reset'

type Props = {
  open: boolean
  theme: Theme
  onClose: () => void
  onAction: (action: MenuAction) => void
}

const ITEMS: { action: MenuAction; label: string; hint: string; icon: typeof Play }[] = [
  { action: 'resume', label: 'Resume Game', hint: 'Back to the question', icon: Play },
  { action: 'presentation', label: 'Presentation Mode', hint: 'Big screen + fullscreen', icon: Tv },
  { action: 'editor', label: 'Edit Questions', hint: 'Add, edit, import, export', icon: Pencil },
  { action: 'categories', label: 'Categories', hint: 'Choose what plays', icon: ListChecks },
  { action: 'settings', label: 'Settings', hint: 'Theme, intros, hints', icon: Settings2 },
  { action: 'shuffle', label: 'Shuffle Deck', hint: 'Randomise the order', icon: Shuffle },
  { action: 'reset', label: 'Reset Everything', hint: 'Restore demo questions', icon: RotateCcw },
]

export function Menu({ open, theme, onClose, onAction }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className={[
              'w-full max-w-xl overflow-hidden rounded-[2.25rem] p-8',
              theme === 'dark' ? 'glass-dark' : 'glass',
              'shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)]',
            ].join(' ')}
          >
            <div className="mb-7 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.2em] text-white">
                Department Challenge
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {ITEMS.map((item) => (
                <button
                  key={item.action}
                  type="button"
                  onClick={() => onAction(item.action)}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white transition group-hover:bg-white/25">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-display text-lg font-bold text-white">{item.label}</span>
                    <span className="font-body text-xs uppercase tracking-[0.16em] text-white/60">
                      {item.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-7 text-center font-body text-xs uppercase tracking-[0.22em] text-white/50">
              Press Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
