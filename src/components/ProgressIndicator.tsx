import { motion } from 'framer-motion'

type Props = {
  index: number
  total: number
  compact?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

export function ProgressIndicator({ index, total, compact = false }: Props) {
  const progress = total <= 1 ? 1 : (index + 1) / total

  return (
    <div className="flex w-full max-w-[620px] flex-col items-center gap-3">
      <div
        className={[
          'font-display font-extrabold tabular-nums tracking-[0.3em] text-slate-900/80',
          compact ? 'text-lg 3xl:text-2xl' : 'text-2xl md:text-3xl 3xl:text-4xl',
        ].join(' ')}
      >
        {pad(index + 1)} <span className="text-slate-900/40">/</span> {pad(total)}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 3xl:h-3">
        <motion.div
          className="h-full rounded-full bg-slate-900/85"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
