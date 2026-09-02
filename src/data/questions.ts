import type { Category } from './categories'

export type Question = {
  id: string
  question: string
  category: Category
  enabled: boolean
}

type Seed = { question: string; category: Category }

const seeds: Seed[] = [
  // 😂 FUNNY
  { question: "Who has been with the department the longest?", category: 'Funny' },
  { question: "If our office had a reality TV show, what would it be called?", category: 'Funny' },
  { question: "Which team has the highest number of team members?", category: 'Funny' },
  { question: "Who is most likely to spot a bug before it ships?", category: 'Funny' },
  { question: "Can you name at least 3 teams in your department?", category: 'Funny' },
  { question: "Which team has the most new joiners?", category: 'Funny' },
  { question: "What was the major change in your last release?", category: 'Funny' },
  { question: "What was the first major project our department worked on?", category: 'Funny' },
  { question: "Who is known for being the earliest to arrive?", category: 'Funny' },

  // 🤯 UNEXPECTED
  { question: "Which meeting happens most frequently in the teams?", category: 'Unexpected' },
  { question: "Who is most likely to say \"It works on my machine\"?", category: 'Unexpected' },
  { question: "Who is the department’s unofficial “Google” — the person everyone asks when they don't know something?", category: 'Unexpected' },
  { question: "Who is most likely to say “I’ll finish it today” and still be working on it tomorrow?", category: 'Unexpected' },
  { question: "If the office had a “Best Excuse for Being Late” award, who would win?", category: 'Unexpected' },
  { question: "Who has worked across the highest number of teams within the department", category: 'Unexpected' },

  // 🏢 OFFICE
  { question: "Who has been part of the greatest number of projects in the department?", category: 'Office' },
  { question: "Which team has the highest number of employees with more than 5 years of experience", category: 'Office' },
  { question: "Who is known for being the first person to volunteer when help is needed?", category: 'Office' },
  { question: "Which team handles the highest number of projects or responsibilities?", category: 'Office' },
  { question: "Who is the person most likely to know where to find any document, process, or resource?", category: 'Office' },
  { question: "Which team has had the highest number of projects completed this year?", category: 'Office' },
  { question: "Who is most likely to have their calendar completely packed with meetings?", category: 'Office' },
  { question: "Which team collaborates with the greatest number of other teams?", category: 'Office' },
  { question: "Who is most likely to have a solution ready before everyone else has finished explaining the problem?", category: 'Office' },
  { question: "If our team had a mascot, what should it be?", category: 'Office' },

  // 🔥 DEBATE
  { question: "Who is most likely to have 20+ tabs open at the same time?", category: 'Debate' },
  { question: "Who is most likely to say “One last thing…” at the end of a meeting?", category: 'Debate' },
  { question: "Who is most likely to have the perfect shortcut or workaround for a problem?", category: 'Debate' },
  { question: "What is the most common tool or platform used across the department?", category: 'Debate' },
]

export const DEFAULT_QUESTIONS: Question[] = seeds.map((seed, index) => ({
  id: `q-${index + 1}`,
  question: seed.question,
  category: seed.category,
  enabled: true,
}))
