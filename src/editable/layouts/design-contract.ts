import type { CSSProperties } from 'react'

export const editableRootStyle = {
  // Palette pulled directly from the halden-miller Webflow reference:
  //   base bg  #f7f7f2   depth #e1dcd5   lift #efede7   ink #191818
  // Essentially monochrome warm neutrals — no saturated brand color. Emphasis
  // comes from serif italics, not from color.
  '--slot4-page-bg': '#f7f7f2',
  '--slot4-page-text': '#1e1c1b',
  '--slot4-panel-bg': '#efede7',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6b6763',
  '--slot4-soft-muted-text': '#8f8a83',
  '--slot4-accent': '#1e1c1b',
  '--slot4-accent-fill': '#1e1c1b',
  '--slot4-accent-soft': '#efede7',
  '--slot4-on-accent': '#f7f7f2',
  '--slot4-dark-bg': '#191818',
  '--slot4-dark-text': '#f7f7f2',
  '--slot4-media-bg': '#e1dcd5',
  '--slot4-cream': '#f7f7f2',
  '--slot4-warm': '#efede7',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#efede7',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f7f7f2',
  '--editable-page-text': '#1e1c1b',
  '--editable-container': '1440px',
  '--editable-border': '#e1dcd5',
  '--editable-nav-bg': '#f7f7f2',
  '--editable-nav-text': '#1e1c1b',
  '--editable-nav-active': '#1e1c1b',
  '--editable-nav-active-text': '#f7f7f2',
  '--editable-cta-bg': '#1e1c1b',
  '--editable-cta-text': '#f7f7f2',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#efede7',
  '--editable-footer-text': '#1e1c1b',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(25,24,24,0.05)]',
  shadowStrong: 'shadow-[0_28px_80px_-30px_rgba(25,24,24,0.22)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(25,24,24,0.05),rgba(25,24,24,0.82))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    // Wide, contained — matches ref site's --container--main: 1800px, dialed to 1440 for our copy density.
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-10 lg:px-16',
    sectionNarrow: 'mx-auto w-full max-w-[912px] px-6 sm:px-8',
    // Reference sections run 96–200px tall. Bring ours up to at least 96px min.
    sectionY: 'py-24 sm:py-28 lg:py-32',
    sectionYTight: 'py-16 sm:py-20',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[260px]',
  },
  type: {
    // Mono uppercase micro-label, matches ref's IBM Plex Mono label style.
    eyebrow: 'editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    // Serif display for hero. h0 in ref: 96px / lh 88.
    heroTitle: 'editable-display-serif text-[2.75rem] font-medium leading-[1.02] tracking-[-0.02em] sm:text-[4rem] lg:text-[5.5rem]',
    sectionTitle: 'editable-display-serif text-[2rem] font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem] lg:text-[3.25rem]',
    body: 'text-base leading-[1.7] text-[var(--slot4-muted-text)]',
    /** Italic serif inline emphasis inside a headline (already inherits from `.editable-display-serif`). */
    emphasis: 'italic font-normal',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    // Reference uses fully-rounded pill buttons for primary CTAs (radius-full).
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-7 py-3.5 text-[13px] font-medium tracking-[-0.005em] text-[var(--editable-cta-text)] transition duration-300 hover:opacity-90`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border ${editablePalette.border} bg-transparent px-7 py-3.5 text-[13px] font-medium tracking-[-0.005em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-panel-bg)]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-7 py-3.5 text-[13px] font-medium text-[var(--editable-cta-text)] transition duration-300 hover:opacity-90`,
    ghost: `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-panel-bg)]`,
  },
  badge: {
    // Tag radius in ref = 16px; text uses mono label style.
    pill: `editable-mono inline-flex items-center gap-1.5 rounded-2xl border ${editablePalette.border} bg-transparent px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]`,
    accentPill: `editable-mono inline-flex items-center gap-1.5 rounded-2xl bg-[var(--slot4-panel-bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, and a single large featured showcase panel for the top story.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Reference is monochrome warm neutrals — never introduce a saturated brand color. Emphasis comes from the serif italic.',
] as const
