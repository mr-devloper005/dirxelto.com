import Link from 'next/link'
import {
  ArrowRight, Bookmark, Building2, FileText, Image as ImageIcon,
  Search, UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { slot4TaskLabels } from '@/editable/content/tasks.config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditorialFeatureCard, getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: FileText,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

function taskLabel(task: TaskKey) {
  return (slot4TaskLabels as Partial<Record<TaskKey, string>>)[task] || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

const container = dc.shell.section

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* --------------------------------- Hero --------------------------------- */
export function EditableHomeHero({ primaryRoute: _primaryRoute }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`flex flex-col items-center px-6 pb-24 pt-24 text-center sm:px-10 sm:pt-32 lg:px-16 lg:pt-40 ${container}`}>
        <EditableReveal>
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
            {hero.badge}
          </p>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="mt-8 max-w-[15ch] text-balance editable-display-serif text-[2.75rem] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-[4rem] lg:text-[5.5rem]">
            {hero.titleLead}{' '}
            <span className="italic">{hero.titleEmphasis}</span>{' '}
            {hero.titleTail}
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <p className={`mx-auto mt-8 max-w-lg text-[15px] leading-[1.7] sm:text-base ${pal.mutedText}`}>{hero.description}</p>
        </EditableReveal>

        <EditableReveal index={3}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href={hero.primaryCta.href} className={dc.button.primary}>
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
              {hero.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>

        <EditableReveal index={4} className="w-full">
          <form action="/search" className="mx-auto mt-14 flex w-full max-w-md items-center gap-2 border-b border-[var(--editable-border)] pb-2">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              placeholder={hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
            <button className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition hover:opacity-70">
              Search
            </button>
          </form>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------------------- Featured showcase --------------------------- */
export function EditableFeaturedShowcase({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  if (!featured) return null
  const showcase = pagesContent.home.showcase
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{showcase.badge}</p>
              <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
                {showcase.title}
              </h2>
            </div>
            <Link href={primaryRoute} className="editable-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)] hover:opacity-70">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditableReveal>
        <EditableReveal index={1}>
          <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} label={taskLabel(primaryTask)} />
        </EditableReveal>
      </div>
    </section>
  )
}

/* ------------------------------- Browse rail ------------------------------ */
export function EditableStoryRail(_props: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const browse = pagesContent.home.browse
  if (!categories.length) return null
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-end">
            <div>
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{browse.badge}</p>
              <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
                {browse.title}
              </h2>
            </div>
            <p className={`max-w-lg text-base leading-[1.7] lg:mb-3 ${pal.mutedText}`}>{browse.description}</p>
          </div>
        </EditableReveal>
        <div className="mt-16 divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
          {categories.map((task, index) => {
            const Icon = taskIcon[task.key] || FileText
            return (
              <EditableReveal key={task.key} index={index}>
                <Link
                  href={task.route}
                  className="group flex items-center gap-6 py-6 transition duration-300 sm:gap-10"
                >
                  <span className="editable-mono w-12 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-page-text)] group-hover:text-[var(--slot4-page-bg)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="editable-display-serif block text-2xl font-normal tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">
                      {taskLabel(task.key)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:translate-x-1 group-hover:text-[var(--slot4-page-text)]" />
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- Stats --------------------------------- */
export function EditableStatsBand({ posts, timeSections }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const allPosts = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const freshCount = timeSections.find((section) => section.key === 'spotlight')?.posts.length || 0
  const stats = pagesContent.home.stats
  const items = [
    { value: `${allPosts.length}+`, label: 'Listings & bookmarks' },
    { value: `${categories.length}`, label: 'Open categories' },
    { value: `${freshCount || allPosts.length}`, label: 'Added this week' },
    { value: '24/7', label: 'Searchable' },
  ]
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="max-w-2xl">
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{stats.badge}</p>
            <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
              {stats.title}
            </h2>
          </div>
        </EditableReveal>
        <div className="mt-16 grid grid-cols-2 gap-y-12 border-t border-[var(--editable-border)] pt-12 sm:grid-cols-4 sm:gap-6">
          {items.map((item, index) => (
            <EditableReveal key={item.label} index={index}>
              <p className="editable-display-serif text-5xl font-normal tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[4.5rem]">
                {item.value}
              </p>
              <p className={`mt-4 max-w-[10ch] text-sm ${pal.mutedText}`}>{item.label}</p>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- How it works ------------------------------ */
export function EditableHowItWorks() {
  const how = pagesContent.home.howItWorks
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{how.badge}</p>
            <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
              {how.title}
            </h2>
          </div>
        </EditableReveal>
        <div className="mx-auto mt-16 grid max-w-5xl gap-12 sm:grid-cols-3">
          {how.steps.map((step, index) => (
            <EditableReveal key={step.title} index={index} className="text-center sm:text-left">
              <span className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                Step {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="editable-display-serif mt-4 text-2xl font-normal tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[1.75rem]">
                {step.title}
              </h3>
              <p className={`mt-3 text-sm leading-[1.7] ${pal.mutedText}`}>{step.description}</p>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Recent activity ---------------------------- */
function ActivityCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
      </div>
      <div className="mt-5">
        {category ? (
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            {category}
          </p>
        ) : null}
        <h3 className="editable-display-serif mt-3 text-xl font-normal leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-2xl">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-2 text-sm leading-[1.6] ${pal.mutedText}`}>{getExcerpt(post, 140)}</p>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null
  const copy = pagesContent.home.activity
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-end">
            <div>
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{copy.badge}</p>
              <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
                {copy.title}
              </h2>
            </div>
            <p className={`max-w-lg text-base leading-[1.7] lg:mb-3 ${pal.mutedText}`}>{copy.description}</p>
          </div>
        </EditableReveal>
        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {activity.map((post, index) => (
            <EditableReveal key={post.id || post.slug} index={index % 3}>
              <ActivityCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
            </EditableReveal>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href={primaryRoute} className={dc.button.secondary}>
            Show more
          </Link>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery sections -------------------- */
function CompactCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
      </div>
      <div className="mt-4">
        {category ? (
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            {category}
          </p>
        ) : null}
        <h3 className="editable-display-serif mt-2 line-clamp-2 text-lg font-normal leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: 'Trending now', title: 'Popular this month' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
            <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
              <EditableReveal>
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                      {copy.eyebrow}
                    </p>
                    <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
                      {copy.title}
                    </h2>
                  </div>
                  <Link href={section.href || primaryRoute} className="editable-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)] hover:opacity-70">
                    See all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, index) => (
                  <EditableReveal key={post.id || post.slug} index={index % 4}>
                    <CompactCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- Benefits -------------------------------- */
export function EditableBenefits() {
  const benefits = pagesContent.home.benefits
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-24 sm:py-28 lg:py-32 ${container}`}>
        <EditableReveal>
          <div className="max-w-2xl">
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{benefits.badge}</p>
            <h2 className="mt-6 editable-display-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
              {benefits.title}
            </h2>
          </div>
        </EditableReveal>
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {benefits.items.map((item, index) => (
            <EditableReveal key={item.title} index={index} className="border-t border-[var(--editable-border)] pt-8">
              <span className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="editable-display-serif mt-4 text-xl font-normal tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[1.5rem]">
                {item.title}
              </h3>
              <p className={`mt-3 text-sm leading-[1.7] ${pal.mutedText}`}>{item.description}</p>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- CTA band ------------------------------ */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-listed" className="scroll-mt-24 border-t border-[var(--editable-border)] bg-[var(--slot4-dark-bg)]">
      <div className={`flex flex-col items-center gap-8 py-24 text-center sm:py-32 lg:py-40 ${container}`}>
        <EditableReveal>
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            {cta.badge}
          </p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-display-serif max-w-3xl text-[2.5rem] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--slot4-dark-text)] sm:text-[3.5rem] lg:text-[4.5rem]">
            {cta.title}
          </h2>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="max-w-lg text-base leading-[1.7] text-white/60">{cta.description}</p>
        </EditableReveal>
        <EditableReveal index={3}>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <Link href={cta.primaryCta.href} className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-bg)] px-7 py-3.5 text-[13px] font-medium text-[var(--slot4-page-text)] transition hover:opacity-90">
              {cta.primaryCta.label}
            </Link>
            <Link href={cta.secondaryCta.href} className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-[13px] font-medium text-white transition hover:bg-white/10">
              {cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
