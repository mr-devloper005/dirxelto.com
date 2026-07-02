'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, Camera, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles, UserRound } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: PlusCircle,
  image: ImageIcon,
  profile: UserRound,
  pdf: FileText,
  sbm: Camera,
}

const fieldClass = 'w-full rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:ring-4 focus:ring-[var(--slot4-accent-soft)]'
const labelClass = 'grid gap-2 text-sm font-semibold text-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  // Purely derived display value for the step indicator — not new form state.
  const detailsStarted = Boolean(title.trim() || summary.trim() || body.trim())

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className={dc.shell.page}>
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
            <div className={`${dc.shell.section} grid min-h-[calc(100vh-14rem)] items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-24`}>
              <EditableReveal>
                <div className={`flex h-full min-h-72 items-center justify-center ${dc.surface.dark}`}>
                  <Lock className="h-16 w-16 text-white/70" />
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
                <h1 className={`${dc.type.sectionTitle} mt-5 max-w-xl text-[var(--slot4-page-text)]`}>{pagesContent.create.locked.title}</h1>
                <p className={`mt-5 max-w-lg ${dc.type.body}`}>{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Login <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Sign up
                  </Link>
                </div>
              </EditableReveal>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} py-12 sm:py-16 lg:py-20`}>
          <EditableReveal>
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
              <h1 className={`${dc.type.sectionTitle} mt-4 text-[var(--slot4-page-text)]`}>{pagesContent.create.hero.title}</h1>
              <p className={`mt-4 ${dc.type.body}`}>{pagesContent.create.hero.description}</p>
            </div>
          </EditableReveal>

          {/* Simple two-step progress indicator, driven purely from existing form values. */}
          <EditableReveal index={1}>
            <div className="mt-8 flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${pal.pageText}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${pal.accentBg} ${pal.onAccentText} text-xs`}>1</span>
                Choose type
              </span>
              <span className={`h-px w-10 ${detailsStarted ? pal.accentBg : pal.border + ' border-t'}`} />
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${detailsStarted ? pal.pageText : pal.mutedText}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${detailsStarted ? `${pal.accentBg} ${pal.onAccentText}` : `border ${pal.border} ${pal.mutedText}`}`}>2</span>
                Add details
              </span>
            </div>
          </EditableReveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
            <EditableReveal index={2}>
              <aside className={`${dc.surface.soft} p-6`}>
                <p className="text-sm font-semibold text-[var(--slot4-page-text)]">Content type</p>
                <p className={`mt-1 text-xs ${pal.mutedText}`}>Pick the section this post belongs to.</p>
                <div className="mt-5 grid gap-3">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition duration-300 ${
                          active
                            ? `border-transparent ${pal.darkBg} ${pal.darkText}`
                            : `${pal.border} ${pal.surfaceBg} hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(26,23,18,0.3)]`
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-white/10' : pal.accentSoftBg} ${active ? 'text-white' : 'text-[var(--slot4-accent)]'}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className={`mt-0.5 block truncate text-xs ${active ? 'text-white/70' : pal.mutedText}`}>{item.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </EditableReveal>

            <EditableReveal index={3}>
              <form onSubmit={submit} className={`${dc.surface.card} p-6 sm:p-8`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-border)] pb-5">
                  <div>
                    <p className={`${dc.type.eyebrow}`}>Create {activeTask?.label || 'post'}</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className={dc.badge.pill}>
                    <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {session.name}
                  </span>
                </div>

                <div className="mt-6 grid gap-5">
                  <label className={labelClass}>
                    Post title
                    <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give it a clear, searchable title" required />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className={labelClass}>
                      Category
                      <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Tools, Local, Design" />
                    </label>
                    <label className={labelClass}>
                      Website or source URL
                      <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" />
                    </label>
                  </div>
                  <label className={labelClass}>
                    Featured image URL
                    <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://example.com/image.jpg" />
                  </label>
                  <label className={labelClass}>
                    Short summary
                    <textarea className={`${fieldClass} min-h-24 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="One or two sentences for previews and cards" required />
                  </label>
                  <label className={labelClass}>
                    Main content
                    <textarea className={`${fieldClass} min-h-48 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Details, notes, or full description" required />
                  </label>
                </div>

                {created ? (
                  <div className="mt-6 flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-sm opacity-80">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button type="submit" className={`${dc.button.primary} mt-6 w-full`}>
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
