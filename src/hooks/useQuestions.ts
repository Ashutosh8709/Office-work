import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_QUESTIONS, type Question } from '../data/questions'
import { CATEGORIES, type Category } from '../data/categories'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'office-questions:questions'
const CATEGORY_KEY = 'office-questions:categories'

const newId = () => `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const sanitize = (raw: unknown): Question[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const text = typeof record.question === 'string' ? record.question.trim() : ''
      if (!text) return null
      const category = CATEGORIES.includes(record.category as Category)
        ? (record.category as Category)
        : 'Random'
      return {
        id: typeof record.id === 'string' && record.id ? record.id : newId(),
        question: text,
        category,
        enabled: record.enabled === undefined ? true : Boolean(record.enabled),
      } satisfies Question
    })
    .filter((item): item is Question => item !== null)
}

export function useQuestions() {
  const [questions, setQuestions, resetQuestions] = useLocalStorage<Question[]>(
    STORAGE_KEY,
    DEFAULT_QUESTIONS,
  )
  const [activeCategories, setActiveCategories, resetCategories] = useLocalStorage<Category[]>(
    CATEGORY_KEY,
    [...CATEGORIES],
  )
  const [index, setIndex] = useState(0)

  const deck = useMemo(() => {
    const filtered = questions.filter(
      (q) => q.enabled && activeCategories.includes(q.category),
    )
    return filtered.length > 0 ? filtered : questions.filter((q) => q.enabled)
  }, [questions, activeCategories])

  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1)
  const current = deck[safeIndex]

  const goTo = useCallback(
    (next: number) => {
      setIndex(() => {
        if (deck.length === 0) return 0
        return Math.max(0, Math.min(next, deck.length - 1))
      })
    },
    [deck.length],
  )

  const next = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex])
  const previous = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex])

  const shuffleDeck = useCallback(() => {
    setQuestions((prev) => {
      const copy = [...prev]
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    })
    setIndex(0)
  }, [setQuestions])

  const addQuestion = useCallback(
    (question: string, category: Category) => {
      const text = question.trim()
      if (!text) return
      setQuestions((prev) => [...prev, { id: newId(), question: text, category, enabled: true }])
    },
    [setQuestions],
  )

  const updateQuestion = useCallback(
    (id: string, patch: Partial<Omit<Question, 'id'>>) => {
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
    },
    [setQuestions],
  )

  const deleteQuestion = useCallback(
    (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id)),
    [setQuestions],
  )

  const toggleCategory = useCallback(
    (category: Category) => {
      setActiveCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
      )
    },
    [setActiveCategories],
  )

  const importQuestions = useCallback(
    (json: string, mode: 'replace' | 'append' = 'append') => {
      let parsed: unknown
      try {
        parsed = JSON.parse(json)
      } catch {
        return { ok: false as const, message: 'That is not valid JSON.' }
      }
      const incoming = sanitize(Array.isArray(parsed) ? parsed : [parsed])
      if (incoming.length === 0) {
        return {
          ok: false as const,
          message: 'No usable questions found. Expected [{ "question": "...", "category": "Funny" }]',
        }
      }
      setQuestions((prev) => (mode === 'replace' ? incoming : [...prev, ...incoming]))
      setIndex(0)
      return { ok: true as const, message: `Imported ${incoming.length} question(s).` }
    },
    [setQuestions],
  )

  const exportQuestions = useCallback(
    () =>
      JSON.stringify(
        questions.map(({ question, category, enabled }) => ({ question, category, enabled })),
        null,
        2,
      ),
    [questions],
  )

  const resetAll = useCallback(() => {
    resetQuestions()
    resetCategories()
    setIndex(0)
  }, [resetQuestions, resetCategories])

  return {
    questions,
    deck,
    current,
    index: safeIndex,
    total: deck.length,
    activeCategories,
    next,
    previous,
    goTo,
    shuffleDeck,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    toggleCategory,
    importQuestions,
    exportQuestions,
    resetAll,
  }
}

export type QuestionsApi = ReturnType<typeof useQuestions>
