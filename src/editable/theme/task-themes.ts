import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Premium directory task surfaces.

  Every task (archive + detail) shares one cohesive identity: warm paper
  surfaces, a single restrained terracotta accent, hairline warm borders and
  an editorial display/body font pairing. Per-task copy (kicker / note) still
  varies so each section keeps a little voice, but the visual language is
  unified. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'IBM Plex Serif', 'Iowan Old Style', Georgia, serif"
const BODY_FONT = "'IBM Plex Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared premium palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f7f7f2',
  surface: '#ffffff',
  raised: '#efede7',
  text: '#1e1c1b',
  muted: '#6b6763',
  line: '#e1dcd5',
  accent: '#1e1c1b',
  accentSoft: '#efede7',
  onAccent: '#f7f7f2',
  glow: 'rgba(30,28,27,0.06)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Guides', note: 'Practical guides and long-form reads from the community.' },
  listing: { ...base, kicker: 'Local Businesses', note: 'Discover, compare, and connect with trusted local businesses near you.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and classifieds, ready to act on today.' },
  image: { ...base, kicker: 'Photos', note: 'A visual feed of standout images and community galleries.' },
  sbm: { ...base, kicker: 'Saved Links', note: "Community-curated bookmarks worth saving, sorted by what's trending." },
  pdf: { ...base, kicker: 'Resources', note: 'Downloadable guides, reports, and reference documents.' },
  profile: { ...base, kicker: 'Members', note: 'Discover creators, businesses, and active community profiles.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
