import { motion } from 'framer-motion'

export const INTRO_LINES = [
  '⚡ Okay... this one is interesting',
  '👀 Let’s hear this one...',
  '🎯 Brace yourself for this one',
  '🔥 This one always starts something',
  '🎤 No wrong answers. Probably.',
  '🤔 Take a second before you answer',
  '🚀 Big question incoming',
  '🍿 Everyone pay attention to this one',
]

export function IntroOverlay({ line }: { line: string }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
        rotate: -4,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.7, 1, 1, 1.05],
        rotate: [-4, 0, 0, 0],
      }}
      transition={{
        duration: 2.7,
        times: [0, 0.2, 0.85, 1],
        ease: 'easeInOut',
      }}
      className="flex w-full flex-col items-center justify-center gap-10 px-10"
    >
      <div
        className="text-balance text-center font-display text-5xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 md:text-7xl xl:text-8xl 3xl:text-9xl"
      >
        {line}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '38%' }}
        transition={{
          duration: 1.1,
          ease: 'easeInOut',
        }}
        className="h-2 rounded-full bg-slate-900/70"
      />
    </motion.div>
  )
}