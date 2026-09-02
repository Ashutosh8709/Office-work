export const CATEGORIES = [
  'Funny',
  'Unexpected',
  'Office',
  'Debate',
  'Deep',
  'Random',
  'Personal',
] as const

export type Category = (typeof CATEGORIES)[number]

export type CategoryStyle = {
  id: Category
  label: string
  emoji: string
  /** Full-screen background gradient (vibrant theme) */
  bg: string
  /** Full-screen background gradient (dark theme) */
  bgDark: string
  /** Badge / accent gradient */
  accent: string
  /** Tailwind text color used for accents on dark surfaces */
  glow: string
  /** Personality of the card layout */
  mood: 'playful' | 'energetic' | 'elegant' | 'chaotic' | 'workplace' | 'warm'
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  Funny: {
    id: 'Funny',
    label: 'Funny',
    emoji: '😂',
    bg: 'linear-gradient(135deg,#ff9a3c 0%,#ff4d8d 45%,#a537ff 100%)',
    bgDark: 'linear-gradient(135deg,#2a1030 0%,#40123f 50%,#12061f 100%)',
    accent: 'linear-gradient(120deg,#ffd15c,#ff5f8f)',
    glow: 'rgba(255,180,80,0.75)',
    mood: 'playful',
  },
  Unexpected: {
    id: 'Unexpected',
    label: 'Unexpected',
    emoji: '🤯',
    bg: 'linear-gradient(135deg,#00d4ff 0%,#5b6bff 50%,#b429ff 100%)',
    bgDark: 'linear-gradient(135deg,#061627 0%,#101a45 55%,#1c0a35 100%)',
    accent: 'linear-gradient(120deg,#6ef1ff,#7a5cff)',
    glow: 'rgba(110,241,255,0.7)',
    mood: 'chaotic',
  },
  Office: {
    id: 'Office',
    label: 'Office',
    emoji: '🏢',
    bg: 'linear-gradient(135deg,#1fd1a5 0%,#2a8bff 55%,#3f4bd8 100%)',
    bgDark: 'linear-gradient(135deg,#04201d 0%,#062a3f 55%,#0a1436 100%)',
    accent: 'linear-gradient(120deg,#7bffd7,#4fa8ff)',
    glow: 'rgba(80,255,214,0.65)',
    mood: 'workplace',
  },
  Debate: {
    id: 'Debate',
    label: 'Debate',
    emoji: '🔥',
    bg: 'linear-gradient(135deg,#ff5f4d 0%,#ff2d6f 50%,#7a1bff 100%)',
    bgDark: 'linear-gradient(135deg,#2b0710 0%,#3d0a26 55%,#160536 100%)',
    accent: 'linear-gradient(120deg,#ffb03a,#ff2d6f)',
    glow: 'rgba(255,90,80,0.7)',
    mood: 'energetic',
  },
  Deep: {
    id: 'Deep',
    label: 'Deep',
    emoji: '🧠',
    bg: 'linear-gradient(135deg,#3b2c8f 0%,#5f3dc4 50%,#1b2a6b 100%)',
    bgDark: 'linear-gradient(135deg,#0b0a20 0%,#171334 55%,#080a1c 100%)',
    accent: 'linear-gradient(120deg,#c0aaff,#7cc3ff)',
    glow: 'rgba(180,160,255,0.65)',
    mood: 'elegant',
  },
  Random: {
    id: 'Random',
    label: 'Random',
    emoji: '🎲',
    bg: 'linear-gradient(135deg,#ffd93b 0%,#ff6ec7 50%,#3ad0ff 100%)',
    bgDark: 'linear-gradient(135deg,#241a04 0%,#33103a 55%,#04202b 100%)',
    accent: 'linear-gradient(120deg,#fff17a,#ff6ec7)',
    glow: 'rgba(255,230,110,0.75)',
    mood: 'chaotic',
  },
  Personal: {
    id: 'Personal',
    label: 'Personal',
    emoji: '❤️',
    bg: 'linear-gradient(135deg,#ff7eb3 0%,#ff5f6d 50%,#ff9966 100%)',
    bgDark: 'linear-gradient(135deg,#2c0a1c 0%,#3b0d18 55%,#25100a 100%)',
    accent: 'linear-gradient(120deg,#ffc2d1,#ff6f91)',
    glow: 'rgba(255,140,170,0.7)',
    mood: 'warm',
  },
}

export const categoryStyle = (category: string): CategoryStyle =>
  CATEGORY_STYLES[category as Category] ?? CATEGORY_STYLES.Random
