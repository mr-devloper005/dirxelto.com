import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const stats = [
    { value: `${pagesContent.about.values.length}`, label: 'core principles' },
    { value: `${enabledTasks.length}`, label: 'open content sections' },
    { value: '24/7', label: 'searchable directory' },
  ]

  return (
    <EditableSiteShell>
      <main className={pal.pageBg}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
          <div className={`flex flex-col items-center px-5 pb-14 pt-20 text-center sm:px-8 sm:pt-24 ${dc.shell.section}`}>
            <EditableReveal>
              <span className={dc.badge.pill}>
                <Compass className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {pagesContent.about.badge}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-6 max-w-3xl text-balance ${dc.type.heroTitle} text-[var(--slot4-page-text)]`}>
                About <span className={dc.type.emphasis}>{SITE_CONFIG.name}</span>
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mx-auto mt-6 max-w-xl text-base sm:text-lg ${pal.mutedText}`}>{pagesContent.about.description}</p>
            </EditableReveal>
          </div>
        </section>

        {/* Brand story */}
        <section className={pal.warmBg}>
          <div className={`py-16 sm:py-20 ${dc.shell.section}`}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <EditableReveal>
                <article className={`${dc.surface.card} p-8 lg:p-10`}>
                  <p className={dc.type.eyebrow}>Our story</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">{pagesContent.about.title}</h2>
                  <div className="mt-6 space-y-4 text-sm leading-7 sm:text-base sm:leading-8 text-[var(--slot4-muted-text)]">
                    {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </article>
              </EditableReveal>

              <EditableReveal index={1}>
                <div className={`${dc.surface.dark} p-8`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">At a glance</p>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="editable-accent-serif text-3xl italic tracking-[-0.01em] text-white">{stat.value}</p>
                        <p className="mt-1.5 text-[11px] uppercase tracking-[0.1em] text-white/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-sm leading-7 text-white/70">
                    Every listing and bookmark on {SITE_CONFIG.name} moves through the same directory, so nothing gets lost between sections.
                  </p>
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>

        {/* Values / mission grid */}
        <section className={pal.pageBg}>
          <div className={`py-16 sm:py-20 ${dc.shell.section}`}>
            <EditableReveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className={dc.type.eyebrow}>What we stand for</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">
                  The principles behind the <span className={dc.type.emphasis}>directory</span>.
                </h2>
              </div>
            </EditableReveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagesContent.about.values.map((value, index) => (
                <EditableReveal key={value.title} index={index} className={`${dc.surface.card} p-7`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--slot4-accent-soft)] text-sm font-semibold text-[var(--slot4-accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{value.title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${pal.mutedText}`}>{value.description}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[var(--slot4-dark-bg)]">
          <div className={`flex flex-col items-center gap-6 py-16 text-center sm:py-24 ${dc.shell.section}`}>
            <EditableReveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Get involved
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.01em] text-[var(--slot4-dark-text)] sm:text-4xl">
                Add your business or save a link worth keeping.
              </h2>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="max-w-xl text-base text-white/70 sm:text-lg">
                Submitting takes a couple of minutes, and every entry stays discoverable across the whole directory.
              </p>
            </EditableReveal>
            <EditableReveal index={3}>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/create" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:opacity-90">
                  Submit now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Contact us
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
