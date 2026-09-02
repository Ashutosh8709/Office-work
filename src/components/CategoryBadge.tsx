import { motion } from 'framer-motion'
import { categoryStyle } from '../data/categories'

type Props = {
  category: string
  size?: 'md' | 'lg'
  delay?: number
}

export function CategoryBadge({ category, size = 'lg', delay = 0 }: Props) {
  const style = categoryStyle(category)

  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'inline-flex items-center gap-3 rounded-full font-display font-extrabold uppercase tracking-[0.22em] text-white',
        'shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] ring-1 ring-white/40',
        size === 'lg'
          ? 'px-7 py-3 text-xl md:text-2xl 3xl:text-3xl'
          : 'px-4 py-1.5 text-xs md:text-sm',
      ].join(' ')}
      style={{ backgroundImage: style.accent }}
    >
      <span className={size === 'lg' ? 'text-3xl 3xl:text-4xl' : 'text-base'} aria-hidden>
        {style.emoji}
      </span>
      <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">{style.label}</span>
    </motion.div>
  )
}
