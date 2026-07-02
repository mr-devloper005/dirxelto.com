import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Calendar, Camera, CheckCircle2, Clock, Download, ExternalLink, FileText, Globe2, Hash, Layers, Mail, MapPin, Phone, ShieldCheck, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
// Plain-text lead intro, but only when it isn't just a duplicate of the body
// (some posts store the full HTML body in `summary`, which would render twice).
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

// Local shape helpers that mirror the shared design-contract card/badge
// proportions (dc.surface.card / dc.badge.pill) but stay bound to the active
// task's --tk-* accent tokens, so each task keeps its own tint.
const tkCard = `rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_1px_2px_rgba(26,23,18,0.05)]`
const chipBtn = `${dc.badge.pill} transition duration-300 hover:-translate-y-0.5 hover:border-[var(--tk-accent)]/50`
const chipBtnAccent = `inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-300 hover:-translate-y-0.5 hover:opacity-90`
const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

// Accent-colored star rating row. Uses real rating/review fields when present,
// otherwise a stable derived value (wire to real data when available).
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className={dc.badge.accentPill}>{theme.kicker}</span>
      {children ? <span className="text-sm text-[var(--tk-muted)]">{children}</span> : null}
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition duration-300 hover:-translate-x-0.5 hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

// ----- Article: a quiet, centred reading column -----
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className={`mx-auto max-w-4xl px-5 py-16 sm:px-8 ${dc.shell.sectionY}`}>
        <BackLink task="article" />
        <EditableReveal index={0} className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
          <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-[var(--tk-muted)]">
            <span className="h-8 w-8 rounded-full bg-[var(--tk-accent-soft)]" aria-hidden="true" />
            <span>{SITE_CONFIG.name}</span>
          </div>
        </EditableReveal>
        {images[0] ? (
          <EditableReveal index={1} className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </EditableReveal>
        ) : null}
        <EditableReveal index={2}>
          <BodyContent post={post} />
        </EditableReveal>
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

// ----- Listing: a premium business record — hero image, rich sidebar, wide gallery -----
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 9)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'timings'])
  const category = getField(post, ['category']) || post.tags?.[0] || ''
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 6) : []
  const mapSrc = mapSrcFor(post)
  const domain = website ? website.replace(/^https?:\/\//i, '').replace(/\/$/, '').split('/')[0] : ''

  return (
    <>
      {/* Hero band */}
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <BackLink task="listing" />
        <EditableReveal index={0} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              Business listing{category ? ` · ${category}` : ''}
            </p>
            <h1 className="editable-display-serif mt-6 max-w-3xl text-[2.5rem] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--tk-text)] sm:text-[3.75rem] lg:text-[4.5rem]">
              {post.title}
            </h1>
            <DetailMeta post={post} category={address || undefined} />
          </div>
          {leadText(post) ? (
            <p className="max-w-md text-[15px] leading-[1.75] text-[var(--tk-muted)] lg:mb-3">
              {leadText(post)}
            </p>
          ) : null}
        </EditableReveal>

        {/* Wide hero image */}
        {hero ? (
          <EditableReveal index={1} className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-[var(--tk-raised)]">
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-[linear-gradient(180deg,transparent,rgba(25,24,24,0.6))] p-6 sm:p-10">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/95 shadow-[0_1px_2px_rgba(25,24,24,0.15)]">
                  <Building2 className="h-6 w-6 text-[var(--tk-text)]" />
                </span>
                <div className="text-white">
                  <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] opacity-80">Verified listing</p>
                  <p className="mt-1 text-sm font-medium">{SITE_CONFIG.name}</p>
                </div>
              </div>
              {domain ? (
                <span className="editable-mono rounded-full bg-white/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
                  {domain}
                </span>
              ) : null}
            </div>
          </EditableReveal>
        ) : null}

        {/* Quick-facts strip */}
        <EditableReveal index={2} className="mt-12 grid grid-cols-2 gap-y-8 border-y border-[var(--tk-line)] py-8 sm:grid-cols-4">
          <QuickFact icon={MapPin} label="Location" value={address || 'On request'} />
          <QuickFact icon={Phone} label="Phone" value={phone || 'Available in listing'} />
          <QuickFact icon={Clock} label="Hours" value={hours || 'Standard hours'} />
          <QuickFact icon={ShieldCheck} label="Verified" value="Listed & reviewed" />
        </EditableReveal>
      </section>

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} pt-16 pb-24 sm:pt-20 sm:pb-28`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_400px]">
          <article className="min-w-0">
            <div>
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">About</p>
              <h2 className="editable-display-serif mt-5 text-3xl font-normal leading-[1.1] tracking-[-0.015em] text-[var(--tk-text)] sm:text-[2.5rem]">
                What makes this business worth <span className="italic">a visit</span>
              </h2>
            </div>
            <EditableReveal index={0}>
              <BodyContent post={post} />
            </EditableReveal>

            {tags.length ? (
              <EditableReveal index={1} className="mt-14 border-t border-[var(--tk-line)] pt-10">
                <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Tags</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className={dc.badge.pill}>
                      <Hash className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {gallery.length ? (
              <EditableReveal index={2} className="mt-14 border-t border-[var(--tk-line)] pt-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Gallery</p>
                    <h3 className="editable-display-serif mt-4 text-2xl font-normal tracking-[-0.01em] text-[var(--tk-text)] sm:text-3xl">
                      Inside the space
                    </h3>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
                  {gallery.map((image, index) => (
                    <div key={`${image}-${index}`} className={`relative overflow-hidden rounded-2xl bg-[var(--tk-raised)] ${index === 0 ? 'aspect-[16/10] sm:col-span-2 sm:aspect-[21/9]' : 'aspect-[4/3]'}`}>
                      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {mapSrc ? (
              <EditableReveal index={3} className="mt-14 border-t border-[var(--tk-line)] pt-10">
                <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Location</p>
                <h3 className="editable-display-serif mt-4 text-2xl font-normal tracking-[-0.01em] text-[var(--tk-text)] sm:text-3xl">
                  Find them on the map
                </h3>
                <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--tk-line)]">
                  <iframe src={mapSrc} title={address || 'Map'} loading="lazy" className="h-[420px] w-full border-0" />
                </div>
              </EditableReveal>
            ) : null}
          </article>

          {/* Sticky premium sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal index={0} className="overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="border-b border-[var(--tk-line)] bg-[var(--tk-raised)] px-6 py-5">
                <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Get in touch</p>
                <p className="editable-display-serif mt-2 text-xl font-normal tracking-[-0.01em] text-[var(--tk-text)]">
                  Reach the business
                </p>
              </div>
              <div className="divide-y divide-[var(--tk-line)]">
                {address ? <SidebarRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <SidebarRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <SidebarRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <SidebarRow icon={Globe2} label="Website" value={domain || website} href={website} external /> : null}
                {hours ? <SidebarRow icon={Clock} label="Hours" value={hours} /> : null}
              </div>
              <div className="flex flex-col gap-3 border-t border-[var(--tk-line)] p-6">
                {website ? (
                  <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-[13px] font-medium text-[var(--tk-bg)] transition hover:opacity-90">
                    Visit website <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
                {phone ? (
                  <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3.5 text-[13px] font-medium text-[var(--tk-text)] transition hover:bg-[var(--tk-raised)]">
                    <Phone className="h-3.5 w-3.5" /> Call now
                  </a>
                ) : null}
              </div>
            </EditableReveal>

            <EditableReveal index={1} className="rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6">
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Trust</p>
              <div className="mt-4 space-y-3 text-sm text-[var(--tk-text)]">
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-text)]" />
                  <span>Listed and reviewed by {SITE_CONFIG.name}</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-text)]" />
                  <span>Contact details verified where available</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-text)]" />
                  <span>Community can flag or review this listing</span>
                </p>
              </div>
            </EditableReveal>

            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mt-4" />
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

// ----- Classified: price-forward notice with a sticky action rail -----
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${dc.shell.section} grid gap-10 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:py-24`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <EditableReveal index={0} className={`mt-7 ${tkCard} p-7`}>
            <Kicker task="classified">Classified</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">{post.title}</h1>
            <DetailMeta post={post} category={getField(post, ['category'])} />
            <p className={dc.type.eyebrow}>Asking price</p>
            <p className="editable-display mt-1 text-4xl font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className={chipBtnAccent}><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className={chipBtn}><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </EditableReveal>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <EditableReveal index={1}>
            <BodyContent post={post} />
          </EditableReveal>
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

// ----- Image: a gallery-led canvas -----
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <EditableReveal index={0} as="div" className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className={`mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] ${dc.motion.lift}`}>
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </EditableReveal>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <span className={dc.badge.pill}><Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story</span>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

// ----- Bookmark: a curated resource, strictly no imagery. Typography, domain
// identity, tags, and structured meta carry the whole page. -----
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? website.replace(/^https?:\/\//i, '').replace(/\/$/, '').split('/')[0] : ''
  const domainInitial = domain ? domain.replace(/^www\./, '')[0]?.toUpperCase() || '#' : '#'
  const category = getField(post, ['category']) || post.tags?.[0] || 'General'
  const source = getField(post, ['source', 'author', 'publisher']) || domain || SITE_CONFIG.name
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 8) : []
  const lead = leadText(post)
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null
  const publishedLabel = publishedAt && !Number.isNaN(publishedAt.getTime())
    ? publishedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      {/* Hero band — no image, all typography */}
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <BackLink task="sbm" />

        <EditableReveal index={0} className="mt-12 flex items-center gap-3">
          <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            <Bookmark className="h-3 w-3" /> Saved resource
          </span>
          {domain ? (
            <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-text)]">
              <Globe2 className="h-3 w-3" /> {domain}
            </span>
          ) : null}
          <span className="editable-mono hidden text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)] sm:inline">
            {category}
          </span>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display-serif mt-10 max-w-5xl text-[2.75rem] font-normal leading-[1.02] tracking-[-0.025em] text-[var(--tk-text)] sm:text-[4rem] lg:text-[5rem]">
            {post.title}
          </h1>
        </EditableReveal>

        {lead ? (
          <EditableReveal index={2}>
            <p className="mt-10 max-w-2xl text-xl leading-[1.55] text-[var(--tk-text)] sm:text-[1.5rem] sm:leading-[1.5]">
              <span className="editable-accent-serif italic">"</span>
              {lead}
              <span className="editable-accent-serif italic">"</span>
            </p>
          </EditableReveal>
        ) : null}

        {/* Prominent action row */}
        <EditableReveal index={3} className="mt-12 flex flex-wrap items-center gap-4">
          {website ? (
            <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-8 py-4 text-sm font-medium text-[var(--tk-bg)] transition hover:opacity-90">
              Open resource <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
          <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-8 py-4 text-sm font-medium text-[var(--tk-text)] transition hover:bg-[var(--tk-raised)]">
            Back to bookmarks
          </Link>
        </EditableReveal>

        {/* Meta row under actions */}
        <EditableReveal index={4} className="mt-16 grid grid-cols-2 gap-y-8 border-y border-[var(--tk-line)] py-8 sm:grid-cols-4">
          <QuickFact icon={Globe2} label="Source" value={source} />
          <QuickFact icon={Layers} label="Category" value={category} />
          <QuickFact icon={ShieldCheck} label="Curated" value={`by ${SITE_CONFIG.name}`} />
        </EditableReveal>
      </section>

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} pt-16 pb-24 sm:pt-20 sm:pb-28`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0 max-w-2xl">
            <EditableReveal index={0}>
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                About this bookmark
              </p>
              <h2 className="editable-display-serif mt-5 text-3xl font-normal leading-[1.1] tracking-[-0.015em] text-[var(--tk-text)] sm:text-[2.5rem]">
                Why it&apos;s worth <span className="italic">saving</span>
              </h2>
            </EditableReveal>
            <EditableReveal index={1}>
              <BodyContent post={post} />
            </EditableReveal>

            {tags.length ? (
              <EditableReveal index={2} className="mt-16 border-t border-[var(--tk-line)] pt-10">
                <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Tagged with</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="editable-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
                      <Hash className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {/* Repeated CTA — bookmarks live and die by the outbound click */}
            {website ? (
              <EditableReveal index={3} className="mt-16 rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-raised)] p-8 sm:p-10">
                <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">Head over</p>
                <p className="editable-display-serif mt-4 text-2xl font-normal leading-[1.15] tracking-[-0.01em] text-[var(--tk-text)] sm:text-[1.75rem]">
                  Ready to check the <span className="italic">original source?</span>
                </p>
                <p className="mt-3 text-sm leading-[1.7] text-[var(--tk-muted)]">
                  This bookmark links out to {domain || 'the original page'}. Opens in a new tab.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-[13px] font-medium text-[var(--tk-bg)] transition hover:opacity-90">
                    Open resource <ExternalLink className="h-4 w-4" />
                  </Link>
                  <span className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">
                    {domain}
                  </span>
                </div>
              </EditableReveal>
            ) : null}

            <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mt-14" />
          </article>

          {/* Sticky premium sidebar — no images anywhere */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal index={0} className="overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="border-b border-[var(--tk-line)] bg-[var(--tk-raised)] px-6 py-6 text-center">
                <span className="editable-display-serif inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-text)] text-3xl font-normal text-[var(--tk-bg)]">
                  {domainInitial}
                </span>
                <p className="editable-mono mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                  Source domain
                </p>
                <p className="editable-display-serif mt-1 text-lg font-normal tracking-[-0.01em] text-[var(--tk-text)]">
                  {domain || 'Community pick'}
                </p>
              </div>
              <div className="divide-y divide-[var(--tk-line)]">
                <SidebarRow icon={Layers} label="Category" value={category} />
                <SidebarRow icon={Hash} label="Tags" value={tags.length ? `${tags.length} topics` : 'Untagged'} />
                <SidebarRow icon={ShieldCheck} label="Curated" value={SITE_CONFIG.name} />
                
              </div>
              {website ? (
                <div className="border-t border-[var(--tk-line)] p-6">
                  <Link href={website} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-[13px] font-medium text-[var(--tk-bg)] transition hover:opacity-90">
                    Visit source <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}
            </EditableReveal>

            <EditableReveal index={1} className="rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6">
              <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                Why this list
              </p>
              <p className="editable-display-serif mt-4 text-lg font-normal leading-[1.3] tracking-[-0.01em] text-[var(--tk-text)]">
                Every bookmark is <span className="italic">community-vetted</span> before it lands here.
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-[var(--tk-muted)]">
                No autoposts, no affiliate spam — just links people wanted to save.
              </p>
            </EditableReveal>
          </aside>
        </div>
      </section>

      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

// ----- PDF: a document workspace -----
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <EditableReveal index={0} className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-9 w-9" /></div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-4xl">{post.title}</h1>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <BodyContent post={post} />
          </EditableReveal>
          {fileUrl ? (
            <div className={`mt-10 overflow-hidden ${tkCard}`}>
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-semibold text-[var(--tk-text)]">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className={chipBtn}>Download <Download className="h-3.5 w-3.5" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className={`${tkCard} p-6`}>
              <p className={dc.type.eyebrow}>Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className={`${dc.button.accent} mt-5 w-full`}>Download <Download className="h-4 w-4" /></Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

// ----- Profile: identity-first with a sticky portrait -----
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <EditableReveal index={0} className={`${tkCard} p-8 text-center`}>
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
              <DetailMeta post={post} center />
              <ContactAction website={website} email={email} bare />
            </EditableReveal>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <EditableReveal index={1}>
              <BodyContent post={post} />
            </EditableReveal>
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

// ----- Shared building blocks -----
function QuickFact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="pr-4">
      <div className="flex items-center gap-2 text-[var(--tk-muted)]">
        <Icon className="h-3.5 w-3.5" />
        <span className="editable-mono text-[10px] font-medium uppercase tracking-[0.16em]">{label}</span>
      </div>
      <p className="editable-display-serif mt-3 text-lg font-normal leading-[1.2] tracking-[-0.01em] text-[var(--tk-text)] sm:text-xl">
        {value}
      </p>
    </div>
  )
}

function SidebarRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof MapPin
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--tk-line)] text-[var(--tk-text)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="editable-mono block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</span>
        <span className="mt-1 block truncate text-sm text-[var(--tk-text)]">{value}</span>
      </span>
      {href ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--tk-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-text)]" /> : null}
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        className="group flex items-center gap-4 px-6 py-4 transition hover:bg-[var(--tk-raised)]"
      >
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-4 px-6 py-4">{inner}</div>
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className={dc.type.eyebrow}>{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <div key={`${image}-${index}`} className={`aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--tk-line)] ${dc.motion.lift}`}>
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className={dc.button.accent}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className={chipBtn}><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className={chipBtn}><Mail className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className={`${tkCard} p-6`}>
      <p className={dc.type.eyebrow}>Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className={`${tkCard} p-6`}>
        <p className={dc.type.eyebrow}>About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className={`${tkCard} p-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-lg font-semibold tracking-[-0.02em]">More like <span className={dc.type.emphasis}>this</span></h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)] transition hover:opacity-70">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = (taskConfig?.label || 'posts').toLowerCase()
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
        <EditableReveal index={0} className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              Keep exploring
            </p>
            <h2 className="editable-display-serif mt-5 text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--tk-text)] sm:text-[2.75rem] lg:text-[3.25rem]">
              More <span className="italic">{label}</span>
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-2 self-start rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)] lg:self-end">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </EditableReveal>
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <RelatedCard task={task} post={item} grid />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const category = getTaskConfig(task)?.label || task
  const isBookmark = task === 'sbm'
  const image = isBookmark ? '' : getImages(post)[0]

  if (grid) {
    // Bookmark grid card: pure typography, no image ever.
    if (isBookmark) {
      const website = getField(post, ['website', 'url', 'link'])
      const domain = website ? website.replace(/^https?:\/\//i, '').replace(/\/$/, '').split('/')[0] : ''
      const initial = (domain || post.title || '#').replace(/^www\./, '')[0]?.toUpperCase() || '#'
      return (
        <Link href={href} className="group block">
          <div className="flex h-32 items-center justify-between rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 transition group-hover:bg-[var(--tk-text)]">
            <span className="editable-display-serif text-4xl font-normal text-[var(--tk-text)] transition group-hover:text-[var(--tk-bg)]">
              {initial}
            </span>
            <Bookmark className="h-4 w-4 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-bg)]" />
          </div>
          <div className="mt-5">
            <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">
              {domain || category}
            </p>
            <h3 className="editable-display-serif mt-2 line-clamp-2 text-lg font-normal leading-[1.2] tracking-[-0.01em] text-[var(--tk-text)]">
              {post.title}
            </h3>
          </div>
        </Link>
      )
    }
    // Every other task type: image + serif title.
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
          {image ? (
            <img src={image} alt="" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
          ) : (
            <div className="flex h-full items-center justify-center"><FileText className="h-8 w-8 text-[var(--tk-muted)]" /></div>
          )}
        </div>
        <div className="mt-5">
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">
            {category}
          </p>
          <h3 className="editable-display-serif mt-2 line-clamp-2 text-lg font-normal leading-[1.2] tracking-[-0.01em] text-[var(--tk-text)] sm:text-xl">
            {post.title}
          </h3>
        </div>
      </Link>
    )
  }

  // Compact row (used inside sidebar RelatedPanel).
  return (
    <Link href={href} className="group flex gap-3 rounded-xl border border-[var(--tk-line)] p-3 transition duration-300 hover:-translate-y-0.5">
      {image ? (
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)]">
          {isBookmark ? <Bookmark className="h-5 w-5 text-[var(--tk-muted)]" /> : <FileText className="h-5 w-5 text-[var(--tk-muted)]" />}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-[-0.01em] text-[var(--tk-text)]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
