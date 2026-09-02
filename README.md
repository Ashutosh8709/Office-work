# Office Questions — Big Screen Edition

A Kahoot-inspired (but original) question display for office activities. One screen, one question, zero friction. The game happens in the room; this app just makes every question feel like an event.

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · Lucide React. No backend, no database — everything is client-side and persisted in `localStorage`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview
```

## Controls

| Key | Action |
| --- | --- |
| `Space` / `→` / `Enter` | Next question |
| `←` | Previous question |
| `R` | Replay the current reveal animation |
| `P` | Toggle presentation mode |
| `Esc` | Menu (and closes menu/screens) |

Shortcuts are ignored while typing in an input, textarea or select.

## Features

- **63 demo questions** across 7 categories: Funny, Unexpected, Office, Debate, Deep, Random, Personal.
- **Category-driven visuals** — each category has its own gradient, badge and floating decorations.
- **Varied Framer Motion transitions** (slide / fade / scale / flip / zoom, ~550ms) plus a per-word text reveal.
- **Dynamic intros** — occasionally hypes a question ("⚡ Okay... this one is interesting") before revealing it. Toggleable.
- **Presentation mode** — hides chrome, maximizes typography, requests browser fullscreen.
- **Themes** — Vibrant (default) and Dark, switchable in Settings.
- **Question management** — add / edit / delete / recategorize / enable-disable, JSON import (paste or file) and export.
- **Category filters** — choose which categories are in the deck.

## Import format

```json
[
  { "question": "What's your most useless talent?", "category": "Funny" },
  { "question": "What's an opinion you'll defend forever?", "category": "Debate" }
]
```

Unknown categories fall back to `Random`; `enabled` is optional and defaults to `true`.

## Structure

```
src/
├── components/   Backdrop, CategoryBadge, QuestionCard, ProgressIndicator,
│                 NavigationControls, KeyboardHints, IntroOverlay, Menu, PresentationMode
├── screens/      QuestionScreen, QuestionEditor, Settings
├── data/         categories.ts, questions.ts
├── hooks/        useQuestions, useSettings, useKeyboardNavigation, useFullscreen, useLocalStorage
└── App.tsx
```
