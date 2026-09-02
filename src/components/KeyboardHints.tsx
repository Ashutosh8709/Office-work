type Hint = { keys: string[]; label: string }

const HINTS: Hint[] = [
  { keys: ['←'], label: 'Previous' },
  { keys: ['Space', '→'], label: 'Next' },
  { keys: ['R'], label: 'Replay' },
  { keys: ['P'], label: 'Presentation' },
  { keys: ['Esc'], label: 'Menu' },
]

export function KeyboardHints({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-7 gap-y-3 ${
        dimmed ? 'opacity-40' : 'opacity-90'
      }`}
    >
      {HINTS.map((hint) => (
        <div key={hint.label} className="flex items-center gap-2">
          {hint.keys.map((key) => (
            <kbd
              key={key}
              className="rounded-lg border border-slate-900/20 bg-white px-2.5 py-1 font-body text-xs font-semibold text-slate-900 shadow-sm md:text-sm 3xl:text-base"
            >
              {key}
            </kbd>
          ))}
          <span className="font-body text-xs font-medium uppercase tracking-[0.18em] text-slate-900/70 md:text-sm 3xl:text-base">
            {hint.label}
          </span>
        </div>
      ))}
    </div>
  )
}
