import { motion } from 'framer-motion'
import { ArrowLeft, Moon, Sparkles } from 'lucide-react'
import { CATEGORIES, categoryStyle } from '../data/categories'
import type { QuestionsApi } from '../hooks/useQuestions'
import type { SettingsApi } from '../hooks/useSettings'

type Props = {
  settingsApi: SettingsApi
  questions: QuestionsApi
  onClose: () => void
  focus?: 'settings' | 'categories'
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-6 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-left transition hover:bg-white/18"
    >
      <span className="flex flex-col">
        <span className="font-display text-base font-bold uppercase tracking-[0.14em] text-white">
          {label}
        </span>
        <span className="font-body text-xs text-white/60">{hint}</span>
      </span>
      <span
        className={`relative h-8 w-16 shrink-0 rounded-full transition ${
          value ? 'bg-emerald-400/90' : 'bg-white/25'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${
            value ? 'left-9' : 'left-1'
          }`}
        />
      </span>
    </button>
  )
}

export function Settings({ settingsApi, questions, onClose, focus = 'settings' }: Props) {
  const { settings, update, toggle } = settingsApi
  const panel = settings.theme === 'dark' ? 'glass-dark' : 'glass'

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar px-6 py-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-4xl flex-col gap-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-white md:text-4xl">
            {focus === 'categories' ? 'Categories' : 'Settings'}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to game
          </button>
        </div>

        <div className={`rounded-3xl p-6 ${panel}`}>
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-[0.18em] text-white/85">
            Theme
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                { id: 'vibrant' as const, label: 'Vibrant', icon: Sparkles, preview: 'linear-gradient(135deg,#ff9a3c,#ff4d8d,#a537ff)' },
                { id: 'dark' as const, label: 'Dark', icon: Moon, preview: 'linear-gradient(135deg,#0b0a20,#171334,#080a1c)' },
              ]
            ).map((option) => {
              const active = settings.theme === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => update('theme', option.id)}
                  className={[
                    'relative overflow-hidden rounded-3xl border-2 p-6 text-left transition',
                    active ? 'border-white' : 'border-white/20 hover:border-white/50',
                  ].join(' ')}
                  style={{ backgroundImage: option.preview }}
                >
                  <option.icon className="mb-3 h-6 w-6 text-white" />
                  <span className="font-display text-xl font-extrabold uppercase tracking-[0.16em] text-white">
                    {option.label}
                  </span>
                  {active && (
                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900">
                      Active
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className={`rounded-3xl p-6 ${panel}`}>
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-[0.18em] text-white/85">
            Experience
          </h2>
          <div className="flex flex-col gap-3">
            <Toggle
              label="Dynamic Intros"
              hint="Occasionally hype a question before revealing it"
              value={settings.dynamicIntros}
              onChange={() => toggle('dynamicIntros')}
            />
            <Toggle
              label="Vary Transitions"
              hint="Randomly mix slide, flip, zoom and fade"
              value={settings.varyTransitions}
              onChange={() => toggle('varyTransitions')}
            />
            <Toggle
              label="Keyboard Hints"
              hint="Show the shortcut row at the bottom"
              value={settings.showKeyboardHints}
              onChange={() => toggle('showKeyboardHints')}
            />
            <Toggle
              label="Playful Decorations"
              hint="Floating category shapes in the background"
              value={settings.showDecorations}
              onChange={() => toggle('showDecorations')}
            />
          </div>
        </div>

        <div className={`rounded-3xl p-6 ${panel}`}>
          <h2 className="mb-2 font-display text-lg font-bold uppercase tracking-[0.18em] text-white/85">
            Categories in play
          </h2>
          <p className="mb-4 font-body text-sm text-white/60">
            {questions.total} question{questions.total === 1 ? '' : 's'} currently in the deck.
          </p>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => {
              const style = categoryStyle(category)
              const active = questions.activeCategories.includes(category)
              const count = questions.questions.filter(
                (q) => q.category === category && q.enabled,
              ).length
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => questions.toggleCategory(category)}
                  className={[
                    'flex items-center gap-3 rounded-2xl border-2 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white transition',
                    active ? 'border-white' : 'border-white/20 opacity-50 hover:opacity-80',
                  ].join(' ')}
                  style={{ backgroundImage: active ? style.accent : 'none' }}
                >
                  <span className="text-xl">{style.emoji}</span>
                  {category}
                  <span className="rounded-full bg-black/25 px-2 py-0.5 font-body text-[11px]">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
