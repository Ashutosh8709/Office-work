import { motion, type Variants } from 'framer-motion'
import { categoryStyle } from '../data/categories'
import type { Question } from '../data/questions'
import type { Theme } from '../hooks/useSettings'

export type TransitionStyle = 'slide' | 'fade' | 'scale' | 'flip' | 'zoom'

export const TRANSITION_STYLES: TransitionStyle[] = ['slide', 'fade', 'scale', 'flip', 'zoom']

const EASE = [0.22, 1, 0.36, 1] as const

const variantsFor = (style: TransitionStyle, direction: 1 | -1): Variants => {
  switch (style) {
    case 'slide':
      return {
        initial: { opacity: 0, x: 140 * direction },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -120 * direction },
      }
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.82, y: 40 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 1.06, y: -30 },
      }
    case 'flip':
      return {
        initial: { opacity: 0, rotateY: 55 * direction, scale: 0.92 },
        animate: { opacity: 1, rotateY: 0, scale: 1 },
        exit: { opacity: 0, rotateY: -40 * direction, scale: 0.95 },
      }
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 1.15 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.92 },
      }
    case 'fade':
    default:
      return {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -18 },
      }
  }
}

const questionTextSize = (length: number, presentation: boolean) => {
  if (length > 150)
    return presentation
      ? 'text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl'
      : 'text-3xl md:text-4xl xl:text-5xl 3xl:text-6xl'
  if (length > 95)
    return presentation
      ? 'text-5xl md:text-6xl xl:text-7xl 3xl:text-8xl'
      : 'text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl'
  if (length > 55)
    return presentation
      ? 'text-6xl md:text-7xl xl:text-8xl 3xl:text-9xl'
      : 'text-5xl md:text-6xl xl:text-7xl 3xl:text-8xl'
  return presentation
    ? 'text-7xl md:text-8xl xl:text-9xl 3xl:text-[9rem]'
    : 'text-6xl md:text-7xl xl:text-8xl 3xl:text-9xl'
}

type Props = {
  question: Question
  transition: TransitionStyle
  direction: 1 | -1
  theme: Theme
  presentation: boolean
  roundLabel: string
}

export function QuestionCard({
  question,
  transition,
  direction,
  theme,
  presentation,
  roundLabel,
}: Props) {
  const style = categoryStyle(question.category)
  const variants = variantsFor(transition, direction)
  const words = question.question.split(' ')

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.55, ease: EASE }}
      style={{ perspective: 1600 }}
      className="flex w-full flex-col items-center gap-8 3xl:gap-12"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 0.85, letterSpacing: '0.42em' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-display text-sm font-bold uppercase tracking-[0.42em] text-slate-900/70 md:text-base 3xl:text-xl"
        >
          {roundLabel}
        </motion.span>
        {/* <CategoryBadge category={question.category} delay={0.08} /> */}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        className={[
          'relative w-full max-w-[1500px] 3xl:max-w-[2000px] overflow-hidden rounded-[3rem] px-10 py-14 md:px-16 md:py-20 3xl:px-24 3xl:py-28',
          'border border-black/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]',
        ].join(' ')}
        style={{ backgroundImage: theme === 'dark' ? style.bgDark : style.bg }}
      >
        <span
          className="absolute -top-1 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full 3xl:w-56"
          style={{ backgroundImage: style.accent }}
        />

        <h1
          className={[
            'text-balance text-center font-display font-extrabold leading-[1.08] text-white',
            'drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
            questionTextSize(question.question.length, presentation),
          ].join(' ')}
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.16 + Math.min(i * 0.035, 0.9),
                duration: 0.42,
                ease: EASE,
              }}
              className="inline-block"
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </h1>
      </motion.div>
    </motion.div>
  )
}
