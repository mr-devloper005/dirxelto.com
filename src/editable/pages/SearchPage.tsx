import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search, SearchX } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'
import { formatRichHtml } from '@/components/shared/rich-content'

export const revalidate = 3

function pickRandom(sizes: string[]) {
  return sizes[Math.floor(Math.random() * sizes.length)]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost) => compactRaw(getContent(post).category) || post.tags?.[0] || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const category = categoryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <EditableReveal index={index % 6}>
      <Link href={href} className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
        <div className={`${dc.media.frame} ${dc.media.ratio}`}>
          {image ? (
            <img src={image} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center ${pal.mediaBg}`}>
              <Search className="h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] shadow-sm">
            {taskLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          {category ? <p className={dc.type.eyebrow}>{category}</p> : null}
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
            {post.title}
          </h2>
          {summary ? <div className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }} /> : null}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition group-hover:gap-2.5 group-hover:text-[var(--slot4-accent)]">
            View details <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className={pal.pageBg}>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
          <div className={`${dc.shell.section} pb-10 pt-16 sm:pt-20`}>
            <EditableReveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className={dc.type.eyebrow}>{pagesContent.search.hero.badge}</p>
                <h1 className={`mt-4 ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>{pagesContent.search.hero.title}</h1>
                <p className={`mx-auto mt-4 max-w-xl text-base ${pal.mutedText}`}>{pagesContent.search.hero.description}</p>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <form action="/search" className={`mx-auto mt-9 max-w-3xl rounded-2xl border ${pal.border} ${pal.surfaceBg} p-5 shadow-[0_20px_50px_-25px_rgba(26,23,18,0.25)] sm:p-6`}>
                <input type="hidden" name="master" value="1" />
                <label className={`flex items-center gap-3 rounded-xl border ${pal.border} px-4 py-3`}>
                  <Search className="h-4.5 w-4.5 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className={`flex items-center gap-2 rounded-xl border ${pal.border} px-4 py-3`}>
                    <Filter className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
                    <input
                      name="category"
                      defaultValue={category}
                      placeholder="Category"
                      className="min-w-0 flex-1 bg-transparent text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                    />
                  </label>
                  <select
                    name="task"
                    defaultValue={task}
                    className={`rounded-xl border ${pal.border} bg-transparent px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none`}
                  >
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                  <button type="submit" className={`${dc.button.primary} sm:px-7`}>
                    Search
                  </button>
                </div>
              </form>
            </EditableReveal>
          </div>
        </section>

        <section className={`pb-16 sm:pb-20 ${dc.shell.section}`}>
          <EditableReveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={dc.type.eyebrow}>{results.length} results</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">
                  {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
                </h2>
              </div>
              <Link href="/article" className={dc.button.secondary}>
                Browse latest <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <EditableReveal index={1}>
              <div className={`mt-8 rounded-2xl border border-dashed ${pal.border} ${pal.panelBg} p-12 text-center`}>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <SearchX className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">No matching posts found.</p>
                <p className={`mt-2 text-sm ${pal.mutedText}`}>Try a different keyword, content type, or category.</p>
              </div>
            </EditableReveal>
          )}

          <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="my-8" />
        </section>
      </main>
    </EditableSiteShell>
  )
}
