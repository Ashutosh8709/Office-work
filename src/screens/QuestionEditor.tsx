import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { CATEGORIES, categoryStyle, type Category } from '../data/categories'
import type { QuestionsApi } from '../hooks/useQuestions'
import type { Theme } from '../hooks/useSettings'

type Props = {
  questions: QuestionsApi
  theme: Theme
  onClose: () => void
}

const inputClass =
  'w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 font-body text-base text-white placeholder:text-white/45 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/30'

export function QuestionEditor({ questions, theme, onClose }: Props) {
  const [draft, setDraft] = useState('')
  const [draftCategory, setDraftCategory] = useState<Category>('Funny')
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [filter, setFilter] = useState<'All' | Category>('All')
  const fileRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(
    () => (filter === 'All' ? questions.questions : questions.questions.filter((q) => q.category === filter)),
    [questions.questions, filter],
  )

  const handleAdd = () => {
    if (!draft.trim()) return
    questions.addQuestion(draft, draftCategory)
    setDraft('')
    setStatus({ ok: true, message: 'Question added.' })
  }

  const handleImport = (mode: 'append' | 'replace') => {
    const result = questions.importQuestions(importText, mode)
    setStatus(result)
    if (result.ok) setImportText('')
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImportText(String(reader.result ?? ''))
    reader.readAsText(file)
  }

  const handleExport = () => {
    const blob = new Blob([questions.exportQuestions()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'office-questions.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus({ ok: true, message: 'Exported office-questions.json' })
  }

  const panel = theme === 'dark' ? 'glass-dark' : 'glass'

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar px-6 py-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-white md:text-4xl">
              Edit Questions
            </h1>
            <p className="mt-1 font-body text-sm text-white/65">
              {questions.questions.length} total · {questions.questions.filter((q) => q.enabled).length} enabled
            </p>
          </div>
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
            Add a question
          </h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleAdd()
              }}
              placeholder="What's a completely useless skill you're surprisingly good at?"
              className={inputClass}
            />
            <select
              value={draftCategory}
              onChange={(event) => setDraftCategory(event.target.value as Category)}
              className={`${inputClass} md:w-56`}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {categoryStyle(category).emoji} {category}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900 transition hover:bg-white/85"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['All', ...CATEGORIES] as const).map((option) => {
            const active = filter === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={[
                  'rounded-full border px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.16em] transition',
                  active
                    ? 'border-white bg-white text-slate-900'
                    : 'border-white/25 bg-white/10 text-white/80 hover:bg-white/20',
                ].join(' ')}
              >
                {option === 'All' ? 'All' : `${categoryStyle(option).emoji} ${option}`}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          {visible.map((question) => (
            <div
              key={question.id}
              className={`flex flex-col gap-3 rounded-3xl p-4 md:flex-row md:items-center ${panel} ${
                question.enabled ? '' : 'opacity-55'
              }`}
            >
              <input
                value={question.question}
                onChange={(event) =>
                  questions.updateQuestion(question.id, { question: event.target.value })
                }
                className={inputClass}
              />
              <select
                value={question.category}
                onChange={(event) =>
                  questions.updateQuestion(question.id, {
                    category: event.target.value as Category,
                  })
                }
                className={`${inputClass} md:w-52`}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category} className="bg-slate-900">
                    {categoryStyle(category).emoji} {category}
                  </option>
                ))}
              </select>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  title={question.enabled ? 'Disable' : 'Enable'}
                  onClick={() =>
                    questions.updateQuestion(question.id, { enabled: !question.enabled })
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white transition hover:bg-white/25"
                >
                  {question.enabled ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => questions.deleteQuestion(question.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-300/40 bg-red-400/20 text-white transition hover:bg-red-400/40"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-3xl p-6 ${panel}`}>
          <h2 className="mb-2 font-display text-lg font-bold uppercase tracking-[0.18em] text-white/85">
            Import / Export
          </h2>
          <p className="mb-4 font-body text-sm text-white/65">
            Paste JSON like{' '}
            <code className="rounded bg-black/30 px-2 py-0.5 text-white/85">
              [{'{'} "question": "...", "category": "Funny" {'}'}]
            </code>
          </p>
          <textarea
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            rows={5}
            placeholder='[{ "question": "What is your most useless talent?", "category": "Funny" }]'
            className={`${inputClass} font-mono text-sm`}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleImport('append')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-slate-900 transition hover:bg-white/85"
            >
              <Upload className="h-4 w-4" />
              Import & append
            </button>
            <button
              type="button"
              onClick={() => handleImport('replace')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
            >
              <Check className="h-4 w-4" />
              Import & replace
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
            >
              <Upload className="h-4 w-4" />
              Load file
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </div>
          {status && (
            <p
              className={`mt-4 font-body text-sm font-semibold ${
                status.ok ? 'text-emerald-200' : 'text-red-200'
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
