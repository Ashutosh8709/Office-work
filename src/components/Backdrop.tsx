import { motion } from 'framer-motion'
import { categoryStyle } from '../data/categories'
import type { Theme } from '../hooks/useSettings'

type Props = {
  category: string
  theme: Theme
  showDecorations: boolean
  /** 'grid' = white paper with black grid lines, 'gradient' = full colour wash */
  variant?: 'grid' | 'gradient'
}

const MOOD_SHAPES: Record<string, { emoji: string; top: string; left: string; size: string }[]> = {
  playful: [
    { emoji: '😂', top: '12%', left: '8%', size: 'text-7xl' },
    { emoji: '🎈', top: '68%', left: '85%', size: 'text-6xl' },
    { emoji: '🍿', top: '78%', left: '12%', size: 'text-5xl' },
  ],
  energetic: [
    { emoji: '🔥', top: '16%', left: '86%', size: 'text-7xl' },
    { emoji: '⚡', top: '72%', left: '9%', size: 'text-6xl' },
    { emoji: '💬', top: '82%', left: '80%', size: 'text-5xl' },
  ],
  elegant: [
    { emoji: '✦', top: '18%', left: '10%', size: 'text-5xl' },
    { emoji: '✧', top: '76%', left: '88%', size: 'text-4xl' },
  ],
  chaotic: [
    { emoji: '🎲', top: '14%', left: '12%', size: 'text-7xl' },
    { emoji: '🌀', top: '70%', left: '84%', size: 'text-6xl' },
    { emoji: '🛸', top: '24%', left: '82%', size: 'text-5xl' },
    { emoji: '🍕', top: '80%', left: '18%', size: 'text-5xl' },
  ],
  workplace: [
    { emoji: '☕', top: '15%', left: '9%', size: 'text-6xl' },
    { emoji: '📎', top: '74%', left: '87%', size: 'text-5xl' },
    { emoji: '🗂️', top: '80%', left: '14%', size: 'text-5xl' },
  ],
  warm: [
    { emoji: '❤️', top: '17%', left: '87%', size: 'text-6xl' },
    { emoji: '🌸', top: '73%', left: '10%', size: 'text-5xl' },
  ],
}

export function Backdrop({ category, theme, showDecorations, variant = 'grid' }: Props) {
  const style = categoryStyle(category)
  const shapes = MOOD_SHAPES[style.mood] ?? []

  if (variant === 'grid') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white" style={{opacity: 0.3}}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.18) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        key={`${style.id}-${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0"
        style={{ backgroundImage: theme === 'dark' ? style.bgDark : style.bg }}
      />

      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55), transparent 45%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.35), transparent 40%)',
        }}
      />

      <div
        className="animate-drift absolute -left-[15%] -top-[20%] h-[70vh] w-[70vh] rounded-full blur-3xl"
        style={{ background: style.glow, opacity: theme === 'dark' ? 0.28 : 0.4 }}
      />
      <div
        className="animate-drift absolute -bottom-[25%] -right-[10%] h-[80vh] w-[80vh] rounded-full blur-3xl"
        style={{
          background: style.glow,
          opacity: theme === 'dark' ? 0.22 : 0.3,
          animationDelay: '-8s',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {showDecorations &&
        shapes.map((shape, i) => (
          <motion.span
            key={`${style.id}-${shape.emoji}-${i}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: theme === 'dark' ? 0.35 : 0.5, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
            className={`animate-floaty absolute select-none ${shape.size} 3xl:scale-150`}
            style={{
              top: shape.top,
              left: shape.left,
              animationDelay: `${i * 1.4}s`,
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))',
            }}
            aria-hidden
          >
            {shape.emoji}
          </motion.span>
        ))}

      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
